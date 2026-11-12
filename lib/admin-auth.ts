// Shared server-side helper for admin API route protection.
// Import verifyAdminToken(req) in every admin route.
// Reads the session from the HttpOnly cookie — never from headers or body.
import { NextRequest } from 'next/server'
import { verifyToken } from '@/app/api/admin/auth/route'

const COOKIE_NAME = 'bth_admin_session'

export function verifyAdminToken(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE_NAME)?.value || ''
  return verifyToken(token)
}
