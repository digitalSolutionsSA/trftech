import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, DbProduct, DbProductVariant } from '../types'

interface CartStore {
  items: CartItem[]
  add: (product: DbProduct, variant?: DbProductVariant) => void
  remove: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clear: () => void
  total: () => number
  count: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      add: (product, variant) => {
        const id = variant ? `${product.id}::${variant.id}` : product.id
        set((state) => {
          const existing = state.items.find((i) => i.id === id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === id ? { ...i, qty: i.qty + 1 } : i
              ),
            }
          }
          return {
            items: [
              ...state.items,
              {
                id,
                name: variant ? `${product.name} — ${variant.label}` : product.name,
                price: Number(variant ? variant.price : product.price),
                category: product.categories?.name ?? '',
                icon: product.icon,
                gradient: product.gradient,
                qty: 1,
              },
            ],
          }
        })
      },

      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQty: (id, qty) => {
        if (qty <= 0) {
          get().remove(id)
        } else {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === id ? { ...i, qty } : i
            ),
          }))
        }
      },

      clear: () => set({ items: [] }),

      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.qty, 0),

      count: () =>
        get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    {
      name: 'trf-tech-cart',
      version: 1,
      // v0 carts (from the old static catalogue) stored numeric ids
      migrate: (persisted) => {
        const state = persisted as { items?: CartItem[] }
        return {
          ...state,
          items: (state.items ?? []).map((i) => ({ ...i, id: String(i.id) })),
        } as CartStore
      },
    }
  )
)

export const formatPrice = (amount: number): string =>
  'R ' + amount.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
