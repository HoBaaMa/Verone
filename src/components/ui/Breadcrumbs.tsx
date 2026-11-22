import { Fragment } from "react";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import { useT } from "@/i18n/useT";

export interface BreadcrumbItem {
  label: string;
  /** Omit for the current page. */
  to?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const { m } = useT();
  return (
    <nav aria-label={m.pages.breadcrumb}>
      <ol className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-taupe-500">
        {items.map((item, index) => (
          <Fragment key={`${item.label}-${index}`}>
            {index > 0 && (
              <li aria-hidden className="flex">
                <ChevronRight className="size-3.5 text-sand-400" />
              </li>
            )}
            <li className="min-w-0">
              {item.to ? (
                <Link to={item.to} className="transition-colors hover:text-cocoa-900">
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="block truncate font-medium text-cocoa-900">
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
