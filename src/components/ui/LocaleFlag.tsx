import type { StoreLocale } from "@/config/locale";
import { cn } from "@/lib/cn";

/** Circular flag for a storefront region. */
export function LocaleFlag({ locale, className }: { locale: StoreLocale; className?: string }) {
  return (
    <img
      src={locale.flag}
      alt=""
      width={32}
      height={24}
      className={cn(
        "block size-6 shrink-0 rounded-full bg-white object-cover ring-1 ring-sand-300",
        className,
      )}
    />
  );
}
