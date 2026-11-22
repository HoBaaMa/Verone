import { Check } from "lucide-react";
import { LOCALES } from "@/config/locale";
import { LocaleFlag } from "@/components/ui/LocaleFlag";
import { useLocale, useLocaleStore } from "@/store/localeStore";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n/useT";
import { currencySymbol } from "@/lib/money";

/** Selectable region list shared by the header popover and the mobile drawer. */
export function LocaleOptions({ onSelect }: { onSelect?: () => void }) {
  const active = useLocale();
  const setLocale = useLocaleStore((s) => s.setLocale);
  const { m, lang } = useT();

  return (
    <ul role="listbox" aria-label={m.region.list} className="flex flex-col gap-1">
      {LOCALES.map((locale) => {
        const selected = locale.code === active.code;
        return (
          <li key={locale.code}>
            <button
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => {
                setLocale(locale.code);
                onSelect?.();
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-start transition-colors",
                selected ? "bg-cream-100" : "hover:bg-cream-50",
              )}
            >
              <LocaleFlag locale={locale} />
              <span className="flex flex-1 flex-col leading-tight">
                <span className="text-sm font-medium">{m.region[locale.code as "US" | "EGY"]}</span>
                <span className="text-xs text-taupe-500">
                  {locale.currency} {currencySymbol(locale, lang)}
                </span>
              </span>
              {selected && <Check className="size-4" strokeWidth={2} aria-hidden />}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
