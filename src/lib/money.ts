import { useCallback } from "react";
import type { StoreLocale } from "@/config/locale";
import { useLocale } from "@/store/localeStore";
import type { Lang } from "@/i18n/config";
import { useLang } from "@/i18n/useLang";

const formatters = new Map<number, Intl.NumberFormat>();

const formatterFor = (digits: number) => {
  let formatter = formatters.get(digits);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
    formatters.set(digits, formatter);
  }
  return formatter;
};

/**
 * Formats an amount that is already in the locale's currency, e.g. "$5.99" or
 * "E£299". Whole-unit currencies still show cents when a price has them (E£137.50).
 */
export function formatMoney(amount: number, locale: StoreLocale, lang: Lang = "en"): string {
  const hasCents = Math.round(amount * 100) % 100 !== 0;
  const digits = hasCents ? Math.max(2, locale.fractionDigits) : locale.fractionDigits;
  const value = formatterFor(digits).format(amount);
  // Arabic pages keep Western digits; the Egyptian pound reads "299 ج.م".
  if (lang === "ar" && locale.currency === "EGP") return `${value}\u00a0ج.م`;
  return `${currencySymbol(locale, lang)}${value}`;
}

/** Currency symbol as shown in the given language. */
export const currencySymbol = (locale: StoreLocale, lang: Lang) =>
  lang === "ar" && locale.currency === "EGP" ? "ج.م" : locale.currencySymbol;

/** Locale-aware money formatter; components re-render when the region changes. */
export function useMoney() {
  const locale = useLocale();
  const lang = useLang();
  return useCallback((amount: number) => formatMoney(amount, locale, lang), [locale, lang]);
}
