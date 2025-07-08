'use client'

import { useAuth } from '@/contexts/auth-context'

export { useAuth }

export const useAuthGuard = () => {
  const { isAuthenticated, user, isLoading } = useAuth()

  return {
    isAuthenticated,
    user,
    isLoading,
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer',
  }
}