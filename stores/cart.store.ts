import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { cartService } from '@/services/cart.service'
import { Cart, CartItem, AddToCartRequest } from '@/types/product'
import { toast } from 'sonner'

interface CartStore {
  cart: Cart | null
  isLoading: boolean
  error: string | null
  isOpen: boolean
  
  // Actions
  fetchCart: () => Promise<void>
  addToCart: (request: AddToCartRequest) => Promise<void>
  addProductToCart: (productId: number, quantity?: number) => Promise<void>
  updateCartItem: (itemId: number, quantity: number) => Promise<void>
  removeFromCart: (itemId: number) => Promise<void>
  clearCart: () => Promise<void>
  openCart: () => void
  closeCart: () => void
  setLoading: (loading: boolean) => void
  clearError: () => void
  
  // Getters
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()((
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      error: null,
      isOpen: false,

      fetchCart: async () => {
        try {
          set({ isLoading: true, error: null })
          const response = await cartService.getCart()
          set({ cart: response.data, isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch cart'
          set({ error: errorMessage, isLoading: false })
          console.error('Fetch cart error:', error)
        }
      },

      addToCart: async (request: AddToCartRequest) => {
        try {
          set({ isLoading: true, error: null })
          const response = await cartService.addToCart(request)
          set({ cart: response.data, isLoading: false })
          toast.success('Product added to cart!')
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Failed to add product to cart'
          set({ error: errorMessage, isLoading: false })
          toast.error(errorMessage)
          throw error
        }
      },

      addProductToCart: async (productId: number, quantity: number = 1) => {
        try {
          set({ isLoading: true, error: null })
          const response = await cartService.addToCart({ product_id: productId, quantity })
          set({ cart: response.data, isLoading: false })
          toast.success('Product added to cart!')
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Failed to add product to cart'
          set({ error: errorMessage, isLoading: false })
          toast.error(errorMessage)
          throw error
        }
      },

      updateCartItem: async (itemId: number, quantity: number) => {
        try {
          set({ isLoading: true, error: null })
          const response = await cartService.updateCartItem(itemId, { quantity })
          set({ cart: response.data, isLoading: false })
          toast.success('Cart updated!')
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Failed to update cart'
          set({ error: errorMessage, isLoading: false })
          toast.error(errorMessage)
          throw error
        }
      },

      removeFromCart: async (itemId: number) => {
        try {
          set({ isLoading: true, error: null })
          const response = await cartService.removeFromCart(itemId)
          set({ cart: response.data, isLoading: false })
          toast.success('Product removed from cart!')
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Failed to remove product from cart'
          set({ error: errorMessage, isLoading: false })
          toast.error(errorMessage)
          throw error
        }
      },

      clearCart: async () => {
        try {
          set({ isLoading: true, error: null })
          await cartService.clearCart()
          set({ cart: null, isLoading: false })
          toast.success('Cart cleared successfully!')
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Failed to clear cart'
          set({ error: errorMessage, isLoading: false })
          toast.error(errorMessage)
          throw error
        }
      },

      openCart: () => {
        set({ isOpen: true })
      },

      closeCart: () => {
        set({ isOpen: false })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      clearError: () => {
        set({ error: null })
      },

      getTotalItems: () => {
        const { cart } = get()
        return cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0
      },

      getTotalPrice: () => {
        const { cart } = get()
        return cart?.total || 0
      },
    }),
    {
      name: 'cart-store',
      partialize: (state) => ({ 
        cart: state.cart,
      }),
    }
  )
))