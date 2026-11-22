import { Heart } from "lucide-react";
import type { Product } from "@/types";
import { useWishlistStore } from "@/store/wishlistStore";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n/useT";

interface WishlistButtonProps {
  product: Pick<Product, "id" | "name">;
  /** `overlay` sits on product imagery; `outline` matches pill buttons. */
  variant?: "overlay" | "outline";
  /** Smaller 32px overlay badge. */
  compact?: boolean;
  className?: string;
}

export function WishlistButton({
  product,
  variant = "overlay",
  compact,
  className,
}: WishlistButtonProps) {
  const saved = useWishlistStore((s) => s.ids.includes(product.id));
  const toggle = useWishlistStore((s) => s.toggle);
  const { m, fmt } = useT();

  return (
    <button
      type="button"
      onClick={() => toggle(product.id)}
      aria-pressed={saved}
      aria-label={
        fmt(saved ? m.product.removeFromWishlist : m.product.saveToWishlist, { name: product.name })
      }
      className={cn(
        "grid shrink-0 place-items-center rounded-full transition-colors",
        variant === "overlay"
          ? cn(compact ? "size-8" : "size-9", "bg-cream-50/90 backdrop-blur hover:bg-white")
          : "size-12 border border-sand-300 hover:border-cocoa-900",
        className,
      )}
    >
      <Heart
        className={cn("size-4 transition-transform active:scale-90", saved && "fill-cocoa-900")}
        strokeWidth={1.75}
      />
    </button>
  );
}
