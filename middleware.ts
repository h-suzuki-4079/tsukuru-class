import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  res.headers.set('x-mw-hit', '1')
  res.headers.set('x-mw-path', req.nextUrl.pathname)
  console.log('[mw] hit:', req.nextUrl.pathname)
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
