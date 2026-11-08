import { NextRequest, NextResponse } from 'next/server'

/**
 * ENROLLMENT FEATURE FLAG
 *
 * The enrollment flow (/enroll) is hidden from public access until launch.
 *
 * To enable it for local testing, add to .env.local:
 *   ENROLLMENT_ENABLED=true
 *
 * To enable it in a Vercel preview/production deployment, add the env var
 * ENROLLMENT_ENABLED=true in the Vercel project settings for that environment.
 *
 * Without this flag, any visitor who navigates to /enroll is silently
 * redirected to the homepage.
 *
 * This is a server-side var (no NEXT_PUBLIC_ prefix) so it is never
 * included in the client bundle.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/enroll')) {
    const enabled = process.env.ENROLLMENT_ENABLED === 'true'
    if (!enabled) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/enroll', '/enroll/:path*'],
}
