import { createClient } from '@supabase/supabase-js'
export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getPageContent() {
  const { data } = await supabase.from('pages').select('*').eq('slug', 'home').single()
  return data?.content || {}
}

export default async function Home() {
  const c = await getPageContent()

  const get = (key: string, fallback: string) => c[key] || fallback

  const heroLines = get('hero_headline', 'Navigate.\nElevate.').split('\n').filter(Boolean)
  const credentials = get('about_credentials', 'CAPT, USN (Ret.) — U.S. Navy\nExecutive MBA (EMBA)\nACC Certified Coach — International Coaching Federation\nFounder, Beyond the Horizon Executive Coaching and Consulting').split('\n').filter(Boolean)
  const services = [1,2,3,4].map(n => ({
    num: `0${n}`,
    name: get(`service${n}_name`, ['Business Coaching','Individual Coaching','Executive Leadership','Strategic Consulting'][n-1]),
    desc: get(`service${n}_desc`, ['Strategic coaching for organizations, executives, and teams. Navigate complexity, build stronger cultures, and lead your business through change with clarity and confidence.','One on one coaching for professionals and leaders ready to level up. Whether you are stepping into a new role or redefining your path, this coaching meets you where you are.','Develop the executive presence, decision making skills, and strategic mindset that separates good leaders from great ones. Built on real experience at the highest levels.','Bring in an experienced advisor to help you think through your biggest challenges. From organizational design to growth strategy, get a clear outside perspective.'][n-1]),
    href: ['/business','/individual','/contact','/contact'][n-1],
    cta: ['Explore Business Coaching','Explore Individual Coaching','Learn More','Get in Touch'][n-1],
  }))
  const steps = [1,2,3].map(n => ({
    title: get(`approach${n}_title`, ['Discovery','Strategy','Growth'][n-1]),
    desc: get(`approach${n}_desc`, ['We begin with a deep dive into where you are and where you want to go. No assumptions, no templates — just a genuine conversation about your goals, challenges, and what success looks like for you.','Together we build a clear, actionable plan. Every engagement is tailored to your specific situation — grounded in real experience and focused on measurable outcomes that move the needle.','Sustained accountability and ongoing support to ensure the work sticks. Real growth requires real follow through, and I stay with you through every step of the journey.'][n-1]),
  }))

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&display=swap');

        :root {
          --navy: #0D1B2A; --navy-mid: #1A2E45; --slate: #4C78A0; --slate-light: #6B9ABF;
          --gold: #C9A23A; --gold-light: #D4B563; --ivory: #F7F4ED; --ivory-dark: #EDE8DC;
          --white: #FFFFFF; --text-body: #2C3E50; --text-muted: #6B7A8D; --border: rgba(13,27,42,0.1);
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: var(--ivory); color: var(--navy); font-family: 'Inter', sans-serif; font-weight: 300; overflow-x: hidden; }

        .hero { min-height: 100vh; background: var(--navy); position: relative; overflow: hidden; display: flex; align-items: center; }
        .hero-bg { position: absolute; inset: 0; background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 50%, #1B3A5C 100%); }
        .hero-pattern { position: absolute; inset: 0; opacity: 0.04; background-image: repeating-linear-gradient(45deg, var(--gold) 0, var(--gold) 1px, transparent 0, transparent 50%); background-size: 30px 30px; }
        .hero-gold-line { position: absolute; left: 0; right: 0; bottom: 0; height: 4px; background: linear-gradient(90deg, transparent, var(--gold), transparent); animation: shimmer 3s ease-in-out infinite; }
        @keyframes shimmer { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        .hero-content { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; padding: 140px 60px 100px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; width: 100%; }
        .hero-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 28px; }
        .hero-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--gold); }
        .hero-headline { font-family: 'Cormorant Garamond', serif; font-size: clamp(52px, 6.5vw, 82px); font-weight: 600; line-height: 1.02; color: var(--white); margin-bottom: 28px; letter-spacing: -0.01em; }
        .hero-headline em { font-style: italic; color: var(--gold); }
        .hero-desc { font-size: 1rem; line-height: 1.8; color: rgba(247,244,237,0.7); margin-bottom: 44px; max-width: 460px; }
        .hero-btns { display: flex; gap: 16px; flex-wrap: wrap; }
        .btn { display: inline-flex; align-items: center; gap: 10px; padding: 16px 36px; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: all 0.3s cubic-bezier(0.16,1,0.3,1); font-weight: 500; cursor: pointer; border: none; }
        .btn-gold { background: var(--gold); color: var(--navy); }
        .btn-gold:hover { background: var(--gold-light); }
        .btn-outline { background: transparent; color: var(--ivory); border: 1px solid rgba(247,244,237,0.3); }
        .btn-outline:hover { border-color: var(--gold); color: var(--gold); }
        .btn-navy { background: var(--navy); color: var(--ivory); }
        .btn-navy:hover { background: var(--navy-mid); }
        .btn-outline-navy { background: transparent; color: var(--navy); border: 1px solid rgba(13,27,42,0.25); }
        .btn-outline-navy:hover { border-color: var(--navy); }
        .hero-right { display: flex; flex-direction: column; gap: 16px; }
        .hero-stat-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(201,162,58,0.2); padding: 28px 32px; backdrop-filter: blur(10px); transition: all 0.3s; }
        .hero-stat-card:hover { background: rgba(201,162,58,0.08); border-color: rgba(201,162,58,0.4); transform: translateX(6px); }
        .hero-stat-card:first-child { border-left: 3px solid var(--gold); }
        .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 3rem; font-weight: 700; color: var(--gold); line-height: 1; margin-bottom: 6px; }
        .stat-label { font-size: 0.8rem; color: rgba(247,244,237,0.6); letter-spacing: 0.06em; line-height: 1.5; }

        .intro-strip { background: var(--gold); padding: 20px 60px; display: flex; justify-content: center; gap: 60px; align-items: center; overflow: hidden; flex-wrap: wrap; }
        .intro-item { font-size: 0.72rem; color: var(--navy); letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; white-space: nowrap; }
        .intro-dot { width: 4px; height: 4px; background: var(--navy); border-radius: 50%; opacity: 0.4; flex-shrink: 0; }

        .about { padding: 140px 60px; background: var(--ivory); }
        .about-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 100px; align-items: center; }
        .about-image { position: relative; }
        .about-photo { width: 100%; aspect-ratio: 3/4; background: linear-gradient(135deg, var(--navy-mid), var(--slate)); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.2); font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; overflow: hidden; }
        .about-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .about-badge { position: absolute; bottom: -20px; right: -20px; background: var(--gold); padding: 24px 28px; }
        .about-badge-num { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 700; color: var(--navy); line-height: 1; }
        .about-badge-label { font-size: 0.65rem; color: var(--navy); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; opacity: 0.7; }
        .eyebrow { font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
        .section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px, 4vw, 54px); font-weight: 600; line-height: 1.08; color: var(--navy); margin-bottom: 24px; letter-spacing: -0.01em; }
        .section-title em { font-style: italic; color: var(--slate); }
        .body-text { font-size: 0.95rem; line-height: 1.85; color: var(--text-body); margin-bottom: 20px; }
        .credentials { display: flex; flex-direction: column; gap: 10px; margin: 32px 0; }
        .credential { display: flex; align-items: center; gap: 12px; font-size: 0.85rem; color: var(--text-muted); }
        .credential::before { content: ''; width: 20px; height: 1px; background: var(--gold); flex-shrink: 0; }

        .services { padding: 140px 60px; background: var(--navy); }
        .services-inner { max-width: 1200px; margin: 0 auto; }
        .services-header { margin-bottom: 64px; }
        .eyebrow-light { font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .eyebrow-light::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
        .section-title-light { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px, 4vw, 54px); font-weight: 600; line-height: 1.08; color: var(--white); letter-spacing: -0.01em; }
        .section-title-light em { font-style: italic; color: var(--gold); }
        .services-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
        .service-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); padding: 48px 40px; transition: all 0.4s cubic-bezier(0.16,1,0.3,1); position: relative; overflow: hidden; }
        .service-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 0; background: var(--gold); transition: width 0.3s ease; }
        .service-card:hover::before { width: 3px; }
        .service-card:hover { background: rgba(201,162,58,0.06); border-color: rgba(201,162,58,0.2); transform: translateY(-4px); }
        .service-num { font-family: 'Cormorant Garamond', serif; font-size: 3rem; font-weight: 700; color: rgba(201,162,58,0.15); line-height: 1; margin-bottom: 20px; transition: color 0.3s; }
        .service-card:hover .service-num { color: rgba(201,162,58,0.3); }
        .service-name { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 600; color: var(--white); margin-bottom: 14px; }
        .service-desc { font-size: 0.88rem; line-height: 1.75; color: rgba(247,244,237,0.5); margin-bottom: 28px; }
        .service-link { font-size: 0.7rem; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: gap 0.3s; font-weight: 500; }
        .service-link:hover { gap: 14px; }

        .approach { padding: 140px 60px; background: var(--ivory-dark); }
        .approach-inner { max-width: 1200px; margin: 0 auto; }
        .approach-header { text-align: center; margin-bottom: 80px; }
        .approach-header .eyebrow { justify-content: center; }
        .approach-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
        .approach-card { background: var(--white); padding: 48px 36px; border-bottom: 3px solid transparent; transition: all 0.4s cubic-bezier(0.16,1,0.3,1); }
        .approach-card:hover { border-bottom-color: var(--gold); transform: translateY(-8px); box-shadow: 0 20px 60px rgba(13,27,42,0.08); }
        .approach-icon { width: 56px; height: 56px; background: var(--navy); display: flex; align-items: center; justify-content: center; margin-bottom: 24px; transition: background 0.3s; }
        .approach-card:hover .approach-icon { background: var(--gold); }
        .approach-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 600; color: var(--navy); margin-bottom: 14px; }
        .approach-desc { font-size: 0.88rem; line-height: 1.75; color: var(--text-muted); }

        .testimonials { padding: 140px 60px; background: var(--navy); }
        .testimonials-inner { max-width: 1200px; margin: 0 auto; }
        .testimonials-header { text-align: center; margin-bottom: 64px; }
        .testimonials-header .eyebrow-light { justify-content: center; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .testimonial-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 40px 32px; transition: all 0.4s cubic-bezier(0.16,1,0.3,1); }
        .testimonial-card:hover { background: rgba(255,255,255,0.07); transform: translateY(-6px); border-color: rgba(201,162,58,0.2); }
        .testimonial-quote { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-style: italic; line-height: 1.7; color: rgba(247,244,237,0.75); margin-bottom: 28px; }
        .quote-mark { font-size: 4rem; color: var(--gold); opacity: 0.25; line-height: 0; vertical-align: -0.5em; display: inline-block; margin-right: 4px; font-family: 'Cormorant Garamond', serif; }
        .testimonial-author { font-size: 0.8rem; color: var(--gold); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500; }
        .testimonial-role { font-size: 0.75rem; color: rgba(247,244,237,0.35); margin-top: 4px; }

        .cta-section { padding: 140px 60px; background: var(--ivory); }
        .cta-inner { max-width: 800px; margin: 0 auto; text-align: center; }
        .cta-inner .eyebrow { justify-content: center; }
        .cta-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(44px, 6vw, 72px); font-weight: 600; line-height: 1.05; color: var(--navy); margin-bottom: 24px; }
        .cta-title em { font-style: italic; color: var(--gold); }
        .cta-desc { font-size: 1rem; line-height: 1.8; color: var(--text-muted); margin-bottom: 44px; }
        .cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

        @media (max-width: 900px) {
          .hero-content { grid-template-columns: 1fr; padding: 120px 24px 80px; gap: 48px; }
          .hero-headline { font-size: clamp(40px, 10vw, 64px); }
          .hero-right { flex-direction: row; flex-wrap: wrap; gap: 12px; }
          .hero-stat-card { flex: 1; min-width: 140px; padding: 20px; }
          .stat-num { font-size: 2rem; }
          .about { padding: 80px 24px; }
          .about-inner { grid-template-columns: 1fr; gap: 48px; }
          .about-badge { display: none; }
          .services { padding: 80px 24px; }
          .services-grid { grid-template-columns: 1fr; }
          .approach { padding: 80px 24px; }
          .approach-grid { grid-template-columns: 1fr; gap: 20px; }
          .testimonials { padding: 80px 24px; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .cta-section { padding: 80px 24px; }
          .intro-strip { gap: 16px; padding: 14px 24px; }
        }
        @media (max-width: 540px) {
          .hero-btns { flex-direction: column; }
          .hero-right { flex-direction: column; }
          .cta-btns { flex-direction: column; align-items: center; }
          .cta-btns .btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-pattern" />
        <div className="hero-gold-line" />
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-eyebrow">Executive Coaching and Consulting</div>
            <h1 className="hero-headline">
              {heroLines.map((line: string, i: number) => <span key={i} style={{display:'block'}}>{line}</span>)}
              <em>{get('hero_accent', 'Transform.')}</em>
            </h1>
            <p className="hero-desc">{get('hero_subheadline', 'Strategic guidance for leaders who are ready to go beyond the horizon. Executive coaching and consulting designed to help you lead with confidence and purpose.')}</p>
            <div className="hero-btns">
              <a href="/contact" className="btn btn-gold">Schedule a Session →</a>
              <a href="/business" className="btn btn-outline">Explore Coaching →</a>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-stat-card">
              <div className="stat-num">{get('stat1_num', '20+')}</div>
              <div className="stat-label">{get('stat1_label', 'Years of leadership experience in the U.S. Navy and private sector')}</div>
            </div>
            <div className="hero-stat-card">
              <div className="stat-num">{get('stat2_num', 'EMBA')}</div>
              <div className="stat-label">{get('stat2_label', 'Executive MBA and ACC certified coach through the ICF')}</div>
            </div>
            <div className="hero-stat-card">
              <div className="stat-num">{get('stat3_num', 'CAPT')}</div>
              <div className="stat-label">{get('stat3_label', 'Retired U.S. Navy Captain with proven leadership at every level')}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="intro-strip">
        <div className="intro-item">Business Coaching</div>
        <div className="intro-dot" />
        <div className="intro-item">Individual Coaching</div>
        <div className="intro-dot" />
        <div className="intro-item">Executive Leadership</div>
        <div className="intro-dot" />
        <div className="intro-item">Strategic Consulting</div>
      </div>

      <section className="about">
        <div className="about-inner">
          <div className="about-image">
            <div className="about-photo">
              {c.about_photo
                ? <img src={c.about_photo} alt="John McCracken" />
                : 'Photo coming soon'}
            </div>
            <div className="about-badge">
              <div className="about-badge-num">20+</div>
              <div className="about-badge-label">Years Leading</div>
            </div>
          </div>
          <div className="about-content">
            <div className="eyebrow">About John McCracken</div>
            <h2 className="section-title">{get('about_title', 'Leadership forged through experience.')}</h2>
            <p className="body-text">{get('about_body_1', 'John McCracken is a retired U.S. Navy Captain and certified executive coach with over two decades of leadership experience. He founded Beyond the Horizon to bring the same clarity, discipline, and strategic thinking that defined his military career to business leaders and individuals ready to grow.')}</p>
            <p className="body-text">{get('about_body_2', 'Whether you are leading a team through change, building a business, or seeking to unlock your own potential, John provides the guidance and accountability to help you get there.')}</p>
            <div className="credentials">
              {credentials.map((cred: string, i: number) => (
                <div key={i} className="credential">{cred}</div>
              ))}
            </div>
            <a href="/contact" className="btn btn-navy" style={{display:'inline-flex',marginTop:8}}>Work with John →</a>
          </div>
        </div>
      </section>

      <section className="services">
        <div className="services-inner">
          <div className="services-header">
            <div className="eyebrow-light">What I Offer</div>
            <h2 className="section-title-light">{get('services_headline', 'Coaching built for real results.')}</h2>
          </div>
          <div className="services-grid">
            {services.map((s, i) => (
              <div key={i} className="service-card">
                <div className="service-num">{s.num}</div>
                <div className="service-name">{s.name}</div>
                <p className="service-desc">{s.desc}</p>
                <a href={s.href} className="service-link">{s.cta} →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="approach">
        <div className="approach-inner">
          <div className="approach-header">
            <div className="eyebrow">My Approach</div>
            <h2 className="section-title">{get('approach_headline', 'How we work together.')}</h2>
          </div>
          <div className="approach-grid">
            {steps.map((step, i) => (
              <div key={i} className="approach-card">
                <div className="approach-icon">
                  <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                    {i === 0 && <path d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" stroke="#C9A23A" strokeWidth="1.5" strokeLinecap="round"/>}
                    {i === 1 && <><path d="M9 11l3 3L22 4" stroke="#C9A23A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#C9A23A" strokeWidth="1.5" strokeLinecap="round"/></>}
                    {i === 2 && <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#C9A23A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
                  </svg>
                </div>
                <div className="approach-title">{step.title}</div>
                <p className="approach-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-inner">
          <div className="eyebrow">Ready to Begin</div>
          <h2 className="cta-title">{get('cta_headline', 'Your next chapter starts')} <em>{get('cta_accent', 'here.')}</em></h2>
          <p className="cta-desc">{get('cta_desc', "Whether you are leading a business, navigating a transition, or ready to invest in your own growth — the first step is a conversation. Let's talk.")}</p>
          <div className="cta-btns">
            <a href="/contact" className="btn btn-navy">{get('cta_btn1', 'Schedule a Session →')}</a>
            <a href="/business" className="btn btn-outline-navy">{get('cta_btn2', 'Explore Coaching →')}</a>
          </div>
        </div>
      </section>
    </>
  )
}