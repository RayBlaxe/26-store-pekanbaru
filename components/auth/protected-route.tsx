'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthGuard } from '@/hooks/use-auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'customer' | 'superadmin'
  fallbackPath?: string
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  fallbackPath = '/login'
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuthGuard()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(fallbackPath)
        return
      }

      if (requiredRole) {
        // Allow admin routes for both admin and superadmin
        if (requiredRole === 'admin' && !['admin', 'superadmin'].includes(user?.role || '')) {
          router.push(user?.role === 'customer' ? '/' : '/admin')
          return
        }
        // For other roles, exact match is required
        else if (requiredRole !== 'admin' && user?.role !== requiredRole) {
          const redirectPath = user?.role === 'superadmin' ? '/superadmin' : 
                              user?.role === 'admin' ? '/admin' : '/'
          router.push(redirectPath)
          return
        }
      }
    }
  }, [isAuthenticated, user, isLoading, requiredRole, router, fallbackPath])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requiredRole) {
    // Allow admin routes for both admin and superadmin
    if (requiredRole === 'admin' && !['admin', 'superadmin'].includes(user?.role || '')) {
      return null
    }
    // For other roles, exact match is required
    else if (requiredRole !== 'admin' && user?.role !== requiredRole) {
      return null
    }
  }

  return <>{children}</>
}