import type { CurrencyCode, DeliveryMethod, PaymentMethod } from "@/types";
import type { Lang, Localized } from "@/i18n/config";

export const EGYPT_GOVERNORATES = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Qalyubia",
  "Sharqia",
  "Dakahlia",
  "Gharbia",
  "Monufia",
  "Beheira",
  "Kafr El Sheikh",
  "Damietta",
  "Port Said",
  "Ismailia",
  "Suez",
  "North Sinai",
  "South Sinai",
  "Red Sea",
  "Matrouh",
  "Faiyum",
  "Beni Suef",
  "Minya",
  "Asyut",
  "Sohag",
  "Qena",
  "Luxor",
  "Aswan",
  "New Valley",
];

/** Arabic display names; the stored value stays English so orders and APIs stay stable. */
const EGYPT_GOVERNORATES_AR: Record<string, string> = {
  Cairo: "القاهرة",
  Giza: "الجيزة",
  Alexandria: "الإسكندرية",
  Qalyubia: "القليوبية",
  Sharqia: "الشرقية",
  Dakahlia: "الدقهلية",
  Gharbia: "الغربية",
  Monufia: "المنوفية",
  Beheira: "البحيرة",
  "Kafr El Sheikh": "كفر الشيخ",
  Damietta: "دمياط",
  "Port Said": "بورسعيد",
  Ismailia: "الإسماعيلية",
  Suez: "السويس",
  "North Sinai": "شمال سيناء",
  "South Sinai": "جنوب سيناء",
  "Red Sea": "البحر الأحمر",
  Matrouh: "مطروح",
  Faiyum: "الفيوم",
  "Beni Suef": "بني سويف",
  Minya: "المنيا",
  Asyut: "أسيوط",
  Sohag: "سوهاج",
  Qena: "قنا",
  Luxor: "الأقصر",
  Aswan: "أسوان",
  "New Valley": "الوادي الجديد",
};

/** Display name for a stored governorate/state in the active language. */
export const regionLabel = (region: string, lang: Lang) =>
  (lang === "ar" && EGYPT_GOVERNORATES_AR[region]) || region;

export const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

export interface DeliveryOption {
  id: DeliveryMethod;
  label: Localized;
  /** Business days, inclusive range. */
  days: [number, number];
}

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  { id: "standard", label: { en: "Standard delivery", ar: "توصيل عادي" }, days: [2, 5] },
  { id: "express", label: { en: "Express delivery", ar: "توصيل سريع" }, days: [1, 1] },
];

/** Express is a flat premium and is never free. */
export const EXPRESS_RATES: Record<CurrencyCode, number> = { USD: 12, EGP: 120 };

export interface PaymentOption {
  id: PaymentMethod;
  label: Localized;
  description: Localized;
  /** Financing provider name, shown in Latin script in both languages. */
  provider?: string;
  /** Instalment terms in months, for financing providers. */
  terms?: number[];
}

export const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: "cod",
    label: { en: "Cash on delivery", ar: "الدفع عند الاستلام" },
    description: { en: "Pay in cash when your order arrives.", ar: "ادفعي نقداً عند وصول طلبكِ." },
  },
  {
    id: "card",
    label: { en: "Credit or debit card", ar: "بطاقة ائتمان أو خصم" },
    description: { en: "Visa, Mastercard and more.", ar: "Visa وMastercard وغيرها." },
  },
  {
    id: "valu",
    label: { en: "valU instalments", ar: "تقسيط valU" },
    description: {
      en: "Split your order into easy monthly payments.",
      ar: "قسّمي طلبكِ على دفعات شهرية سهلة.",
    },
    provider: "valU",
    terms: [3, 6, 12],
  },
  {
    id: "contact",
    label: { en: "Contact instalments", ar: "تقسيط Contact" },
    description: {
      en: "Buy now and pay over time with Contact.",
      ar: "اشتري الآن وادفعي على فترات مع Contact.",
    },
    provider: "Contact",
    terms: [3, 6, 12],
  },
];
