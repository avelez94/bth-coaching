import { createClient } from '@supabase/supabase-js'
import TestimonialSlider from '../../components/TestimonialSlider'

export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getData() {
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  return (data || []) as Array<{ id: string; name: string; role: string; company: string; quote: string }>
}

export default async function TransitionCoaching() {
  const testimonials = await getData()

  // Billy (sort_order 2) and Matt (sort_order 3) are most relevant here.
  // Filter to those two; fall back to all if sort_order filtering
  // isn't reliable yet.
  const displayTestimonials = testimonials.filter(t =>
    t.name === 'Billy D.' || t.name === 'Matt'
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');

        :root {
          --ivory: #F7F4ED;
          --ivory-dark: #EDE8DC;
          --slate: #4C78A0;
          --slate-mid: #3A607F;
          --slate-light: #6B9ABF;
          --navy: #0D1B2A;
          --gold: #C9A23A;
          --text: #1C2B3A;
          --text-mid: #3D5166;
          --text-muted: #6B7A8D;
          --rule: rgba(28,43,58,0.1);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--ivory); color: var(--text); font-family: 'Inter', sans-serif; font-weight: 300; overflow-x: hidden; -webkit-font-smoothing: antialiased; }

        .btn { display: inline-flex; align-items: center; gap: 9px; padding: 13px 28px; font-size: 0.72rem; letter-spacing: 0.07em; text-transform: uppercase; text-decoration: none; transition: all 0.22s ease; font-weight: 500; cursor: pointer; border: none; font-family: 'Inter', sans-serif; white-space: nowrap; }
        .btn-navy { background: var(--navy); color: var(--ivory); }
        .btn-navy:hover { background: var(--slate-mid); }
        .btn-outline { background: transparent; color: var(--text); border: 1px solid rgba(28,43,58,0.28); }
        .btn-outline:hover { background: var(--navy); color: var(--ivory); border-color: var(--navy); }
        .btn-outline-light { background: transparent; color: var(--ivory); border: 1px solid rgba(247,244,237,0.35); }
        .btn-outline-light:hover { background: rgba(247,244,237,0.1); }

        /* ============================================================
           HERO
           Ivory background — distinct from Executive Coaching's slate hero.
           Gives the page a quieter, more open opening.
           Page label, headline, subhead, single CTA.
        ============================================================ */
        .hero {
          background: var(--ivory);
          padding: 160px 72px 100px;
        }
        .hero-inner { max-width: 760px; }

        .hero-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(36px, 4.2vw, 54px);
          font-weight: 400;
          line-height: 1.15;
          color: var(--text);
          margin-bottom: 28px;
          letter-spacing: -0.01em;
        }
        .hero-subhead {
          font-size: 1rem;
          line-height: 1.82;
          color: var(--text-mid);
          margin-bottom: 40px;
          max-width: 580px;
          font-weight: 300;
        }

        /* ============================================================
           TRANSITION CHALLENGE
           Slate blue background — emotional weight section.
           Single column, generous top padding.
           Lets John's copy breathe without visual competition.
        ============================================================ */
        .transition-challenge {
          background: var(--slate);
          padding: 100px 72px;
        }
        .transition-challenge-inner { max-width: 720px; margin: 0 auto; }
        .section-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(26px, 3vw, 38px);
          font-weight: 400;
          line-height: 1.22;
          color: var(--ivory);
          margin-bottom: 36px;
          letter-spacing: -0.01em;
        }
        .body-light {
          font-size: 0.97rem;
          line-height: 1.88;
          color: rgba(247,244,237,0.75);
          margin-bottom: 20px;
          font-weight: 300;
        }
        .body-light:last-child { margin-bottom: 0; }

        /* ============================================================
           AUTUMN PATH PHOTO
           Editorial visual break between challenge and personal story.
           Full width, constrained height. object-position preserves
           the path depth and canopy — not cropped to destruction.
        ============================================================ */
        .path-photo-break {
          line-height: 0;
          overflow: hidden;
        }
        .path-photo-img {
          width: 100%;
          height: 420px;
          object-fit: cover;
          object-position: center 40%;
          display: block;
        }

        /* ============================================================
           JOHN'S PERSONAL STORY
           Ivory dark. John speaking directly in first person.
           Pull quote treatment for the most resonant line.
           Not a testimonial — this is John's own transition experience.
        ============================================================ */
        .personal-story {
          background: var(--ivory-dark);
          padding: 100px 72px;
        }
        .personal-story-inner { max-width: 720px; margin: 0 auto; }
        .body-text {
          font-size: 0.97rem;
          line-height: 1.88;
          color: var(--text-mid);
          margin-bottom: 20px;
          font-weight: 300;
        }
        .body-text:last-child { margin-bottom: 0; }


        /* ============================================================
           WHAT WE WORK ON
           Ivory. Five numbered items — more than Executive Coaching's four.
           Same asymmetric grid: num left, title + body right.
           Slightly more spacious padding to reflect the reflective tone.
        ============================================================ */
        .work-on {
          background: var(--ivory);
          padding: 100px 72px;
          border-top: 1px solid var(--rule);
        }
        .work-on-inner { max-width: 1100px; margin: 0 auto; }
        .work-on-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.8vw, 34px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 64px;
          letter-spacing: -0.01em;
        }
        .work-items { display: flex; flex-direction: column; }
        .work-item {
          display: grid;
          grid-template-columns: 64px 1fr;
          gap: 32px;
          padding: 36px 0;
          border-top: 1px solid var(--rule);
          align-items: start;
        }
        .work-item:last-child { border-bottom: 1px solid var(--rule); }
        .work-num {
          font-size: 0.72rem;
          color: var(--slate-mid);
          font-weight: 500;
          letter-spacing: 0.06em;
          padding-top: 4px;
        }
        .work-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.15rem;
          font-weight: 400;
          color: var(--text);
          margin-bottom: 12px;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }
        .work-body {
          font-size: 0.9rem;
          line-height: 1.82;
          color: var(--text-muted);
          max-width: 600px;
        }

        /* ============================================================
           TESTIMONIALS
           Slate. Uses the TestimonialSlider component with Billy and Matt.
           Same quiet editorial treatment as homepage.
        ============================================================ */
        .testimonial-section {
          background: var(--slate);
          padding: 100px 72px;
        }
        .testimonial-inner { max-width: 860px; margin: 0 auto; }
        .testimonial-label {
          font-size: 0.72rem;
          color: rgba(247,244,237,0.45);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 48px;
          font-weight: 400;
        }

        /* ============================================================
           ENGAGEMENT
           Ivory dark. Two-column layout.
           Left: label, headline, timeline note, CTA.
           Right: engagement details as typographic list + investment.
        ============================================================ */
        .engagement {
          background: var(--ivory-dark);
          padding: 100px 72px;
          border-top: 1px solid var(--rule);
        }
        .engagement-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }
        .engagement-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 20px;
          font-weight: 500;
        }
        .engagement-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 2.5vw, 32px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 20px;
          letter-spacing: -0.01em;
          line-height: 1.25;
        }
        .engagement-note {
          font-size: 0.9rem;
          line-height: 1.78;
          color: var(--text-mid);
          margin-bottom: 32px;
          font-weight: 300;
        }
        .engagement-details { display: flex; flex-direction: column; }
        .engagement-detail-item {
          padding: 14px 0;
          border-bottom: 1px solid var(--rule);
          font-size: 0.88rem;
          line-height: 1.65;
          color: var(--text-mid);
        }
        .engagement-detail-item:first-child { border-top: 1px solid var(--rule); }
        .investment-block {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--rule);
        }
        .investment-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 8px;
          font-weight: 500;
        }
        .investment-amount {
          font-family: 'DM Serif Display', serif;
          font-size: 2rem;
          font-weight: 400;
          color: var(--slate-mid);
          line-height: 1;
          margin-bottom: 6px;
        }
        .investment-note {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        /* ============================================================
           CLOSING
           Ivory. Quieter than navy — matches the page's overall tone.
           John's closing headline + CTA.
        ============================================================ */
        .closing {
          background: var(--ivory);
          padding: 100px 72px;
          border-top: 1px solid var(--rule);
        }
        .closing-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .closing-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 3vw, 38px);
          font-weight: 400;
          line-height: 1.22;
          color: var(--text);
          letter-spacing: -0.01em;
        }

        /* ============================================================
           RESPONSIVE
        ============================================================ */
        @media (max-width: 1024px) {
          .hero { padding: 140px 48px 80px; }
          .transition-challenge { padding: 80px 48px; }
          .path-photo-img { height: 320px; }
          .personal-story { padding: 80px 48px; }
          .work-on { padding: 80px 48px; }
          .testimonial-section { padding: 80px 48px; }
          .engagement { padding: 80px 48px; }
          .engagement-inner { grid-template-columns: 1fr; gap: 48px; }
          .closing { padding: 80px 48px; }
          .closing-inner { grid-template-columns: 1fr; gap: 40px; }
        }
        @media (max-width: 640px) {
          .hero { padding: 120px 24px 64px; }
          .transition-challenge { padding: 64px 24px; }
          .path-photo-img { height: 240px; object-position: center 30%; }
          .personal-story { padding: 64px 24px; }
          .work-on { padding: 64px 24px; }
          .work-item { grid-template-columns: 48px 1fr; gap: 16px; }
          .testimonial-section { padding: 64px 24px; }
          .engagement { padding: 64px 24px; }
          .closing { padding: 64px 24px; }
        }
      `}</style>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-headline">
            You've built something remarkable.<br />
            Now let's make sure the next chapter is worthy of it.
          </h1>
          <p className="hero-subhead">Structured coaching for military and federal professionals navigating what comes next — the career questions, the identity questions, and the life questions that major transitions always surface.</p>
          <a href="/contact" className="btn btn-navy">Schedule a Discovery Call</a>
        </div>
      </section>

      {/* ===== TRANSITION CHALLENGE ===== */}
      <section className="transition-challenge">
        <div className="transition-challenge-inner">
          <h2 className="section-headline">The transition is harder than most people admit.</h2>
          <p className="body-light">You've spent 20, 25, 30 years building a career most people can't fully understand. You've led under pressure, made decisions with real consequences, built skills that translate into almost any environment.</p>
          <p className="body-light">And yet — the transition is genuinely hard.</p>
          <p className="body-light">Not because you're not capable. Because it asks questions your career never made you answer: Who am I when I'm not in uniform? What do I actually want the next chapter to look like? How do I describe what I've done in language this world understands and values?</p>
          <p className="body-light">These aren't resume questions. They're whole-person questions. And they deserve a whole-person answer.</p>
        </div>
      </section>

      {/* ===== AUTUMN PATH PHOTO ===== */}
      <div className="path-photo-break">
        <img
          src="/images/bth-woodland-path.jpg"
          alt=""
          aria-hidden="true"
          className="path-photo-img"
        />
      </div>

      {/* ===== JOHN'S PERSONAL STORY ===== */}
      <section className="personal-story">
        <div className="personal-story-inner">
          <p className="body-text">Despite hearing the stories of how challenging the military-to-civilian transition could be, I expected my transition to be relatively straightforward. Given my extensive shore duty and time in the Pentagon at the end of my career, I expected the transition to essentially mean finding a job and showing up to work in civilian attire instead of a uniform. It ended up being far more impactful than that. The loss of community, defining who I was out of uniform, the loss of working with people I'd built relationships with over years, and the loss of a professional reputation in my field ended up being harder than I expected. Even transitioning into a federal position within the Department of Defense didn't mitigate the challenge the way I expected it would.</p>
          <p className="body-text">Eventually, I regained my footing by reconnecting with the values, methods, and practices that made me successful in the first place, and I learned to apply my extensive skills in a new way, for a different audience, to achieve the outcomes I was familiar with. Having a coach to help guide the process was exceptionally helpful.</p>
          <p className="body-text">I'd like to pay that experience forward and help you make your transition a rewarding, positive, growth-filled process.</p>

        </div>
      </section>

      {/* ===== WHAT WE WORK ON ===== */}
      <section className="work-on">
        <div className="work-on-inner">
          <h2 className="work-on-heading">What we work on.</h2>
          <div className="work-items">
            {[
              {
                num: '01',
                title: 'Identity & Purpose',
                body: 'Separating who you are from what you did — and getting clear on what the next chapter is actually for. Most transition resources skip this entirely. It\'s where we start.',
              },
              {
                num: '02',
                title: 'Skills Translation',
                body: 'Articulating complex leadership and operational experience in language civilian employers, clients, and partners understand and value. Not dumbing down — honest translation of genuinely impressive work.',
              },
              {
                num: '03',
                title: 'Life Integration',
                body: 'Transitions ripple through family dynamics, financial planning, daily structure, and sense of community. Coaching that ignores those dimensions misses where much of the real adjustment is actually happening.',
              },
              {
                num: '04',
                title: 'Career Navigation',
                body: 'Mapping realistic pathways and making decisions from clarity rather than urgency. Transition timelines create pressure toward reactive choices. Coaching slows that down in the right way.',
              },
              {
                num: '05',
                title: 'Leadership Continuity',
                body: 'What made you effective in uniform carries forward. The question is which parts translate directly, which need adjustment, and which need to be consciously updated for a new context and culture.',
              },
            ].map((item, i) => (
              <div key={i} className="work-item">
                <div className="work-num">{item.num}</div>
                <div>
                  <div className="work-title">{item.title}</div>
                  <p className="work-body">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      {displayTestimonials.length > 0 && (
        <section className="testimonial-section">
          <div className="testimonial-inner">
            <div className="testimonial-label">What clients say</div>
            <TestimonialSlider testimonials={displayTestimonials} />
          </div>
        </section>
      )}

      {/* ===== ENGAGEMENT ===== */}
      <section className="engagement">
        <div className="engagement-inner">
          <div>
            <div className="engagement-label">The engagement</div>
            <h2 className="engagement-headline">Your Timeline. Your Agenda.</h2>
            <p className="engagement-note">Three months minimum, twelve or more when that serves you better. It's never too early to start the conversation — frankly, more time consistently leads to better outcomes.</p>
            <a href="/contact" className="btn btn-navy">Schedule a Free Intro Call</a>
          </div>
          <div>
            <div className="engagement-details">
              {[
                'The Five-Part Roadmap — designed to work alongside official military transition programs, or independently',
                '8 Pillars whole-person assessment in opening sessions',
                'Values and goals exploration',
                'Session-by-session commitments — defined by you',
                'Between-session accountability via email or text',
                'Final session: integration, reflection, and forward planning',
              ].map((item, i) => (
                <div key={i} className="engagement-detail-item">{item}</div>
              ))}
            </div>
            <div className="investment-block">
              <div className="investment-label">Investment</div>
              <div className="investment-amount">$600/month</div>
              <div className="investment-note">Scaled to your transition horizon.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CLOSING ===== */}
      <section className="closing">
        <div className="closing-inner">
          <h2 className="closing-headline">You've served. Now let's make sure the next chapter reflects everything you've built, and everything you want to be.</h2>
          <div>
            <a href="/contact" className="btn btn-navy">Schedule a Free Intro Call</a>
          </div>
        </div>
      </section>
    </>
  )
}