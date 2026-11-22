import type { CartItem, CartTotals, CheckoutTotals, CurrencyCode, DeliveryMethod } from "@/types";
import { EXPRESS_RATES } from "@/config/checkout";
import { pricePoint } from "@/lib/pricing";

interface ShippingRule {
  /** Subtotal at or above which shipping is free. */
  freeOver: number;
  flatRate: number;
}

/** Shipping is merchandised per currency, like product prices. */
export const SHIPPING_RULES: Record<CurrencyCode, ShippingRule> = {
  USD: { freeOver: 50, flatRate: 6 },
  EGP: { freeOver: 1500, flatRate: 60 },
};

export function calculateCartTotals(items: CartItem[], currency: CurrencyCode = "USD"): CartTotals {
  const rule = SHIPPING_RULES[currency];
  let subtotal = 0;
  let savings = 0;
  let itemCount = 0;
  for (const item of items) {
    const { price, compareAtPrice } = pricePoint(item.prices, currency);
    itemCount += item.quantity;
    subtotal += price * item.quantity;
    savings += ((compareAtPrice ?? price) - price) * item.quantity;
  }
  subtotal = round(subtotal);
  const shipping = subtotal === 0 || subtotal >= rule.freeOver ? 0 : rule.flatRate;
  return {
    itemCount,
    subtotal,
    savings: round(savings),
    shipping,
    total: round(subtotal + shipping),
    amountToFreeShipping: Math.max(0, round(rule.freeOver - subtotal)),
  };
}

const round = (value: number) => Math.round(value * 100) / 100;

/** Fee for a delivery method: standard follows the free-shipping rule; express is a flat premium. */
export function deliveryFee(
  subtotal: number,
  currency: CurrencyCode,
  method: DeliveryMethod,
): number {
  if (method === "express") return EXPRESS_RATES[currency];
  const rule = SHIPPING_RULES[currency];
  return subtotal === 0 || subtotal >= rule.freeOver ? 0 : rule.flatRate;
}

export function calculateCheckoutTotals(
  items: CartItem[],
  currency: CurrencyCode,
  method: DeliveryMethod,
): CheckoutTotals {
  const base = calculateCartTotals(items, currency);
  const fee = deliveryFee(base.subtotal, currency, method);
  return { ...base, shipping: fee, deliveryFee: fee, total: round(base.subtotal + fee) };
}
