import api from '@/lib/auth-service'
import { authService } from '@/lib/auth-service'
import { 
  Order, 
  OrdersResponse, 
  OrderResponse, 
  CreateOrderRequest, 
  PaymentTokenResponse,
  ApiResponse 
} from '@/types/product'
import { mockOrderService } from './mock-order.service'

// Use mock service when API is not available
const USE_MOCK_SERVICE = false // Disable mock service to use real Laravel backend

export const orderService = {
  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    if (USE_MOCK_SERVICE) {
      return mockOrderService.createOrder(orderData)
    }
    
    try {
      console.log('Creating order with data:', orderData)
      const response = await api.post('/orders', orderData)
      console.log('Order creation response:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Order creation API call failed:', error.response?.data || error)
      throw error // Don't fall back to mock for real testing
    }
  },

  async getOrders(page: number = 1, perPage: number = 10): Promise<OrdersResponse> {
    if (USE_MOCK_SERVICE) {
      return mockOrderService.getOrders(page, perPage)
    }
    
    try {
      const response = await api.get(`/orders?page=${page}&per_page=${perPage}`)
      return response.data
    } catch (error) {
      console.warn('API call failed, falling back to mock service:', error)
      return mockOrderService.getOrders(page, perPage)
    }
  },

  async getOrder(orderId: number): Promise<OrderResponse> {
    if (USE_MOCK_SERVICE) {
      return mockOrderService.getOrder(orderId)
    }
    
    try {
      console.log('Fetching order:', orderId)
      const response = await api.get(`/orders/${orderId}`)
      console.log('Order fetch response:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Order fetch API call failed:', error.response?.data || error)
      if (error.response && error.response.status === 404) {
        throw error;
      }
      throw error // Don't fall back to mock for real testing
    }
  },

  async getOrderByIdentifier(identifier: string | number): Promise<OrderResponse> {
    // If it's a number or a string that looks like a number, use the regular getOrder method
    const numericId = Number(identifier)
    if (!isNaN(numericId) && numericId > 0) {
      return this.getOrder(numericId)
    }

    // If it's a string (order_number like "ORD-20250713-0004"), try to find by order_number
    if (USE_MOCK_SERVICE) {
      return mockOrderService.getOrderByNumber(identifier.toString())
    }

    try {
      console.log('Fetching order by order_number:', identifier)
      // Try to get all orders and find the one with matching order_number
      // This is not the most efficient, but works with the current backend
      const ordersResponse = await api.get(`/orders?per_page=100`)
      const orders = ordersResponse.data.data
      
      const order = orders.find((o: any) => o.order_number === identifier)
      if (!order) {
        throw new Error('Order not found')
      }

      // Now get the full order details using the numeric ID
      return this.getOrder(order.id)
    } catch (error: any) {
      console.error('Order fetch by order_number failed:', error.response?.data || error)
      throw new Error('Order not found. Please check if the order exists and try again.')
    }
  },

  async getPaymentToken(orderId: number): Promise<PaymentTokenResponse> {
    // Use mock service if Midtrans is not configured
    if (USE_MOCK_SERVICE) {
      return mockOrderService.getPaymentToken(orderId)
    }
    
    // Use Next.js API route for real payment tokens when Midtrans is configured
    try {
      const token = authService.getToken()
      const response = await fetch(`/api/orders/${orderId}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      })
      
      if (!response.ok) {
        throw new Error(`Payment API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error: any) {
      console.warn('Payment API call failed:', error.message || error)
      
      // If it's a 404 (order not found), don't fall back to mock
      if (error.message && error.message.includes('Payment API error: 404')) {
        throw new Error('Order not found. Please check if the order exists and try again.')
      }
      
      console.warn('Falling back to mock service')
      return mockOrderService.getPaymentToken(orderId)
    }
  },

  async updateOrderStatus(orderId: number, status: string): Promise<OrderResponse> {
    if (USE_MOCK_SERVICE) {
      console.log('Using mock service to update order status:', { orderId, status })
      return mockOrderService.updateOrderStatus(orderId, status)
    }
    
    try {
      console.log('Updating order status via Laravel API:', { orderId, status })
      const response = await api.patch(`/orders/${orderId}/status`, { status })
      console.log('Laravel API response:', response.data)
      
      // Laravel API returns { success: true, data: OrderResource }
      if (response.data.success) {
        return { data: response.data.data }
      } else {
        throw new Error(response.data.message || 'Failed to update order status')
      }
    } catch (error: any) {
      console.error('Failed to update order status:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data
      })
      
      // Re-throw the error with proper message
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update order status'
      throw new Error(errorMessage)
    }
  },

  async cancelOrder(orderId: number): Promise<OrderResponse> {
    if (USE_MOCK_SERVICE) {
      return mockOrderService.cancelOrder(orderId)
    }
    
    try {
      const response = await api.post(`/orders/${orderId}/cancel`)
      return response.data
    } catch (error) {
      console.warn('API call failed, falling back to mock service:', error)
      return mockOrderService.cancelOrder(orderId)
    }
  }
}