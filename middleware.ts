import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED = ['/dashboard', '/meetings', '/calendar']
const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8080'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtected = PROTECTED.some(p => path.startsWith(p))

  const token = request.cookies.get('meetbot_token')?.value

  if (!token && isProtected) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (token && path === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
