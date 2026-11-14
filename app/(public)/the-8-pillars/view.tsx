import './the-8-pillars.css'
import ScheduleButton from '../../components/schedule-button'
import type { ViewProps } from '@/lib/view-props'

const DISABLED = { opacity: 0.72, cursor: 'not-allowed' } as const

export default function The8PillarsView({ c, booking }: ViewProps) {
  const science = [1, 2, 3, 4].map(n => ({ name: c[`science.${n}.name`], body: c[`science.${n}.body`] }))
  const pillars = [1, 2, 3, 4, 5, 6, 7, 8].map(n => ({
    num: `0${n}`, name: c[`pillar.${n}.name`], subtitle: c[`pillar.${n}.subtitle`], body: c[`pillar.${n}.body`],
  }))
  const steps = [1, 2, 3, 4].map(n => c[`coaching.step${n}`])
  return (
    <>

      {/* ===== 1. HERO ===== */}
      <section className="hero">
        <div className="hero-composition">
          <div className="hero-text">
            <h1 className="hero-headline">{c['hero.headline']}</h1>
            <p className="hero-subhead">{c['hero.subhead']}</p>
          </div>
          <div className="hero-compass-col">
            <img src={c['hero.image']} alt="The 8 Pillars compass" className="hero-compass-img" />
          </div>
        </div>
      </section>

      {/* ===== 2. WHAT MOST LEADERSHIP FRAMEWORKS MISS ===== */}
      <section className="miss">
        <div className="miss-inner">
          <div>
            <h2 className="miss-headline">{c['miss.headline']}</h2>
            <p className="miss-body">{c['miss.body1']}</p>
            <p className="miss-body">{c['miss.body2']}</p>
          </div>
          <div className="miss-quote-col">
            <p className="miss-quote">{c['miss.quote']}</p>
          </div>
        </div>
      </section>

      {/* ===== 3. WHERE THE FRAMEWORK COMES FROM ===== */}
      <section className="science">
        <div className="science-inner">
          <h2 className="science-heading">{c['science.heading']}</h2>
          <div className="science-grid">
            {science.map((s, i) => (
              <div key={i} className="science-cell">
                <div className="science-cell-name">{s.name}</div>
                <p className="science-cell-body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. THE 8 PILLARS ===== */}
      <section className="pillars">
        <div className="pillars-inner">
          <h2 className="pillars-intro-head">{c['pillars.heading']}</h2>

          {/* Desktop: 4x2 card grid */}
          <div className="pillar-grid">
            {pillars.map((p, i) => (
              <div key={i} className="pillar-card">
                <span className="pillar-card-num">{p.num}</span>
                <div className="pillar-card-name">{p.name}</div>
                <div className="pillar-card-subtitle">{p.subtitle}</div>
                <p className="pillar-card-body">{p.body}</p>
              </div>
            ))}
          </div>

          {/* Mobile: stacked cards */}
          <div className="pillar-grid-mobile">
            {pillars.map((p, i) => (
              <div key={i} className="pillar-card">
                <span className="pillar-card-num">{p.num}</span>
                <div className="pillar-card-name">{p.name}</div>
                <div className="pillar-card-subtitle">{p.subtitle}</div>
                <p className="pillar-card-body">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5. HOW THE PILLARS WORK IN COACHING ===== */}
      <section className="coaching">
        <div className="coaching-inner">
          <h2 className="coaching-headline">{c['coaching.headline']}</h2>
          <div className="coaching-steps">
            {steps.map((s, i) => (
              <div key={i} className="coaching-step">
                <div className="coaching-step-num">0{i + 1}</div>
                <p className="coaching-step-body">{s}</p>
              </div>
            ))}
          </div>
          <p className="coaching-body">{c['coaching.body']}</p>
        </div>
      </section>

      {/* PLACEHOLDER: 8 Pillars self-assessment — in development.
          When ready, add a second button here: "Take the free 8 Pillars self-assessment." */}

      {/* ===== CHERRY BLOSSOM + CTA ===== */}
      <div className="pillars-blossom-banner">
        <img src={c['closing.image']} alt="Cherry blossom canopy" className="pillars-blossom-img" />
      </div>
      <section className="cta-section">
        <p className="cta-section-link-row">
          <a href="/leader-development" className="cta-program-link">{c['closing.link']}</a>
        </p>
        <div className="cta-section-buttons">
          <ScheduleButton url={booking?.free} className="btn btn-gold" disabledStyle={DISABLED}>
            Schedule a Free 15-Minute Call
          </ScheduleButton>
          <ScheduleButton url={booking?.org} className="btn btn-outline" disabledStyle={DISABLED}>
            Schedule an Organizational Consultation
          </ScheduleButton>
        </div>
      </section>
    </>
  )
}
