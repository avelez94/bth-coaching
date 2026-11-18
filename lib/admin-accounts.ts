import 'server-only'
import { db, getSettings } from './site-data'
import { sendEmail } from './email'
import { SITE_URL } from './seo'
import { adminAccessNoticeEmail, adminInviteEmail, adminPasswordChangedEmail, adminResetEmail } from './email-templates'
import { createToken, type AdminUser } from './admin-auth'

// Email side of Admin accounts. Links point at the production domain and
// carry the token after "#", which browsers never send to a server.

export const RESET_MINUTES = 30
export const INVITE_HOURS = 48

const easternNow = (d = new Date()) => new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
}).format(d)

async function footer() {
  const s = await getSettings()
  return { contactEmail: s.contactEmail, phone: s.phone }
}

export async function sendResetLink(user: AdminUser): Promise<boolean> {
  const token = await createToken(user.id, 'reset', RESET_MINUTES)
  const mail = adminResetEmail({ name: user.name, link: `${SITE_URL}/admin/reset#token=${token}`, minutes: RESET_MINUTES }, await footer())
  const r = await sendEmail({ kind: 'admin_password_reset', to: user.email, ...mail })
  return r.status === 'sent'
}

export async function sendInvitation(user: AdminUser, inviter: AdminUser): Promise<boolean> {
  const token = await createToken(user.id, 'invite', INVITE_HOURS * 60)
  const expires = easternNow(new Date(Date.now() + INVITE_HOURS * 3_600_000))
  const s = await getSettings()
  const mail = adminInviteEmail({ inviterName: inviter.name || inviter.email, link: `${SITE_URL}/admin/invite#token=${token}`, expires }, { contactEmail: s.contactEmail, phone: s.phone })
  const r = await sendEmail({ kind: 'admin_invite', to: user.email, ...mail, replyTo: inviter.email })
  return r.status === 'sent'
}

export async function sendPasswordChangedNotice(user: AdminUser, how: 'changed' | 'reset') {
  const mail = adminPasswordChangedEmail({ name: user.name, when: easternNow(), how }, await footer())
  await sendEmail({ kind: 'admin_password_changed', to: user.email, ...mail })
}

/** Tells every Owner about an access change they did not make themselves */
export async function notifyOwners(line: string, except?: string) {
  const { data } = await db().from('admin_users').select('email').eq('role', 'owner').eq('status', 'active')
  const f = await footer()
  for (const o of data ?? []) {
    if (o.email === except) continue
    await sendEmail({ kind: 'admin_access_notice', to: o.email, ...adminAccessNoticeEmail({ line }, f) })
  }
}
