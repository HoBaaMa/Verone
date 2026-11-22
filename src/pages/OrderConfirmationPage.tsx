import { useT } from "@/i18n/useT";
import { useParams } from "react-router";
import { CheckCircle2, Package } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { Skeleton } from "@/components/ui/Skeleton";
import { DELIVERY_OPTIONS, PAYMENT_OPTIONS, regionLabel } from "@/config/checkout";
import { dateLocale } from "@/lib/format";
import type { Lang } from "@/i18n/config";
import { OrderSummary } from "@/features/checkout/components/OrderSummary";
import { orderService } from "@/services";
import { useAsync } from "@/lib/useAsync";

const formatDay = (iso: string, lang: Lang) =>
  new Date(iso).toLocaleDateString(dateLocale(lang), {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

export default function OrderConfirmationPage() {
  const { orderNumber = "" } = useParams();
  const { m, fmt, l, lang } = useT();
  const t = m.checkout.confirmation;
  const { data: order, loading } = useAsync(
    () => orderService.getOrder(orderNumber),
    [orderNumber],
  );

  if (loading && !order) {
    return (
      <div className="mx-auto max-w-[1100px] px-4 py-16">
        <Skeleton className="h-64 rounded-[var(--radius-card)]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center px-4 py-32 text-center">
        <DisplayHeading as="h1" lead={t.notFoundLead} muted={t.notFoundMuted} />
        <ButtonLink to="/shop" className="mt-10">
          {m.common.continueShopping}
        </ButtonLink>
      </div>
    );
  }

  const { contact: c, address: a } = order;
  const delivery = DELIVERY_OPTIONS.find((o) => o.id === order.delivery)!;
  const payment = PAYMENT_OPTIONS.find((o) => o.id === order.payment.method)!;
  const sameDay =
    order.estimatedDelivery.from.slice(0, 10) === order.estimatedDelivery.to.slice(0, 10);

  return (
    <div className="w-full px-4 pt-10 pb-8 lg:px-6">
      <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12">
        <div>
          <div className="rounded-[var(--radius-card)] bg-cocoa-900 px-6 py-10 text-cream-50 sm:px-10">
            <CheckCircle2
              className="size-12 animate-reveal-up text-[#9cc59b]"
              strokeWidth={1.5}
              aria-hidden
            />
            <p className="mt-5 text-[13px] tracking-[0.2em] text-cream-50/60 uppercase">
              {fmt(t.order, { number: order.number })}
            </p>
            <h1 className="mt-2 text-[clamp(2rem,4.5vw,3.25rem)] leading-[1] font-semibold tracking-[var(--tracking-display)]">
              {fmt(t.thanks, { name: c.firstName })}
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-cream-50/80">
              {t.confirmedPrefix} <span className="font-medium text-cream-50">{c.email}</span>.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoCard title={t.estimated}>
              <p className="flex items-center gap-2 font-medium">
                <Package className="size-4" strokeWidth={1.75} aria-hidden />
                {sameDay
                  ? formatDay(order.estimatedDelivery.from, lang)
                  : `${formatDay(order.estimatedDelivery.from, lang)} – ${formatDay(order.estimatedDelivery.to, lang)}`}
              </p>
              <p className="mt-1 text-taupe-600">{l(delivery.label)}</p>
            </InfoCard>
            <InfoCard title={t.shippingTo}>
              <p className="font-medium">
                {c.firstName} {c.lastName}
              </p>
              <p className="text-taupe-600">
                {a.street}
                {a.details && `, ${a.details}`}
              </p>
              <p className="text-taupe-600">
                {a.city}
                {lang === "ar" ? "،" : ","} {regionLabel(a.region, lang)}
                {a.country === "US" && ` ${a.postalCode}`}
              </p>
            </InfoCard>
            <InfoCard title={t.payment}>
              <p className="font-medium">{l(payment.label)}</p>
              {order.payment.cardLast4 && (
                <p className="text-taupe-600">
                  {fmt(t.cardEnding, { last4: order.payment.cardLast4 })}
                </p>
              )}
              {order.payment.installmentMonths && (
                <p className="text-taupe-600">
                  {fmt(t.plan, { count: order.payment.installmentMonths })}
                </p>
              )}
            </InfoCard>
            <InfoCard title={t.contact}>
              <p dir="ltr" className="font-medium rtl:text-end">
                {c.phone}
              </p>
              <p className="text-taupe-600">{c.email}</p>
            </InfoCard>
          </div>

          {order.note && (
            <InfoCard title={t.note} className="mt-4">
              <p className="text-taupe-600">{order.note}</p>
            </InfoCard>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/shop" size="lg">
              {m.common.continueShopping}
            </ButtonLink>
            <ButtonLink to="/" variant="outline" size="lg">
              {t.home}
            </ButtonLink>
          </div>
        </div>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <OrderSummary
            items={order.items}
            totals={order.totals}
            currency={order.currency}
            delivery={order.delivery}
            readOnly
          />
        </aside>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-cream-200 p-5 text-[14px] leading-relaxed ${className ?? ""}`}
    >
      <h2 className="mb-2 text-[11px] font-semibold tracking-[0.18em] text-taupe-500 uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}
