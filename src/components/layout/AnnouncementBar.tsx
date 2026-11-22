import { Container } from "@/components/ui/Container";
import { SHIPPING_RULES } from "@/features/cart/lib/cartCalculations";
import { useLocale } from "@/store/localeStore";
import { useMoney } from "@/lib/money";
import { LocaleSelector } from "./header/LocaleSelector";
import { useT } from "@/i18n/useT";
import { LanguageSwitch } from "./LanguageSwitch";

export function AnnouncementBar() {
  const money = useMoney();
  const { currency } = useLocale();
  const { m, fmt } = useT();
  return (
    // Raised above the sticky header so the region popover isn't covered by it.
    <div className="relative z-[60] bg-cocoa-900 text-xs tracking-wide text-white/90">
      <Container className="grid min-h-8 grid-cols-[1fr_auto_1fr] items-center py-1.5 lg:py-1">
        <span aria-hidden className="hidden lg:block" />
        <p className="col-span-3 text-center lg:col-span-1">
          {fmt(m.announcement.freeShipping, { amount: money(SHIPPING_RULES[currency].freeOver) })}
        </p>
        <div className="hidden items-center gap-1 justify-self-end lg:flex">
          <LanguageSwitch tone="inverse" />
          <span aria-hidden className="h-3.5 w-px bg-white/20" />
          <LocaleSelector tone="inverse" />
        </div>
      </Container>
    </div>
  );
}
