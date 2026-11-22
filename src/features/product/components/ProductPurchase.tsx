import { useState } from "react";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/types";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { QuantityStepper } from "@/features/cart/components/QuantityStepper";
import { WishlistButton } from "@/features/wishlist/components/WishlistButton";
import { MAX_LINE_QUANTITY, useCartStore } from "@/store/cartStore";
import { useT } from "@/i18n/useT";

/** Quantity selection and add-to-cart, bounded by what is already in the cart. */
export function ProductPurchase({ product }: { product: Product }) {
  const inCart = useCartStore(
    (s) => s.items.find((item) => item.productId === product.id)?.quantity ?? 0,
  );
  const [quantity, setQuantity] = useState(1);
  const { m, fmt } = useT();

  const remaining = Math.max(0, MAX_LINE_QUANTITY - inCart);
  const atLimit = remaining === 0;
  const selected = Math.min(quantity, Math.max(1, remaining));

  return (
    <div>
      <div className="flex gap-3">
        {product.inStock && (
          <div className="[&>div]:h-12">
            <QuantityStepper
              value={selected}
              onChange={setQuantity}
              label={product.name}
              min={1}
              max={Math.max(1, remaining)}
            />
          </div>
        )}
        <AddToCartButton
          product={product}
          quantity={selected}
          variant="primary"
          size="lg"
          className="flex-1"
          disabled={atLimit}
          onAdded={() => setQuantity(1)}
        />
        <WishlistButton product={product} variant="outline" />
      </div>

      {inCart > 0 && (
        <p className="mt-3 text-[13px] text-taupe-600" aria-live="polite">
          {atLimit
            ? fmt(m.product.maxInCart, { max: MAX_LINE_QUANTITY })
            : fmt(m.product.inCart, { count: inCart })}{" "}
          <Link to="/cart" className="font-medium text-cocoa-900 underline underline-offset-4">
            {m.product.viewCart}
          </Link>
        </p>
      )}
    </div>
  );
}
