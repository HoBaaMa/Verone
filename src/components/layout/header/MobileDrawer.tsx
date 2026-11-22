import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { ChevronDown, ChevronRight, Flame, X } from "lucide-react";
import type { CollectionId } from "@/types";
import { LocaleFlag } from "@/components/ui/LocaleFlag";
import { useLocale } from "@/store/localeStore";
import { HEADER_NAV, MEGA_MENUS } from "@/config/navigation";
import { COLLECTIONS } from "@/config/collections";
import { cn } from "@/lib/cn";
import {
  DRAWER_DURATION_MS,
  drawerOverlayTransition,
  drawerPanelTransition,
} from "@/lib/drawerMotion";
import { LocaleOptions } from "./LocaleOptions";
import logoSrc from "@/imports/Veron_-Logo.png";
import { useT } from "@/i18n/useT";
import { currencySymbol } from "@/lib/money";
import { LanguageSwitch } from "../LanguageSwitch";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  activeId?: string;
}

const rowClass =
  "flex w-full items-center justify-between border-b border-cream-200 py-4 text-start text-lg font-medium tracking-tight";

function Row({
  to,
  onClick,
  children,
  active,
}: {
  to?: string;
  onClick: () => void;
  children: ReactNode;
  active?: boolean;
}) {
  const content = (
    <>
      <span className={cn(active && "underline decoration-1 underline-offset-[6px]")}>
        {children}
      </span>
      <ChevronRight className="size-4 text-taupe-500" strokeWidth={1.75} aria-hidden />
    </>
  );
  return to ? (
    <Link to={to} onClick={onClick} className={rowClass} aria-current={active ? "page" : undefined}>
      {content}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={rowClass}>
      {content}
    </button>
  );
}

export function MobileDrawer({ open, onClose, activeId }: MobileDrawerProps) {
  /** Expanded collection accordion, if any. */
  const [expanded, setExpanded] = useState<CollectionId | null>(null);
  const [localeOpen, setLocaleOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const locale = useLocale();
  const { m, fmt, l, lang } = useT();

  useEffect(() => {
    if (!open) {
      // Collapse accordions after the slide-out finishes.
      const t = setTimeout(() => setExpanded(null), DRAWER_DURATION_MS);
      return () => clearTimeout(t);
    }
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div className="lg:hidden" inert={!open}>
      <div
        onClick={onClose}
        aria-hidden
        className={cn(
          "fixed inset-0 z-[90] h-screen w-screen bg-cocoa-900/40",
          drawerOverlayTransition,
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={m.header.menu}
        aria-hidden={!open}
        className={cn(
          "fixed top-0 start-0 z-[100] h-screen w-[85vw] max-w-[380px] bg-white",
          drawerPanelTransition,
          open ? "visible translate-x-0" : "invisible -translate-x-full rtl:translate-x-full",
        )}
      >
        <div className="scrollbar-visible flex h-full flex-col overflow-y-auto p-6">
          <div className="flex items-center justify-between">
            <img src={logoSrc} alt="Veroné" width={2172} height={724} className="h-6 w-auto" />
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={m.header.closeMenu}
              className="grid size-6 place-items-center rounded-full hover:bg-cream-100"
            >
              <X className="size-5" strokeWidth={1.75} />
            </button>
          </div>

          <nav aria-label={m.header.primaryNav} className="mt-6">
            {HEADER_NAV.map((item) =>
              item.megaMenu ? (
                <CollectionAccordion
                  key={item.id}
                  collection={item.megaMenu}
                  open={expanded === item.megaMenu}
                  active={activeId === item.id}
                  onToggle={() =>
                    setExpanded((current) => (current === item.megaMenu ? null : item.megaMenu!))
                  }
                  onNavigate={onClose}
                />
              ) : (
                <Row key={item.id} to={item.to} onClick={onClose} active={activeId === item.id}>
                  <span
                    className={cn(
                      "inline-flex items-center gap-2",
                      item.id === "sale" && "text-sale",
                    )}
                  >
                    {l(item.label)}
                    {item.badge && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-sale px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white no-underline">
                        {l(item.badge)}
                        <Flame className="size-2.5 fill-current" strokeWidth={1.5} aria-hidden />
                      </span>
                    )}
                  </span>
                </Row>
              ),
            )}
          </nav>

          <div className="mt-auto border-t border-cream-200 pt-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[13px] text-taupe-500">{m.lang.name}</span>
              <LanguageSwitch className="-me-2.5" />
            </div>
            <button
              type="button"
              onClick={() => setLocaleOpen((o) => !o)}
              aria-expanded={localeOpen}
              className="flex w-full items-center justify-between gap-3"
            >
              <span className="flex items-center gap-2.5 text-[15px] font-medium">
                <LocaleFlag locale={locale} />
                {m.region[locale.code as "US" | "EGY"]}
              </span>
              <ChevronRight
                className={cn(
                  "size-4 text-taupe-500 transition-transform",
                  localeOpen && "rotate-90 rtl:-rotate-90",
                )}
                strokeWidth={1.75}
              />
            </button>
            <p className="mt-2 text-[13px] leading-snug text-taupe-500">
              {locale.currency} {currencySymbol(locale, lang)}
            </p>
            {localeOpen && (
              <div className="mt-3">
                <LocaleOptions onSelect={() => setLocaleOpen(false)} />
                <p className="mt-3 text-xs leading-snug text-taupe-500">{fmt(m.region.note, { currency: locale.currency, symbol: currencySymbol(locale, lang) })}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

function CollectionAccordion({
  collection,
  open,
  active,
  onToggle,
  onNavigate,
}: {
  collection: CollectionId;
  open: boolean;
  active: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const { m, fmt, l } = useT();
  const label = l(COLLECTIONS[collection].label);
  const panelId = `mobile-menu-${collection}`;
  return (
    <div className="border-b border-cream-200">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between py-4 text-start text-lg font-medium tracking-tight"
      >
        <span className={cn(active && "underline decoration-1 underline-offset-[6px]")}>
          {label}
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-taupe-500 transition-transform duration-300",
            open && "rotate-180",
          )}
          strokeWidth={1.75}
          aria-hidden
        />
      </button>
      <div
        id={panelId}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-5">
            <Link
              to={`/shop?collection=${collection}`}
              onClick={onNavigate}
              className="inline-flex items-center gap-1 text-[15px] font-medium underline underline-offset-4"
            >
              {fmt(m.common.shopAll, { label })}
              <ChevronRight className="size-4" strokeWidth={1.75} aria-hidden />
            </Link>
            {MEGA_MENUS[collection].columns.map((column) => (
              <div key={column.title.en} className="mt-5">
                <p className="text-[11px] font-medium tracking-[0.18em] text-taupe-500 uppercase">
                  {l(column.title)}
                </p>
                <ul className="mt-2.5 flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        onClick={onNavigate}
                        className="text-[15px] tracking-tight text-cocoa-800 hover:text-taupe-600"
                      >
                        {l(link.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
