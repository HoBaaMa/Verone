import type {
  CurrencyCode,
  FacetKey,
  Product,
  ProductFacets,
  ProductQuery,
  SortOption,
} from "@/types";
import { FACET_DEFINITIONS, facetText } from "@/data/mock/taxonomy";
import type { Lang } from "@/i18n/config";
import { inCollection } from "@/config/collections";
import { discountPercent, pricePoint } from "@/lib/pricing";

/**
 * Pure catalog logic. The mock service uses it today; once the ASP.NET Core
 * API owns filtering, these functions are no longer needed by the UI.
 */

const productFacetValues = (product: Product, key: FacetKey): string[] => {
  switch (key) {
    case "productTypes":
      return product.productTypes;
    case "benefits":
      return product.benefits;
    case "skinTypes":
      return product.skinTypes;
    case "formulations":
      return [product.formulation];
    case "concerns":
      return product.concerns;
  }
};

const matchesFacet = (product: Product, key: FacetKey, selected?: string[]) =>
  !selected?.length || productFacetValues(product, key).some((v) => selected.includes(v));

const matchesSearch = (product: Product, search?: string) => {
  const term = search?.trim().toLowerCase();
  if (!term) return true;
  return [
    product.brand,
    product.name,
    // Match names in every language, so English terms work on Arabic pages and vice versa.
    ...Object.values(product.titles ?? {}).flatMap((t) => [t.name, t.subtitle]),
    product.subtitle,
    product.description,
    ...product.keyIngredients,
  ]
    .join(" ")
    .toLowerCase()
    .includes(term);
};

type Predicate = (product: Product) => boolean;

const matchesBrand = (product: Product, brands?: string[]) =>
  !brands?.length || brands.some((b) => b.toLowerCase() === product.brand.toLowerCase());

function buildPredicates(query: ProductQuery, omit?: FacetKey | "brands"): Predicate[] {
  const price = (p: Product) => pricePoint(p.prices, query.currency).price;
  const predicates: Predicate[] = [
    (p) => !query.category || p.categorySlug === query.category,
    (p) => !query.collection || inCollection(p, query.collection),
    (p) => omit === "brands" || matchesBrand(p, query.brands),
    (p) => matchesSearch(p, query.search),
    (p) => query.minPrice === undefined || price(p) >= query.minPrice,
    (p) => query.maxPrice === undefined || price(p) <= query.maxPrice,
    (p) => !query.inStockOnly || p.inStock,
    (p) => !query.onSaleOnly || discountPercent(pricePoint(p.prices, query.currency)) > 0,
  ];
  for (const { key } of FACET_DEFINITIONS) {
    if (key !== omit) predicates.push((p) => matchesFacet(p, key, query[key]));
  }
  return predicates;
}

export function filterProducts(products: Product[], query: ProductQuery): Product[] {
  const predicates = buildPredicates(query);
  return products.filter((p) => predicates.every((test) => test(p)));
}

type Sorter = (a: Product, b: Product, currency?: CurrencyCode, lang?: Lang) => number;
const priceOf = (p: Product, currency?: CurrencyCode) => pricePoint(p.prices, currency).price;

const sorters: Record<SortOption, Sorter> = {
  "best-selling": (a, b) => b.popularity - a.popularity,
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  "price-asc": (a, b, c) => priceOf(a, c) - priceOf(b, c),
  "price-desc": (a, b, c) => priceOf(b, c) - priceOf(a, c),
  "name-asc": (a, b, _c, lang) => a.name.localeCompare(b.name, lang),
};

export function sortProducts(
  products: Product[],
  sort: SortOption = "best-selling",
  currency?: CurrencyCode,
  lang?: Lang,
): Product[] {
  return [...products].sort((a, b) => sorters[sort](a, b, currency, lang));
}

/**
 * Facet counts reflect every active filter except the facet itself, so
 * selecting "Dry" does not zero out the other skin type options.
 */
export function buildFacets(products: Product[], query: ProductQuery): ProductFacets {
  const scoped = products.filter(
    (p) =>
      (!query.category || p.categorySlug === query.category) &&
      (!query.collection || inCollection(p, query.collection)),
  );
  const prices = scoped.map((p) => priceOf(p, query.currency));

  const facets = FACET_DEFINITIONS.map(({ key }) => {
    const { label, labels } = facetText(key, query.lang ?? "en");
    const predicates = buildPredicates(query, key);
    const pool = scoped.filter((p) => predicates.every((test) => test(p)));
    const options = Object.entries(labels)
      .map(([value, optionLabel]) => ({
        value,
        label: optionLabel,
        count: pool.filter((p) => productFacetValues(p, key).includes(value)).length,
      }))
      .filter((option) => scoped.some((p) => productFacetValues(p, key).includes(option.value)));
    return { key, label, options };
  });

  const brandPredicates = buildPredicates(query, "brands");
  const brandPool = scoped.filter((p) => brandPredicates.every((test) => test(p)));
  const brands = [...new Set(scoped.map((p) => p.brand))]
    .sort((a, b) => a.localeCompare(b))
    .map((brand) => ({
      value: brand,
      label: brand,
      count: brandPool.filter((p) => p.brand === brand).length,
    }));

  const stockPredicates = buildPredicates({ ...query, inStockOnly: false });
  const salePredicates = buildPredicates({ ...query, onSaleOnly: false });
  return {
    brands,
    facets,
    priceRange: {
      min: 0,
      max: prices.length ? Math.ceil(Math.max(...prices) / 10) * 10 : 100,
    },
    inStockCount: scoped.filter((p) => p.inStock && stockPredicates.every((test) => test(p)))
      .length,
    onSaleCount: scoped.filter(
      (p) =>
        discountPercent(pricePoint(p.prices, query.currency)) > 0 &&
        salePredicates.every((test) => test(p)),
    ).length,
  };
}
