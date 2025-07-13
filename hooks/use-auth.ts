'use client'

import { useAuthStore } from '@/stores/auth-store'
import { useEffect } from 'react'

export const useAuth = () => {
  const store = useAuthStore()

  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login: store.login,
    register: store.register,
    logout: store.logout,
    fetchUser: store.fetchUser,
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