import type { Benefit, Concern, FacetKey, Formulation, ProductType, SkinType } from "@/types";
import type { Lang } from "@/i18n/config";

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  cleanser: "Cleansers",
  toner: "Toners & Essences",
  serum: "Serums",
  moisturizer: "Moisturizers",
  "eye-care": "Eye Care",
  mask: "Masks",
  shampoo: "Shampoos",
  conditioner: "Conditioners",
  "hair-treatment": "Hair Treatments",
  "body-wash": "Body Wash",
  "body-lotion": "Body Lotions",
  deodorant: "Deodorants",
  "face-sunscreen": "Face Sunscreen",
  "body-sunscreen": "Body Sunscreen",
  bundle: "Routine Bundles",
};

export const BENEFIT_LABELS: Record<Benefit, string> = {
  "anti-aging": "Anti-aging",
  brightening: "Brightening",
  cleansing: "Cleansing",
  cooling: "Cooling",
  deodorizing: "Odour protection",
  exfoliating: "Exfoliating",
  firming: "Firming",
  hydrating: "Hydrating",
  "oil-control": "Oil control",
  repairing: "Repairing",
  soothing: "Soothing",
  "sun-protection": "Sun protection",
};

export const SKIN_TYPE_LABELS: Record<SkinType, string> = {
  combination: "Combination",
  dry: "Dry",
  normal: "Normal",
  oily: "Oily",
  sensitive: "Sensitive",
};

export const FORMULATION_LABELS: Record<Formulation, string> = {
  balm: "Balm",
  cream: "Cream",
  gel: "Gel",
  liquid: "Liquid",
  lotion: "Lotion",
  "roll-on": "Roll-on",
  scrub: "Scrub",
  serum: "Serum",
  set: "Set",
  spray: "Spray",
};

export const CONCERN_LABELS: Record<Concern, string> = {
  acne: "Acne & blemishes",
  dandruff: "Dandruff",
  "dark-spots": "Dark spots",
  dryness: "Dryness",
  dullness: "Dullness",
  "fine-lines": "Fine lines",
  "hair-damage": "Hair damage",
  odor: "Odour",
  pores: "Pores",
  sensitivity: "Sensitivity",
  "sun-damage": "Sun damage",
  "uneven-texture": "Uneven texture",
};

export const FACET_DEFINITIONS: { key: FacetKey; label: string; labels: Record<string, string> }[] =
  [
    { key: "productTypes", label: "Product type", labels: PRODUCT_TYPE_LABELS },
    { key: "benefits", label: "Benefits", labels: BENEFIT_LABELS },
    { key: "skinTypes", label: "Skin type", labels: SKIN_TYPE_LABELS },
    { key: "formulations", label: "Formulation", labels: FORMULATION_LABELS },
    { key: "concerns", label: "Concern", labels: CONCERN_LABELS },
  ];

/* ------------------------------ Arabic ------------------------------ */

export const PRODUCT_TYPE_LABELS_AR: Record<ProductType, string> = {
  cleanser: "منظفات",
  toner: "تونر وإسنس",
  serum: "سيرومات",
  moisturizer: "مرطبات",
  "eye-care": "العناية بالعين",
  mask: "ماسكات",
  shampoo: "شامبو",
  conditioner: "بلسم",
  "hair-treatment": "علاجات الشعر",
  "body-wash": "غسول الجسم",
  "body-lotion": "لوشن الجسم",
  deodorant: "مزيلات العرق",
  "face-sunscreen": "واقي شمس للوجه",
  "body-sunscreen": "واقي شمس للجسم",
  bundle: "مجموعات الروتين",
};

export const BENEFIT_LABELS_AR: Record<Benefit, string> = {
  "anti-aging": "مكافحة الشيخوخة",
  brightening: "تفتيح",
  cleansing: "تنظيف",
  cooling: "تبريد",
  deodorizing: "حماية من الرائحة",
  exfoliating: "تقشير",
  firming: "شد",
  hydrating: "ترطيب",
  "oil-control": "التحكم في الزيوت",
  repairing: "إصلاح",
  soothing: "تهدئة",
  "sun-protection": "حماية من الشمس",
};

export const SKIN_TYPE_LABELS_AR: Record<SkinType, string> = {
  combination: "مختلطة",
  dry: "جافة",
  normal: "عادية",
  oily: "دهنية",
  sensitive: "حساسة",
};

export const FORMULATION_LABELS_AR: Record<Formulation, string> = {
  balm: "بلسم",
  cream: "كريم",
  gel: "جل",
  liquid: "سائل",
  lotion: "لوشن",
  "roll-on": "رول أون",
  scrub: "مقشر",
  serum: "سيروم",
  set: "مجموعة",
  spray: "سبراي",
};

export const CONCERN_LABELS_AR: Record<Concern, string> = {
  acne: "حب الشباب والشوائب",
  dandruff: "القشرة",
  "dark-spots": "البقع الداكنة",
  dryness: "الجفاف",
  dullness: "البهتان",
  "fine-lines": "الخطوط الدقيقة",
  "hair-damage": "تلف الشعر",
  odor: "الرائحة",
  pores: "المسام",
  sensitivity: "الحساسية",
  "sun-damage": "أضرار الشمس",
  "uneven-texture": "عدم تجانس الملمس",
};

const FACET_TEXT_AR: Record<FacetKey, { label: string; labels: Record<string, string> }> = {
  productTypes: { label: "نوع المنتج", labels: PRODUCT_TYPE_LABELS_AR },
  benefits: { label: "الفوائد", labels: BENEFIT_LABELS_AR },
  skinTypes: { label: "نوع البشرة", labels: SKIN_TYPE_LABELS_AR },
  formulations: { label: "القوام", labels: FORMULATION_LABELS_AR },
  concerns: { label: "المشكلة", labels: CONCERN_LABELS_AR },
};

/** Facet group and option labels in the requested language (option values never change). */
export function facetText(key: FacetKey, lang: Lang) {
  const en = FACET_DEFINITIONS.find((d) => d.key === key)!;
  return lang === "ar" ? FACET_TEXT_AR[key] : { label: en.label, labels: en.labels };
}
