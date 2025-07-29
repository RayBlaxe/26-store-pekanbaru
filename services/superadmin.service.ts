import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Create axios instance with authentication
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Admin Management APIs
export const getAdmins = async (params?: {
  page?: number
  limit?: number
  search?: string
  status?: string
}) => {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('per_page', params.limit.toString())
  if (params?.search) queryParams.append('search', params.search)
  if (params?.status) queryParams.append('status', params.status)

  const response = await api.get(`/superadmin/admins?${queryParams}`)
  return response.data
}

export const getAdmin = async (id: string) => {
  const response = await api.get(`/superadmin/admins/${id}`)
  return response.data
}

export const createAdmin = async (adminData: {
  name: string
  email: string
  password: string
  phone?: string
}) => {
  const response = await api.post('/superadmin/admins', adminData)
  return response.data
}

export const updateAdmin = async (id: string, adminData: {
  name?: string
  email?: string
  password?: string
  phone?: string
}) => {
  const response = await api.put(`/superadmin/admins/${id}`, adminData)
  return response.data
}

export const toggleAdminStatus = async (id: string) => {
  const response = await api.patch(`/superadmin/admins/${id}/toggle-status`)
  return response.data
}

export const deleteAdmin = async (id: string) => {
  const response = await api.delete(`/superadmin/admins/${id}`)
  return response.data
}

// Analytics and Dashboard APIs for Superadmin
export const getSuperadminStats = async () => {
  const response = await api.get('/superadmin/stats')
  return response.data
}

// System Settings APIs
export const getSystemSettings = async () => {
  const response = await api.get('/superadmin/settings')
  return response.data
}

export const updateSystemSettings = async (settings: any) => {
  const response = await api.put('/superadmin/settings', settings)
  return response.data
}
