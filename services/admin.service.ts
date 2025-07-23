import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

// Dashboard APIs
export const getDashboardStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/dashboard/stats`)
  return response.data
}

export const getSalesChart = async (period: '7d' | '30d' | '90d' = '30d') => {
  const response = await axios.get(`${API_BASE_URL}/admin/dashboard/sales-chart?period=${period}`)
  return response.data
}

export const getRecentOrders = async (limit: number = 10) => {
  const response = await axios.get(`${API_BASE_URL}/admin/dashboard/recent-orders?limit=${limit}`)
  return response.data
}

export const getTopProducts = async (limit: number = 5) => {
  const response = await axios.get(`${API_BASE_URL}/admin/dashboard/top-products?limit=${limit}`)
  return response.data
}

export const getLowStockProducts = async (threshold: number = 10) => {
  const response = await axios.get(`${API_BASE_URL}/admin/dashboard/low-stock?threshold=${threshold}`)
  return response.data
}

// Products APIs
export const getProducts = async (params?: {
  page?: number
  limit?: number
  search?: string
  category?: string
  inStock?: boolean
}) => {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.search) queryParams.append('search', params.search)
  if (params?.category) queryParams.append('category', params.category)
  if (params?.inStock !== undefined) queryParams.append('inStock', params.inStock.toString())

  const response = await axios.get(`${API_BASE_URL}/admin/products?${queryParams}`)
  return response.data
}

export const getProduct = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/admin/products/${id}`)
  return response.data
}

export const createProduct = async (productData: any) => {
  const response = await axios.post(`${API_BASE_URL}/admin/products`, productData)
  return response.data
}

export const updateProduct = async (id: string, productData: any) => {
  const response = await axios.put(`${API_BASE_URL}/admin/products/${id}`, productData)
  return response.data
}

export const deleteProduct = async (id: string) => {
  const response = await axios.delete(`${API_BASE_URL}/admin/products/${id}`)
  return response.data
}

export const bulkDeleteProducts = async (ids: string[]) => {
  const response = await axios.post(`${API_BASE_URL}/admin/products/bulk-delete`, { ids })
  return response.data
}

export const updateProductStock = async (id: string, stock: number) => {
  const response = await axios.patch(`${API_BASE_URL}/admin/products/${id}/stock`, { stock })
  return response.data
}

// Orders APIs
export const getOrders = async (params?: {
  page?: number
  limit?: number
  status?: string
  search?: string
  startDate?: string
  endDate?: string
}) => {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.status) queryParams.append('status', params.status)
  if (params?.search) queryParams.append('search', params.search)
  if (params?.startDate) queryParams.append('startDate', params.startDate)
  if (params?.endDate) queryParams.append('endDate', params.endDate)

  const response = await axios.get(`${API_BASE_URL}/admin/orders?${queryParams}`)
  return response.data
}

export const getOrder = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/admin/orders/${id}`)
  return response.data
}

export const updateOrderStatus = async (id: string, status: string, notes?: string) => {
  const response = await axios.patch(`${API_BASE_URL}/admin/orders/${id}/status`, { status, notes })
  return response.data
}

export const getOrderStatusHistory = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/admin/orders/${id}/status-history`)
  return response.data
}

// Users APIs
export const getUsers = async (params?: {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
}) => {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.search) queryParams.append('search', params.search)
  if (params?.role) queryParams.append('role', params.role)
  if (params?.status) queryParams.append('status', params.status)

  const response = await axios.get(`${API_BASE_URL}/admin/users?${queryParams}`)
  return response.data
}

export const getUser = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/admin/users/${id}`)
  return response.data
}

export const updateUserRole = async (id: string, role: string) => {
  const response = await axios.patch(`${API_BASE_URL}/admin/users/${id}/role`, { role })
  return response.data
}

export const toggleUserStatus = async (id: string) => {
  const response = await axios.patch(`${API_BASE_URL}/admin/users/${id}/toggle-status`)
  return response.data
}

export const getUserOrderHistory = async (id: string, params?: {
  page?: number
  limit?: number
}) => {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())

  const response = await axios.get(`${API_BASE_URL}/admin/users/${id}/orders?${queryParams}`)
  return response.data
}

// Categories APIs
export const getCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/categories`)
  return response.data
}

export const createCategory = async (categoryData: { name: string; description?: string }) => {
  const response = await axios.post(`${API_BASE_URL}/admin/categories`, categoryData)
  return response.data
}

export const updateCategory = async (id: string, categoryData: { name: string; description?: string }) => {
  const response = await axios.put(`${API_BASE_URL}/admin/categories/${id}`, categoryData)
  return response.data
}

export const deleteCategory = async (id: string) => {
  const response = await axios.delete(`${API_BASE_URL}/admin/categories/${id}`)
  return response.data
}

// Export APIs
export const exportProducts = async (format: 'csv' | 'excel' = 'csv') => {
  const response = await axios.get(`${API_BASE_URL}/admin/export/products?format=${format}`, {
    responseType: 'blob'
  })
  return response.data
}

export const exportOrders = async (format: 'csv' | 'excel' = 'csv', params?: {
  startDate?: string
  endDate?: string
  status?: string
}) => {
  const queryParams = new URLSearchParams()
  queryParams.append('format', format)
  if (params?.startDate) queryParams.append('startDate', params.startDate)
  if (params?.endDate) queryParams.append('endDate', params.endDate)
  if (params?.status) queryParams.append('status', params.status)

  const response = await axios.get(`${API_BASE_URL}/admin/export/orders?${queryParams}`, {
    responseType: 'blob'
  })
  return response.data
}

export const exportUsers = async (format: 'csv' | 'excel' = 'csv') => {
  const response = await axios.get(`${API_BASE_URL}/admin/export/users?format=${format}`, {
    responseType: 'blob'
  })
  return response.data
}