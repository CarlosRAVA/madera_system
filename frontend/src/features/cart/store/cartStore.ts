import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/shared/types';

export interface CartLine {
  productId: number;
  name: string;
  unitPrice: string;
  imageUrl: string | null;
  quantity: number;
  /** Stock disponible al momento de agregar, usado solo para no dejar subir de más en la UI. */
  stock: number;
}

interface CartState {
  lines: CartLine[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

/** Carrito de compras. Persistido en localStorage (RNF4: sobrevive recargas). */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find(
            (line) => line.productId === product.id,
          );
          if (existing) {
            const nextQty = Math.min(
              existing.quantity + quantity,
              product.stock,
            );
            return {
              lines: state.lines.map((line) =>
                line.productId === product.id
                  ? { ...line, quantity: nextQty }
                  : line,
              ),
            };
          }
          return {
            lines: [
              ...state.lines,
              {
                productId: product.id,
                name: product.name,
                unitPrice: product.price,
                imageUrl: product.imageUrl,
                quantity: Math.min(quantity, product.stock),
                stock: product.stock,
              },
            ],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          lines: state.lines.filter((line) => line.productId !== productId),
        })),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          lines: state.lines
            .map((line) =>
              line.productId === productId
                ? {
                    ...line,
                    quantity: Math.max(1, Math.min(quantity, line.stock)),
                  }
                : line,
            )
            .filter((line) => line.quantity > 0),
        })),

      clear: () => set({ lines: [] }),

      totalItems: () =>
        get().lines.reduce((sum, line) => sum + line.quantity, 0),

      subtotal: () =>
        get().lines.reduce(
          (sum, line) => sum + Number(line.unitPrice) * line.quantity,
          0,
        ),
    }),
    {
      name: 'lr-cart-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
