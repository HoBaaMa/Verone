import type { Lang } from "@/i18n/config";
import type { Article, Category, ConcernTile, HeroSlide, Product } from "@/types";
import { articlesAr, categoriesAr, concernTilesAr, heroSlidesAr } from "./content.ar";
import { productsAr } from "./products.ar";

/**
 * Mock stand-in for server-side localization. The real API will return these
 * fields already translated based on the request language.
 */
export function localizeProduct(product: Product, lang: Lang): Product {
  const ar = productsAr[product.id];
  const titles = {
    en: { name: product.name, subtitle: product.subtitle, size: product.size },
    ar: ar
      ? { name: ar.name, subtitle: ar.subtitle, size: ar.size }
      : { name: product.name, subtitle: product.subtitle, size: product.size },
  };
  if (lang !== "ar" || !ar) return { ...product, titles };
  return {
    ...product,
    titles,
    name: titles.ar.name,
    subtitle: titles.ar.subtitle,
    size: ar.size,
    description: ar.description,
    keyIngredients: ar.keyIngredients,
    howToUse: ar.howToUse,
    images: product.images.map((image, i) => ({ ...image, alt: ar.imageAlts[i] ?? image.alt })),
  };
}

export function localizeCategory(category: Category, lang: Lang): Category {
  const ar = lang === "ar" ? categoriesAr[category.slug] : undefined;
  return ar ? { ...category, ...ar } : category;
}

export function localizeArticle(article: Article, lang: Lang): Article {
  const ar = lang === "ar" ? articlesAr[article.id] : undefined;
  return ar ? { ...article, ...ar } : article;
}

export function localizeConcernTile(tile: ConcernTile, lang: Lang): ConcernTile {
  const ar = lang === "ar" ? concernTilesAr[tile.id] : undefined;
  return ar ? { ...tile, label: ar.label, image: { ...tile.image, alt: ar.alt } } : tile;
}

export function localizeHeroSlide(slide: HeroSlide, lang: Lang): HeroSlide {
  const ar = lang === "ar" ? heroSlidesAr[slide.id] : undefined;
  // Arabic artwork has no separate mobile crop, so drop the English one.
  return ar ? { ...slide, ...ar, mobileImage: undefined } : slide;
}
