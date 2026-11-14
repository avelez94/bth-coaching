import './leader-development.css'
import ScheduleButton from '../../components/schedule-button'
import type { ViewProps } from '@/lib/view-props'

const DISABLED = { opacity: 0.72, cursor: 'not-allowed' } as const

export default function LeaderDevelopmentView({ c, booking, programs }: ViewProps) {
  const lp = programs?.['8-pillars']
  const stages = [1, 2, 3, 4].map(n => ({ num: `0${n}`, label: c[`stage.${n}.label`], body: c[`stage.${n}.body`] }))
  return (
    <>

      {/* ===== 1. HERO ===== */}
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-context">{c['hero.context']}</p>
          <h1 className="hero-headline">{c['hero.headline']}</h1>
          <p className="hero-subhead">{c['hero.subhead']}</p>
          <div className="hero-cta">
            <ScheduleButton url={booking?.free} className="btn btn-gold" disabledStyle={DISABLED}>
              Schedule a Free 15-Minute Call
            </ScheduleButton>
          </div>
        </div>
      </section>

      {/* ===== 2. SOUND FAMILIAR ===== */}
      <section className="familiar">
        <div className="familiar-inner">
          <h2 className="familiar-headline">{c['familiar.headline']}</h2>
          <p className="familiar-body">{c['familiar.body1']}</p>
          <p className="familiar-body">{c['familiar.body2']}</p>
          <p className="familiar-body">{c['familiar.body3']}</p>
        </div>
      </section>

      {/* ===== 3. PHOTO + THE 8 PILLARS PROGRAM (split editorial) ===== */}
      <section className="ld-split">
        <div className="ld-split-photo-col">
          <img src={c['split.image']} alt="John McCracken" className="ld-split-img" />
        </div>
        <div className="ld-split-content-col pillars">
          <div className="pillars-inner">
            <div className="pillars-intro">
              <h2 className="pillars-intro-head">{c['pillars.head']}</h2>
              <p className="pillars-intro-label">{c['pillars.label']}</p>
              <p className="pillars-subhead">{c['pillars.intro']}</p>
              <p className="pillars-names">{c['pillars.names']}</p>
              <p className="pillars-subhead" style={{marginTop: '12px'}}>{c['pillars.note']}</p>
            </div>

            <div className="pillars-framework-link">
              <a href="/the-8-pillars" className="framework-link">{c['pillars.link']}</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. HOW IT WORKS ===== */}
      <section className="how">
        <div className="how-inner">
          <h2 className="how-heading">{c['how.heading']}</h2>

          {/* Desktop: horizontal timeline */}
          <div className="how-timeline">
            {stages.map((s, i) => (
              <div key={i} className="how-stage">
                <div className="how-stage-dot" aria-hidden="true" />
                <span className="how-stage-num">{s.num}</span>
                <div className="how-stage-label">{s.label}</div>
                <p className="how-stage-body">{s.body}</p>
              </div>
            ))}
          </div>

          {/* Mobile: stacked list */}
          <div className="how-list-mobile">
            {stages.map((s, i) => (
              <div key={i} className="how-list-item">
                <span className="how-list-num">{s.num}</span>
                <div className="how-list-label">{s.label}</div>
                <p className="how-list-body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5. WHAT'S POSSIBLE ===== */}
      <section className="outcomes">
        <div className="outcomes-inner">
          <h2 className="outcomes-heading">{c['outcomes.heading']}</h2>
          <p className="outcomes-body">{c['outcomes.body']}</p>
        </div>
      </section>

      {/* ===== 5b. TESTIMONIAL ===== */}
      <section className="ld-testimonial">
        <div className="ld-testimonial-inner">
          <p className="ld-testimonial-label">{c['testimonial.label']}</p>
          <div className="ld-testimonial-quote">
            <p>{c['testimonial.p1']}</p>
            <p>{c['testimonial.p2']}</p>
            <p>{c['testimonial.p3']}</p>
          </div>
          <div className="ld-testimonial-attribution">
            <div className="ld-testimonial-name">{c['testimonial.name']}</div>
            <div className="ld-testimonial-role">{c['testimonial.role']}</div>
          </div>
        </div>
      </section>

      {/* ===== 6. THE ENGAGEMENT ===== */}
      <section className="engagement">
        <div className="engagement-inner">
          <div>
            <p className="engagement-context">{c['eng.context']}</p>
            <h2 className="engagement-headline">{c['eng.headline']}</h2>
            <ScheduleButton url={booking?.free} className="btn btn-gold" disabledStyle={DISABLED}>
              Schedule a Free 15-Minute Call
            </ScheduleButton>
            <a href="/enroll?program=8-pillars" className="btn btn-navy" style={{marginTop: 12}}>
              {c['eng.enroll']}
            </a>
          </div>
          <div>
            <div className="engagement-details">
              {[1, 2, 3, 4, 5].map(n => (
                <div key={n} className="engagement-detail-item">{c[`eng.detail${n}`]}</div>
              ))}
            </div>
            {lp && (
              <div className="investment-block">
                <div className="investment-label">{c['eng.investmentLabel']}</div>
                <div className="investment-amount">{lp.fullPrice}, or {lp.installmentCount} monthly payments of {lp.installmentAmount}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== 7. TEAM LINK ===== */}
      <section className="team-link-section">
        <div className="team-link-inner">
          <h2 className="team-link-headline">{c['team.headline']}</h2>
          <div>
            <p className="team-link-body">{c['team.body']}</p>
            <a href="/for-organizations" className="btn btn-outline-light">{c['team.link']}</a>
          </div>
        </div>
      </section>
    </>
  )
}
