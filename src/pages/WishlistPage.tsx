import { useMemo } from "react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { ProductGrid, ProductGridSkeleton } from "@/features/catalog/components/ProductGrid";
import { productService } from "@/services";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAsync } from "@/lib/useAsync";
import { useT } from "@/i18n/useT";

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids);
  const key = ids.join(",");
  const { m, fmt, lang } = useT();
  const { data, error } = useAsync(() => productService.getProductsByIds(ids, lang), [key, lang]);
  // Filter against live ids so un-saving a product removes it immediately.
  const products = useMemo(() => data?.filter((p) => ids.includes(p.id)), [data, ids]);

  if (ids.length === 0) {
    return (
      <Container className="flex flex-col items-center py-32 text-center">
        <DisplayHeading as="h1" lead={m.wishlist.emptyLead} muted={m.wishlist.emptyMuted} />
        <p className="mt-6 max-w-sm text-[15px] text-taupe-600">{m.wishlist.emptyText}</p>
        <ButtonLink to="/shop" className="mt-10">
          {m.wishlist.discover}
        </ButtonLink>
      </Container>
    );
  }

  return (
    <Container className="pt-14">
      <DisplayHeading
        as="h1"
        lead={m.wishlist.title}
        muted={
          ids.length === 1 ? m.wishlist.savedOne : fmt(m.wishlist.savedMany, { count: ids.length })
        }
      />
      <div className="mt-12">
        {error ? (
          <p className="text-[15px] text-taupe-600">{m.wishlist.error}</p>
        ) : products ? (
          <ProductGrid products={products} columns={4} />
        ) : (
          <ProductGridSkeleton count={Math.min(ids.length, 4)} columns={4} />
        )}
      </div>
    </Container>
  );
}
