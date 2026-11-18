import TokenForm from '../token-form'

export const metadata = { title: 'Reset password', referrer: 'no-referrer' as const }

export default function ResetPage() {
  return <TokenForm kind="reset" />
}
