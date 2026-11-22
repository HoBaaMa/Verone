import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { useLocation } from "react-router";
import { Link } from "@/i18n/navigation";
import { Check, Lock, NotebookPen, Package, Trash2, Truck, X } from "lucide-react";
import type { CartItem, Product } from "@/types";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { useProducts } from "@/features/catalog/hooks/useProducts";
import { ProductImage } from "@/features/product/components/ProductImage";
import { NOTE_MAX_LENGTH, useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { useLocale } from "@/store/localeStore";
import { useMoney } from "@/lib/money";
import { pricePoint } from "@/lib/pricing";
import { cn } from "@/lib/cn";
import {
  drawerOverlay,
  drawerOverlayTransition,
  drawerPanelShell,
  drawerPanelTransition,
} from "@/lib/drawerMotion";
import { calculateCartTotals, SHIPPING_RULES } from "../lib/cartCalculations";
import { AddToCartButton } from "./AddToCartButton";
import { QuantityStepper } from "./QuantityStepper";
import { useT } from "@/i18n/useT";
import { itemTitle } from "../lib/itemTitle";

const RECOMMENDATION_COUNT = 4;

export function CartDrawer() {
  const { m, fmt, lang } = useT();
  const open = useUiStore((s) => s.isCartDrawerOpen);
  const close = useUiStore((s) => s.closeCartDrawer);
  const items = useCartStore((s) => s.items);
  const { pathname } = useLocation();
  const closeRef = useRef<HTMLButtonElement>(null);

  // Any navigation (product link, checkout, view cart) dismisses the drawer.
  useEffect(() => close(), [pathname, close]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div inert={!open}>
      <div
        onClick={close}
        aria-hidden
        className={cn(
          drawerOverlay,
          drawerOverlayTransition,
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      {/* Fixed clipping frame: keeps the off-screen (closed) panel from widening the page on mobile. */}
      <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
        <aside
          role="dialog"
          aria-modal="true"
          aria-label={m.cart.drawerLabel}
          aria-hidden={!open}
          className={cn(
            drawerPanelShell,
            "flex flex-col",
            drawerPanelTransition,
            // Slides in from the inline end: right in LTR, left in RTL.
            open ? "visible translate-x-0" : "invisible translate-x-full rtl:-translate-x-full",
          )}
        >
          <div className="flex shrink-0 items-center justify-between px-6 pt-7 pb-5 sm:px-7">
            <h2 className="text-[26px] font-semibold tracking-[-0.03em]">
              {m.cart.title}{" "}
              {count > 0 && (
                <span className="text-lg font-normal text-taupe-500 tabular-nums">({count})</span>
              )}
            </h2>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label={m.cart.close}
              className="grid size-10 place-items-center rounded-full border border-cream-200 transition-colors hover:bg-cream-100"
            >
              <X className="size-[18px]" strokeWidth={1.75} />
            </button>
          </div>

          {open &&
            (items.length === 0 ? (
              <EmptyCart onClose={close} />
            ) : (
              <PopulatedCart closeRef={closeRef} />
            ))}
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function EmptyCart({ onClose }: { onClose: () => void }) {
  const { m, fmt, lang } = useT();
  const user = useAuthStore((s) => s.user);
  // Opening the account drawer also closes this one.
  const openAccountDrawer = useUiStore((s) => s.openAccountDrawer);
  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-8 sm:px-7">
      <div className="flex flex-col items-center gap-5 rounded-2xl bg-cream-100 px-6 py-10 text-center">
        <p className="text-[20px] font-semibold tracking-[-0.02em]">{m.cart.empty}</p>
        <Button onClick={onClose} className="px-7">
          {m.common.continueShopping}
        </Button>
        {!user && (
          <p className="text-[13px] text-taupe-600">
            {m.cart.haveAccount}{" "}
            <button
              type="button"
              onClick={() => openAccountDrawer("signIn")}
              className="font-medium text-cocoa-900 underline underline-offset-4"
            >
              {m.cart.logIn}
            </button>{" "}
            {m.cart.checkoutFaster}
          </p>
        )}
      </div>
      <Recommendations items={[]} title={m.cart.bestSellers} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function PopulatedCart({ closeRef }: { closeRef: RefObject<HTMLButtonElement | null> }) {
  const { m, fmt, lang } = useT();
  const items = useCartStore((s) => s.items);
  const { currency } = useLocale();
  const totals = useMemo(() => calculateCartTotals(items, currency), [items, currency]);
  const money = useMoney();
  const [panel, setPanel] = useState<"note" | "shipping" | null>(null);

  // Keep focus inside the dialog if the last line is removed.
  useEffect(() => () => closeRef.current?.focus({ preventScroll: true }), [closeRef]);

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 sm:px-7">
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.productId}>
              <CartLine item={item} />
            </li>
          ))}
        </ul>
        <Recommendations items={items} title={m.cart.alsoLike} />
      </div>

      <div className="shrink-0 border-t border-cream-200 bg-white px-6 pt-4 pb-6 sm:px-7">
        <div className="flex items-center gap-6">
          <ToggleLink
            icon={<NotebookPen className="size-4" strokeWidth={1.75} />}
            active={panel === "note"}
            onClick={() => setPanel((p) => (p === "note" ? null : "note"))}
          >
            {m.cart.orderNote}
          </ToggleLink>
          <ToggleLink
            icon={<Package className="size-4" strokeWidth={1.75} />}
            active={panel === "shipping"}
            onClick={() => setPanel((p) => (p === "shipping" ? null : "shipping"))}
          >
            {m.cart.estimateShipping}
          </ToggleLink>
        </div>
        {panel === "note" && <OrderNote />}
        {panel === "shipping" && <ShippingEstimate subtotal={totals.subtotal} />}

        <div className="mt-4 border-t border-dashed border-sand-300 pt-4">
          <FreeShippingProgress
            subtotal={totals.subtotal}
            remaining={totals.amountToFreeShipping}
          />
        </div>

        <dl className="mt-4 space-y-1.5 text-[14px]">
          <div className="flex justify-between text-taupe-600">
            <dt>{m.cart.subtotal}</dt>
            <dd className="tabular-nums">{money(totals.subtotal)}</dd>
          </div>
          {totals.savings > 0 && (
            <div className="flex justify-between text-sale">
              <dt>{m.cart.youSave}</dt>
              <dd className="tabular-nums">−{money(totals.savings)}</dd>
            </div>
          )}
          <div className="flex justify-between text-taupe-600">
            <dt>{m.cart.shipping}</dt>
            <dd className="tabular-nums">
              {totals.shipping === 0 ? m.common.free : money(totals.shipping)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between pt-1.5">
            <dt className="text-[18px] font-semibold">{m.cart.total}</dt>
            <dd className="text-[22px] font-semibold tracking-tight tabular-nums">
              {money(totals.total)}
            </dd>
          </div>
        </dl>

        <div className="mt-4 grid grid-cols-[1fr_1.4fr] gap-3">
          <ButtonLink to="/cart" variant="outline" size="lg" className="h-12">
            {m.cart.viewCart}
          </ButtonLink>
          <ButtonLink to="/checkout" size="lg" className="h-12">
            <Lock className="size-3.5" strokeWidth={2} aria-hidden />
            {m.cart.checkout}
            {/* The total sits right above; drop it from the label where space is tight. */}
            <span className="hidden whitespace-nowrap sm:inline">· {money(totals.total)}</span>
          </ButtonLink>
        </div>
      </div>
    </>
  );
}

function CartLine({ item }: { item: CartItem }) {
  const { m, fmt, lang } = useT();
  const title = itemTitle(item, lang);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const { currency } = useLocale();
  const money = useMoney();
  const { price, compareAtPrice } = pricePoint(item.prices, currency);
  const discounted = compareAtPrice !== undefined && compareAtPrice > price;

  return (
    <article className="rounded-2xl bg-cream-100 p-4">
      <div className="grid grid-cols-[80px_1fr] gap-4">
        <Link
          to={`/product/${item.slug}`}
          tabIndex={-1}
          aria-hidden
          className="size-20 overflow-hidden rounded-xl bg-white"
        >
          <img src={item.image} alt="" className="size-full object-contain" />
        </Link>
        <div className="flex min-w-0 flex-col">
          <div className="flex items-start justify-between gap-3">
            <Link
              to={`/product/${item.slug}`}
              className="min-w-0 text-[15px] leading-snug font-semibold tracking-tight hover:text-cocoa-700"
            >
              <span className="block text-[11px] font-medium tracking-[0.14em] text-taupe-500 uppercase">
                {item.brand}
              </span>
              {title.name}
            </Link>
            <p className="shrink-0 text-[15px] font-semibold tabular-nums">
              {money(price * item.quantity)}
            </p>
          </div>
          <p className="mt-1 text-[12px] text-taupe-500">{title.size}</p>
          <p className="mt-1 text-[13px] text-taupe-600 tabular-nums">
            {money(price)}
            {discounted && (
              <span className="ms-1.5 text-sale line-through">{money(compareAtPrice)}</span>
            )}
            {item.quantity > 1 && <span className="text-taupe-500"> {m.cart.each}</span>}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <QuantityStepper
          value={item.quantity}
          label={title.name}
          onChange={(q) => updateQuantity(item.productId, q)}
          className="h-10 w-[112px] justify-between border-0 bg-white"
        />
        <button
          type="button"
          onClick={() => removeItem(item.productId)}
          aria-label={fmt(m.cart.remove, { name: title.name })}
          className="grid size-10 place-items-center rounded-full bg-white text-cocoa-900 transition-colors hover:bg-cream-200"
        >
          <Trash2 className="size-4" strokeWidth={1.75} />
        </button>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Related picks: products from the same categories as the cart, best sellers
 * first, never something already in the cart. Falls back to overall best sellers.
 */
function Recommendations({ items, title }: { items: CartItem[]; title: string }) {
  const { data } = useProducts({ sort: "best-selling", pageSize: 100 });
  const picks = useMemo(() => {
    const all = data?.items ?? [];
    const inCart = new Set(items.map((i) => i.productId));
    const categories = new Set(all.filter((p) => inCart.has(p.id)).map((p) => p.categorySlug));
    const available = all.filter((p) => !inCart.has(p.id) && p.inStock);
    const related = available.filter((p) => categories.has(p.categorySlug));
    const rest = available.filter((p) => !categories.has(p.categorySlug));
    return [...related, ...rest].slice(0, RECOMMENDATION_COUNT);
  }, [data, items]);

  if (!picks.length) return null;

  return (
    <section aria-labelledby="cart-recs" className="mt-7 pb-6">
      <h3 id="cart-recs" className="mb-3 text-[17px] font-semibold tracking-tight">
        {title}
      </h3>
      <ul className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto overscroll-x-contain px-6 sm:scroll-px-7 [scrollbar-width:none] sm:-mx-7 sm:px-7 [&::-webkit-scrollbar]:hidden">
        {picks.map((product) => (
          <li key={product.id} className="w-[86%] shrink-0 snap-start">
            <RecommendationCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function RecommendationCard({ product }: { product: Product }) {
  return (
    <article className="flex h-full gap-4 rounded-2xl bg-cream-100 p-4">
      <Link
        to={`/product/${product.slug}`}
        tabIndex={-1}
        aria-hidden
        className="size-20 shrink-0 overflow-hidden rounded-xl bg-white"
      >
        <ProductImage image={product.images[0]} fallbackLabel={product.name} decorative />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-[11px] font-medium tracking-[0.14em] text-taupe-500 uppercase">
          {product.brand}
        </p>
        <Link
          to={`/product/${product.slug}`}
          className="line-clamp-2 text-[15px] leading-snug font-semibold tracking-tight hover:text-cocoa-700"
        >
          {product.name}
        </Link>
        <Price prices={product.prices} align="start" size="sm" className="mt-1" />
        <div className="mt-3 flex justify-end">
          <div className="w-[124px]">
            <AddToCartButton product={product} variant="primary" size="sm" />
          </div>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */

function ToggleLink({
  icon,
  active,
  onClick,
  children,
}: {
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={active}
      className={cn(
        "inline-flex items-center gap-2 text-[14px] font-medium underline-offset-4 transition-colors hover:underline",
        active && "underline",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function OrderNote() {
  const { m, fmt, lang } = useT();
  const note = useCartStore((s) => s.note);
  const setNote = useCartStore((s) => s.setNote);
  return (
    <div className="mt-3">
      <label htmlFor="cart-note" className="sr-only">
        {m.cart.orderNote}
      </label>
      <textarea
        id="cart-note"
        autoFocus
        rows={3}
        value={note}
        maxLength={NOTE_MAX_LENGTH}
        onChange={(e) => setNote(e.target.value)}
        placeholder={m.cart.notePlaceholder}
        className="w-full resize-none rounded-xl border border-sand-300 bg-white px-4 py-3 text-[14px] placeholder:text-taupe-500 focus:border-cocoa-900 focus:outline-none"
      />
      <p className="mt-1 text-end text-[11px] text-taupe-500 tabular-nums">
        {fmt(m.cart.noteSaved, { count: note.length, max: NOTE_MAX_LENGTH })}
      </p>
    </div>
  );
}

function ShippingEstimate({ subtotal }: { subtotal: number }) {
  const { m, fmt, lang } = useT();
  const locale = useLocale();
  const money = useMoney();
  const rule = SHIPPING_RULES[locale.currency];
  const free = subtotal >= rule.freeOver;
  return (
    <div className="mt-3 rounded-xl bg-cream-100 px-4 py-3 text-[13px] leading-relaxed text-taupe-600">
      <p>
        {m.cart.shippingTo}{" "}
        <span className="font-medium text-cocoa-900">{m.region[locale.code as "US" | "EGY"]}</span>:{" "}
        <span className="font-medium text-cocoa-900">
          {free ? m.common.free : money(rule.flatRate)}
        </span>
        {!free && <> · {fmt(m.cart.freeOver, { amount: money(rule.freeOver) })}</>}
      </p>
      <p>{m.cart.delivery}</p>
    </div>
  );
}

function FreeShippingProgress({ subtotal, remaining }: { subtotal: number; remaining: number }) {
  const { m, fmt, lang } = useT();
  const { currency } = useLocale();
  const money = useMoney();
  const threshold = SHIPPING_RULES[currency].freeOver;
  const unlocked = remaining <= 0;
  const pct = unlocked ? 100 : Math.max(4, Math.min(100, (subtotal / threshold) * 100));

  return (
    <div>
      <p className="text-[13px] text-taupe-600" aria-live="polite">
        {unlocked ? (
          <span className="font-medium text-cocoa-900">{m.cart.unlocked}</span>
        ) : (
          <>
            {m.cart.awayPrefix}{" "}
            <span className="font-semibold text-cocoa-900">{money(remaining)}</span>{" "}
            {m.cart.awaySuffix}
          </>
        )}
      </p>
      {/* Track with a truck riding the fill edge; it becomes a check once unlocked. */}
      <div
        role="progressbar"
        aria-label={m.cart.progressLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        className="relative mt-3 me-4 ms-1 h-2 rounded-full bg-cream-200"
      >
        <div
          className="absolute inset-y-0 start-0 rounded-full bg-gradient-to-r from-sand-400 to-cocoa-900 rtl:bg-gradient-to-l transition-[width] duration-700 ease-(--ease-out-soft) motion-reduce:transition-none"
          style={{ width: `${pct}%` }}
        />
        <span
          className={cn(
            "absolute top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full shadow-[0_4px_10px_-4px_rgb(44_26_25/0.5)] ring-2 ring-white transition-[left,right,background-color] rtl:translate-x-1/2 duration-700 ease-(--ease-out-soft) motion-reduce:transition-none",
            unlocked ? "bg-[#5b8a5a] text-white" : "bg-cocoa-900 text-cream-50",
          )}
          style={{ insetInlineStart: `${pct}%` }}
          aria-hidden
        >
          {unlocked ? (
            <Check className="size-4" strokeWidth={2.5} />
          ) : (
            <Truck className="size-4" strokeWidth={1.75} />
          )}
        </span>
      </div>
    </div>
  );
}
