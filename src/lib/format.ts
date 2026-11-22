import type { Lang } from "@/i18n/config";

/** Arabic dates keep Western digits, matching how prices are shown. */
export const dateLocale = (lang: Lang) => (lang === "ar" ? "ar-EG-u-nu-latn" : "en-US");

export const formatDate = (iso: string, lang: Lang = "en") =>
  new Date(iso).toLocaleDateString(dateLocale(lang), {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
