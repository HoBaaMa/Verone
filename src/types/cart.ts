import type { PriceList, ProductTitles } from "./product";

/**
 * A cart line stores a snapshot of product data so the cart can render
 * without refetching the catalog. Prices are re-validated at checkout by the API.
 */
export interface CartItem {
  productId: string;
  slug: string;
  brand: string;
  name: string;
  subtitle: string;
  image: string;
  size: string;
  /** Names per language, snapshotted when added; falls back to `name`/`subtitle`/`size`. */
  titles?: ProductTitles;
  /** Unit prices per currency, snapshotted when added. */
  prices: PriceList;
  quantity: number;
}

/** Totals are expressed in the currency they were calculated for. */
export interface CartTotals {
  itemCount: number;
  subtotal: number;
  savings: number;
  shipping: number;
  total: number;
  amountToFreeShipping: number;
}
