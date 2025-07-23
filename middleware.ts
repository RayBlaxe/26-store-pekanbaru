import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const protectedRoutes = ['/dashboard', '/profile', '/orders', '/checkout', '/cart']
const adminRoutes = ['/admin']
const authRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const userDataCookie = request.cookies.get('user-data')?.value
  const { pathname } = request.nextUrl

  // Parse user data to check role
  let userRole = null
  if (userDataCookie) {
    try {
      const userData = JSON.parse(decodeURIComponent(userDataCookie))
      userRole = userData.role
    } catch (e) {
      // Invalid user data cookie
    }
  }

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // DEVELOPMENT MODE: Allow access to admin and dashboard routes without authentication
  // Remove this section when implementing proper authentication
  if (process.env.NODE_ENV === 'development') {
    if (isAdminRoute || pathname.startsWith('/dashboard')) {
      return NextResponse.next()
    }
  }

  // If user is not authenticated and trying to access protected route
  if ((isProtectedRoute || isAdminRoute) && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If user is authenticated but not admin and trying to access admin routes
  if (isAdminRoute && token && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If user is authenticated and trying to access auth routes
  if (isAuthRoute && token) {
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') || '/dashboard'
    return NextResponse.redirect(new URL(callbackUrl, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}