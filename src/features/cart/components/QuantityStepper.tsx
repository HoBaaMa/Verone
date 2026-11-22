import { Minus, Plus } from "lucide-react";
import { MAX_LINE_QUANTITY } from "@/store/cartStore";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n/useT";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  /** Lowest selectable value. When unset, decreasing past 1 is allowed (the cart removes the line). */
  min?: number;
  max?: number;
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  label,
  min,
  max = MAX_LINE_QUANTITY,
  className,
}: QuantityStepperProps) {
  const { m, fmt } = useT();
  const btn =
    "grid size-8 place-items-center rounded-full transition-colors hover:bg-cream-100 disabled:opacity-35";
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center gap-1 rounded-full border border-sand-300 px-1",
        className,
      )}
      role="group"
      aria-label={fmt(m.product.quantityFor, { name: label })}
    >
      <button
        className={btn}
        onClick={() => onChange(value - 1)}
        disabled={min !== undefined && value <= min}
        aria-label={m.product.decrease}
      >
        <Minus className="size-3.5" />
      </button>
      <span className="w-6 text-center text-sm font-medium tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        className={btn}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={m.product.increase}
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
