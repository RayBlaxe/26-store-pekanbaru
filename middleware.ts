import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const protectedRoutes = ['/profile', '/orders', '/checkout', '/cart']
const adminRoutes = ['/admin']
const superadminRoutes = ['/superadmin']
const customerRoutes = ['/profile', '/orders', '/checkout', '/cart']
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
  const isSuperadminRoute = superadminRoutes.some(route => pathname.startsWith(route))
  const isCustomerRoute = customerRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // If user is not authenticated and trying to access protected route
  if ((isProtectedRoute || isAdminRoute || isSuperadminRoute) && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If user is authenticated but not superadmin and trying to access superadmin routes
  if (isSuperadminRoute && token && userRole !== 'superadmin') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If user is authenticated but not admin/superadmin and trying to access admin routes
  if (isAdminRoute && token && !['admin', 'superadmin'].includes(userRole)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If user is admin/superadmin and trying to access customer routes, redirect appropriately
  if (isCustomerRoute && token && ['admin', 'superadmin'].includes(userRole)) {
    const redirectUrl = userRole === 'superadmin' ? '/superadmin' : '/admin'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  // Redirect from home page based on role
  if (pathname === '/' && token) {
    if (userRole === 'superadmin') {
      return NextResponse.redirect(new URL('/superadmin', request.url))
    } else if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  // If user is authenticated and trying to access auth routes
  if (isAuthRoute && token) {
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') || '/'
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
