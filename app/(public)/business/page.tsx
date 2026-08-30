import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getPageContent() {
  const { data } = await supabase.from('pages').select('*').eq('slug', 'business').single()
  return data?.content || {}
}

export const revalidate = 0

export default async function BusinessCoaching() {
  const c = await getPageContent()
  const get = (key: string, fallback: string) => c[key] || fallback

  return (
    <>
      <style>{`
        :root {
          --navy: #0D1B2A; --navy-mid: #1A2E45; --slate: #4C78A0;
          --gold: #C9A23A; --gold-light: #D4B563;
          --ivory: #F7F4ED; --ivory-dark: #EDE8DC;
          --white: #FFFFFF; --text-body: #2C3E50; --text-muted: #6B7A8D;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--ivory); color: var(--navy); font-family: 'Inter', sans-serif; font-weight: 300; overflow-x: hidden; }
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .reveal.delay-1 { transition-delay: 0.1s; } .reveal.delay-2 { transition-delay: 0.2s; } .reveal.delay-3 { transition-delay: 0.3s; } .reveal.delay-4 { transition-delay: 0.4s; }
        .reveal.revealed { opacity: 1; transform: translateY(0); }

        /* HERO */
        .page-hero { min-height: 70vh; background: var(--navy); display: flex; align-items: center; position: relative; overflow: hidden; }
        .page-hero-bg { position: absolute; inset: 0; background: linear-gradient(135deg, var(--navy) 0%, #1A2E45 60%, #1B3A5C 100%); }
        .page-hero-pattern { position: absolute; inset: 0; opacity: 0.04; background-image: repeating-linear-gradient(45deg, var(--gold) 0, var(--gold) 1px, transparent 0, transparent 50%); background-size: 30px 30px; }
        .page-hero-line { position: absolute; left: 60px; top: 0; bottom: 0; width: 1px; background: linear-gradient(to bottom, transparent, rgba(201,162,58,0.3), transparent); }
        .page-hero-content { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; padding: 160px 60px 100px; width: 100%; }
        .breadcrumb { font-size: 0.68rem; color: rgba(247,244,237,0.4); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 32px; display: flex; align-items: center; gap: 10px; }
        .breadcrumb a { color: rgba(247,244,237,0.4); text-decoration: none; transition: color 0.2s; }
        .breadcrumb a:hover { color: var(--gold); }
        .breadcrumb-sep { opacity: 0.3; }
        .page-eyebrow { font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .page-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--gold); }
        .page-hero-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(48px, 7vw, 88px); font-weight: 600; line-height: 1.02; color: var(--white); margin-bottom: 24px; max-width: 800px; }
        .page-hero-title em { font-style: italic; color: var(--gold); }
        .page-hero-desc { font-size: 1.05rem; line-height: 1.8; color: rgba(247,244,237,0.65); max-width: 580px; margin-bottom: 44px; }
        .btn { display: inline-flex; align-items: center; gap: 10px; padding: 16px 36px; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: all 0.3s; font-weight: 500; }
        .btn-gold { background: var(--gold); color: var(--navy); }
        .btn-gold:hover { background: var(--gold-light); transform: translateY(-2px); }
        .btn-navy { background: var(--navy); color: var(--ivory); }
        .btn-navy:hover { background: var(--navy-mid); transform: translateY(-2px); }
        .btn-outline-light { background: transparent; color: var(--ivory); border: 1px solid rgba(247,244,237,0.25); }
        .btn-outline-light:hover { border-color: var(--gold); color: var(--gold); }
        .hero-btns { display: flex; gap: 16px; flex-wrap: wrap; }

        /* INTRO */
        .intro { padding: 100px 60px; background: var(--ivory); }
        .intro-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
        .eyebrow { font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
        .section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 4vw, 52px); font-weight: 600; line-height: 1.08; color: var(--navy); margin-bottom: 24px; }
        .section-title em { font-style: italic; color: var(--slate); }
        .body-text { font-size: 0.95rem; line-height: 1.85; color: var(--text-body); margin-bottom: 20px; }
        .intro-right { padding-top: 16px; }
        .stat-row { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin-bottom: 32px; }
        .stat-box { background: white; border: 1px solid rgba(13,27,42,0.08); padding: 28px 24px; }
        .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 2.4rem; font-weight: 700; color: var(--gold); line-height: 1; margin-bottom: 6px; }
        .stat-label { font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; }

        /* OFFERINGS */
        .offerings { padding: 100px 60px; background: var(--navy); }
        .offerings-inner { max-width: 1200px; margin: 0 auto; }
        .offerings-header { margin-bottom: 64px; }
        .eyebrow-light { font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .eyebrow-light::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
        .section-title-light { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 4vw, 52px); font-weight: 600; line-height: 1.08; color: var(--white); }
        .section-title-light em { font-style: italic; color: var(--gold); }
        .offerings-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
        .offering-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); padding: 40px 32px; transition: all 0.4s; position: relative; overflow: hidden; }
        .offering-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 0; background: var(--gold); transition: width 0.3s; }
        .offering-card:hover::before { width: 3px; }
        .offering-card:hover { background: rgba(201,162,58,0.06); border-color: rgba(201,162,58,0.2); transform: translateY(-4px); }
        .offering-num { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 700; color: rgba(201,162,58,0.15); margin-bottom: 16px; line-height: 1; }
        .offering-name { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600; color: var(--white); margin-bottom: 12px; }
        .offering-desc { font-size: 0.87rem; line-height: 1.75; color: rgba(247,244,237,0.5); }

        /* WHO */
        .who { padding: 100px 60px; background: var(--ivory-dark); }
        .who-inner { max-width: 1200px; margin: 0 auto; }
        .who-header { text-align: center; margin-bottom: 64px; }
        .who-header .eyebrow { justify-content: center; }
        .who-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .who-card { background: var(--white); padding: 36px 28px; border-bottom: 3px solid transparent; transition: all 0.4s; }
        .who-card:hover { border-bottom-color: var(--gold); transform: translateY(-6px); box-shadow: 0 16px 48px rgba(13,27,42,0.08); }
        .who-icon { width: 48px; height: 48px; background: var(--navy); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; font-size: 1.2rem; transition: background 0.3s; }
        .who-card:hover .who-icon { background: var(--gold); }
        .who-title { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 600; color: var(--navy); margin-bottom: 10px; }
        .who-desc { font-size: 0.86rem; line-height: 1.7; color: var(--text-muted); }

        /* PROCESS */
        .process { padding: 100px 60px; background: var(--ivory); }
        .process-inner { max-width: 1200px; margin: 0 auto; }
        .process-header { margin-bottom: 64px; }
        .process-steps { display: flex; flex-direction: column; gap: 2px; }
        .process-step { background: white; border: 1px solid rgba(13,27,42,0.08); padding: 32px 40px; display: grid; grid-template-columns: auto 1fr; gap: 32px; align-items: start; transition: border-color 0.3s; }
        .process-step:hover { border-color: rgba(201,162,58,0.3); }
        .step-num { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 700; color: rgba(201,162,58,0.25); line-height: 1; min-width: 48px; }
        .step-content h4 { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600; color: var(--navy); margin-bottom: 8px; }
        .step-content p { font-size: 0.88rem; line-height: 1.75; color: var(--text-muted); }

        /* CTA */
        .cta-section { padding: 120px 60px; background: var(--navy); }
        .cta-inner { max-width: 700px; margin: 0 auto; text-align: center; }
        .cta-inner .eyebrow-light { justify-content: center; }
        .cta-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(40px, 6vw, 64px); font-weight: 600; line-height: 1.05; color: var(--white); margin-bottom: 20px; }
        .cta-title em { font-style: italic; color: var(--gold); }
        .cta-desc { font-size: 1rem; line-height: 1.8; color: rgba(247,244,237,0.6); margin-bottom: 40px; }
        .cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

        @media (max-width: 900px) {
          .page-hero-content { padding: 140px 24px 80px; }
          .page-hero-title { font-size: clamp(40px, 9vw, 64px); }
          .intro { padding: 72px 24px; }
          .intro-inner { grid-template-columns: 1fr; gap: 48px; }
          .offerings { padding: 72px 24px; }
          .offerings-grid { grid-template-columns: 1fr; }
          .who { padding: 72px 24px; }
          .who-grid { grid-template-columns: 1fr; }
          .process { padding: 72px 24px; }
          .process-step { grid-template-columns: auto 1fr; gap: 20px; padding: 24px; }
          .cta-section { padding: 80px 24px; }
          .stat-row { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 540px) {
          .hero-btns { flex-direction: column; }
          .cta-btns { flex-direction: column; align-items: center; }
          .cta-btns .btn { width: 100%; justify-content: center; }
          .stat-row { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* HERO */}
      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-pattern" />
        <div className="page-hero-line" />
        <div className="page-hero-content">
          <div className="breadcrumb">
            <a href="/">Home</a>
            <span className="breadcrumb-sep">→</span>
            <span>Business Coaching</span>
          </div>
          <div className="page-eyebrow">For Organizations and Teams</div>
          <h1 className="page-hero-title">{get('headline', 'Coaching that moves')}<br /><em>{get('headline_accent', 'your business forward.')}</em></h1>
          <p className="page-hero-desc">{get('subheadline', 'Strategic coaching for executives, leadership teams, and organizations navigating change, growth, and transformation. Built on decades of real leadership experience.')}</p>
          <div className="hero-btns">
            <a href="/contact" className="btn btn-gold">Schedule a Consultation →</a>
            <a href="#offerings" className="btn btn-outline-light">View Offerings →</a>
          </div>
        </div>
      </div>

      {/* INTRO */}
      <section className="intro">
        <div className="intro-inner">
          <div className="intro-left">
            <div className="eyebrow reveal">Why Business Coaching</div>
            <h2 className="section-title reveal delay-1">The right guidance<br /><em>at the right time.</em></h2>
            <p className="body-text reveal delay-2">Most leadership challenges are not about strategy — they are about execution, alignment, and the human dynamics that either drive or stall progress. Business coaching creates the conditions for your people and your organization to perform at their best.</p>
            <p className="body-text reveal delay-3">John McCracken brings over two decades of high-stakes leadership experience to every engagement. From commanding naval operations to building organizations in the private sector, he has led through complexity — and he brings that same clarity to his clients.</p>
          </div>
          <div className="intro-right reveal delay-2">
            <div className="stat-row">
              <div className="stat-box">
                <div className="stat-num">20+</div>
                <div className="stat-label">Years of leadership experience</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">ACC</div>
                <div className="stat-label">ICF certified executive coach</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">EMBA</div>
                <div className="stat-label">Executive MBA</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">CAPT</div>
                <div className="stat-label">Retired U.S. Navy Captain</div>
              </div>
            </div>
            <a href="/contact" className="btn btn-navy">Work with John →</a>
          </div>
        </div>
      </section>

      {/* OFFERINGS */}
      <section className="offerings" id="offerings">
        <div className="offerings-inner">
          <div className="offerings-header">
            <div className="eyebrow-light reveal">What I Offer</div>
            <h2 className="section-title-light reveal delay-1">Business coaching <em>programs.</em></h2>
          </div>
          <div className="offerings-grid">
            {[
              { num: '01', name: 'Executive Coaching', desc: 'One on one coaching for C-suite and senior leaders. Develop your leadership identity, sharpen decision making, and build the executive presence your role demands.' },
              { num: '02', name: 'Leadership Team Alignment', desc: 'Coaching for leadership teams to improve communication, resolve tension, and move forward with shared clarity and purpose. Highly effective for teams in transition.' },
              { num: '03', name: 'Organizational Transformation', desc: 'Engagements designed to help organizations navigate change — mergers, restructuring, culture shifts, or rapid growth. Strategy meets human behavior.' },
              { num: '04', name: 'New Leader Onboarding', desc: 'Accelerate the success of newly promoted or newly hired leaders. Build confidence, establish credibility, and set a clear direction in the first 90 days.' },
              { num: '05', name: 'High Performance Teams', desc: 'Build the foundations of a high performing team — clear roles, accountability systems, psychological safety, and a culture of continuous improvement.' },
              { num: '06', name: 'Strategic Advisory', desc: 'Ongoing advisory relationships for founders and executives who want a trusted thinking partner to pressure test ideas and navigate complex decisions.' },
            ].map((o, i) => (
              <div key={i} className={`offering-card reveal delay-${(i % 3) + 1}`}>
                <div className="offering-num">{o.num}</div>
                <div className="offering-name">{o.name}</div>
                <p className="offering-desc">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO */}
      <section className="who">
        <div className="who-inner">
          <div className="who-header">
            <div className="eyebrow reveal">Who This Is For</div>
            <h2 className="section-title reveal delay-1">Business coaching works best for leaders who are <em>ready.</em></h2>
          </div>
          <div className="who-grid">
            {[
              { icon: '🏢', title: 'Executives and C-Suite', desc: 'Senior leaders who want to sharpen their edge, expand their impact, and lead at the highest level with clarity and confidence.' },
              { icon: '📈', title: 'Growing Businesses', desc: 'Founders and operators scaling their teams and organizations who need structure, accountability, and an outside perspective.' },
              { icon: '🔄', title: 'Teams in Transition', desc: 'Leadership teams navigating change — new ownership, restructuring, rapid growth, or cultural shifts that require alignment.' },
            ].map((w, i) => (
              <div key={i} className={`who-card reveal delay-${i + 1}`}>
                <div className="who-icon">{w.icon}</div>
                <div className="who-title">{w.title}</div>
                <p className="who-desc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="process">
        <div className="process-inner">
          <div className="process-header">
            <div className="eyebrow reveal">How It Works</div>
            <h2 className="section-title reveal delay-1">A structured path to <em>results.</em></h2>
          </div>
          <div className="process-steps">
            {[
              { title: 'Discovery Call', desc: 'We start with a no-obligation conversation to understand your situation, your goals, and whether working together is the right fit. No pressure. Just clarity.' },
              { title: 'Needs Assessment', desc: 'A deeper look at your organization, your leadership, and the specific challenges and opportunities in front of you. This shapes everything that follows.' },
              { title: 'Engagement Design', desc: 'We design a coaching engagement around your specific goals — the format, frequency, focus areas, and success metrics that are right for your situation.' },
              { title: 'Coaching and Accountability', desc: 'Regular sessions, real work, and the accountability structures that keep progress moving. This is where the transformation happens.' },
              { title: 'Measure and Adjust', desc: 'We track what matters, measure progress, and adjust the approach as needed. Results are the standard we hold ourselves to.' },
            ].map((s, i) => (
              <div key={i} className={`process-step reveal delay-${(i % 3) + 1}`}>
                <div className="step-num">0{i + 1}</div>
                <div className="step-content">
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <div className="eyebrow-light reveal">Get Started</div>
          <h2 className="cta-title reveal delay-1">Ready to invest in your <em>leadership?</em></h2>
          <p className="cta-desc reveal delay-2">The first step is a conversation. Schedule a complimentary discovery call and let's talk about what is possible.</p>
          <div className="cta-btns reveal delay-3">
            <a href="/contact" className="btn btn-gold">Schedule a Discovery Call →</a>
          </div>
        </div>
      </section>
    </>
  )
}