/** Domain models. Shapes mirror the planned ASP.NET Core API DTOs. */

export type Benefit =
  | "anti-aging"
  | "brightening"
  | "cleansing"
  | "cooling"
  | "deodorizing"
  | "exfoliating"
  | "firming"
  | "hydrating"
  | "oil-control"
  | "repairing"
  | "soothing"
  | "sun-protection";

export type SkinType = "combination" | "dry" | "normal" | "oily" | "sensitive";

export type Formulation =
  | "balm"
  | "cream"
  | "gel"
  | "liquid"
  | "lotion"
  | "roll-on"
  | "scrub"
  | "serum"
  | "set"
  | "spray";

export type Concern =
  | "acne"
  | "dandruff"
  | "dark-spots"
  | "dryness"
  | "dullness"
  | "fine-lines"
  | "hair-damage"
  | "odor"
  | "pores"
  | "sensitivity"
  | "sun-damage"
  | "uneven-texture";

/** What the product is, used for "Shop by product" navigation. Bundles list each item type they contain. */
export type ProductType =
  | "cleanser"
  | "toner"
  | "serum"
  | "moisturizer"
  | "eye-care"
  | "mask"
  | "shampoo"
  | "conditioner"
  | "hair-treatment"
  | "body-wash"
  | "body-lotion"
  | "deodorant"
  | "face-sunscreen"
  | "body-sunscreen"
  | "bundle";

/** Merchandising groups used by the top-level navigation. */
export type CollectionId = "skincare" | "hair-body" | "sun-sets";

/** Storefront currencies with merchandised (not converted) price lists. */
export type CurrencyCode = "USD" | "EGP";

export interface PricePoint {
  price: number;
  /** Original price when the product is discounted. */
  compareAtPrice?: number;
}

/** Per-currency price list. USD is required and is the fallback for other currencies. */
export type PriceList = { USD: PricePoint } & Partial<Record<CurrencyCode, PricePoint>>;

export interface ProductImage {
  url: string;
  alt: string;
}

/** Localizable product copy, as the API would return per `Accept-Language`. */
export interface ProductTranslation {
  name: string;
  subtitle: string;
  size: string;
  description: string;
  keyIngredients: string[];
  howToUse: string;
  /** Alt text for each image, in order. */
  imageAlts: string[];
}

/** Short display names in every language, so carts and orders can switch language. */
export type ProductTitles = Record<"en" | "ar", { name: string; subtitle: string; size: string }>;

export interface Product {
  id: string;
  slug: string;
  brand: string;
  name: string;
  subtitle: string;
  description: string;
  categorySlug: string;
  prices: PriceList;
  /** Names in every language (set by the catalog service). */
  titles?: ProductTitles;
  size: string;
  images: ProductImage[];
  benefits: Benefit[];
  skinTypes: SkinType[];
  formulation: Formulation;
  productTypes: ProductType[];
  concerns: Concern[];
  keyIngredients: string[];
  howToUse: string;
  inStock: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  /** Relative sales rank used for "Best selling" sort. Higher sells more. */
  popularity: number;
  createdAt: string;
}
