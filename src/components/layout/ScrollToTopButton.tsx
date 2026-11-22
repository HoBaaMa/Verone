import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useBarePathname } from "@/i18n/useLang";
import { useT } from "@/i18n/useT";
import { cn } from "@/lib/cn";

/** Fraction of the scrollable distance after which the button appears. */
const SHOW_AFTER = 0.45;

/**
 * Floating "back to top" button. Hidden on single product pages, where the
 * sticky purchase bar owns the bottom of the screen.
 */
export function ScrollToTopButton() {
  const { m } = useT();
  const pathname = useBarePathname();
  const onProductPage = pathname.startsWith("/product/");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (onProductPage) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrollable > 0 && window.scrollY / scrollable >= SHOW_AFTER);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onProductPage, pathname]);

  if (onProductPage) return null;

  const scrollToTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={m.common.backToTop}
      aria-hidden={!visible}
      tabIndex={visible ? undefined : -1}
      className={cn(
        // Opposite corner to the mobile filter button (bottom start).
        "fixed bottom-5 end-4 z-40 grid size-12 place-items-center rounded-full bg-cocoa-900 text-white shadow-[0_12px_28px_-10px_rgb(44_26_25/0.6)] transition-[opacity,translate,background-color] duration-300 ease-(--ease-out-soft) hover:bg-cocoa-700 active:scale-95 motion-reduce:transition-none lg:end-6 lg:bottom-6",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <ArrowUp className="size-5" strokeWidth={1.75} aria-hidden />
    </button>
  );
}
