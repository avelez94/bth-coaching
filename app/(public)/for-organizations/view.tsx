import './for-organizations.css'
import ScheduleButton from '../../components/schedule-button'
import type { ViewProps } from '@/lib/view-props'

const DISABLED = { opacity: 0.72, cursor: 'not-allowed' } as const

export default function ForOrganizationsView({ c, booking, programs }: ViewProps) {
  const ec = programs?.['executive-coaching']
  const lp = programs?.['8-pillars']
  const ways = [
    { title: c['way.1.title'], body: c['way.1.body'], price: `${c['way.1.priceLead']} ${ec?.fullPrice ?? ''}`.trim() },
    { title: c['way.2.title'], body: c['way.2.body'], price: `${c['way.2.priceLead']} ${lp?.fullPrice ?? ''} ${c['way.2.priceTail']}`.replace(/\s+/g, ' ').trim() },
    { title: c['way.3.title'], body: c['way.3.body'], price: c['way.3.price'] },
  ]
  const howSteps = [1, 2, 3, 4].map(n => ({ num: `0${n}`, label: c[`step.${n}.label`], body: c[`step.${n}.body`] }))
  return (
    <>
      {/* ===== 1. HERO ===== */}
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-context">{c['hero.context']}</p>
          <h1 className="hero-headline">{c['hero.headline']}</h1>
          <p className="hero-subhead">{c['hero.subhead']}</p>
          <div className="hero-cta">
            <ScheduleButton url={booking?.org} className="btn btn-gold" disabledStyle={DISABLED}>
              Schedule an Organizational Consultation
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

      {/* ===== IMAGE ===== */}
      <div className="fo-photo-banner">
        <img src={c['photo.image']} alt="John McCracken in a navy blazer in front of a sculpted ocean wave" className="fo-photo-banner-img" />
      </div>

      {/* ===== 3. THREE WAYS ===== */}
      <section className="ways">
        <div className="ways-inner">
          <h2 className="ways-heading">{c['ways.heading']}</h2>
          <div className="ways-grid">
            {ways.map((w, i) => (
              <div key={i} className="way-card">
                <div className="way-title">{w.title}</div>
                <p className="way-body">{w.body}</p>
                <p className="way-price">{w.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. HOW IT WORKS ===== */}
      <section className="how">
        <div className="how-inner">
          <h2 className="how-heading">{c['how.heading']}</h2>
          <div className="how-steps">
            {howSteps.map((s, i) => (
              <div key={i} className="how-step">
                <div className="how-step-num">{s.num}</div>
                <div className="how-step-content">
                  <div className="how-step-label">{s.label}</div>
                  <p className="how-step-body">{s.body}</p>
                </div>
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

      {/* ===== 6. A NOTE ON CONFIDENTIALITY ===== */}
      <section className="confidentiality">
        <div className="confidentiality-inner">
          <p className="conf-label">{c['conf.label']}</p>
          <p className="conf-body">{c['conf.body']}</p>
        </div>
      </section>

      {/* ===== 7. WHY ME ===== */}
      <section className="why">
        <div className="why-inner">
          <div>
            <p className="why-work-label">{c['why.label']}</p>
            <h2 className="why-headline">{c['why.headline']}</h2>
          </div>
          <div>
            <p className="why-body">{c['why.body']}</p>
            <a href="/sample-engagements" className="why-link">{c['why.link']}</a>
            <div style={{marginTop: '32px'}}>
              <ScheduleButton url={booking?.org} className="btn btn-gold" disabledStyle={DISABLED}>
                Schedule an Organizational Consultation
              </ScheduleButton>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
