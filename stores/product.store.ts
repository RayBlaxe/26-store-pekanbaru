import { create } from 'zustand'
import { ProductFilters } from '@/types/product'

interface ProductStore {
  filters: ProductFilters
  searchQuery: string
  selectedCategory: number | null
  priceRange: [number, number]
  currentPage: number
  
  // Actions
  setFilters: (filters: Partial<ProductFilters>) => void
  setSearchQuery: (query: string) => void
  setSelectedCategory: (categoryId: number | null) => void
  setPriceRange: (range: [number, number]) => void
  setCurrentPage: (page: number) => void
  clearFilters: () => void
  resetPagination: () => void
}

export const useProductStore = create<ProductStore>()((set, get) => ({
  filters: {
    page: 1,
    per_page: 12,
  },
  searchQuery: '',
  selectedCategory: null,
  priceRange: [0, 10000000], // Default price range in IDR
  currentPage: 1,

  setFilters: (newFilters: Partial<ProductFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters }
    }))
  },

  setSearchQuery: (query: string) => {
    set(state => ({
      searchQuery: query,
      filters: { ...state.filters, search: query, page: 1 }
    }))
  },

  setSelectedCategory: (categoryId: number | null) => {
    set(state => ({
      selectedCategory: categoryId,
      filters: { ...state.filters, category: categoryId || undefined, page: 1 }
    }))
  },

  setPriceRange: (range: [number, number]) => {
    set(state => ({
      priceRange: range,
      filters: { 
        ...state.filters, 
        min_price: range[0], 
        max_price: range[1],
        page: 1 
      }
    }))
  },

  setCurrentPage: (page: number) => {
    set(state => ({
      currentPage: page,
      filters: { ...state.filters, page }
    }))
  },

  clearFilters: () => {
    set({
      filters: { page: 1, per_page: 12 },
      searchQuery: '',
      selectedCategory: null,
      priceRange: [0, 10000000],
      currentPage: 1,
    })
  },

  resetPagination: () => {
    set(state => ({
      currentPage: 1,
      filters: { ...state.filters, page: 1 }
    }))
  },
}))