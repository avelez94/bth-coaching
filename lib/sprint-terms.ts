// ============================================================
// Sprint participant terms: NOT ACTIVE.
//
// Whether a Sprint participant must accept a Sprint specific agreement
// or terms is still John's decision. The standard coaching agreement is
// deliberately not used for the Sprint.
//
// If John approves terms later, set SPRINT_PARTICIPANT_TERMS below.
// The redemption form then shows the text with a required checkbox,
// the server refuses a redemption without it, and the version and time
// accepted are stored on the gift (terms_version, terms_accepted_at).
// Nothing else in the gift system needs to change.
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

export const SPRINT_PARTICIPANT_TERMS: SprintTerms | null = null

// ------------------------------------------------------------
// PROPOSED WORDING, FOR REVIEW ONLY. NOT IN USE.
// Built only from John's own Sprint page and FAQ text, nearly word for
// word. No new legal terms. To make it live after approval, set
//   SPRINT_PARTICIPANT_TERMS = SPRINT_TERMS_DRAFT
// (or the approved wording) above.
// ------------------------------------------------------------
export const SPRINT_TERMS_DRAFT: SprintTerms = {
  version: 'sprint-terms-2027-01',
  title: '8 Pillar Sprint participant terms',
  acceptLabel: 'I have read and accept the 8 Pillar Sprint participant terms.',
  text: [
    'What this is. The 8 Pillar Sprint is facilitated group learning, not one-on-one coaching, therapy, or financial or legal advice.',
    'Dates and format. Eight Tuesdays, January 12 to March 2, 2027, 7:00 to 8:15 PM Eastern, live by video on Microsoft Teams, with up to 12 participants.',
    'Preparation. A 15-minute self-assessment before Week 1, and a 10 to 15 minute worksheet before each session. Only you and John see your self-assessment, and there is no overall score.',
    'How we work together. In Week 1 the group agrees on how we will work together: share your own experience, not other people\'s, and how anonymized information either stays in the room or may be shared. Sessions are not recorded.',
    'If the Sprint was a gift. The person who gave it will not see your self-assessment, attendance, or anything discussed in the sessions.',
    'Refunds and cancellations. Until January 5, 2027: full refund, or transfer your seat to someone else. After January 5: fees are non-refundable. If fewer than 6 people register, the Sprint still runs, and you will have the choice to continue with a smaller group or take a full refund. Gifts follow the same terms. Any refund goes to the person who paid.',
    'Missed sessions. Missed sessions are not refunded. You will receive a one-page summary after every session, and you can use your one-on-one session with John to catch up.',
  ].join('\n\n'),
}
