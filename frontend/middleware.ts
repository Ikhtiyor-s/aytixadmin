import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const path = request.nextUrl.pathname

  // Admin routes (always allow)
  if (path.startsWith('/admin')) {
    // Admin login page is public
    if (path === '/admin/login') {
      return NextResponse.next()
    }
    // Admin panel requires authentication
    if (!token && path.startsWith('/admin/advanced')) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return NextResponse.next()
  }

  // Public routes for marketplace
  const publicRoutes = ['/login', '/register', '/marketplace', '/products']
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route))

  // Marketplace auth routes
  const authRoutes = ['/login', '/register']

  // Redirect to login if accessing protected marketplace route without token
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to admin panel if accessing auth routes with token
  if (token && authRoutes.some(route => path === route)) {
    return NextResponse.redirect(new URL('/admin/advanced', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico).*)',
  ],
}

