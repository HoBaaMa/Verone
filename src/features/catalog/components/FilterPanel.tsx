import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import type { ProductFacets, ProductType } from "@/types";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLocale } from "@/store/localeStore";
import { cn } from "@/lib/cn";
import type { CatalogFilters } from "../hooks/useCatalogFilters";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { useT } from "@/i18n/useT";
import { currencySymbol } from "@/lib/money";

interface FilterPanelProps {
  facets: ProductFacets | undefined;
  filters: CatalogFilters;
  /** Called after "Apply filters" (e.g. to close the mobile sheet). */
  onApplied?: () => void;
}

interface Draft {
  brands: string[];
  productTypes: ProductType[];
  minPrice?: number;
  maxPrice?: number;
}

const toggle = <T,>(list: T[], value: T, on: boolean) =>
  on ? [...list, value] : list.filter((v) => v !== value);

const sameSet = <T,>(a: T[], b: T[]) => a.length === b.length && a.every((v) => b.includes(v));

/** Collapsible filter group with a scrollable option list. */
function Section({
  title,
  defaultOpen,
  badge,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  badge?: number;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const panelId = useId();
  return (
    <div className="border-b border-cream-200">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between py-5 text-start text-[15px] font-semibold tracking-tight"
      >
        <span className="flex items-center gap-2">
          {title}
          {!!badge && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-cocoa-900 px-1.5 text-[10px] font-semibold text-white tabular-nums">
              {badge}
            </span>
          )}
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-taupe-600 transition-transform duration-300",
            open && "rotate-180",
          )}
          strokeWidth={1.75}
          aria-hidden
        />
      </button>
      <div
        id={panelId}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Sidebar filters: Brand, Type and Price. Selections are staged locally and
 * only reach the URL (and the results) when "Apply filters" is pressed.
 */
export function FilterPanel({ facets, filters, onApplied }: FilterPanelProps) {
  const { query, applyFilters, clearFilters, activeFilterCount } = filters;
  const locale = useLocale();
  const { m, lang } = useT();

  const applied = useMemo<Draft>(
    () => ({
      brands: query.brands ?? [],
      productTypes: query.productTypes ?? [],
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
    }),
    [query.brands, query.productTypes, query.minPrice, query.maxPrice],
  );
  const [draft, setDraft] = useState<Draft>(applied);
  // Re-sync whenever the applied filters change (apply, clear, chips, navigation).
  useEffect(() => setDraft(applied), [applied]);

  const dirty =
    !sameSet(draft.brands, applied.brands) ||
    !sameSet(draft.productTypes, applied.productTypes) ||
    draft.minPrice !== applied.minPrice ||
    draft.maxPrice !== applied.maxPrice;

  if (!facets) {
    return (
      <div className="space-y-8 pt-5">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
    );
  }

  const types = (facets.facets.find((f) => f.key === "productTypes")?.options ?? [])
    .slice()
    .sort((a, b) => a.label.localeCompare(b.label, lang));
  const priceActive = draft.minPrice !== undefined || draft.maxPrice !== undefined;

  return (
    <div className="border-t border-cream-200">
      <Section title={m.catalog.brand} defaultOpen badge={applied.brands.length}>
        <div className="scrollbar-visible max-h-[248px] overflow-y-auto pe-2">
          {facets.brands.map((option) => {
            const checked = draft.brands.includes(option.value);
            return (
              <Checkbox
                key={option.value}
                size="md"
                label={option.label}
                count={option.count}
                checked={checked}
                disabled={!checked && option.count === 0}
                onChange={(on) =>
                  setDraft((d) => ({ ...d, brands: toggle(d.brands, option.value, on) }))
                }
              />
            );
          })}
        </div>
      </Section>

      <Section
        title={m.catalog.type}
        defaultOpen={applied.productTypes.length > 0}
        badge={applied.productTypes.length}
      >
        <div className="scrollbar-visible max-h-[248px] overflow-y-auto pe-2">
          {types.map((option) => {
            const value = option.value as ProductType;
            const checked = draft.productTypes.includes(value);
            return (
              <Checkbox
                key={value}
                size="md"
                label={option.label}
                count={option.count}
                checked={checked}
                disabled={!checked && option.count === 0}
                onChange={(on) =>
                  setDraft((d) => ({ ...d, productTypes: toggle(d.productTypes, value, on) }))
                }
              />
            );
          })}
        </div>
      </Section>

      <Section title={m.catalog.price} defaultOpen={priceActive} badge={priceActive ? 1 : 0}>
        <div className="pt-1">
          <PriceRangeFilter
            // Facet bounds and filter values are both in the active currency.
            bounds={facets.priceRange}
            value={{ min: draft.minPrice, max: draft.maxPrice }}
            symbol={currencySymbol(locale, lang)}
            onCommit={(minPrice, maxPrice) => setDraft((d) => ({ ...d, minPrice, maxPrice }))}
          />
        </div>
      </Section>

      <div className="flex flex-col items-start gap-4 pt-6">
        <Button
          size="lg"
          className="w-full"
          disabled={!dirty}
          onClick={() => {
            applyFilters(draft);
            onApplied?.();
          }}
        >
          {m.catalog.applyFilters}
        </Button>
        <button
          type="button"
          onClick={() => {
            clearFilters();
            setDraft({ brands: [], productTypes: [] });
            onApplied?.();
          }}
          disabled={activeFilterCount === 0 && !dirty}
          className="text-[13px] font-medium underline underline-offset-4 hover:text-cocoa-700 disabled:cursor-default disabled:text-taupe-500 disabled:no-underline"
        >
          {m.catalog.clearAll}
        </button>
      </div>
    </div>
  );
}
