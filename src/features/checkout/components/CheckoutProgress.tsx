import { useT } from "@/i18n/useT";
import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export interface CheckoutStep {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface CheckoutProgressProps {
  steps: CheckoutStep[];
  current: number;
  /** Highest step index the shopper has reached; earlier steps are clickable. */
  reached: number;
  onSelect: (index: number) => void;
}

/**
 * Order progress styled like the cart's free-shipping bar: a filling track with
 * the current step's icon riding the fill edge, and labelled stops beneath.
 */
export function CheckoutProgress({ steps, current, reached, onSelect }: CheckoutProgressProps) {
  const { m, fmt } = useT();
  const last = steps.length - 1;
  const pct = last > 0 ? (current / last) * 100 : 100;
  const Icon = steps[current].icon;

  return (
    <nav
      aria-label={m.checkout.progress}
      className="rounded-2xl bg-cream-100 px-5 pt-5 pb-4 sm:px-8"
    >
      <p className="text-[13px] text-taupe-600" aria-live="polite">
        {fmt(m.checkout.stepOf, { current: current + 1, total: steps.length })}
        <span className="mx-1.5 text-sand-400">·</span>
        <span className="font-medium text-cocoa-900">{steps[current].label}</span>
      </p>

      {/* Track */}
      <div
        role="progressbar"
        aria-label={m.checkout.progress}
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-valuenow={current + 1}
        className="relative mx-4 mt-5 h-2 rounded-full bg-cream-200"
      >
        <div
          className="absolute inset-y-0 start-0 rounded-full bg-gradient-to-r from-sand-400 to-cocoa-900 rtl:bg-gradient-to-l transition-[width] duration-700 ease-(--ease-out-soft) motion-reduce:transition-none"
          style={{ width: `${pct}%` }}
        />
        {/* Stops */}
        {steps.map((step, i) => (
          <span
            key={step.id}
            aria-hidden
            className={cn(
              "absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2 rounded-full ring-2 ring-cream-100 transition-colors",
              i <= current ? "bg-cocoa-900" : "bg-sand-300",
            )}
            style={{ insetInlineStart: `${(i / last) * 100}%` }}
          />
        ))}
        {/* Rider */}
        <span
          aria-hidden
          className="absolute top-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2 place-items-center rounded-full bg-cocoa-900 text-cream-50 shadow-[0_6px_14px_-6px_rgb(44_26_25/0.6)] ring-[3px] ring-cream-100 transition-[left,right] duration-700 ease-(--ease-out-soft) motion-reduce:transition-none"
          style={{ insetInlineStart: `${pct}%` }}
        >
          <Icon
            key={steps[current].id}
            className="size-4 animate-page-in motion-reduce:animate-none"
            strokeWidth={1.75}
          />
        </span>
      </div>

      {/* Labels */}
      <ol
        className="mt-5 grid"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      >
        {steps.map((step, i) => {
          const done = i < current;
          const clickable = i <= reached && i !== current;
          return (
            <li
              key={step.id}
              className={cn(
                "flex",
                i === 0 ? "justify-start" : i === last ? "justify-end" : "justify-center",
              )}
            >
              <button
                type="button"
                disabled={!clickable}
                onClick={() => onSelect(i)}
                aria-current={i === current ? "step" : undefined}
                className={cn(
                  "inline-flex items-center gap-1 text-[12px] font-medium whitespace-nowrap transition-colors sm:text-[13px]",
                  i === current ? "text-cocoa-900" : done ? "text-cocoa-700" : "text-taupe-500",
                  clickable && "underline-offset-4 hover:underline",
                )}
              >
                {done && (
                  <Check className="size-3.5 text-[#5b8a5a]" strokeWidth={2.5} aria-hidden />
                )}
                {step.label}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
