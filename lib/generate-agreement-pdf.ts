import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

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
  // Agreement fields — passed from submit route so the PDF reflects the
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

  // ============================================================
  // PAGE 1: Cover / Signature page
  // ============================================================
  const coverPage = doc.addPage([pageWidth, pageHeight])

  // Header bar
  coverPage.drawRectangle({ x: 0, y: pageHeight - 80, width: pageWidth, height: 80, color: navy })
  coverPage.drawText('BEYOND THE HORIZON EXECUTIVE COACHING', {
    x: margin,
    y: pageHeight - 50,
    font: helveticaBold,
    size: 11,
    color: rgb(0.969, 0.957, 0.929), // ivory
  })
  coverPage.drawText('Coaching Services Agreement', {
    x: margin,
    y: pageHeight - 65,
    font: helvetica,
    size: 9,
    color: rgb(0.769, 0.769, 0.769),
  })

  let y = pageHeight - 120

  // Title
  coverPage.drawText('SIGNED AGREEMENT', {
    x: margin,
    y,
    font: timesBold,
    size: 22,
    color: navy,
  })
  y -= 32

  coverPage.drawText(`Agreement Version ${record.agreementVersion}`, {
    x: margin,
    y,
    font: timesRoman,
    size: 11,
    color: gray,
  })
  y -= 48

  // Client info box
  coverPage.drawRectangle({ x: margin, y: y - 130, width: contentWidth, height: 140, color: lightGray })

  const infoLabel = (label: string, value: string, yPos: number) => {
    coverPage.drawText(label, { x: margin + 16, y: yPos, font: helveticaBold, size: 9, color: gray })
    coverPage.drawText(value, { x: margin + 130, y: yPos, font: helvetica, size: 9, color: black })
  }

  infoLabel('Full Name', `${record.firstName} ${record.lastName}`, y - 20)
  infoLabel('Email', record.email, y - 36)
  infoLabel('Phone', record.phone || 'Not provided', y - 52)
  infoLabel('Organization', record.organization || 'Not provided', y - 68)
  infoLabel('Role / Title', record.role || 'Not provided', y - 84)
  infoLabel('Program', PROGRAM_LABELS[record.program] || record.program, y - 100)
  infoLabel('Payment Option', PAYMENT_LABELS[record.paymentOption] || record.paymentOption, y - 116)

  y -= 160

  // Signed at / audit
  coverPage.drawText('Signed electronically on:', {
    x: margin,
    y,
    font: timesBold,
    size: 10,
    color: navy,
  })
  y -= 18
  coverPage.drawText(record.signedAt.toUTCString(), {
    x: margin,
    y,
    font: timesRoman,
    size: 10,
    color: black,
  })
  y -= 36

  // Signature
  coverPage.drawText('Signature:', {
    x: margin,
    y,
    font: timesBold,
    size: 10,
    color: navy,
  })
  y -= 16

  if (record.signatureType === 'typed') {
    coverPage.drawText(record.signatureData, {
      x: margin,
      y,
      font: timesRoman,
      size: 20,
      color: navy,
    })
    y -= 24
    coverPage.drawText('(Typed signature)', {
      x: margin,
      y,
      font: helvetica,
      size: 8,
      color: gray,
    })
    y -= 24
  } else {
    // Drawn signature — embed as image
    try {
      const base64Data = record.signatureData.replace(/^data:image\/png;base64,/, '')
      const signatureBytes = Buffer.from(base64Data, 'base64')
      const signatureImage = await doc.embedPng(signatureBytes)
      const sigDims = signatureImage.scale(0.5)
      const sigHeight = Math.min(sigDims.height, 80)
      const sigWidth = (sigDims.width / sigDims.height) * sigHeight
      coverPage.drawImage(signatureImage, {
        x: margin,
        y: y - sigHeight,
        width: sigWidth,
        height: sigHeight,
      })
      y -= sigHeight + 24
    } catch {
      coverPage.drawText('[Drawn signature on file]', {
        x: margin,
        y,
        font: timesRoman,
        size: 11,
        color: slate,
      })
      y -= 24
    }
  }

  // Divider
  coverPage.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, thickness: 0.5, color: lightGray })
  y -= 20

  // Agreement hash / audit trail
  coverPage.drawText('Agreement integrity hash (SHA-256):', {
    x: margin,
    y,
    font: helveticaBold,
    size: 7,
    color: gray,
  })
  y -= 12
  coverPage.drawText(record.agreementHash, {
    x: margin,
    y,
    font: helvetica,
    size: 7,
    color: gray,
  })
  y -= 12
  coverPage.drawText('This hash identifies the exact agreement text the client reviewed and signed.', {
    x: margin,
    y,
    font: helvetica,
    size: 7,
    color: gray,
  })

  // ============================================================
  // PAGE 2+: Agreement text
  // ============================================================
  const addTextPages = (text: string) => {
    let page = doc.addPage([pageWidth, pageHeight])
    let curY = pageHeight - margin

    // Page header
    page.drawText('BEYOND THE HORIZON EXECUTIVE COACHING — Coaching Services Agreement', {
      x: margin,
      y: curY,
      font: helvetica,
      size: 7,
      color: gray,
    })
    curY -= 20
    page.drawLine({ start: { x: margin, y: curY }, end: { x: pageWidth - margin, y: curY }, thickness: 0.3, color: lightGray })
    curY -= 16

    const paragraphs = text.split(/\n{2,}/)

    for (const para of paragraphs) {
      const lines = para.split('\n')
      for (const line of lines) {
        const isHeading = line.trim() === line.trim().toUpperCase() && line.trim().length < 80
        const font = isHeading ? timesBold : timesRoman
        const size = isHeading ? 10 : 9.5
        const wrapped = wrapText(line, isHeading ? 90 : 100)

        for (const wline of wrapped) {
          if (curY < margin + 30) {
            // Footer
            page.drawLine({ start: { x: margin, y: margin + 20 }, end: { x: pageWidth - margin, y: margin + 20 }, thickness: 0.3, color: lightGray })
            page.drawText(`Page ${doc.getPageCount() - 1} of ${doc.getPageCount()}`, {
              x: pageWidth / 2 - 20,
              y: margin + 8,
              font: helvetica,
              size: 7,
              color: gray,
            })
            page = doc.addPage([pageWidth, pageHeight])
            curY = pageHeight - margin
            // Repeat header on new page
            page.drawText('BEYOND THE HORIZON EXECUTIVE COACHING — Coaching Services Agreement', {
              x: margin,
              y: curY,
              font: helvetica,
              size: 7,
              color: gray,
            })
            curY -= 20
            page.drawLine({ start: { x: margin, y: curY }, end: { x: pageWidth - margin, y: curY }, thickness: 0.3, color: lightGray })
            curY -= 16
          }
          page.drawText(wline, {
            x: margin,
            y: curY,
            font,
            size,
            color: black,
          })
          curY -= isHeading ? size + 6 : size + 4
        }

        // Paragraph spacing
        curY -= isHeading ? 8 : 6
      }
    }
  }

  addTextPages(record.agreementContent)

  return doc.save()
}
