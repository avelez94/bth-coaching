import { PDFDocument, PDFFont, PDFPage, PDFString, rgb, RGB } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { readFile } from 'fs/promises'
import path from 'path'

// ============================================================
// 8 Pillar Sprint gift certificate (one page, US Letter landscape).
// Same brand system as the signed agreement PDF: Noto Serif, navy,
// gold rules, ivory paper, the Beyond the Horizon mark.
//
// Every sentence of program detail and terms comes from the caller,
// which reads it from John's Sprint page content. Nothing here adds
// policy wording of its own.
// ============================================================

export interface CertificateContent {
  purchaserName: string | null
  recipientName: string | null
  code: string
  link: string
  registerBy: string           // Sprint page: Register by
  dates: string                // Sprint page: Dates
  time: string                 // Sprint page: Time
  format: string               // Sprint page: Format
  terms: string[]              // Sprint page refund terms, verbatim
  contactName: string
  contactEmail: string
  contactPhone: string
  website: string
  testMode?: boolean
}

export const CERTIFICATE_INSTRUCTION = 'Use this link/code to claim your Sprint seat and complete your registration.'

const hex = (h: string): RGB => {
  const n = parseInt(h.replace('#', ''), 16)
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255)
}
const C = {
  navy: hex('#0d1b2a'), body: hex('#263746'), muted: hex('#617487'),
  gold: hex('#c9a23a'), ivory: hex('#f7f4ed'), panel: hex('#efe9dc'), white: hex('#ffffff'),
}

const W = 792
const H = 612
const ASSETS = path.join(process.cwd(), 'lib', 'pdf-assets')

function wrap(text: string, font: PDFFont, size: number, maxW: number): string[] {
  const out: string[] = []
  for (const para of text.split('\n')) {
    let line = ''
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word
      if (font.widthOfTextAtSize(next, size) <= maxW) { line = next; continue }
      if (line) out.push(line)
      // A single word wider than the line (a long link): break it by characters
      if (font.widthOfTextAtSize(word, size) > maxW) {
        let chunk = ''
        for (const ch of word) {
          if (font.widthOfTextAtSize(chunk + ch, size) > maxW) { out.push(chunk); chunk = ch } else chunk += ch
        }
        line = chunk
      } else line = word
    }
    out.push(line)
  }
  return out
}

function center(page: PDFPage, text: string, y: number, font: PDFFont, size: number, color: RGB, spacing = 0) {
  const w = font.widthOfTextAtSize(text, size) + spacing * Math.max(0, text.length - 1)
  if (!spacing) { page.drawText(text, { x: (W - w) / 2, y, size, font, color }); return }
  let x = (W - w) / 2
  for (const ch of text) { page.drawText(ch, { x, y, size, font, color }); x += font.widthOfTextAtSize(ch, size) + spacing }
}

export async function generateGiftCertificatePDF(c: CertificateContent): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  doc.registerFontkit(fontkit)
  const [regB, boldB, itB, logoB] = await Promise.all([
    readFile(path.join(ASSETS, 'NotoSerif-Regular.ttf')),
    readFile(path.join(ASSETS, 'NotoSerif-Bold.ttf')),
    readFile(path.join(ASSETS, 'NotoSerif-Italic.ttf')),
    readFile(path.join(ASSETS, 'bth-logo.png')),
  ])
  const reg = await doc.embedFont(regB, { subset: false })
  const bold = await doc.embedFont(boldB, { subset: false })
  const it = await doc.embedFont(itB, { subset: false })
  const logo = await doc.embedPng(logoB)

  doc.setTitle('8 Pillar Sprint Gift Certificate')
  doc.setAuthor('Beyond the Horizon Executive Coaching & Consulting')
  doc.setSubject(`Gift certificate ${c.code}`)

  const page = doc.addPage([W, H])
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.ivory })
  // Frame: navy outer border, gold inner rule
  page.drawRectangle({ x: 18, y: 18, width: W - 36, height: H - 36, borderColor: C.navy, borderWidth: 2.5 })
  page.drawRectangle({ x: 28, y: 28, width: W - 56, height: H - 56, borderColor: C.gold, borderWidth: 0.8 })

  if (c.testMode) {
    center(page, 'TEST CERTIFICATE: NOT VALID FOR A REAL SEAT', H - 46, bold, 9, hex('#b45309'), 0.6)
  }

  // Letterhead
  const logoSize = 50
  page.drawImage(logo, { x: (W - logoSize) / 2, y: H - 60 - logoSize, width: logoSize, height: logoSize })
  center(page, 'BEYOND THE HORIZON', H - 128, bold, 11, C.navy, 2.2)
  center(page, 'EXECUTIVE COACHING & CONSULTING', H - 142, reg, 7.5, C.muted, 1.6)

  // Title
  center(page, 'Gift Certificate', H - 198, reg, 40, C.navy)
  page.drawLine({ start: { x: W / 2 - 60, y: H - 214 }, end: { x: W / 2 + 60, y: H - 214 }, thickness: 1, color: C.gold })
  center(page, '8 PILLAR SPRINT', H - 236, bold, 13, C.navy, 2.5)
  center(page, `${c.dates}  ·  ${c.time}  ·  ${c.format}`, H - 254, reg, 9.5, C.body)

  // For / from
  let y = H - 290
  const lineW = 300
  const forLabel = 'For'
  page.drawText(forLabel, { x: (W - lineW) / 2 - reg.widthOfTextAtSize(forLabel, 11) - 10, y, size: 11, font: it, color: C.muted })
  if (c.recipientName) {
    center(page, c.recipientName, y + 2, reg, 16, C.navy)
  }
  page.drawLine({ start: { x: (W - lineW) / 2, y: y - 5 }, end: { x: (W + lineW) / 2, y: y - 5 }, thickness: 0.6, color: C.muted })
  y -= 26
  const from = c.purchaserName ? `A gift from ${c.purchaserName}` : 'A gift for you to pass along'
  center(page, from, y, it, 11.5, C.body)
  if (!c.recipientName) {
    y -= 15
    center(page, 'Write the recipient’s name above, or simply pass this certificate along.', y, reg, 8.5, C.muted)
  }

  // Code panel
  const panelW = 520, panelH = 86, panelX = (W - panelW) / 2, panelY = y - 28 - panelH
  page.drawRectangle({ x: panelX, y: panelY, width: panelW, height: panelH, color: C.panel, borderColor: C.gold, borderWidth: 0.6 })
  center(page, 'REDEMPTION CODE', panelY + panelH - 17, bold, 7.5, C.muted, 1.4)
  center(page, c.code, panelY + panelH - 42, bold, 20, C.navy, 1.2)
  const linkLines = wrap(c.link, reg, 8, panelW - 40)
  linkLines.forEach((l, i) => center(page, l, panelY + 22 - i * 10 + (linkLines.length - 1) * 5, reg, 8, C.body))
  // Make the link clickable
  const linkAnnot = doc.context.register(doc.context.obj({
    Type: 'Annot', Subtype: 'Link', Rect: [panelX, panelY + 4, panelX + panelW, panelY + 34], Border: [0, 0, 0],
    A: { Type: 'Action', S: 'URI', URI: PDFString.of(c.link) },
  }))
  page.node.addAnnot(linkAnnot)

  // Instruction + deadline
  y = panelY - 22
  center(page, CERTIFICATE_INSTRUCTION, y, reg, 11, C.navy)
  y -= 17
  center(page, `Register by ${c.registerBy}`, y, bold, 11, C.navy)

  // Terms (verbatim from the Sprint page)
  y -= 24
  const termsW = 600
  for (const t of c.terms) {
    for (const l of wrap(t, reg, 8, termsW)) { center(page, l, y, reg, 8, C.muted); y -= 11 }
  }

  // Contact
  const contact = `Questions: ${c.contactName}  ·  ${c.contactEmail}  ·  ${c.contactPhone}  ·  ${c.website}`
  center(page, contact, 44, reg, 8, C.body)

  return doc.save()
}
