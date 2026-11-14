import { PDFDocument, PDFFont, PDFImage, PDFPage, rgb, RGB } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { readFile } from 'fs/promises'
import path from 'path'

// ============================================================
// Signed Coaching Services Agreement PDF
//
// Visual design follows the approved "BTH Coaching Agreement
// Redesigned" document: letterhead with logo and contact block,
// gold rules, Noto Serif, navy section headings, blue numbered
// subheadings, parties table, Execution table, branded footer.
//
// The agreement WORDING always comes from the version the client
// signed (record.agreementContent) and is never altered. Layout
// is derived from the text's own structure (headings, numbering,
// lists). Client details, the signature and the dates are filled
// into the parties and Execution tables.
// ============================================================

export interface EnrollmentRecord {
  firstName: string
  lastName: string
  email: string
  phone?: string
  organization?: string
  role?: string
  program: 'executive-coaching' | '8-pillars'
  paymentOption: 'full' | 'installment'
  signatureData: string   // base64 PNG for drawn; plain text for typed
  signatureType: 'drawn' | 'typed'
  signedAt: Date
  agreementVersion: string
  agreementHash: string
  agreementContent: string
}

const PROGRAM_TEXT_PREFIX: Record<string, string> = {
  'executive-coaching': 'Executive Coaching.',
  '8-pillars': 'The 8 Pillars Leadership Program.',
}

// Coach identity shown in the letterhead and parties table.
const COACH = {
  letterName: 'John J. McCracken III, EMBA, ACC',
  name: 'John McCracken',
  firm: 'Beyond the Horizon Executive Coaching & Consulting, LLC',
  location: 'Annandale, Virginia',
  email: 'john@mccrackencoaching.com',
  phone: '703-705-2225',
  credential: 'Associate Certified Coach (ACC), International Coaching Federation',
  linkedinLabel: 'Beyond the Horizon',
}

// ---------- Colors (sampled from the approved design) ----------
const hex = (h: string): RGB => {
  const n = parseInt(h.replace('#', ''), 16)
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255)
}
const C = {
  navy: hex('#0d1b2a'),
  body: hex('#263746'),
  muted: hex('#617487'),
  blue: hex('#4c78a0'),
  gold: hex('#c9a23a'),
  partiesFill: hex('#f2efe8'),
  execFill: hex('#f7f4ed'),
  tableBorder: hex('#e7e1d5'),
}

// ---------- Page geometry (US Letter, points) ----------
const PAGE_W = 612
const PAGE_H = 792
const LEFT = 52
const RIGHT = 560
const TEXT_W = RIGHT - LEFT
const TOP = 40          // content starts this far from the top edge
const BOTTOM = 80       // content stops this far from the bottom edge (footer below)

// Both dates come from one server-generated timestamp, shown in Eastern Time.
// The effective date is the date part of the signing time, so they always agree.
const etDateTime = (d: Date) => new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York', year: 'numeric', month: 'long', day: 'numeric',
  hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short',
}).format(d) // "November 14, 2026 at 11:23 AM EST"
const etDate = (d: Date) => new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York', year: 'numeric', month: 'long', day: 'numeric',
}).format(d) // "November 14, 2026"

type Run = { text: string; font: PDFFont }

const ASSETS = path.join(process.cwd(), 'lib', 'pdf-assets')

export async function generateAgreementPDF(record: EnrollmentRecord): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  doc.registerFontkit(fontkit)

  const [regBytes, boldBytes, italicBytes, logoBytes] = await Promise.all([
    readFile(path.join(ASSETS, 'NotoSerif-Regular.ttf')),
    readFile(path.join(ASSETS, 'NotoSerif-Bold.ttf')),
    readFile(path.join(ASSETS, 'NotoSerif-Italic.ttf')),
    readFile(path.join(ASSETS, 'bth-logo.png')),
  ])
  const F = {
    reg: await doc.embedFont(regBytes, { subset: false }),
    bold: await doc.embedFont(boldBytes, { subset: false }),
    italic: await doc.embedFont(italicBytes, { subset: false }),
  }
  const logo = await doc.embedPng(logoBytes)

  const signedAtText = etDateTime(record.signedAt)
  const effectiveDateText = etDate(record.signedAt)
  const fullName = `${record.firstName} ${record.lastName}`.trim()

  // ---------- Layout state ----------
  let page: PDFPage = doc.addPage([PAGE_W, PAGE_H])
  let y = PAGE_H - TOP   // top of the next line, in PDF coordinates

  const newPage = () => {
    page = doc.addPage([PAGE_W, PAGE_H])
    y = PAGE_H - TOP
  }
  const ensure = (h: number) => { if (y - h < BOTTOM) newPage() }

  // Draw one line of text with its top at `top`.
  const textAt = (text: string, x: number, top: number, font: PDFFont, size: number, color: RGB) => {
    page.drawText(text, { x, y: top - size * 0.93, font, size, color })
  }

  // Word-wrap mixed-font runs to a width.
  const wrapRuns = (runs: Run[], size: number, width: number): Run[][] => {
    const words: Run[] = []
    for (const r of runs) {
      r.text.split(/(\s+)/).filter(Boolean).forEach(w => words.push({ text: w, font: r.font }))
    }
    const lines: Run[][] = []
    let line: Run[] = []
    let lineW = 0
    for (const w of words) {
      const isSpace = /^\s+$/.test(w.text)
      const ww = w.font.widthOfTextAtSize(isSpace ? ' ' : w.text, size)
      if (!isSpace && lineW + ww > width && line.length) {
        while (line.length && /^\s+$/.test(line[line.length - 1].text)) line.pop()
        lines.push(line); line = []; lineW = 0
      }
      if (isSpace && line.length === 0) continue
      line.push(isSpace ? { text: ' ', font: w.font } : w)
      lineW += ww
    }
    if (line.length) lines.push(line)
    return lines
  }

  const drawRuns = (runs: Run[], opts: { x?: number; width?: number; size: number; lh: number; color: RGB }) => {
    const x = opts.x ?? LEFT
    const width = opts.width ?? TEXT_W
    for (const line of wrapRuns(runs, opts.size, width)) {
      ensure(opts.lh)
      let cx = x
      for (const r of line) {
        page.drawText(r.text, { x: cx, y: y - opts.size * 0.93, font: r.font, size: opts.size, color: opts.color })
        cx += r.font.widthOfTextAtSize(r.text, opts.size)
      }
      y -= opts.lh
    }
  }

  const goldRule = (thickness = 1) => {
    page.drawLine({ start: { x: LEFT, y }, end: { x: RIGHT + 0.2, y }, thickness, color: C.gold })
  }

  // ============================================================
  // Letterhead (page 1)
  // ============================================================
  page.drawImage(logo, { x: 63, y: PAGE_H - 40 - 73, width: 73, height: 73 })
  const contact: [string, PDFFont, RGB][] = [
    [COACH.letterName, F.bold, C.navy],
    [COACH.email, F.reg, C.muted],
    [`Voice/Text: ${COACH.phone}`, F.reg, C.muted],
    [`LinkedIn: ${COACH.linkedinLabel}`, F.reg, C.muted],
  ]
  contact.forEach(([t, f, col], i) => {
    const w = f.widthOfTextAtSize(t, 8.5)
    textAt(t, RIGHT - w, PAGE_H - 40 - i * 12.3, f, 8.5, col)
  })
  y = PAGE_H - 135.7
  goldRule(1.75)
  y -= 10.3

  // ============================================================
  // Agreement body
  // ============================================================
  const blocks = record.agreementContent.replace(/\r\n/g, '\n').split(/\n{2,}/).map(b => b.trim()).filter(Boolean)

  const isAllCaps = (s: string) => s === s.toUpperCase() && /[A-Z]/.test(s) && s.length < 80
  const isNumberedHeading = (s: string) => /^\d+\.\s+\S/.test(s) && !/[.:]$/.test(s) && s.split(/\s+/).length <= 9
  const isLetteredHeading = (s: string) => /^[A-Z]\.\s+[A-Z]/.test(s) && !/[.:]$/.test(s) && s.length < 60
  const runInLead = (s: string): string | null => {
    if (/^[A-Z]\.\s/.test(s)) return null
    const m = s.match(/^([A-Z][^.:]{2,60}\.)\s+\S/)
    return m && m[1].split(/\s+/).length <= 5 ? m[1] : null
  }

  let section = ''           // current ALL CAPS section
  let titleDone = false
  let partiesDone = false
  let prevEndsWithColon = false

  const h2 = (text: string) => {
    y -= 10
    ensure(17 + 7 + 30)
    textAt(text, LEFT, y, F.bold, 12.5, C.navy)
    y -= 21.4
    goldRule(1)
    y -= 7
  }

  const partiesTable = () => {
    partiesDone = true
    const pad = 5.4
    const colX = [57.6, 306, 554.4]
    const colW = [colX[1] - colX[0] - pad * 2, colX[2] - colX[1] - pad * 2]
    type Cell = { label?: string; lines?: { text: string; bold?: boolean }[] }
    const left: Cell[] = [
      { label: 'COACH' },
      { lines: [
        { text: COACH.name, bold: true }, { text: COACH.firm }, { text: COACH.location },
        { text: `Email: ${COACH.email}` }, { text: `Phone: ${COACH.phone}` }, { text: COACH.credential },
      ] },
    ]
    const right: Cell[] = [
      { label: 'COACHEE' },
      { lines: [
        { text: `Name: ${fullName}` }, { text: `Email: ${record.email}` },
        { text: `Phone: ${record.phone || 'Not provided'}` },
      ] },
      { label: 'SPONSOR (IF AN ORGANIZATION IS PAYING)' },
      { lines: [{ text: 'Organization: Not applicable' }] },
    ]
    const measure = (cells: Cell[], w: number) => cells.reduce((h, c) => {
      if (c.label) return h + 16.5
      return h + (c.lines ?? []).reduce((hh, l) => hh + wrapRuns([{ text: l.text, font: l.bold ? F.bold : F.reg }], 8.5, w).length * 14.5, 0) + 2
    }, 0)
    const height = Math.max(measure(left, colW[0]), measure(right, colW[1])) + 10
    y -= 8
    ensure(height + 4)
    const top = y
    page.drawRectangle({ x: colX[0], y: top - height, width: colX[2] - colX[0], height, color: C.partiesFill, borderColor: C.tableBorder, borderWidth: 0.75 })
    page.drawLine({ start: { x: colX[1], y: top }, end: { x: colX[1], y: top - height }, thickness: 0.75, color: C.tableBorder })
    const drawCells = (cells: Cell[], x: number, w: number) => {
      let cy = top - 1.5
      for (const c of cells) {
        if (c.label) {
          textAt(c.label, x, cy, F.bold, 8, C.blue)
          cy -= 16.5
          continue
        }
        for (const l of c.lines ?? []) {
          const font = l.bold ? F.bold : F.reg
          for (const line of wrapRuns([{ text: l.text, font }], 8.5, w)) {
            textAt(line.map(r => r.text).join(''), x, cy, font, 8.5, C.body)
            cy -= 14.5
          }
        }
        cy -= 2
      }
    }
    drawCells(left, colX[0] + pad, colW[0])
    drawCells(right, colX[1] + pad, colW[1])
    y = top - height - 6
  }

  const checkbox = (x: number, top: number, checked: boolean) => {
    const s = 7
    const by = top - 9.2
    page.drawRectangle({ x, y: by, width: s, height: s, borderColor: C.body, borderWidth: 0.6 })
    if (checked) {
      page.drawLine({ start: { x: x + 1.4, y: by + 3.6 }, end: { x: x + 2.9, y: by + 1.6 }, thickness: 1.1, color: C.navy })
      page.drawLine({ start: { x: x + 2.9, y: by + 1.6 }, end: { x: x + 5.8, y: by + 5.8 }, thickness: 1.1, color: C.navy })
    }
  }

  const bullet = (text: string) => {
    const lines = wrapRuns([{ text, font: F.reg }], 9, TEXT_W - 16)
    lines.forEach((line, i) => {
      ensure(15)
      if (i === 0) textAt('•', 59, y, F.reg, 9, C.body)
      textAt(line.map(r => r.text).join(''), 68, y, F.reg, 9, C.body)
      y -= i === lines.length - 1 ? 15 : 13
    })
  }

  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean)
    const first = lines[0]

    // Title block: "COACHING SERVICES AGREEMENT" + "Effective Date: ..."
    if (!titleDone && isAllCaps(first)) {
      titleDone = true
      textAt(first, LEFT, y, F.bold, 20, C.navy)
      y -= 31
      for (const l of lines.slice(1)) {
        drawRuns([{ text: l, font: F.italic }], { size: 9, lh: 12.5, color: C.blue })
        if (/^Effective Date:/i.test(l)) {
          drawRuns([{ text: `Effective date of this Agreement: ${effectiveDateText}`, font: F.bold }], { size: 9, lh: 12.5, color: C.blue })
        }
      }
      y -= 8
      prevEndsWithColon = false
      continue
    }

    // Section heading
    if (lines.length === 1 && isAllCaps(first)) {
      if (!partiesDone) partiesTable()
      section = first
      h2(first)
      prevEndsWithColon = false
      continue
    }

    // Numbered subheading ("4. Fees, Payment, and Cancellation")
    if (lines.length === 1 && isNumberedHeading(first)) {
      y -= 5
      ensure(14 + 30)
      textAt(first, LEFT, y, F.bold, 10, C.blue)
      y -= 20
      prevEndsWithColon = false
      continue
    }

    // Lettered subheading ("A. Payment Options")
    if (lines.length === 1 && isLetteredHeading(first)) {
      y -= 2
      ensure(14 + 30)
      textAt(first, LEFT, y, F.bold, 9.5, C.blue)
      y -= 19
      prevEndsWithColon = false
      continue
    }

    // Online enrollment note in the opening: parties table goes right before it
    if (!section && /^When enrolling online/i.test(first)) {
      if (!partiesDone) partiesTable()
      drawRuns([{ text: block.replace(/\n/g, ' '), font: F.italic }], { size: 8.5, lh: 12, color: C.muted })
      y -= 6
      prevEndsWithColon = false
      continue
    }

    // Program options with checkboxes; the client's program is checked
    if (section === 'COACHING PROGRAMS' && lines.length === 1 && /^[A-Z][^.]{2,60}\.\s/.test(first) && /program|coaching/i.test(first.split('.')[0]) && first.split('.')[0].split(/\s+/).length <= 6) {
      const checked = first.startsWith(PROGRAM_TEXT_PREFIX[record.program] ?? '\u0000')
      const wrapped = wrapRuns([{ text: first, font: F.reg }], 9, TEXT_W - 16)
      ensure(14 * Math.min(wrapped.length, 2))
      checkbox(58, y, checked)
      wrapped.forEach(line => {
        ensure(14)
        textAt(line.map(r => r.text).join(''), 68, y, F.reg, 9, C.body)
        y -= 13.5
      })
      y -= 5
      prevEndsWithColon = false
      continue
    }

    // Lists: a label line ending in ":" followed by items, or a block of items after a ":" line
    if (lines.length > 1 && first.endsWith(':')) {
      ensure(14 + 15)
      textAt(first, LEFT, y, F.bold, 9.5, C.body)
      y -= 15.5
      lines.slice(1).forEach(bullet)
      y -= 4
      prevEndsWithColon = false
      continue
    }
    if (prevEndsWithColon && lines.length > 1) {
      lines.forEach(bullet)
      y -= 4
      prevEndsWithColon = false
      continue
    }

    // Regular paragraph(s). Multi-line blocks keep their line breaks.
    for (const l of lines) {
      const lead = section !== 'COACHING PROGRAMS' ? runInLead(l) : null
      const runs: Run[] = lead
        ? [{ text: lead, font: F.bold }, { text: l.slice(lead.length), font: F.reg }]
        : [{ text: l, font: F.reg }]
      drawRuns(runs, { size: 9.5, lh: 14, color: C.body })
    }
    y -= 7
    prevEndsWithColon = lines[lines.length - 1].endsWith(':')
  }

  // ============================================================
  // Execution table: the client's signing record
  // ============================================================
  let sigImage: PDFImage | null = null
  let sigW = 0
  let sigH = 0
  if (record.signatureType === 'drawn') {
    try {
      sigImage = await doc.embedPng(Buffer.from(record.signatureData.replace(/^data:image\/png;base64,/, ''), 'base64'))
      const d = sigImage.scale(1)
      sigH = Math.min(46, d.height)
      sigW = Math.min((d.width / d.height) * sigH, 240)
      sigH = (d.height / d.width) * sigW
    } catch { sigImage = null }
  }

  const rowPadX = 5.4
  const rowX = 57.6
  const rowW = 554.4 - 57.6
  const lineGap = 15.5
  const sigBlockH = sigImage ? sigH + 6 : 24
  const coacheeRowH = 8 + 16.5 + 12 + sigBlockH + 4 + lineGap * 3 + 4
  const recordRowH = 8 + 16.5 + lineGap + 12 + 11 + 8
  const tableH = coacheeRowH + recordRowH

  y -= 6
  ensure(tableH + 34)
  const tTop = y
  const row = (top: number, h: number) =>
    page.drawRectangle({ x: rowX, y: top - h, width: rowW, height: h, color: C.execFill, borderColor: C.tableBorder, borderWidth: 0.75 })
  row(tTop, coacheeRowH)
  row(tTop - coacheeRowH, recordRowH)

  const cx = rowX + rowPadX
  const field = (label: string, value: string, top: number) => {
    textAt(label, cx, top, F.reg, 9, C.body)
    textAt(value, cx + F.reg.widthOfTextAtSize(label, 9) + 4, top, F.bold, 9, C.body)
  }

  // COACHEE row
  let cy = tTop - 8
  textAt('COACHEE', cx, cy, F.bold, 8.5, C.blue)
  cy -= 16.5
  textAt('Signature:', cx, cy, F.reg, 9, C.body)
  cy -= 12
  if (sigImage) {
    page.drawImage(sigImage, { x: cx + 6, y: cy - sigH, width: sigW, height: sigH })
    cy -= sigH + 6
  } else if (record.signatureType === 'typed') {
    textAt(record.signatureData, cx + 6, cy, F.italic, 16, C.navy)
    cy -= 24
  } else {
    textAt('[Drawn signature on file]', cx + 6, cy, F.italic, 9, C.muted)
    cy -= 24
  }
  page.drawLine({ start: { x: cx, y: cy + 2 }, end: { x: cx + 250, y: cy + 2 }, thickness: 0.5, color: C.muted })
  cy -= 4
  field('Print Name:', record.signatureType === 'typed' ? `${fullName} (typed signature)` : fullName, cy); cy -= lineGap
  field('Signed electronically on:', signedAtText, cy); cy -= lineGap
  field('Effective date:', effectiveDateText, cy)

  // AGREEMENT RECORD row
  cy = tTop - coacheeRowH - 8
  textAt('AGREEMENT RECORD', cx, cy, F.bold, 8.5, C.blue)
  cy -= 16.5
  field('Agreement version:', record.agreementVersion, cy); cy -= lineGap
  textAt('Integrity hash (SHA-256), identifies the exact agreement text the client reviewed and signed:', cx, cy, F.reg, 7.5, C.muted)
  cy -= 11
  textAt(record.agreementHash, cx, cy, F.reg, 7.5, C.muted)

  y = tTop - tableH - 10
  const tagline = 'Together, we get beyond your horizon.'
  const tw = F.italic.widthOfTextAtSize(tagline, 9)
  textAt(tagline, (PAGE_W - tw) / 2, y, F.italic, 9, C.blue)

  // ============================================================
  // Footer on every page
  // ============================================================
  const pages = doc.getPages()
  pages.forEach((p, i) => {
    p.drawText('BEYOND THE HORIZON  |  COACHING SERVICES AGREEMENT', { x: LEFT, y: PAGE_H - 734.5, font: F.bold, size: 7.5, color: C.muted })
    p.drawText(COACH.firm, { x: LEFT, y: PAGE_H - 744, font: F.reg, size: 7, color: C.muted })
    const num = String(i + 1)
    const numW = F.reg.widthOfTextAtSize(num, 9.5)
    const pageW = F.reg.widthOfTextAtSize('Page ', 8)
    const endX = 554
    p.drawText('Page ', { x: endX - numW - pageW, y: PAGE_H - 747, font: F.reg, size: 8, color: C.muted })
    p.drawText(num, { x: endX - numW, y: PAGE_H - 747, font: F.reg, size: 9.5, color: C.body })
  })

  return doc.save()
}
