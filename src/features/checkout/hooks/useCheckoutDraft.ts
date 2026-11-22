import { useEffect, useState } from "react";
import type { CheckoutContact, DeliveryMethod, PaymentMethod, ShippingAddress } from "@/types";
import { useAuthStore } from "@/store/authStore";

export interface CheckoutDraft {
  contact: CheckoutContact;
  address: ShippingAddress;
  delivery: DeliveryMethod;
  payment: { method: PaymentMethod; installmentMonths: number };
}

const KEY = "verone-checkout-draft";

const emptyAddress = (country: "EG" | "US"): ShippingAddress => ({
  country,
  region: "",
  city: "",
  street: "",
  details: "",
  postalCode: "",
  landmark: "",
});

/**
 * Checkout form state, kept in sessionStorage so a refresh doesn't lose typing.
 * Card numbers are deliberately never stored. The address resets when the
 * shopper switches region, since the fields differ.
 */
export function useCheckoutDraft(country: "EG" | "US") {
  const user = useAuthStore((s) => s.user);
  const [draft, setDraft] = useState<CheckoutDraft>(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(KEY) ?? "null") as CheckoutDraft | null;
      if (saved) return saved;
    } catch {
      /* ignore malformed drafts */
    }
    const [firstName = "", ...rest] = (user?.fullName ?? "").split(" ");
    const identifier = user?.identifier ?? "";
    return {
      contact: {
        firstName,
        lastName: rest.join(" "),
        email: identifier.includes("@") ? identifier : "",
        phone: identifier.includes("@") ? "" : identifier,
        newsletter: false,
      },
      address: emptyAddress(country),
      delivery: "standard",
      payment: { method: country === "EG" ? "cod" : "card", installmentMonths: 6 },
    };
  });

  useEffect(() => {
    sessionStorage.setItem(KEY, JSON.stringify(draft));
  }, [draft]);

  useEffect(() => {
    setDraft((d) => (d.address.country === country ? d : { ...d, address: emptyAddress(country) }));
  }, [country]);

  const clear = () => sessionStorage.removeItem(KEY);
  return [draft, setDraft, clear] as const;
}
