import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useLocation } from "react-router";
import { Link } from "@/i18n/navigation";
import { Flame, Menu, Search } from "lucide-react";
import type { CollectionId } from "@/types";
import { Container } from "@/components/ui/Container";
import { getActiveNavId, HEADER_NAV, MEGA_MENUS } from "@/config/navigation";
import { cn } from "@/lib/cn";
import { Logo } from "../Logo";
import { HeaderActions, headerIconClass, iconButtonClass } from "./HeaderActions";
import { MegaMenu } from "./MegaMenu";
import { MobileDrawer } from "./MobileDrawer";
import { useUiStore } from "@/store/uiStore";
import { useT } from "@/i18n/useT";

export function Header() {
  const { pathname, search } = useLocation();
  const { m, l } = useT();
  const activeId = getActiveNavId(pathname, search);
  const megaIdBase = useId();
  const megaId = (collection: CollectionId) => `${megaIdBase}-${collection}`;
  /** Which collection's mega-menu is open, if any. */
  const [megaOpen, setMegaOpen] = useState<CollectionId | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const closeMega = useCallback(() => setMegaOpen(null), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const searchOpen = useUiStore((s) => s.isSearchDrawerOpen);
  const openSearchDrawer = useUiStore((s) => s.openSearchDrawer);
  const openSearch = useCallback(() => {
    setMegaOpen(null);
    openSearchDrawer();
  }, [openSearchDrawer]);

  useEffect(() => {
    setMegaOpen(null);
    setDrawerOpen(false);
  }, [pathname, search]);

  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMegaOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [megaOpen]);

  return (
    <>
      <header
        ref={headerRef}
        onMouseLeave={closeMega}
        onBlur={(e) => !headerRef.current?.contains(e.relatedTarget as Node) && closeMega()}
        className="sticky top-0 z-50 rounded-b-3xl border-b border-cream-200 bg-white shadow-[0_12px_32px_-24px_rgb(44_26_25/0.35)]"
      >
        {/* Equal side columns keep the logo optically centred regardless of side widths. */}
        <Container className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 lg:h-[76px] lg:gap-6">
          {/* Left — mobile: menu + search; desktop: primary navigation */}
          <div className="flex min-w-0 items-center">
            <div className="-ms-2 flex items-center lg:hidden">
              <button
                type="button"
                className={iconButtonClass}
                onClick={() => setDrawerOpen(true)}
                aria-label={m.header.openMenu}
                aria-expanded={drawerOpen}
              >
                <Menu className={headerIconClass} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                className={iconButtonClass}
                onClick={openSearch}
                aria-label={m.common.search}
                aria-haspopup="dialog"
                aria-expanded={searchOpen}
              >
                <Search className={headerIconClass} strokeWidth={1.75} />
              </button>
            </div>

            <nav aria-label={m.header.primaryNav} className="hidden items-center gap-4 lg:flex xl:gap-8">
              {HEADER_NAV.map((item) => {
                const menu = item.megaMenu;
                const expanded = !!menu && megaOpen === menu;
                const highlighted = activeId === item.id || expanded;
                return (
                  <Link
                    key={item.id}
                    to={item.to}
                    onMouseEnter={() => setMegaOpen(menu ?? null)}
                    onFocus={() => setMegaOpen(menu ?? null)}
                    aria-current={activeId === item.id ? "page" : undefined}
                    {...(menu && { "aria-expanded": expanded, "aria-controls": megaId(menu) })}
                    className={cn(
                      "relative py-2 text-[13px] font-medium whitespace-nowrap underline-offset-[6px] transition-colors hover:underline xl:text-[15px]",
                      highlighted && "underline decoration-1",
                      item.id === "sale" && "text-sale",
                    )}
                  >
                    {item.badge && <NavBadge label={l(item.badge)} />}
                    {l(item.label)}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Centre — logo */}
          <div onMouseEnter={closeMega} className="justify-self-center">
            <Logo />
          </div>

          {/* Right — search (desktop), account, wishlist, cart */}
          <div onMouseEnter={closeMega} className="-me-2 justify-self-end">
            <HeaderActions
              className="gap-0.5 lg:gap-3"
              onSearchClick={openSearch}
              searchOpen={searchOpen}
            />
          </div>
        </Container>

        {/* Desktop only — its fixed column layout would overflow narrow viewports. */}
        <div className="hidden lg:block">
          {Object.values(MEGA_MENUS).map((menu) => (
            <MegaMenu
              key={menu.collection}
              id={megaId(menu.collection)}
              open={megaOpen === menu.collection}
              menu={menu}
              onNavigate={closeMega}
            />
          ))}
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={closeDrawer} activeId={activeId} />
    </>
  );
}

/** Floating promo tag above a nav link; absolutely positioned so the row stays aligned. */
export function NavBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute bottom-full left-1/2 mb-0.5 inline-flex -translate-x-1/2 items-center gap-0.5 rounded-full bg-sale px-1.5 py-[3px] text-[9px] leading-none font-semibold tracking-wide whitespace-nowrap text-white no-underline shadow-[0_4px_10px_-4px_rgb(229_72_77/0.7)] xl:text-[10px]",
        className,
      )}
    >
      {label}
      <Flame className="size-2.5 fill-current" strokeWidth={1.5} aria-hidden />
    </span>
  );
}
