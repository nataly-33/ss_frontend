import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@modules/cart/types";

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, cantidad: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemsCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.prenda.id === newItem.prenda.id &&
              item.talla.id === newItem.talla.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.prenda.id === newItem.prenda.id &&
                item.talla.id === newItem.talla.id
                  ? { ...item, cantidad: item.cantidad + newItem.cantidad }
                  : item
              ),
            };
          }

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, cantidad) => {
        if (cantidad <= 0) {
          get().removeItem(itemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, cantidad } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        const items = get().items;
        return items.reduce(
          (sum, item) => sum + item.prenda.precio * item.cantidad,
          0
        );
      },

      getItemsCount: () => {
        const items = get().items;
        return items.reduce((sum, item) => sum + item.cantidad, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
