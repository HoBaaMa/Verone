import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import type { MegaMenuConfig } from "@/config/navigation";
import { COLLECTIONS } from "@/config/collections";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n/useT";

interface MegaMenuProps {
  id: string;
  open: boolean;
  menu: MegaMenuConfig;
  onNavigate: () => void;
}

/**
 * Full-width, compact dropdown for one collection: a square promo (or a text
 * "shop all" block when there's no artwork) followed by up to three link columns.
 */
export function MegaMenu({ id, open, menu, onNavigate }: MegaMenuProps) {
  const collection = COLLECTIONS[menu.collection];
  const shopAll = `/shop?collection=${collection.id}`;
  const { m, fmt, l } = useT();

  return (
    <div
      id={id}
      inert={!open}
      aria-hidden={!open}
      className={cn(
        "absolute inset-x-0 top-full rounded-b-3xl border-t border-cream-200 bg-white shadow-[0_24px_48px_-24px_rgb(44_26_25/0.35)]",
        "transition-[opacity,translate,visibility] duration-150 ease-out",
        open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
      )}
    >
      <div className="mx-auto grid max-w-[1320px] grid-cols-[220px_repeat(3,minmax(0,1fr))] gap-10 px-8 py-7 xl:gap-14">
        {menu.promo ? (
          <Link
            to={shopAll}
            onClick={onNavigate}
            aria-label={l(menu.promo.alt)}
            className="group block aspect-square self-start overflow-hidden rounded-xl bg-cream-100"
          >
            <img
              src={menu.promo.image}
              alt=""
              width={800}
              height={800}
              loading="lazy"
              className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
            />
          </Link>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-[26px] leading-none font-semibold tracking-[var(--tracking-display)]">
              {l(collection.label)}
            </p>
            <p className="text-[13px] leading-relaxed text-taupe-600">{l(collection.description)}</p>
            <Link
              to={shopAll}
              onClick={onNavigate}
              className="group mt-1 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
            >
              {fmt(m.common.shopAll, { label: l(collection.label) })}
              <ArrowRight
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
                strokeWidth={1.75}
              />
            </Link>
          </div>
        )}

        {menu.columns.map((column) => (
          <div key={column.title.en} className="flex flex-col gap-3.5">
            <p className="text-xs font-medium tracking-[0.18em] text-taupe-500 uppercase">
              {l(column.title)}
            </p>
            <ul className="flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={onNavigate}
                    className="text-[15px] tracking-tight transition-colors hover:text-taupe-600"
                  >
                    {l(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
