import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";
import type { ProductImage as ProductImageModel } from "@/types";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n/useT";

interface ProductImageProps {
  image: ProductImageModel | undefined;
  fallbackLabel: string;
  className?: string;
  loading?: "eager" | "lazy";
  decorative?: boolean;
  /** `contain` shows the whole packshot (catalog images are shot on white). */
  fit?: "cover" | "contain";
}

/** Product photo that degrades to a calm cream panel when missing or broken. */
export function ProductImage({
  image,
  fallbackLabel,
  className,
  loading = "lazy",
  decorative,
  fit = "contain",
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const { m, fmt } = useT();

  useEffect(() => setFailed(false), [image?.url]);

  if (!image?.url || failed) {
    return (
      <div
        role={decorative ? undefined : "img"}
        aria-label={decorative ? undefined : fmt(m.product.imageUnavailable, { name: fallbackLabel })}
        aria-hidden={decorative || undefined}
        className={cn(
          "flex size-full flex-col items-center justify-center gap-2 bg-cream-100 text-sand-400",
          className,
        )}
      >
        <ImageOff className="size-6" strokeWidth={1.5} />
        {!decorative && <span className="text-xs text-taupe-500">{m.product.imageUnavailableShort}</span>}
      </div>
    );
  }

  return (
    <img
      src={image.url}
      alt={decorative ? "" : image.alt}
      loading={loading}
      onError={() => setFailed(true)}
      className={cn("size-full", fit === "contain" ? "object-contain" : "object-cover", className)}
    />
  );
}
