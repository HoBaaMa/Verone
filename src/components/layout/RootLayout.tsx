import { useLayoutEffect } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router";
import { dirOf } from "@/i18n/config";
import { useLang } from "@/i18n/useLang";
import { AccountDrawer } from "@/features/account/components/AccountDrawer";
import { CartDrawer } from "@/features/cart/components/CartDrawer";
import { SearchDrawer } from "@/features/search/components/SearchDrawer";
import { AnnouncementBar } from "./AnnouncementBar";
import { Footer } from "./Footer";
import { Header } from "./header/Header";
import { ScrollToTopButton } from "./ScrollToTopButton";

export function RootLayout() {
  const { pathname } = useLocation();
  const lang = useLang();

  // Language and direction come from the URL (`/ar/...` → Arabic, RTL).
  useLayoutEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dirOf(lang);
  }, [lang]);
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        {/* Keyed by path so each page fades in on navigation (not on filter/sort changes). */}
        <div key={pathname} className="animate-page-in motion-reduce:animate-none">
          <Outlet />
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <AccountDrawer />
      <SearchDrawer />
      <ScrollToTopButton />
      <ScrollRestoration />
    </div>
  );
}
