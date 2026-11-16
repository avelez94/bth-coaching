import { Fragment, type ReactNode } from 'react'

// ============================================================
// Light formatting for text John edits in the admin:
//   **words**            bold
//   *words*              italic
//   [words](https://…)   a link (also /page for pages on this site)
//   lines starting "- "  a bulleted list
//   a blank line         a new paragraph
// Everything is built as React elements, never as raw HTML, so
// nothing typed in the admin can inject markup or scripts.
// ============================================================

const TOKEN = /(\*\*[^*\n]+\*\*|\*[^*\n]+\*|\[[^\]\n]+\]\((?:https:\/\/[^\s)]+|\/[^\s)]*)\))/g

export function Inline({ text }: { text: string }): ReactNode {
  const parts = text.split(TOKEN)
  return parts.map((part, i) => {
    if (!part) return null
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return <strong key={i}>{part.slice(2, -2)}</strong>
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) {
      const href = link[2]
      const external = href.startsWith('https://')
      return (
        <a key={i} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {link[1]}
        </a>
      )
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>
    return <Fragment key={i}>{part}</Fragment>
  })
}

const BULLET = /^\s*[-•]\s+/

/** Paragraphs and bulleted lists from one block of text */
export function RichText({ text, pClass, ulClass }: { text: string; pClass?: string; ulClass?: string }) {
  const blocks = text.replace(/\r\n/g, '\n').split(/\n\s*\n/).map(b => b.trim()).filter(Boolean)
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split('\n')
        if (lines.every(l => BULLET.test(l))) {
          return (
            <ul key={i} className={ulClass}>
              {lines.map((l, j) => <li key={j}><Inline text={l.replace(BULLET, '')} /></li>)}
            </ul>
          )
        }
        return (
          <p key={i} className={pClass}>
            {lines.map((l, j) => <Fragment key={j}>{j > 0 && <br />}<Inline text={l} /></Fragment>)}
          </p>
        )
      })}
    </>
  )
}

/** Plain text with the formatting marks removed (for search results and emails) */
export function plainText(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^\s*[-•]\s+/gm, '')
}
