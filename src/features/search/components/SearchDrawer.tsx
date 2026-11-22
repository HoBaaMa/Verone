import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocation } from "react-router";
import { Link, useNavigate } from "@/i18n/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import type { Product } from "@/types";
import { Price } from "@/components/ui/Price";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { useProducts } from "@/features/catalog/hooks/useProducts";
import { ProductImage } from "@/features/product/components/ProductImage";
import { useUiStore } from "@/store/uiStore";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n/useT";
import {
  DRAWER_DURATION_MS,
  drawerOverlay,
  drawerOverlayTransition,
  drawerPanelShell,
  drawerPanelTransition,
} from "@/lib/drawerMotion";

const TRENDING_COUNT = 6;
const RESULT_COUNT = 8;
const DEBOUNCE_MS = 200;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useDebounced<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/** Slide-over search: live results while typing, best sellers when the field is empty. */
export function SearchDrawer() {
  const { m, fmt, lang } = useT();
  const open = useUiStore((s) => s.isSearchDrawerOpen);
  const close = useUiStore((s) => s.closeSearchDrawer);
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [term, setTerm] = useState("");
  const query = useDebounced(term.trim(), DEBOUNCE_MS);

  // Any navigation (result link, "view all", submit) dismisses the drawer.
  useEffect(() => close(), [pathname, search, close]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    // Focus once the slide-in has finished: focusing mid-transition makes mobile
    // browsers scroll the input into view, which snaps the panel open abruptly.
    const t = setTimeout(
      () => inputRef.current?.focus({ preventScroll: true }),
      reducedMotion() ? 0 : DRAWER_DURATION_MS,
    );
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = term.trim();
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
    close();
  };

  return (
    <div inert={!open}>
      <div
        onClick={close}
        aria-hidden
        className={cn(
          drawerOverlay,
          drawerOverlayTransition,
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      {/* Fixed clipping frame keeps the closed, off-screen panel from widening the page. */}
      <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
        <aside
          role="dialog"
          aria-modal="true"
          aria-label={m.search.title}
          aria-hidden={!open}
          className={cn(
            drawerPanelShell,
            "flex flex-col",
            drawerPanelTransition,
            // Slides in from the inline end: right in LTR, left in RTL.
            open ? "visible translate-x-0" : "invisible translate-x-full rtl:-translate-x-full",
          )}
        >
          <div className="shrink-0 px-6 pt-7 pb-5 sm:px-7">
            <div className="flex items-center justify-between">
              <h2 className="text-[26px] font-semibold tracking-[-0.03em]">{m.search.title}</h2>
              <button
                type="button"
                onClick={close}
                aria-label={m.search.close}
                className="grid size-10 place-items-center rounded-full border border-cream-200 transition-colors hover:bg-cream-100"
              >
                <X className="size-[18px]" strokeWidth={1.75} />
              </button>
            </div>

            <form
              role="search"
              onSubmit={submit}
              className="mt-6 flex h-14 items-center rounded-full border border-sand-300 bg-white p-1.5 ps-5 transition-colors focus-within:border-cocoa-900"
            >
              <input
                ref={inputRef}
                type="search"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder={m.search.placeholder}
                aria-label={m.search.label}
                className="h-full min-w-0 flex-1 bg-transparent text-[15px] placeholder:text-taupe-500 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
              />
              {term && (
                <button
                  type="button"
                  onClick={() => {
                    setTerm("");
                    inputRef.current?.focus();
                  }}
                  aria-label={m.search.clear}
                  className="me-1 grid size-8 place-items-center rounded-full text-taupe-500 hover:bg-cream-100 hover:text-cocoa-900"
                >
                  <X className="size-4" strokeWidth={1.75} />
                </button>
              )}
              <button
                type="submit"
                aria-label={m.search.submit}
                className="grid size-11 shrink-0 place-items-center rounded-full bg-cocoa-900 text-white transition-colors hover:bg-cocoa-700"
              >
                <Search className="size-[18px]" strokeWidth={2} />
              </button>
            </form>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-8 sm:px-7">
            {open && (query ? <SearchResults term={query} /> : <Trending />)}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Trending() {
  const { m, fmt, lang } = useT();
  const { data } = useProducts({ sort: "best-selling", pageSize: TRENDING_COUNT });
  return (
    <section aria-labelledby="search-trending">
      <h3 id="search-trending" className="mb-4 text-lg font-semibold tracking-tight">
        {m.search.trending}
      </h3>
      <ResultList products={data?.items} />
    </section>
  );
}

function SearchResults({ term }: { term: string }) {
  const { m, fmt, lang } = useT();
  const { data, loading } = useProducts({ search: term, pageSize: RESULT_COUNT });
  const total = data?.total ?? 0;

  if (data && total === 0 && !loading) {
    return (
      <div>
        <p className="rounded-2xl bg-cream-100 px-5 py-6 text-[15px] text-taupe-600">
          {m.search.noMatchPrefix} <span className="font-medium text-cocoa-900">“{term}”</span>
          {m.search.noMatchSuffix}
        </p>
        <div className="mt-8">
          <Trending />
        </div>
      </div>
    );
  }

  return (
    <section aria-labelledby="search-results" aria-live="polite">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h3 id="search-results" className="text-lg font-semibold tracking-tight">
          {m.search.products}
          {data && <span className="ms-2 text-sm font-normal text-taupe-500">{total}</span>}
        </h3>
        {total > 0 && (
          <Link
            to={`/shop?q=${encodeURIComponent(term)}`}
            className="group inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
          >
            {m.common.viewAll}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
      <ResultList products={data?.items} />
    </section>
  );
}

function ResultList({ products }: { products: Product[] | undefined }) {
  if (!products) {
    return (
      <ul className="flex flex-col gap-3" aria-hidden>
        {Array.from({ length: 4 }, (_, i) => (
          <li key={i} className="h-[116px] animate-pulse rounded-2xl bg-cream-100" />
        ))}
      </ul>
    );
  }
  return (
    <ul className="flex flex-col gap-3">
      {products.map((product) => (
        <li key={product.id}>
          <ResultCard product={product} />
        </li>
      ))}
    </ul>
  );
}

function ResultCard({ product }: { product: Product }) {
  return (
    <article className="group flex gap-4 rounded-2xl bg-cream-100 p-3 transition-colors hover:bg-cream-200/70">
      <Link
        to={`/product/${product.slug}`}
        tabIndex={-1}
        aria-hidden
        className="size-[88px] shrink-0 overflow-hidden rounded-xl bg-white"
      >
        <ProductImage image={product.images[0]} fallbackLabel={product.name} decorative />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-[11px] font-medium tracking-[0.14em] text-taupe-500 uppercase">
          {product.brand}
        </p>
        <h4 className="mt-0.5 line-clamp-2 text-[15px] leading-snug font-medium tracking-tight">
          <Link to={`/product/${product.slug}`} className="hover:text-cocoa-700">
            {product.name}
          </Link>
        </h4>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-2">
          <Price prices={product.prices} align="start" size="md" />
          <div className="w-[122px]">
            <AddToCartButton product={product} variant="primary" size="sm" />
          </div>
        </div>
      </div>
    </article>
  );
}
