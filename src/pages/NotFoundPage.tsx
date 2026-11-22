import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { useT } from "@/i18n/useT";

export default function NotFoundPage() {
  const { m } = useT();
  return (
    <Container className="flex flex-col items-center py-32 text-center">
      <DisplayHeading as="h1" lead={m.pages.notFoundLead} muted={m.pages.notFoundMuted} />
      <ButtonLink to="/shop" className="mt-10">
        {m.common.continueShopping}
      </ButtonLink>
    </Container>
  );
}
