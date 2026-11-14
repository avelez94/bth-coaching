import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from 'pdf-lib'

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
  signedAtDisplay?: string  // Eastern Time, e.g. "November 13, 2026 at 10:52 PM EST"
  // Agreement fields: passed from the submit route so the PDF reflects the
  // version the client actually reviewed, not a hardcoded fallback.
  agreementVersion: string
  agreementHash: string
  agreementContent: string
}

const PROGRAM_LABELS: Record<string, string> = {
  'executive-coaching': 'Executive Coaching',
  '8-pillars': '8 Pillars Leadership Program',
}

const PAYMENT_LABELS: Record<string, string> = {
  'full': 'Full payment',
  'installment': 'Installment plan',
}

const HEADER_TEXT = 'BEYOND THE HORIZON EXECUTIVE COACHING  |  Coaching Services Agreement'

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxCharsPerLine) {
      if (current) lines.push(current)
      current = word
    } else {
      current = current ? current + ' ' + word : word
    }
  }
  if (current) lines.push(current)
  return lines
}

// Eastern Time, date only, e.g. "November 14, 2026". The effective date is the
// signing date, so it is derived from the same server-generated timestamp.
function formatEffectiveDate(d: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

export async function generateAgreementPDF(record: EnrollmentRecord): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const timesRoman = await doc.embedFont(StandardFonts.TimesRoman)
  const timesBold = await doc.embedFont(StandardFonts.TimesRomanBold)
  const helvetica = await doc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold)

  const navy = rgb(0.051, 0.106, 0.165)   // #0D1B2A
  const slate = rgb(0.298, 0.471, 0.627)  // #4C78A0
  const black = rgb(0, 0, 0)
  const gray = rgb(0.4, 0.4, 0.4)
  const lightGray = rgb(0.9, 0.9, 0.9)

  const pageWidth = 612   // US Letter
  const pageHeight = 792
  const margin = 72
  const contentWidth = pageWidth - margin * 2

  const signedAtText = record.signedAtDisplay ?? record.signedAt.toUTCString()
  const effectiveDateText = formatEffectiveDate(record.signedAt)
  const fullName = `${record.firstName} ${record.lastName}`

  // ============================================================
  // PAGE 1: Cover / summary page
  // ============================================================
  const coverPage = doc.addPage([pageWidth, pageHeight])

  coverPage.drawRectangle({ x: 0, y: pageHeight - 80, width: pageWidth, height: 80, color: navy })
  coverPage.drawText('BEYOND THE HORIZON EXECUTIVE COACHING', {
    x: margin, y: pageHeight - 50, font: helveticaBold, size: 11,
    color: rgb(0.969, 0.957, 0.929), // ivory
  })
  coverPage.drawText('Coaching Services Agreement', {
    x: margin, y: pageHeight - 65, font: helvetica, size: 9,
    color: rgb(0.769, 0.769, 0.769),
  })

  let y = pageHeight - 120

  coverPage.drawText('SIGNED AGREEMENT', { x: margin, y, font: timesBold, size: 22, color: navy })
  y -= 32
  coverPage.drawText(`Agreement Version ${record.agreementVersion}`, { x: margin, y, font: timesRoman, size: 11, color: gray })
  y -= 48

  // Client info box
  coverPage.drawRectangle({ x: margin, y: y - 130, width: contentWidth, height: 140, color: lightGray })
  const infoLabel = (label: string, value: string, yPos: number) => {
    coverPage.drawText(label, { x: margin + 16, y: yPos, font: helveticaBold, size: 9, color: gray })
    coverPage.drawText(value, { x: margin + 130, y: yPos, font: helvetica, size: 9, color: black })
  }
  infoLabel('Full Name', fullName, y - 20)
  infoLabel('Email', record.email, y - 36)
  infoLabel('Phone', record.phone || 'Not provided', y - 52)
  infoLabel('Organization', record.organization || 'Not provided', y - 68)
  infoLabel('Role / Title', record.role || 'Not provided', y - 84)
  infoLabel('Program', PROGRAM_LABELS[record.program] || record.program, y - 100)
  infoLabel('Payment Option', PAYMENT_LABELS[record.paymentOption] || record.paymentOption, y - 116)
  y -= 160

  const coverField = (label: string, value: string) => {
    coverPage.drawText(label, { x: margin, y, font: timesBold, size: 10, color: navy })
    y -= 18
    coverPage.drawText(value, { x: margin, y, font: timesRoman, size: 10, color: black })
    y -= 30
  }
  coverField('Effective date:', effectiveDateText)
  coverField('Signed electronically on:', signedAtText)
  coverField('Signature:', 'See the signature page at the end of this document.')

  y -= 6
  coverPage.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, thickness: 0.5, color: lightGray })
  y -= 20
  coverPage.drawText('Agreement integrity hash (SHA-256):', { x: margin, y, font: helveticaBold, size: 7, color: gray })
  y -= 12
  coverPage.drawText(record.agreementHash, { x: margin, y, font: helvetica, size: 7, color: gray })
  y -= 12
  coverPage.drawText('This hash identifies the exact agreement text the client reviewed and signed.', {
    x: margin, y, font: helvetica, size: 7, color: gray,
  })

  // ============================================================
  // PAGE 2+: Agreement text, then the signature page content
  // ============================================================
  let page: PDFPage = doc.addPage([pageWidth, pageHeight])
  let curY = 0
  const bottomLimit = margin + 30

  const startPage = () => {
    curY = pageHeight - margin
    page.drawText(HEADER_TEXT, { x: margin, y: curY, font: helvetica, size: 7, color: gray })
    curY -= 20
    page.drawLine({ start: { x: margin, y: curY }, end: { x: pageWidth - margin, y: curY }, thickness: 0.3, color: lightGray })
    curY -= 16
  }
  const newPage = () => {
    page = doc.addPage([pageWidth, pageHeight])
    startPage()
  }
  const ensureSpace = (height: number) => {
    if (curY - height < bottomLimit) newPage()
  }
  const drawLine = (text: string, font: PDFFont, size: number, color = black, step = size + 4) => {
    ensureSpace(step)
    page.drawText(text, { x: margin, y: curY, font, size, color })
    curY -= step
  }

  startPage()

  // The agreement wording itself is never changed. Where it says the effective
  // date is the date of signing, the actual date is shown on a separate line
  // directly beneath it, styled as a recorded value rather than agreement text.
  let effectiveDateNoted = false

  for (const para of record.agreementContent.split(/\n{2,}/)) {
    for (const line of para.split('\n')) {
      const isHeading = line.trim() === line.trim().toUpperCase() && line.trim().length < 80
      const font = isHeading ? timesBold : timesRoman
      const size = isHeading ? 10 : 9.5
      for (const wline of wrapText(line, isHeading ? 90 : 100)) {
        drawLine(wline, font, size, black, isHeading ? size + 6 : size + 4)
      }
      if (!effectiveDateNoted && /^Effective Date:/i.test(line.trim())) {
        effectiveDateNoted = true
        drawLine(`Effective date of this Agreement: ${effectiveDateText}`, helveticaBold, 9, slate, 13)
      }
      curY -= isHeading ? 8 : 6
    }
  }

  // ------------------------------------------------------------
  // Coachee signature block, below the agreement text
  // ------------------------------------------------------------
  let sigImage: Awaited<ReturnType<PDFDocument['embedPng']>> | null = null
  let sigWidth = 0
  let sigHeight = 0
  if (record.signatureType === 'drawn') {
    try {
      const base64Data = record.signatureData.replace(/^data:image\/png;base64,/, '')
      sigImage = await doc.embedPng(Buffer.from(base64Data, 'base64'))
      const dims = sigImage.scale(0.5)
      sigHeight = Math.min(dims.height, 80)
      sigWidth = (dims.width / dims.height) * sigHeight
    } catch {
      sigImage = null
    }
  }
  const signatureAreaHeight = sigImage ? sigHeight + 12 : 44
  const blockHeight = 40 + 30 + signatureAreaHeight + 18 + 3 * 28

  curY -= 12
  ensureSpace(blockHeight)
  const pageTopY = pageHeight - margin - 36
  if (curY < pageTopY) {
    // Only separate from the agreement text when sharing a page with it
    page.drawLine({ start: { x: margin, y: curY }, end: { x: pageWidth - margin, y: curY }, thickness: 0.5, color: lightGray })
    curY -= 24
  }
  page.drawText('COACHEE SIGNATURE', { x: margin, y: curY, font: timesBold, size: 11, color: navy })
  curY -= 30

  if (sigImage) {
    page.drawImage(sigImage, { x: margin, y: curY - sigHeight + 10, width: sigWidth, height: sigHeight })
    curY -= sigHeight + 2
  } else if (record.signatureType === 'typed') {
    page.drawText(record.signatureData, { x: margin, y: curY - 10, font: timesRoman, size: 20, color: navy })
    curY -= 24
    page.drawText('(Typed signature)', { x: margin, y: curY, font: helvetica, size: 8, color: gray })
    curY -= 10
  } else {
    page.drawText('[Drawn signature on file]', { x: margin, y: curY - 10, font: timesRoman, size: 11, color: slate })
    curY -= 30
  }
  page.drawLine({ start: { x: margin, y: curY }, end: { x: margin + 260, y: curY }, thickness: 0.5, color: gray })
  curY -= 18

  const sigField = (label: string, value: string) => {
    page.drawText(label, { x: margin, y: curY, font: helveticaBold, size: 8, color: gray })
    page.drawText(value, { x: margin + 130, y: curY, font: timesRoman, size: 10, color: black })
    curY -= 28
  }
  sigField('Name', fullName)
  sigField('Signed electronically on', signedAtText)
  sigField('Effective date', effectiveDateText)

  // ------------------------------------------------------------
  // Page numbers on every page, now that the total is known
  // ------------------------------------------------------------
  const pages = doc.getPages()
  pages.forEach((p, i) => {
    const label = `Page ${i + 1} of ${pages.length}`
    const w = helvetica.widthOfTextAtSize(label, 7)
    p.drawText(label, { x: (pageWidth - w) / 2, y: margin - 30, font: helvetica, size: 7, color: gray })
  })

  return doc.save()
}
