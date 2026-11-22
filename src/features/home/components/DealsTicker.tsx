import { useDir } from "@/i18n/useLang";
import { Sparkle } from "lucide-react";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n/useT";

/** Repeats per half; enough to overfill ultra-wide screens. */
const REPEATS = 8;

function Run({ hidden, message }: { hidden?: boolean; message: string }) {
  const dir = useDir();
  return (
    <div aria-hidden className={cn("flex shrink-0 items-center", hidden && "motion-reduce:hidden")}>
      {Array.from({ length: REPEATS }, (_, i) => (
        <span key={i} className="flex shrink-0 items-center">
          {/* The track is LTR for the loop; the message itself follows the page direction. */}
          <span dir={dir} className="px-6 whitespace-nowrap sm:px-8">
            {message}
          </span>
          <Sparkle className="size-3.5 shrink-0 fill-current text-sand-400" strokeWidth={0} />
        </span>
      ))}
    </div>
  );
}

/**
 * Decorative, continuously scrolling promo strip. The track holds two
 * identical halves so the -50% marquee keyframe loops without a seam.
 */
export function DealsTicker() {
  const { m } = useT();
  return (
    <section
      dir="ltr"
      aria-label={m.home.ticker}
      className="mt-12 w-full overflow-hidden bg-cocoa-900 sm:mt-16 text-cream-50"
    >
      <div
        className="flex w-max animate-marquee py-4 text-[clamp(1.125rem,2vw,1.5rem)] font-semibold tracking-[-0.02em] motion-reduce:animate-none sm:py-5"
        style={{ animationDuration: "40s" }}
      >
        <Run message={m.home.ticker} />
        <Run hidden message={m.home.ticker} />
      </div>
    </section>
  );
}
