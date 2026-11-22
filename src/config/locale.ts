import type { CurrencyCode } from "@/types";

/**
 * Supported storefront regions. Products carry a merchandised price per
 * currency; `rate` is only an indicative fallback for prices that aren't listed.
 */
export interface StoreLocale {
  code: string;
  regionName: string;
  currency: CurrencyCode;
  currencySymbol: string;
  /** Units of `currency` per 1 USD. */
  rate: number;
  fractionDigits: number;
  flag: string;
}

const asset = (file: string) => `${import.meta.env.BASE_URL}assets/${file}`;

export const LOCALES: StoreLocale[] = [
  {
    code: "US",
    regionName: "United States",
    currency: "USD",
    currencySymbol: "$",
    rate: 1,
    fractionDigits: 2,
    flag: asset("3bccf.svg"),
  },
  {
    code: "EGY",
    regionName: "Egypt",
    currency: "EGP",
    currencySymbol: "E£",
    rate: 48.5,
    fractionDigits: 0,
    flag: asset("2cdb1.svg"),
  },
];

export const DEFAULT_LOCALE = LOCALES[0];


