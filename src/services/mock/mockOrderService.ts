import type { Order } from "@/types";
import type { OrderService } from "../contracts";
import { DELIVERY_OPTIONS } from "@/config/checkout";
import { calculateCheckoutTotals } from "@/features/cart/lib/cartCalculations";
import { withLatency } from "./latency";

const STORAGE_KEY = "verone-orders";

const readOrders = (): Order[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as Order[];
  } catch {
    return [];
  }
};

/** Adds business days (Mon–Fri) to a date. */
function addBusinessDays(from: Date, days: number) {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return d.toISOString();
}

/** Demo order store in localStorage. Totals are recomputed here, as the API would. */
export const mockOrderService: OrderService = {
  async placeOrder(request) {
    const now = new Date();
    const [minDays, maxDays] = DELIVERY_OPTIONS.find((o) => o.id === request.delivery)!.days;
    const order: Order = {
      ...request,
      id: crypto.randomUUID(),
      number: `VR-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: now.toISOString(),
      totals: calculateCheckoutTotals(request.items, request.currency, request.delivery),
      estimatedDelivery: { from: addBusinessDays(now, minDays), to: addBusinessDays(now, maxDays) },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([order, ...readOrders()].slice(0, 20)));
    return withLatency(order, 900);
  },
  async getOrder(number) {
    return withLatency(readOrders().find((o) => o.number === number) ?? null, 120);
  },
};
