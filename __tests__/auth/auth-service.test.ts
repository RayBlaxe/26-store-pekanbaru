import { AuthService } from '@/lib/auth-service'
import { LoginCredentials, RegisterCredentials } from '@/lib/auth-types'

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const credentials: LoginCredentials = {
        email: 'admin@26store.com',
        password: 'password',
      }

      const result = await AuthService.login(credentials)

      expect(result.user.email).toBe(credentials.email)
      expect(result.user.role).toBe('admin')
      expect(result.token).toBeDefined()
      expect(AuthService.isAuthenticated()).toBe(true)
    })

    it('should throw error with invalid credentials', async () => {
      const credentials: LoginCredentials = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      }

      await expect(AuthService.login(credentials)).rejects.toThrow('Invalid credentials')
    })
  })

  describe('register', () => {
    it('should register successfully with valid data', async () => {
      const credentials: RegisterCredentials = {
        email: 'newuser@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        name: 'New User',
      }

      const result = await AuthService.register(credentials)

      expect(result.user.email).toBe(credentials.email)
      expect(result.user.name).toBe(credentials.name)
      expect(result.user.role).toBe('customer')
      expect(AuthService.isAuthenticated()).toBe(true)
    })

    it('should throw error when passwords do not match', async () => {
      const credentials: RegisterCredentials = {
        email: 'newuser@example.com',
        password: 'password123',
        confirmPassword: 'different',
        name: 'New User',
      }

      await expect(AuthService.register(credentials)).rejects.toThrow('Passwords do not match')
    })
  })

  describe('logout', () => {
    it('should clear auth data on logout', async () => {
      const credentials: LoginCredentials = {
        email: 'admin@26store.com',
        password: 'password',
      }

      await AuthService.login(credentials)
      expect(AuthService.isAuthenticated()).toBe(true)

      AuthService.logout()
      expect(AuthService.isAuthenticated()).toBe(false)
      expect(AuthService.getUser()).toBeNull()
      expect(AuthService.getToken()).toBeNull()
    })
  })

  describe('token validation', () => {
    it('should validate token and return user', async () => {
      const credentials: LoginCredentials = {
        email: 'admin@26store.com',
        password: 'password',
      }

      await AuthService.login(credentials)
      const user = await AuthService.validateToken()

      expect(user).toBeDefined()
      expect(user?.email).toBe(credentials.email)
    })

    it('should return null for invalid token', async () => {
      const user = await AuthService.validateToken()
      expect(user).toBeNull()
    })
  })
})