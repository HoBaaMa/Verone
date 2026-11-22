import type { Category } from "@/types";

const asset = (file: string) => `${import.meta.env.BASE_URL}assets/${file}`;

export const categories: Category[] = [
  {
    id: "cat-face",
    slug: "face",
    name: "Face",
    headline: "Face & Lip Care",
    description:
      "Lightweight moisturisers and repairing lip care that keep skin balanced, calm and comfortable.",
    image: asset("concerns/anti-aging.webp"),
  },
  {
    id: "cat-body",
    slug: "body",
    name: "Body",
    headline: "Body Care",
    description:
      "Urea-rich washes, hand creams, scrubs and body milks that soften, smooth and hydrate from head to toe.",
    image: asset("concerns/skin-healing.webp"),
  },
  {
    id: "cat-hair",
    slug: "hair",
    name: "Hair",
    headline: "Hair & Scalp Care",
    description:
      "Shampoos and conditioners that clear dandruff, calm the scalp and rebuild damaged lengths.",
    image: asset("concerns/hair-care.webp"),
  },
  {
    id: "cat-sun-care",
    slug: "sun-care",
    name: "Sun Care",
    headline: "Sun Protection",
    description:
      "Broad-spectrum SPF 50+ creams, gels and sprays made for hot, humid days — no white cast, no grease.",
    image: asset("concerns/sun-protection.webp"),
  },
  {
    id: "cat-deodorants",
    slug: "deodorants",
    name: "Deodorants",
    headline: "Deodorants & Antiperspirants",
    description:
      "Alcohol-free whitening roll-ons and dry-touch sprays with 48-hour protection, in every scent you love.",
    image: asset("concerns/deodorants.webp"),
  },
  {
    id: "cat-bundles",
    slug: "bundles",
    name: "Bundles",
    headline: "Bundles & Deals",
    description: "Complete routines paired for results — and priced for savings of up to 64% off.",
    image: asset("story-duo.webp"),
  },
];
