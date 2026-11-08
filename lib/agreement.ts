import { createHash } from 'crypto'

// ============================================================
// COACHING SERVICES AGREEMENT
// Version: 1.0 — effective date must match what John supplies
//
// ACTION REQUIRED BEFORE LAUNCH:
// Replace AGREEMENT_TEXT below with the exact verbatim text
// from the signed Coaching Services Agreement PDF. Paste it
// as a single template literal. Do not reformat or reorder —
// the hash is computed from this exact string.
//
// After replacing the text, run:
//   node -e "const {AGREEMENT_HASH} = require('./lib/agreement'); console.log(AGREEMENT_HASH)"
// and confirm the logged hash matches AGREEMENT_HASH below.
// ============================================================

export const AGREEMENT_VERSION = '1.0'

export const AGREEMENT_TEXT = `BEYOND THE HORIZON EXECUTIVE COACHING
COACHING SERVICES AGREEMENT

[PLACEHOLDER — Replace this entire string with the verbatim text of the Coaching Services Agreement PDF before launch. The enrollment system will display this text to clients during the enrollment flow and embed it in the signed PDF.]`

export const AGREEMENT_HASH = createHash('sha256')
  .update(AGREEMENT_TEXT)
  .digest('hex')

// Sections for display in the enrollment flow.
// Split by double newline so each paragraph renders separately.
export const AGREEMENT_PARAGRAPHS: string[] = AGREEMENT_TEXT
  .split(/\n{2,}/)
  .map(p => p.trim())
  .filter(Boolean)
