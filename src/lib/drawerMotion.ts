/**
 * Shared slide-over motion so every drawer (menu, search, cart, account)
 * opens and closes at the same speed and with the same easing.
 */
export const DRAWER_DURATION_MS = 400;

export const drawerPanelTransition =
  "transition-[translate,visibility] duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none";

export const drawerOverlayTransition =
  "transition-opacity duration-[400ms] ease-out motion-reduce:transition-none";

/** Shared right-hand slide-over shell (search, cart, account): rounded leading edge, same width. */
export const drawerPanelShell =
  "pointer-events-auto absolute top-0 end-0 h-full w-[92vw] overflow-hidden rounded-s-3xl bg-white shadow-[-24px_0_48px_-24px_rgb(44_26_25/0.3)] sm:w-[480px]";

/** Shared dimmed, softly blurred backdrop behind slide-overs. */
export const drawerOverlay = "fixed inset-0 z-[90] bg-cocoa-900/30 backdrop-blur-[2px]";
