import { cn } from "@/lib/cn";
import { Check } from "lucide-react";

interface CheckboxProps {
  label: string;
  count?: number;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  /** `md` is the roomier filter-list style. */
  size?: "sm" | "md";
}

export function Checkbox({
  label,
  count,
  checked,
  disabled,
  onChange,
  size = "sm",
}: CheckboxProps) {
  const md = size === "md";
  return (
    <label
      className={cn(
        "group flex cursor-pointer items-center text-cocoa-900 has-disabled:cursor-default has-disabled:text-taupe-500/70",
        md ? "gap-3 py-2 text-[14px]" : "gap-2.5 py-[3px] text-[13px]",
      )}
    >
      <span
        className={cn("relative grid shrink-0 place-items-center", md ? "size-[18px]" : "size-3.5")}
      >
        <input
          type="checkbox"
          className={cn(
            "peer absolute inset-0 cursor-pointer appearance-none border border-sand-400 bg-white transition-colors checked:border-cocoa-900 checked:bg-cocoa-900 disabled:cursor-default group-hover:border-cocoa-700",
            md ? "rounded-[5px]" : "rounded-[3px]",
          )}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <Check
          className={cn(
            "pointer-events-none relative text-white opacity-0 peer-checked:opacity-100",
            md ? "size-3" : "size-2.5",
          )}
          strokeWidth={3}
        />
      </span>
      <span>
        {label}
        {count !== undefined && <span className="text-taupe-500"> ({count})</span>}
      </span>
    </label>
  );
}
