import type { MouseEvent, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { Heart, Search, ShoppingBag, User } from "lucide-react";
import { selectCartCount, useCartStore } from "@/store/cartStore";
import { selectWishlistCount, useWishlistStore } from "@/store/wishlistStore";
import { isModifiedClick, useUiStore } from "@/store/uiStore";
import { initialsOf, useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n/useT";

export const iconButtonClass =
  "relative grid size-9 place-items-center rounded-full transition-colors hover:bg-cream-100 lg:size-10";

/** Shared icon sizing for header controls. */
export const headerIconClass = "size-5 lg:size-[22px]";

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span
      key={count}
      className="absolute -top-0.5 -end-0.5 grid h-4 min-w-4 animate-[pulse_0.6s_ease-out_1] place-items-center rounded-full bg-cocoa-900 px-1 text-[10px] font-semibold text-white tabular-nums"
    >
      {count}
    </span>
  );
}

function IconLink({
  to,
  label,
  children,
  onClick,
}: {
  to: string;
  label: string;
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <Link to={to} className={iconButtonClass} aria-label={label} onClick={onClick}>
      {children}
    </Link>
  );
}

interface HeaderActionsProps {
  className?: string;
  /** When provided, a search toggle renders first (desktop only). */
  onSearchClick?: () => void;
  searchOpen?: boolean;
}

export function HeaderActions({ className, onSearchClick, searchOpen }: HeaderActionsProps) {
  const cartCount = useCartStore(selectCartCount);
  const wishlistCount = useWishlistStore(selectWishlistCount);
  const openCartDrawer = useUiStore((s) => s.openCartDrawer);
  const openAccountDrawer = useUiStore((s) => s.openAccountDrawer);
  const user = useAuthStore((s) => s.user);
  const icon = headerIconClass;
  const { m, fmt } = useT();

  return (
    <div className={cn("flex items-center", className)}>
      {onSearchClick && (
        <button
          type="button"
          onClick={onSearchClick}
          aria-label={m.common.search}
          aria-haspopup="dialog"
          aria-expanded={searchOpen}
          className={cn(iconButtonClass, "hidden lg:grid")}
        >
          <Search className={icon} strokeWidth={1.75} />
        </button>
      )}
      <IconLink
        to="/account"
        label={user ? fmt(m.header.accountSignedIn, { name: user.fullName }) : m.header.accountSignIn}
        onClick={(e) => {
          if (isModifiedClick(e)) return;
          e.preventDefault();
          openAccountDrawer();
        }}
      >
        {user ? (
          <span className="grid size-[22px] place-items-center rounded-full bg-cocoa-900 text-[10px] font-semibold text-white">
            {initialsOf(user.fullName)}
          </span>
        ) : (
          <User className={icon} strokeWidth={1.75} />
        )}
      </IconLink>
      <IconLink to="/wishlist" label={fmt(m.header.wishlist, { count: wishlistCount })}>
        <Heart className={icon} strokeWidth={1.75} />
        <CountBadge count={wishlistCount} />
      </IconLink>
      <IconLink
        to="/cart"
        label={fmt(m.header.cart, { count: cartCount })}
        onClick={(e) => {
          if (isModifiedClick(e)) return;
          e.preventDefault();
          openCartDrawer();
        }}
      >
        <ShoppingBag className={icon} strokeWidth={1.75} />
        <CountBadge count={cartCount} />
      </IconLink>
    </div>
  );
}
