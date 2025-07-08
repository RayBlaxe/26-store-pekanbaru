import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/contexts/auth-context'
import { AuthService } from '@/lib/auth-service'
import { ReactNode } from 'react'

jest.mock('@/lib/auth-service')

const mockAuthService = AuthService as jest.Mocked<typeof AuthService>

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthService.validateToken.mockResolvedValue(null)
  })

  it('should provide initial auth state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('should handle successful login', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'customer' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockAuthService.login.mockResolvedValue({
      user: mockUser,
      token: 'mock-token',
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password',
      })
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.error).toBeNull()
  })

  it('should handle login error', async () => {
    mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'))

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'wrongpassword',
      })
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.error).toBe('Invalid credentials')
  })

  it('should handle logout', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'customer' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockAuthService.login.mockResolvedValue({
      user: mockUser,
      token: 'mock-token',
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password',
      })
    })

    expect(result.current.isAuthenticated).toBe(true)

    act(() => {
      result.current.logout()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(mockAuthService.logout).toHaveBeenCalled()
  })

  it('should clear errors', async () => {
    mockAuthService.login.mockRejectedValue(new Error('Test error'))

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'wrongpassword',
      })
    })

    expect(result.current.error).toBe('Test error')

    act(() => {
      result.current.clearError()
    })

    expect(result.current.error).toBeNull()
  })
})