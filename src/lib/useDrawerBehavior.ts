import { useEffect, type RefObject } from "react";
import { useLocation } from "react-router";

/**
 * Shared slide-over behaviour: closes on navigation and Escape, locks page
 * scroll while open, and moves focus into the panel.
 */
export function useDrawerBehavior(
  open: boolean,
  onClose: () => void,
  focusRef?: RefObject<HTMLElement | null>,
) {
  const { pathname } = useLocation();

  useEffect(() => onClose(), [pathname, onClose]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    focusRef?.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, focusRef]);
}
