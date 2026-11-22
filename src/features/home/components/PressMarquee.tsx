import type { PressMention, WordmarkStyle } from "@/types";
import { pressService } from "@/services";
import { useAsync } from "@/lib/useAsync";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n/useT";

/** Typeset wordmarks sized to a similar optical height. Swap for SVG logos when available. */
const wordmarkStyles: Record<WordmarkStyle, string> = {
  serif: "font-serif text-xl tracking-[0.06em] sm:text-2xl",
  "serif-italic": "font-serif text-xl italic tracking-tight sm:text-2xl",
  "sans-bold": "text-lg font-bold tracking-[0.04em] sm:text-xl",
  "sans-wide": "text-xs font-semibold tracking-[0.28em] sm:text-sm",
  "sans-light": "text-lg font-light tracking-tight sm:text-xl",
};

function Sequence({ mentions, hidden }: { mentions: PressMention[]; hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className={cn(
        "flex shrink-0 items-center gap-12 pe-12 sm:gap-20 sm:pe-20",
        hidden && "motion-reduce:hidden",
      )}
    >
      {mentions.map((mention) => (
        <li key={mention.id} className="flex h-8 shrink-0 items-center">
          <span
            role="img"
            aria-label={hidden ? undefined : mention.name}
            className={cn(
              "leading-none whitespace-nowrap text-cocoa-900/80 select-none",
              wordmarkStyles[mention.style],
            )}
          >
            {mention.wordmark ?? mention.name}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Continuous right-to-left logo strip. The track contains the sequence four
 * times (two identical halves) so it always overfills wide screens and the
 * -50% keyframe loops without a visible seam. Reduced motion shows one static,
 * scrollable row.
 */
export function PressMarquee() {
  const { data: mentions } = useAsync(() => pressService.getPressMentions(), []);
  const { m } = useT();

  return (
    <section
      dir="ltr"
      aria-label={m.home.press}
      className="w-full overflow-hidden border-b border-cream-200 bg-white py-6 motion-reduce:overflow-x-auto sm:py-8"
    >
      {mentions && mentions.length > 0 ? (
        <div
          className="flex w-max animate-marquee motion-reduce:animate-none"
          style={{ animationDuration: "45s" }}
        >
          <Sequence mentions={mentions} />
          <Sequence mentions={mentions} hidden />
          <Sequence mentions={mentions} hidden />
          <Sequence mentions={mentions} hidden />
        </div>
      ) : (
        <div className="h-8" aria-hidden />
      )}
    </section>
  );
}
