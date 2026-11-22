import { Link } from "@/i18n/navigation";
import { ArrowPill } from "@/components/ui/Button";
import { unsplash } from "@/data/mock/images";
import { useT } from "@/i18n/useT";

export function PromoBanner() {
  const { m } = useT();
  return (
    <Link
      to="/shop?sale=1"
      className="group relative isolate flex min-h-[280px] overflow-hidden rounded-[var(--radius-card)] bg-[#9c8a7c] sm:min-h-[320px]"
    >
      <img
        src={unsplash("1760226642568-6b1e12b6d41c", 1600)}
        alt={m.catalog.promoAlt}
        loading="lazy"
        className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-l from-cocoa-900/70 rtl:bg-gradient-to-r via-cocoa-900/30 to-transparent" />
      <div className="ms-auto flex max-w-md flex-col justify-center p-6 text-white sm:p-10">
        <h2 className="text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1] font-semibold tracking-[var(--tracking-display)]">
          {m.catalog.promoTitle}
        </h2>
        <p className="mt-3 text-[15px] leading-snug text-white/85">{m.catalog.promoText}</p>
        <div className="mt-6">
          <ArrowPill>{m.catalog.grabNow}</ArrowPill>
        </div>
      </div>
    </Link>
  );
}
