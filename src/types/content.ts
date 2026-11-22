export interface HeroBannerImage {
  url: string;
  /** Intrinsic pixel size; used to reserve the banner's aspect ratio before load. */
  width: number;
  height: number;
}

/** Merchandised "Shop by concern" tile. */
export interface ConcernTile {
  id: string;
  label: string;
  href: string;
  image: { url: string; alt: string };
}

/** Image-only homepage banner. Copy and CTAs are baked into the artwork. */
export interface HeroSlide {
  id: string;
  /** Describes the artwork, including any text it contains. */
  alt: string;
  /** Where clicking the banner navigates to. */
  href: string;
  image: HeroBannerImage;
  /** Optional art-directed asset for viewports below the `md` breakpoint. */
  mobileImage?: HeroBannerImage;
}
