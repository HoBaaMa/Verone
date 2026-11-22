import type { CurrencyCode, PriceList, PricePoint } from "@/types";
import { LOCALES } from "@/config/locale";
import { useLocale } from "@/store/localeStore";

/**
 * Resolves the merchandised price for a currency. Products carry explicit
 * per-currency prices; if one is missing, the USD price is converted at the
 * locale's indicative rate and rounded to whole units.
 */
export function pricePoint(prices: PriceList, currency: CurrencyCode = "USD"): PricePoint {
  const listed = prices[currency];
  if (listed) return listed;
  const rate = LOCALES.find((l) => l.currency === currency)?.rate ?? 1;
  const convert = (amount: number) => Math.round(amount * rate);
  const { price, compareAtPrice } = prices.USD;
  return {
    price: convert(price),
    compareAtPrice: compareAtPrice === undefined ? undefined : convert(compareAtPrice),
  };
}

/** Price point for the shopper's active region; re-renders when the region changes. */
export function useLocalPrice(prices: PriceList): PricePoint {
  const { currency } = useLocale();
  return pricePoint(prices, currency);
}

export const discountPercent = ({ price, compareAtPrice }: PricePoint) =>
  compareAtPrice && compareAtPrice > price ? Math.round((1 - price / compareAtPrice) * 100) : 0;
