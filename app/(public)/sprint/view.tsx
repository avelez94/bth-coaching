import './sprint.css'
import type { ViewProps } from '@/lib/view-props'

// The 8 Pillar Sprint page. Copy comes from the admin (John's Sprint page
// document is the default). The price and both Stripe checkout links come
// from Pricing & Payments. Both buttons go straight to Stripe: the Sprint is
// group learning, so there is no coaching agreement to sign, and a gift
// buyer is not the participant.
export default function SprintView({ c, booking, sprint }: ViewProps) {
  const weeks = Array.from({ length: 8 }, (_, i) => ({
    n: i + 1, date: c[`week.${i + 1}.date`], pillar: c[`week.${i + 1}.pillar`], add: c[`week.${i + 1}.add`],
  }))
  const rhythm = [1, 2, 3, 4].map(n => ({ title: c[`rhythm.${n}.title`], body: c[`rhythm.${n}.body`] }))
  const leave = [1, 2, 3, 4, 5].map(n => c[`leave.${n}`]).filter(Boolean)
  const refunds = [1, 2, 3, 4, 5].map(n => ({ lead: c[`refund.${n}.lead`], text: c[`refund.${n}.text`] }))
  const gifts = [1, 2].map(n => ({ lead: c[`gift.${n}.lead`], text: c[`gift.${n}.text`] }))
  const details: [string, string][] = [
    [c['details.dates.label'], c['details.dates']],
    [c['details.time.label'], c['details.time']],
    [c['details.format.label'], c['details.format']],
    [c['details.size.label'], c['details.size']],
    [c['details.prep.label'], c['details.prep']],
    ...(sprint ? [[c['details.investment.label'], `${sprint.price} ${c['details.investment.suffix']}`.trim()] as [string, string]] : []),
    [c['details.register.label'], c['details.register']],
  ]

  // After the registration deadline (Admin > Pricing) neither button is
  // shown, so no one can buy a seat or a gift that can no longer be used
  const closed = Boolean(sprint?.closed)
  const enroll = (className: string) =>
    !sprint ? null
      : closed ? <p className="sp-closed" role="status">Registration for the 8 Pillar Sprint closed on {sprint.closedOn}.</p>
      : <a href={sprint.enrollUrl} className={className}>{c['btn.enroll']}</a>
  const gift = (className: string) =>
    sprint && !closed ? <a href={sprint.giftUrl} className={className}>{c['btn.gift']}</a> : null
  const quote = (className: string) => (
    <figure className={className}>
      <blockquote>{c['hero.quote']}</blockquote>
      <figcaption>{c['hero.quoteBy']}</figcaption>
    </figure>
  )

  return (
    <>
      {/* ===== 1. HERO ===== */}
      <section className="sp-hero">
        <div className="sp-hero-inner">
          {quote('sp-quote')}
          <p className="sp-hero-label">{c['hero.label']}</p>
          <h1 className="sp-hero-headline">{c['hero.headline']}</h1>
          <div className="sp-hero-grid">
            <p className="sp-hero-pillars">
              {c['hero.pillarsLead'] && <strong>{c['hero.pillarsLead']} </strong>}
              {c['hero.pillars']}
            </p>
            <div>
              <p className="sp-hero-subhead">{c['hero.subhead']}</p>
              <div className="sp-btn-row">
                {enroll('btn btn-gold')}
                {gift('btn btn-outline-light')}
              </div>
              <p className="sp-hero-when">{c['hero.when']}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 2. SOUND FAMILIAR ===== */}
      <section className="sp-section sp-tint">
        <div className="sp-inner sp-narrow">
          <h2 className="sp-h2">{c['familiar.heading']}</h2>
          <ul className="sp-points">
            <li>{c['familiar.point1']}</li>
            <li>{c['familiar.point2']}</li>
          </ul>
          <p className="sp-body">{c['familiar.body1']}</p>
          <p className="sp-body">{c['familiar.body2']}</p>
        </div>
      </section>

      {/* ===== 3. HOW IT WORKS ===== */}
      <section className="sp-section">
        <div className="sp-inner">
          <h2 className="sp-h2">{c['how.heading']}</h2>
          <div className="sp-two">
            <div>
              <h3 className="sp-h3">{c['how.before.title']}</h3>
              <p className="sp-support">{c['how.before.body']}</p>
            </div>
            <div>
              <h3 className="sp-h3">{c['how.weeks.title']}</h3>
              <p className="sp-support">{c['how.weeks.body']}</p>
            </div>
          </div>

          <table className="sp-weeks">
            <thead>
              <tr>
                <th scope="col">{c['weeks.col.week']}</th>
                <th scope="col">{c['weeks.col.date']}</th>
                <th scope="col">{c['weeks.col.pillar']}</th>
                <th scope="col">{c['weeks.col.add']}</th>
              </tr>
            </thead>
            <tbody>
              {weeks.map(w => (
                <tr key={w.n}>
                  <td className="sp-week-num">
                    <span className="sp-mobile-only">{c['weeks.col.week']} </span>{w.n}
                    <span className="sp-mobile-only sp-week-date"> · {w.date}</span>
                  </td>
                  <td className="sp-week-date-cell">{w.date}</td>
                  <th scope="row" className="sp-week-pillar">{w.pillar}</th>
                  <td className="sp-week-add">{w.add}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== 4. EVERY SESSION + WHAT YOU LEAVE WITH ===== */}
      <section className="sp-section sp-tint">
        <div className="sp-inner">
          <h2 className="sp-h2 sp-h2-small">{c['rhythm.heading']}</h2>
          <ol className="sp-rhythm">
            {rhythm.map((r, i) => (
              <li key={i}>
                <span className="sp-step-num" aria-hidden="true">0{i + 1}</span>
                <h3 className="sp-h3">{r.title}</h3>
                <p className="sp-support">{r.body}</p>
              </li>
            ))}
          </ol>
          <p className="sp-support sp-warmup">{c['rhythm.warmup']}</p>

          <div className="sp-leave">
            <h3 className="sp-h3 sp-leave-heading">{c['leave.heading']}</h3>
            <ul className="sp-list">
              {leave.map((l, i) => <li key={i}>{l}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== 5. THE DETAILS ===== */}
      <section className="sp-section sp-details-section">
        <div className="sp-inner sp-details-grid">
          <h2 className="sp-h2">{c['details.heading']}</h2>
          <div>
            <dl className="sp-details">
              {details.map(([label, value]) => (
                <div key={label} className="sp-detail-row">
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <div className="sp-details-cta">{enroll('btn btn-navy')}</div>
          </div>
        </div>
      </section>

      {/* ===== 6. REFUNDS AND CANCELLATIONS ===== */}
      <section className="sp-section sp-tint">
        <div className="sp-inner sp-narrow">
          <h2 className="sp-h2">{c['refunds.heading']}</h2>
          <ul className="sp-terms">
            {refunds.map((r, i) => <li key={i}><strong>{r.lead}</strong> {r.text}</li>)}
          </ul>
        </div>
      </section>

      {/* ===== 7. GIVE THE SPRINT AS A GIFT ===== */}
      <section className="sp-gift" id="gift">
        <div className="sp-inner sp-gift-grid">
          <h2 className="sp-h2 sp-on-dark">{c['gift.heading']}</h2>
          <div>
            <p className="sp-body sp-on-dark">{c['gift.body1']}</p>
            <p className="sp-body sp-on-dark">{c['gift.body2']}</p>
            <ul className="sp-terms sp-on-dark">
              {gifts.map((g, i) => <li key={i}><strong>{g.lead}</strong> {g.text}</li>)}
            </ul>
            {gift('btn btn-gold')}
          </div>
        </div>
      </section>

      {/* ===== 8. WHAT COMES NEXT ===== */}
      <section className="sp-section">
        <div className="sp-inner sp-narrow">
          <h2 className="sp-h2">{c['next.heading']}</h2>
          <p className="sp-body">{c['next.body']}</p>
          <a href="/leader-development" className="sp-link">{c['next.link']}</a>
        </div>
      </section>

      {/* ===== 9. A NOTE ON WHAT THIS IS ===== */}
      <section className="sp-section sp-tint sp-note-section">
        <div className="sp-inner sp-narrow">
          <h2 className="sp-h3 sp-note-heading">{c['note.heading']}</h2>
          <p className="sp-support">{c['note.body']}</p>
        </div>
      </section>

      {/* ===== 10. CHERRY BLOSSOM + CLOSING ===== */}
      <div className="sp-blossom">
        <img src={c['closing.image']} alt="Cherry blossom canopy" className="sp-blossom-img" />
      </div>
      <section className="sp-closing">
        <h2 className="sp-closing-headline">{c['closing.headline']}</h2>
        <p className="sp-closing-body">{c['closing.body']}</p>
        <div className="sp-btn-row sp-btn-row-center">
          {enroll('btn btn-gold')}
          {gift('btn btn-outline')}
        </div>
        <p className="sp-closing-question">
          {c['closing.question']}{' '}
          <a href={booking?.free || '/contact'} className="sp-link"
            {...(booking?.free ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {c['closing.call']}
          </a>
        </p>
        {quote('sp-quote sp-quote-bottom')}
      </section>
    </>
  )
}
