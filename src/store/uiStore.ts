import { create } from "zustand";

export type AccountTab = "signIn" | "createAccount";

/** Transient UI state shared across the layout (not persisted). Only one drawer is open at a time. */
interface UiState {
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  isAccountDrawerOpen: boolean;
  accountTab: AccountTab;
  openAccountDrawer: (tab?: AccountTab) => void;
  closeAccountDrawer: () => void;
  setAccountTab: (tab: AccountTab) => void;
  isSearchDrawerOpen: boolean;
  openSearchDrawer: () => void;
  closeSearchDrawer: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  isCartDrawerOpen: false,
  openCartDrawer: () =>
    set({ isCartDrawerOpen: true, isAccountDrawerOpen: false, isSearchDrawerOpen: false }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
  isAccountDrawerOpen: false,
  accountTab: "signIn",
  openAccountDrawer: (tab) =>
    set((state) => ({
      isAccountDrawerOpen: true,
      isCartDrawerOpen: false,
      isSearchDrawerOpen: false,
      accountTab: tab ?? state.accountTab,
    })),
  closeAccountDrawer: () => set({ isAccountDrawerOpen: false }),
  setAccountTab: (tab) => set({ accountTab: tab }),
  isSearchDrawerOpen: false,
  openSearchDrawer: () =>
    set({ isSearchDrawerOpen: true, isCartDrawerOpen: false, isAccountDrawerOpen: false }),
  closeSearchDrawer: () => set({ isSearchDrawerOpen: false }),
}));

/** True when the click should keep native link behaviour (new tab, etc.). */
export const isModifiedClick = (e: {
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  button: number;
}) => e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
