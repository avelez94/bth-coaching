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
// Every sentence of the text is John's own wording, copied exactly
// from his 8 Pillar Sprint page copy (Nov 14, 2026). Only the title and
// the checkbox line are new, and both need his approval. To make it live
// after approval, set SPRINT_PARTICIPANT_TERMS = SPRINT_TERMS_DRAFT above.
// ------------------------------------------------------------
export const SPRINT_TERMS_DRAFT: SprintTerms = {
  version: 'sprint-terms-2027-01',
  title: '8 Pillar Sprint participant terms',
  acceptLabel: 'I have read and accept the 8 Pillar Sprint participant terms.',
  text: [
    'The 8 Pillar Sprint is facilitated group learning, not one-on-one coaching, therapy, or financial or legal advice.',
    'Dates: Eight Tuesdays, January 12 to March 2, 2027\nTime: 7:00 to 8:15 PM Eastern\nFormat: Live by video, Microsoft Teams\nGroup size: Up to 12 participants\nPreparation: A 15-minute self-assessment before Week 1, and a 10- to 15-minute worksheet before each session',
    'A 15-minute self-assessment gives you a one-page snapshot across all 8 Pillars, with your strongest and most stretched areas marked. Only you and I see it, and there\'s no overall score.',
    'In Week 1 the group agrees on how we\'ll work together: share your own experience, not other people\'s, and how anonymized information either stays in the room or may be shared. Sessions are not recorded.',
    'Refunds and cancellations\nUntil January 5, 2027: full refund, or transfer your seat to someone else.\nAfter January 5: fees are non-refundable.\nIf fewer than 6 people register, the Sprint still runs. You\'ll have the choice to continue with a smaller group or take a full refund.\nMissed sessions aren\'t refunded. You\'ll receive a one-page summary after every session, and you can use your one-on-one session to catch up.\nGifts follow the same terms. Any refund goes to the person who paid.',
  ].join('\n\n'),
}
