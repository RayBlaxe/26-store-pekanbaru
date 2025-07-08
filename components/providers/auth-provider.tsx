'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { AuthContextType } from '@/lib/auth-types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  useEffect(() => {
    if (!auth.isAuthenticated && !auth.isLoading) {
      // Auto-fetch user on app start if token exists
      auth.fetchUser?.()
    }
  }, [])

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