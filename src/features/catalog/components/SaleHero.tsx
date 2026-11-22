import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import type { Product } from "@/types";
import { useProducts } from "@/features/catalog/hooks/useProducts";
import { ProductImage } from "@/features/product/components/ProductImage";
import { useMoney } from "@/lib/money";
import { discountPercent, pricePoint } from "@/lib/pricing";
import { useLocale } from "@/store/localeStore";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n/useT";

/** Muted brand tones that sit comfortably on the cocoa background. */
const BRAND_TONES: Record<string, string> = {
  Capixy: "#6e1f37",
  Vacation: "#2b5d8f",
  Soralone: "#1d3260",
};

/** Tag-shaped body: clipped top corners like a swing tag. */
const TAG_SHAPE = "polygon(20% 0, 80% 0, 100% 11%, 100% 100%, 0 100%, 0 11%)";

interface Deal {
  product: Product;
  discount: number;
}

/**
 * Hero for the Sale view: headline and per-brand deal pills on the left,
 * the two deepest discounts hanging as price tags that drop in on load.
 */
export function SaleHero() {
  const { m, fmt } = useT();
  const { data } = useProducts({ onSaleOnly: true, pageSize: 200 });
  const { currency } = useLocale();

  const { deals, brands, maxDiscount } = useMemo(() => {
    const deals: Deal[] = (data?.items ?? [])
      .map((product) => ({
        product,
        discount: discountPercent(pricePoint(product.prices, currency)),
      }))
      .filter((d) => d.discount > 0)
      .sort((a, b) => b.discount - a.discount || b.product.popularity - a.product.popularity);
    const byBrand = new Map<string, number>();
    for (const { product, discount } of deals)
      byBrand.set(product.brand, Math.max(byBrand.get(product.brand) ?? 0, discount));
    return {
      deals,
      brands: [...byBrand.entries()].sort((a, b) => b[1] - a[1]),
      maxDiscount: deals[0]?.discount ?? 0,
    };
  }, [data, currency]);

  const [first, second] = deals;
  const desktop = useMediaQuery("(min-width: 1024px)");

  // Drop the tags when they first come into view.
  const tagsRef = useRef<HTMLDivElement>(null);
  const [tagsInView, setTagsInView] = useState(false);
  useEffect(() => {
    const el = tagsRef.current;
    if (!el || tagsInView) return;
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setTagsInView(true), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [tagsInView, desktop]);

  const breadcrumb = (
    <nav aria-label={m.saleHero.breadcrumb}>
      <ol
        className={cn(
          "flex items-center text-cream-50/60",
          desktop ? "gap-1.5 text-[13px]" : "gap-2 text-[20px]",
        )}
      >
        <li>
          <Link to="/" className="transition-colors hover:text-cream-50">
            {m.common.home}
          </Link>
        </li>
        <li aria-hidden className="flex">
          <ChevronRight className={desktop ? "size-3.5" : "size-5"} />
        </li>
        <li aria-current="page" className="font-medium text-cream-50">
          {m.common.sale}
        </li>
      </ol>
    </nav>
  );

  const headline = (
    <>
      <h1
        className={cn(
          "leading-[0.95] font-semibold tracking-[var(--tracking-display)]",
          desktop ? "mt-5 text-[clamp(2.5rem,6vw,4.5rem)]" : "mt-7 text-[72px]",
        )}
      >
        {m.saleHero.titleLead}
        <br />
        <span className="text-sand-400">{m.saleHero.titleAccent}</span>
      </h1>
      <p
        className={cn(
          "font-medium tracking-wide text-cream-50/80 uppercase",
          desktop ? "mt-5 text-[15px]" : "mt-6 text-[26px]",
        )}
      >
        {maxDiscount > 0 ? fmt(m.saleHero.upTo, { pct: maxDiscount }) : m.saleHero.limited}
      </p>
    </>
  );

  const pills = brands.length > 0 && (
    <div className={desktop ? "mt-9" : "mt-10"}>
      <p
        className={cn(
          "font-semibold text-cream-50/55 uppercase",
          desktop ? "text-[11px] tracking-[0.24em]" : "text-[17px] tracking-[0.22em]",
        )}
      >
        {m.saleHero.dealsByBrand}
      </p>
      <ul
        className={cn(
          desktop
            ? "mt-4 flex flex-wrap gap-3"
            : // Mobile board: three rows, extra brands flow into a new column.
              "mt-5 grid auto-cols-max grid-flow-col grid-rows-3 gap-3.5",
        )}
      >
        {brands.map(([brand, discount]) => (
          <li key={brand}>
            <Link
              to={`/shop?sale=1&brand=${encodeURIComponent(brand)}`}
              className={cn(
                "group inline-flex items-center rounded-full ring-1 ring-white/15 transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-12px_rgb(0_0_0/0.6)] focus-visible:outline-cream-50",
                desktop ? "h-12 gap-4 py-1.5 ps-5 pe-1.5" : "h-[66px] gap-5 py-2 ps-7 pe-2",
              )}
              style={{ backgroundColor: BRAND_TONES[brand] ?? "var(--color-cocoa-700)" }}
            >
              <span
                className={cn(
                  "font-semibold tracking-tight",
                  desktop ? "text-[15px]" : "text-[26px]",
                )}
              >
                {brand}
              </span>
              <span
                className={cn(
                  "rounded-full bg-white/15 font-bold tabular-nums transition-colors group-hover:bg-white/25",
                  desktop ? "px-3 py-1.5 text-[12px]" : "px-4 py-2.5 text-[20px]",
                )}
              >
                {fmt(m.saleHero.upToShort, { pct: discount })}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  const tags = (
    <div
      ref={tagsRef}
      className={cn("relative flex items-start justify-center", desktop ? "gap-6 pe-12" : "gap-5")}
    >
      {first && (
        <PriceTag deal={first} tilt={-3} delay={150} dropped={tagsInView} board={!desktop} />
      )}
      {second && (
        <PriceTag
          deal={second}
          tilt={4}
          delay={420}
          dropped={tagsInView}
          board={!desktop}
          className="mt-20"
        />
      )}
    </div>
  );

  return (
    <section className="relative isolate w-full overflow-hidden bg-cocoa-900 text-cream-50 lg:py-3.5">
      {/* Warm ambient glows */}
      <div
        aria-hidden
        className="absolute -top-40 -end-24 -z-10 size-[520px] rounded-full bg-[#7a3328]/45 blur-[120px]"
      />
      <div
        aria-hidden
        className="absolute -bottom-48 -start-32 -z-10 size-[460px] rounded-full bg-sand-400/20 blur-[120px]"
      />

      {desktop ? (
        <div className="mx-auto grid min-h-[460px] max-w-[1600px] grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-4">
          <div className="flex min-w-0 flex-col justify-center px-14 py-14">
            {breadcrumb}
            {headline}
            {pills}
          </div>
          {tags}
        </div>
      ) : (
        // Below lg: the side-by-side composition on a fixed board, scaled to the
        // screen width like the home banner artwork (no swipe, no dots).
        <ScaledBoard width={BOARD_WIDTH}>
          <div className="grid grid-cols-[minmax(0,1fr)_420px] gap-6 px-12 pt-12 pb-14">
            <div className="flex min-w-0 flex-col justify-center">
              {breadcrumb}
              {headline}
              {pills}
            </div>
            {tags}
          </div>
        </ScaledBoard>
      )}
    </section>
  );
}

/** Design width of the mobile sale board, in CSS px before scaling. */
const BOARD_WIDTH = 960;

/** Renders children at a fixed design width and zooms them to fit the available width. */
function ScaledBoard({ width, children }: { width: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / width);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);
  return (
    <div ref={ref} className="w-full">
      {/* `zoom` scales layout too, so the section's height follows the board. */}
      <div style={{ width, zoom: scale || undefined, visibility: scale ? undefined : "hidden" }}>
        {children}
      </div>
    </div>
  );
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

function PriceTag({
  deal,
  tilt,
  delay,
  dropped,
  board,
  className,
}: {
  deal: Deal;
  tilt: number;
  delay: number;
  /** Fixed sizing for the scaled mobile board (no viewport breakpoints). */
  board?: boolean;
  /** Starts the drop-in once the tag area is visible; hidden until then. */
  dropped: boolean;
  className?: string;
}) {
  const money = useMoney();
  const { m, fmt } = useT();
  const { currency } = useLocale();
  const { product, discount } = deal;
  const { price, compareAtPrice = price } = pricePoint(product.prices, currency);

  return (
    <div
      className={cn(
        "relative origin-top motion-reduce:animate-none motion-reduce:opacity-100",
        dropped ? "animate-tag-drop" : "opacity-0",
        board ? "pt-10" : "pt-12",
        className,
      )}
      style={
        {
          "--tag-tilt": `${tilt}deg`,
          rotate: `${tilt}deg`,
          animationDelay: `${delay}ms`,
        } as CSSProperties
      }
    >
      {/* String, running up past the top edge */}
      <span
        aria-hidden
        className={cn(
          "absolute left-1/2 h-[480px] w-px -translate-x-1/2 bg-cream-50/35",
          board ? "bottom-[calc(100%-3.1rem)]" : "bottom-[calc(100%-3.6rem)]",
        )}
      />

      <Link
        to={`/product/${product.slug}`}
        aria-label={fmt(m.saleHero.tagLabel, {
          brand: product.brand,
          name: product.name,
          pct: discount,
          price: money(price),
        })}
        className={cn(
          "group relative block drop-shadow-[0_24px_30px_rgb(0_0_0/0.45)]",
          board ? "w-[200px]" : "w-[220px]",
        )}
      >
        <div
          className="flex flex-col items-center bg-cream-50 px-5 pt-9 pb-5 text-center text-cocoa-900"
          style={{ clipPath: TAG_SHAPE }}
        >
          {/* Eyelet */}
          <span
            aria-hidden
            className="absolute top-3 left-1/2 size-3.5 -translate-x-1/2 rounded-full bg-cocoa-900 ring-[3px] ring-sand-300"
          />
          <p
            className={cn(
              "font-semibold tracking-[0.3em] text-cocoa-700 uppercase",
              board ? "text-[14px]" : "text-[11px]",
            )}
          >
            {product.brand}
          </p>
          <div className="mt-3 h-28 w-full">
            <ProductImage
              image={product.images[0]}
              fallbackLabel={product.name}
              decorative
              className="mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <p
            className={cn(
              "mt-3 line-clamp-2 min-h-[2.5em] leading-tight font-medium",
              board ? "text-[17px]" : "text-[14px]",
            )}
          >
            {product.name}
          </p>
          <div className="mt-3 w-full border-t border-dashed border-sand-400 pt-3">
            <p
              className={cn(
                "text-taupe-500 tabular-nums line-through",
                board ? "text-[16px]" : "text-[13px]",
              )}
            >
              {money(compareAtPrice)}
            </p>
            <p
              className={cn(
                "leading-tight font-bold tabular-nums",
                board ? "text-[30px]" : "text-[24px]",
              )}
            >
              {money(price)}
            </p>
            <p
              className={cn(
                "mt-2 inline-block rounded-full bg-cream-200 px-2.5 py-1 font-semibold text-cocoa-700 tabular-nums",
                board ? "text-[15px]" : "text-[12px]",
              )}
            >
              {fmt(m.saleHero.save, { amount: money(compareAtPrice - price) })}
            </p>
          </div>
        </div>

        {/* Discount roundel */}
        <span
          aria-hidden
          className={cn(
            "absolute top-16 -end-6 grid rotate-12 place-items-center rounded-full bg-sale font-bold text-white shadow-lg ring-4 ring-sale/30",
            board ? "size-[72px] text-[19px]" : "size-16 text-[16px]",
          )}
        >
          <span
            dir="ltr"
            className="grid size-[calc(100%-6px)] place-items-center rounded-full border border-dashed border-white/70"
          >
            -{discount}%
          </span>
        </span>
      </Link>
    </div>
  );
}
