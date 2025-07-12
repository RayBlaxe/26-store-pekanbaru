import api from '@/lib/auth-service'
import { Product, ProductsResponse, Category, CategoriesResponse, ProductFilters } from '@/types/product'
import { mockProductService } from './mock-product.service'

// Use mock service only when API is not available
const USE_MOCK_SERVICE = !process.env.NEXT_PUBLIC_API_URL

export const productService = {
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    if (USE_MOCK_SERVICE) {
      return mockProductService.getProducts(filters)
    }
    
    try {
      const params = new URLSearchParams()
      
      if (filters.category) params.append('category', filters.category.toString())
      if (filters.min_price) params.append('min_price', filters.min_price.toString())
      if (filters.max_price) params.append('max_price', filters.max_price.toString())
      if (filters.search) params.append('search', filters.search)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.per_page) params.append('per_page', filters.per_page.toString())
      
      const response = await api.get(`/products?${params.toString()}`)
      return response.data
    } catch (error) {
      console.warn('API call failed, falling back to mock service:', error)
      return mockProductService.getProducts(filters)
    }
  },

  async getProduct(id: number): Promise<{ data: Product }> {
    if (USE_MOCK_SERVICE) {
      return mockProductService.getProduct(id)
    }
    
    try {
      const response = await api.get(`/products/${id}`)
      return response.data
    } catch (error) {
      console.warn('API call failed, falling back to mock service:', error)
      return mockProductService.getProduct(id)
    }
  },

  async getCategories(): Promise<CategoriesResponse> {
    if (USE_MOCK_SERVICE) {
      return mockProductService.getCategories()
    }
    
    try {
      const response = await api.get('/categories')
      return response.data
    } catch (error) {
      console.warn('API call failed, falling back to mock service:', error)
      return mockProductService.getCategories()
    }
  },
}