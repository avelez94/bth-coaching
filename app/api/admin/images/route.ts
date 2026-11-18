import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import { db } from '@/lib/site-data'

const MAX_BYTES = 10 * 1024 * 1024
const TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }

// POST /api/admin/images (multipart: file, slot)
// Uploads a replacement photo. It is NOT shown on the site until John
// presses Save Changes on that page, so he can preview or cancel first.
export async function POST(req: NextRequest) {
  if (!(await verifyAdminToken(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  const slot = String(form?.get('slot') || 'image').replace(/[^a-z0-9.-]/gi, '-').slice(0, 60)
  if (!(file instanceof File)) return NextResponse.json({ error: 'Choose a photo to upload.' }, { status: 400 })
  const ext = TYPES[file.type]
  if (!ext) return NextResponse.json({ error: 'Please use a JPG, PNG, or WebP photo.' }, { status: 400 })
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'That photo is larger than 10 MB. Please use a smaller file.' }, { status: 400 })

  const path = `site/${slot}-${Date.now()}.${ext}`
  const { error } = await db().storage.from('images').upload(path, Buffer.from(await file.arrayBuffer()), {
    contentType: file.type, upsert: false, cacheControl: '31536000',
  })
  if (error) return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  const { data } = db().storage.from('images').getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl })
}
