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

  const credentials = g('about_credentials',
    'Commanding Officer, U.S. Navy — 30 years of progressively responsible leadership, command, and strategic development positions\nDirector, Manpower and Human Capital Strategy — Department of the Navy\nExecutive Coach and Director — Office of the Secretary of Defense, 7 years'
  ).split('\n').filter(Boolean)

  const services = [
    { num: '01', name: g('service1_name', 'Business Coaching'), desc: g('service1_desc', 'Strategic coaching for organizations, executives, and teams navigating complexity, change, and growth.'), href: '/business' },
    { num: '02', name: g('service2_name', 'Individual Coaching'), desc: g('service2_desc', 'One on one coaching for professionals and leaders ready to unlock what is next — professionally, personally, relationally.'), href: '/individual' },
    { num: '03', name: g('service3_name', 'Mission-Ready Leadership'), desc: g('service3_desc', 'A science-grounded, whole-person coaching program built around the 8 Pillars of Mission-Ready Leadership — for executives, teams, organizations, and individuals in transition.'), href: '/mission-ready-leadership' },
    { num: '04', name: g('service4_name', 'Strategic Consulting'), desc: g('service4_desc', 'Experienced guidance for complex organizational challenges — from strategy to change management and leadership development.'), href: '/contact' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');

        :root {
          --ivory: #F7F4ED;
          --ivory-dark: #EDE8DC;
          --slate: #4C78A0;
          --slate-mid: #3A607F;
          --slate-light: #6B9ABF;
          --slate-pale: #E8EFF5;
          --navy: #0D1B2A;
          --gold: #C9A23A;
          --white: #FFFFFF;
          --text: #1C2B3A;
          --text-mid: #3D5166;
          --text-muted: #6B7A8D;
          --rule: rgba(28,43,58,0.12);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: var(--ivory); color: var(--text); font-family: 'Inter', sans-serif; font-weight: 300; overflow-x: hidden; -webkit-font-smoothing: antialiased; }

        .btn { display: inline-flex; align-items: center; gap: 9px; padding: 13px 28px; font-size: 0.72rem; letter-spacing: 0.07em; text-transform: uppercase; text-decoration: none; transition: all 0.22s ease; font-weight: 500; cursor: pointer; border: none; font-family: 'Inter', sans-serif; }
        .btn-navy { background: var(--navy); color: var(--ivory); }
        .btn-navy:hover { background: var(--slate-mid); }
        .btn-outline { background: transparent; color: var(--text); border: 1px solid rgba(28,43,58,0.28); }
        .btn-outline:hover { background: var(--navy); color: var(--ivory); border-color: var(--navy); }
        .btn-outline-light { background: transparent; color: var(--ivory); border: 1px solid rgba(247,244,237,0.35); }
        .btn-outline-light:hover { background: rgba(247,244,237,0.1); }

        /* ============================================================
           HERO
           Split: left ivory with copy, right slate with photo.
           Vertical slate rule divides them — the site's quiet signature.
           No eyebrow. No decorative type. John's words create the hierarchy.
        ============================================================ */
        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: var(--ivory);
          position: relative;
        }
        .hero-divider {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--slate);
          opacity: 0.25;
          z-index: 3;
          transform: translateX(-50%);
        }
        .hero-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 140px 72px 80px 72px;
          position: relative;
          z-index: 2;
        }
        .hero-context {
          font-size: 0.72rem;
          color: var(--text-muted);
          letter-spacing: 0.04em;
          margin-bottom: 36px;
          font-weight: 400;
        }
        .hero-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(38px, 4.2vw, 54px);
          font-weight: 400;
          line-height: 1.15;
          color: var(--text);
          margin-bottom: 28px;
          letter-spacing: -0.01em;
        }
        .hero-headline em {
          font-style: italic;
          color: var(--slate-mid);
        }
        .hero-body {
          font-size: 1rem;
          line-height: 1.8;
          color: var(--text-mid);
          margin-bottom: 14px;
          max-width: 420px;
          font-weight: 300;
        }
        .hero-body-2 {
          font-size: 0.9rem;
          line-height: 1.85;
          color: var(--text-muted);
          margin-bottom: 44px;
          max-width: 420px;
        }
        .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }

        .hero-right {
          position: relative;
          background: var(--slate);
          overflow: hidden;
        }
        .hero-photo-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }
        .hero-photo-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 60%, rgba(13,27,42,0.35) 100%);
        }
        .hero-photo-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 10px;
          color: rgba(247,244,237,0.2);
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* ============================================================
           CREDENTIALS
           Slate pale background. Typographic only. No decorative devices.
           Reads as a quiet authority statement, not a marketing badge row.
        ============================================================ */
        .credentials {
          background: var(--slate-pale);
          padding: 48px 72px;
          border-top: 1px solid rgba(76,120,160,0.15);
          border-bottom: 1px solid rgba(76,120,160,0.15);
        }
        .credentials-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          gap: 0;
          align-items: stretch;
        }
        .credential-item {
          flex: 1;
          padding: 0 36px;
          border-right: 1px solid rgba(76,120,160,0.2);
        }
        .credential-item:first-child { padding-left: 0; }
        .credential-item:last-child { border-right: none; }
        .credential-main {
          font-family: 'DM Serif Display', serif;
          font-size: 1.05rem;
          font-weight: 400;
          color: var(--slate-mid);
          line-height: 1.3;
          margin-bottom: 4px;
        }
        .credential-detail {
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.5;
          font-weight: 400;
        }

        /* ============================================================
           ABOUT / STORY
           Slate blue background. Photo left, story right.
           Story opens directly with John's copy — no section label needed.
           Pull quote uses a slate vertical rule, not gold.
        ============================================================ */
        .about {
          background: var(--slate);
          display: grid;
          grid-template-columns: 5fr 7fr;
          min-height: 660px;
        }
        .about-photo {
          position: relative;
          overflow: hidden;
          background: var(--slate-mid);
        }
        .about-photo img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .about-photo-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 10px;
          color: rgba(247,244,237,0.18);
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .about-content {
          padding: 80px 72px 80px 64px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .about-name {
          font-size: 0.72rem;
          color: rgba(247,244,237,0.5);
          letter-spacing: 0.06em;
          margin-bottom: 28px;
          font-weight: 400;
        }
        .about-opening {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 2.6vw, 32px);
          font-weight: 400;
          line-height: 1.3;
          color: var(--ivory);
          margin-bottom: 24px;
          letter-spacing: -0.01em;
          max-width: 520px;
        }
        .about-body {
          font-size: 0.93rem;
          line-height: 1.85;
          color: rgba(247,244,237,0.75);
          margin-bottom: 20px;
          font-weight: 300;
        }
        .about-body strong {
          color: rgba(247,244,237,0.92);
          font-weight: 500;
        }
        .about-pull {
          margin: 28px 0;
          padding: 18px 24px;
          border-left: 2px solid var(--slate-light);
          background: rgba(13,27,42,0.2);
        }
        .about-pull p {
          font-family: 'Lora', serif;
          font-size: 1rem;
          font-style: italic;
          line-height: 1.7;
          color: rgba(247,244,237,0.88);
        }

        /* ============================================================
           SERVICES
           Ivory background. Heading present — it improves usability.
           Listed as a clean numbered typographic list.
           No cards. No icons. Hover is a subtle left shift.
        ============================================================ */
        .services {
          background: var(--ivory);
          padding: 112px 72px;
        }
        .services-inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .services-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          margin-bottom: 72px;
          align-items: end;
          padding-bottom: 40px;
          border-bottom: 1px solid var(--rule);
        }
        .services-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(28px, 3vw, 38px);
          font-weight: 400;
          line-height: 1.2;
          color: var(--text);
          letter-spacing: -0.01em;
        }
        .services-intro {
          font-size: 0.92rem;
          line-height: 1.8;
          color: var(--text-muted);
        }
        .services-list { display: flex; flex-direction: column; }
        .service-item {
          display: grid;
          grid-template-columns: 56px 1fr;
          gap: 28px;
          align-items: start;
          padding: 32px 0;
          border-bottom: 1px solid var(--rule);
          text-decoration: none;
          color: inherit;
          transition: padding-left 0.2s ease;
        }
        .service-item:hover { padding-left: 8px; }
        .service-item:hover .service-name { color: var(--slate-mid); }
        .service-num {
          font-family: 'DM Serif Display', serif;
          font-size: 1rem;
          font-weight: 400;
          color: var(--text-muted);
          padding-top: 3px;
          line-height: 1;
        }
        .service-name {
          font-family: 'DM Serif Display', serif;
          font-size: 1.25rem;
          font-weight: 400;
          color: var(--text);
          margin-bottom: 8px;
          letter-spacing: -0.01em;
          transition: color 0.2s;
          line-height: 1.25;
        }
        .service-desc {
          font-size: 0.86rem;
          line-height: 1.7;
          color: var(--text-muted);
          max-width: 520px;
        }

        /* ============================================================
           APPROACH
           Ivory dark background. Opens directly with John's phrase —
           confirmed from bio: "Coaching that follows your lead."
           Three steps as plain numbered prose. No visual devices.
        ============================================================ */
        .approach {
          background: var(--ivory-dark);
          padding: 112px 72px;
        }
        .approach-inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .approach-lead {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(28px, 3.2vw, 42px);
          font-weight: 400;
          font-style: italic;
          color: var(--text);
          line-height: 1.2;
          margin-bottom: 20px;
          max-width: 560px;
          letter-spacing: -0.01em;
        }
        .approach-sub {
          font-size: 0.9rem;
          line-height: 1.8;
          color: var(--text-muted);
          max-width: 560px;
          margin-bottom: 64px;
        }
        .approach-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 56px;
          padding-top: 48px;
          border-top: 1px solid var(--rule);
        }
        .step-num {
          font-size: 0.68rem;
          color: var(--slate);
          letter-spacing: 0.08em;
          margin-bottom: 14px;
          font-weight: 500;
        }
        .step-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.15rem;
          font-weight: 400;
          color: var(--text);
          margin-bottom: 12px;
          line-height: 1.3;
        }
        .step-body {
          font-size: 0.87rem;
          line-height: 1.78;
          color: var(--text-muted);
        }

        /* ============================================================
           TESTIMONIALS
           Slate blue. Stacked vertically with rules between.
           Lora italic for quote text. No cards.
        ============================================================ */
        .testimonials {
          background: var(--slate);
          padding: 100px 72px;
        }
        .testimonials-inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .testimonials-label {
          font-size: 0.72rem;
          color: rgba(247,244,237,0.45);
          letter-spacing: 0.06em;
          margin-bottom: 52px;
          font-weight: 400;
        }
        .testimonial-stack { display: flex; flex-direction: column; }
        .testimonial-entry {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 48px;
          align-items: start;
          padding: 36px 0;
          border-top: 1px solid rgba(247,244,237,0.1);
        }
        .testimonial-entry:last-child { border-bottom: 1px solid rgba(247,244,237,0.1); }
        .testimonial-text {
          font-family: 'Lora', serif;
          font-size: 1.05rem;
          font-style: italic;
          line-height: 1.72;
          color: rgba(247,244,237,0.85);
        }
        .testimonial-attr {
          text-align: right;
          min-width: 180px;
        }
        .testimonial-name {
          font-size: 0.8rem;
          color: rgba(247,244,237,0.7);
          font-weight: 500;
          margin-bottom: 3px;
        }
        .testimonial-role {
          font-size: 0.72rem;
          color: rgba(247,244,237,0.38);
        }

        /* ============================================================
           FINAL CTA
           Ivory. Quiet close. John's exact words from the bio.
           Left: his statement. Right: his description and CTA.
        ============================================================ */
        .final-cta {
          background: var(--ivory);
          padding: 120px 72px;
          border-top: 1px solid var(--rule);
        }
        .final-cta-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .cta-statement {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(28px, 3.2vw, 40px);
          font-weight: 400;
          line-height: 1.25;
          color: var(--text);
          letter-spacing: -0.01em;
        }
        .cta-statement em {
          font-style: italic;
          color: var(--slate-mid);
        }
        .cta-body {
          font-size: 0.93rem;
          line-height: 1.85;
          color: var(--text-muted);
          margin-bottom: 32px;
        }
        .cta-note {
          margin-top: 18px;
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .cta-note a {
          color: var(--slate-mid);
          text-decoration: none;
        }
        .cta-note a:hover { text-decoration: underline; }

        /* ============================================================
           RESPONSIVE
        ============================================================ */
        @media (max-width: 1024px) {
          .hero { grid-template-columns: 1fr; min-height: unset; }
          .hero-divider { display: none; }
          .hero-left { padding: 130px 48px 60px; }
          .hero-right { min-height: 480px; }
          .credentials { padding: 40px 48px; }
          .credentials-inner { flex-wrap: wrap; }
          .credential-item { min-width: 48%; padding: 16px 20px; border-right: none; border-bottom: 1px solid rgba(76,120,160,0.2); }
          .credential-item:nth-child(odd) { border-right: 1px solid rgba(76,120,160,0.2); }
          .about { grid-template-columns: 1fr; }
          .about-photo { min-height: 400px; }
          .about-content { padding: 60px 48px; }
          .services { padding: 80px 48px; }
          .services-header { grid-template-columns: 1fr; gap: 20px; }
          .approach { padding: 80px 48px; }
          .approach-steps { grid-template-columns: 1fr; gap: 36px; }
          .testimonials { padding: 80px 48px; }
          .testimonial-entry { grid-template-columns: 1fr; gap: 16px; }
          .testimonial-attr { text-align: left; }
          .final-cta { padding: 80px 48px; }
          .final-cta-inner { grid-template-columns: 1fr; gap: 40px; }
        }
        @media (max-width: 640px) {
          .hero-left { padding: 110px 24px 48px; }
          .hero-headline { font-size: clamp(32px, 8vw, 44px); }
          .hero-btns { flex-direction: column; }
          .credentials { padding: 32px 24px; }
          .credential-item { min-width: 100%; border-right: none; }
          .credential-item:nth-child(odd) { border-right: none; }
          .about-content { padding: 48px 24px; }
          .services { padding: 64px 24px; }
          .approach { padding: 64px 24px; }
          .testimonials { padding: 64px 24px; }
          .final-cta { padding: 64px 24px; }
        }
      `}</style>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-divider" />
        <div className="hero-left">
          <p className="hero-context">John McCracken, EMBA, ACC — Executive Coaching and Consulting</p>
          <h1 className="hero-headline">
            {g('hero_headline', 'I help people find and get\nwhat they want.').split('\n').map((line: string, i: number) => (
              <span key={i} style={{display:'block'}}>{line}</span>
            ))}
          </h1>
          <p className="hero-body">{g('hero_subtext', "You earned your success — and now you're looking to unlock what's next. Professionally, personally, relationally. All of it, together.")}</p>
          <p className="hero-body-2">{g('hero_subtext_2', 'I bring a lifetime of hard-won insights, alongside genuine curiosity and unwavering support, to help you get clear on what you want — and unlock the potential already in you to achieve it.')}</p>
          <div className="hero-btns">
            <a href="/contact" className="btn btn-navy">Schedule Your Free 15-Minute Intro Call</a>
            <a href="/business" className="btn btn-outline">Explore Coaching</a>
          </div>
        </div>
        <div className="hero-right">
          {c.hero_photo
            ? <><img src={c.hero_photo} alt="John McCracken" className="hero-photo-img" /><div className="hero-photo-scrim" /></>
            : <div className="hero-photo-placeholder"><span style={{fontSize:32,opacity:0.15}}>📷</span><span>Photo of John</span><span>Coming soon</span></div>
          }
        </div>
      </section>

      {/* ===== CREDENTIALS ===== */}
      <div className="credentials">
        <div className="credentials-inner">
          {[
            { main: '30 Years', detail: 'U.S. Navy — leadership, command, and strategic development' },
            { main: 'CAPT, USN (Ret.)', detail: 'Commanding Officer and Director-level roles' },
            { main: 'EMBA', detail: 'Naval Postgraduate School' },
            { main: 'ACC — ICF', detail: 'Associate Certified Coach, International Coaching Federation' },
          ].map((cred, i) => (
            <div key={i} className="credential-item">
              <div className="credential-main">{cred.main}</div>
              <div className="credential-detail">{cred.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== ABOUT / STORY ===== */}
      <section className="about">
        <div className="about-photo">
          {c.about_photo
            ? <img src={c.about_photo} alt="John McCracken" />
            : <div className="about-photo-placeholder"><span style={{fontSize:32,opacity:0.15}}>📷</span><span>Photo of John</span><span>Coming soon</span></div>
          }
        </div>
        <div className="about-content">
          <div className="about-name">About John McCracken</div>
          <h2 className="about-opening">{g('about_title', 'I know what it\'s like to wake up in the middle of the night wondering how to do it all — and do it all well.')}</h2>
          <p className="about-body">{g('about_body_1', 'Supporting a family, leading at work, taking care of yourself and your relationships, pursuing goals that matter — the weight of it is real. Most people carry it alone.')}</p>
          <p className="about-body"><strong>{g('about_body_2', "What turned it around wasn't a new strategy or a reorganization. It was learning to lead and care for the whole person in the room — starting with myself. Two years later, that command was recognized as the best large Center in the nation.")}</strong></p>
          <div className="about-pull">
            <p>{g('about_quote', 'The immediate challenge is rarely the whole story. When we address the whole person — every dimension of who they are and what they\'re carrying — something unlocks.')}</p>
          </div>
          <p className="about-body" style={{marginBottom:32}}>{g('about_body_3', "That's what I bring to every client.")}</p>
          <a href="/about" className="btn btn-outline-light" style={{alignSelf:'flex-start'}}>Read John's story</a>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="services">
        <div className="services-inner">
          <div className="services-header">
            <h2 className="services-heading">How I can help.</h2>
            <p className="services-intro">{g('services_intro', 'Whether you are leading an organization, navigating a transition, or ready to invest in your own growth — the work is the same.')}</p>
          </div>
          <div className="services-list">
            {services.map((s, i) => (
              <a key={i} href={s.href} className="service-item">
                <div className="service-num">0{i+1}</div>
                <div>
                  <div className="service-name">{s.name}</div>
                  <div className="service-desc">{s.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== APPROACH ===== */}
      <section className="approach">
        <div className="approach-inner">
          <h2 className="approach-lead">Coaching that follows your lead.</h2>
          <p className="approach-sub">{g('approach_desc', "You bring what's most present in the moment — the decision, the thing you can't stop thinking about — and we work through it together. Because life doesn't separate neatly into professional and personal, we don't either.")}</p>
          <div className="approach-steps">
            {[
              { num: '01', body: g('approach1_desc', "You bring what's most present in the moment — the decision, the thing you can't stop thinking about — and we work through it together.") },
              { num: '02', body: g('approach2_desc', "We explore your values, challenge assumptions, and open perspectives you may not have considered from inside the situation. You lead the way.") },
              { num: '03', body: g('approach3_desc', "Insight without action is just an interesting conversation — we go beyond that. Every session produces something concrete: a commitment you define, a step you choose, a thing you finally decide to do. You keep pushing forward.") },
            ].map((step, i) => (
              <div key={i}>
                <div className="step-num">{step.num}</div>
                <p className="step-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS — only renders when content exists ===== */}
      {testimonials.length > 0 && (
        <section className="testimonials">
          <div className="testimonials-inner">
            <div className="testimonials-label">What clients say</div>
            <div className="testimonial-stack">
              {testimonials.map((t) => (
                <div key={t.id} className="testimonial-entry">
                  <div className="testimonial-text">{t.quote}</div>
                  <div className="testimonial-attr">
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{[t.role, t.company].filter(Boolean).join(', ')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== FINAL CTA ===== */}
      <section className="final-cta">
        <div className="final-cta-inner">
          <div className="cta-statement">
            That's the work. And it starts with a single conversation.
          </div>
          <div>
            <p className="cta-body">{g('cta_desc', "No pitch. No pressure. Just a direct conversation about where you are, what you'd like the future to hold — and whether this is the right fit for getting there.")}</p>
            <a href="/contact" className="btn btn-navy">Schedule Your Free 15-Minute Intro Call</a>
            <p className="cta-note">
              <a href="mailto:john@mccrackencoaching.com">john@mccrackencoaching.com</a> · 703-343-6960
            </p>
          </div>
        </div>
      </section>
    </>
  )
}