// ============================================================
// Splits the Coaching Services Agreement into its real sections so
// it can be edited piece by piece, then joins them back.
//
// The split happens only at heading lines (ALL CAPS headings and
// numbered headings like "4. Fees, Payment, and Cancellation"), and
// every character, including spacing, is kept. joinSections(split(x))
// always returns exactly x, so the agreement wording cannot drift.
// ============================================================

export interface AgreementSection {
  id: string
  title: string        // label shown to John
  body: string         // editable text (heading line included, trailing blank lines excluded)
  sep: string          // the blank lines that followed it, restored on join
  groupOnly: boolean   // a heading with no text of its own (e.g. "TERMS AND CONDITIONS")
}

const isCapsHeading = (l: string) => {
  const t = l.trim()
  return t.length > 2 && t.length < 80 && t === t.toUpperCase() && /[A-Z]{3}/.test(t) && !/[.:;]$/.test(t)
}
const isNumberedHeading = (l: string) => /^\d{1,2}\.\s+\S/.test(l.trim()) && l.trim().length < 80 && !/[.:;]$/.test(l.trim())

const titleCase = (s: string) =>
  s.toLowerCase().replace(/\b([a-z])/g, (m, c, i) => (i > 0 && /^(and|of|or|the|a|in|to|for)\b/.test(s.toLowerCase().slice(i)) ? c : c.toUpperCase()))

export function splitSections(text: string): AgreementSection[] {
  const starts: number[] = [0]
  let pos = 0
  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const prevBlank = i > 0 && lines[i - 1].trim() === ''
    if (i > 0 && prevBlank && (isCapsHeading(line) || isNumberedHeading(line))) starts.push(pos)
    pos += line.length + 1
  }
  const sections: AgreementSection[] = []
  starts.forEach((start, idx) => {
    const end = idx + 1 < starts.length ? starts[idx + 1] : text.length
    const slice = text.slice(start, end)
    const body = slice.replace(/\s+$/, '')
    const sep = slice.slice(body.length)
    const firstLine = body.split('\n')[0].trim()
    const rest = body.split('\n').slice(1).join('\n').trim()
    let title: string
    if (idx === 0) title = 'Opening: parties and how the agreement is accepted'
    else if (isNumberedHeading(firstLine)) title = firstLine
    else title = titleCase(firstLine)
    sections.push({ id: `s${idx}`, title, body, sep, groupOnly: idx > 0 && isCapsHeading(firstLine) && rest === '' })
  })
  return sections
}

export function joinSections(sections: AgreementSection[]): string {
  return sections.map(s => s.body + s.sep).join('')
}
