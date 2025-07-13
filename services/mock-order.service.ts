import { Order, OrdersResponse, OrderResponse, CreateOrderRequest, PaymentTokenResponse } from '@/types/product'

// Mock orders data
let mockOrders: Order[] = [
  {
    id: 1,
    user_id: 1,
    order_number: 'ORD-2024-001',
    status: 'delivered',
    payment_status: 'paid',
    total_amount: 515000,
    shipping_cost: 15000,
    shipping_address: {
      id: 1,
      user_id: 1,
      name: 'John Doe',
      phone: '08123456789',
      street: 'Jl. Merdeka No. 123',
      city: 'Pekanbaru',
      state: 'Riau',
      postal_code: '28111',
      is_default: true,
      created_at: '2024-01-15T08:00:00Z',
      updated_at: '2024-01-15T08:00:00Z'
    },
    items: [
      {
        id: 1,
        order_id: 1,
        product_id: 1,
        product: {
          id: 1,
          name: 'Sepatu Running Nike Air Max',
          slug: 'sepatu-running-nike-air-max',
          price: '500000',
          formatted_price: 'Rp 500.000',
          image: '/placeholder.jpg',
          images: ['/placeholder.jpg'],
          description: 'Sepatu running berkualitas tinggi',
          category_id: 1,
          stock: 10,
          rating: 4.5,
          in_stock: true,
          sku: 'NIKE-001',
          weight: '500g',
          is_active: true,
          views: 100,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        quantity: 1,
        price: 500000,
        subtotal: 500000
      }
    ],
    payment_method: 'midtrans',
    notes: 'Mohon kirim dengan packaging yang aman',
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    user_id: 1,
    order_number: 'ORD-2024-002',
    status: 'shipped',
    payment_status: 'paid',
    total_amount: 315000,
    shipping_cost: 15000,
    shipping_address: {
      id: 1,
      user_id: 1,
      name: 'John Doe',
      phone: '08123456789',
      street: 'Jl. Merdeka No. 123',
      city: 'Pekanbaru',
      state: 'Riau',
      postal_code: '28111',
      is_default: true,
      created_at: '2024-01-15T08:00:00Z',
      updated_at: '2024-01-15T08:00:00Z'
    },
    items: [
      {
        id: 2,
        order_id: 2,
        product_id: 2,
        product: {
          id: 2,
          name: 'Jersey Bola Adidas',
          slug: 'jersey-bola-adidas',
          price: '300000',
          formatted_price: 'Rp 300.000',
          image: '/placeholder.jpg',
          images: ['/placeholder.jpg'],
          description: 'Jersey bola original Adidas',
          category_id: 2,
          stock: 5,
          rating: 4.8,
          in_stock: true,
          sku: 'ADIDAS-001',
          weight: '200g',
          is_active: true,
          views: 150,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        quantity: 1,
        price: 300000,
        subtotal: 300000
      }
    ],
    payment_method: 'midtrans',
    created_at: '2024-01-20T14:30:00Z',
    updated_at: '2024-01-21T09:15:00Z'
  },
  {
    id: 3,
    user_id: 1,
    order_number: 'ORD-2024-003',
    status: 'pending',
    payment_status: 'pending',
    total_amount: 415000,
    shipping_cost: 15000,
    shipping_address: {
      id: 1,
      user_id: 1,
      name: 'John Doe',
      phone: '08123456789',
      street: 'Jl. Merdeka No. 123',
      city: 'Pekanbaru',
      state: 'Riau',
      postal_code: '28111',
      is_default: true,
      created_at: '2024-01-15T08:00:00Z',
      updated_at: '2024-01-15T08:00:00Z'
    },
    items: [
      {
        id: 3,
        order_id: 3,
        product_id: 3,
        product: {
          id: 3,
          name: 'Raket Badminton Yonex',
          slug: 'raket-badminton-yonex',
          price: '400000',
          formatted_price: 'Rp 400.000',
          image: '/placeholder.jpg',
          images: ['/placeholder.jpg'],
          description: 'Raket badminton profesional Yonex',
          category_id: 3,
          stock: 8,
          rating: 4.7,
          in_stock: true,
          sku: 'YONEX-001',
          weight: '300g',
          is_active: true,
          views: 80,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        quantity: 1,
        price: 400000,
        subtotal: 400000
      }
    ],
    payment_method: 'midtrans',
    payment_token: 'mock-payment-token-123',
    created_at: '2024-01-25T11:00:00Z',
    updated_at: '2024-01-25T11:00:00Z'
  }
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockOrderService = {
  async getOrders(page: number = 1, perPage: number = 10): Promise<OrdersResponse> {
    await delay(500)
    
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const paginatedOrders = mockOrders.slice(startIndex, endIndex)
    
    return {
      data: paginatedOrders,
      current_page: page,
      last_page: Math.ceil(mockOrders.length / perPage),
      per_page: perPage,
      total: mockOrders.length,
      from: startIndex + 1,
      to: Math.min(endIndex, mockOrders.length)
    }
  },

  async getOrder(orderId: number): Promise<OrderResponse> {
    await delay(300)
    
    const order = mockOrders.find(o => o.id === orderId)
    if (!order) {
      throw new Error('Order not found')
    }
    
    return { data: order }
  },

  async getOrderByNumber(orderNumber: string): Promise<OrderResponse> {
    await delay(300)
    
    const order = mockOrders.find(o => o.order_number === orderNumber)
    if (!order) {
      throw new Error('Order not found')
    }
    
    return { data: order }
  },

  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    await delay(800)
    
    const newOrderId = Math.max(...mockOrders.map(o => o.id), 0) + 1
    const newOrder: Order = {
      id: newOrderId,
      user_id: 1,
      order_number: `ORD-2024-${String(newOrderId).padStart(3, '0')}`,
      status: 'pending',
      payment_status: 'pending',
      total_amount: 515000, // This would be calculated from cart
      shipping_cost: 15000,
      shipping_address: {
        id: orderData.shipping_address_id,
        user_id: 1,
        name: 'John Doe',
        phone: '08123456789',
        street: 'Jl. Merdeka No. 123',
        city: 'Pekanbaru',
        state: 'Riau',
        postal_code: '28111',
        is_default: true,
        created_at: '2024-01-15T08:00:00Z',
        updated_at: '2024-01-15T08:00:00Z'
      },
      items: [], // This would be populated from cart items
      payment_method: orderData.payment_method,
      notes: orderData.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    mockOrders.unshift(newOrder)
    return { data: newOrder }
  },

  async getPaymentToken(orderId: number): Promise<PaymentTokenResponse> {
    await delay(400)
    
    const order = mockOrders.find(o => o.id === orderId)
    if (!order) {
      throw new Error('Order not found')
    }
    
    return {
      token: `mock-payment-token-${orderId}-${Date.now()}`,
      redirect_url: `https://app.sandbox.midtrans.com/snap/v2/vtweb/mock-token-${orderId}`
    }
  },

  async updateOrderStatus(orderId: number, status: string): Promise<OrderResponse> {
    await delay(300)
    
    const orderIndex = mockOrders.findIndex(o => o.id === orderId)
    if (orderIndex === -1) {
      throw new Error('Order not found')
    }
    
    // When updating to 'processing', also update payment status to 'paid' 
    // since this indicates successful payment
    const updateData: Partial<Order> = {
      status: status as any,
      updated_at: new Date().toISOString()
    }
    
    if (status === 'processing' && mockOrders[orderIndex].payment_status === 'pending') {
      updateData.payment_status = 'paid'
    }
    
    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      ...updateData
    }
    
    console.log(`Updated order ${orderId} status to ${status}, payment_status: ${mockOrders[orderIndex].payment_status}`)
    return { data: mockOrders[orderIndex] }
  },

  async cancelOrder(orderId: number): Promise<OrderResponse> {
    await delay(300)
    
    const orderIndex = mockOrders.findIndex(o => o.id === orderId)
    if (orderIndex === -1) {
      throw new Error('Order not found')
    }
    
    if (mockOrders[orderIndex].payment_status === 'paid') {
      throw new Error('Cannot cancel paid order')
    }
    
    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      status: 'cancelled',
      updated_at: new Date().toISOString()
    }
    
    return { data: mockOrders[orderIndex] }
  }
}