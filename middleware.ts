import { NextResponse, type NextRequest } from 'next/server'
import { getTokenFromRequest, verifyJWT } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith('/admin')
  const isAdminLogin = pathname === '/admin/login'

  // Fetch the JWT from the cookie
  const token = getTokenFromRequest(request)
  const payload = token ? await verifyJWT(token) : null
  const isAuthenticated = !!payload

  // 1. Unauthenticated user trying to access admin routes → redirect to /admin/login
  if (isAdminRoute && !isAdminLogin && !isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(url)
  }

  // 2. Authenticated admin visiting /admin/login → redirect to /admin
  if (isAdminLogin && isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
