import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { Price } from "@/components/ui/Price";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { MAX_LINE_QUANTITY, useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/cn";
import { ProductImage } from "./ProductImage";

/** Fraction of the page's scrollable height after which the bar appears. */
const SHOW_AFTER = 0.5;
/** Hides slightly earlier than it shows so it doesn't flicker at the threshold. */
const HIDE_BELOW = 0.45;
const BAR_HEIGHT = "80px";

function useScrolledPast(show: number, hide: number) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      setPast((was) => (was ? progress >= hide : progress >= show));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [show, hide]);
  return past;
}

/**
 * Compact purchase bar pinned to the viewport bottom once the shopper has
 * scrolled halfway down the product page. Adds a single unit, respecting the
 * per-line cart limit.
 */
export function StickyPurchaseBar({ product }: { product: Product }) {
  const visible = useScrolledPast(SHOW_AFTER, HIDE_BELOW);
  const inCart = useCartStore(
    (s) => s.items.find((item) => item.productId === product.id)?.quantity ?? 0,
  );
  const atLimit = inCart >= MAX_LINE_QUANTITY;

  // Reserve room at the end of the page so the bar never hides the footer's last line.
  useEffect(() => {
    if (!visible) return;
    document.body.style.paddingBottom = BAR_HEIGHT;
    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [visible]);

  return (
    <div
      inert={!visible}
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-cream-200 bg-white/95 shadow-[0_-12px_32px_-24px_rgb(44_26_25/0.35)] backdrop-blur-md",
        "transition-[translate,opacity] duration-300 ease-(--ease-out-soft) motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
      )}
    >
      <div className="flex h-20 items-center gap-3 px-4 sm:gap-5 lg:px-6">
        <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-cream-200">
          <ProductImage image={product.images[0]} fallbackLabel={product.name} decorative />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-medium tracking-tight text-cocoa-900">
            {product.name}
            <span className="hidden font-normal text-taupe-500 sm:inline">
              {" "}
              · {product.subtitle}
            </span>
          </p>
          <Price prices={product.prices} align="start" size="md" className="mt-0.5" />
        </div>
        <div className="ms-auto w-36 shrink-0 sm:ms-6 sm:w-48">
          <AddToCartButton product={product} variant="primary" size="md" disabled={atLimit} />
        </div>
      </div>
    </div>
  );
}
