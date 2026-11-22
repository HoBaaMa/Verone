import { useT } from "@/i18n/useT";
import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@/i18n/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  Lock,
  Truck,
  UserRound,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { FormError } from "@/components/ui/FormField";
import { calculateCheckoutTotals } from "@/features/cart/lib/cartCalculations";
import {
  CheckoutProgress,
  type CheckoutStep,
} from "@/features/checkout/components/CheckoutProgress";
import {
  ContactStep,
  DeliveryStep,
  PaymentStep,
  ReviewStep,
} from "@/features/checkout/components/CheckoutSteps";
import { OrderSummary } from "@/features/checkout/components/OrderSummary";
import { useCheckoutDraft } from "@/features/checkout/hooks/useCheckoutDraft";
import {
  validateAddress,
  validateCard,
  validateContact,
  type CardFields,
  type Errors,
} from "@/features/checkout/lib/validation";
import { orderService } from "@/services";
import { useCartStore } from "@/store/cartStore";
import { useLocale } from "@/store/localeStore";
import { useMoney } from "@/lib/money";
import type { CheckoutContact, ShippingAddress } from "@/types";

const STEP_DEFS = [
  { id: "contact", icon: UserRound },
  { id: "delivery", icon: Truck },
  { id: "payment", icon: CreditCard },
  { id: "review", icon: ClipboardCheck },
] as const;

const hasErrors = (e: object) => Object.keys(e).length > 0;

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const note = useCartStore((s) => s.note);
  const setNote = useCartStore((s) => s.setNote);
  const clearCart = useCartStore((s) => s.clear);
  const locale = useLocale();
  const country = locale.currency === "EGP" ? "EG" : "US";
  const money = useMoney();
  const navigate = useNavigate();
  const { m, fmt } = useT();
  const c = m.checkout;
  const STEPS: CheckoutStep[] = STEP_DEFS.map((s) => ({ ...s, label: c.steps[s.id] }));

  const [draft, setDraft, clearDraft] = useCheckoutDraft(country);
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const [card, setCard] = useState<CardFields>({ name: "", number: "", expiry: "", cvc: "" });
  const [contactErrors, setContactErrors] = useState<Errors<CheckoutContact>>({});
  const [addressErrors, setAddressErrors] = useState<Errors<ShippingAddress>>({});
  const [cardErrors, setCardErrors] = useState<Errors<CardFields>>({});
  const [agreed, setAgreed] = useState(false);
  const [agreeError, setAgreeError] = useState<string>();
  const [submitError, setSubmitError] = useState<string>();
  const [placing, setPlacing] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const totals = useMemo(
    () => calculateCheckoutTotals(items, locale.currency, draft.delivery),
    [items, locale.currency, draft.delivery],
  );

  if (items.length === 0 && !placing) {
    return (
      <div className="flex flex-col items-center px-4 py-32 text-center">
        <DisplayHeading as="h1" lead={c.emptyLead} muted={c.emptyMuted} />
        <ButtonLink to="/shop" className="mt-10">
          {m.cart.shopCollection}
        </ButtonLink>
      </div>
    );
  }

  const goTo = (next: number) => {
    setStep(next);
    setReached((r) => Math.max(r, next));
    const top = (topRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 110;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  /** Validates the current step; returns true when the shopper may move on. */
  const validateStep = () => {
    if (step === 0) {
      const e = validateContact(draft.contact, country, c.errors);
      setContactErrors(e);
      return !hasErrors(e);
    }
    if (step === 1) {
      const e = validateAddress(draft.address, c.errors);
      setAddressErrors(e);
      return !hasErrors(e);
    }
    if (step === 2 && draft.payment.method === "card") {
      const e = validateCard(card, c.errors);
      setCardErrors(e);
      return !hasErrors(e);
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) {
      // Move focus to the first invalid field for keyboard and screen-reader users.
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      );
      return;
    }
    goTo(step + 1);
  };

  const placeOrder = async () => {
    if (!agreed) {
      setAgreeError(c.agreeError);
      return;
    }
    setPlacing(true);
    setSubmitError(undefined);
    try {
      const order = await orderService.placeOrder({
        items,
        currency: locale.currency,
        contact: draft.contact,
        address: draft.address,
        delivery: draft.delivery,
        payment: {
          method: draft.payment.method,
          installmentMonths:
            draft.payment.method === "valu" || draft.payment.method === "contact"
              ? draft.payment.installmentMonths
              : undefined,
          cardLast4:
            draft.payment.method === "card" ? card.number.replace(/\D/g, "").slice(-4) : undefined,
        },
        note,
      });
      clearDraft();
      clearCart();
      navigate(`/checkout/confirmation/${order.number}`, { replace: true });
    } catch {
      setSubmitError(c.submitError);
      setPlacing(false);
    }
  };

  const cardLast4 = card.number.replace(/\D/g, "").slice(-4) || undefined;

  return (
    <div className="w-full px-4 pt-8 pb-8 lg:px-6">
      <div className="mx-auto max-w-[1280px]">
        <nav aria-label={m.pages.breadcrumb}>
          <ol className="flex items-center gap-1.5 text-[13px] text-taupe-500">
            <li>
              <Link to="/cart" className="hover:text-cocoa-900">
                {c.cart}
              </Link>
            </li>
            <li aria-hidden className="flex">
              <ChevronRight className="size-3.5 text-sand-400" />
            </li>
            <li aria-current="page" className="font-medium text-cocoa-900">
              {c.title}
            </li>
          </ol>
        </nav>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] leading-[0.95] font-semibold tracking-[var(--tracking-display)]">
            {c.title}
          </h1>
          <p className="flex items-center gap-1.5 text-[13px] text-taupe-600">
            <Lock className="size-3.5" aria-hidden /> {c.secure}
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12">
          <div ref={topRef} className="min-w-0">
            <CheckoutProgress steps={STEPS} current={step} reached={reached} onSelect={goTo} />

            <form
              noValidate
              className="mt-6"
              onSubmit={(e) => {
                e.preventDefault();
                if (step < STEPS.length - 1) next();
                else void placeOrder();
              }}
            >
              <div key={step} className="animate-page-in motion-reduce:animate-none">
                {step === 0 && (
                  <ContactStep
                    contact={draft.contact}
                    country={country}
                    errors={contactErrors}
                    onChange={(patch) => {
                      setDraft((d) => ({ ...d, contact: { ...d.contact, ...patch } }));
                      setContactErrors((e) => clearKeys(e, patch));
                    }}
                  />
                )}
                {step === 1 && (
                  <DeliveryStep
                    draft={draft}
                    errors={addressErrors}
                    subtotal={totals.subtotal}
                    currency={locale.currency}
                    onAddress={(patch) => {
                      setDraft((d) => ({ ...d, address: { ...d.address, ...patch } }));
                      setAddressErrors((e) => clearKeys(e, patch));
                    }}
                    onDelivery={(delivery) => setDraft((d) => ({ ...d, delivery }))}
                  />
                )}
                {step === 2 && (
                  <PaymentStep
                    draft={draft}
                    total={totals.total}
                    card={card}
                    cardErrors={cardErrors}
                    onPayment={(patch) =>
                      setDraft((d) => ({ ...d, payment: { ...d.payment, ...patch } }))
                    }
                    onCard={(patch) => {
                      setCard((c) => ({ ...c, ...patch }));
                      setCardErrors((e) => clearKeys(e, patch));
                    }}
                  />
                )}
                {step === 3 && (
                  <ReviewStep
                    draft={draft}
                    totals={totals}
                    cardLast4={cardLast4}
                    note={note}
                    onNote={setNote}
                    agreed={agreed}
                    onAgreed={(v) => {
                      setAgreed(v);
                      if (v) setAgreeError(undefined);
                    }}
                    agreeError={agreeError}
                    onEdit={goTo}
                  />
                )}
              </div>

              <div className="mt-4">
                <FormError message={submitError} />
              </div>

              <div className="mt-4 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                {step > 0 ? (
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => goTo(step - 1)}
                    disabled={placing}
                  >
                    <ArrowLeft className="size-4" strokeWidth={1.75} /> {c.back}
                  </Button>
                ) : (
                  <ButtonLink to="/cart" variant="ghost" size="lg">
                    <ArrowLeft className="size-4" strokeWidth={1.75} /> {c.returnToCart}
                  </ButtonLink>
                )}
                <Button type="submit" size="lg" className="sm:min-w-56" disabled={placing}>
                  {step < STEPS.length - 1 ? (
                    <>
                      {fmt(c.continueTo, { step: STEPS[step + 1].label.toLowerCase() })}
                      <ArrowRight className="size-4" strokeWidth={1.75} />
                    </>
                  ) : placing ? (
                    c.placing
                  ) : (
                    <>
                      <Lock className="size-4" strokeWidth={2} />{" "}
                      {fmt(c.placeOrder, { total: money(totals.total) })}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <OrderSummary
              items={items}
              totals={totals}
              currency={locale.currency}
              delivery={draft.delivery}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}

/** Drops errors for fields the shopper just edited. */
function clearKeys<T extends object>(errors: Errors<T>, patch: Partial<T>): Errors<T> {
  const next = { ...errors };
  for (const key of Object.keys(patch)) delete next[key as keyof T];
  return next;
}
