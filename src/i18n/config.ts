export type Lang = "en" | "ar";
export const LANGS: Lang[] = ["en", "ar"];
export const DEFAULT_LANG: Lang = "en";

/** Arabic pages live under `/ar`; English keeps the unprefixed URLs. */
const AR_PREFIX = "/ar";

export const dirOf = (lang: Lang) => (lang === "ar" ? "rtl" : "ltr");

/** A value written once per language, e.g. `{ en: "Sale", ar: "تخفيضات" }`. */
export type Localized<T = string> = Record<Lang, T>;

export const langFromPath = (pathname: string): Lang =>
  pathname === AR_PREFIX || pathname.startsWith(`${AR_PREFIX}/`) ? "ar" : "en";

/** `/ar/shop` → `/shop`, `/ar` → `/`. English paths are returned unchanged. */
export function stripLang(pathname: string): string {
  if (langFromPath(pathname) !== "ar") return pathname;
  return pathname.slice(AR_PREFIX.length) || "/";
}

/** Prefixes an absolute in-app path for the given language. Relative paths pass through. */
export function localizePath(to: string, lang: Lang): string {
  if (!to.startsWith("/") || to.startsWith("//")) return to;
  const bare = langFromPath(to) === "ar" ? to.slice(AR_PREFIX.length) || "/" : to;
  if (lang === "en") return bare;
  return bare === "/"
    ? AR_PREFIX
    : bare.startsWith("/?") || bare.startsWith("/#")
      ? `${AR_PREFIX}${bare.slice(1)}`
      : `${AR_PREFIX}${bare}`;
}
