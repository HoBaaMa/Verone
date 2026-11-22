import { useLocation } from "react-router";
import { dirOf, langFromPath, stripLang, type Lang } from "./config";

/** Active language, derived from the URL (`/ar/...` → Arabic). */
export function useLang(): Lang {
  return langFromPath(useLocation().pathname);
}

export function useDir() {
  return dirOf(useLang());
}

/** Current pathname without the language prefix, for route matching. */
export function useBarePathname(): string {
  return stripLang(useLocation().pathname);
}
