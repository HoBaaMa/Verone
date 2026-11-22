import { useSearchParams } from "react-router";
import { unsplash } from "@/data/mock/images";
import { CatalogHero } from "@/features/catalog/components/CatalogHero";
import { CatalogView } from "@/features/catalog/components/CatalogView";
import { SaleHero } from "@/features/catalog/components/SaleHero";
import { COLLECTIONS, parseCollection } from "@/config/collections";
import { JournalSection } from "@/features/journal/components/JournalSection";
import { useT } from "@/i18n/useT";

export default function ShopPage() {
  const [params] = useSearchParams();
  const { m, l } = useT();
  const isSale = params.get("sale") === "1";
  const collectionId = parseCollection(params.get("collection"));
  const collection = collectionId ? COLLECTIONS[collectionId] : undefined;

  return (
    <>
      {/* Heroes run edge to edge, flush under the header, on every breakpoint. */}
      {isSale ? (
        <SaleHero />
      ) : (
        <CatalogHero
          {...(collection
            ? {
                title: l(collection.headline),
                description: l(collection.description),
                image: collection.heroImage,
                imageAlt: l(collection.heroAlt),
              }
            : {
                title: m.catalog.allProductsTitle,
                description: m.catalog.allProductsDescription,
                image: unsplash("1772987714654-2df39af2c658", 2000),
                imageAlt: m.catalog.allProductsAlt,
              })}
        />
      )}
      <div className="w-full px-4 lg:px-6">
        <CatalogView />
      </div>
      <JournalSection />
    </>
  );
}
