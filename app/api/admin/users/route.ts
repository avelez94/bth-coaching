import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/site-data'
import { audit, looksLikeEmail, normalizeEmail, requireOwner, type AdminUser } from '@/lib/admin-auth'
import { INVITE_HOURS, sendInvitation } from '@/lib/admin-accounts'

// Users & Access. Owner only, checked on the server for every action.
// There is no way here to create an Owner, change anyone's role, or touch
// an Owner account: invitations are always for the Developer role, and
// only Developers can be revoked. The database also refuses to leave the
// site without an active Owner.

const COLUMNS = 'id, email, name, role, status, session_version, created_at, last_login_at'

// GET /api/admin/users: everyone with access, pending invitations, and recent access history
export async function GET(req: NextRequest) {
  const owner = await requireOwner(req)
  if (owner instanceof NextResponse) return owner

  const [{ data: users }, { data: tokens }, { data: history }] = await Promise.all([
    db().from('admin_users').select(COLUMNS).order('role', { ascending: false }).order('created_at'),
    db().from('admin_tokens').select('user_id, expires_at').eq('purpose', 'invite').is('used_at', null),
    db().from('admin_audit_log').select('created_at, actor_email, action, target_email')
      .neq('action', 'signed_in').order('created_at', { ascending: false }).limit(25),
  ])
  const inviteExpiry = new Map((tokens ?? []).map(t => [t.user_id, t.expires_at]))
  return NextResponse.json({
    you: owner.id,
    users: (users ?? []).map(u => ({
      id: u.id, email: u.email, name: u.name, role: u.role, status: u.status,
      addedOn: u.created_at, lastSignIn: u.last_login_at,
      inviteExpires: u.status === 'invited' ? inviteExpiry.get(u.id) ?? null : null,
    })),
    history: history ?? [],
  })
}

// POST /api/admin/users  { action: 'invite', email, name? } | { action: 'resend' | 'revoke', id }
export async function POST(req: NextRequest) {
  const owner = await requireOwner(req)
  if (owner instanceof NextResponse) return owner
  const body = await req.json().catch(() => ({}))

  if (body.action === 'invite') {
    const email = normalizeEmail(body.email)
    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 80) || null : null
    if (!looksLikeEmail(email)) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })

    const { data: existing } = await db().from('admin_users').select(COLUMNS).eq('email', email).maybeSingle()
    let user = existing as AdminUser | null
    if (user?.role === 'owner') return NextResponse.json({ error: 'That address is the Owner account.' }, { status: 400 })
    if (user?.status === 'active') return NextResponse.json({ error: 'That person already has Developer access.' }, { status: 400 })

    if (user) {
      // A past or pending Developer: start over with a fresh invitation and no password
      const { data, error } = await db().from('admin_users').update({
        status: 'invited', role: 'developer', password_hash: null, name: name ?? user.name,
        session_version: user.session_version + 1, invited_by: owner.id,
      }).eq('id', user.id).select(COLUMNS).single()
      if (error) return NextResponse.json({ error: 'The invitation could not be created.' }, { status: 500 })
      user = data as AdminUser
    } else {
      const { data, error } = await db().from('admin_users').insert({
        email, name, role: 'developer', status: 'invited', invited_by: owner.id,
      }).select(COLUMNS).single()
      if (error) return NextResponse.json({ error: 'The invitation could not be created.' }, { status: 500 })
      user = data as AdminUser
    }

    const sent = await sendInvitation(user, owner)
    await audit('developer_invited', owner, user.email)
    if (!sent) return NextResponse.json({ error: 'The invitation was created but the email did not send. Try Resend invitation.' }, { status: 502 })
    return NextResponse.json({ success: true, message: `Invitation sent to ${user.email}. It expires in ${INVITE_HOURS} hours.` })
  }

  if (body.action === 'resend' || body.action === 'revoke') {
    if (typeof body.id !== 'string') return NextResponse.json({ error: 'Choose a person.' }, { status: 400 })
    const { data } = await db().from('admin_users').select(COLUMNS).eq('id', body.id).maybeSingle()
    const user = data as AdminUser | null
    if (!user) return NextResponse.json({ error: 'That person was not found.' }, { status: 404 })
    if (user.role !== 'developer') return NextResponse.json({ error: 'The Owner account cannot be changed here.' }, { status: 400 })

    if (body.action === 'resend') {
      if (user.status !== 'invited') return NextResponse.json({ error: 'Only a pending invitation can be resent.' }, { status: 400 })
      const sent = await sendInvitation(user, owner)
      await audit('invitation_resent', owner, user.email)
      if (!sent) return NextResponse.json({ error: 'The invitation email did not send. Try again.' }, { status: 502 })
      return NextResponse.json({ success: true, message: `A new invitation was sent to ${user.email}. The earlier link no longer works.` })
    }

    // Revoke: ends sessions now, cancels any invitation or reset link
    const { error } = await db().from('admin_users').update({
      status: 'revoked', session_version: user.session_version + 1, password_hash: null,
    }).eq('id', user.id)
    if (error) return NextResponse.json({ error: 'Access could not be revoked.' }, { status: 500 })
    await db().from('admin_tokens').update({ used_at: new Date().toISOString() }).eq('user_id', user.id).is('used_at', null)
    await audit('access_revoked', owner, user.email)
    return NextResponse.json({ success: true, message: `${user.email} no longer has access.` })
  }

  return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
}
