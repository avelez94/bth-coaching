import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getPageContent() {
  const { data } = await supabase.from('pages').select('*').eq('slug', 'individual').single()
  return data?.content || {}
}

export const revalidate = 0

export default async function IndividualCoaching() {
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

        .page-hero { min-height: 70vh; background: var(--slate); display: flex; align-items: center; position: relative; overflow: hidden; }
        .page-hero-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #1A2E45 0%, var(--slate) 60%, #3A6A94 100%); }
        .page-hero-pattern { position: absolute; inset: 0; opacity: 0.05; background-image: repeating-linear-gradient(45deg, var(--gold) 0, var(--gold) 1px, transparent 0, transparent 50%); background-size: 30px 30px; }
        .page-hero-content { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; padding: 160px 60px 100px; width: 100%; }
        .breadcrumb { font-size: 0.68rem; color: rgba(247,244,237,0.4); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 32px; display: flex; align-items: center; gap: 10px; }
        .breadcrumb a { color: rgba(247,244,237,0.4); text-decoration: none; transition: color 0.2s; }
        .breadcrumb a:hover { color: var(--gold); }
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

        .intro { padding: 100px 60px; background: var(--ivory); }
        .intro-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .eyebrow { font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
        .section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 4vw, 52px); font-weight: 600; line-height: 1.08; color: var(--navy); margin-bottom: 24px; }
        .section-title em { font-style: italic; color: var(--slate); }
        .body-text { font-size: 0.95rem; line-height: 1.85; color: var(--text-body); margin-bottom: 20px; }
        .quote-block { border-left: 3px solid var(--gold); padding: 24px 28px; background: white; margin: 32px 0; }
        .quote-text { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-style: italic; line-height: 1.6; color: var(--navy); }

        .programs { padding: 100px 60px; background: var(--ivory-dark); }
        .programs-inner { max-width: 1200px; margin: 0 auto; }
        .programs-header { margin-bottom: 64px; }
        .eyebrow-dark { font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .eyebrow-dark::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
        .programs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .program-card { background: var(--white); padding: 44px 36px; border-bottom: 3px solid transparent; transition: all 0.4s; }
        .program-card:hover { border-bottom-color: var(--gold); transform: translateY(-6px); box-shadow: 0 20px 60px rgba(13,27,42,0.08); }
        .program-tag { font-size: 0.65rem; color: var(--gold); letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; margin-bottom: 16px; }
        .program-name { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 600; color: var(--navy); margin-bottom: 14px; }
        .program-desc { font-size: 0.88rem; line-height: 1.75; color: var(--text-muted); margin-bottom: 24px; }
        .program-features { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .program-features li { font-size: 0.85rem; color: var(--text-body); display: flex; align-items: center; gap: 10px; }
        .program-features li::before { content: ''; width: 16px; height: 1px; background: var(--gold); flex-shrink: 0; }

        .outcomes { padding: 100px 60px; background: var(--navy); }
        .outcomes-inner { max-width: 1200px; margin: 0 auto; }
        .outcomes-header { margin-bottom: 64px; }
        .eyebrow-light { font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .eyebrow-light::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
        .section-title-light { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 4vw, 52px); font-weight: 600; line-height: 1.08; color: var(--white); }
        .section-title-light em { font-style: italic; color: var(--gold); }
        .outcomes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
        .outcome-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); padding: 36px 28px; transition: all 0.4s; }
        .outcome-card:hover { background: rgba(201,162,58,0.06); border-color: rgba(201,162,58,0.2); }
        .outcome-icon { font-size: 1.8rem; margin-bottom: 16px; }
        .outcome-title { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 600; color: var(--white); margin-bottom: 10px; }
        .outcome-desc { font-size: 0.86rem; line-height: 1.7; color: rgba(247,244,237,0.5); }

        .cta-section { padding: 120px 60px; background: var(--ivory); }
        .cta-inner { max-width: 700px; margin: 0 auto; text-align: center; }
        .cta-inner .eyebrow { justify-content: center; }
        .cta-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(40px, 6vw, 64px); font-weight: 600; line-height: 1.05; color: var(--navy); margin-bottom: 20px; }
        .cta-title em { font-style: italic; color: var(--gold); }
        .cta-desc { font-size: 1rem; line-height: 1.8; color: var(--text-muted); margin-bottom: 40px; }
        .cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

        @media (max-width: 900px) {
          .page-hero-content { padding: 140px 24px 80px; }
          .page-hero-title { font-size: clamp(40px, 9vw, 64px); }
          .intro { padding: 72px 24px; }
          .intro-inner { grid-template-columns: 1fr; gap: 48px; }
          .programs { padding: 72px 24px; }
          .programs-grid { grid-template-columns: 1fr; }
          .outcomes { padding: 72px 24px; }
          .outcomes-grid { grid-template-columns: 1fr; }
          .cta-section { padding: 80px 24px; }
        }
        @media (max-width: 540px) {
          .hero-btns { flex-direction: column; }
          .cta-btns { flex-direction: column; align-items: center; }
          .cta-btns .btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-pattern" />
        <div className="page-hero-content">
          <div className="breadcrumb">
            <a href="/">Home</a>
            <span>→</span>
            <span>Individual Coaching</span>
          </div>
          <div className="page-eyebrow">One on One Coaching</div>
          <h1 className="page-hero-title">{get('headline', 'Invest in the leader')}<br /><em>{get('headline_accent', 'you are becoming.')}</em></h1>
          <p className="page-hero-desc">{get('subheadline', 'Personalized coaching for professionals and leaders who are ready to grow, transition, or unlock the next level of their potential. Built around you.')}</p>
          <div className="hero-btns">
            <a href="/contact" className="btn btn-gold">Schedule a Consultation →</a>
            <a href="#programs" className="btn btn-outline-light">View Programs →</a>
          </div>
        </div>
      </div>

      <section className="intro">
        <div className="intro-inner">
          <div>
            <div className="eyebrow reveal">About Individual Coaching</div>
            <h2 className="section-title reveal delay-1">Coaching built around<br /><em>you.</em></h2>
            <p className="body-text reveal delay-2">Individual coaching is a deeply personal investment. It is not about following a script — it is about having a trusted thinking partner who challenges you, holds you accountable, and helps you see what you cannot see on your own.</p>
            <p className="body-text reveal delay-3">John brings the same discipline and strategic clarity that defined his naval career to every individual coaching relationship. The sessions are direct, practical, and always focused on what moves you forward.</p>
            <div className="quote-block reveal delay-4">
              <div className="quote-text">"The goal is not to become someone different. It is to become a more fully realized version of who you already are."</div>
            </div>
          </div>
          <div className="reveal delay-2">
            <div style={{background:'var(--navy)',padding:'48px 40px'}}>
              <div style={{fontFamily:"'Cormorant Garamond', serif",fontSize:'1.1rem',color:'rgba(247,244,237,0.5)',letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:32,fontWeight:500}}>What to expect</div>
              {[
                'A structured but flexible coaching relationship',
                'Sessions tailored to your goals and pace',
                'Direct, honest feedback without sugarcoating',
                'Accountability between sessions',
                'Tools and frameworks you can apply immediately',
                'A trusted thinking partner invested in your growth',
              ].map((item, i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:14,marginBottom:16,paddingBottom:16,borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                  <div style={{width:20,height:1,background:'var(--gold)',flexShrink:0}} />
                  <div style={{fontSize:'0.88rem',color:'rgba(247,244,237,0.65)',lineHeight:1.6}}>{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="programs" id="programs">
        <div className="programs-inner">
          <div className="programs-header">
            <div className="eyebrow-dark reveal">Coaching Programs</div>
            <h2 className="section-title reveal delay-1">Find the right <em>program for you.</em></h2>
          </div>
          <div className="programs-grid">
            {[
              {
                tag: 'Most Popular',
                name: 'Leadership Accelerator',
                desc: 'A focused 3-month engagement for professionals stepping into or growing within a leadership role. Build the foundation, confidence, and skills to lead effectively from day one.',
                features: ['Weekly 60-minute coaching sessions', 'Leadership assessment and debrief', 'Custom development plan', 'Accountability check-ins', 'Email support between sessions'],
              },
              {
                tag: 'Career Transition',
                name: 'Next Chapter Coaching',
                desc: 'For professionals navigating a career change, promotion, or major professional transition. Gain clarity on your direction and a concrete plan to get there.',
                features: ['Bi-weekly 60-minute sessions', 'Values and strengths assessment', 'Career clarity framework', 'Action planning and accountability', 'Resume and narrative review'],
              },
              {
                tag: 'Executive',
                name: 'Executive Presence',
                desc: 'A deep dive into the skills, mindset, and habits that define exceptional executives. Designed for senior leaders who want to operate at their highest level.',
                features: ['Monthly deep-dive sessions', '360 feedback integration', 'Communication and influence coaching', 'Strategic thinking frameworks', 'Ongoing advisory access'],
              },
              {
                tag: 'Ongoing',
                name: 'Ongoing Partnership',
                desc: 'A long-term coaching relationship for leaders who want consistent support, accountability, and a thinking partner as their career evolves. No fixed end date.',
                features: ['Flexible session frequency', 'Full access to all frameworks', 'Priority scheduling', 'Ad hoc support as needed', 'Annual progress review'],
              },
            ].map((p, i) => (
              <div key={i} className={`program-card reveal delay-${(i % 2) + 1}`}>
                <div className="program-tag">{p.tag}</div>
                <div className="program-name">{p.name}</div>
                <p className="program-desc">{p.desc}</p>
                <ul className="program-features">
                  {p.features.map((f, j) => <li key={j}>{f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="outcomes">
        <div className="outcomes-inner">
          <div className="outcomes-header">
            <div className="eyebrow-light reveal">What You Gain</div>
            <h2 className="section-title-light reveal delay-1">Real outcomes for <em>real leaders.</em></h2>
          </div>
          <div className="outcomes-grid">
            {[
              { icon: '🧭', title: 'Clarity', desc: 'Know exactly where you are going and why. Eliminate the noise and confusion that keeps you stuck.' },
              { icon: '⚡', title: 'Confidence', desc: 'Lead with conviction. Make decisions faster and with greater certainty in your own judgment.' },
              { icon: '🎯', title: 'Focus', desc: 'Identify what actually moves the needle and build the discipline to stay focused on what matters most.' },
              { icon: '🔗', title: 'Influence', desc: 'Communicate with greater impact, build stronger relationships, and lead others more effectively.' },
              { icon: '📈', title: 'Performance', desc: 'Consistently show up at your best and build the habits and systems that sustain high performance.' },
              { icon: '🌱', title: 'Growth', desc: 'Become the leader you know you are capable of being — and lay the foundation for continued growth.' },
            ].map((o, i) => (
              <div key={i} className={`outcome-card reveal delay-${(i % 3) + 1}`}>
                <div className="outcome-icon">{o.icon}</div>
                <div className="outcome-title">{o.title}</div>
                <p className="outcome-desc">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-inner">
          <div className="eyebrow reveal">Take the First Step</div>
          <h2 className="cta-title reveal delay-1">Your growth starts with a <em>conversation.</em></h2>
          <p className="cta-desc reveal delay-2">Schedule a complimentary discovery call. No commitment, no pressure — just an honest conversation about where you are and where you want to go.</p>
          <div className="cta-btns reveal delay-3">
            <a href="/contact" className="btn btn-navy">Schedule a Discovery Call →</a>
          </div>
        </div>
      </section>
    </>
  )
}