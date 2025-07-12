import { Product, ProductsResponse, Category, CategoriesResponse, ProductFilters } from '@/types/product'

// Mock data for development
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Nike Air Max 270",
    price: 1499000,
    image: "/placeholder.svg?height=300&width=300",
    description: "Sepatu olahraga premium dengan teknologi Air Max untuk kenyamanan maksimal.",
    stock: 15,
    rating: 4.5,
    category: { id: 1, name: "Sepatu Lari" },
    images: ["/placeholder.svg?height=300&width=300"],
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 2,
    name: "Adidas UltraBoost 22",
    price: 1799000,
    image: "/placeholder.svg?height=300&width=300",
    description: "Sepatu lari dengan teknologi Boost yang memberikan energi kembali di setiap langkah.",
    stock: 8,
    rating: 4.8,
    category: { id: 1, name: "Sepatu Lari" },
    images: ["/placeholder.svg?height=300&width=300"],
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 3,
    name: "Puma RS-X",
    price: 1299000,
    image: "/placeholder.svg?height=300&width=300",
    description: "Sepatu lifestyle dengan desain retro-futuristik yang menarik.",
    stock: 12,
    rating: 4.3,
    category: { id: 2, name: "Sepatu Lifestyle" },
    images: ["/placeholder.svg?height=300&width=300"],
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 4,
    name: "Converse Chuck Taylor All Star",
    price: 799000,
    image: "/placeholder.svg?height=300&width=300",
    description: "Sepatu klasik yang tidak pernah ketinggalan zaman.",
    stock: 25,
    rating: 4.2,
    category: { id: 2, name: "Sepatu Lifestyle" },
    images: ["/placeholder.svg?height=300&width=300"],
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 5,
    name: "New Balance 574",
    price: 1099000,
    image: "/placeholder.svg?height=300&width=300",
    description: "Sepatu casual dengan kombinasi sempurna antara gaya dan kenyamanan.",
    stock: 18,
    rating: 4.4,
    category: { id: 2, name: "Sepatu Lifestyle" },
    images: ["/placeholder.svg?height=300&width=300"],
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 6,
    name: "Vans Old Skool",
    price: 899000,
    image: "/placeholder.svg?height=300&width=300",
    description: "Sepatu skate klasik dengan desain ikonik yang timeless.",
    stock: 22,
    rating: 4.6,
    category: { id: 3, name: "Sepatu Skate" },
    images: ["/placeholder.svg?height=300&width=300"],
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 7,
    name: "Under Armour HOVR",
    price: 1699000,
    image: "/placeholder.svg?height=300&width=300",
    description: "Sepatu training dengan teknologi HOVR untuk performa maksimal.",
    stock: 10,
    rating: 4.7,
    category: { id: 4, name: "Sepatu Training" },
    images: ["/placeholder.svg?height=300&width=300"],
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 8,
    name: "Reebok Nano X",
    price: 1399000,
    image: "/placeholder.svg?height=300&width=300",
    description: "Sepatu CrossFit yang dirancang untuk workout intensif.",
    stock: 6,
    rating: 4.5,
    category: { id: 4, name: "Sepatu Training" },
    images: ["/placeholder.svg?height=300&width=300"],
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  }
]

const mockCategories: Category[] = [
  { id: 1, name: "Sepatu Lari", created_at: "2024-01-01T00:00:00.000Z", updated_at: "2024-01-01T00:00:00.000Z" },
  { id: 2, name: "Sepatu Lifestyle", created_at: "2024-01-01T00:00:00.000Z", updated_at: "2024-01-01T00:00:00.000Z" },
  { id: 3, name: "Sepatu Skate", created_at: "2024-01-01T00:00:00.000Z", updated_at: "2024-01-01T00:00:00.000Z" },
  { id: 4, name: "Sepatu Training", created_at: "2024-01-01T00:00:00.000Z", updated_at: "2024-01-01T00:00:00.000Z" },
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockProductService = {
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    await delay(500) // Simulate API delay
    
    let filteredProducts = [...mockProducts]
    
    // Apply filters
    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => p.category.id === filters.category)
    }
    
    if (filters.search) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.search!.toLowerCase())
      )
    }
    
    if (filters.min_price) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.min_price!)
    }
    
    if (filters.max_price) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.max_price!)
    }
    
    // Pagination
    const page = filters.page || 1
    const perPage = filters.per_page || 12
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)
    
    return {
      data: paginatedProducts,
      current_page: page,
      last_page: Math.ceil(filteredProducts.length / perPage),
      per_page: perPage,
      total: filteredProducts.length,
      from: startIndex + 1,
      to: Math.min(endIndex, filteredProducts.length)
    }
  },

  async getProduct(id: number): Promise<{ data: Product }> {
    await delay(300)
    
    const product = mockProducts.find(p => p.id === id)
    if (!product) {
      throw new Error('Product not found')
    }
    
    return { data: product }
  },

  async getCategories(): Promise<CategoriesResponse> {
    await delay(200)
    
    return {
      data: mockCategories
    }
  },
}