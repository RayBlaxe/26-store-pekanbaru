'use client'

import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react'
import { AuthContextType, AuthState, LoginCredentials, RegisterCredentials, User } from '@/lib/auth-types'
import { authService } from '@/lib/auth-service'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const user = await authService.getUser()
          dispatch({ type: 'AUTH_SUCCESS', payload: user })
          
          // Check current path and redirect if needed
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname
            
            // If admin user is on customer routes, redirect to admin
            if (user.role === 'admin' && ['/dashboard', '/profile', '/orders', '/checkout', '/cart'].some(route => currentPath.startsWith(route))) {
              window.location.href = '/admin'
              return
            }
            
            // If customer user is on admin routes, redirect to home
            if (user.role === 'customer' && currentPath.startsWith('/admin')) {
              window.location.href = '/'
              return
            }
          }
        } else {
          dispatch({ type: 'AUTH_LOGOUT' })
        }
      } catch (error) {
        dispatch({ type: 'AUTH_ERROR', payload: 'Failed to initialize authentication' })
      }
    }

    initializeAuth()
  }, [])

  const login = async (credentials: LoginCredentials): Promise<{ redirectTo: string }> => {
    try {
      dispatch({ type: 'AUTH_START' })
      const { user } = await authService.login(credentials)
      dispatch({ type: 'AUTH_SUCCESS', payload: user })
      
      // Determine redirect path based on user role
      const redirectTo = user.role === 'admin' ? '/admin' : '/dashboard'
      return { redirectTo }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Login failed' })
      throw error
    }
  }

  const register = async (credentials: RegisterCredentials): Promise<{ redirectTo: string }> => {
    try {
      dispatch({ type: 'AUTH_START' })
      const { user } = await authService.register(credentials)
      dispatch({ type: 'AUTH_SUCCESS', payload: user })
      
      // Determine redirect path based on user role (new registrations are usually customers)
      const redirectTo = user.role === 'admin' ? '/admin' : '/dashboard'
      return { redirectTo }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Registration failed' })
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    dispatch({ type: 'AUTH_LOGOUT' })
    
    // Redirect to home page after logout
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}