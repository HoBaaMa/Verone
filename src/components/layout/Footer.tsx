import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { FOOTER_INFO_LINKS, FOOTER_PRIVACY_LINKS, FOOTER_SOCIAL } from "@/config/navigation";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { NewsletterForm } from "./NewsletterForm";
import { Reveal } from "@/components/ui/Reveal";
import logoSrc from "@/imports/Veron_-Logo.png";
import { useT } from "@/i18n/useT";

/** Payment marks from the design library; `inset` positions each logo inside its 5:3 card. */
const PAYMENT_METHODS = [
  { name: "Visa", file: "209f2.svg", inset: "29.17% 10% 27.63% 10%" },
  { name: "Mastercard", file: "3458d.svg", inset: "29.17% 30% 29.62% 30%" },
  { name: "Apple Pay", file: "ce69a.svg", inset: "22.92% 10.01% 22.34% 10%" },
  { name: "PayPal", file: "21b73.svg", inset: "27.08% 10% 28.18% 10%" },
  { name: "Cash App", file: "ac736.svg", inset: "35.42% 10% 35.61% 10%" },
];

const FOOTER_LINK_GROUPS = [
  { key: "info", links: FOOTER_INFO_LINKS },
  { key: "privacy", links: FOOTER_PRIVACY_LINKS },
] as const;

export function Footer() {
  const { m } = useT();
  return (
    <footer className="pt-24">
      {/* Full-bleed background; content stays aligned to the page grid. */}
      <div className="w-full bg-cocoa-900 py-3 text-white">
        <Container>
          {/* 2×2: newsletter | follow us, then info | privacy beneath a divider. */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 p-5 sm:p-8 lg:gap-x-16">
            <Reveal className="col-span-2 flex min-w-0 flex-col lg:col-span-1">
              <img src={logoSrc} alt="Veroné" width={2172} height={724} className="h-7 w-auto self-start brightness-0 invert" />
              <h2 className="mt-5 max-w-md text-[clamp(2rem,4vw,3rem)] leading-[1] font-semibold tracking-[var(--tracking-display)]">
                {m.footer.subscribeHeadline}
              </h2>
              <div className="mt-8">
                <NewsletterForm />
              </div>
            </Reveal>

            <Reveal
              delay={100}
              className="col-span-2 lg:col-span-1 lg:me-16 lg:justify-self-end xl:me-24"
            >
              <h3 className="text-lg font-bold tracking-tight">{m.footer.followUs}</h3>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {FOOTER_SOCIAL.map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="grid size-12 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:bg-white/5 hover:text-white"
                    >
                      <SocialIcon network={social.id} className="size-[22px]" />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal
              delay={150}
              className="col-span-2 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/10 pt-10 lg:gap-x-16"
            >
              {FOOTER_LINK_GROUPS.map((group) => (
                <div key={group.key}>
                  <h3 className="text-sm font-medium">{m.footer[group.key]}</h3>
                  <ul className="mt-3 space-y-1.5">
                    {group.links.map((link) => (
                      <li key={link.key}>
                        <Link
                          to={link.to}
                          className="text-[13px] text-white/60 transition-colors hover:text-white"
                        >
                          {m.footer[link.key]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </Reveal>
          </div>

          <div className="flex flex-col gap-4 px-5 pt-10 pb-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p className="text-xs text-white/50">© Veroné {new Date().getFullYear()}</p>
            <ul className="flex flex-wrap gap-1.5" aria-label={m.footer.payments}>
              {PAYMENT_METHODS.map((method) => (
                <li
                  key={method.name}
                  className="relative h-5 w-[33px] shrink-0 rounded-[4px] bg-white"
                >
                  <div className="absolute" style={{ inset: method.inset }}>
                    <img
                      src={`${import.meta.env.BASE_URL}assets/${method.file}`}
                      alt={method.name}
                      className="absolute inset-0 block size-full max-w-none"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    </footer>
  );
}
