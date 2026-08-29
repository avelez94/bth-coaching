import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Beyond the Horizon — Executive Coaching & Consulting',
  description: 'Executive coaching and consulting to help leaders navigate change, unlock potential, and create lasting impact.',
}

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&display=swap');

        :root {
          --navy: #0D1B2A;
          --navy-mid: #1A2E45;
          --slate: #4C78A0;
          --slate-light: #6B9ABF;
          --gold: #C9A23A;
          --gold-light: #D4B563;
          --ivory: #F7F4ED;
          --ivory-dark: #EDE8DC;
          --white: #FFFFFF;
          --text-body: #2C3E50;
          --text-muted: #6B7A8D;
          --border: rgba(13,27,42,0.1);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: var(--ivory); color: var(--navy); font-family: 'Inter', sans-serif; font-weight: 300; overflow-x: hidden; }

        /* NAV */
        nav { position: fixed; top: 0; left: 0; right: 0; padding: 20px 60px; display: flex; justify-content: space-between; align-items: center; z-index: 100; background: rgba(247,244,237,0.97); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border); }
        .nav-brand { display: flex; align-items: center; gap: 14px; text-decoration: none; }
        .nav-logo-text { display: flex; flex-direction: column; }
        .nav-name { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 700; color: var(--navy); letter-spacing: 0.04em; line-height: 1.1; }
        .nav-sub { font-size: 0.6rem; color: var(--gold); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 500; }
        .nav-divider { width: 1px; height: 32px; background: var(--gold); opacity: 0.4; }
        .nav-links { display: flex; gap: 36px; align-items: center; }
        .nav-links a { font-size: 0.75rem; color: var(--text-muted); text-decoration: none; letter-spacing: 0.08em; text-transform: uppercase; transition: color 0.2s; font-weight: 500; }
        .nav-links a:hover { color: var(--navy); }
        .nav-cta { background: var(--navy); color: var(--ivory); padding: 12px 28px; font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: all 0.2s; font-weight: 500; }
        .nav-cta:hover { background: var(--gold); color: var(--navy); }

        /* HERO */
        .hero { min-height: 100vh; background: var(--navy); position: relative; overflow: hidden; display: flex; align-items: center; }
        .hero-bg { position: absolute; inset: 0; background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 50%, #1B3A5C 100%); }
        .hero-pattern { position: absolute; inset: 0; opacity: 0.04; background-image: repeating-linear-gradient(45deg, var(--gold) 0, var(--gold) 1px, transparent 0, transparent 50%); background-size: 30px 30px; }
        .hero-gold-line { position: absolute; left: 0; right: 0; bottom: 0; height: 4px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
        .hero-content { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; padding: 140px 60px 100px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; width: 100%; }
        .hero-left { }
        .hero-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 28px; }
        .hero-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--gold); }
        .hero-headline { font-family: 'Cormorant Garamond', serif; font-size: clamp(48px, 6vw, 76px); font-weight: 600; line-height: 1.05; color: var(--white); margin-bottom: 28px; letter-spacing: -0.01em; }
        .hero-headline em { font-style: italic; color: var(--gold); }
        .hero-desc { font-size: 1rem; line-height: 1.8; color: rgba(247,244,237,0.7); margin-bottom: 44px; max-width: 460px; }
        .hero-btns { display: flex; gap: 16px; flex-wrap: wrap; }
        .btn { display: inline-flex; align-items: center; gap: 10px; padding: 16px 36px; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: all 0.25s; font-weight: 500; cursor: pointer; border: none; }
        .btn-gold { background: var(--gold); color: var(--navy); }
        .btn-gold:hover { background: var(--gold-light); transform: translateY(-2px); }
        .btn-outline { background: transparent; color: var(--ivory); border: 1px solid rgba(247,244,237,0.3); }
        .btn-outline:hover { border-color: var(--gold); color: var(--gold); }
        .hero-right { display: flex; flex-direction: column; gap: 16px; }
        .hero-stat-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(201,162,58,0.2); padding: 28px 32px; backdrop-filter: blur(10px); }
        .hero-stat-card:first-child { border-left: 3px solid var(--gold); }
        .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 3rem; font-weight: 700; color: var(--gold); line-height: 1; margin-bottom: 6px; }
        .stat-label { font-size: 0.8rem; color: rgba(247,244,237,0.6); letter-spacing: 0.06em; line-height: 1.5; }

        /* INTRO STRIP */
        .intro-strip { background: var(--gold); padding: 20px 60px; display: flex; justify-content: center; gap: 60px; align-items: center; }
        .intro-item { font-size: 0.72rem; color: var(--navy); letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; display: flex; align-items: center; gap: 10px; }
        .intro-dot { width: 4px; height: 4px; background: var(--navy); border-radius: 50%; opacity: 0.4; }

        /* ABOUT */
        .about { padding: 120px 60px; background: var(--ivory); }
        .about-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .about-image { position: relative; }
        .about-photo { width: 100%; aspect-ratio: 3/4; background: linear-gradient(135deg, var(--navy-mid), var(--slate)); border-radius: 2px; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.2); font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; }
        .about-badge { position: absolute; bottom: -20px; right: -20px; background: var(--gold); padding: 24px 28px; }
        .about-badge-num { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 700; color: var(--navy); line-height: 1; }
        .about-badge-label { font-size: 0.65rem; color: var(--navy); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; opacity: 0.7; }
        .about-content { }
        .eyebrow { font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
        .section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px, 4vw, 52px); font-weight: 600; line-height: 1.1; color: var(--navy); margin-bottom: 24px; letter-spacing: -0.01em; }
        .section-title em { font-style: italic; color: var(--slate); }
        .body-text { font-size: 0.95rem; line-height: 1.85; color: var(--text-body); margin-bottom: 20px; }
        .credentials { display: flex; flex-direction: column; gap: 10px; margin: 32px 0; }
        .credential { display: flex; align-items: center; gap: 12px; font-size: 0.85rem; color: var(--text-muted); }
        .credential::before { content: ''; width: 20px; height: 1px; background: var(--gold); flex-shrink: 0; }

        /* SERVICES */
        .services { padding: 120px 60px; background: var(--navy); }
        .services-inner { max-width: 1200px; margin: 0 auto; }
        .services-header { margin-bottom: 64px; display: flex; justify-content: space-between; align-items: flex-end; }
        .eyebrow-light { font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .eyebrow-light::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
        .section-title-light { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px, 4vw, 52px); font-weight: 600; line-height: 1.1; color: var(--white); letter-spacing: -0.01em; }
        .section-title-light em { font-style: italic; color: var(--gold); }
        .services-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
        .service-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); padding: 48px 40px; transition: all 0.3s; cursor: pointer; }
        .service-card:hover { background: rgba(201,162,58,0.08); border-color: rgba(201,162,58,0.3); }
        .service-num { font-family: 'Cormorant Garamond', serif; font-size: 3rem; font-weight: 700; color: rgba(201,162,58,0.2); line-height: 1; margin-bottom: 20px; }
        .service-name { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 600; color: var(--white); margin-bottom: 14px; }
        .service-desc { font-size: 0.88rem; line-height: 1.75; color: rgba(247,244,237,0.55); margin-bottom: 28px; }
        .service-link { font-size: 0.7rem; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; display: flex; align-items: center; gap: 8px; transition: gap 0.2s; font-weight: 500; }
        .service-link:hover { gap: 14px; }

        /* APPROACH */
        .approach { padding: 120px 60px; background: var(--ivory-dark); }
        .approach-inner { max-width: 1200px; margin: 0 auto; }
        .approach-header { text-align: center; margin-bottom: 80px; }
        .approach-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
        .approach-card { background: var(--white); padding: 48px 36px; border-bottom: 3px solid transparent; transition: all 0.3s; }
        .approach-card:hover { border-bottom-color: var(--gold); transform: translateY(-4px); }
        .approach-icon { width: 56px; height: 56px; background: var(--navy); display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
        .approach-icon svg { width: 24px; height: 24px; }
        .approach-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 600; color: var(--navy); margin-bottom: 14px; }
        .approach-desc { font-size: 0.88rem; line-height: 1.75; color: var(--text-muted); }

        /* TESTIMONIALS */
        .testimonials { padding: 120px 60px; background: var(--navy); }
        .testimonials-inner { max-width: 1200px; margin: 0 auto; }
        .testimonials-header { text-align: center; margin-bottom: 64px; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .testimonial-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 40px 32px; }
        .testimonial-quote { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-style: italic; line-height: 1.7; color: rgba(247,244,237,0.8); margin-bottom: 28px; }
        .testimonial-quote::before { content: '"'; font-size: 3rem; color: var(--gold); opacity: 0.4; line-height: 0; vertical-align: -0.4em; margin-right: 4px; }
        .testimonial-author { font-size: 0.8rem; color: var(--gold); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500; }
        .testimonial-title { font-size: 0.75rem; color: rgba(247,244,237,0.4); margin-top: 4px; }

        /* CTA */
        .cta-section { padding: 120px 60px; background: var(--ivory); }
        .cta-inner { max-width: 800px; margin: 0 auto; text-align: center; }
        .cta-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(44px, 6vw, 68px); font-weight: 600; line-height: 1.1; color: var(--navy); margin-bottom: 24px; }
        .cta-title em { font-style: italic; color: var(--gold); }
        .cta-desc { font-size: 1rem; line-height: 1.8; color: var(--text-muted); margin-bottom: 44px; }
        .cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .btn-navy { background: var(--navy); color: var(--ivory); }
        .btn-navy:hover { background: var(--navy-mid); transform: translateY(-2px); }
        .btn-outline-navy { background: transparent; color: var(--navy); border: 1px solid rgba(13,27,42,0.3); }
        .btn-outline-navy:hover { border-color: var(--navy); }

        /* FOOTER */
        footer { background: var(--navy); padding: 60px; border-top: 1px solid rgba(201,162,58,0.2); }
        .footer-inner { max-width: 1200px; margin: 0 auto; }
        .footer-top { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 60px; margin-bottom: 60px; }
        .footer-brand-name { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: var(--white); margin-bottom: 4px; }
        .footer-brand-sub { font-size: 0.65rem; color: var(--gold); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 20px; }
        .footer-desc { font-size: 0.82rem; line-height: 1.75; color: rgba(247,244,237,0.4); }
        .footer-col-title { font-size: 0.65rem; color: var(--gold); letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; margin-bottom: 20px; }
        .footer-col a { display: block; font-size: 0.82rem; color: rgba(247,244,237,0.5); text-decoration: none; margin-bottom: 12px; transition: color 0.2s; }
        .footer-col a:hover { color: var(--white); }
        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 28px; display: flex; justify-content: space-between; align-items: center; }
        .footer-copy { font-size: 0.75rem; color: rgba(247,244,237,0.3); }
        .footer-gold-line { width: 40px; height: 2px; background: var(--gold); opacity: 0.5; }

        @media (max-width: 900px) {
          nav { padding: 16px 24px; }
          .nav-links { display: none; }
          .hero-content { grid-template-columns: 1fr; padding: 120px 24px 80px; gap: 48px; }
          .about-inner { grid-template-columns: 1fr; gap: 48px; }
          .about-badge { display: none; }
          .services-grid { grid-template-columns: 1fr; }
          .approach-grid { grid-template-columns: 1fr; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .footer-top { grid-template-columns: 1fr 1fr; gap: 40px; }
          .intro-strip { flex-wrap: wrap; gap: 20px; padding: 20px 24px; }
          section, .about, .services, .approach, .testimonials, .cta-section { padding: 80px 24px; }
          footer { padding: 48px 24px; }
          .services-header { flex-direction: column; align-items: flex-start; gap: 16px; }
        }
      `}</style>

      <nav>
        <a href="/" className="nav-brand">
          <div className="nav-logo-text">
            <div className="nav-name">Beyond the Horizon</div>
            <div className="nav-sub">Executive Coaching and Consulting</div>
          </div>
        </a>
        <div className="nav-links">
          <a href="/business">Business Coaching</a>
          <a href="/individual">Individual Coaching</a>
          <a href="/contact">Contact</a>
        </div>
        <a href="/contact" className="nav-cta">Schedule a Session</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-pattern" />
        <div className="hero-gold-line" />
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-eyebrow">Executive Coaching and Consulting</div>
            <h1 className="hero-headline">
              Navigate.<br />
              Elevate.<br />
              <em>Transform.</em>
            </h1>
            <p className="hero-desc">Strategic guidance for leaders who are ready to go beyond the horizon. Executive coaching and consulting designed to help you lead with confidence and purpose.</p>
            <div className="hero-btns">
              <a href="/contact" className="btn btn-gold">Schedule a Session →</a>
              <a href="/business" className="btn btn-outline">Explore Coaching →</a>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-stat-card">
              <div className="stat-num">20+</div>
              <div className="stat-label">Years of leadership experience in the U.S. Navy and private sector</div>
            </div>
            <div className="hero-stat-card">
              <div className="stat-num">EMBA</div>
              <div className="stat-label">Executive MBA and ACC certified coach through the ICF</div>
            </div>
            <div className="hero-stat-card">
              <div className="stat-num">CAPT</div>
              <div className="stat-label">Retired U.S. Navy Captain with proven leadership at every level</div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO STRIP */}
      <div className="intro-strip">
        <div className="intro-item">Business Coaching</div>
        <div className="intro-dot" />
        <div className="intro-item">Individual Coaching</div>
        <div className="intro-dot" />
        <div className="intro-item">Executive Leadership</div>
        <div className="intro-dot" />
        <div className="intro-item">Strategic Consulting</div>
      </div>

      {/* ABOUT */}
      <section className="about">
        <div className="about-inner">
          <div className="about-image">
            <div className="about-photo">Photo coming soon</div>
            <div className="about-badge">
              <div className="about-badge-num">20+</div>
              <div className="about-badge-label">Years Leading</div>
            </div>
          </div>
          <div className="about-content">
            <div className="eyebrow">About John McCracken</div>
            <h2 className="section-title">Leadership forged through <em>experience.</em></h2>
            <p className="body-text">John McCracken is a retired U.S. Navy Captain and certified executive coach with over two decades of leadership experience. He founded Beyond the Horizon to bring the same clarity, discipline, and strategic thinking that defined his military career to business leaders and individuals ready to grow.</p>
            <p className="body-text">Whether you are leading a team through change, building a business, or seeking to unlock your own potential, John provides the guidance and accountability to help you get there.</p>
            <div className="credentials">
              <div className="credential">CAPT, USN (Ret.) — U.S. Navy</div>
              <div className="credential">Executive MBA (EMBA)</div>
              <div className="credential">ACC Certified Coach — International Coaching Federation</div>
              <div className="credential">Founder, Beyond the Horizon Executive Coaching and Consulting</div>
            </div>
            <a href="/contact" className="btn btn-navy" style={{display:'inline-flex',marginTop:8}}>Work with John →</a>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services">
        <div className="services-inner">
          <div className="services-header">
            <div>
              <div className="eyebrow-light">What I Offer</div>
              <h2 className="section-title-light">Coaching built for <em>real results.</em></h2>
            </div>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-num">01</div>
              <div className="service-name">Business Coaching</div>
              <p className="service-desc">Strategic coaching for organizations, executives, and teams. Navigate complexity, build stronger cultures, and lead your business through change with clarity and confidence.</p>
              <a href="/business" className="service-link">Explore Business Coaching →</a>
            </div>
            <div className="service-card">
              <div className="service-num">02</div>
              <div className="service-name">Individual Coaching</div>
              <p className="service-desc">One on one coaching for professionals and leaders ready to level up. Whether you are stepping into a new role or redefining your path, this coaching meets you where you are.</p>
              <a href="/individual" className="service-link">Explore Individual Coaching →</a>
            </div>
            <div className="service-card">
              <div className="service-num">03</div>
              <div className="service-name">Executive Leadership</div>
              <p className="service-desc">Develop the executive presence, decision making skills, and strategic mindset that separates good leaders from great ones. Built on real experience at the highest levels.</p>
              <a href="/contact" className="service-link">Learn More →</a>
            </div>
            <div className="service-card">
              <div className="service-num">04</div>
              <div className="service-name">Strategic Consulting</div>
              <p className="service-desc">Bring in an experienced advisor to help you think through your biggest challenges. From organizational design to growth strategy, get a clear outside perspective.</p>
              <a href="/contact" className="service-link">Get in Touch →</a>
            </div>
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="approach">
        <div className="approach-inner">
          <div className="approach-header">
            <div className="eyebrow" style={{justifyContent:'center'}}>My Approach</div>
            <h2 className="section-title">How we work <em>together.</em></h2>
          </div>
          <div className="approach-grid">
            <div className="approach-card">
              <div className="approach-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#C9A23A" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              </div>
              <div className="approach-title">Discovery</div>
              <p className="approach-desc">We begin with a deep dive into where you are and where you want to go. No assumptions, no templates — just a genuine conversation about your goals, challenges, and what success looks like for you.</p>
            </div>
            <div className="approach-card">
              <div className="approach-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#C9A23A" strokeWidth="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
              </div>
              <div className="approach-title">Strategy</div>
              <p className="approach-desc">Together we build a clear, actionable plan. Every engagement is tailored to your specific situation — grounded in real experience and focused on measurable outcomes that move the needle.</p>
            </div>
            <div className="approach-card">
              <div className="approach-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#C9A23A" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <div className="approach-title">Growth</div>
              <p className="approach-desc">Sustained accountability and ongoing support to ensure the work sticks. Real growth requires real follow through, and I stay with you through every step of the journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="testimonials-inner">
          <div className="testimonials-header">
            <div className="eyebrow-light" style={{justifyContent:'center'}}>What Clients Say</div>
            <h2 className="section-title-light">Results that <em>speak for themselves.</em></h2>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-quote">Working with John gave me a completely new perspective on how I approach leadership. His military background brings a level of discipline and clarity I had never experienced in a coach before.</div>
              <div className="testimonial-author">Testimonial Coming Soon</div>
              <div className="testimonial-title">Executive Client</div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-quote">John does not just tell you what you want to hear. He challenges you to think bigger and hold yourself accountable. The results have been transformational for our team.</div>
              <div className="testimonial-author">Testimonial Coming Soon</div>
              <div className="testimonial-title">Business Owner</div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-quote">I came in with a clear career plateau and left with a roadmap and the confidence to execute it. The investment has paid for itself many times over.</div>
              <div className="testimonial-author">Testimonial Coming Soon</div>
              <div className="testimonial-title">Individual Coaching Client</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <div className="eyebrow" style={{justifyContent:'center'}}>Ready to Begin</div>
          <h2 className="cta-title">Your next chapter<br />starts <em>here.</em></h2>
          <p className="cta-desc">Whether you are leading a business, navigating a transition, or ready to invest in your own growth — the first step is a conversation. Let's talk.</p>
          <div className="cta-btns">
            <a href="/contact" className="btn btn-navy">Schedule a Session →</a>
            <a href="/business" className="btn btn-outline-navy">Explore Coaching →</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-brand-name">Beyond the Horizon</div>
              <div className="footer-brand-sub">Executive Coaching and Consulting</div>
              <p className="footer-desc">Strategic coaching and consulting for leaders who are ready to navigate change, unlock potential, and create lasting impact.</p>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Services</div>
              <a href="/business">Business Coaching</a>
              <a href="/individual">Individual Coaching</a>
              <a href="/contact">Executive Leadership</a>
              <a href="/contact">Strategic Consulting</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Company</div>
              <a href="/">About John</a>
              <a href="/contact">Contact</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Contact</div>
              <a href="mailto:john@mccrackencoaching.com">john@mccrackencoaching.com</a>
              <a href="tel:7033436960">703.343.6960</a>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copy">© 2026 Beyond the Horizon Executive Coaching and Consulting. All rights reserved.</div>
            <div className="footer-gold-line" />
          </div>
        </div>
      </footer>
    </>
  )
}