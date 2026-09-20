'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import TestimonialSlider from '../../components/TestimonialSlider'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const services = [
  {
    num: '01',
    name: 'Executive Coaching',
    audience: 'For Individuals and Organizations',
    desc: 'One-to-one coaching that addresses the professional challenge in front of you and everything connected to it.',
    href: '/executive-coaching',
  },
  {
    num: '02',
    name: 'Transition Coaching',
    audience: 'For Individuals',
    desc: 'Structured coaching for military and federal professionals navigating what comes next.',
    href: '/transition-coaching',
  },
  {
    num: '03',
    name: 'Mission-Ready Leadership',
    audience: 'For Executives, Teams, Organizations and Individuals in Transition',
    desc: 'A science-grounded, whole-person coaching program built around the 8 Pillars of Mission-Ready Leadership.',
    href: '/mission-ready-leadership',
  },
  {
    num: '04',
    name: 'Leadership Consulting',
    audience: 'For Organizations',
    desc: 'Custom design and delivery of leadership development systems for mission-driven enterprises and federal agencies.',
    href: '/leadership-consulting',
  },
]

const audiences = [
  { num: '01', name: 'Senior Executives and Leaders', line: 'Ready for the next level, and looking for a more sustainable way to lead.', href: '/executive-coaching' },
  { num: '02', name: 'High-Potential Professionals', line: 'Identified as ready for more, building the capabilities that make growth last.', href: '/executive-coaching' },
  { num: '03', name: 'Military and Federal Professionals in Transition', line: 'Navigating what comes next, across career, identity, and life.', href: '/transition-coaching' },
  { num: '04', name: 'Over-Stressed Professionals', line: 'Succeeding but running on empty, looking for sustainable footing.', href: '/executive-coaching' },
]

const defaultTestimonials = [{
  id: 'linnea',
  name: 'Linnea Landowski',
  role: 'Director of Camping-Programs, Scouting America, Western Los Angeles County Council',
  company: '',
  quote: "When I started coaching, I was looking to become a stronger leader. What I found was far more transformative. Through our work together, I learned that empathy and accountability are not opposites — and that much of my identity and self-worth had become tied to my work in ways that weren't serving me. Coaching helped me redefine success to include my relationships, health, and personal happiness — not just professional achievement. Rather than giving me answers, John consistently asked the right questions, helping me uncover insights that felt authentic and sustainable. I leave with greater confidence, stronger boundaries, and a much deeper understanding of the value I bring as both a leader and a person.",
}]

export default function Home2() {
  const [testimonials, setTestimonials] = useState(defaultTestimonials)
  const [active, setActive] = useState(0)
  const [panelFading, setPanelFading] = useState(false)

  useEffect(() => {
    supabase.from('testimonials').select('*').eq('is_active', true).order('sort_order')
      .then(({ data }) => { if (data && data.length > 0) setTestimonials(data) })
  }, [])

  function selectService(i: number) {
    if (i === active) return
    setPanelFading(true)
    setTimeout(() => { setActive(i); setPanelFading(false) }, 200)
  }

  function handleKey(e: React.KeyboardEvent, i: number) {
    if (e.key === 'ArrowDown') { e.preventDefault(); selectService(Math.min(i + 1, services.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); selectService(Math.max(i - 1, 0)) }
  }

  const svc = services[active]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&family=Lora:ital,wght@0,400;1,400;1,500&display=swap');

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
           1. HERO
           Full-width composition. Photo fills right 58%, fades left
           into ivory so John/anchor stay sharp, environment dissolves.
           Text sits on ivory left area with enough clearance.
        ============================================================ */
        .hero {
          min-height: 100vh;
          position: relative;
          background: var(--ivory);
          overflow: hidden;
          display: flex;
          align-items: stretch;
        }
        /* Photo layer: fills the full hero, positioned to show John right-center */
        .hero-photo-wrap {
          position: absolute; inset: 0; z-index: 1;
        }
        .hero-photo-img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; object-position: center top; display: block;
        }
        /* Fade overlay: ivory from left, transparent by ~55% of width
           This dissolves the environmental left side of the photo
           while leaving John and the anchor sharp on the right */
        .hero-photo-fade {
          position: absolute; inset: 0; z-index: 2;
          background: linear-gradient(
            to right,
            #F7F4ED 0%,
            #F7F4ED 30%,
            rgba(247,244,237,0.9) 40%,
            rgba(247,244,237,0.4) 50%,
            rgba(247,244,237,0.05) 62%,
            rgba(247,244,237,0) 72%
          );
        }
        /* Text content sits above both layers */
        .hero-left {
          position: relative; z-index: 3;
          display: flex; flex-direction: column; justify-content: center;
          padding: 140px 72px 80px;
          width: 52%;
          min-height: 100vh;
        }
        .hero-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(38px, 4.4vw, 58px);
          font-weight: 400; line-height: 1.12; color: var(--text);
          letter-spacing: -0.02em; max-width: 480px; margin-bottom: 36px;
        }
        .hero-credential {
          font-size: 0.78rem; color: var(--text-muted); font-weight: 400;
          line-height: 1.7; max-width: 420px; margin-bottom: 40px;
        }
        .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }
        /* Divider removed — replaced by gradient transition */
        .hero-divider { display: none; }
        /* hero-right no longer needed as a layout column */
        .hero-right { display: none; }

        /* ============================================================
           2. THE DIFFERENCE
           Ivory dark. Headline occupies full canvas at display scale.
           Two supporting sentences + thesis offset right below.
        ============================================================ */
        .difference {
          background: var(--ivory-dark);
          padding: 120px 72px;
        }
        .difference-inner { max-width: 1320px; }
        .difference-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(42px, 6vw, 88px);
          font-weight: 400; line-height: 1.06;
          color: var(--text); letter-spacing: -0.025em;
          max-width: 960px; margin-bottom: 0;
        }
        .difference-right {
          margin-top: 56px;
          margin-left: auto;
          max-width: 440px;
        }
        .difference-support {
          font-size: 1rem; line-height: 1.82;
          color: var(--text-mid); margin-bottom: 24px; font-weight: 300;
        }
        .difference-thesis {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(18px, 1.8vw, 22px);
          font-weight: 400; color: var(--text);
          letter-spacing: -0.01em; line-height: 1.4;
        }

        /* Cherry blossom */
        .cherry-break { line-height: 0; overflow: hidden; }
        .cherry-img { width: 100%; height: auto; display: block; max-height: 520px; object-fit: cover; object-position: center 30%; }

        /* ============================================================
           3. WHO WE WORK WITH
           Left anchor (~28%) + 2x2 editorial matrix (~72%).
           Compact, full-width, no stagger, no cards.
        ============================================================ */
        .audiences {
          background: var(--slate-pale);
          padding: 80px 72px;
          border-top: none;
        }
        .audiences-inner {
          max-width: 1320px; margin: 0 auto;
          display: grid;
          grid-template-columns: 28fr 72fr;
          gap: 0 60px;
          align-items: start;
        }
        /* Left anchor: heading stays top-left and acts as visual weight */
        .audiences-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(20px, 2vw, 26px);
          font-weight: 400; color: var(--text);
          letter-spacing: -0.01em; line-height: 1.3;
          padding-top: 4px;

        }
        /* 2x2 matrix */
        .audiences-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }
        .audience-item {
          padding: 28px 32px 28px 0;
          border-top: 1px solid rgba(76,120,160,0.18);
        }
        /* Right column items get left padding instead of right */
        .audience-item:nth-child(even) {
          padding-left: 32px;
          padding-right: 0;
          border-left: 1px solid rgba(76,120,160,0.18);
        }
        .audience-num {
          font-size: 0.63rem; color: var(--slate-mid);
          font-weight: 500; letter-spacing: 0.05em;
          margin-bottom: 8px; display: block;
        }
        .audience-name {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(18px, 1.8vw, 22px);
          font-weight: 400; color: var(--text);
          letter-spacing: -0.01em; line-height: 1.2;
          margin-bottom: 8px;
        }
        .audience-line {
          font-size: 0.87rem; line-height: 1.65;
          color: var(--text-muted); font-weight: 300;
          margin-bottom: 12px;
        }
        .audience-link {
          font-size: 0.73rem; color: var(--slate-mid);
          text-decoration: none; font-weight: 500;
          letter-spacing: 0.04em;
          display: inline-flex; align-items: center; gap: 6px;
          transition: gap 0.2s;
        }
        .audience-link:hover { gap: 12px; }

        /* ============================================================
           4. WAYS TO WORK TOGETHER
           Ivory. Same selector interaction, panel leaner.
           Service name scales up — it's the destination, not a label.
        ============================================================ */
        .services-section {
          background: var(--ivory);
          padding: 100px 72px;
          border-top: none;
        }
        .services-inner { max-width: 1320px; margin: 0 auto; }
        .services-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 2.4vw, 30px);
          font-weight: 400; color: var(--text);
          margin-bottom: 40px; letter-spacing: -0.01em;
        }
        /* Selector: slate left index panel + ivory right panel
           The slate index IS the visual density — no dark section bg needed */
        .services-selector {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 0;
        }
        /* Slate index panel — the architectural anchor of the section */
        .svc-index { background: var(--slate); }
        .svc-index-btn {
          display: block; width: 100%; background: none; border: none;
          border-bottom: none; padding: 40px 36px 40px 32px;
          text-align: left; cursor: pointer; position: relative;
          transition: background 0.15s;
        }
        .svc-index-btn + .svc-index-btn { border-top: 1px solid rgba(247,244,237,0.1); }
        .svc-index-btn:focus-visible { outline: 2px solid rgba(247,244,237,0.6); outline-offset: -2px; z-index: 1; }
        .svc-index-btn.active { background: rgba(255,255,255,0.1); }
        .svc-index-btn.active::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 3px; background: var(--gold);
        }
        .svc-index-num { font-size: 0.65rem; color: rgba(247,244,237,0.45); letter-spacing: 0.04em; margin-bottom: 8px; font-weight: 400; display: block; }
        .svc-index-btn.active .svc-index-num { color: rgba(247,244,237,0.7); }
        .svc-index-name {
          font-family: 'DM Serif Display', serif; font-size: 1.2rem;
          font-weight: 400; color: rgba(247,244,237,0.65); line-height: 1.3;
          letter-spacing: -0.01em; display: block; transition: color 0.15s;
        }
        .svc-index-btn.active .svc-index-name { color: var(--ivory); }
        .svc-index-btn:hover:not(.active) .svc-index-name { color: rgba(247,244,237,0.85); }
        .svc-panel { background: var(--ivory-dark); padding: 72px 80px; display: flex; flex-direction: column; justify-content: center; min-height: 380px; }
        .svc-panel-content { transition: opacity 0.2s ease; }
        .svc-panel-content.fading { opacity: 0; }
        .svc-panel-content.visible { opacity: 1; }
        /* Service name scales up in panel — it's the centerpiece */
        .svc-panel-name {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(36px, 4.8vw, 64px);
          font-weight: 400; color: var(--text);
          letter-spacing: -0.02em; line-height: 1.08; margin-bottom: 12px;
        }
        .svc-panel-audience { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 20px; font-weight: 400; }
        .svc-panel-desc { font-size: 0.93rem; line-height: 1.78; color: var(--text-mid); max-width: 480px; font-weight: 300; margin-bottom: 28px; }
        .svc-panel-link {
          font-size: 0.78rem; color: var(--slate-mid); text-decoration: none;
          letter-spacing: 0.04em; font-weight: 500;
          display: inline-flex; align-items: center; gap: 8px; transition: gap 0.2s;
        }
        .svc-panel-link:hover { gap: 14px; }

        /* Mobile services list */
        .services-mobile { display: none; }
        .svc-mobile-item {
          padding: 28px 0; border-bottom: 1px solid var(--rule);
          text-decoration: none; color: inherit; display: block;
        }
        .svc-mobile-item:first-child { border-top: 1px solid var(--rule); }
        .svc-mobile-num { font-size: 0.65rem; color: var(--text-muted); letter-spacing: 0.04em; margin-bottom: 6px; }
        .svc-mobile-name { font-family: 'DM Serif Display', serif; font-size: 1.2rem; color: var(--text); margin-bottom: 6px; letter-spacing: -0.01em; }
        .svc-mobile-audience { font-size: 0.72rem; color: var(--text-muted); margin-bottom: 8px; }
        .svc-mobile-desc { font-size: 0.88rem; line-height: 1.72; color: var(--text-muted); }

        /* ============================================================
           5. ABOUT JOHN
           7fr/5fr photo-dominant. Single paragraph.
           Name identifier at top. Body at larger reading size.
           Credentials as typographic separator.
        ============================================================ */
        .about-strip {
          background: var(--ivory-dark);
          display: grid;
          grid-template-columns: 7fr 5fr;
        }
        .about-strip-photo { position: relative; overflow: hidden; background: var(--slate-mid); min-height: 560px; }
        .about-strip-photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; }
        .about-strip-content { padding: 80px 64px 80px 60px; display: flex; flex-direction: column; justify-content: center; }
        .about-strip-name {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(18px, 1.6vw, 22px);
          font-weight: 400; color: var(--text);
          letter-spacing: -0.01em; line-height: 1.2;
          margin-bottom: 24px;
        }
        .about-strip-body { font-size: 1.08rem; line-height: 1.9; color: var(--text-mid); margin-bottom: 0; font-weight: 300; }
        .about-strip-credentials {
          font-size: 0.78rem; color: var(--text-muted); line-height: 1.9;
          padding: 24px 0; margin: 32px 0 40px;
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
          font-weight: 400;
          letter-spacing: 0.01em;
        }

        /* ============================================================
           6. TESTIMONIAL
           Slate. Unchanged.
        ============================================================ */
        .testimonial-section { background: var(--slate); padding: 100px 72px; }
        .testimonial-inner { max-width: 860px; margin: 0 auto; }
        .testimonial-label { font-size: 0.82rem; color: rgba(247,244,237,0.5); letter-spacing: 0.03em; margin-bottom: 48px; font-weight: 400; }

        /* ============================================================
           7. CLOSING CTA
           Ivory dark. Headline large and left-anchored.
           "No pitch. No pressure." offset right below it.
           Minimal but composed.
        ============================================================ */
        .closing {
          background: var(--ivory-dark);
          padding: 72px 72px;
          border-top: 1px solid var(--rule);
        }
        .closing-inner { max-width: 1320px; }
        .closing-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(36px, 5vw, 68px);
          font-weight: 400; line-height: 1.1;
          color: var(--text); letter-spacing: -0.02em;
          max-width: 700px; margin-bottom: 0;
        }
        .closing-right {
          margin-top: 48px;
          margin-left: auto;
          max-width: 320px;
          display: flex; flex-direction: column; gap: 24px; align-items: flex-start;
        }
        .closing-note {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(18px, 1.8vw, 22px);
          font-weight: 400; color: var(--text-mid);
          letter-spacing: -0.01em; line-height: 1.3;
        }

        /* ============================================================
           RESPONSIVE
        ============================================================ */
        @media (max-width: 1024px) {
          .hero { min-height: 100svh; }
          .hero-left { width: 60%; padding: 130px 48px 60px; }
          .hero-photo-fade {
            background: linear-gradient(
              to right,
              #F7F4ED 0%,
              #F7F4ED 34%,
              rgba(247,244,237,0.8) 44%,
              rgba(247,244,237,0.2) 58%,
              rgba(247,244,237,0) 72%
            );
          }
          .difference { padding: 80px 48px; }
          .difference-right { margin-left: 0; max-width: 100%; margin-top: 40px; }
          .audiences { padding: 80px 48px; }
          .services-section { padding: 80px 48px; }
          .services-selector { grid-template-columns: 240px 1fr; }
          .svc-panel { padding: 48px 48px; }
          .about-strip { grid-template-columns: 1fr; }
          .about-strip-photo { min-height: 420px; }
          .about-strip-content { padding: 60px 48px; }
          .testimonial-section { padding: 80px 48px; }
          .closing { padding: 80px 48px; }
          .closing-right { margin-left: 0; max-width: 100%; }
        }
        @media (max-width: 768px) {
          .services-selector { display: none; }
          .services-mobile { display: flex; flex-direction: column; }
        }
        @media (max-width: 640px) {
          .hero-left { width: 100%; padding: 120px 24px 56px; }
          .hero-headline { font-size: clamp(32px, 9vw, 46px); }
          .hero-btns { flex-direction: column; }
          .hero-photo-fade {
            background: linear-gradient(
              to bottom,
              rgba(247,244,237,0) 0%,
              rgba(247,244,237,0.6) 60%,
              #F7F4ED 85%
            );
          }
          .hero-photo-img { object-position: 30% top; }
          .difference { padding: 64px 24px; }
          .audiences { padding: 56px 24px; }
          .audiences-inner { grid-template-columns: 1fr; gap: 32px; }
          .audiences-heading { position: static; }
          .audiences-grid { grid-template-columns: 1fr; }
          .audience-item:nth-child(even) { padding-left: 0; border-left: none; }
          .services-section { padding: 64px 24px; }
          .about-strip-content { padding: 48px 24px; }
          .testimonial-section { padding: 64px 24px; }
          .closing { padding: 64px 24px; }
        }
      `}</style>

      {/* ===== 1. HERO ===== */}
      <section className="hero">
        {/* Photo layer: sits behind content, fades left into ivory */}
        <div className="hero-photo-wrap">
          <img src="/images/john-mccracken-navy-anchor.jpg" alt="" aria-hidden="true" className="hero-photo-img" />
          <div className="hero-photo-fade" aria-hidden="true" />
        </div>
        {/* Text content */}
        <div className="hero-left">
          <h1 className="hero-headline">I help people get through wind and waves to get where and what they want, even if the goals aren't clear yet.</h1>
          <p className="hero-credential">John McCracken, CAPT, USN (Ret.), EMBA, ACC (ICF), DoD Certified Executive Coach. Over 30 years in senior leadership.</p>
          <div className="hero-btns">
            <a href="/contact" className="btn btn-navy">Schedule a Conversation</a>
            <a href="#difference" className="btn btn-outline">Learn More</a>
          </div>
        </div>
      </section>

      {/* ===== 2. THE DIFFERENCE ===== */}
      <section className="difference" id="difference">
        <div className="difference-inner">
          <h2 className="difference-headline">The immediate challenge is rarely the whole story.</h2>
          <div className="difference-right">
            <p className="difference-support">What brings someone to coaching is usually a professional challenge. What we discover together is almost always bigger than that.</p>
            <p className="difference-thesis">That's where this coaching goes. And that's what makes it different.</p>
          </div>
        </div>
      </section>

      {/* ===== CHERRY BLOSSOM ===== */}
      <div className="cherry-break">
        <img src="/images/dc-cherry-blossoms-sunset.jpg" alt="" aria-hidden="true" className="cherry-img" />
      </div>

      {/* ===== 3. WHO WE WORK WITH ===== */}
      <section className="audiences">
        <div className="audiences-inner">
          <h2 className="audiences-heading">Who we work with.</h2>
          <div className="audiences-grid">
            {audiences.map((a, i) => (
              <div key={i} className="audience-item">
                <span className="audience-num">{a.num}</span>
                <div className="audience-name">{a.name}</div>
                <div className="audience-line">{a.line}</div>
                <a href={a.href} className="audience-link">Learn more →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. WAYS TO WORK TOGETHER ===== */}
      <section className="services-section">
        <div className="services-inner">
          <h2 className="services-heading">Four ways we work together.</h2>

          {/* Desktop selector */}
          <div className="services-selector" role="tablist" aria-label="Ways we work together">
            <div className="svc-index">
              {services.map((s, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={active === i}
                  aria-controls="svc-panel-h2"
                  id={`svc-tab-h2-${i}`}
                  className={`svc-index-btn${active === i ? ' active' : ''}`}
                  onClick={() => selectService(i)}
                  onKeyDown={(e) => handleKey(e, i)}
                  tabIndex={active === i ? 0 : -1}
                >
                  <span className="svc-index-num">{s.num}</span>
                  <span className="svc-index-name">{s.name}</span>
                </button>
              ))}
            </div>
            <div id="svc-panel-h2" role="tabpanel" aria-labelledby={`svc-tab-h2-${active}`} aria-live="polite" className="svc-panel">
              <div className={`svc-panel-content ${panelFading ? 'fading' : 'visible'}`}>
                <div className="svc-panel-name">{svc.name}</div>
                <div className="svc-panel-audience">{svc.audience}</div>
                <p className="svc-panel-desc">{svc.desc}</p>
                <a href={svc.href} className="svc-panel-link">Learn more →</a>
              </div>
            </div>
          </div>

          {/* Mobile list */}
          <div className="services-mobile">
            {services.map((s, i) => (
              <a key={i} href={s.href} className="svc-mobile-item">
                <div className="svc-mobile-num">{s.num}</div>
                <div className="svc-mobile-name">{s.name}</div>
                <div className="svc-mobile-audience">{s.audience}</div>
                <div className="svc-mobile-desc">{s.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5. ABOUT JOHN ===== */}
      <section className="about-strip">
        <div className="about-strip-photo">
          <img src="/images/john-mccracken-anchor-portrait.jpg" alt="John McCracken" />
        </div>
        <div className="about-strip-content">
          <div className="about-strip-name">John McCracken</div>
          <p className="about-strip-body">Those decades also taught me how to lead, how to recover, and how to help others. I learned what it costs to try to carry it all, and what becomes possible when you finally stop pretending you have to.</p>
          <div className="about-strip-credentials">CAPT, USN (Ret.) | EMBA | ACC (ICF) | DoD Certified Executive Coach</div>
          <a href="/about" className="btn btn-outline" style={{alignSelf:'flex-start'}}>Read the full story</a>
        </div>
      </section>

      {/* ===== 6. TESTIMONIAL ===== */}
      <section className="testimonial-section">
        <div className="testimonial-inner">
          <div className="testimonial-label">What clients say</div>
          <TestimonialSlider testimonials={testimonials} />
        </div>
      </section>

      {/* ===== 7. CLOSING CTA ===== */}
      <section className="closing">
        <div className="closing-inner">
          <h2 className="closing-headline">It starts with a single conversation.</h2>
          <div className="closing-right">
            <p className="closing-note">No pitch. No pressure.</p>
            <a href="/contact" className="btn btn-navy">Schedule Your Free Intro Call</a>
          </div>
        </div>
      </section>
    </>
  )
}