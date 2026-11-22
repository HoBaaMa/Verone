import { useState } from "react";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/types";
import { Price } from "@/components/ui/Price";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { QuantityStepper } from "@/features/cart/components/QuantityStepper";
import { WishlistButton } from "@/features/wishlist/components/WishlistButton";
import { useWishlistStore } from "@/store/wishlistStore";
import { discountPercent, useLocalPrice } from "@/lib/pricing";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n/useT";

interface ProductCardProps {
  product: Product;
  /** `grid`: 4:5 listing card. `slider`: square image for carousels. */
  variant?: "grid" | "slider";
}

/** Hover-capable pointers reveal these on hover or keyboard focus; touch screens always see them. */
const REVEAL_HIDDEN = "[@media(hover:hover)]:pointer-events-none [@media(hover:hover)]:opacity-0";
const REVEAL_SHOWN =
  "[@media(hover:hover)]:group-hover:pointer-events-auto [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:pointer-events-auto [@media(hover:hover)]:group-focus-within:opacity-100";

const ADD_TO_CART =
  "h-11 rounded-full text-[12px] font-semibold tracking-[0.06em] whitespace-nowrap uppercase gap-2 shadow-[0_10px_24px_-12px_rgb(44_26_25/0.55)]";

export function ProductCard({ product, variant = "grid" }: ProductCardProps) {
  const { m } = useT();
  const [quantity, setQuantity] = useState(1);
  const saved = useWishlistStore((s) => s.ids.includes(product.id));
  const discount = discountPercent(useLocalPrice(product.prices));
  const [primary, secondary] = product.images;
  const href = `/product/${product.slug}`;

  return (
    <article className="group @container relative flex flex-col">
      <div
        className={cn(
          "relative overflow-hidden rounded-[var(--radius-card)] bg-gradient-to-b from-white via-cream-50 to-cream-200 ring-1 ring-cream-200/80",
          variant === "slider" ? "aspect-square" : "aspect-[4/5]",
        )}
      >
        <Link to={href} className="absolute inset-0 block" tabIndex={-1} aria-hidden>
          {/* Product shots sit on white; multiply lets the card's gradient show through. */}
          <img
            src={primary?.url}
            alt=""
            loading="lazy"
            className={cn(
              "absolute inset-0 size-full object-contain mix-blend-multiply transition-[scale,opacity] duration-700 ease-out group-hover:scale-[1.04]",
              secondary && "group-hover:opacity-0",
            )}
          />
          {secondary && (
            <img
              src={secondary.url}
              alt=""
              loading="lazy"
              className="absolute inset-0 size-full object-contain opacity-0 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-100"
            />
          )}
          {!product.inStock && <div className="absolute inset-0 bg-cream-50/50" />}
        </Link>

        <div className="pointer-events-none absolute top-3 start-3 flex flex-col items-start gap-1.5">
          {discount > 0 && (
            <span
              dir="ltr"
              className="rounded-full bg-sale px-2.5 py-1 text-[12px] font-semibold text-white tabular-nums shadow-[0_6px_14px_-6px_rgb(214_40_40/0.7)]"
            >
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-cocoa-900 shadow-sm">
              {m.product.new}
            </span>
          )}
        </div>

        <WishlistButton
          product={product}
          className={cn(
            "absolute top-3 end-3 bg-white! shadow-[0_6px_16px_-8px_rgb(44_26_25/0.45)] transition-opacity duration-300",
            !saved && REVEAL_HIDDEN,
            !saved && REVEAL_SHOWN,
          )}
        />

        {!product.inStock && (
          <span className="absolute bottom-3 start-3 rounded-full bg-cocoa-900 px-2.5 py-1 text-[11px] font-medium text-white">
            {m.product.outOfStock}
          </span>
        )}

        {/* Hover purchase bar (mouse/trackpad only; touch gets the button below). */}
        {product.inStock && (
          <div className="absolute inset-x-3 bottom-3 hidden translate-y-3 items-center gap-2 opacity-0 transition-[opacity,translate] duration-300 ease-(--ease-out-soft) group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none [@media(hover:hover)]:flex">
            <QuantityStepper
              value={quantity}
              onChange={setQuantity}
              min={1}
              label={product.name}
              className="h-11 shrink-0 gap-0 border-0 bg-white px-1 shadow-[0_10px_24px_-14px_rgb(44_26_25/0.5)] [&_button]:size-7"
            />
            <AddToCartButton
              product={product}
              quantity={quantity}
              variant="primary"
              icon
              // The bag icon drops out on narrow cards so the label never wraps.
              className={cn(
                ADD_TO_CART,
                "min-w-0 flex-1 px-3 [&_svg]:hidden @[15rem]:[&_svg]:block",
              )}
              onAdded={() => setQuantity(1)}
            />
          </div>
        )}
      </div>

      <div className="mt-4 mb-3 flex flex-col items-center px-1 text-center">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-taupe-500 uppercase">
          {product.brand}
        </p>
        <h3 className="mt-1.5 text-[15px] leading-snug font-medium tracking-tight sm:text-base">
          <Link to={href} className="line-clamp-2 hover:text-cocoa-700">
            {product.name}
          </Link>
        </h3>
        <Price prices={product.prices} tone="sale" size="md" className="mt-2 sm:text-[15px]" />
      </div>

      {/* Touch screens can't hover, so the button is always shown there. */}
      <AddToCartButton
        product={product}
        variant="primary"
        icon
        className={cn(ADD_TO_CART, "mt-auto h-10 text-[11px] [@media(hover:hover)]:hidden")}
      />
    </article>
  );
}
