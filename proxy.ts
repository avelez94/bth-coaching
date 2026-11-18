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
 *
 * Uses the Next.js 16+ "proxy" convention (renamed from "middleware").
 */
// The old Vercel address of the live site sends visitors and search engines
// to the real domain, keeping the path and query. Only this exact host:
// per-deployment preview addresses still work, and API calls are left alone.
const OLD_PRODUCTION_HOST = 'bth-coaching.vercel.app'
const PUBLIC_ORIGIN = 'https://mccrackencoaching.com'

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  const host = (request.headers.get('host') ?? '').toLowerCase()
  if (host === OLD_PRODUCTION_HOST && !pathname.startsWith('/api/')) {
    return NextResponse.redirect(`${PUBLIC_ORIGIN}${pathname}${search}`, 308)
  }

  if (pathname.startsWith('/enroll')) {
    const enabled = process.env.ENROLLMENT_ENABLED === 'true'
    if (!enabled) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  // Every page (for the old address redirect); not static files or images
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
