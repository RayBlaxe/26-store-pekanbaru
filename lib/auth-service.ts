import { LoginCredentials, RegisterCredentials, AuthResponse, User } from './auth-types'

// Mock users for development
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@26store.com',
    name: 'Admin User',
    role: 'admin',
    avatar: '/placeholder.svg',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'customer@example.com',
    name: 'Customer User',
    role: 'customer',
    avatar: '/placeholder.svg',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export class AuthService {
  private static readonly TOKEN_KEY = 'auth_token'
  private static readonly USER_KEY = 'auth_user'

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const user = mockUsers.find(u => u.email === credentials.email)
    if (!user || credentials.password !== 'password') {
      throw new Error('Invalid credentials')
    }

    const token = this.generateMockToken(user)
    this.setToken(token)
    this.setUser(user)

    return { user, token }
  }

  static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('Passwords do not match')
    }

    const existingUser = mockUsers.find(u => u.email === credentials.email)
    if (existingUser) {
      throw new Error('User already exists')
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: credentials.email,
      name: credentials.name,
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockUsers.push(newUser)

    const token = this.generateMockToken(newUser)
    this.setToken(token)
    this.setUser(newUser)

    return { user: newUser, token }
  }

  static logout(): void {
    this.removeToken()
    this.removeUser()
  }

  static getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.TOKEN_KEY)
  }

  static setToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  static removeToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.TOKEN_KEY)
  }

  static getUser(): User | null {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem(this.USER_KEY)
    if (!userStr) return null
    
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  static setUser(user: User): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
  }

  static removeUser(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.USER_KEY)
  }

  static isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser()
  }

  static async validateToken(): Promise<User | null> {
    const token = this.getToken()
    if (!token) return null

    try {
      // Simulate token validation
      await new Promise(resolve => setTimeout(resolve, 500))
      return this.getUser()
    } catch {
      this.logout()
      return null
    }
  }

  private static generateMockToken(user: User): string {
    return btoa(JSON.stringify({ userId: user.id, exp: Date.now() + 86400000 }))
  }
}