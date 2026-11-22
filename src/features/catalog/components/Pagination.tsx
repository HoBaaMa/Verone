import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n/useT";

interface PaginationProps {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

/** Page numbers to show: first, last, current ±1, with gaps collapsed to an ellipsis. */
function pageList(page: number, count: number): (number | "gap")[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const keep = new Set([1, count, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((n) => keep.add(n));
  if (page >= count - 2) [count - 3, count - 2, count - 1].forEach((n) => keep.add(n));
  const sorted = [...keep].filter((n) => n >= 1 && n <= count).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push("gap");
    out.push(n);
  });
  return out;
}

const pill =
  "grid h-11 min-w-11 place-items-center rounded-full px-3 text-[14px] font-medium tabular-nums transition-colors";

export function Pagination({ page, pageCount, total, pageSize, onChange }: PaginationProps) {
  const { m, fmt } = useT();
  if (pageCount <= 1) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const progress = (to / total) * 100;

  return (
    <nav aria-label={m.catalog.pagination} className="mt-14 flex flex-col items-center gap-5">
      <div className="flex w-full max-w-xs flex-col items-center gap-2.5">
        <p className="text-[13px] text-taupe-600" aria-live="polite">
          {fmt(m.catalog.showing, { from, to, total })}
        </p>
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-cream-200" aria-hidden>
          <div
            className="h-full rounded-full bg-cocoa-900 transition-[width] duration-500 ease-(--ease-out-soft)"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 rounded-full border border-cream-200 bg-white p-1.5 shadow-soft">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          aria-label={m.catalog.previousPage}
          className={cn(
            pill,
            "hover:bg-cream-100 disabled:pointer-events-none disabled:opacity-30",
          )}
        >
          <ChevronLeft className="size-4" strokeWidth={1.75} />
        </button>

        <ol className="flex items-center gap-1">
          {pageList(page, pageCount).map((n, i) =>
            n === "gap" ? (
              <li key={`gap-${i}`} aria-hidden className="w-6 text-center text-taupe-500">
                …
              </li>
            ) : (
              <li key={n}>
                <button
                  type="button"
                  onClick={() => onChange(n)}
                  aria-label={fmt(m.catalog.page, { n })}
                  aria-current={n === page ? "page" : undefined}
                  className={cn(
                    pill,
                    n === page ? "bg-cocoa-900 text-white" : "text-cocoa-900 hover:bg-cream-100",
                  )}
                >
                  {n}
                </button>
              </li>
            ),
          )}
        </ol>

        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page >= pageCount}
          aria-label={m.catalog.nextPage}
          className={cn(
            pill,
            "hover:bg-cream-100 disabled:pointer-events-none disabled:opacity-30",
          )}
        >
          <ChevronRight className="size-4" strokeWidth={1.75} />
        </button>
      </div>
    </nav>
  );
}
