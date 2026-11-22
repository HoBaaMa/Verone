import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router";
import type { FacetKey, ProductQuery, ProductType, SortOption } from "@/types";
import { FACET_DEFINITIONS } from "@/data/mock/taxonomy";
import { useLocale } from "@/store/localeStore";
import { parseCollection } from "@/config/collections";

/** URL parameter names for each facet, keeping shareable URLs short. */
const FACET_PARAMS: Record<FacetKey, string> = {
  productTypes: "type",
  benefits: "benefit",
  skinTypes: "skin",
  formulations: "formulation",
  concerns: "concern",
};

/** Labels live in messages under `catalog.sort`. */
export const SORT_OPTIONS: { value: SortOption }[] = [
  { value: "best-selling" },
  { value: "newest" },
  { value: "price-asc" },
  { value: "price-desc" },
  { value: "name-asc" },
];

const toNumber = (value: string | null) => {
  if (value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

/** Filter state lives in the URL so results are shareable and survive refresh. */
export function useCatalogFilters() {
  const [params, setParams] = useSearchParams();

  const query = useMemo<ProductQuery>(() => {
    const q: ProductQuery = {
      search: params.get("q") ?? undefined,
      brands: params.getAll("brand").length ? params.getAll("brand") : undefined,
      collection: parseCollection(params.get("collection")),
      minPrice: toNumber(params.get("min")),
      maxPrice: toNumber(params.get("max")),
      inStockOnly: params.get("stock") === "1",
      page: Math.max(1, Math.floor(toNumber(params.get("page")) ?? 1)),
      onSaleOnly: params.get("sale") === "1",
      sort: SORT_OPTIONS.some((o) => o.value === params.get("sort"))
        ? (params.get("sort") as SortOption)
        : "best-selling",
    };
    for (const { key, labels } of FACET_DEFINITIONS) {
      const values = params.getAll(FACET_PARAMS[key]).filter((v) => v in labels);
      if (values.length) (q as Record<string, unknown>)[key] = values;
    }
    return q;
  }, [params]);

  /** Any refinement returns to page 1 so results never land on an empty page. */
  const update = useCallback(
    (mutate: (next: URLSearchParams) => void) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          mutate(next);
          next.delete("page");
          return next;
        },
        { replace: true, preventScrollReset: true },
      ),
    [setParams],
  );

  /** Page changes push history entries so Back returns to the previous page. */
  const setPage = useCallback(
    (page: number) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (page <= 1) next.delete("page");
          else next.set("page", String(page));
          return next;
        },
        { preventScrollReset: true },
      ),
    [setParams],
  );

  const toggleFacet = useCallback(
    (key: FacetKey, value: string, checked: boolean) =>
      update((next) => {
        const param = FACET_PARAMS[key];
        const values = next.getAll(param).filter((v) => v !== value);
        next.delete(param);
        for (const v of checked ? [...values, value] : values) next.append(param, v);
      }),
    [update],
  );

  // Price bounds are in the active currency, so a region switch invalidates them.
  const { currency } = useLocale();
  const currencyRef = useRef(currency);
  useEffect(() => {
    if (currencyRef.current === currency) return;
    currencyRef.current = currency;
    update((next) => {
      next.delete("min");
      next.delete("max");
    });
  }, [currency, update]);

  const setPriceRange = useCallback(
    (min: number | undefined, max: number | undefined) =>
      update((next) => {
        if (min === undefined || min <= 0) next.delete("min");
        else next.set("min", String(min));
        if (max === undefined) next.delete("max");
        else next.set("max", String(max));
      }),
    [update],
  );

  const setInStockOnly = useCallback(
    (value: boolean) => update((next) => (value ? next.set("stock", "1") : next.delete("stock"))),
    [update],
  );

  const setOnSaleOnly = useCallback(
    (value: boolean) => update((next) => (value ? next.set("sale", "1") : next.delete("sale"))),
    [update],
  );

  const setSort = useCallback(
    (sort: SortOption) =>
      update((next) => (sort === "best-selling" ? next.delete("sort") : next.set("sort", sort))),
    [update],
  );

  const clearSearch = useCallback(() => update((next) => next.delete("q")), [update]);

  /** Writes the sidebar's staged selections (brand, type, price) in one URL update. */
  const applyFilters = useCallback(
    (draft: {
      brands: string[];
      productTypes: ProductType[];
      minPrice?: number;
      maxPrice?: number;
    }) =>
      update((next) => {
        next.delete("brand");
        for (const b of draft.brands) next.append("brand", b);
        next.delete(FACET_PARAMS.productTypes);
        for (const t of draft.productTypes) next.append(FACET_PARAMS.productTypes, t);
        if (draft.minPrice === undefined || draft.minPrice <= 0) next.delete("min");
        else next.set("min", String(draft.minPrice));
        if (draft.maxPrice === undefined) next.delete("max");
        else next.set("max", String(draft.maxPrice));
      }),
    [update],
  );

  /**
   * Clears every refinement but keeps the page context: the Sale view (`sale`)
   * and the collection being browsed stay put.
   */
  const clearFilters = useCallback(
    () =>
      update((next) => {
        for (const param of [...Object.values(FACET_PARAMS), "min", "max", "stock", "brand"])
          next.delete(param);
      }),
    [update],
  );

  const activeFilterCount =
    FACET_DEFINITIONS.reduce((sum, { key }) => sum + (query[key]?.length ?? 0), 0) +
    (query.brands?.length ?? 0) +
    (query.minPrice !== undefined || query.maxPrice !== undefined ? 1 : 0) +
    (query.inStockOnly ? 1 : 0);

  return {
    query,
    toggleFacet,
    setPriceRange,
    setInStockOnly,
    setOnSaleOnly,
    setSort,
    clearSearch,
    setPage,
    applyFilters,
    clearFilters,
    activeFilterCount,
  };
}

export type CatalogFilters = ReturnType<typeof useCatalogFilters>;
