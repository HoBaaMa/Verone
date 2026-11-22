import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { ProductAttributes } from "@/features/product/components/ProductAttributes";
import { ProductGallery } from "@/features/product/components/ProductGallery";
import { ProductPageSkeleton } from "@/features/product/components/ProductPageSkeleton";
import { ProductSummary } from "@/features/product/components/ProductSummary";
import { StickyPurchaseBar } from "@/features/product/components/StickyPurchaseBar";
import { RelatedProducts } from "@/features/product/components/RelatedProducts";
import { categoryService, productService } from "@/services";
import { useAsync } from "@/lib/useAsync";
import { useT } from "@/i18n/useT";

export default function ProductPage() {
  const { slug = "" } = useParams();
  const [attempt, setAttempt] = useState(0);
  const { m, fmt, lang } = useT();
  const {
    data: product,
    loading,
    error,
  } = useAsync(() => productService.getProductBySlug(slug, lang), [slug, attempt, lang]);
  const categorySlug = product?.categorySlug;
  const { data: loadedCategory } = useAsync(
    () =>
      categorySlug ? categoryService.getCategoryBySlug(categorySlug, lang) : Promise.resolve(null),
    [categorySlug, lang],
  );

  useEffect(() => {
    if (product)
      document.title = fmt(m.product.docTitle, { name: product.name, subtitle: product.subtitle });
  }, [product, fmt, m]);

  const category = loadedCategory?.slug === categorySlug ? loadedCategory : null;

  // useAsync keeps the previous result while refetching; treat a stale product as loading.
  const isCurrent = product?.slug === slug;

  if (error) {
    return (
      <StatusMessage lead={m.product.errorLead} muted={m.product.errorMuted}>
        <Button onClick={() => setAttempt((n) => n + 1)}>{m.common.tryAgain}</Button>
        <ButtonLink to="/shop" variant="outline">
          {m.common.backToShop}
        </ButtonLink>
      </StatusMessage>
    );
  }

  if (loading && !isCurrent) {
    return (
      <Container className="pt-8">
        <ProductPageSkeleton />
      </Container>
    );
  }

  if (!product) {
    return (
      <StatusMessage lead={m.product.notFoundLead} muted={m.product.notFoundMuted}>
        <ButtonLink to="/shop">{m.common.backToShop}</ButtonLink>
      </StatusMessage>
    );
  }

  const crumbs: BreadcrumbItem[] = [
    { label: m.common.home, to: "/" },
    { label: m.common.shop, to: "/shop" },
    ...(category ? [{ label: category.name, to: `/shop/${category.slug}` }] : []),
    { label: product.name },
  ];

  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs items={crumbs} />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="min-w-0 lg:sticky lg:top-36 lg:self-start">
            <Reveal key={product.slug}>
              <ProductGallery images={product.images} productName={product.name} />
            </Reveal>
          </div>
          <div className="min-w-0">
            <Reveal key={`summary-${product.slug}`} delay={100}>
              <ProductSummary product={product} category={category} />
            </Reveal>
            <Reveal key={`details-${product.slug}`} delay={200}>
              <ProductAttributes product={product} />
            </Reveal>
          </div>
        </div>
      </Container>
      <RelatedProducts slug={product.slug} />
      <StickyPurchaseBar key={product.slug} product={product} />
    </>
  );
}

function StatusMessage({
  lead,
  muted,
  children,
}: {
  lead: string;
  muted: string;
  children: ReactNode;
}) {
  return (
    <Container className="flex flex-col items-center py-32 text-center">
      <DisplayHeading as="h1" lead={lead} muted={muted} />
      <div className="mt-10 flex flex-wrap justify-center gap-3">{children}</div>
    </Container>
  );
}
