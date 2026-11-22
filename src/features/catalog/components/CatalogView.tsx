import { useEffect, useMemo, useRef, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useCatalogFilters, type CatalogFilters } from "../hooks/useCatalogFilters";
import { FACET_DEFINITIONS, facetText } from "@/data/mock/taxonomy";
import { useProductFacets, useProducts } from "../hooks/useProducts";
import { FilterPanel } from "./FilterPanel";
import { ProductGrid, ProductGridSkeleton } from "./ProductGrid";
import { Pagination } from "./Pagination";
import { PromoBanner } from "./PromoBanner";

/** Products per catalog page. */
const PAGE_SIZE = 12;
import { SortSelect } from "./SortSelect";
import { useT } from "@/i18n/useT";

/** Filterable, sortable product listing. Optionally scoped to a category. */
export function CatalogView({ category }: { category?: string }) {
  const { m, fmt } = useT();
  const filters = useCatalogFilters();
  const query = useMemo(
    () => ({ ...filters.query, category, pageSize: PAGE_SIZE }),
    [filters.query, category],
  );
  const { data: result, loading } = useProducts(query);
  // Facets describe the whole result set, not just the current page.
  const facetQuery = useMemo(() => ({ ...query, page: undefined, pageSize: undefined }), [query]);
  const { data: facets } = useProductFacets(facetQuery);
  const [desktopFiltersVisible, setDesktopFiltersVisible] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const floatingFilterVisible = useFloatingFilter(toolbarRef, resultsRef);

  const page = query.page ?? 1;
  const pageCount = result ? Math.max(1, Math.ceil(result.total / PAGE_SIZE)) : 1;
  // A stale link past the last page (e.g. after filtering) snaps back to the last one.
  useEffect(() => {
    if (result && page > pageCount) filters.setPage(pageCount);
  }, [result, page, pageCount, filters]);

  const goToPage = (next: number) => {
    filters.setPage(next);
    // Bring the toolbar back under the sticky header so the new page starts at the top.
    const top = (toolbarRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 120;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  useEffect(() => {
    document.body.style.overflow = mobileFiltersOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileFiltersOpen]);

  const products = result?.items ?? [];
  const columns = desktopFiltersVisible ? "fluid-sidebar" : "fluid";

  return (
    <section className="mt-6">
      <div ref={toolbarRef} className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-sand-300 hover:border-cocoa-900 max-lg:hidden"
            onClick={() => setDesktopFiltersVisible((v) => !v)}
            aria-expanded={desktopFiltersVisible}
          >
            <SlidersHorizontal className="size-3.5" strokeWidth={1.75} />
            {fmt(desktopFiltersVisible ? m.catalog.hideFilter : m.catalog.showFilter, {
              count: filters.activeFilterCount,
            })}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-sand-300 lg:hidden"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <SlidersHorizontal className="size-3.5" strokeWidth={1.75} />
            {fmt(m.catalog.filter, { count: filters.activeFilterCount })}
          </Button>
          <p className="truncate text-[13px] text-taupe-500 tabular-nums" aria-live="polite">
            {result
              ? fmt(result.total === 1 ? m.catalog.result : m.catalog.results, {
                  count: result.total,
                })
              : "—"}
          </p>
          {query.search && (
            <button
              onClick={filters.clearSearch}
              className="hidden items-center gap-1.5 rounded-full bg-cream-100 py-1.5 pe-2 ps-3 text-xs font-medium hover:bg-cream-200 sm:inline-flex"
            >
              “{query.search}”
              <X className="size-3" aria-label={m.catalog.clearSearch} />
            </button>
          )}
        </div>
        <SortSelect value={query.sort ?? "best-selling"} onChange={filters.setSort} />
      </div>

      <HiddenFilterChips filters={filters} />

      <div
        className={cn(
          "mt-8 grid gap-10",
          desktopFiltersVisible && "lg:grid-cols-[220px_1fr] xl:grid-cols-[240px_1fr]",
        )}
      >
        {desktopFiltersVisible && (
          <aside className="hidden lg:block" aria-label={m.catalog.productFilters}>
            <div className="sticky top-36">
              <FilterPanel facets={facets} filters={filters} />
            </div>
          </aside>
        )}

        <div
          ref={resultsRef}
          className={cn("transition-opacity", loading && result && "opacity-60")}
        >
          {!result ? (
            <ProductGridSkeleton columns={columns} />
          ) : products.length === 0 ? (
            <EmptyState onReset={() => (filters.clearFilters(), filters.clearSearch())} />
          ) : (
            <>
              <ProductGrid products={products} columns={columns} />
              <Pagination
                page={page}
                pageCount={pageCount}
                total={result.total}
                pageSize={PAGE_SIZE}
                onChange={goToPage}
              />
              {page === 1 && (
                <div className="mt-14">
                  <PromoBanner />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile: floating filter shortcut once the toolbar has scrolled away over the results. */}
      <button
        type="button"
        onClick={() => setMobileFiltersOpen(true)}
        aria-label={
          filters.activeFilterCount
            ? fmt(m.catalog.openFiltersActive, { count: filters.activeFilterCount })
            : m.catalog.openFilters
        }
        aria-hidden={!floatingFilterVisible}
        tabIndex={floatingFilterVisible ? undefined : -1}
        className={cn(
          "fixed bottom-5 start-4 z-40 grid size-12 place-items-center rounded-full bg-cocoa-900 text-white shadow-[0_12px_28px_-10px_rgb(44_26_25/0.6)] transition-[opacity,translate,scale] duration-300 ease-(--ease-out-soft) active:scale-95 motion-reduce:transition-none lg:hidden",
          floatingFilterVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <SlidersHorizontal className="size-[18px]" strokeWidth={1.75} />
        {filters.activeFilterCount > 0 && (
          <span className="absolute -top-0.5 -end-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-sale px-1 text-[10px] font-semibold text-white tabular-nums ring-2 ring-white">
            {filters.activeFilterCount}
          </span>
        )}
      </button>

      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-[100] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={m.catalog.filters}
        >
          <div
            className="absolute inset-0 bg-cocoa-900/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 start-0 flex w-[min(360px,88vw)] flex-col bg-white">
            <div className="flex items-center justify-between border-b border-cream-200 px-5 py-4">
              <h2 className="text-lg font-semibold tracking-tight">{m.catalog.filters}</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="grid size-9 place-items-center rounded-full hover:bg-cream-100"
                aria-label={m.catalog.closeFilters}
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pt-2 pb-8">
              <FilterPanel
                facets={facets}
                filters={filters}
                onApplied={() => setMobileFiltersOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  const { m } = useT();
  return (
    <div className="flex flex-col items-center rounded-[var(--radius-card)] bg-cream-100 px-6 py-20 text-center">
      <h3 className="text-2xl font-semibold tracking-tight">{m.catalog.emptyTitle}</h3>
      <p className="mt-2 max-w-sm text-sm text-taupe-600">{m.catalog.emptyText}</p>
      <Button variant="primary" className="mt-6" onClick={onReset}>
        {m.catalog.resetFilters}
      </Button>
    </div>
  );
}

/**
 * Filters that have no sidebar control (concern, skin type, benefit, formulation —
 * typically set from the header menus) are surfaced as removable chips.
 */
function HiddenFilterChips({ filters }: { filters: CatalogFilters }) {
  const { query, toggleFacet, setInStockOnly } = filters;
  const { m, fmt, lang } = useT();
  const chips = FACET_DEFINITIONS.filter(({ key }) => key !== "productTypes").flatMap(({ key }) => {
    const { label, labels } = facetText(key, lang);
    return (query[key] ?? []).map((value) => ({
      id: `${key}:${value}`,
      text: `${label}: ${labels[value] ?? value}`,
      remove: () => toggleFacet(key, value, false),
    }));
  });
  if (query.inStockOnly)
    chips.push({ id: "stock", text: m.catalog.inStock, remove: () => setInStockOnly(false) });
  if (!chips.length) return null;

  return (
    <ul className="mt-4 flex flex-wrap gap-2" aria-label={m.catalog.activeFilters}>
      {chips.map((chip) => (
        <li key={chip.id}>
          <button
            type="button"
            onClick={chip.remove}
            className="inline-flex items-center gap-1.5 rounded-full bg-cream-100 py-1.5 pe-2 ps-3 text-xs font-medium transition-colors hover:bg-cream-200"
          >
            {chip.text}
            <X className="size-3" aria-label={fmt(m.catalog.removeFilter, { name: chip.text })} />
          </button>
        </li>
      ))}
    </ul>
  );
}

/** True while the results are on screen but the toolbar (with its Filter button) is not. */
function useFloatingFilter(
  toolbarRef: React.RefObject<HTMLElement | null>,
  resultsRef: React.RefObject<HTMLElement | null>,
) {
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [resultsVisible, setResultsVisible] = useState(false);
  useEffect(() => {
    const toolbar = toolbarRef.current;
    const results = resultsRef.current;
    if (!toolbar || !results) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === toolbar) setToolbarVisible(entry.isIntersecting);
          else setResultsVisible(entry.isIntersecting);
        }
      },
      // The sticky mobile header covers the top ~100px, so treat that band as off-screen.
      { rootMargin: "-100px 0px 0px 0px" },
    );
    io.observe(toolbar);
    io.observe(results);
    return () => io.disconnect();
  }, [toolbarRef, resultsRef]);
  return !toolbarVisible && resultsVisible;
}
