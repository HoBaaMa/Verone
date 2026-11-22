import type { CartItem, CartTotals } from "./cart";
import type { CurrencyCode } from "./product";

export type DeliveryMethod = "standard" | "express";
export type PaymentMethod = "cod" | "card" | "valu" | "contact";

export interface CheckoutContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  newsletter: boolean;
}

/** Region-aware address. Egypt uses governorate + building details; the US uses state + ZIP. */
export interface ShippingAddress {
  country: "EG" | "US";
  /** Governorate (EG) or state (US). */
  region: string;
  city: string;
  street: string;
  /** EG: building / floor / apartment. US: apartment, suite (optional). */
  details: string;
  /** US ZIP code; unused for Egypt. */
  postalCode: string;
  landmark: string;
}

export interface PaymentDetails {
  method: PaymentMethod;
  /** Instalment term in months (valU / Contact). */
  installmentMonths?: number;
  /** Last four digits only; full card data never leaves the form. */
  cardLast4?: string;
}

export interface PlaceOrderRequest {
  items: CartItem[];
  currency: CurrencyCode;
  contact: CheckoutContact;
  address: ShippingAddress;
  delivery: DeliveryMethod;
  payment: PaymentDetails;
  note: string;
}

export interface CheckoutTotals extends CartTotals {
  deliveryFee: number;
}

export interface Order extends PlaceOrderRequest {
  id: string;
  /** Human-friendly reference, e.g. "VR-24817". */
  number: string;
  createdAt: string;
  totals: CheckoutTotals;
  estimatedDelivery: { from: string; to: string };
}
