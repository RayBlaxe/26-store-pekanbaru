'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { AuthContextType } from '@/lib/auth-types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  useEffect(() => {
    // Only fetch user if there's a token but user is not authenticated
    const token = auth.token || (typeof window !== 'undefined' ? document.cookie.includes('auth-token') : false)
    if (token && !auth.isAuthenticated && !auth.isLoading) {
      auth.fetchUser?.()
    }
  }, [auth.token, auth.isAuthenticated, auth.isLoading, auth.fetchUser])

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}