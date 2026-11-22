interface CatalogHeroProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export function CatalogHero({ title, description, image, imageAlt }: CatalogHeroProps) {
  return (
    <section className="relative isolate w-full overflow-hidden bg-sand-300">
      <img src={image} alt={imageAlt} className="absolute inset-0 -z-10 size-full object-cover object-[50%_22%]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cocoa-900/70 rtl:bg-gradient-to-l via-cocoa-900/35 to-transparent" />
      <div className="mx-auto flex min-h-[260px] max-w-[1600px] flex-col justify-center px-6 py-12 text-white sm:min-h-[320px] sm:px-10 lg:min-h-[400px] lg:px-14">
        <h1 className="max-w-md text-[clamp(2.5rem,6vw,4.25rem)] leading-[0.92] font-semibold tracking-[var(--tracking-display)]">
          {title}
        </h1>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/85 sm:text-base">
          {description}
        </p>
      </div>
    </section>
  );
}
