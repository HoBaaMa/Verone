import { useParams } from "react-router";
import { Link } from "@/i18n/navigation";
import { CatalogHero } from "@/features/catalog/components/CatalogHero";
import { CatalogView } from "@/features/catalog/components/CatalogView";
import { JournalSection } from "@/features/journal/components/JournalSection";
import { Skeleton } from "@/components/ui/Skeleton";
import { categoryService } from "@/services";
import { useAsync } from "@/lib/useAsync";
import { cn } from "@/lib/cn";
import NotFoundPage from "./NotFoundPage";
import { useT } from "@/i18n/useT";

export default function CategoryPage() {
  const { category: slug = "" } = useParams();
  const { m, fmt, lang } = useT();
  const { data: category, loading } = useAsync(
    () => categoryService.getCategoryBySlug(slug, lang),
    [slug, lang],
  );
  const { data: categories } = useAsync(() => categoryService.getCategories(lang), [lang]);

  if (!loading && !category) return <NotFoundPage />;

  return (
    <>
      {category ? (
        <CatalogHero
          title={category.headline}
          description={category.description}
          image={category.image}
          imageAlt={fmt(m.catalog.collectionAlt, { name: category.name })}
        />
      ) : (
        <Skeleton className="h-[260px] w-full rounded-none sm:h-[320px] lg:h-[400px]" />
      )}
      <div className="w-full px-4 lg:px-6">
        <nav aria-label={m.catalog.categoriesNav} className="mt-6 flex gap-2 overflow-x-auto">
          <CategoryChip to="/shop" label={m.catalog.all} active={false} />
          {categories?.map((c) => (
            <CategoryChip
              key={c.slug}
              to={`/shop/${c.slug}`}
              label={c.name}
              active={c.slug === slug}
            />
          ))}
        </nav>
        <CatalogView key={slug} category={slug} />
      </div>
      <JournalSection />
    </>
  );
}

function CategoryChip({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-colors",
        active ? "bg-cocoa-900 text-white" : "bg-cream-100 hover:bg-cream-200",
      )}
    >
      {label}
    </Link>
  );
}
