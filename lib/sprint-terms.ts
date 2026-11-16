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
