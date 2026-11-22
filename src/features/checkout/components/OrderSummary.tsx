import { itemTitle } from "@/features/cart/lib/itemTitle";
import { useT } from "@/i18n/useT";
import { Link } from "@/i18n/navigation";
import { Lock } from "lucide-react";
import type { CartItem, CheckoutTotals, CurrencyCode, DeliveryMethod } from "@/types";
import { DELIVERY_OPTIONS } from "@/config/checkout";
import { useMoney } from "@/lib/money";
import { pricePoint } from "@/lib/pricing";

interface OrderSummaryProps {
  items: CartItem[];
  totals: CheckoutTotals;
  currency: CurrencyCode;
  delivery: DeliveryMethod;
  /** Hide the "Edit cart" link (e.g. on the confirmation page). */
  readOnly?: boolean;
}

export function OrderSummary({ items, totals, currency, delivery, readOnly }: OrderSummaryProps) {
  const money = useMoney();
  const { m, l, lang } = useT();
  const option = DELIVERY_OPTIONS.find((o) => o.id === delivery);
  const deliveryLabel = option ? l(option.label) : m.checkout.rowDelivery;

  return (
    <section
      aria-labelledby="order-summary"
      className="rounded-[var(--radius-card)] bg-cream-100 p-6"
    >
      <div className="flex items-baseline justify-between">
        <h2 id="order-summary" className="text-lg font-semibold tracking-tight">
          {m.checkout.summary}
        </h2>
        {!readOnly && (
          <Link to="/cart" className="text-[13px] font-medium underline underline-offset-4">
            {m.checkout.editCart}
          </Link>
        )}
      </div>

      <ul className="mt-5 space-y-4">
        {items.map((item) => {
          const { price, compareAtPrice } = pricePoint(item.prices, currency);
          const title = itemTitle(item, lang);
          return (
            <li key={item.productId} className="flex items-center gap-3.5">
              <span className="relative size-16 shrink-0 rounded-xl bg-white ring-1 ring-cream-200">
                <img src={item.image} alt="" className="size-full rounded-xl object-contain" />
                <span className="absolute -top-1.5 -end-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-cocoa-900 px-1 text-[10px] font-semibold text-white tabular-nums">
                  {item.quantity}
                </span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium tracking-[0.14em] text-taupe-500 uppercase">
                  {item.brand}
                </p>
                <p className="truncate text-[14px] font-medium">{title.name}</p>
                <p className="text-[12px] text-taupe-500">{title.size}</p>
              </div>
              <div className="text-end text-[14px] tabular-nums">
                <p className="font-medium">{money(price * item.quantity)}</p>
                {compareAtPrice !== undefined && compareAtPrice > price && (
                  <p className="text-[12px] text-sale line-through">
                    {money(compareAtPrice * item.quantity)}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <dl className="mt-6 space-y-2 border-t border-cream-200 pt-4 text-[14px] tabular-nums">
        <div className="flex justify-between">
          <dt className="text-taupe-600">{m.checkout.subtotal}</dt>
          <dd>{money(totals.subtotal)}</dd>
        </div>
        {totals.savings > 0 && (
          <div className="flex justify-between text-sale">
            <dt>{m.checkout.youSave}</dt>
            <dd>−{money(totals.savings)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-taupe-600">{deliveryLabel}</dt>
          <dd>{totals.deliveryFee === 0 ? m.checkout.free : money(totals.deliveryFee)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-cream-200 pt-3">
          <dt className="text-base font-semibold">{m.checkout.total}</dt>
          <dd className="text-[22px] font-semibold tracking-tight">{money(totals.total)}</dd>
        </div>
      </dl>

      {!readOnly && (
        <p className="mt-5 flex items-center gap-2 text-xs text-taupe-500">
          <Lock className="size-3.5" aria-hidden /> {m.checkout.secureDemo}
        </p>
      )}
    </section>
  );
}
