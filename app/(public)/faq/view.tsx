import './faq.css'
import type { ViewProps } from '@/lib/view-props'
import { FAQ_SECTIONS, faqProgramFor } from '@/lib/site-content'
import { Inline, RichText } from '../../components/rich-text'

// FAQ: each question is a closed accordion item that opens on click.
// Built on <details>/<summary>, which browsers make keyboard and screen
// reader accessible without any script. Questions left blank in the
// admin are not shown. Program answers end with the investment line
// from Pricing & Payments, so prices are never typed twice.
export default function FaqView({ c, programs, sprint }: ViewProps) {
  const investment = (key: string): string | null => {
    const program = faqProgramFor(key)
    const label = c['investment.label']
    if (program === 'sprint' && sprint) return `${label}: ${sprint.price} ${c['investment.sprintSuffix']}.`.replace(' .', '.')
    if ((program === 'executive-coaching' || program === '8-pillars') && programs?.[program]) {
      const p = programs[program]
      return `${label}: ${p.fullPrice}, or ${p.installmentCount} monthly payments of ${p.installmentAmount}.`
    }
    return null
  }

  const sections = FAQ_SECTIONS.map(sec => {
    const items: { id: string; q: string; a: string; sources: string; price: string | null }[] = []
    for (let n = 1; c[`${sec.id}.${n}.q`] !== undefined; n++) {
      const q = (c[`${sec.id}.${n}.q`] ?? '').trim()
      const a = (c[`${sec.id}.${n}.a`] ?? '').trim()
      if (!q || !a) continue
      items.push({ id: `${sec.id}-${n}`, q, a, sources: (c[`${sec.id}.${n}.sources`] ?? '').trim(), price: investment(`${sec.id}.${n}.a`) })
    }
    return { id: sec.id, heading: c[`${sec.id}.heading`], items }
  }).filter(s => s.items.length)

  const sources: string[] = []
  for (let n = 1; c[`sources.${n}`] !== undefined; n++) if (c[`sources.${n}`].trim()) sources.push(c[`sources.${n}`].trim())

  return (
    <>
      <section className="faq-hero">
        <div className="faq-hero-inner">
          <p className="faq-label">{c['top.label']}</p>
          <h1 className="faq-title">{c['top.heading']}</h1>
        </div>
      </section>

      {sections.map((sec, i) => (
        <section key={sec.id} className={`faq-section ${i % 2 ? 'faq-tint' : ''}`} aria-labelledby={`faq-h-${sec.id}`}>
          <div className="faq-section-inner">
            <h2 className="faq-section-heading" id={`faq-h-${sec.id}`}>{sec.heading}</h2>
            <div className="faq-list">
              {sec.items.map(item => (
                <details key={item.id} id={item.id} className="faq-item">
                  <summary className="faq-q">
                    <span>{item.q}</span>
                    <span className="faq-icon" aria-hidden="true" />
                  </summary>
                  <div className="faq-a">
                    <RichText text={item.a} pClass="faq-a-p" ulClass="faq-a-ul" />
                    {item.price && <p className="faq-a-p faq-price">{item.price}</p>}
                    {item.sources && <p className="faq-sources"><Inline text={item.sources} /></p>}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      ))}

      {sources.length > 0 && (
        <section className="faq-section faq-sources-section" id="sources" aria-labelledby="faq-h-sources">
          <div className="faq-section-inner">
            <h2 className="faq-section-heading faq-sources-heading" id="faq-h-sources">{c['sources.heading']}</h2>
            <ul className="faq-source-list">
              {sources.map((src, i) => <li key={i}><Inline text={src} /></li>)}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
