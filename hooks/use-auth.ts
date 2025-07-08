'use client'

import { useAuthStore } from '@/stores/auth-store'
import { useEffect } from 'react'

export const useAuth = () => {
  const store = useAuthStore()
  
  useEffect(() => {
    if (!store.isAuthenticated && !store.isLoading) {
      store.fetchUser()
    }
  }, [store.isAuthenticated, store.isLoading])

  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login: store.login,
    register: store.register,
    logout: store.logout,
    clearError: store.clearError,
  }
}

export const useAuthGuard = () => {
  const { isAuthenticated, user, isLoading } = useAuth()

  return {
    isAuthenticated,
    user,
    isLoading,
  }
}