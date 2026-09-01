import { createClient } from '@supabase/supabase-js'

export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getData() {
  const [pageRes, testimonialsRes] = await Promise.all([
    supabase.from('pages').select('content').eq('slug', 'home').single(),
    supabase.from('testimonials').select('*').eq('is_active', true).order('sort_order'),
  ])
  return {
    c: (pageRes.data?.content || {}) as Record<string, string>,
    testimonials: (testimonialsRes.data || []) as Array<{ id: string; name: string; role: string; company: string; quote: string }>,
  }
}

export default async function Home() {
  const { c, testimonials } = await getData()
  const g = (key: string, fallback: string) => c[key] || fallback

  const heroLines = g('hero_headline', 'I help people find and get\nwhat they want.').split('\n').filter(Boolean)
  const credentials = g('about_credentials', 'Commanding Officer, U.S. Navy — 30 years of progressively responsible leadership, command, and strategic development positions\nExecutive MBA — Naval Postgraduate School\nMA, National Security & Strategic Studies — Naval War College\nAssociate Certified Coach (ACC) — International Coaching Federation\nDoD Certified Executive Coach').split('\n').filter(Boolean)

  const services = [1,2,3,4].map(n => ({
    num: `0${n}`,
    name: g(`service${n}_name`, ['Business Coaching','Individual Coaching','Executive Leadership','Strategic Consulting'][n-1]),
    desc: g(`service${n}_desc`, ['Strategic coaching for organizations, executives, and teams. Navigate complexity, build stronger cultures, and lead your business through change with clarity and confidence.','One on one coaching for professionals and leaders ready to level up. Whether you are stepping into a new role or redefining your path, this coaching meets you where you are.','Develop the executive presence, decision making skills, and strategic mindset that separates good leaders from great ones. Built on real experience at the highest levels.','Experienced guidance for complex challenges — from organizational strategy to change management and growth planning.'][n-1]),
    href: ['/business','/individual','/contact','/contact'][n-1],
  }))

  const displayTestimonials = testimonials.length > 0 ? testimonials : []

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&display=swap');

        :root {
          --ivory: #F7F4ED;
          --ivory-dark: #EDE8DC;
          --slate: #4C78A0;
          --slate-dark: #3A607F;
          --slate-light: #6B9ABF;
          --navy: #0D1B2A;
          --navy-mid: #1A2E45;
          --gold: #C9A23A;
          --gold-light: #D4B563;
          --white: #FFFFFF;
          --text-body: #2C3E50;
          --text-muted: #6B7A8D;
          --text-light: rgba(247,244,237,0.75);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: var(--ivory); color: var(--navy); font-family: 'Inter', sans-serif; font-weight: 300; overflow-x: hidden; }

        /* BUTTONS */
        .btn { display: inline-flex; align-items: center; gap: 10px; padding: 15px 32px; font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: all 0.25s ease; font-weight: 500; cursor: pointer; border: none; font-family: 'Inter', sans-serif; }
        .btn-primary { background: var(--navy); color: var(--ivory); }
        .btn-primary:hover { background: var(--slate); }
        .btn-outline { background: transparent; color: var(--navy); border: 1px solid rgba(13,27,42,0.35); }
        .btn-outline:hover { background: var(--navy); color: var(--ivory); }
        .btn-outline-light { background: transparent; color: var(--ivory); border: 1px solid rgba(247,244,237,0.4); }
        .btn-outline-light:hover { border-color: var(--ivory); background: rgba(247,244,237,0.1); }
        .btn-gold { background: var(--gold); color: var(--navy); }
        .btn-gold:hover { background: var(--gold-light); }

        /* ======================== */
        /* HERO                     */
        /* ======================== */
        .hero {
          background: var(--ivory);
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          position: relative;
          overflow: hidden;
        }
        .hero-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 160px 64px 100px 72px;
          position: relative;
          z-index: 2;
        }
        .hero-eyebrow {
          font-size: 0.65rem;
          color: var(--gold);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .hero-eyebrow::before { content: ''; width: 36px; height: 1px; background: var(--gold); }
        .hero-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(44px, 5vw, 68px);
          font-weight: 700;
          line-height: 1.1;
          color: var(--navy);
          margin-bottom: 32px;
          letter-spacing: -0.02em;
        }
        .hero-headline em { font-style: italic; color: var(--slate); }
        .hero-subtext {
          font-size: 1.05rem;
          line-height: 1.8;
          color: var(--text-body);
          margin-bottom: 16px;
          max-width: 440px;
          font-weight: 300;
        }
        .hero-subtext-2 {
          font-size: 0.95rem;
          line-height: 1.85;
          color: var(--text-muted);
          margin-bottom: 44px;
          max-width: 440px;
        }
        .hero-btns { display: flex; gap: 14px; flex-wrap: wrap; }
        .hero-right {
          position: relative;
          background: var(--slate);
          overflow: hidden;
        }
        .hero-photo-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;
          padding: 48px;
        }
        .hero-photo-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .hero-photo-label {
          position: relative;
          z-index: 2;
          font-size: 0.65rem;
          color: rgba(247,244,237,0.45);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border: 1px solid rgba(247,244,237,0.2);
          padding: 8px 14px;
        }
        .hero-photo-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(13,27,42,0.4) 0%, transparent 50%);
        }

        /* ======================== */
        /* CREDENTIALS STRIP        */
        /* ======================== */
        .credentials-strip {
          background: var(--navy);
          padding: 0 72px;
          display: flex;
          align-items: stretch;
        }
        .credential-item {
          flex: 1;
          padding: 28px 0;
          border-right: 1px solid rgba(255,255,255,0.08);
          padding-right: 32px;
          padding-left: 32px;
        }
        .credential-item:first-child { padding-left: 0; }
        .credential-item:last-child { border-right: none; }
        .credential-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 600;
          color: var(--gold);
          line-height: 1;
          margin-bottom: 4px;
        }
        .credential-label {
          font-size: 0.7rem;
          color: rgba(247,244,237,0.45);
          letter-spacing: 0.06em;
          line-height: 1.4;
          text-transform: uppercase;
        }

        /* ======================== */
        /* ABOUT / STORY            */
        /* ======================== */
        .about {
          background: var(--slate);
          padding: 0;
          display: grid;
          grid-template-columns: 5fr 7fr;
          min-height: 680px;
        }
        .about-photo-col {
          position: relative;
          overflow: hidden;
          background: var(--slate-dark);
          min-height: 580px;
        }
        .about-photo-col img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .about-photo-placeholder-box {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 12px;
          color: rgba(247,244,237,0.25);
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .about-content-col {
          padding: 80px 72px 80px 64px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .about-eyebrow {
          font-size: 0.63rem;
          color: var(--gold);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .about-eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
        .about-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 3.5vw, 48px);
          font-weight: 700;
          line-height: 1.12;
          color: var(--ivory);
          margin-bottom: 32px;
          letter-spacing: -0.01em;
        }
        .about-headline em { font-style: italic; color: var(--gold); }
        .about-body {
          font-size: 0.95rem;
          line-height: 1.85;
          color: rgba(247,244,237,0.8);
          margin-bottom: 20px;
          font-weight: 300;
        }
        .about-body strong { color: var(--ivory); font-weight: 500; }
        .about-pull-quote {
          margin: 36px 0;
          padding: 24px 28px;
          border-left: 2px solid var(--gold);
          background: rgba(13,27,42,0.25);
        }
        .about-pull-quote p {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          font-style: italic;
          line-height: 1.6;
          color: var(--ivory);
        }
        .about-pull-quote cite {
          display: block;
          font-size: 0.65rem;
          color: var(--gold);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-top: 12px;
          font-style: normal;
        }

        /* ======================== */
        /* SERVICES                 */
        /* ======================== */
        .services {
          background: var(--ivory);
          padding: 120px 72px;
        }
        .services-inner { max-width: 1100px; margin: 0 auto; }
        .services-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          margin-bottom: 80px;
          align-items: end;
        }
        .services-eyebrow {
          font-size: 0.63rem;
          color: var(--gold);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .services-eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
        .services-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 4vw, 52px);
          font-weight: 700;
          line-height: 1.1;
          color: var(--navy);
          letter-spacing: -0.02em;
        }
        .services-headline em { font-style: italic; color: var(--slate); }
        .services-intro {
          font-size: 0.95rem;
          line-height: 1.8;
          color: var(--text-muted);
          padding-top: 8px;
        }
        .services-list { display: flex; flex-direction: column; }
        .service-row {
          display: grid;
          grid-template-columns: 80px 1fr auto;
          gap: 32px;
          align-items: start;
          padding: 40px 0;
          border-top: 1px solid rgba(13,27,42,0.1);
          transition: all 0.25s ease;
          text-decoration: none;
          color: inherit;
        }
        .service-row:last-child { border-bottom: 1px solid rgba(13,27,42,0.1); }
        .service-row:hover .service-row-name { color: var(--slate); }
        .service-row:hover .service-arrow { transform: translateX(6px); color: var(--gold); }
        .service-row-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3rem;
          font-weight: 700;
          color: rgba(13,27,42,0.1);
          line-height: 1;
          padding-top: 4px;
          transition: color 0.25s;
        }
        .service-row:hover .service-row-num { color: rgba(76,120,160,0.2); }
        .service-row-content { }
        .service-row-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 10px;
          transition: color 0.25s;
          letter-spacing: -0.01em;
        }
        .service-row-desc {
          font-size: 0.88rem;
          line-height: 1.75;
          color: var(--text-muted);
          max-width: 520px;
        }
        .service-arrow {
          font-size: 1.1rem;
          color: rgba(13,27,42,0.25);
          transition: all 0.25s;
          padding-top: 8px;
          align-self: start;
        }

        /* ======================== */
        /* APPROACH                 */
        /* ======================== */
        .approach {
          background: var(--ivory-dark);
          padding: 120px 72px;
        }
        .approach-inner { max-width: 1100px; margin: 0 auto; }
        .approach-top {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          margin-bottom: 80px;
          align-items: center;
        }
        .approach-eyebrow {
          font-size: 0.63rem;
          color: var(--gold);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .approach-eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
        .approach-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 3.5vw, 48px);
          font-weight: 700;
          line-height: 1.12;
          color: var(--navy);
          letter-spacing: -0.02em;
        }
        .approach-headline em { font-style: italic; color: var(--slate); }
        .approach-desc {
          font-size: 0.95rem;
          line-height: 1.85;
          color: var(--text-muted);
        }
        .approach-steps {
          display: grid;
          grid-template-columns: 1fr 40px 1fr 40px 1fr;
          gap: 0;
          align-items: start;
        }
        .approach-step { }
        .approach-step-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.7rem;
          color: var(--gold);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .approach-step-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }
        .approach-step-body {
          font-size: 0.87rem;
          line-height: 1.75;
          color: var(--text-muted);
        }
        .approach-connector {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 54px;
          color: var(--gold);
          font-size: 1rem;
          opacity: 0.5;
        }

        /* ======================== */
        /* TESTIMONIALS             */
        /* ======================== */
        .testimonials {
          background: var(--slate);
          padding: 100px 72px;
        }
        .testimonials-inner { max-width: 1100px; margin: 0 auto; }
        .testimonials-eyebrow {
          font-size: 0.63rem;
          color: var(--gold);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 60px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .testimonials-eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
        .testimonial-item {
          padding: 40px 36px;
          background: rgba(13,27,42,0.2);
          transition: background 0.25s;
        }
        .testimonial-item:hover { background: rgba(13,27,42,0.3); }
        .testimonial-quote-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-style: italic;
          line-height: 1.7;
          color: rgba(247,244,237,0.85);
          margin-bottom: 28px;
        }
        .testimonial-quote-text::before { content: '\u201C'; }
        .testimonial-quote-text::after { content: '\u201D'; }
        .testimonial-author { font-size: 0.78rem; color: var(--gold); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500; }
        .testimonial-role { font-size: 0.72rem; color: rgba(247,244,237,0.35); margin-top: 4px; }
        .testimonials-empty {
          grid-column: 1/-1;
          padding: 60px 0;
          font-size: 0.88rem;
          color: rgba(247,244,237,0.3);
          font-style: italic;
        }

        /* ======================== */
        /* FINAL CTA                */
        /* ======================== */
        .final-cta {
          background: var(--ivory);
          padding: 140px 72px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .final-cta-inner { max-width: 1100px; margin: 0 auto; width: 100%; }
        .final-cta-left { }
        .final-cta-eyebrow {
          font-size: 0.63rem;
          color: var(--gold);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .final-cta-eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
        .final-cta-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(40px, 5vw, 62px);
          font-weight: 700;
          line-height: 1.1;
          color: var(--navy);
          letter-spacing: -0.02em;
        }
        .final-cta-headline em { font-style: italic; color: var(--slate); }
        .final-cta-right { }
        .final-cta-body {
          font-size: 1rem;
          line-height: 1.85;
          color: var(--text-muted);
          margin-bottom: 36px;
        }
        .final-cta-note {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-top: 20px;
          font-style: italic;
        }

        /* ======================== */
        /* RESPONSIVE               */
        /* ======================== */
        @media (max-width: 1024px) {
          .hero { grid-template-columns: 1fr; min-height: unset; }
          .hero-left { padding: 140px 40px 60px; }
          .hero-right { min-height: 480px; }
          .credentials-strip { padding: 0 40px; flex-wrap: wrap; }
          .credential-item { min-width: 50%; border-right: none; padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .about { grid-template-columns: 1fr; }
          .about-photo-col { min-height: 380px; }
          .about-content-col { padding: 60px 40px; }
          .services { padding: 80px 40px; }
          .services-header { grid-template-columns: 1fr; gap: 24px; }
          .approach { padding: 80px 40px; }
          .approach-top { grid-template-columns: 1fr; gap: 32px; }
          .approach-steps { grid-template-columns: 1fr; gap: 40px; }
          .approach-connector { display: none; }
          .testimonials { padding: 80px 40px; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .final-cta { grid-template-columns: 1fr; padding: 80px 40px; gap: 40px; }
        }
        @media (max-width: 640px) {
          .hero-left { padding: 120px 24px 48px; }
          .hero-headline { font-size: clamp(36px, 9vw, 52px); }
          .hero-btns { flex-direction: column; }
          .services { padding: 72px 24px; }
          .service-row { grid-template-columns: 60px 1fr; }
          .service-arrow { display: none; }
          .approach { padding: 72px 24px; }
          .testimonials { padding: 72px 24px; }
          .final-cta { padding: 72px 24px; }
          .credentials-strip { padding: 0 24px; }
          .credential-item { min-width: 100%; }
          .about-content-col { padding: 48px 24px; }
        }
      `}</style>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow">Executive Coaching and Consulting</div>
          <h1 className="hero-headline">
            {heroLines.map((line: string, i: number) => (
              <span key={i} style={{display:'block'}}>
                {i === heroLines.length - 1 ? <em>{line}</em> : line}
              </span>
            ))}
          </h1>
          <p className="hero-subtext">{g('hero_subtext', "You earned your success — and now you're looking to unlock what's next. Professionally, personally, relationally. All of it, together.")}</p>
          <p className="hero-subtext-2">{g('hero_subtext_2', 'I bring a lifetime of hard-won insights, alongside genuine curiosity and unwavering support, to help you get clear on what you want — and unlock the potential already in you to achieve it.')}</p>
          <div className="hero-btns">
            <a href="/contact" className="btn btn-primary">Schedule Your Free 15-Minute Intro Call →</a>
            <a href="/business" className="btn btn-outline">Explore Coaching →</a>
          </div>
        </div>
        <div className="hero-right">
          {c.hero_photo
            ? <img src={c.hero_photo} alt="John McCracken" className="hero-photo-img" />
            : null}
          <div className="hero-photo-overlay" />
          <div className="hero-photo-placeholder">
            {!c.hero_photo && <div className="hero-photo-label">Photo of John — coming soon</div>}
          </div>
        </div>
      </section>

      {/* ===== CREDENTIALS STRIP ===== */}
      <div className="credentials-strip">
        {[
          { num: '30', label: 'Years U.S. Navy leadership and command experience' },
          { num: 'CAPT', label: 'Commanding Officer, U.S. Navy (Ret.)' },
          { num: 'EMBA', label: 'Naval Postgraduate School' },
          { num: 'ACC', label: 'ICF Certified Coach' },
        ].map((cred, i) => (
          <div key={i} className="credential-item">
            <div className="credential-num">{cred.num}</div>
            <div className="credential-label">{cred.label}</div>
          </div>
        ))}
      </div>

      {/* ===== ABOUT / STORY ===== */}
      <section className="about">
        <div className="about-photo-col">
          {c.about_photo
            ? <img src={c.about_photo} alt="John McCracken" />
            : <div className="about-photo-placeholder-box">
                <div style={{fontSize:40, opacity:0.2}}>📷</div>
                <span>Photo of John</span>
                <span>Coming soon</span>
              </div>
          }
        </div>
        <div className="about-content-col">
          <div className="about-eyebrow">About John McCracken</div>
          <h2 className="about-headline">{g('about_title', 'The immediate challenge is rarely')}<br /><em>the whole story.</em></h2>
          <p className="about-body">{g('about_body_1', 'I inherited one of the most underperforming commands in the Naval Reserve — a Reserve Center of 76 personnel responsible for over 3,000 Sailors around the nation and the globe. Morale was broken, performance and customer satisfaction were low. It was an organization that had stopped believing in itself.')}</p>
          <p className="about-body"><strong>{g('about_body_2', "What turned it around wasn't a new strategy or a reorganization. It was learning to lead and care for the whole person in the room — starting with myself. Two years later, that command was recognized as the best large Center in the nation.")}</strong></p>
          <div className="about-pull-quote">
            <p>{g('about_quote', 'The immediate challenge is rarely the whole story. When we address the whole person, something unlocks. Potential they didn\'t know they had. Clarity they couldn\'t find alone.')}</p>
            <cite>John McCracken</cite>
          </div>
          <p className="about-body" style={{marginBottom:32}}>{g('about_body_3', "That's what I bring to every client.")}</p>
          <a href="/contact" className="btn btn-outline-light" style={{alignSelf:'flex-start'}}>Read more of my story →</a>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="services">
        <div className="services-inner">
          <div className="services-header">
            <div>
              <div className="services-eyebrow">What I Offer</div>
              <h2 className="services-headline">Support for <em>every</em><br />stage of leadership.</h2>
            </div>
            <p className="services-intro">{g('services_intro', 'Whether you are leading an organization, navigating a transition, or ready to invest in your own growth — the work is the same. We start where you are.')}</p>
          </div>
          <div className="services-list">
            {services.map((s, i) => (
              <a key={i} href={s.href} className="service-row">
                <div className="service-row-num">{s.num}</div>
                <div className="service-row-content">
                  <div className="service-row-name">{s.name}</div>
                  <div className="service-row-desc">{s.desc}</div>
                </div>
                <div className="service-arrow">→</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== APPROACH ===== */}
      <section className="approach">
        <div className="approach-inner">
          <div className="approach-top">
            <div>
              <div className="approach-eyebrow">My Approach</div>
              <h2 className="approach-headline">Coaching that follows<br /><em>your lead.</em></h2>
            </div>
            <p className="approach-desc">{g('approach_desc', "You bring what's most present in the moment — the decision, the thing you can't stop thinking about — and we work through it together. Because life doesn't separate neatly into professional and personal, we don't either.")}</p>
          </div>
          <div className="approach-steps">
            {[
              {
                num: '01',
                title: g('approach1_title', 'You Bring What\'s Present'),
                body: g('approach1_desc', 'The decision. The challenge. The thing you can\'t stop thinking about. We start there — not with a framework, not with an agenda. With what\'s actually on your mind.'),
              },
              null,
              {
                num: '02',
                title: g('approach2_title', 'We Explore It Together'),
                body: g('approach2_desc', 'We explore your values, challenge assumptions, and open perspectives you may not have considered from inside the situation. You lead the way.'),
              },
              null,
              {
                num: '03',
                title: g('approach3_title', 'You Move Forward'),
                body: g('approach3_desc', 'Every session produces something concrete: a commitment you define, a step you choose, a thing you finally decide to do. Insight without action is just a conversation — we go beyond that.'),
              },
            ].map((item, i) => item === null
              ? <div key={i} className="approach-connector">→</div>
              : <div key={i} className="approach-step">
                  <div className="approach-step-num">{item.num}</div>
                  <div className="approach-step-title">{item.title}</div>
                  <p className="approach-step-body">{item.body}</p>
                </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      {displayTestimonials.length > 0 && (
        <section className="testimonials">
          <div className="testimonials-inner">
            <div className="testimonials-eyebrow">What Clients Say</div>
            <div className="testimonials-grid">
              {displayTestimonials.map((t) => (
                <div key={t.id} className="testimonial-item">
                  <div className="testimonial-quote-text">{t.quote}</div>
                  <div className="testimonial-author">{t.name}</div>
                  <div className="testimonial-role">{[t.role, t.company].filter(Boolean).join(' · ')}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== FINAL CTA ===== */}
      <section className="final-cta">
        <div style={{maxWidth:1100,margin:'0 auto',width:'100%',display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center'}}>
          <div>
            <div className="final-cta-eyebrow">Get Started</div>
            <div className="final-cta-headline">
              That's the work.<br />
              And it starts with<br />
              <em>a single conversation.</em>
            </div>
          </div>
          <div>
            <p className="final-cta-body">{g('cta_desc', "No pitch. No pressure. Just a direct conversation about where you are, what you'd like the future to hold — and whether this is the right fit for getting there. Together we get Beyond your Horizon.")}</p>
            <a href="/contact" className="btn btn-primary">Schedule Your Free 15-Minute Intro Call →</a>
            <p className="final-cta-note">john@mccrackencoaching.com · 703-705-2225</p>
          </div>
        </div>
      </section>
    </>
  )
}