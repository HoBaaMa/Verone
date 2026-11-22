import type { ProductService } from "../contracts";
import { products } from "@/data/mock/products";
import { buildFacets, filterProducts, sortProducts } from "@/features/catalog/lib/productQuery";
import { withLatency } from "./latency";
import { localizeProduct } from "@/data/mock/i18n/localize";
import type { Lang } from "@/i18n/config";

/** Catalog in the requested language (search, sort and facets run on localized text). */
const catalog = (lang: Lang = "en") => products.map((p) => localizeProduct(p, lang));

export const mockProductService: ProductService = {
  async getProducts(query = {}) {
    const sorted = sortProducts(
      filterProducts(catalog(query.lang), query),
      query.sort,
      query.currency,
      query.lang,
    );
    const pageSize = query.pageSize ?? sorted.length;
    const page = query.page ?? 1;
    const items = sorted.slice((page - 1) * pageSize, page * pageSize);
    return withLatency({ items, total: sorted.length, page, pageSize });
  },
  async getProductBySlug(slug, lang) {
    return withLatency(catalog(lang).find((p) => p.slug === slug) ?? null);
  },
  async getFacets(query = {}) {
    return withLatency(buildFacets(catalog(query.lang), query), 0);
  },
  async getRelatedProducts(slug, limit = 4, lang) {
    const all = catalog(lang);
    const current = all.find((p) => p.slug === slug);
    const related = all
      .filter((p) => p.slug !== slug && p.categorySlug === current?.categorySlug)
      .slice(0, limit);
    return withLatency(related);
  },
  async getProductsByIds(ids, lang) {
    const all = catalog(lang);
    const found = ids.flatMap((id) => all.find((p) => p.id === id) ?? []);
    return withLatency(found);
  },
};
