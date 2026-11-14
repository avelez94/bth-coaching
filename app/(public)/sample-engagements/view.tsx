import './sample-engagements.css'
import ScheduleButton from '../../components/schedule-button'
import type { ViewProps } from '@/lib/view-props'

// Program each example links to (fixed; the link text is editable)
const COACH_LINKS = ['/for-organizations', '/executive-coaching', '/leader-development']
const CMD_LINKS = ['/leader-development', '/for-organizations', '/for-organizations', '/leader-development']

export default function SampleEngagementsView({ c, booking }: ViewProps) {
  const entries = (g: string, links: string[]) => links.map((href, i) => ({
    title: c[`${g}.${i + 1}.title`], result: c[`${g}.${i + 1}.result`], context: c[`${g}.${i + 1}.context`],
    body: c[`${g}.${i + 1}.body`], link: c[`${g}.${i + 1}.link`], href,
  }))
  return (
    <>

      {/* ===== 1. INTRO / HERO ===== */}
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-headline">{c['hero.headline']}</h1>
          <p className="hero-body">{c['hero.body']}</p>
        </div>
      </section>

      {/* ===== 2. COACHING ENGAGEMENTS ===== */}
      <section className="section-coaching">
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <div className="section-label">{c['coach.label']}</div>
          <div className="entry-list">
            {entries('coach', COACH_LINKS).map((e, i) => (
              <div key={i} className="entry">
                <div className="entry-title">{e.title}</div>
                <div className="entry-result">{e.result}</div>
                <div className="entry-context">{e.context}</div>
                <p className="entry-body">{e.body}</p>
                <a href={e.href} className="entry-program-link">{e.link}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3. LEADING TEAMS MYSELF ===== */}
      <section className="section-command">
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <div className="section-label-light">{c['cmd.label']}</div>
          <div className="entry-list-light">
            {entries('cmd', CMD_LINKS).map((e, i) => (
              <div key={i} className="entry-light">
                <div className="entry-title-light">{e.title}</div>
                <div className="entry-result-light">{e.result}</div>
                <div className="entry-context-light">{e.context}</div>
                <p className="entry-body-light">{e.body}</p>
                <a href={e.href} className="entry-program-link-light">{e.link}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. CHERRY BLOSSOM + CTA ===== */}
      <div className="se-blossom-banner">
        <img src={c['closing.image']} alt="Cherry blossom canopy" className="se-blossom-img" />
      </div>
      <section className="cta">
        <p className="cta-label">{c['closing.label']}</p>
        <ScheduleButton url={booking?.org} className="btn btn-gold" disabledStyle={{opacity: 0.72, cursor: 'not-allowed'}}>
          Schedule an Organizational Consultation
        </ScheduleButton>
      </section>
    </>
  )
}
