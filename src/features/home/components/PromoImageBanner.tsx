import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { useT } from "@/i18n/useT";

const asset = (file: string) => `${import.meta.env.BASE_URL}assets/${file}`;

/** Inset, rounded campaign banner. The artwork carries its own copy. */
export function PromoImageBanner() {
  const { m } = useT();
  return (
    <section aria-label={m.home.featuredCampaign} className="pt-16 sm:pt-24">
      <div className="w-full px-4 lg:px-6">
        <Reveal>
          <Link
            to="/shop?q=eye"
            className="group block overflow-hidden rounded-[var(--radius-card)] bg-cream-100 focus-visible:outline-offset-4"
          >
            <img
              src={asset("promo-eye-care.webp")}
              alt={m.home.eyePromoAlt}
              width={2400}
              height={855}
              loading="lazy"
              className="block aspect-[2400/855] w-full object-cover transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-[1.015] motion-reduce:transition-none"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
