import TokenForm from '../token-form'

export const metadata = { title: 'Accept invitation', referrer: 'no-referrer' as const }

export default function InvitePage() {
  return <TokenForm kind="invite" />
}
