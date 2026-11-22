import { useDir } from "@/i18n/useLang";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import type { ConcernTile } from "@/types";
import { contentService } from "@/services";
import { useAsync } from "@/lib/useAsync";
import { cn } from "@/lib/cn";
import { useLang } from "@/i18n/useLang";
import { useT } from "@/i18n/useT";

const TILE =
  "relative block aspect-[4/5] w-[240px] shrink-0 sm:w-[300px] lg:w-[360px] 2xl:w-[400px]";

/**
 * "Shop now" stays visible on touch screens; on hover-capable pointers it
 * fades in when the tile is hovered or keyboard-focused.
 */
const REVEAL_ON_HOVER =
  "[@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:translate-y-0 [@media(hover:hover)]:group-focus-visible:opacity-100";

function Tile({ tile, hidden }: { tile: ConcernTile; hidden?: boolean }) {
  const { m, fmt } = useT();
  const dir = useDir();
  return (
    <li dir={dir} className="shrink-0 border-e border-white">
      <Link
        to={tile.href}
        tabIndex={hidden ? -1 : undefined}
        aria-label={hidden ? undefined : fmt(m.home.shopTile, { label: tile.label })}
        className={cn(
          TILE,
          "group overflow-hidden bg-cream-100 focus-visible:outline-offset-[-4px]",
        )}
      >
        <img
          src={tile.image.url}
          alt={hidden ? "" : tile.image.alt}
          width={640}
          height={960}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 size-full object-cover object-top transition-transform duration-700 ease-(--ease-out-soft) select-none group-hover:scale-[1.04] motion-reduce:transition-none"
        />
        {/* Soft top wash keeps the white label legible on bright photography. */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-cocoa-900/45 via-cocoa-900/15 to-transparent"
        />
        <span className="absolute top-6 start-6 end-6 text-[22px] leading-tight font-semibold tracking-[-0.02em] text-white drop-shadow-[0_1px_8px_rgb(44_26_25/0.35)] lg:top-8 lg:start-7 lg:text-[26px]">
          {tile.label}
        </span>
        <span
          aria-hidden
          className={cn(
            "absolute bottom-6 start-6 inline-flex h-10 items-center gap-3 rounded-full bg-white py-1 pe-5 ps-1 text-[11px] font-semibold tracking-[0.14em] text-cocoa-900 uppercase shadow-soft transition-[opacity,translate] duration-300 ease-(--ease-out-soft) motion-reduce:transition-none lg:start-7",
            REVEAL_ON_HOVER,
          )}
        >
          <span className="grid size-8 place-items-center rounded-full bg-cocoa-900 text-white">
            <ArrowRight className="size-3.5" strokeWidth={2} />
          </span>
          {m.home.shopNow}
        </span>
      </Link>
    </li>
  );
}

function Sequence({ tiles, hidden }: { tiles: ConcernTile[]; hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className={cn("flex shrink-0", hidden && "motion-reduce:hidden")}
    >
      {tiles.map((tile, i) => (
        <Tile key={`${tile.id}-${i}`} tile={tile} hidden={hidden || i >= tiles.length / 2} />
      ))}
    </ul>
  );
}

/**
 * Continuous right-to-left strip of concern tiles. It intentionally keeps moving
 * under the mouse; it only pauses while a tile has keyboard focus. Each half of
 * the track repeats the tiles twice so it overfills wide screens and the -50%
 * marquee keyframe loops seamlessly. Reduced motion shows one scrollable row.
 */
export function ConcernMarquee() {
  const lang = useLang();
  const { m } = useT();
  const { data: tiles } = useAsync(() => contentService.getConcernTiles(lang), [lang]);
  const doubled = tiles ? [...tiles, ...tiles] : [];

  return (
    <section aria-labelledby="concern-heading" className="pt-16 sm:pt-20">
      <div className="mb-8 px-4 sm:mb-10 lg:px-6">
        <h2
          id="concern-heading"
          className="text-[clamp(2.25rem,5vw,3.75rem)] leading-[0.95] font-semibold tracking-[var(--tracking-display)] text-cocoa-900"
        >
          {m.home.concernLead}{" "}
          <em className="font-medium text-taupe-600">{m.home.concernAccent}</em>
        </h2>
      </div>

      <div dir="ltr" className="w-full overflow-hidden motion-reduce:overflow-x-auto">
        {tiles && tiles.length > 0 ? (
          <div
            className="flex w-max animate-marquee has-[:focus-visible]:[animation-play-state:paused] motion-reduce:animate-none"
            style={{ animationDuration: `${tiles.length * 12}s` }}
          >
            <Sequence tiles={doubled} />
            <Sequence tiles={doubled} hidden />
          </div>
        ) : (
          <div className="flex">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className={cn(TILE, "animate-pulse border-e border-white bg-cream-200/70")}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
