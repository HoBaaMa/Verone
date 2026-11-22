import type { HeroSlide } from "@/types";

const asset = (file: string) => `${import.meta.env.BASE_URL}assets/${file}`;

/**
 * Ordered homepage banners. Add, remove, or reorder entries freely — the slider adapts.
 * All artwork is cropped to a shared 3:1 ratio so no slide is cut off in the frame.
 */
export const heroSlides: HeroSlide[] = [
  {
    id: "hero-black-friday",
    alt: "Veroné Black Friday — up to 50% off. Shop now.",
    href: "/shop?sale=1",
    image: { url: asset("hero-black-friday.webp"), width: 2400, height: 800 },
  },
  {
    id: "hero-biggest-sale",
    alt: "Biggest sale of the year — Soralone, Vacation and Capixy essentials wrapped in Black Friday ribbon. Shop now.",
    href: "/shop?sale=1",
    image: { url: asset("hero-biggest-sale.webp"), width: 2400, height: 800 },
  },
  {
    id: "hero-beauty-ritual",
    alt: "Your beauty, your ritual. Skincare & haircare essentials for your everyday glow, with Vacation Hydra Bomb watermelon body milk and Jelly Lip Mask. Discover your glow.",
    href: "/shop?brand=Vacation",
    image: { url: asset("hero-beauty-ritual.webp"), width: 2400, height: 800 },
  },
];
