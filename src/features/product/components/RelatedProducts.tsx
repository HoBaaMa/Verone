import { Container } from "@/components/ui/Container";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { ProductGrid, ProductGridSkeleton } from "@/features/catalog/components/ProductGrid";
import { productService } from "@/services";
import { useAsync } from "@/lib/useAsync";
import { useT } from "@/i18n/useT";

export function RelatedProducts({ slug }: { slug: string }) {
  const { m, lang } = useT();
  const { data, loading, error } = useAsync(
    () => productService.getRelatedProducts(slug, 4, lang),
    [slug, lang],
  );

  // Related products are supplementary; hide the section on failure or when empty.
  if (error || (!loading && !data?.length)) return null;

  return (
    <section className="pt-28 sm:pt-32" aria-labelledby="related-heading">
      <Container>
        <div id="related-heading" className="mb-10">
          <DisplayHeading lead={m.product.relatedLead} muted={m.product.relatedMuted} />
        </div>
        {loading || !data ? (
          <ProductGridSkeleton count={4} columns={4} />
        ) : (
          <ProductGrid products={data} columns={4} />
        )}
      </Container>
    </section>
  );
}
