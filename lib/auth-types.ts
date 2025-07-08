export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'customer'
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  name: string
  confirmPassword: string
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => void
  clearError: () => void
}

export interface AuthResponse {
  user: User
  token: string
}

export interface AuthError {
  message: string
  code: string
}