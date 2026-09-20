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
          --rule-light: rgba(247,244,237,0.12);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--ivory); color: var(--text); font-family: 'Inter', sans-serif; font-weight: 300; overflow-x: hidden; -webkit-font-smoothing: antialiased; }

        .btn { display: inline-flex; align-items: center; gap: 9px; padding: 13px 28px; font-size: 0.72rem; letter-spacing: 0.07em; text-transform: uppercase; text-decoration: none; transition: all 0.22s ease; font-weight: 500; cursor: pointer; border: none; font-family: 'Inter', sans-serif; white-space: nowrap; }
        .btn-navy { background: var(--navy); color: var(--ivory); }
        .btn-navy:hover { background: var(--slate-mid); }

        /* ============================================================
           1. HERO
           Ivory. Quiet context label above headline.
           Wide asymmetric composition — headline spans canvas,
           subhead offset lower-right, CTA follows subhead.
        ============================================================ */
        .hero {
          background: var(--ivory);
          padding: 160px 72px 100px;
        }
        .hero-inner { max-width: 1200px; }
        .hero-context {
          font-size: 0.78rem;
          color: var(--text-muted);
          letter-spacing: 0.04em;
          margin-bottom: 24px;
          font-weight: 400;
        }
        .hero-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(34px, 4.2vw, 58px);
          font-weight: 400;
          line-height: 1.12;
          color: var(--text);
          letter-spacing: -0.02em;
          max-width: 900px;
          margin-bottom: 0;
        }
        .hero-subhead {
          font-size: 1rem;
          line-height: 1.82;
          color: var(--text-mid);
          margin-top: 40px;
          margin-left: auto;
          max-width: 500px;
          font-weight: 300;
          margin-bottom: 28px;
        }
        .hero-cta { margin-left: auto; max-width: 500px; }

        /* ============================================================
           2. TRANSITION CHALLENGE
           Slate. Asymmetric: headline wider left, body offset right.
           First body paragraph slightly elevated.
        ============================================================ */
        .transition-challenge {
          background: var(--slate);
          padding: 100px 72px;
        }
        .challenge-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 5fr 7fr;
          gap: 72px;
          align-items: start;
        }
        .challenge-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.8vw, 36px);
          font-weight: 400;
          line-height: 1.22;
          color: var(--ivory);
          letter-spacing: -0.01em;
        }
        .challenge-body-col { padding-top: 6px; }
        .body-light-lead {
          font-size: 1.02rem;
          line-height: 1.85;
          color: rgba(247,244,237,0.82);
          margin-bottom: 20px;
          font-weight: 300;
        }
        .body-light {
          font-size: 0.97rem;
          line-height: 1.88;
          color: rgba(247,244,237,0.72);
          margin-bottom: 20px;
          font-weight: 300;
        }
        .body-light:last-child { margin-bottom: 0; }

        /* ============================================================
           3. FOREST PHOTOGRAPH
           Full-width. Taller presence on desktop.
           object-position favors path depth and canopy.
        ============================================================ */
        .path-photo-break { line-height: 0; overflow: hidden; }
        .path-photo-img {
          width: 100%;
          height: clamp(380px, 40vw, 580px);
          object-fit: cover;
          object-position: center 35%;
          display: block;
        }

        /* ============================================================
           4. JOHN'S PERSONAL STORY
           Ivory dark. Reading column, generous arrival padding.
           Final paragraph — direct invitation — slightly deeper color.
        ============================================================ */
        .personal-story {
          background: var(--ivory-dark);
          padding: 140px 72px 100px;
        }
        .personal-story-inner { max-width: 720px; margin: 0 auto; }
        .body-text {
          font-size: 0.97rem;
          line-height: 1.92;
          color: var(--text-mid);
          margin-bottom: 24px;
          font-weight: 300;
        }
        /* Final invitation paragraph — resolution */
        .body-text-resolution {
          font-size: 0.97rem;
          line-height: 1.92;
          color: var(--text);
          margin-top: 36px;
          font-weight: 300;
        }

        /* ============================================================
           5. WHAT WE WORK ON
           Ivory. Five areas as an editorial spatial field.
           Items alternate across the canvas with horizontal and vertical
           offsets — not a grid, not a checkerboard.
           Numbers are quiet editorial anchors, not step indicators.
           Each item: number → title → description, full text visible.
        ============================================================ */
        .work-on {
          background: var(--ivory);
          padding: 100px 72px;
          border-top: 1px solid var(--rule);
        }
        .work-on-inner { max-width: 1200px; margin: 0 auto; }
        .work-on-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.8vw, 34px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 80px;
          letter-spacing: -0.01em;
        }

        /* Desktop: spatial editorial field */
        .work-field { display: block; }
        .work-entry {
          padding-bottom: 72px;
          position: relative;
        }
        /* Each entry has its own horizontal position and max-width */
        .work-entry-1 { margin-left: 0;          max-width: 520px; }
        .work-entry-2 { margin-left: 28%;         max-width: 480px; }
        .work-entry-3 { margin-left: 8%;          max-width: 500px; }
        .work-entry-4 { margin-left: 36%;         max-width: 460px; }
        .work-entry-5 { margin-left: 16%;         max-width: 500px; padding-bottom: 0; }
        /* Thin rule only above entries 2 through 5 */
        .work-entry-2,
        .work-entry-3,
        .work-entry-4,
        .work-entry-5 {
          padding-top: 0;
        }
        .work-num {
          font-size: 0.65rem;
          color: var(--slate-mid);
          font-weight: 500;
          letter-spacing: 0.06em;
          margin-bottom: 10px;
        }
        .work-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(18px, 1.9vw, 24px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 14px;
          letter-spacing: -0.01em;
          line-height: 1.25;
        }
        .work-body {
          font-size: 0.93rem;
          line-height: 1.82;
          color: var(--text-mid);
          font-weight: 300;
        }

        /* Mobile: single column, full descriptions */
        .work-field-mobile { display: none; }
        .work-mobile-item {
          padding: 32px 0;
          border-bottom: 1px solid var(--rule);
        }
        .work-mobile-item:first-child { border-top: 1px solid var(--rule); }
        .work-mobile-num { font-size: 0.65rem; color: var(--slate-mid); letter-spacing: 0.06em; margin-bottom: 8px; font-weight: 500; }
        .work-mobile-title { font-family: 'DM Serif Display', serif; font-size: 1.1rem; color: var(--text); margin-bottom: 10px; letter-spacing: -0.01em; line-height: 1.3; }
        .work-mobile-body { font-size: 0.9rem; line-height: 1.8; color: var(--text-mid); font-weight: 300; }

        /* ============================================================
           6. TESTIMONIALS
           Slate. Warmer label treatment.
        ============================================================ */
        .testimonial-section { background: var(--slate); padding: 100px 72px; }
        .testimonial-inner { max-width: 860px; margin: 0 auto; }
        .testimonial-label {
          font-size: 0.82rem;
          color: rgba(247,244,237,0.5);
          letter-spacing: 0.03em;
          margin-bottom: 48px;
          font-weight: 400;
        }

        /* ============================================================
           7. ENGAGEMENT
           Ivory dark. Two-column preserved.
           Details more readable. Engagement note given more weight.
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
        .engagement-context {
          font-size: 0.78rem;
          color: var(--text-muted);
          letter-spacing: 0.03em;
          font-weight: 500;
          text-transform: uppercase;
          margin-bottom: 16px;
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
          font-size: 0.95rem;
          line-height: 1.78;
          color: var(--text-mid);
          margin-bottom: 36px;
          font-weight: 300;
        }
        .engagement-details { display: flex; flex-direction: column; }
        .engagement-detail-item {
          padding: 18px 0;
          border-bottom: 1px solid var(--rule);
          font-size: 0.93rem;
          line-height: 1.7;
          color: var(--text-mid);
          font-weight: 300;
        }
        .engagement-detail-item:first-child { border-top: 1px solid var(--rule); }
        .investment-block {
          margin-top: 36px;
          padding-top: 28px;
          border-top: 1px solid var(--rule);
        }
        .investment-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 10px;
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
           8. CLOSING
           Ivory. Long headline given most of the canvas.
           CTA sits lower and to the right — unhurried arrival.
           Quieter and more personal than Executive Coaching's close.
        ============================================================ */
        .closing {
          background: var(--ivory);
          padding: 100px 72px;
          border-top: 1px solid var(--rule);
        }
        .closing-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .closing-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.8vw, 38px);
          font-weight: 400;
          line-height: 1.22;
          color: var(--text);
          letter-spacing: -0.01em;
          max-width: 820px;
          margin-bottom: 0;
        }
        /* CTA sits below the headline, pulled toward the right */
        .closing-cta {
          margin-top: 48px;
          margin-left: auto;
          max-width: 320px;
          display: flex;
          justify-content: flex-start;
        }

        /* ============================================================
           RESPONSIVE
        ============================================================ */
        @media (max-width: 1100px) {
          .work-entry-2 { margin-left: 18%; }
          .work-entry-4 { margin-left: 24%; }
        }
        @media (max-width: 1024px) {
          .hero { padding: 140px 48px 80px; }
          .hero-subhead { margin-left: 0; max-width: 100%; }
          .hero-cta { margin-left: 0; }
          .transition-challenge { padding: 80px 48px; }
          .challenge-inner { grid-template-columns: 1fr; gap: 36px; }
          .path-photo-img { height: 380px; }
          .personal-story { padding: 100px 48px 80px; }
          .work-on { padding: 80px 48px; }
          .work-entry-2 { margin-left: 12%; }
          .work-entry-3 { margin-left: 4%; }
          .work-entry-4 { margin-left: 18%; }
          .work-entry-5 { margin-left: 8%; }
          .testimonial-section { padding: 80px 48px; }
          .engagement { padding: 80px 48px; }
          .engagement-inner { grid-template-columns: 1fr; gap: 56px; }
          .closing { padding: 80px 48px; }
          .closing-cta { margin-left: 0; }
        }
        @media (max-width: 768px) {
          .work-field { display: none; }
          .work-field-mobile { display: flex; flex-direction: column; }
        }
        @media (max-width: 640px) {
          .hero { padding: 120px 24px 64px; }
          .transition-challenge { padding: 64px 24px; }
          .path-photo-img { height: 240px; object-position: center 30%; }
          .personal-story { padding: 80px 24px 64px; }
          .work-on { padding: 64px 24px; }
          .testimonial-section { padding: 64px 24px; }
          .engagement { padding: 64px 24px; }
          .closing { padding: 64px 24px; }
          .closing-cta { margin-top: 36px; max-width: 100%; }
        }
      `}</style>

      {/* ===== 1. HERO ===== */}
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-context">For Military & Federal Professionals in Transition</p>
          <h1 className="hero-headline">You've built something remarkable. Now let's make sure the next chapter is worthy of it.</h1>
          <p className="hero-subhead">Structured coaching for military and federal professionals navigating what comes next — the career questions, the identity questions, and the life questions that major transitions always surface.</p>
          <div className="hero-cta">
            <a href="/contact" className="btn btn-navy">Schedule a Discovery Call</a>
          </div>
        </div>
      </section>

      {/* ===== 2. TRANSITION CHALLENGE ===== */}
      <section className="transition-challenge">
        <div className="challenge-inner">
          <h2 className="challenge-headline">The transition is harder than most people admit.</h2>
          <div className="challenge-body-col">
            <p className="body-light-lead">You've spent 20, 25, 30 years building a career most people can't fully understand. You've led under pressure, made decisions with real consequences, built skills that translate into almost any environment.</p>
            <p className="body-light">And yet — the transition is genuinely hard.</p>
            <p className="body-light">Not because you're not capable. Because it asks questions your career never made you answer: Who am I when I'm not in uniform? What do I actually want the next chapter to look like? How do I describe what I've done in language this world understands and values?</p>
            <p className="body-light">These aren't resume questions. They're whole-person questions. And they deserve a whole-person answer.</p>
          </div>
        </div>
      </section>

      {/* ===== 3. FOREST PHOTOGRAPH ===== */}
      <div className="path-photo-break">
        <img
          src="/images/bth-woodland-path.jpg"
          alt=""
          aria-hidden="true"
          className="path-photo-img"
        />
      </div>

      {/* ===== 4. JOHN'S PERSONAL STORY ===== */}
      <section className="personal-story">
        <div className="personal-story-inner">
          <p className="body-text">Despite hearing the stories of how challenging the military-to-civilian transition could be, I expected my transition to be relatively straightforward. Given my extensive shore duty and time in the Pentagon at the end of my career, I expected the transition to essentially mean finding a job and showing up to work in civilian attire instead of a uniform. It ended up being far more impactful than that. The loss of community, defining who I was out of uniform, the loss of working with people I'd built relationships with over years, and the loss of a professional reputation in my field ended up being harder than I expected. Even transitioning into a federal position within the Department of Defense didn't mitigate the challenge the way I expected it would.</p>
          <p className="body-text">Eventually, I regained my footing by reconnecting with the values, methods, and practices that made me successful in the first place, and I learned to apply my extensive skills in a new way, for a different audience, to achieve the outcomes I was familiar with. Having a coach to help guide the process was exceptionally helpful.</p>
          <p className="body-text-resolution">I'd like to pay that experience forward and help you make your transition a rewarding, positive, growth-filled process.</p>
        </div>
      </section>

      {/* ===== 5. WHAT WE WORK ON ===== */}
      <section className="work-on">
        <div className="work-on-inner">
          <h2 className="work-on-heading">What we work on.</h2>

          {/* Desktop: spatial editorial field */}
          <div className="work-field">
            {[
              { num: '01', title: 'Identity & Purpose', body: "Separating who you are from what you did — and getting clear on what the next chapter is actually for. Most transition resources skip this entirely. It's where we start.", cls: 'work-entry-1' },
              { num: '02', title: 'Skills Translation', body: 'Articulating complex leadership and operational experience in language civilian employers, clients, and partners understand and value. Not dumbing down — honest translation of genuinely impressive work.', cls: 'work-entry-2' },
              { num: '03', title: 'Life Integration', body: 'Transitions ripple through family dynamics, financial planning, daily structure, and sense of community. Coaching that ignores those dimensions misses where much of the real adjustment is actually happening.', cls: 'work-entry-3' },
              { num: '04', title: 'Career Navigation', body: 'Mapping realistic pathways and making decisions from clarity rather than urgency. Transition timelines create pressure toward reactive choices. Coaching slows that down in the right way.', cls: 'work-entry-4' },
              { num: '05', title: 'Leadership Continuity', body: 'What made you effective in uniform carries forward. The question is which parts translate directly, which need adjustment, and which need to be consciously updated for a new context and culture.', cls: 'work-entry-5' },
            ].map((item, i) => (
              <div key={i} className={`work-entry ${item.cls}`}>
                <div className="work-num">{item.num}</div>
                <div className="work-title">{item.title}</div>
                <p className="work-body">{item.body}</p>
              </div>
            ))}
          </div>

          {/* Mobile: single column */}
          <div className="work-field-mobile">
            {[
              { num: '01', title: 'Identity & Purpose', body: "Separating who you are from what you did — and getting clear on what the next chapter is actually for. Most transition resources skip this entirely. It's where we start." },
              { num: '02', title: 'Skills Translation', body: 'Articulating complex leadership and operational experience in language civilian employers, clients, and partners understand and value. Not dumbing down — honest translation of genuinely impressive work.' },
              { num: '03', title: 'Life Integration', body: 'Transitions ripple through family dynamics, financial planning, daily structure, and sense of community. Coaching that ignores those dimensions misses where much of the real adjustment is actually happening.' },
              { num: '04', title: 'Career Navigation', body: 'Mapping realistic pathways and making decisions from clarity rather than urgency. Transition timelines create pressure toward reactive choices. Coaching slows that down in the right way.' },
              { num: '05', title: 'Leadership Continuity', body: 'What made you effective in uniform carries forward. The question is which parts translate directly, which need adjustment, and which need to be consciously updated for a new context and culture.' },
            ].map((item, i) => (
              <div key={i} className="work-mobile-item">
                <div className="work-mobile-num">{item.num}</div>
                <div className="work-mobile-title">{item.title}</div>
                <p className="work-mobile-body">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 6. TESTIMONIALS ===== */}
      {displayTestimonials.length > 0 && (
        <section className="testimonial-section">
          <div className="testimonial-inner">
            <div className="testimonial-label">What clients say</div>
            <TestimonialSlider testimonials={displayTestimonials} />
          </div>
        </section>
      )}

      {/* ===== 7. ENGAGEMENT ===== */}
      <section className="engagement">
        <div className="engagement-inner">
          <div>
            <p className="engagement-context">The engagement</p>
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

      {/* ===== 8. CLOSING ===== */}
      <section className="closing">
        <div className="closing-inner">
          <h2 className="closing-headline">You've served. Now let's make sure the next chapter reflects everything you've built, and everything you want to be.</h2>
          <div className="closing-cta">
            <a href="/contact" className="btn btn-navy">Schedule a Free Intro Call</a>
          </div>
        </div>
      </section>
    </>
  )
}