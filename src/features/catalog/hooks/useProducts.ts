import type { ProductQuery } from "@/types";
import { productService } from "@/services";
import { useAsync } from "@/lib/useAsync";
import { useLocale } from "@/store/localeStore";
import { useLang } from "@/i18n/useLang";

/** Queries run in the shopper's currency and language so prices, text and facets match what they see. */
function useLocalQuery(query: ProductQuery): ProductQuery {
  const { currency } = useLocale();
  const lang = useLang();
  return { currency, lang, ...query };
}

export function useProducts(query: ProductQuery) {
  const localQuery = useLocalQuery(query);
  const key = JSON.stringify(localQuery);
  return useAsync(() => productService.getProducts(localQuery), [key]);
}

export function useProductFacets(query: ProductQuery) {
  const localQuery = useLocalQuery(query);
  const key = JSON.stringify(localQuery);
  return useAsync(() => productService.getFacets(localQuery), [key]);
}
