export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'customer'
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<{ redirectTo: string }>
  register: (credentials: RegisterRequest) => Promise<{ redirectTo: string }>
  logout: () => void
  clearError: () => void
}

export interface AuthResponse {
  user: User
  token: string
  message: string
}

export interface AuthError {
  message: string
  errors?: Record<string, string[]>
}