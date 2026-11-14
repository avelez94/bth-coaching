import EnrollFlow from './enroll-flow'
import { getActiveAgreement, getPrograms } from '@/lib/site-data'
import { PROGRAM_KEYS, toPublic, type ProgramKey, type PublicProgramInfo } from '@/lib/program-info'

// Loads the current prices and the active agreement on the server, so the
// client always reads the same agreement version it signs. Stripe payment
// links are never sent to the browser.
export default async function EnrollPage() {
  const [programs, agreement] = await Promise.all([getPrograms(), getActiveAgreement()])
  const publicPrograms = Object.fromEntries(
    PROGRAM_KEYS.map(k => [k, toPublic(programs[k])]),
  ) as Record<ProgramKey, PublicProgramInfo>
  const paragraphs = agreement.content.split(/\n{2,}/).map(p => p.trim()).filter(Boolean)
  return (
    <EnrollFlow
      programs={publicPrograms}
      agreement={{ version: agreement.version, hash: agreement.hash, paragraphs }}
    />
  )
}
