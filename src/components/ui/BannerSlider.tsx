import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { Link } from "@/i18n/navigation";
import type { HeroSlide } from "@/types";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n/useT";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia(REDUCED_MOTION).matches);
  useEffect(() => {
    const mq = window.matchMedia(REDUCED_MOTION);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

interface BannerSliderProps {
  slides: HeroSlide[];
  /** Autoplay delay per slide, in ms. */
  interval?: number;
  label?: string;
}

/**
 * Full-width, image-only banner carousel. Slides horizontally, loops forward
 * seamlessly (via a trailing clone of the first slide), pauses under the
 * mouse or keyboard focus, and restarts its timer after manual navigation.
 */
export function BannerSlider({ slides, interval = 5000, label }: BannerSliderProps) {
  const { m, fmt } = useT();
  const count = slides.length;
  const loops = count > 1;
  const reducedMotion = usePrefersReducedMotion();

  // `position` can equal `count` (the clone) mid-wrap; the visible slide is position % count.
  const [position, setPosition] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  // Bumped on manual navigation so the autoplay timer restarts even when position doesn't change.
  const [timerKey, setTimerKey] = useState(0);
  const active = count ? position % count : 0;

  const next = useCallback(() => {
    setAnimate(true);
    setPosition((p) => (reducedMotion ? (p + 1) % count : Math.min(p + 1, count)));
  }, [count, reducedMotion]);

  const goTo = (index: number) => {
    setAnimate(true);
    setPosition(index);
    setTimerKey((k) => k + 1);
  };

  // Autoplay: one timeout per slide, rescheduled whenever the slide or pause state changes.
  useEffect(() => {
    if (!loops || paused || reducedMotion) return;
    const id = window.setTimeout(next, interval);
    return () => window.clearTimeout(id);
  }, [loops, paused, reducedMotion, next, interval, position, timerKey]);

  // After snapping back from the clone without a transition, re-enable it on the next paint.
  useEffect(() => {
    if (animate) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setAnimate(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [animate]);

  const onTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target !== e.currentTarget || position !== count) return;
    setAnimate(false);
    setPosition(0);
  };

  if (count === 0) return null;

  const first = slides[0];
  const firstMobile = first.mobileImage ?? first.image;
  const frameStyle = {
    "--banner-ar": `${first.image.width} / ${first.image.height}`,
    "--banner-ar-mobile": `${firstMobile.width} / ${firstMobile.height}`,
  } as CSSProperties;

  const track = loops ? [...slides, slides[0]] : slides;

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label ?? m.home.featured}
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
      onFocus={(e) => e.target.matches(":focus-visible") && setPaused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setPaused(false)}
      className="relative w-full overflow-hidden bg-neutral-950"
    >
      <div
        style={frameStyle}
        className="relative w-full aspect-(--banner-ar-mobile) md:aspect-(--banner-ar)"
      >
        <div
          // The track translates leftward per slide; keep it LTR on Arabic pages too.
          dir="ltr"
          onTransitionEnd={onTransitionEnd}
          className={cn(
            "flex h-full",
            animate && !reducedMotion && "transition-transform duration-700 ease-(--ease-out-soft)",
          )}
          style={{ transform: `translateX(-${position * 100}%)` }}
        >
          {track.map((slide, index) => {
            const isClone = index === count;
            const isCurrent = index === position;
            return (
              <Link
                key={isClone ? `${slide.id}-clone` : slide.id}
                to={slide.href}
                aria-hidden={!isCurrent || undefined}
                tabIndex={isCurrent ? undefined : -1}
                aria-roledescription={isClone ? undefined : "slide"}
                aria-label={
                  isClone
                    ? undefined
                    : fmt(m.home.slideOf, { index: index + 1, count, label: slide.alt })
                }
                className="block size-full shrink-0 basis-full focus-visible:outline-offset-[-4px] focus-visible:outline-white"
              >
                <picture>
                  {slide.mobileImage && (
                    <source
                      media="(max-width: 767px)"
                      srcSet={slide.mobileImage.url}
                      width={slide.mobileImage.width}
                      height={slide.mobileImage.height}
                    />
                  )}
                  <img
                    src={slide.image.url}
                    alt={isClone ? "" : slide.alt}
                    width={slide.image.width}
                    height={slide.image.height}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : undefined}
                    draggable={false}
                    className="size-full object-cover select-none"
                  />
                </picture>
              </Link>
            );
          })}
        </div>
      </div>

      {loops && (
        <div className="absolute inset-x-0 bottom-1.5 flex justify-center md:bottom-4">
          <div className="flex items-center rounded-full bg-black/25 px-1 backdrop-blur-sm">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={fmt(m.home.goToSlide, { index: index + 1 })}
                aria-current={index === active ? "true" : undefined}
                className="group grid h-6 min-w-6 place-items-center rounded-full px-1 focus-visible:outline-white"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none",
                    index === active ? "w-6 bg-white" : "w-1.5 bg-white/40 group-hover:bg-white/70",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
