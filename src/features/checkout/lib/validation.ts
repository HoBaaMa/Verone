import type { CheckoutContact, PaymentMethod, ShippingAddress } from "@/types";
import type { Messages } from "@/i18n/messages/en";

/** Validation copy in the active language (`m.checkout.errors`). */
export type CheckoutErrorMessages = Messages["checkout"]["errors"];

export type Errors<T> = Partial<Record<keyof T, string>>;

export interface CardFields {
  name: string;
  number: string;
  expiry: string;
  cvc: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const digits = (v: string) => v.replace(/\D/g, "");

/** Egypt mobiles: 01X + 8 digits (with or without +20). US: 10 digits (with or without +1). */
export function isValidPhone(phone: string, country: "EG" | "US") {
  const d = digits(phone);
  if (country === "EG") return /^(20)?0?1[0125]\d{8}$/.test(d);
  return /^1?\d{10}$/.test(d);
}

export function validateContact(
  c: CheckoutContact,
  country: "EG" | "US",
  t: CheckoutErrorMessages,
): Errors<CheckoutContact> {
  const e: Errors<CheckoutContact> = {};
  if (!c.firstName.trim()) e.firstName = t.firstName;
  if (!c.lastName.trim()) e.lastName = t.lastName;
  if (!EMAIL.test(c.email.trim())) e.email = t.email;
  if (!isValidPhone(c.phone, country)) e.phone = country === "EG" ? t.phoneEg : t.phoneUs;
  return e;
}

export function validateAddress(
  a: ShippingAddress,
  t: CheckoutErrorMessages,
): Errors<ShippingAddress> {
  const e: Errors<ShippingAddress> = {};
  if (!a.region) e.region = a.country === "EG" ? t.governorate : t.state;
  if (!a.city.trim()) e.city = a.country === "EG" ? t.cityEg : t.cityUs;
  if (a.street.trim().length < 4) e.street = t.street;
  if (a.country === "EG" && !a.details.trim()) e.details = t.details;
  if (a.country === "US" && !/^\d{5}(-\d{4})?$/.test(a.postalCode.trim())) e.postalCode = t.zip;
  return e;
}

/** Luhn checksum for card numbers. */
function luhn(num: string) {
  let sum = 0;
  let double = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = Number(num[i]);
    if (double) n = n * 2 > 9 ? n * 2 - 9 : n * 2;
    sum += n;
    double = !double;
  }
  return sum % 10 === 0;
}

export function validateCard(card: CardFields, t: CheckoutErrorMessages): Errors<CardFields> {
  const e: Errors<CardFields> = {};
  const num = digits(card.number);
  if (!card.name.trim()) e.name = t.cardName;
  if (num.length < 13 || num.length > 19 || !luhn(num)) e.number = t.cardNumber;
  const [mm, yy] = card.expiry.split("/").map((s) => Number(s));
  const now = new Date();
  const expiresEnd = yy ? new Date(2000 + yy, mm, 1) : null;
  if (!mm || mm < 1 || mm > 12 || !expiresEnd || expiresEnd <= now) e.expiry = t.expiry;
  if (!/^\d{3,4}$/.test(card.cvc)) e.cvc = t.cvc;
  return e;
}

export const needsCard = (method: PaymentMethod) => method === "card";

export const formatCardNumber = (v: string) =>
  digits(v)
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ");

export const formatExpiry = (v: string) => {
  const d = digits(v).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};
