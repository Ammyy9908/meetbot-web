import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED = ['/dashboard', '/meetings', '/calendar']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtected = PROTECTED.some(p => path.startsWith(p))
  const tokenParam = request.nextUrl.searchParams.get('token')
  let token = request.cookies.get('meetbot_token')?.value

  if (tokenParam) {
    const cleanUrl = new URL(path, request.url)
    const response = NextResponse.redirect(cleanUrl)
    const isDomain = request.nextUrl.hostname.includes('meetbot.ink')
    response.cookies.set('meetbot_token', tokenParam, {
      path: '/',
      domain: isDomain ? '.meetbot.ink' : undefined,
      maxAge: 7 * 24 * 3600,
      secure: request.nextUrl.protocol === 'https:',
      sameSite: 'lax',
      httpOnly: false,
    })
    return response
  }

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
