import { BannerSlider } from "@/components/ui/BannerSlider";
import { Skeleton } from "@/components/ui/Skeleton";
import { contentService } from "@/services";
import { useAsync } from "@/lib/useAsync";
import { useLang } from "@/i18n/useLang";

export function HomeHero() {
  const lang = useLang();
  const { data: slides } = useAsync(() => contentService.getHeroSlides(lang), [lang]);

  if (!slides) {
    // Matches the banner aspect ratio so nothing shifts once slides arrive.
    return <Skeleton className="aspect-[3/1] w-full rounded-none" />;
  }

  return <BannerSlider slides={slides} interval={5000} />;
}
