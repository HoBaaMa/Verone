import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

export const MAX_LINE_QUANTITY = 10;
export const NOTE_MAX_LENGTH = 300;

interface CartState {
  items: CartItem[];
  /** Optional note for the order (gift message, delivery instructions). */
  note: string;
  setNote: (note: string) => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

const toCartItem = (product: Product, quantity: number): CartItem => ({
  productId: product.id,
  slug: product.slug,
  brand: product.brand,
  name: product.name,
  subtitle: product.subtitle,
  titles: product.titles,
  image: product.images[0]?.url ?? "",
  size: product.size,
  prices: product.prices,
  quantity,
});

const clamp = (quantity: number) => Math.min(MAX_LINE_QUANTITY, Math.max(1, Math.floor(quantity)));

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      note: "",
      setNote: (note) => set({ note: note.slice(0, NOTE_MAX_LENGTH) }),
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.productId === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id
                  ? { ...item, quantity: clamp(item.quantity + quantity) }
                  : item,
              ),
            };
          }
          return { items: [...state.items, toCartItem(product, clamp(quantity))] };
        }),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity < 1
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, quantity: clamp(quantity) } : i,
                ),
        })),
      clear: () => set({ items: [], note: "" }),
    }),
    {
      name: "verone-cart",
      // v2: new catalog and per-currency price snapshots; older carts are discarded.
      version: 2,
      migrate: () => ({ items: [], note: "" }),
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, note: state.note }),
    },
  ),
);

export const selectCartCount = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);
