import { useEffect, useRef, useState } from "react";
import { LocaleFlag } from "@/components/ui/LocaleFlag";
import { useLocale } from "@/store/localeStore";
import { cn } from "@/lib/cn";
import { LocaleOptions } from "./LocaleOptions";
import { useT } from "@/i18n/useT";
import { currencySymbol } from "@/lib/money";

/** Region/currency selector: shows the active region and opens a picker popover. */
export function LocaleSelector({
  compact,
  tone = "default",
}: {
  compact?: boolean;
  /** `inverse` renders light-on-dark for the announcement bar. */
  tone?: "default" | "inverse";
}) {
  const inverse = tone === "inverse";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const { m, fmt, lang } = useT();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) =>
      !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={fmt(m.region.label, { region: m.region[locale.code as "US" | "EGY"], currency: locale.currency })}
        className={cn(
          "flex items-center gap-2 rounded-full transition-colors",
          inverse ? "text-white/90 hover:bg-white/10 focus-visible:outline-white" : "hover:bg-cream-100",
          compact ? "size-9 justify-center" : inverse ? "py-0.5 pe-2.5 ps-1" : "py-1 pe-3 ps-1",
        )}
      >
        <LocaleFlag locale={locale} className={inverse ? "size-4 ring-white/30" : undefined} />
        {!compact && inverse && (
          <span className="text-[12px] font-medium tracking-wide">
            {m.region[locale.code as "US" | "EGY"]} · {currencySymbol(locale, lang)}
          </span>
        )}
        {!compact && !inverse && (
          <span className="flex flex-col justify-center text-start leading-tight">
            <span className="text-[12px] font-medium">{locale.code}</span>
            <span className="text-[11px] text-taupe-500">
              {locale.currency} {currencySymbol(locale, lang)}
            </span>
          </span>
        )}
      </button>
      {open && (
        <div
          role="dialog"
          aria-label={m.region.choose}
          className="absolute top-full end-0 z-[60] mt-2 w-60 rounded-2xl bg-white p-2 text-start tracking-normal text-cocoa-900 shadow-[0_16px_40px_-16px_rgb(44_26_25/0.3)] ring-1 ring-cream-200"
        >
          <LocaleOptions onSelect={() => setOpen(false)} />
          <p className="px-2.5 pt-2 pb-1 text-xs leading-snug text-taupe-500">
            {fmt(m.region.note, { currency: locale.currency, symbol: currencySymbol(locale, lang) })}
          </p>
        </div>
      )}
    </div>
  );
}
