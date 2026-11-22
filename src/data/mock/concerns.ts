import type { ConcernTile } from "@/types";

const asset = (file: string) => `${import.meta.env.BASE_URL}assets/concerns/${file}`;
const search = (q: string) => `/shop?q=${encodeURIComponent(q)}`;

/** Ordered "Shop by concern" tiles linking to matching categories, concern filters or search. */
export const concernTiles: ConcernTile[] = [
  {
    id: "skin-healing",
    label: "Skin Healing",
    href: "/shop?concern=sensitivity",
    image: {
      url: asset("skin-healing.webp"),
      alt: "Soothing gel applied to irritated skin on a shoulder",
    },
  },
  {
    id: "anti-aging",
    label: "Anti-Aging",
    href: "/shop?concern=fine-lines",
    image: {
      url: asset("anti-aging.webp"),
      alt: "Woman applying a retinol eye cream beneath her eye",
    },
  },
  {
    id: "sun-protection",
    label: "Sun Protection",
    href: "/shop/sun-care",
    image: {
      url: asset("sun-protection.webp"),
      alt: "Woman holding an SPF 50+ sunscreen tube to her cheek",
    },
  },
  {
    id: "hair-care",
    label: "Hair Care",
    href: "/shop/hair",
    image: {
      url: asset("hair-care.webp"),
      alt: "Woman with long glossy hair holding a hair mask jar",
    },
  },
  {
    id: "health-nutrition",
    label: "Health & Nutrition",
    href: search("supplement"),
    image: {
      url: asset("health-nutrition.webp"),
      alt: "Smiling woman holding a skin, hair and nails supplement",
    },
  },
  {
    id: "deodorants",
    label: "Deodorants",
    href: "/shop/deodorants",
    image: {
      url: asset("deodorants.webp"),
      alt: "Smiling woman holding a roll-on deodorant to her cheek",
    },
  },
];
