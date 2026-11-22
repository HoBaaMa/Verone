import { stripLang, type Localized } from "@/i18n/config";
import type { CollectionId } from "@/types";
import { COLLECTIONS } from "./collections";

export interface MenuLink {
  label: Localized;
  to: string;
}

export interface MenuColumn {
  title: Localized;
  links: MenuLink[];
}

export interface MegaMenuConfig {
  collection: CollectionId;
  /** Square lifestyle card; menus without one show a text "shop all" block instead. */
  promo?: { image: string; alt: Localized };
  columns: MenuColumn[];
}

export interface HeaderNavItem {
  id: string;
  label: Localized;
  to: string;
  /** Opens this collection's mega-menu (desktop) / accordion (mobile). */
  megaMenu?: CollectionId;
  /** Small promotional tag shown above the link. */
  badge?: Localized;
  /** Whether the item represents the current location. */
  matches: (pathname: string, params: URLSearchParams) => boolean;
}

const collectionHref = (id: CollectionId) => `/shop?collection=${id}`;
/** Builds a filtered link inside a collection, e.g. `/shop?collection=skincare&type=serum`. */
const within = (id: CollectionId, param: string, value: string) =>
  `${collectionHref(id)}&${param}=${encodeURIComponent(value)}`;

const isShop = (path: string) => path === "/shop";

export const HEADER_NAV: HeaderNavItem[] = [
  {
    id: "skincare",
    label: COLLECTIONS.skincare.label,
    to: collectionHref("skincare"),
    megaMenu: "skincare",
    matches: (path, params) => isShop(path) && params.get("collection") === "skincare",
  },
  {
    id: "hair-body",
    label: COLLECTIONS["hair-body"].label,
    to: collectionHref("hair-body"),
    megaMenu: "hair-body",
    matches: (path, params) => isShop(path) && params.get("collection") === "hair-body",
  },
  {
    id: "sun-sets",
    label: COLLECTIONS["sun-sets"].label,
    to: collectionHref("sun-sets"),
    megaMenu: "sun-sets",
    matches: (path, params) => isShop(path) && params.get("collection") === "sun-sets",
  },
  {
    id: "sale",
    label: { en: "Sale", ar: "تخفيضات" },
    to: "/shop?sale=1",
    badge: { en: "Hot deals", ar: "عروض ساخنة" },
    matches: (path, params) => path.startsWith("/shop") && params.get("sale") === "1",
  },
  {
    id: "journal",
    label: { en: "Journal", ar: "المجلة" },
    to: "/journal",
    matches: (path) => path.startsWith("/journal"),
  },
  { id: "about", label: { en: "About", ar: "من نحن" }, to: "/about", matches: (path) => path.startsWith("/about") },
];

/**
 * Mega-menu content per collection. Only links that currently return products
 * are listed; add entries here as the catalog grows (e.g. After-Sun, Gift Sets).
 */
export const MEGA_MENUS: Record<CollectionId, MegaMenuConfig> = {
  skincare: {
    collection: "skincare",
    promo: {
      image: `${import.meta.env.BASE_URL}assets/menu-all-skincare.webp`,
      alt: { en: "All skincare — shop the collection", ar: "كل منتجات العناية بالبشرة — تسوقي المجموعة" },
    },
    columns: [
      {
        title: { en: "By product", ar: "حسب المنتج" },
        links: [
          { label: { en: "Cleansers", ar: "منظفات" }, to: within("skincare", "type", "cleanser") },
          { label: { en: "Toners & Essences", ar: "تونر وإسنس" }, to: within("skincare", "type", "toner") },
          { label: { en: "Serums", ar: "سيرومات" }, to: within("skincare", "type", "serum") },
          { label: { en: "Moisturizers", ar: "مرطبات" }, to: within("skincare", "type", "moisturizer") },
          { label: { en: "Eye Care", ar: "العناية بالعين" }, to: within("skincare", "type", "eye-care") },
          { label: { en: "Masks", ar: "ماسكات" }, to: within("skincare", "type", "mask") },
        ],
      },
      {
        title: { en: "By concern", ar: "حسب المشكلة" },
        links: [
          { label: { en: "Acne & blemishes", ar: "حب الشباب والشوائب" }, to: within("skincare", "concern", "acne") },
          { label: { en: "Dark spots", ar: "البقع الداكنة" }, to: within("skincare", "concern", "dark-spots") },
          { label: { en: "Dryness", ar: "الجفاف" }, to: within("skincare", "concern", "dryness") },
          { label: { en: "Dullness", ar: "البهتان" }, to: within("skincare", "concern", "dullness") },
          { label: { en: "Fine lines", ar: "الخطوط الدقيقة" }, to: within("skincare", "concern", "fine-lines") },
          { label: { en: "Pores", ar: "المسام" }, to: within("skincare", "concern", "pores") },
          { label: { en: "Sensitivity", ar: "الحساسية" }, to: within("skincare", "concern", "sensitivity") },
          { label: { en: "Uneven texture", ar: "عدم تجانس الملمس" }, to: within("skincare", "concern", "uneven-texture") },
        ],
      },
      {
        title: { en: "By skin type", ar: "حسب نوع البشرة" },
        links: [
          { label: { en: "Combination", ar: "مختلطة" }, to: within("skincare", "skin", "combination") },
          { label: { en: "Dry", ar: "جافة" }, to: within("skincare", "skin", "dry") },
          { label: { en: "Normal", ar: "عادية" }, to: within("skincare", "skin", "normal") },
          { label: { en: "Oily", ar: "دهنية" }, to: within("skincare", "skin", "oily") },
          { label: { en: "Sensitive", ar: "حساسة" }, to: within("skincare", "skin", "sensitive") },
        ],
      },
    ],
  },
  "hair-body": {
    collection: "hair-body",
    columns: [
      {
        title: { en: "By product", ar: "حسب المنتج" },
        links: [
          { label: { en: "Shampoos", ar: "شامبو" }, to: within("hair-body", "type", "shampoo") },
          { label: { en: "Conditioners", ar: "بلسم" }, to: within("hair-body", "type", "conditioner") },
          { label: { en: "Hair Treatments", ar: "علاجات الشعر" }, to: within("hair-body", "type", "hair-treatment") },
          { label: { en: "Body Wash", ar: "غسول الجسم" }, to: within("hair-body", "type", "body-wash") },
          { label: { en: "Body Lotions", ar: "لوشن الجسم" }, to: within("hair-body", "type", "body-lotion") },
          { label: { en: "Deodorants", ar: "مزيلات العرق" }, to: within("hair-body", "type", "deodorant") },
        ],
      },
      {
        title: { en: "By concern", ar: "حسب المشكلة" },
        links: [
          { label: { en: "Dandruff", ar: "القشرة" }, to: within("hair-body", "concern", "dandruff") },
          { label: { en: "Hair damage", ar: "تلف الشعر" }, to: within("hair-body", "concern", "hair-damage") },
          { label: { en: "Dry skin", ar: "البشرة الجافة" }, to: within("hair-body", "concern", "dryness") },
          { label: { en: "Odour", ar: "الرائحة" }, to: within("hair-body", "concern", "odor") },
        ],
      },
    ],
  },
  "sun-sets": {
    collection: "sun-sets",
    columns: [
      {
        title: { en: "By product", ar: "حسب المنتج" },
        links: [
          { label: { en: "Face Sunscreen", ar: "واقي شمس للوجه" }, to: within("sun-sets", "type", "face-sunscreen") },
          { label: { en: "Body Sunscreen", ar: "واقي شمس للجسم" }, to: within("sun-sets", "type", "body-sunscreen") },
          { label: { en: "Routine Bundles", ar: "مجموعات الروتين" }, to: within("sun-sets", "type", "bundle") },
        ],
      },
      {
        title: { en: "By concern", ar: "حسب المشكلة" },
        links: [
          { label: { en: "Sun damage", ar: "أضرار الشمس" }, to: within("sun-sets", "concern", "sun-damage") },
          { label: { en: "Dark spots", ar: "البقع الداكنة" }, to: within("sun-sets", "concern", "dark-spots") },
          { label: { en: "Anti-aging", ar: "مكافحة الشيخوخة" }, to: within("sun-sets", "concern", "fine-lines") },
        ],
      },
      {
        title: { en: "By finish / type", ar: "حسب الملمس / النوع" },
        links: [
          { label: { en: "Matte / Oily skin", ar: "مطفي / بشرة دهنية" }, to: within("sun-sets", "skin", "oily") },
          { label: { en: "Dewy / Dry skin", ar: "ندي / بشرة جافة" }, to: within("sun-sets", "skin", "dry") },
          { label: { en: "Sensitive skin", ar: "بشرة حساسة" }, to: within("sun-sets", "skin", "sensitive") },
        ],
      },
    ],
  },
};

/** `pathname` may include a language prefix; matching uses the bare path. */
export function getActiveNavId(pathname: string, search: string): string | undefined {
  const params = new URLSearchParams(search);
  const bare = stripLang(pathname);
  return HEADER_NAV.find((item) => item.matches(bare, params))?.id;
}

/** Labels are message keys under `footer`. */
export const FOOTER_INFO_LINKS = [
  { key: "aboutUs", to: "/about" },
  { key: "journal", to: "/journal" },
  { key: "myAccount", to: "/account" },
  { key: "trackOrder", to: "/track-order" },
] as const;

/** Ordered along the purchase journey: data, terms, delivery, returns. */
export const FOOTER_PRIVACY_LINKS = [
  { key: "privacyPolicy", to: "/privacy-policy" },
  { key: "terms", to: "/terms-of-use" },
  { key: "shippingPolicy", to: "/shipping-policy" },
  { key: "refundPolicy", to: "/refund-policy" },
] as const;

export const FOOTER_SOCIAL = [
  { id: "instagram", label: "Instagram", href: "https://instagram.com" },
  { id: "tiktok", label: "TikTok", href: "https://tiktok.com" },
  { id: "youtube", label: "YouTube", href: "https://youtube.com" },
  { id: "facebook", label: "Facebook", href: "https://facebook.com" },
] as const;

export type SocialNetwork = (typeof FOOTER_SOCIAL)[number]["id"];
