import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEFAULT_LOCALE, LOCALES, type StoreLocale } from "@/config/locale";
import type { Lang } from "@/i18n/config";
import { useLang } from "@/i18n/useLang";

/** Region shown until the shopper picks one: Egypt (EGP) for Arabic, US (USD) for English. */
const LANG_DEFAULT_LOCALE: Record<Lang, string> = { en: "US", ar: "EGY" };

interface LocaleState {
  /** The shopper's explicit region choice; `null` follows the page language. */
  code: string | null;
  setLocale: (code: string) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      code: null,
      setLocale: (code) => set({ code: LOCALES.some((l) => l.code === code) ? code : null }),
    }),
    {
      name: "verone-locale",
      // v2: regions now default per language, so earlier saved defaults are dropped.
      version: 2,
      migrate: () => ({ code: null }),
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ code: state.code }),
    },
  ),
);

export function useLocale(): StoreLocale {
  const lang = useLang();
  const code = useLocaleStore((s) => s.code) ?? LANG_DEFAULT_LOCALE[lang];
  return LOCALES.find((l) => l.code === code) ?? DEFAULT_LOCALE;
}
