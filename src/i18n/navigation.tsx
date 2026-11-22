import { forwardRef, useCallback } from "react";
import {
  Link as RouterLink,
  useNavigate as useRouterNavigate,
  type LinkProps,
  type NavigateOptions,
  type To,
} from "react-router";
import { localizePath, type Lang } from "./config";
import { useLang } from "./useLang";

export type { LinkProps };

function localizeTo(to: To, lang: Lang): To {
  if (typeof to === "string") return localizePath(to, lang);
  return to.pathname ? { ...to, pathname: localizePath(to.pathname, lang) } : to;
}

/**
 * Drop-in for react-router's `Link` that keeps the visitor in their language:
 * `/shop` becomes `/ar/shop` on Arabic pages.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ to, ...props }, ref) {
  const lang = useLang();
  return <RouterLink ref={ref} to={localizeTo(to, lang)} {...props} />;
});

/** Language-aware `useNavigate`. Numeric deltas (history) pass through. */
export function useNavigate() {
  const navigate = useRouterNavigate();
  const lang = useLang();
  return useCallback(
    (to: To | number, options?: NavigateOptions) =>
      typeof to === "number" ? navigate(to) : navigate(localizeTo(to, lang), options),
    [navigate, lang],
  );
}
