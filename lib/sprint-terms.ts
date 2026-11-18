import { fillDeadline } from './program-info'

// ============================================================
// 8 Pillar Sprint participant terms: ACTIVE (approved by John).
//
// A simple acknowledgment, not the coaching agreement and not an
// e-signature: the participant reads these terms and ticks one box,
// on /sprint/register (joining yourself) and on /sprint/redeem
// (claiming a gift). The server refuses either without it, and stores
// the version and the time accepted with the participant's record
// (sprint_registrations or sprint_gifts: terms_version, terms_accepted_at).
//
// Every sentence is John's own wording from his Sprint page copy. The
// dates come from the Sprint registration deadline in Admin > Pricing,
// so the terms always match the page, emails and certificate.
// ============================================================

export interface SprintTerms {
  /** Stored with each acceptance, e.g. "sprint-terms-2027-01" */
  version: string
  /** Heading shown above the text */
  title: string
  /** The approved wording, shown in full */
  text: string
  /** Checkbox label */
  acceptLabel: string
}

/** The approved terms; {deadline} and {deadline_short} are filled from Pricing */
export const SPRINT_PARTICIPANT_TERMS: SprintTerms | null = {
  version: 'sprint-terms-2026-11-17',
  title: '8 Pillar Sprint participant terms',
  acceptLabel: 'I have read and accept the 8 Pillar Sprint participant terms.',
  text: [
    'The 8 Pillar Sprint is facilitated group learning, not one-on-one coaching, therapy, or financial or legal advice.',
    'Dates: Eight Tuesdays, January 12 to March 2, 2027\nTime: 7:00 to 8:15 PM Eastern\nFormat: Live by video, Microsoft Teams\nGroup size: Up to 12 participants\nPreparation: A 15-minute self-assessment before Week 1, and a 10- to 15-minute worksheet before each session',
    'A 15-minute self-assessment gives you a one-page snapshot across all 8 Pillars, with your strongest and most stretched areas marked. Only you and I see it, and there\'s no overall score.',
    'In Week 1 the group agrees on how we\'ll work together: share your own experience, not other people\'s, and how anonymized information either stays in the room or may be shared. Sessions are not recorded.',
    'Refunds and cancellations\nUntil {deadline}: full refund, or transfer your seat to someone else.\nAfter {deadline_short}: fees are non-refundable.\nIf fewer than 6 people register, the Sprint still runs. You\'ll have the choice to continue with a smaller group or take a full refund.\nMissed sessions aren\'t refunded. You\'ll receive a one-page summary after every session, and you can use your one-on-one session to catch up.\nGifts follow the same terms. Any refund goes to the person who paid.',
  ].join('\n\n'),
}

/** The terms as shown to a participant, with the dates filled in */
export function sprintTermsFor(deadlineIso: string): SprintTerms | null {
  if (!SPRINT_PARTICIPANT_TERMS) return null
  return { ...SPRINT_PARTICIPANT_TERMS, text: fillDeadline(SPRINT_PARTICIPANT_TERMS.text, deadlineIso) }
}
