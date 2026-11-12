import { NextResponse } from 'next/server'

// Server-side-only endpoint: tells the client whether test mode is active.
// ENROLLMENT_TEST_MODE is never exposed as a NEXT_PUBLIC_ env var —
// only this route reveals it, and only as a boolean.
// This endpoint is intentionally public (no auth) because:
//   - it returns only a boolean, nothing sensitive
//   - test mode cannot be activated from the client; only the server env var does that
//   - the enroll page needs this to show the TEST MODE banner before submit
export async function GET() {
  // Mirrors the activation rule in the submit route exactly:
  //   VERCEL_ENV === 'production' → always false
  //   VERCEL_ENV === 'preview' or undefined (local) → honor ENROLLMENT_TEST_MODE
  const vercelEnv = process.env.VERCEL_ENV
  const isProductionDeploy = vercelEnv === 'production'
  const isTestMode = !isProductionDeploy && process.env.ENROLLMENT_TEST_MODE === 'true'
  return NextResponse.json({ testMode: isTestMode })
}
