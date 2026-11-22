import { useT } from "@/i18n/useT";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUiStore, type AccountTab } from "@/store/uiStore";
import { useDrawerBehavior } from "@/lib/useDrawerBehavior";
import { cn } from "@/lib/cn";
import {
  drawerOverlay,
  drawerOverlayTransition,
  drawerPanelShell,
  drawerPanelTransition,
} from "@/lib/drawerMotion";
import { AccountDashboard } from "./AccountDashboard";
import { CreateAccountForm, ForgotPasswordForm, SignInForm } from "./AuthForms";

const TABS: { id: AccountTab; key: "signInTab" | "createTab" }[] = [
  { id: "signIn", key: "signInTab" },
  { id: "createAccount", key: "createTab" },
];

export function AccountDrawer() {
  const { m } = useT();
  const open = useUiStore((s) => s.isAccountDrawerOpen);
  const close = useUiStore((s) => s.closeAccountDrawer);
  const tab = useUiStore((s) => s.accountTab);
  const setTab = useUiStore((s) => s.setAccountTab);
  const user = useAuthStore((s) => s.user);
  const [forgot, setForgot] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useDrawerBehavior(open, close, closeRef);

  // Each opening starts from the chosen tab rather than a stale sub-view.
  useEffect(() => {
    if (open) setForgot(false);
  }, [open]);

  const title = user
    ? m.account.yourAccount
    : forgot
      ? m.account.resetPassword
      : tab === "signIn"
        ? m.account.welcomeBack
        : m.account.join;

  return (
    <div inert={!open}>
      <div
        onClick={close}
        aria-hidden
        className={cn(
          drawerOverlay,
          drawerOverlayTransition,
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      {/* Fixed clipping frame: keeps the off-screen (closed) panel from widening the page on mobile. */}
      <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby="account-drawer-title"
          aria-hidden={!open}
          className={cn(
            drawerPanelShell,
            drawerPanelTransition,
            // Slides in from the inline end: right in LTR, left in RTL.
            open ? "visible translate-x-0" : "invisible translate-x-full rtl:-translate-x-full",
          )}
        >
          <div className="flex h-full flex-col overflow-y-auto px-6 py-7">
            <div className="mb-6 flex items-center justify-between">
              <h2
                id="account-drawer-title"
                className="text-[22px] font-semibold tracking-[-0.03em]"
              >
                {title}
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label={m.account.close}
                className="grid size-6 place-items-center rounded-full transition-transform duration-300 hover:rotate-90"
              >
                <X className="size-5" strokeWidth={1.75} />
              </button>
            </div>

            {user ? (
              <AccountDashboard user={user} />
            ) : forgot ? (
              <ForgotPasswordForm onBack={() => setForgot(false)} />
            ) : (
              <>
                <div
                  role="tablist"
                  aria-label={m.account.tablist}
                  className="relative mb-7 grid grid-cols-2 border-b border-cream-200"
                >
                  {TABS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      id={`account-tab-${t.id}`}
                      aria-selected={tab === t.id}
                      aria-controls="account-tabpanel"
                      onClick={() => setTab(t.id)}
                      className={cn(
                        "py-3 text-center text-sm font-medium transition-colors",
                        tab === t.id ? "text-cocoa-900" : "text-taupe-500 hover:text-cocoa-900",
                      )}
                    >
                      {m.account[t.key]}
                    </button>
                  ))}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -bottom-px start-0 h-0.5 w-1/2 bg-cocoa-900 transition-[translate] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      tab === "signIn" ? "translate-x-0" : "translate-x-full rtl:-translate-x-full",
                    )}
                  />
                </div>

                <div id="account-tabpanel" role="tabpanel" aria-labelledby={`account-tab-${tab}`}>
                  {tab === "signIn" ? (
                    <SignInForm key="signIn" onForgotPassword={() => setForgot(true)} />
                  ) : (
                    <CreateAccountForm key="createAccount" />
                  )}
                </div>

                <p className="mt-auto border-t border-cream-200 pt-6 text-center text-[13px] text-taupe-600">
                  {tab === "signIn" ? m.account.newTo : m.account.haveAccount}
                  <button
                    type="button"
                    onClick={() => setTab(tab === "signIn" ? "createAccount" : "signIn")}
                    className="font-medium text-cocoa-900 underline underline-offset-4"
                  >
                    {tab === "signIn" ? m.account.createLink : m.account.signInLink}
                  </button>
                </p>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
