import './executive-coaching.css'
import ScheduleButton from '../../components/schedule-button'
import type { ViewProps } from '@/lib/view-props'

const DISABLED = { opacity: 0.72, cursor: 'not-allowed' } as const

export default function ExecutiveCoachingView({ c, booking, programs }: ViewProps) {
  const ec = programs?.['executive-coaching']
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

      {/* ===== IMAGE BREAK ===== */}
      <div className="ec-photo-banner">
        <img src={c['photo.image']} alt="John McCracken" className="ec-photo-banner-img" />
      </div>

      {/* ===== 3. WHAT THIS LOOKS LIKE IN PRACTICE ===== */}
      <section className="client-story">
        <div className="client-story-inner">
          <h2 className="story-heading">{c['story.heading']}</h2>
          <div className="story-text">
            <p>{c['story.body']}</p>
            <p className="story-attribution">{c['story.attribution']}</p>
          </div>
        </div>
      </section>

      {/* ===== 4. WHAT WE WORK ON ===== */}
      <section className="work-on">
        <div className="work-on-inner">
          <h2 className="work-on-heading">{c['work.heading']}</h2>
          <div className="work-list">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="work-list-item">
                <div className="work-list-num">0{n}</div>
                <div className="work-list-title">{c[`work.${n}.title`]}</div>
                <p className="work-list-body">{c[`work.${n}.body`]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5. HOW IT WORKS ===== */}
      <section className="how-it-works">
        <div className="how-inner">
          <h2 className="how-heading">{c['how.heading']}</h2>
          <p className="how-body-1">{c['how.body1']}</p>
          <p className="how-body-2">{c['how.body2']}</p>
        </div>
      </section>

      {/* ===== 6. WHAT'S POSSIBLE ===== */}
      <section className="possible">
        <div className="possible-inner">
          <h2 className="possible-heading">{c['possible.heading']}</h2>
          <p className="possible-body">{c['possible.body']}</p>
        </div>
      </section>

      {/* ===== 7. THE ENGAGEMENT ===== */}
      <section className="engagement">
        <div className="engagement-inner">
          <div>
            <p className="engagement-context">{c['eng.context']}</p>
            <h2 className="engagement-headline">{c['eng.headline']}</h2>
            <ScheduleButton url={booking?.free} className="btn btn-gold" disabledStyle={DISABLED}>
              Schedule a Free 15-Minute Call
            </ScheduleButton>
            <a href="/enroll?program=executive-coaching" className="btn btn-navy" style={{marginTop: 12}}>
              {c['eng.enroll']}
            </a>
          </div>
          <div>
            <div className="engagement-details">
              <div className="engagement-detail-item">{c['eng.detail1']}</div>
              <div className="engagement-detail-item"><a href="/the-8-pillars" className="engagement-detail-link">{c['eng.detail2Link']}</a>{' '}{c['eng.detail2Rest']}</div>
              <div className="engagement-detail-item">{c['eng.detail3']}</div>
              <div className="engagement-detail-item">{c['eng.detail4']}</div>
            </div>
            {ec && (
              <div className="investment-block">
                <div className="investment-label">{c['eng.investmentLabel']}</div>
                <div className="investment-amount">{ec.fullPrice}, or {ec.installmentCount} monthly payments of {ec.installmentAmount}</div>
              </div>
            )}
          </div>
        </div>
        <div className="sponsor-link">
          {c['sponsor.text']}{' '}<a href="/for-organizations">{c['sponsor.link']}</a>
        </div>
      </section>
    </>
  )
}
