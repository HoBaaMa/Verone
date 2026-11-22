import { DealsTicker } from "@/features/home/components/DealsTicker";
import { ConcernMarquee } from "@/features/home/components/ConcernMarquee";
import { HomeHero } from "@/features/home/components/HomeHero";
import { PaymentOptionsStrip } from "@/features/home/components/PaymentOptionsStrip";
import { PressMarquee } from "@/features/home/components/PressMarquee";
import { ProductSlider } from "@/features/home/components/ProductSlider";
import { StoryGrid } from "@/features/home/components/StoryGrid";
import { JournalSection } from "@/features/journal/components/JournalSection";
import { useT } from "@/i18n/useT";

export default function HomePage() {
  const { m } = useT();
  return (
    <>
      <HomeHero />
      <PaymentOptionsStrip />
      <PressMarquee />
      <ProductSlider
        lead={m.home.bestLead}
        muted={m.home.bestMuted}
        query={{ sort: "best-selling" }}
        viewAllHref="/shop?sort=best-selling"
        maxItems={15}
        className="mt-12 sm:mt-16"
      />
      <StoryGrid />
      <ConcernMarquee />
      <ProductSlider
        lead={m.home.flashLead}
        muted={m.home.flashMuted}
        query={{ category: "bundles", onSaleOnly: true, sort: "best-selling" }}
        viewAllHref="/shop/bundles?sale=1"
        maxItems={10}
        className="mt-16"
      />
      <DealsTicker />
      <JournalSection />
    </>
  );
}
