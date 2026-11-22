import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import logoSrc from "@/imports/Veron_-Logo.png";
import { useT } from "@/i18n/useT";

export function Logo({ className }: { className?: string }) {
  const { m } = useT();
  return (
    <Link
      to="/"
      className={cn("inline-flex shrink-0 items-center", className)}
      aria-label={m.common.brandHome}
    >
      <img src={logoSrc} alt="Veroné" width={2172} height={724} className="h-7 w-auto md:h-8" />
    </Link>
  );
}
