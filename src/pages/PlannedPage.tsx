import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { useT } from "@/i18n/useT";

/** Route shell for pages scheduled in the next build phase. */
/** `page` selects the title and note from the `pages` messages. */
export function PlannedPage({ page }: { page: "account" | "journal" | "article" | "about" }) {
  const { m } = useT();
  const title = m.pages[`${page}Title`];
  const note = m.pages[`${page}Note`];
  return (
    <Container className="py-28 text-center">
      <p className="text-xs font-medium tracking-[0.2em] text-taupe-500 uppercase">
        {m.pages.comingSoon}
      </p>
      <DisplayHeading as="h1" lead={title} className="mt-4" />
      <p className="mx-auto mt-5 max-w-md text-[15px] text-taupe-600">{note}</p>
      <ButtonLink to="/shop" className="mt-10">
        {m.pages.browse}
      </ButtonLink>
    </Container>
  );
}
