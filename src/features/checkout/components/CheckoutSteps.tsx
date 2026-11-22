import { useT } from "@/i18n/useT";
import type { ReactNode } from "react";
import { Banknote, CreditCard, Pencil, Truck, Zap } from "lucide-react";
import type { CheckoutContact, CheckoutTotals, CurrencyCode, ShippingAddress } from "@/types";
import {
  DELIVERY_OPTIONS,
  EGYPT_GOVERNORATES,
  PAYMENT_OPTIONS,
  regionLabel,
  US_STATES,
} from "@/config/checkout";
import { PAYMENT_METHODS } from "@/config/payments";
import { Checkbox } from "@/components/ui/Checkbox";
import { RadioCard, SelectField, TextAreaField, TextField } from "@/components/ui/FormField";
import { deliveryFee } from "@/features/cart/lib/cartCalculations";
import { useMoney } from "@/lib/money";
import { useUiStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/cn";
import { dateLocale } from "@/lib/format";
import type { Lang } from "@/i18n/config";
import type { CheckoutDraft } from "../hooks/useCheckoutDraft";
import { formatCardNumber, formatExpiry, type CardFields, type Errors } from "../lib/validation";

export function StepCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[var(--radius-card)] border border-cream-200 bg-white p-5 sm:p-7">
      <h2 className="text-[22px] font-semibold tracking-[-0.02em]">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

/* ----------------------------- Contact ----------------------------- */

export function ContactStep({
  contact,
  country,
  errors,
  onChange,
}: {
  contact: CheckoutContact;
  country: "EG" | "US";
  errors: Errors<CheckoutContact>;
  onChange: (patch: Partial<CheckoutContact>) => void;
}) {
  const { m, fmt, l, lang } = useT();
  const c = m.checkout;
  const user = useAuthStore((s) => s.user);
  const openAccount = useUiStore((s) => s.openAccountDrawer);
  return (
    <StepCard title={c.contactTitle}>
      {!user && (
        <p className="mb-5 rounded-xl bg-cream-100 px-4 py-3 text-[13px] text-taupe-600">
          {c.haveAccount}{" "}
          <button
            type="button"
            onClick={() => openAccount("signIn")}
            className="font-medium text-cocoa-900 underline underline-offset-4"
          >
            {c.logIn}
          </button>{" "}
          {c.faster}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label={c.firstName}
          autoComplete="given-name"
          value={contact.firstName}
          error={errors.firstName}
          onChange={(e) => onChange({ firstName: e.target.value })}
        />
        <TextField
          label={c.lastName}
          autoComplete="family-name"
          value={contact.lastName}
          error={errors.lastName}
          onChange={(e) => onChange({ lastName: e.target.value })}
        />
        <TextField
          label={c.email}
          type="email"
          autoComplete="email"
          inputMode="email"
          value={contact.email}
          error={errors.email}
          hint={c.emailHint}
          onChange={(e) => onChange({ email: e.target.value })}
        />
        <TextField
          label={c.phone}
          type="tel"
          dir="ltr"
          autoComplete="tel"
          inputMode="tel"
          placeholder={country === "EG" ? "010 1234 5678" : "(555) 123-4567"}
          value={contact.phone}
          error={errors.phone}
          hint={c.phoneHint}
          onChange={(e) => onChange({ phone: e.target.value })}
        />
      </div>
      <div className="mt-5">
        <Checkbox
          size="md"
          label={c.newsletter}
          checked={contact.newsletter}
          onChange={(newsletter) => onChange({ newsletter })}
        />
      </div>
    </StepCard>
  );
}

/* ----------------------------- Delivery ---------------------------- */

const formatDay = (d: Date, lang: Lang) =>
  d.toLocaleDateString(dateLocale(lang), { weekday: "short", month: "short", day: "numeric" });

function businessDaysFromNow(days: number) {
  const d = new Date();
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) added++;
  }
  return d;
}

export function DeliveryStep({
  draft,
  errors,
  subtotal,
  currency,
  onAddress,
  onDelivery,
}: {
  draft: CheckoutDraft;
  errors: Errors<ShippingAddress>;
  subtotal: number;
  currency: CurrencyCode;
  onAddress: (patch: Partial<ShippingAddress>) => void;
  onDelivery: (method: CheckoutDraft["delivery"]) => void;
}) {
  const { m, fmt, l, lang } = useT();
  const c = m.checkout;
  const money = useMoney();
  const a = draft.address;
  const eg = a.country === "EG";
  const regions = (eg ? EGYPT_GOVERNORATES : US_STATES).map((r) => ({
    value: r,
    label: regionLabel(r, lang),
  }));

  return (
    <div className="space-y-5">
      <StepCard title={c.shippingTitle}>
        <p className="mb-5 text-[13px] text-taupe-600">
          {c.deliveringTo} <span className="font-medium text-cocoa-900">{eg ? c.egypt : c.us}</span>
          . {c.changeRegion}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label={eg ? c.governorate : c.state}
            placeholder={eg ? c.selectGovernorate : c.selectState}
            options={regions}
            value={a.region}
            error={errors.region}
            onChange={(e) => onAddress({ region: e.target.value })}
          />
          <TextField
            label={eg ? c.cityArea : c.city}
            autoComplete="address-level2"
            placeholder={eg ? c.cityPlaceholderEg : c.cityPlaceholderUs}
            value={a.city}
            error={errors.city}
            onChange={(e) => onAddress({ city: e.target.value })}
          />
          <div className="sm:col-span-2">
            <TextField
              label={c.street}
              autoComplete="address-line1"
              placeholder={eg ? c.streetPlaceholderEg : c.streetPlaceholderUs}
              value={a.street}
              error={errors.street}
              onChange={(e) => onAddress({ street: e.target.value })}
            />
          </div>
          <TextField
            label={eg ? c.detailsEg : c.detailsUs}
            autoComplete="address-line2"
            placeholder={eg ? c.detailsPlaceholderEg : "Apt 4B"}
            value={a.details}
            error={errors.details}
            onChange={(e) => onAddress({ details: e.target.value })}
          />
          {eg ? (
            <TextField
              label={c.landmark}
              placeholder={c.landmarkPlaceholder}
              value={a.landmark}
              onChange={(e) => onAddress({ landmark: e.target.value })}
            />
          ) : (
            <TextField
              label={c.zip}
              autoComplete="postal-code"
              dir="ltr"
              inputMode="numeric"
              placeholder="11211"
              value={a.postalCode}
              error={errors.postalCode}
              onChange={(e) => onAddress({ postalCode: e.target.value })}
            />
          )}
        </div>
      </StepCard>

      <StepCard title={c.deliveryTitle}>
        <div className="space-y-3" role="radiogroup" aria-label={c.deliveryTitle}>
          {DELIVERY_OPTIONS.map((option) => {
            const fee = deliveryFee(subtotal, currency, option.id);
            const [min, max] = option.days;
            const date =
              min === max
                ? formatDay(businessDaysFromNow(min), lang)
                : `${formatDay(businessDaysFromNow(min), lang)} – ${formatDay(businessDaysFromNow(max), lang)}`;
            const eta = fmt(c.arrives, { date });
            return (
              <RadioCard
                key={option.id}
                name="delivery"
                value={option.id}
                checked={draft.delivery === option.id}
                onChange={(v) => onDelivery(v as CheckoutDraft["delivery"])}
                icon={
                  option.id === "express" ? (
                    <Zap className="size-5" strokeWidth={1.75} />
                  ) : (
                    <Truck className="size-5" strokeWidth={1.75} />
                  )
                }
                title={l(option.label)}
                description={eta}
                aside={fee === 0 ? <span className="text-[#5b8a5a]">{c.free}</span> : money(fee)}
              />
            );
          })}
        </div>
      </StepCard>
    </div>
  );
}

/* ----------------------------- Payment ----------------------------- */

const providerLogo = (id: string) => PAYMENT_METHODS.find((m) => m.id === id);

export function PaymentStep({
  draft,
  total,
  card,
  cardErrors,
  onPayment,
  onCard,
}: {
  draft: CheckoutDraft;
  total: number;
  card: CardFields;
  cardErrors: Errors<CardFields>;
  onPayment: (patch: Partial<CheckoutDraft["payment"]>) => void;
  onCard: (patch: Partial<CardFields>) => void;
}) {
  const { m, fmt, l, lang } = useT();
  const c = m.checkout;
  const money = useMoney();
  const iconFor = (id: string) => {
    if (id === "cod") return <Banknote className="size-5" strokeWidth={1.75} />;
    if (id === "card") return <CreditCard className="size-5" strokeWidth={1.75} />;
    const logo = providerLogo(id);
    return logo ? (
      <span className="flex h-7 w-12 items-center justify-center rounded-md bg-white px-1 ring-1 ring-cream-200">
        <img src={logo.logo} alt="" className="max-h-full max-w-full object-contain" />
      </span>
    ) : null;
  };

  return (
    <StepCard title={c.paymentTitle}>
      <p className="mb-5 rounded-xl bg-cream-100 px-4 py-3 text-[13px] text-taupe-600">
        {c.demoPrefix}{" "}
        <span dir="ltr" className="font-medium text-cocoa-900 tabular-nums">
          4242 4242 4242 4242
        </span>
        .
      </p>
      <div className="space-y-3" role="radiogroup" aria-label={c.paymentMethod}>
        {PAYMENT_OPTIONS.map((option) => (
          <RadioCard
            key={option.id}
            name="payment"
            value={option.id}
            checked={draft.payment.method === option.id}
            onChange={(v) => onPayment({ method: v as CheckoutDraft["payment"]["method"] })}
            icon={iconFor(option.id)}
            title={l(option.label)}
            description={l(option.description)}
          >
            {option.id === "card" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <TextField
                    label={c.cardName}
                    autoComplete="cc-name"
                    value={card.name}
                    error={cardErrors.name}
                    onChange={(e) => onCard({ name: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <TextField
                    label={c.cardNumber}
                    autoComplete="cc-number"
                    dir="ltr"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={card.number}
                    error={cardErrors.number}
                    onChange={(e) => onCard({ number: formatCardNumber(e.target.value) })}
                  />
                </div>
                <TextField
                  label={c.expiry}
                  autoComplete="cc-exp"
                  dir="ltr"
                  inputMode="numeric"
                  placeholder="08/28"
                  value={card.expiry}
                  error={cardErrors.expiry}
                  onChange={(e) => onCard({ expiry: formatExpiry(e.target.value) })}
                />
                <TextField
                  label={c.cvc}
                  autoComplete="cc-csc"
                  dir="ltr"
                  inputMode="numeric"
                  placeholder="CVC"
                  maxLength={4}
                  value={card.cvc}
                  error={cardErrors.cvc}
                  onChange={(e) => onCard({ cvc: e.target.value.replace(/\D/g, "") })}
                />
              </div>
            )}
            {option.terms && (
              <div>
                <p className="text-[13px] font-medium">{c.choosePlan}</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {option.terms.map((months) => {
                    const active = draft.payment.installmentMonths === months;
                    return (
                      <button
                        key={months}
                        type="button"
                        onClick={() => onPayment({ installmentMonths: months })}
                        aria-pressed={active}
                        className={cn(
                          "rounded-xl border px-3 py-2.5 text-center transition-colors",
                          active
                            ? "border-cocoa-900 bg-cocoa-900 text-white"
                            : "border-sand-300 hover:border-cocoa-900",
                        )}
                      >
                        <span className="block text-[14px] font-semibold">
                          {fmt(c.months, { count: months })}
                        </span>
                        <span
                          className={cn(
                            "block text-[12px] tabular-nums",
                            active ? "text-white/75" : "text-taupe-600",
                          )}
                        >
                          {fmt(c.perMonth, {
                            amount: money(Math.ceil((total / months) * 100) / 100),
                          })}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-[12px] text-taupe-500">
                  {fmt(c.planNote, { provider: option.provider ?? "" })}
                </p>
              </div>
            )}
          </RadioCard>
        ))}
      </div>
    </StepCard>
  );
}

/* ------------------------------ Review ----------------------------- */

function ReviewRow({
  label,
  children,
  onEdit,
}: {
  label: string;
  children: ReactNode;
  onEdit: () => void;
}) {
  const { m } = useT();
  return (
    <div className="flex items-start gap-4 border-b border-cream-200 py-4 last:border-0">
      <p className="w-24 shrink-0 text-[13px] text-taupe-500">{label}</p>
      <div className="min-w-0 flex-1 text-[14px] leading-relaxed">{children}</div>
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex shrink-0 items-center gap-1 text-[13px] font-medium underline-offset-4 hover:underline"
      >
        <Pencil className="size-3.5" strokeWidth={1.75} aria-hidden /> {m.checkout.edit}
      </button>
    </div>
  );
}

export function ReviewStep({
  draft,
  totals,
  cardLast4,
  note,
  onNote,
  agreed,
  onAgreed,
  agreeError,
  onEdit,
}: {
  draft: CheckoutDraft;
  totals: CheckoutTotals;
  cardLast4?: string;
  note: string;
  onNote: (note: string) => void;
  agreed: boolean;
  onAgreed: (v: boolean) => void;
  agreeError?: string;
  onEdit: (step: number) => void;
}) {
  const { m, fmt, l, lang } = useT();
  const c = m.checkout;
  const money = useMoney();
  const { contact, address: a } = draft;
  const delivery = DELIVERY_OPTIONS.find((o) => o.id === draft.delivery)!;
  const payment = PAYMENT_OPTIONS.find((o) => o.id === draft.payment.method)!;

  return (
    <StepCard title={c.reviewTitle}>
      <div>
        <ReviewRow label={c.rowContact} onEdit={() => onEdit(0)}>
          <p className="font-medium">
            {contact.firstName} {contact.lastName}
          </p>
          <p className="text-taupe-600">{contact.email}</p>
          <p dir="ltr" className="text-taupe-600 rtl:text-end">
            {contact.phone}
          </p>
        </ReviewRow>
        <ReviewRow label={c.rowShipTo} onEdit={() => onEdit(1)}>
          <p>{a.street}</p>
          {a.details && <p>{a.details}</p>}
          <p className="text-taupe-600">
            {a.city}
            {lang === "ar" ? "،" : ","} {regionLabel(a.region, lang)}
            {a.country === "US" && ` ${a.postalCode}`} · {a.country === "EG" ? c.egypt : c.us}
          </p>
          {a.landmark && <p className="text-taupe-600">{fmt(c.near, { landmark: a.landmark })}</p>}
        </ReviewRow>
        <ReviewRow label={c.rowDelivery} onEdit={() => onEdit(1)}>
          {l(delivery.label)} · {totals.deliveryFee === 0 ? c.free : money(totals.deliveryFee)}
        </ReviewRow>
        <ReviewRow label={c.rowPayment} onEdit={() => onEdit(2)}>
          {l(payment.label)}
          {draft.payment.method === "card" && cardLast4 && (
            <span className="text-taupe-600">{fmt(c.endingIn, { last4: cardLast4 })}</span>
          )}
          {payment.terms && (
            <span className="text-taupe-600">
              {" · "}
              {fmt(c.months, { count: draft.payment.installmentMonths })}
            </span>
          )}
        </ReviewRow>
      </div>

      <div className="mt-5">
        <TextAreaField
          label={c.noteLabel}
          placeholder={c.notePlaceholder}
          maxLength={300}
          value={note}
          onChange={(e) => onNote(e.target.value)}
        />
      </div>

      <div className="mt-5">
        <Checkbox size="md" label={c.terms} checked={agreed} onChange={onAgreed} />
        {agreeError && <p className="mt-1 text-xs text-sale">{agreeError}</p>}
      </div>
    </StepCard>
  );
}
