import axios from 'axios'
import Cookies from 'js-cookie'
import { AuthResponse, LoginRequest, RegisterRequest, User } from './auth-types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('auth-token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/login', credentials)
    const { user, token } = response.data
    
    Cookies.set('auth-token', token, { 
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    
    return response.data
  },

  async register(credentials: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/register', credentials)
    const { user, token } = response.data
    
    Cookies.set('auth-token', token, { 
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    
    return response.data
  },

  async logout(): Promise<void> {
    try {
      await api.post('/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      Cookies.remove('auth-token')
    }
  },

  async getUser(): Promise<User> {
    const response = await api.get('/user')
    return response.data
  },

  getToken(): string | undefined {
    return Cookies.get('auth-token')
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}

export default api