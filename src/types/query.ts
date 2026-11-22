import type {
  Benefit,
  CollectionId,
  Concern,
  CurrencyCode,
  Formulation,
  ProductType,
  SkinType,
} from "./product";

export type SortOption = "best-selling" | "newest" | "price-asc" | "price-desc" | "name-asc";

export interface ProductQuery {
  category?: string;
  /** Top-level merchandising group (Skincare, Hair & Body, Sun & Sets). */
  collection?: CollectionId;
  /** Exact brand names, case-insensitive; matches any. */
  brands?: string[];
  search?: string;
  productTypes?: ProductType[];
  benefits?: Benefit[];
  skinTypes?: SkinType[];
  formulations?: Formulation[];
  concerns?: Concern[];
  /** Content language for names, descriptions and facet labels. Defaults to English. */
  lang?: "en" | "ar";
  /** Currency for price filtering, sorting and the facet price range. Defaults to USD. */
  currency?: CurrencyCode;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type FacetKey = "productTypes" | "benefits" | "skinTypes" | "formulations" | "concerns";

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

export interface Facet {
  key: FacetKey;
  label: string;
  options: FacetOption[];
}

export interface ProductFacets {
  /** Brands available in the current scope, counted against every other active filter. */
  brands: FacetOption[];
  facets: Facet[];
  priceRange: { min: number; max: number };
  inStockCount: number;
  onSaleCount: number;
}
