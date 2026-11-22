import { useMemo } from "react";
import { ar } from "./messages/ar";
import { en, type Messages } from "./messages/en";
import type { Lang, Localized } from "./config";
import { useLang } from "./useLang";

export const MESSAGES: Record<Lang, Messages> = { en, ar };

/** Fills `{name}` placeholders: `fmt("Hi {name}", { name: "Sara" })`. */
export const fmt = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`));

/** Picks the active language's value from a `{ en, ar }` pair. */
export const pick = <T>(value: Localized<T>, lang: Lang): T => value[lang];

/** Messages for the active language plus helpers. */
export function useT() {
  const lang = useLang();
  return useMemo(
    () => ({
      m: MESSAGES[lang],
      lang,
      fmt,
      /** Localized-pair accessor bound to the active language. */
      l: <T>(value: Localized<T>) => value[lang],
    }),
    [lang],
  );
}
