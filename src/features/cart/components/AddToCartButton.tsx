import { useEffect, useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n/useT";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  variant?: "outline" | "primary";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  /** Show a bag icon before the label. */
  icon?: boolean;
  onAdded?: () => void;
}

export function AddToCartButton({
  product,
  quantity = 1,
  variant = "outline",
  size = "sm",
  className,
  disabled,
  icon,
  onAdded,
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openCartDrawer = useUiStore((s) => s.openCartDrawer);
  const [added, setAdded] = useState(false);
  const { m } = useT();

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(t);
  }, [added]);

  if (!product.inStock) {
    return (
      <Button variant={variant} size={size} disabled className={cn("w-full", className)}>
        {m.product.soldOut}
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "w-full",
        added && variant === "outline" && "bg-cocoa-900 text-white",
        className,
      )}
      onClick={() => {
        addItem(product, quantity);
        setAdded(true);
        onAdded?.();
        openCartDrawer();
      }}
      disabled={disabled}
      aria-live="polite"
    >
      {added ? (
        <>
          <Check className="size-3.5" strokeWidth={2.5} /> {m.product.added}
        </>
      ) : (
        <>
          {icon && <ShoppingBag className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />}
          {m.product.addToCart}
        </>
      )}
    </Button>
  );
}
