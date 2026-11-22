import { ChevronDown } from "lucide-react";
import type { SortOption } from "@/types";
import { SORT_OPTIONS } from "../hooks/useCatalogFilters";
import { useT } from "@/i18n/useT";

export function SortSelect({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  const { m } = useT();
  return (
    <label className="relative block">
      <span className="sr-only">{m.catalog.sortProducts}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="h-10 w-full cursor-pointer appearance-none rounded-full border border-sand-300 bg-white pe-10 ps-4 text-[13px] font-medium transition-colors hover:border-cocoa-900 focus:border-cocoa-900 focus:outline-none sm:w-56"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {m.catalog.sort[option.value]}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 end-4 size-3.5 -translate-y-1/2 text-taupe-600" />
    </label>
  );
}
