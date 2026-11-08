import { createHash } from 'crypto'

// ============================================================
// COACHING SERVICES AGREEMENT
// Version: 1.0
//
// ACTION REQUIRED BEFORE LAUNCH:
// Replace AGREEMENT_TEXT below with the exact verbatim text
// from John's Coaching Services Agreement PDF.
//
// Paste as a single template literal. Do not reformat —
// the SHA-256 hash is computed from this exact string and
// stored with every enrollment record as a legal audit trail.
//
// Steps:
//   1. Paste the full agreement text between the backticks below
//   2. Update AGREEMENT_VERSION and AGREEMENT_DATE to match the
//      version and effective date shown on the document
//   3. Run: node -e "const c=require('crypto');const t=require('fs').readFileSync('./lib/agreement.ts','utf8').match(/AGREEMENT_TEXT = \`([\s\S]*?)\`/)[1];console.log(c.createHash('sha256').update(t).digest('hex'))"
//      and confirm the hash printed matches AGREEMENT_HASH below
// ============================================================

export const AGREEMENT_VERSION = '1.0'
export const AGREEMENT_DATE = '' // e.g. 'January 1, 2025' — set when text is added

// Set to false once the real agreement text has been pasted in
export const AGREEMENT_IS_PLACEHOLDER = true

export const AGREEMENT_TEXT = `BEYOND THE HORIZON EXECUTIVE COACHING
COACHING SERVICES AGREEMENT

[AGREEMENT TEXT PENDING — John McCracken must supply the verbatim text of the Coaching Services Agreement before this enrollment flow goes live. Paste the full agreement text here, replacing everything from the opening bracket to this closing bracket.]`

export const AGREEMENT_HASH = createHash('sha256')
  .update(AGREEMENT_TEXT)
  .digest('hex')

// Paragraphs for display in the enrollment flow.
// Split by double newline so each paragraph renders separately.
export const AGREEMENT_PARAGRAPHS: string[] = AGREEMENT_TEXT
  .split(/\n{2,}/)
  .map(p => p.trim())
  .filter(Boolean)
