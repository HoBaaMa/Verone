import type { PriceList } from "@/types";
import { useMoney } from "@/lib/money";
import { useLocalPrice } from "@/lib/pricing";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n/useT";

interface PriceProps {
  /** Per-currency price list; the active region's currency is displayed. */
  prices: PriceList;
  className?: string;
  align?: "center" | "start";
  size?: "sm" | "md" | "lg";
  /** `sale`: discounted price in bold sale red, old price muted (product cards). */
  tone?: "default" | "sale";
}

export function Price({
  prices,
  className,
  align = "center",
  size = "sm",
  tone = "default",
}: PriceProps) {
  const money = useMoney();
  const { m } = useT();
  const { price, compareAtPrice } = useLocalPrice(prices);
  const discounted = compareAtPrice !== undefined && compareAtPrice > price;
  return (
    <p
      className={cn(
        "flex items-baseline tabular-nums",
        align === "center" ? "justify-center" : "justify-start",
        size === "sm"
          ? "gap-1.5 text-[13px]"
          : size === "md"
            ? "gap-1.5 text-sm"
            : "gap-2.5 text-xl",
        className,
      )}
    >
      <span
        className={cn(
          tone === "sale" && discounted ? "font-semibold text-sale" : "font-medium text-cocoa-900",
        )}
      >
        {money(price)}
      </span>
      {discounted && (
        <span
          className={cn(
            "line-through decoration-1",
            tone === "sale" ? "text-taupe-500" : "text-sale",
            size === "lg" && "text-base",
          )}
        >
          <span className="sr-only">{m.common.was}</span>
          {money(compareAtPrice)}
        </span>
      )}
    </p>
  );
}
