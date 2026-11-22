import { Star } from "lucide-react";
import type { Category, Product } from "@/types";
import { Price } from "@/components/ui/Price";
import { discountPercent, useLocalPrice } from "@/lib/pricing";
import { ProductPurchase } from "./ProductPurchase";
import { useT } from "@/i18n/useT";

export function ProductSummary({
  product,
  category,
}: {
  product: Product;
  category: Category | null | undefined;
}) {
  const discount = discountPercent(useLocalPrice(product.prices));
  const { m, fmt } = useT();
  const labels = [
    product.isBestSeller && m.product.bestSeller,
    product.isNew && m.product.new,
  ].filter(Boolean) as string[];

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-1.5">
        {category && (
          <span className="me-1.5 text-xs font-medium tracking-[0.18em] text-taupe-500 uppercase">
            {category.name}
          </span>
        )}
        {labels.map((label) => (
          <span
            key={label}
            className="rounded-full bg-cream-100 px-2.5 py-1 text-[11px] font-medium"
          >
            {label}
          </span>
        ))}
        {discount > 0 && (
          <span
            dir="ltr"
            className="rounded-full bg-sale px-2 py-1 text-[11px] font-medium text-white tabular-nums"
          >
            -{discount}%
          </span>
        )}
      </div>

      <h1 className="mt-4 text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[0.95] font-semibold tracking-[var(--tracking-display)]">
        <span className="uppercase">{product.brand}</span> {product.name}
      </h1>
      <p className="mt-3 text-lg tracking-tight text-taupe-600">{product.subtitle}</p>

      {product.reviewCount > 0 && (
        <p className="mt-4 flex items-center gap-1.5 text-[13px] text-taupe-600">
          <Star className="size-3.5 fill-cocoa-900 text-cocoa-900" aria-hidden />
          <span className="font-medium text-cocoa-900 tabular-nums">
            {product.rating.toFixed(1)}
          </span>
          <span aria-hidden>·</span>
          <span className="tabular-nums">
            {fmt(m.product.reviews, { count: product.reviewCount })}
          </span>
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-y border-cream-200 py-5">
        <Price prices={product.prices} align="start" size="lg" />
        {product.size && <span className="text-[13px] text-taupe-500">{product.size}</span>}
        <span className="ms-auto text-[13px] font-medium">
          {product.inStock ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#5b8a5a]" aria-hidden />{" "}
              {m.product.inStock}
            </span>
          ) : (
            <span className="text-taupe-500">{m.product.outOfStock}</span>
          )}
        </span>
      </div>

      {product.description && (
        <p className="mt-6 text-[15px] leading-relaxed text-cocoa-800">{product.description}</p>
      )}

      <div className="mt-8">
        <ProductPurchase key={product.id} product={product} />
      </div>
    </div>
  );
}
