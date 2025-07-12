import { Cart, CartItem } from '@/types/product'

// Mock cart data stored in memory (in real app, this would be in localStorage or backend)
let mockCart: Cart = {
  id: 1,
  user_id: 1,
  items: [],
  total_price: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockCartService = {
  async getCart(): Promise<{ data: Cart }> {
    await delay(300)
    return { data: mockCart }
  },

  async addToCart(product_id: number, quantity: number = 1): Promise<{ data: CartItem }> {
    await delay(400)
    
    // Find existing item
    const existingItemIndex = mockCart.items.findIndex(item => item.product.id === product_id)
    
    if (existingItemIndex >= 0) {
      // Update existing item
      mockCart.items[existingItemIndex].quantity += quantity
      mockCart.items[existingItemIndex].subtotal = mockCart.items[existingItemIndex].quantity * mockCart.items[existingItemIndex].product.price
    } else {
      // Add new item (you'd need to fetch product details in real implementation)
      const newItem: CartItem = {
        id: Date.now(),
        cart_id: mockCart.id,
        product_id,
        quantity,
        subtotal: 0, // This would be calculated based on product price
        product: {
          id: product_id,
          name: `Product ${product_id}`,
          price: 999000,
          image: '/placeholder.svg?height=300&width=300',
          description: 'Mock product',
          stock: 10,
          rating: 4.5,
          category: { id: 1, name: 'Mock Category' },
          images: ['/placeholder.svg?height=300&width=300'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      newItem.subtotal = newItem.quantity * newItem.product.price
      mockCart.items.push(newItem)
    }
    
    // Recalculate total
    mockCart.total_price = mockCart.items.reduce((sum, item) => sum + item.subtotal, 0)
    mockCart.updated_at = new Date().toISOString()
    
    return { data: mockCart.items[existingItemIndex >= 0 ? existingItemIndex : mockCart.items.length - 1] }
  },

  async updateCartItem(item_id: number, quantity: number): Promise<{ data: CartItem }> {
    await delay(300)
    
    const itemIndex = mockCart.items.findIndex(item => item.id === item_id)
    if (itemIndex === -1) {
      throw new Error('Cart item not found')
    }
    
    if (quantity <= 0) {
      // Remove item
      mockCart.items.splice(itemIndex, 1)
    } else {
      // Update quantity
      mockCart.items[itemIndex].quantity = quantity
      mockCart.items[itemIndex].subtotal = quantity * mockCart.items[itemIndex].product.price
    }
    
    // Recalculate total
    mockCart.total_price = mockCart.items.reduce((sum, item) => sum + item.subtotal, 0)
    mockCart.updated_at = new Date().toISOString()
    
    return { data: mockCart.items[itemIndex] }
  },

  async removeFromCart(item_id: number): Promise<{ message: string }> {
    await delay(300)
    
    const itemIndex = mockCart.items.findIndex(item => item.id === item_id)
    if (itemIndex === -1) {
      throw new Error('Cart item not found')
    }
    
    mockCart.items.splice(itemIndex, 1)
    
    // Recalculate total
    mockCart.total_price = mockCart.items.reduce((sum, item) => sum + item.subtotal, 0)
    mockCart.updated_at = new Date().toISOString()
    
    return { message: 'Item removed from cart' }
  },
}