import type { CollectionId, Product, ProductType } from "@/types";
import type { Localized } from "@/i18n/config";

const asset = (file: string) => `${import.meta.env.BASE_URL}assets/${file}`;

export interface Collection {
  id: CollectionId;
  label: Localized;
  headline: Localized;
  description: Localized;
  heroImage: string;
  heroAlt: Localized;
  /** Whole categories that belong to the collection. */
  categories: string[];
  /** Products of these types also belong (e.g. serum bundles count as Skincare). */
  types: ProductType[];
}

export const COLLECTIONS: Record<CollectionId, Collection> = {
  skincare: {
    id: "skincare",
    label: { en: "Skincare", ar: "العناية بالبشرة" },
    headline: { en: "Skincare", ar: "العناية بالبشرة" },
    description: {
      en: "Cleansers, serums, moisturisers and eye care for clear, balanced, glowing skin.",
      ar: "منظفات وسيرومات ومرطبات وعناية بالعين لبشرة صافية ومتوازنة ومشرقة.",
    },
    heroImage: asset("menu-all-skincare.webp"),
    heroAlt: { en: "Woman smoothing moisturiser onto her cheeks in warm light", ar: "امرأة تضع المرطب على وجنتيها في ضوء دافئ" },
    categories: ["face"],
    types: ["cleanser", "toner", "serum", "moisturizer", "eye-care", "mask"],
  },
  "hair-body": {
    id: "hair-body",
    label: { en: "Hair & Body", ar: "الشعر والجسم" },
    headline: { en: "Hair & Body", ar: "الشعر والجسم" },
    description: {
      en: "Scalp-first hair care, softening body care and all-day freshness, head to toe.",
      ar: "عناية بالشعر تبدأ من فروة الرأس، وعناية ناعمة بالجسم، وانتعاش يدوم طوال اليوم.",
    },
    heroImage: asset("concerns/hair-care.webp"),
    heroAlt: { en: "Woman with long glossy hair holding a hair mask jar", ar: "امرأة بشعر طويل لامع تحمل علبة ماسك للشعر" },
    categories: ["hair", "body", "deodorants"],
    types: ["shampoo", "conditioner", "hair-treatment", "body-wash", "body-lotion", "deodorant"],
  },
  "sun-sets": {
    id: "sun-sets",
    label: { en: "Sun & Sets", ar: "الحماية والمجموعات" },
    headline: { en: "Sun & Sets", ar: "الحماية من الشمس والمجموعات" },
    description: {
      en: "SPF 50+ protection for hot days, plus complete routines paired for savings.",
      ar: "حماية SPF 50+ للأيام الحارة، بالإضافة إلى روتين متكامل بأسعار موفرة.",
    },
    heroImage: asset("concerns/sun-protection.webp"),
    heroAlt: { en: "Woman holding an SPF 50+ sunscreen tube to her cheek", ar: "امرأة تحمل أنبوب واقي شمس SPF 50+ قرب وجنتها" },
    categories: ["sun-care", "bundles"],
    types: ["face-sunscreen", "body-sunscreen", "bundle"],
  },
};

export const parseCollection = (value: string | null): CollectionId | undefined =>
  value && value in COLLECTIONS ? (value as CollectionId) : undefined;

export function inCollection(product: Product, id: CollectionId): boolean {
  const { categories, types } = COLLECTIONS[id];
  return (
    categories.includes(product.categorySlug) || product.productTypes.some((t) => types.includes(t))
  );
}
