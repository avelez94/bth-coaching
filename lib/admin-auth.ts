// Shared server-side helper for admin API route protection.
// Import verifyAdminToken(req) in any admin route instead of calling /api/admin/auth.
import { NextRequest } from 'next/server'
import { verifyToken } from '@/app/api/admin/auth/route'

export function verifyAdminToken(req: NextRequest): boolean {
  const token = req.headers.get('x-admin-token') || ''
  return verifyToken(token)
}
