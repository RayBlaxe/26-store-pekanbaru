import api from '@/lib/auth-service'
import { Cart, CartResponse, AddToCartRequest, UpdateCartItemRequest } from '@/types/product'
import { mockCartService } from './mock-cart.service'

// Use mock service in development or when API is not available
const USE_MOCK_SERVICE = process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_API_URL

export const cartService = {
  async getCart(): Promise<CartResponse> {
    if (USE_MOCK_SERVICE) {
      const mockResponse = await mockCartService.getCart()
      return { data: mockResponse.data }
    }
    
    try {
      const response = await api.get('/cart')
      return response.data
    } catch (error) {
      console.warn('API call failed, falling back to mock service:', error)
      const mockResponse = await mockCartService.getCart()
      return { data: mockResponse.data }
    }
  },

  async addToCart(request: AddToCartRequest): Promise<{ data: Cart }> {
    if (USE_MOCK_SERVICE) {
      const mockResponse = await mockCartService.addToCart(request.product_id, request.quantity)
      // Return the entire cart for consistency
      const cartResponse = await mockCartService.getCart()
      return { data: cartResponse.data }
    }
    
    try {
      const response = await api.post('/cart/items', request)
      return response.data
    } catch (error) {
      console.warn('API call failed, falling back to mock service:', error)
      const mockResponse = await mockCartService.addToCart(request.product_id, request.quantity)
      const cartResponse = await mockCartService.getCart()
      return { data: cartResponse.data }
    }
  },

  async updateCartItem(itemId: number, request: UpdateCartItemRequest): Promise<{ data: Cart }> {
    if (USE_MOCK_SERVICE) {
      await mockCartService.updateCartItem(itemId, request.quantity)
      const cartResponse = await mockCartService.getCart()
      return { data: cartResponse.data }
    }
    
    try {
      const response = await api.put(`/cart/items/${itemId}`, request)
      return response.data
    } catch (error) {
      console.warn('API call failed, falling back to mock service:', error)
      await mockCartService.updateCartItem(itemId, request.quantity)
      const cartResponse = await mockCartService.getCart()
      return { data: cartResponse.data }
    }
  },

  async removeFromCart(itemId: number): Promise<{ data: Cart }> {
    if (USE_MOCK_SERVICE) {
      await mockCartService.removeFromCart(itemId)
      const cartResponse = await mockCartService.getCart()
      return { data: cartResponse.data }
    }
    
    try {
      const response = await api.delete(`/cart/items/${itemId}`)
      return response.data
    } catch (error) {
      console.warn('API call failed, falling back to mock service:', error)
      await mockCartService.removeFromCart(itemId)
      const cartResponse = await mockCartService.getCart()
      return { data: cartResponse.data }
    }
  },
}