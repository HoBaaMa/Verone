import { Link, useLocation } from "react-router";
import { Languages } from "lucide-react";
import { localizePath } from "@/i18n/config";
import { useT } from "@/i18n/useT";
import { cn } from "@/lib/cn";

/** Toggles English ↔ Arabic on the same page, keeping filters and search intact. */
export function LanguageSwitch({
  tone = "default",
  className,
}: {
  tone?: "default" | "inverse";
  className?: string;
}) {
  const { pathname, search, hash } = useLocation();
  const { m, lang } = useT();
  const target = lang === "ar" ? "en" : "ar";
  return (
    <Link
      // Plain router Link on purpose: the target language is explicit here.
      to={`${localizePath(pathname, target)}${search}${hash}`}
      lang={target}
      hrefLang={target}
      aria-label={m.lang.switchLabel}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors",
        tone === "inverse" ? "text-white/90 hover:bg-white/10" : "text-cocoa-900 hover:bg-cream-100",
        className,
      )}
    >
      <Languages className="size-3.5" strokeWidth={1.75} aria-hidden />
      {m.lang.switchTo}
    </Link>
  );
}
