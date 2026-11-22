import { useEffect, useState } from "react";
import { useT } from "@/i18n/useT";

interface PriceRangeFilterProps {
  bounds: { min: number; max: number };
  value: { min?: number; max?: number };
  onCommit: (min: number | undefined, max: number | undefined) => void;
  /** Currency symbol shown in the inputs. */
  symbol?: string;
}

/** Dual-thumb slider with numeric inputs. Changes are committed on release/blur to avoid URL churn. */
export function PriceRangeFilter({ bounds, value, onCommit, symbol = "$" }: PriceRangeFilterProps) {
  const { m } = useT();
  const [min, setMin] = useState(value.min ?? bounds.min);
  const [max, setMax] = useState(value.max ?? bounds.max);

  useEffect(() => {
    setMin(value.min ?? bounds.min);
    setMax(value.max ?? bounds.max);
  }, [value.min, value.max, bounds.min, bounds.max]);

  const commit = (nextMin = min, nextMax = max) => {
    const lo = Math.max(bounds.min, Math.min(nextMin, nextMax));
    const hi = Math.min(bounds.max, Math.max(nextMin, nextMax));
    setMin(lo);
    setMax(hi);
    onCommit(lo > bounds.min ? lo : undefined, hi < bounds.max ? hi : undefined);
  };

  const span = bounds.max - bounds.min || 1;
  const left = ((min - bounds.min) / span) * 100;
  const right = 100 - ((max - bounds.min) / span) * 100;

  return (
    <div>
      <div className="relative mx-1.5 h-4">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-sand-300" />
        <div
          className="absolute top-1/2 h-px -translate-y-1/2 bg-cocoa-900"
          // Logical insets so the fill follows the range direction in RTL.
          style={{ insetInlineStart: `${left}%`, insetInlineEnd: `${right}%` }}
        />
        <input
          type="range"
          aria-label={m.catalog.minPrice}
          className="range-thumb"
          min={bounds.min}
          max={bounds.max}
          value={min}
          onChange={(e) => setMin(Math.min(Number(e.target.value), max))}
          onPointerUp={() => commit()}
          onKeyUp={() => commit()}
        />
        <input
          type="range"
          aria-label={m.catalog.maxPrice}
          className="range-thumb"
          min={bounds.min}
          max={bounds.max}
          value={max}
          onChange={(e) => setMax(Math.max(Number(e.target.value), min))}
          onPointerUp={() => commit()}
          onKeyUp={() => commit()}
        />
      </div>
      <div className="mt-4 flex items-center gap-3 text-[13px]">
        <PriceInput
          symbol={symbol}
          label={m.catalog.minPrice}
          value={min}
          onChange={setMin}
          onCommit={(v) => commit(v, max)}
        />
        <span className="text-taupe-500">{m.catalog.to}</span>
        <PriceInput
          symbol={symbol}
          label={m.catalog.maxPrice}
          value={max}
          onChange={setMax}
          onCommit={(v) => commit(min, v)}
        />
      </div>
    </div>
  );
}

function PriceInput({
  label,
  value,
  onChange,
  onCommit,
  symbol,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  onCommit: (v: number) => void;
  symbol: string;
}) {
  return (
    <label className="flex h-10 flex-1 items-center rounded-full border border-sand-300 px-4 focus-within:border-cocoa-900">
      <span className="sr-only">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onBlur={(e) => onCommit(Number(e.target.value))}
        onKeyDown={(e) => e.key === "Enter" && onCommit(Number(e.currentTarget.value))}
        className="w-full min-w-0 bg-transparent tabular-nums [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <span className="shrink-0 text-taupe-500">{symbol}</span>
    </label>
  );
}
