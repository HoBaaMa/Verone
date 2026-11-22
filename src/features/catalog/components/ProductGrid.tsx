import { useT } from "@/i18n/useT";
import { Fragment, type ReactNode } from "react";
import type { Product } from "@/types";
import { Reveal, staggerDelay } from "@/components/ui/Reveal";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";
import { ProductCard } from "./ProductCard";

const columnClasses = {
  3: "grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
  /** Full-width catalog beside the filter sidebar: grows with the viewport. */
  "fluid-sidebar": "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-6",
  /** Full-width catalog with the sidebar hidden. */
  fluid: "grid-cols-2 lg:grid-cols-4 xl:grid-cols-6",
};

export type GridColumns = keyof typeof columnClasses;

interface ProductGridProps {
  products: Product[];
  columns?: GridColumns;
  /** Full-width content inserted after the given number of products. */
  interstitial?: { after: number; content: ReactNode };
}

export function ProductGrid({ products, columns = 3, interstitial }: ProductGridProps) {
  return (
    <div className={cn("grid gap-x-3 gap-y-10 sm:gap-x-4", columnClasses[columns])}>
      {products.map((product, index) => (
        <Fragment key={product.id}>
          <Reveal
            className="grid"
            delay={staggerDelay(index, typeof columns === "number" ? columns : 4)}
          >
            <ProductCard product={product} />
          </Reveal>
          {interstitial &&
            index + 1 === interstitial.after &&
            products.length > interstitial.after && (
              <Reveal className="col-span-full">{interstitial.content}</Reveal>
            )}
        </Fragment>
      ))}
    </div>
  );
}

export function ProductGridSkeleton({
  count = 6,
  columns = 3,
}: {
  count?: number;
  columns?: GridColumns;
}) {
  const { m } = useT();
  return (
    <div
      className={cn("grid gap-x-3 gap-y-10 sm:gap-x-4", columnClasses[columns])}
      aria-busy="true"
      aria-label={m.common.loading}
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[4/5] rounded-[var(--radius-card)]" />
          <Skeleton className="mx-auto mt-4 h-4 w-2/3" />
          <Skeleton className="mx-auto mt-2 h-3 w-1/3" />
          <Skeleton className="mt-4 h-9 rounded-full" />
        </div>
      ))}
    </div>
  );
}
