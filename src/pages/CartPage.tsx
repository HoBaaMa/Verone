import { useMemo } from "react";
import { Link } from "@/i18n/navigation";
import { X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { QuantityStepper } from "@/features/cart/components/QuantityStepper";
import { calculateCartTotals, SHIPPING_RULES } from "@/features/cart/lib/cartCalculations";
import { useCartStore } from "@/store/cartStore";
import { useMoney } from "@/lib/money";
import { pricePoint } from "@/lib/pricing";
import { useLocale } from "@/store/localeStore";
import { useT } from "@/i18n/useT";
import { itemTitle } from "@/features/cart/lib/itemTitle";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const { currency } = useLocale();
  const totals = useMemo(() => calculateCartTotals(items, currency), [items, currency]);
  const money = useMoney();
  const { m, fmt, lang } = useT();

  if (items.length === 0) {
    return (
      <Container className="flex flex-col items-center py-32 text-center">
        <DisplayHeading as="h1" lead={m.cart.emptyLead} muted={m.cart.emptyMuted} />
        <ButtonLink to="/shop" className="mt-10">
          {m.cart.shopCollection}
        </ButtonLink>
      </Container>
    );
  }

  const progress = Math.min(100, (totals.subtotal / SHIPPING_RULES[currency].freeOver) * 100);

  return (
    <Container className="pt-14">
      <DisplayHeading
        as="h1"
        lead={m.cart.title}
        muted={
          totals.itemCount === 1
            ? m.cart.itemOne
            : fmt(m.cart.itemMany, { count: totals.itemCount })
        }
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
        <ul className="divide-y divide-cream-200 border-y border-cream-200">
          {items.map((item) => {
            const title = itemTitle(item, lang);
            return (
              <li key={item.productId} className="flex gap-4 py-6 sm:gap-6">
                <Link
                  to={`/product/${item.slug}`}
                  className="block aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-xl bg-cream-100 sm:w-32"
                >
                  <img
                    src={item.image}
                    alt={title.name}
                    className="size-full bg-white object-contain"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        to={`/product/${item.slug}`}
                        className="text-base font-medium tracking-tight hover:text-cocoa-700"
                      >
                        <span className="uppercase">{item.brand}</span> {title.name}
                      </Link>
                      <p className="mt-0.5 text-[13px] text-taupe-500">
                        {title.subtitle} · {title.size}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="grid size-8 shrink-0 place-items-center rounded-full text-taupe-600 hover:bg-cream-100 hover:text-cocoa-900"
                      aria-label={fmt(m.cart.remove, { name: title.name })}
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-end justify-between gap-4 pt-4">
                    <QuantityStepper
                      value={item.quantity}
                      label={title.name}
                      onChange={(q) => updateQuantity(item.productId, q)}
                    />
                    <div className="text-end tabular-nums">
                      <p className="font-medium">
                        {money(pricePoint(item.prices, currency).price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-taupe-500">
                          {fmt(m.cart.eachPrice, {
                            price: money(pricePoint(item.prices, currency).price),
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit rounded-[var(--radius-card)] bg-cream-100 p-6 lg:sticky lg:top-36">
          <h2 className="text-lg font-semibold tracking-tight">{m.cart.orderSummary}</h2>
          <div className="mt-5">
            <p className="text-[13px] text-taupe-600">
              {totals.amountToFreeShipping > 0
                ? fmt(m.cart.awayFull, { amount: money(totals.amountToFreeShipping) })
                : m.cart.unlockedFull}
            </p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-cream-200">
              <div
                className="h-full rounded-full bg-cocoa-900 transition-[width] duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <dl className="mt-6 space-y-3 text-sm tabular-nums">
            <Row label={m.cart.subtotal} value={money(totals.subtotal)} />
            {totals.savings > 0 && (
              <Row label={m.cart.youSave} value={`−${money(totals.savings)}`} accent />
            )}
            <Row
              label={m.cart.shipping}
              value={totals.shipping === 0 ? m.common.free : money(totals.shipping)}
            />
            <div className="border-t border-cream-200 pt-3">
              <Row label={m.cart.total} value={money(totals.total)} strong />
            </div>
          </dl>
          <ButtonLink to="/checkout" size="lg" className="mt-6 w-full">
            {m.cart.checkout}
          </ButtonLink>
          <Link
            to="/shop"
            className="mt-5 block text-center text-sm font-medium underline underline-offset-4"
          >
            {m.common.continueShopping}
          </Link>
        </aside>
      </div>
    </Container>
  );
}

function Row({
  label,
  value,
  strong,
  accent,
}: {
  label: string;
  value: string;
  strong?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <dt className={strong ? "font-semibold" : "text-taupe-600"}>{label}</dt>
      <dd className={strong ? "text-base font-semibold" : accent ? "text-sale" : ""}>{value}</dd>
    </div>
  );
}
