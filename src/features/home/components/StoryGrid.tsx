import { Fragment, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowPill } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n/useT";

const asset = (file: string) => `${import.meta.env.BASE_URL}assets/${file}`;

interface StoryPanel {
  id: string;
  title: ReactNode;
  body: string;
  cta: { label: string; to: string };
  tone: "sand" | "cocoa";
  image: { url: string; alt: string };
}

/** Renders "\n" in title copy as a line break on every screen size. */
function withBreaks(text: string) {
  return text.split("\n").map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {part}
    </Fragment>
  ));
}

/** Story panels, built from the active language's messages. */
function useStories(): StoryPanel[] {
  const { m } = useT();
  const copy = m.home.story;
  const title = (c: typeof copy.science) => (
    <>
      {c.line1}
      <br />
      {withBreaks(c.line2)} <em className="font-medium">{withBreaks(c.accent)}</em>
    </>
  );
  return [
    {
      id: "science",
      title: title(copy.science),
      body: copy.science.body,
      cta: { label: copy.science.cta, to: "/shop" },
      tone: "sand",
      image: { url: asset("story-duo.webp"), alt: copy.science.alt },
    },
    {
      id: "everyday",
      title: title(copy.everyday),
      body: copy.everyday.body,
      cta: { label: copy.everyday.cta, to: "/shop/body" },
      tone: "cocoa",
      image: { url: asset("story-rollon.webp"), alt: copy.everyday.alt },
    },
  ];
}

const toneClass = {
  sand: "bg-sand-300 text-cocoa-900",
  cocoa: "bg-cocoa-900 text-cream-50",
} as const;

/**
 * Desktop spec (≥1500px, both languages; start/end insets mirror in Arabic), measured on a 910×608 panel: heading at the
 * top (70px, 11.5%) with a 70px (7.7%) right inset, paragraph top at 370px
 * (60.9%), button 40px below the copy.
 * Positions are percentages of the panel height, so they scale with the panel.
 */
const SPEC_TEXT = "min-[1500px]:block min-[1500px]:p-0";
const SPEC_HEADING =
  "min-[1500px]:absolute min-[1500px]:start-20 min-[1500px]:end-[7.7%] min-[1500px]:top-[11.5%] 2xl:start-24";
const SPEC_BODY =
  "min-[1500px]:absolute min-[1500px]:inset-x-20 min-[1500px]:top-[60.9%] 2xl:inset-x-24";

function TextPanel({ story, className }: { story: StoryPanel; className?: string }) {
  const dark = story.tone === "cocoa";
  return (
    <div
      className={cn(
        // Heading, copy and CTA stay together as one block, centred against the image height.
        "relative flex h-full flex-col justify-center gap-8 rounded-[var(--radius-card)] p-8 sm:p-12 lg:h-auto lg:aspect-[910/608] lg:gap-10 lg:p-14 xl:px-20 2xl:gap-12 2xl:px-24",
        SPEC_TEXT,
        toneClass[story.tone],
        className,
      )}
    >
      <h2
        className={cn(
          "text-[clamp(2rem,3.6vw,4.75rem)] leading-[1] font-semibold tracking-[var(--tracking-display)] text-balance",
          SPEC_HEADING,
        )}
      >
        {story.title}
      </h2>
      <div className={cn("max-w-lg 2xl:max-w-xl", SPEC_BODY)}>
        <p
          className={cn(
            "max-w-lg text-[15px] leading-relaxed 2xl:max-w-xl",
            // The fixed layout keeps the copy a touch smaller until very wide screens.
            "2xl:text-base 3xl:text-[17px]",
            dark ? "text-cream-50/75" : "text-cocoa-700",
          )}
        >
          {story.body}
        </p>
        <Link
          to={story.cta.to}
          className={cn("group mt-7 inline-flex rounded-full", "min-[1500px]:mt-10")}
        >
          <ArrowPill tone={dark ? "light" : "dark"}>{story.cta.label}</ArrowPill>
        </Link>
      </div>
    </div>
  );
}

function ImagePanel({ story, className }: { story: StoryPanel; className?: string }) {
  return (
    <div
      className={cn(
        // Desktop: fills the row the 910×608 text panel sets (taller only if its copy needs it).
        "aspect-[1400/1032] overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-cream-200 lg:relative lg:aspect-auto lg:h-full",
        className,
      )}
    >
      <img
        src={story.image.url}
        alt={story.image.alt}
        width={1400}
        height={1032}
        loading="lazy"
        className="size-full object-cover object-top lg:absolute lg:inset-0"
      />
    </div>
  );
}

/**
 * Editorial checkerboard: image | text, then text | image on desktop.
 * On mobile each story stacks as image above its text.
 */
export function StoryGrid() {
  const [first, second] = useStories();
  const { m } = useT();
  return (
    <section aria-label={m.home.whyVerone} className="pt-16 sm:pt-20">
      <div className="grid w-full gap-4 px-4 lg:grid-cols-2 lg:px-6">
        <Reveal className="order-1">
          <ImagePanel story={first} />
        </Reveal>
        <Reveal delay={80} className="order-2">
          <TextPanel story={first} />
        </Reveal>
        <Reveal className="order-4 lg:order-3">
          <TextPanel story={second} />
        </Reveal>
        <Reveal delay={80} className="order-3 lg:order-4">
          <ImagePanel story={second} />
        </Reveal>
      </div>
    </section>
  );
}
