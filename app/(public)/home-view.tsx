import './home.css'
import ScheduleButton from '../components/schedule-button'
import Rotator from '../components/rotator'
import Image from 'next/image'
import type { PageContent } from '@/lib/site-content'
import type { EngagementPreview } from '@/lib/view-props'

const words = (...t: string[]) => t.join(' ').split(/\s+/).filter(Boolean).length

// Home page layout. Text and photos come from `c` (John's saved content
// merged over the launch copy). Used by the live page and the admin preview.
export default function HomeView({ c, bookingUrl, engagements = [] }: { c: PageContent; bookingUrl?: string; engagements?: EngagementPreview[] }) {
  const badges = [
    { main: c['cred.badge1'], detail: c['cred.badge1Detail'] },
    { main: c['cred.badge2'], detail: c['cred.badge2Detail'] },
    { main: c['cred.badge3'], detail: c['cred.badge3Detail'] },
  ]
  // Every testimonial with a quote rotates; the first is the original one
  const testimonials = [
    { quote: c['testimonial.quote'], name: c['testimonial.name'], role: c['testimonial.role'] },
    { quote: c['testimonial.2.quote'], name: c['testimonial.2.name'], role: c['testimonial.2.role'] },
    { quote: c['testimonial.3.quote'], name: c['testimonial.3.name'], role: c['testimonial.3.role'] },
  ].filter(t => t.quote?.trim())
  return (
    <>
      {/* ===== 1. HERO ===== */}
      <section className="hero">
        <div className="hero-left">
          <h1 className="hero-headline">{c['hero.headline']}</h1>
          <p className="hero-subhead">{c['hero.subhead']}</p>
          <p className="hero-body">{c['hero.body']}</p>
          <div className="hero-cta-stack">
            <ScheduleButton url={bookingUrl} className="btn-gold">
              Schedule a Free 15-Minute Call
            </ScheduleButton>
            <p className="hero-org-link">
              {c['hero.orgPrompt']}{' '}
              <a href="/for-organizations">{c['hero.orgLink']}</a>
            </p>
          </div>
        </div>
        <div className="hero-right">
          <img
            src={c['hero.image']}
            alt="John McCracken"
            className="hero-photo-img"
          />
          <div className="hero-photo-fade" aria-hidden="true" />
        </div>
      </section>

      {/* ===== 2. THREE DOORS ===== */}
      <section className="doors">
        <div className="doors-inner">
          <div className="doors-label">{c['doors.label']}</div>
          <div className="doors-grid">
            {([
              ['1', '/executive-coaching'],
              ['2', '/leader-development'],
              ['3', '/for-organizations'],
            ] as const).map(([n, href]) => (
              <div key={n} className="door-card">
                <h2 className="door-headline">{c[`doors.${n}.headline`]}</h2>
                <p className="door-body">{c[`doors.${n}.body`]}</p>
                <a href={href} className="door-link">{c[`doors.${n}.link`]}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3. HOW IT WORKS ===== */}
      <section className="how-it-works">
        <div className="how-it-works-inner">
          <div>
            <h2 className="how-headline">{c['how.heading']}</h2>
          </div>
          <div className="how-steps">
            {(['1', '2', '3'] as const).map(n => (
              <div key={n} className="how-step">
                <div className="how-step-num">0{n}</div>
                <p className="how-step-text">{c[`how.step${n}`]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. WHAT CHANGES ===== */}
      <section className="whats-possible">
        <div className="whats-possible-inner">
          <h2 className="how-headline whats-possible-heading">{c['changes.heading']}</h2>
          <p className="whats-possible-text">{c['changes.body']}</p>
        </div>
      </section>

      {/* ===== 4b. SAMPLE ENGAGEMENTS (rotating preview) ===== */}
      {engagements.length > 0 && (
        <section className="engagements-feature">
          <div className="engagements-inner">
            <div className="engagements-head">
              <div className="how-label">{c['engagements.label']}</div>
              <a href="/sample-engagements" className="engagements-all">{c['engagements.link']}</a>
            </div>
            <Rotator
              label={c['engagements.label']}
              items={engagements.map((e, i) => ({
                key: String(i),
                words: words(e.title, e.result, e.context),
                node: (
                  <article className="engagement-card">
                    <div className="engagement-group">{e.group}</div>
                    <h3 className="engagement-title">{e.title}</h3>
                    <p className="engagement-result">{e.result}</p>
                    <div className="engagement-context">{e.context}</div>
                    <a href={e.href} className="engagement-link">{e.link}</a>
                  </article>
                ),
              }))}
            />
          </div>
        </section>
      )}

      {/* ===== 5. PHILOSOPHY ===== */}
      <section className="philosophy">
        <div className="philosophy-inner">
          <div>
          <div className="how-label philosophy-section-label">{c['approach.label']}</div>
          <h2 className="philosophy-headline">{c['approach.headline']}</h2>
          </div>
          <div className="philosophy-right">
            <p className="philosophy-pull">{c['approach.body']}</p>
            <a href="/the-8-pillars" className="philosophy-link">{c['approach.link']}</a>
          </div>
        </div>
      </section>

      {/* ===== 6. TESTIMONIAL ===== */}
      <section className="testimonial-section">
        <div className="testimonial-inner">
          <div className="testimonial-label">{c['testimonial.label']}</div>
          <Rotator
            label={c['testimonial.label']}
            items={testimonials.map((t, i) => ({
              key: String(i),
              words: words(t.quote),
              node: (
                <figure className="testimonial-item">
                  <blockquote className="testimonial-quote">{t.quote}</blockquote>
                  <figcaption className="testimonial-attribution">
                    <div className="testimonial-name">{t.name}</div>
                    {t.role && <div className="testimonial-role">{t.role}</div>}
                  </figcaption>
                </figure>
              ),
            }))}
          />
        </div>
      </section>

      {/* ===== 7. ABOUT STRIP ===== */}
      <section className="about-strip">
        <div className="about-strip-photo">
          <img src={c['guide.image']} alt="John McCracken" />
        </div>
        <div className="about-strip-content">
          <div className="about-strip-label">{c['guide.label']}</div>
          <p className="about-strip-body">{c['guide.body']}</p>
          <div className="about-strip-name">{c['guide.name']}</div>
          <div className="about-strip-credentials">{c['guide.credentials']}</div>
          <a href="/about" className="about-link">{c['guide.link']}</a>
        </div>
      </section>

      {/* ===== 8. CREDIBILITY STRIP ===== */}
      <section className="credibility">
        <div className="credibility-inner">
          <div>
            <h2 className="credibility-headline">{c['cred.line1']}<br />{c['cred.line2']}</h2>
            <p className="credibility-body">{c['cred.body']}</p>
            <div className="credibility-icf">
              <Image src="/images/icf-acc-badge.png" alt="ICF Associate Certified Coach (ACC) credential badge" width={140} height={140} />
              <Image src="/images/icf-member-badge.png" alt="ICF Member badge" width={140} height={140} />
            </div>
          </div>
          <div className="badges-list">
            {badges.filter(b => b.main).map((b, i) => (
              <div key={i} className="badge-row">
                <div className="badge-main">{b.main}</div>
                {b.detail && <div className="badge-detail">{b.detail}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 9. CLOSING CTA ===== */}
      <section className="closing-cta">
        <div className="closing-cta-inner">
          <h2 className="cta-headline">{c['closing.headline']}</h2>
          <div>
            <p className="cta-body">{c['closing.body']}</p>
            <ScheduleButton url={bookingUrl} className="btn-gold">
              Schedule a Free 15-Minute Call
            </ScheduleButton>
          </div>
        </div>
      </section>
    </>
  )
}
