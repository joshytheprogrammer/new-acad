import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const url = request.nextUrl.clone()

  // Check for the subdomain "academy"
  if (host.startsWith('academy.')) {
    // Rewrite to root while preserving path and query
    url.pathname = url.pathname === '/academy' ? '/' : url.pathname.replace('/academy', '')
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

// Apply to all paths
export const config = {
    matcher: ['/((?!_next|favicon.ico).*)'],
} 