import { useState } from "react";
import type { ProductImage as ProductImageModel } from "@/types";
import { cn } from "@/lib/cn";
import { ProductImage } from "./ProductImage";
import { useT } from "@/i18n/useT";

interface ProductGalleryProps {
  images: ProductImageModel[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const { m, fmt } = useT();
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-cream-200">
        <ProductImage
          key={active?.url}
          image={active}
          fallbackLabel={productName}
          loading="eager"
        />
      </div>

      {images.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1 sm:gap-3"
          role="group"
          aria-label={m.product.images}
        >
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={fmt(m.product.showImage, { index: index + 1, total: images.length })}
              aria-pressed={index === activeIndex}
              className={cn(
                "aspect-square w-20 shrink-0 overflow-hidden rounded-xl bg-white ring-offset-2 transition sm:w-24",
                index === activeIndex ? "ring-1 ring-cocoa-900" : "opacity-70 hover:opacity-100",
              )}
            >
              <ProductImage image={image} fallbackLabel={productName} decorative />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
