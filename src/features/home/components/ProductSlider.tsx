import { useId } from "react";
import { Link } from "@/i18n/navigation";
import type { ProductQuery } from "@/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { Skeleton } from "@/components/ui/Skeleton";
import { ProductCard } from "@/features/catalog/components/ProductCard";
import { useProducts } from "@/features/catalog/hooks/useProducts";
import { useScrollCarousel } from "@/lib/useScrollCarousel";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n/useT";

const CARD_WIDTH = "w-[210px] shrink-0 snap-start lg:w-[270px]";

interface ProductSliderProps {
  lead: string;
  muted: string;
  query: ProductQuery;
  viewAllHref: string;
  /** Upper bound on cards shown. */
  maxItems: number;
  className?: string;
}

/** Catalog query rendered as a bleed-right, swipeable product slider. */
export function ProductSlider({
  lead,
  muted,
  query,
  viewAllHref,
  maxItems,
  className,
}: ProductSliderProps) {
  const headingId = useId();
  const { m } = useT();
  const { data } = useProducts({ ...query, pageSize: maxItems });
  const products = data?.items.slice(0, maxItems);
  const { trackProps, progress, dragging, scrollByCards } = useScrollCarousel([products?.length]);

  const arrowClass =
    "grid size-8 place-items-center rounded-full transition-colors hover:bg-cream-100 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <section
      aria-labelledby={headingId}
      className={cn("w-full overflow-hidden py-10 ps-4 lg:ps-6", className)}
    >
      <div className="mb-10 flex items-end justify-between gap-4 pe-4 lg:pe-6">
        <div id={headingId}>
          <DisplayHeading lead={lead} muted={muted} />
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <Link
            to={viewAllHref}
            className="hidden text-sm font-medium underline underline-offset-4 hover:text-cocoa-700 sm:inline"
          >
            {m.common.viewAll}
          </Link>
          <div
            role="group"
            aria-label={m.home.sliderControls}
            className="flex shrink-0 items-center gap-2 rounded-full border border-sand-400 px-2 py-1.5"
          >
            <button
              type="button"
              className={arrowClass}
              onClick={() => scrollByCards(-1, 2)}
              disabled={progress.atStart}
              aria-label={m.home.previousProducts}
            >
              <ArrowLeft className="size-[18px]" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              className={arrowClass}
              onClick={() => scrollByCards(1, 2)}
              disabled={progress.atEnd}
              aria-label={m.home.nextProducts}
            >
              <ArrowRight className="size-[18px]" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>

      <div
        {...trackProps}
        className={cn(
          "relative flex gap-5 overflow-x-auto overscroll-x-contain pe-4 pb-1 [scrollbar-width:none] lg:pe-6 [&::-webkit-scrollbar]:hidden",
          dragging ? "cursor-grabbing snap-none select-none" : "snap-x snap-mandatory",
        )}
      >
        {products
          ? products.map((product) => (
              <div
                key={product.id}
                data-card
                className={cn(CARD_WIDTH, "flex flex-col [&>article]:flex-1")}
              >
                <ProductCard product={product} variant="slider" />
              </div>
            ))
          : Array.from({ length: 5 }, (_, i) => (
              <div key={i} className={CARD_WIDTH}>
                <Skeleton className="aspect-square rounded-xl" />
                <Skeleton className="mt-3 h-3 w-16" />
                <Skeleton className="mt-2 h-4 w-3/4" />
                <Skeleton className="mt-3 h-10 rounded-full" />
              </div>
            ))}
      </div>

      <div className="mt-6 pe-4 lg:pe-6">
        <div className="relative h-[2px] overflow-hidden rounded-full bg-sand-300" aria-hidden>
          <div
            className="absolute inset-y-0 rounded-full bg-cocoa-900 transition-[inset-inline-start,width] duration-150 ease-out"
            style={{ insetInlineStart: `${progress.offset}%`, width: `${progress.size}%` }}
          />
        </div>
      </div>
    </section>
  );
}
