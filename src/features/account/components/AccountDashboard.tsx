import { useT } from "@/i18n/useT";
import { Link } from "@/i18n/navigation";
import { ChevronRight, Heart, ShoppingBag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services";
import { initialsOf, useAuthStore } from "@/store/authStore";
import { selectCartCount, useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { selectWishlistCount, useWishlistStore } from "@/store/wishlistStore";
import { formatDate } from "@/lib/format";
import type { User } from "@/types";

const rowClass =
  "flex w-full items-center gap-3 border-b border-cream-200 py-4 text-start text-[15px] font-medium transition-colors hover:text-taupe-600";

export function AccountDashboard({ user }: { user: User }) {
  const { m, fmt, lang } = useT();
  const setUser = useAuthStore((s) => s.setUser);
  const openCartDrawer = useUiStore((s) => s.openCartDrawer);
  const wishlistCount = useWishlistStore(selectWishlistCount);
  const cartCount = useCartStore(selectCartCount);
  const firstName = user.fullName.split(" ")[0];

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-4 rounded-[var(--radius-card)] bg-cream-100 p-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-cocoa-900 text-sm font-semibold text-white">
          {initialsOf(user.fullName)}
        </span>
        <div className="min-w-0">
          <p className="text-base font-semibold tracking-tight">
            {fmt(m.account.hello, { name: firstName })}
          </p>
          <p className="truncate text-[13px] text-taupe-600">{user.identifier}</p>
          <p className="text-xs text-taupe-500">
            {fmt(m.account.memberSince, { date: formatDate(user.createdAt, lang) })}
          </p>
        </div>
      </div>

      <nav aria-label={m.account.tablist} className="mt-4">
        <Link to="/wishlist" className={rowClass}>
          <Heart className="size-[18px]" strokeWidth={1.75} aria-hidden />
          <span className="flex-1">{m.account.wishlist}</span>
          <span className="text-[13px] text-taupe-500 tabular-nums">{wishlistCount}</span>
          <ChevronRight className="size-4 text-taupe-500" aria-hidden />
        </Link>
        <button type="button" onClick={openCartDrawer} className={rowClass}>
          <ShoppingBag className="size-[18px]" strokeWidth={1.75} aria-hidden />
          <span className="flex-1">{m.account.cart}</span>
          <span className="text-[13px] text-taupe-500 tabular-nums">{cartCount}</span>
          <ChevronRight className="size-4 text-taupe-500" aria-hidden />
        </button>
        <Link to="/shop?sort=newest" className={rowClass}>
          <Sparkles className="size-[18px]" strokeWidth={1.75} aria-hidden />
          <span className="flex-1">{m.account.newArrivals}</span>
          <ChevronRight className="size-4 text-taupe-500" aria-hidden />
        </Link>
      </nav>

      <div className="mt-auto pt-6">
        <Button
          variant="outline"
          size="lg"
          className="h-12 w-full"
          onClick={async () => {
            await authService.signOut();
            setUser(null);
          }}
        >
          {m.account.signOut}
        </Button>
      </div>
    </div>
  );
}
