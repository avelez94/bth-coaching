'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import TestimonialSlider from '../components/TestimonialSlider'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const services = [
  {
    num: '01',
    name: 'Executive Coaching',
    audience: 'For Individuals and Organizations',
    desc: 'One-to-one coaching that follows your lead — addressing the challenge in front of you and everything connected to it.',
    href: '/executive-coaching',
    featured: false,
  },
  {
    num: '02',
    name: 'Transition Coaching',
    audience: 'For Individuals',
    desc: 'Structured coaching for military and federal professionals navigating what comes next — career, identity, and life, together.',
    href: '/transition-coaching',
    featured: false,
  },
  {
    num: '03',
    name: 'Mission-Ready Leadership',
    audience: 'For Executives, Teams, Organizations and Individuals in Transition',
    desc: "A science-grounded, whole-person coaching program built around the 8 Pillars of Mission-Ready Leadership — for leaders at any altitude, including anyone finding their footing in a new role.",
    href: '/mission-ready-leadership',
    featured: true,
  },
  {
    num: '04',
    name: 'Leadership Consulting',
    audience: 'For Organizations',
    desc: 'Custom design and delivery of leadership development systems for mission-driven enterprises, federal agencies, schools, and defense organizations.',
    href: '/leadership-consulting',
    featured: false,
  },
]

const audiences = [
  {
    name: 'Senior Executives and Leaders',
    desc: "You're performing well and know your next level requires something different — more strategic clarity, stronger team leverage, and a more sustainable way to lead without burning through what you have.",
  },
  {
    name: 'High-Potential Professionals',
    desc: "You've been identified as ready for more, and you want the tools to get there. Coaching builds the capabilities your next role requires, and addresses the whole-person foundation that makes growth sustainable and lasting.",
  },
  {
    name: 'Military and Federal Professionals in Transition',
    desc: "You've built a remarkable career in uniform or government. What comes next involves more than a resume — it involves identity, purpose, and figuring out who you are when the structure changes.",
  },
  {
    name: 'Over-Stressed Professionals',
    desc: "You've succeeded — but something is straining that success, and it's starting to show. Coaching helps you name what's actually happening, reconnect to the values that got you here, and find sustainable footing in the new normal. This is territory I know personally, not just professionally.",
  },
]

const defaultTestimonials = [{
  id: 'linnea',
  name: 'Linnea Landowski',
  role: 'Director of Camping-Programs, Scouting America, Western Los Angeles County Council',
  company: '',
  quote: "When I started coaching, I was looking to become a stronger leader. What I found was far more transformative. Through our work together, I learned that empathy and accountability are not opposites — and that much of my identity and self-worth had become tied to my work in ways that weren't serving me. Coaching helped me redefine success to include my relationships, health, and personal happiness — not just professional achievement. Rather than giving me answers, John consistently asked the right questions, helping me uncover insights that felt authentic and sustainable. I leave with greater confidence, stronger boundaries, and a much deeper understanding of the value I bring as both a leader and a person.",
}]

export default function Home() {
  const [testimonials, setTestimonials] = useState(defaultTestimonials)
  const [activeService, setActiveService] = useState(0)
  const [panelFading, setPanelFading] = useState(false)

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => {
        if (data && data.length > 0) setTestimonials(data)
      })
  }, [])

  function selectService(i: number) {
    if (i === activeService) return
    setPanelFading(true)
    setTimeout(() => {
      setActiveService(i)
      setPanelFading(false)
    }, 200)
  }

  function handleSvcKeyDown(e: React.KeyboardEvent, i: number) {
    if (e.key === 'ArrowDown') { e.preventDefault(); selectService(Math.min(i + 1, services.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); selectService(Math.max(i - 1, 0)) }
  }

  const svc = services[activeService]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&family=Lora:ital,wght@0,400;1,400;1,500&display=swap');

        :root {
          --ivory: #F7F4ED;
          --ivory-dark: #EDE8DC;
          --ivory-mid: #E8E2D4;
          --slate: #4C78A0;
          --slate-mid: #3A607F;
          --slate-light: #6B9ABF;
          --slate-pale: #E8EFF5;
          --navy: #0D1B2A;
          --gold: #C9A23A;
          --text: #1C2B3A;
          --text-mid: #3D5166;
          --text-muted: #6B7A8D;
          --rule: rgba(28,43,58,0.1);
          --rule-slate: rgba(247,244,237,0.12);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
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
           Split layout preserved. Scrim removed.
           Credential line separated from body copy.
           No entrance animation — static.
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
          display: none;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--slate);
          opacity: 0.2;
          z-index: 3;
          transform: translateX(-50%);
        }
        .hero-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 140px 72px 80px;
          position: relative;
          z-index: 2;
        }
        .hero-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(36px, 3.8vw, 50px);
          font-weight: 400;
          line-height: 1.18;
          color: var(--text);
          margin-bottom: 24px;
          letter-spacing: -0.01em;
          max-width: 480px;
        }
        .hero-subhead {
          font-size: 0.95rem;
          line-height: 1.8;
          color: var(--text-mid);
          margin-bottom: 0;
          max-width: 420px;
          font-weight: 300;
        }
        /* Credential line separated with visual breathing room */
        .hero-credentials-line {
          font-size: 0.75rem;
          line-height: 1.6;
          color: var(--text-muted);
          margin-top: 28px;
          margin-bottom: 40px;
          max-width: 420px;
          font-weight: 400;
          padding-top: 16px;
          border-top: 1px solid var(--rule);
        }
        .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }
        .hero-right {
          position: relative;
          background: var(--slate-mid);
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
        .hero-photo-fade {
          position: absolute; inset: 0; z-index: 2;
          background: linear-gradient(
            to right,
            #F7F4ED 0%,
            rgba(247,244,237,0.6) 18%,
            rgba(247,244,237,0) 42%
          );
        }
        /* Scrim removed — photo stands on its own */

        /* ============================================================
           2. THE PROBLEM — "Why people reach out"
           Column widens to 820px. First para slightly elevated.
           Final para promoted to DM Serif Display thesis statement.
        ============================================================ */
        .problem {
          background: var(--ivory-dark);
          padding: 100px 72px;
        }
        .problem-inner {
          max-width: 820px;
          margin: 0 auto;
        }
        .problem-label {
          font-size: 0.72rem;
          color: var(--slate-mid);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 32px;
          font-weight: 500;
        }
        .problem-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(28px, 3vw, 40px);
          font-weight: 400;
          line-height: 1.22;
          color: var(--text);
          margin-bottom: 40px;
          letter-spacing: -0.01em;
        }
        .problem-body {
          font-size: 0.97rem;
          line-height: 1.88;
          color: var(--text-mid);
          margin-bottom: 20px;
          font-weight: 300;
        }
        /* First paragraph elevated entry */
        .problem-body-lead {
          font-size: 1.05rem;
          line-height: 1.85;
          color: var(--text-mid);
          margin-bottom: 20px;
          font-weight: 300;
        }
        /* Final paragraph — thesis statement in DM Serif Display */
        .problem-thesis {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(18px, 1.8vw, 22px);
          font-weight: 400;
          line-height: 1.55;
          color: var(--text);
          margin-top: 32px;
          margin-bottom: 0;
          letter-spacing: -0.01em;
        }

        /* ============================================================
           3. AUDIENCE + SERVICES
        ============================================================ */
        .audience-services {
          background: var(--ivory);
          padding: 100px 72px;
        }
        .audience-services-inner { max-width: 1100px; margin: 0 auto; }

        /* WHO WE WORK WITH
           Names prominent in DM Serif Display.
           Descriptions fully readable at all times — no opacity change.
        */
        .audience-block {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 60px;
          margin-bottom: 80px;
          padding-bottom: 64px;
          border-bottom: 1px solid var(--rule);
          align-items: start;
        }
        .audience-label {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 2.4vw, 30px);
          font-weight: 400;
          color: var(--text);
          letter-spacing: -0.01em;
          line-height: 1.25;
          padding-top: 0;
        }
        .audience-list { display: flex; flex-direction: column; }
        .audience-item {
          padding: 20px 0;
          border-bottom: 1px solid var(--rule);
        }
        .audience-item:first-child { border-top: 1px solid var(--rule); }
        /* Name prominent — primary scannable entry point */
        .audience-name {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(18px, 1.8vw, 22px);
          font-weight: 400;
          color: var(--text);
          line-height: 1.25;
          margin-bottom: 10px;
          letter-spacing: -0.01em;
        }
        .audience-desc {
          font-size: 0.88rem;
          line-height: 1.75;
          color: var(--text-mid);
          font-weight: 300;
        }

        /* FOUR WAYS WE WORK TOGETHER — interactive selector */
        .services-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.8vw, 34px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 40px;
          letter-spacing: -0.01em;
        }
        .services-selector {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 0;
          border-top: 1px solid var(--rule);
        }

        /* Index — left column */
        .svc-index {
          border-right: 1px solid var(--rule);
        }
        .svc-index-btn {
          display: block;
          width: 100%;
          background: none;
          border: none;
          border-bottom: 1px solid var(--rule);
          padding: 20px 24px 20px 20px;
          text-align: left;
          cursor: pointer;
          position: relative;
          transition: background 0.15s;
        }
        .svc-index-btn:focus-visible {
          outline: 2px solid var(--slate);
          outline-offset: -2px;
        }
        /* Active state: single 2px slate left indicator */
        .svc-index-btn.active {
          background: rgba(220,213,200,0.7);
        }
        .svc-index-btn.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--slate);
        }
        /* Mission-Ready: gold name color only when NOT active */
        .svc-index-btn.featured:not(.active) .svc-index-name {
          color: var(--gold);
        }
        /* When Mission-Ready IS active: slate indicator only, name goes normal */
        .svc-index-btn.featured.active .svc-index-name {
          color: var(--text);
        }
        .svc-index-num {
          font-size: 0.65rem;
          color: var(--text-muted);
          letter-spacing: 0.04em;
          margin-bottom: 6px;
          font-weight: 400;
        }
        .svc-index-name {
          font-family: 'DM Serif Display', serif;
          font-size: 1rem;
          font-weight: 400;
          color: var(--text);
          line-height: 1.3;
          letter-spacing: -0.01em;
          transition: color 0.15s;
        }

        /* Panel — right column */
        .svc-panel {
          padding: 40px 0 40px 52px;
        }
        .svc-panel-content {
          transition: opacity 0.2s ease;
        }
        .svc-panel-content.fading { opacity: 0; }
        .svc-panel-content.visible { opacity: 1; }
        .svc-panel-name {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(26px, 3vw, 38px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 8px;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }
        .svc-panel-audience {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 24px;
          font-weight: 400;
        }
        .svc-panel-desc {
          font-size: 0.95rem;
          line-height: 1.85;
          color: var(--text-mid);
          margin-bottom: 28px;
          max-width: 540px;
          font-weight: 300;
        }
        .svc-panel-link {
          font-size: 0.78rem;
          color: var(--slate-mid);
          text-decoration: none;
          letter-spacing: 0.04em;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: gap 0.2s;
        }
        .svc-panel-link:hover { gap: 14px; }

        /* Mobile services: stacked list (hides selector) */
        .services-list-mobile { display: none; }

        /* ============================================================
           4. PHILOSOPHY / FRAMEWORK
           Asymmetric desktop split: headline left, body+link right.
           Slate background. No dots.
        ============================================================ */
        .philosophy {
          background: var(--slate);
          padding: 100px 72px;
        }
        .philosophy-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 5fr 7fr;
          gap: 80px;
          align-items: start;
        }
        .philosophy-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.8vw, 36px);
          font-weight: 400;
          line-height: 1.28;
          color: var(--ivory);
          letter-spacing: -0.01em;
        }
        .philosophy-right { padding-top: 8px; }
        .philosophy-body {
          font-size: 0.97rem;
          line-height: 1.88;
          color: rgba(247,244,237,0.75);
          margin-bottom: 20px;
          font-weight: 300;
        }
        .philosophy-body:last-of-type { margin-bottom: 32px; }
        .philosophy-link {
          font-size: 0.78rem;
          color: var(--gold);
          text-decoration: none;
          letter-spacing: 0.06em;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: gap 0.2s;
        }
        .philosophy-link:hover { gap: 14px; }

        /* ============================================================
           5. ABOUT STRIP
           Ratio changed to 7fr/5fr — photo now dominant.
           Credentials line with top+bottom border as separator.
        ============================================================ */
        .about-strip {
          background: var(--ivory-dark);
          display: grid;
          grid-template-columns: 7fr 5fr;
        }
        .about-strip-photo {
          position: relative;
          overflow: hidden;
          background: var(--slate-mid);
          min-height: 520px;
        }
        .about-strip-photo img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }
        .about-strip-content {
          padding: 72px 64px 72px 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .about-strip-body {
          font-size: 0.95rem;
          line-height: 1.85;
          color: var(--text-mid);
          margin-bottom: 20px;
          font-weight: 300;
        }
        /* Credentials as typographic separator — border top and bottom */
        .about-strip-credentials {
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.8;
          padding: 20px 0;
          margin: 24px 0 28px;
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
          font-weight: 400;
        }

        /* ============================================================
           6. SCIENCE + CREDENTIALS
           Background: ivory-dark (distinguishes from About above).
           Credential rows: rule ABOVE each entry (not below).
           credential-main increased to 1.1rem.
        ============================================================ */
        .science {
          background: var(--ivory);
          padding: 100px 72px;
          border-top: 1px solid var(--rule);
        }
        .science-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }
        .science-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.8vw, 34px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 24px;
          letter-spacing: -0.01em;
          line-height: 1.25;
        }
        .science-body {
          font-size: 0.93rem;
          line-height: 1.85;
          color: var(--text-mid);
          font-weight: 300;
        }
        .credentials-list { display: flex; flex-direction: column; }
        .credential-row {
          padding: 20px 0;
          border-top: 1px solid var(--rule);
        }
        .credential-row:last-child { border-bottom: 1px solid var(--rule); }
        .credential-main {
          font-family: 'DM Serif Display', serif;
          font-size: 1.1rem;
          font-weight: 400;
          color: var(--slate-mid);
          margin-bottom: 4px;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }
        .credential-detail {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.5;
          font-weight: 300;
        }

        /* ============================================================
           7. TESTIMONIAL
           Stays on slate. Quote size increased.
           Attribution: thin rule above name, no gold rule.
        ============================================================ */
        .testimonial-section {
          background: var(--slate);
          padding: 100px 72px;
        }
        .testimonial-inner {
          max-width: 860px;
          margin: 0 auto;
        }
        .testimonial-label {
          font-size: 0.72rem;
          color: rgba(247,244,237,0.45);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 48px;
          font-weight: 400;
        }

        /* ============================================================
           8. CLOSING CTA
           Slate background — final color arrival.
           Asymmetric two-column: headline left, body+button right.
           Not centered. Conclusive.
        ============================================================ */
        .closing-cta {
          background: var(--ivory-dark);
          padding: 100px 72px;
          border-top: 1px solid var(--rule);
        }
        .closing-cta-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 5fr 7fr;
          gap: 80px;
          align-items: center;
        }
        .cta-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(28px, 3.4vw, 46px);
          font-weight: 400;
          line-height: 1.15;
          color: var(--text);
          letter-spacing: -0.01em;
        }
        .cta-body {
          font-size: 0.97rem;
          line-height: 1.85;
          color: var(--text-mid);
          margin-bottom: 32px;
          font-weight: 300;
        }

        /* ============================================================
           CHERRY BLOSSOM VISUAL BREAK
        ============================================================ */
        .cherry-break {
          background: var(--ivory-dark);
          overflow: hidden;
          line-height: 0;
        }
        .cherry-img {
          width: 100%;
          height: auto;
          display: block;
          max-height: 520px;
          object-fit: cover;
          object-position: center 30%;
        }

        /* ============================================================
           RESPONSIVE
        ============================================================ */
        @media (max-width: 1024px) {
          .hero { grid-template-columns: 1fr; min-height: unset; }
          .hero-divider { display: none; }
          .hero-left { padding: 130px 48px 60px; }
          .hero-right { min-height: 460px; }
          .problem { padding: 80px 48px; }
          .audience-services { padding: 80px 48px; }
          .audience-block { grid-template-columns: 1fr; gap: 32px; }
          .services-selector { grid-template-columns: 260px 1fr; }
          .philosophy { padding: 80px 48px; }
          .philosophy-inner { grid-template-columns: 1fr; gap: 40px; }
          .philosophy-headline { position: static; }
          .about-strip { grid-template-columns: 1fr; }
          .about-strip-photo { min-height: 400px; }
          .about-strip-content { padding: 60px 48px; }
          .science { padding: 80px 48px; }
          .science-inner { grid-template-columns: 1fr; gap: 48px; }
          .testimonial-section { padding: 80px 48px; }
          .closing-cta { padding: 80px 48px; }
          .closing-cta-inner { grid-template-columns: 1fr; gap: 40px; }
        }

        @media (max-width: 768px) {
          .services-selector { display: none; }
          .services-list-mobile { display: flex; flex-direction: column; }
          .svc-mobile-item {
            display: grid;
            grid-template-columns: 44px 1fr auto;
            gap: 24px;
            align-items: start;
            padding: 28px 0;
            border-bottom: 1px solid var(--rule);
            text-decoration: none;
            color: inherit;
          }
          .svc-mobile-item:first-child { border-top: 1px solid var(--rule); }
          .svc-mobile-item.featured { border-left: 2px solid var(--gold); padding-left: 16px; margin-left: -18px; }
          .svc-mobile-num { font-size: 0.72rem; color: var(--text-muted); padding-top: 4px; letter-spacing: 0.04em; }
          .svc-mobile-name { font-family: 'DM Serif Display', serif; font-size: 1.15rem; color: var(--text); margin-bottom: 4px; line-height: 1.3; letter-spacing: -0.01em; }
          .svc-mobile-audience { font-size: 0.72rem; color: var(--text-muted); margin-bottom: 8px; }
          .svc-mobile-desc { font-size: 0.85rem; line-height: 1.72; color: var(--text-muted); }
          .svc-mobile-arrow { font-size: 0.85rem; color: var(--text-muted); opacity: 0.4; padding-top: 6px; }
        }

        @media (max-width: 640px) {
          .hero-left { padding: 110px 24px 48px; }
          .hero-headline { font-size: clamp(30px, 8vw, 42px); }
          .hero-btns { flex-direction: column; }
          .problem { padding: 64px 24px; }
          .audience-services { padding: 64px 24px; }
          .philosophy { padding: 64px 24px; }
          .about-strip-content { padding: 48px 24px; }
          .science { padding: 64px 24px; }
          .testimonial-section { padding: 64px 24px; }
          .closing-cta { padding: 64px 24px; }
        }
      `}</style>

      {/* ===== 1. HERO ===== */}
      <section className="hero">
        <div className="hero-divider" />
        <div className="hero-left">
          <h1 className="hero-headline">
            I help people get through wind and waves to get where and what they want — even if the goals aren't clear yet.
          </h1>
          <p className="hero-subhead">We work the whole chart — professional, personal, relational — because they're never really separate.</p>
          <p className="hero-credentials-line">John McCracken, CAPT, USN (Ret.), EMBA, ACC (ICF), DoD Certified Executive Coach, LCOP — Over 30 years in senior leadership.</p>
          <div className="hero-btns">
            <a href="/contact" className="btn btn-navy">Schedule a Conversation</a>
            <a href="#problem" className="btn btn-outline">Learn More</a>
          </div>
        </div>
        <div className="hero-right">
          <img
            src="/images/john-mccracken-navy-anchor.jpg"
            alt="John McCracken in Navy dress whites beside the gold anchor"
            className="hero-photo-img"
          />
          <div className="hero-photo-fade" aria-hidden="true" />
        </div>
      </section>

      {/* ===== 2. THE PROBLEM ===== */}
      <section className="problem" id="problem">
        <div className="problem-inner">
          <div className="problem-label">Why people reach out</div>
          <h2 className="problem-headline">The immediate challenge is rarely the whole story.</h2>
          <p className="problem-body-lead">Complexity is a fact of life. Most people carry more than the role accounts for. A demanding career, a family that deserves your best, goals that keep getting pushed to next quarter — the weight of it is real. And most people carry it alone.</p>
          <p className="problem-body">What brings someone to coaching is usually a professional challenge. What we discover together is almost always bigger than that. My clients generally start with a work challenge and quickly identify work-life integration as a key component of reaching their personal and professional goals.</p>
          <p className="problem-body">The pressure you're feeling at work has company somewhere else. The pattern that keeps showing up in meetings, or with that one difficult colleague, usually has roots outside of work entirely. The clarity you're looking for isn't just a leadership skill — it's what happens when you get honest about who you are and what you actually want, across every part of your life.</p>
          <p className="problem-thesis">That's where this coaching goes. And that's what makes it different.</p>
        </div>
      </section>

      {/* ===== VISUAL BREAK — cherry blossoms ===== */}
      <div className="cherry-break">
        <img
          src="/images/dc-cherry-blossoms-sunset.jpg"
          alt=""
          aria-hidden="true"
          className="cherry-img"
        />
      </div>

      {/* ===== 3. AUDIENCE + SERVICES ===== */}
      <section className="audience-services">
        <div className="audience-services-inner">

          {/* WHO WE WORK WITH */}
          <div className="audience-block">
            <div className="audience-label">Who we work with</div>
            <div className="audience-list">
              {audiences.map((a, i) => (
                <div key={i} className="audience-item">
                  <div className="audience-name">{a.name}</div>
                  <div className="audience-desc">{a.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* FOUR WAYS WE WORK TOGETHER */}
          <h2 className="services-heading">Four ways we work together.</h2>

          {/* Desktop: interactive selector */}
          <div
            className="services-selector"
            role="tablist"
            aria-label="Ways we work together"
          >
            {/* Index */}
            <div className="svc-index">
              {services.map((s, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={activeService === i}
                  aria-controls="svc-panel"
                  id={`svc-tab-${i}`}
                  className={[
                    'svc-index-btn',
                    activeService === i ? 'active' : '',
                    s.featured ? 'featured' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => selectService(i)}
                  onKeyDown={(e) => handleSvcKeyDown(e, i)}
                  tabIndex={activeService === i ? 0 : -1}
                >
                  <div className="svc-index-num">{s.num}</div>
                  <div className="svc-index-name">{s.name}</div>
                </button>
              ))}
            </div>

            {/* Panel */}
            <div
              id="svc-panel"
              role="tabpanel"
              aria-labelledby={`svc-tab-${activeService}`}
              aria-live="polite"
              className="svc-panel"
            >
              <div className={`svc-panel-content ${panelFading ? 'fading' : 'visible'}`}>
                <div className="svc-panel-name">{svc.name}</div>
                <div className="svc-panel-audience">{svc.audience}</div>
                <p className="svc-panel-desc">{svc.desc}</p>
                <a href={svc.href} className="svc-panel-link">
                  Learn more →
                </a>
              </div>
            </div>
          </div>

          {/* Mobile: stacked list */}
          <div className="services-list-mobile">
            {services.map((s, i) => (
              <a
                key={i}
                href={s.href}
                className={`svc-mobile-item${s.featured ? ' featured' : ''}`}
              >
                <div className="svc-mobile-num">{s.num}</div>
                <div>
                  <div className="svc-mobile-name">{s.name}</div>
                  <div className="svc-mobile-audience">{s.audience}</div>
                  <div className="svc-mobile-desc">{s.desc}</div>
                </div>
                <div className="svc-mobile-arrow">→</div>
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* ===== 4. PHILOSOPHY / FRAMEWORK ===== */}
      <section className="philosophy">
        <div className="philosophy-inner">
          <h2 className="philosophy-headline">Most coaches work on the leader you are at work. This works on the person you are everywhere to create holistic change.</h2>
          <div className="philosophy-right">
            <p className="philosophy-body">When we address the whole person — every dimension of who they are and what they're carrying — something unlocks. Potential they didn't know they had. Clarity they couldn't find alone. An actionable, repeatable path forward that lasts.</p>
            <p className="philosophy-body">That's why this coaching doesn't separate professional from personal. Because life doesn't either.</p>
            <a href="/the-framework" className="philosophy-link">Explore the Framework →</a>
          </div>
        </div>
      </section>

      {/* ===== 5. ABOUT STRIP ===== */}
      <section className="about-strip">
        <div className="about-strip-photo">
          <img src="/images/john-mccracken-anchor-portrait.jpg" alt="John McCracken" />
        </div>
        <div className="about-strip-content">
          <p className="about-strip-body">I spent 30 years leading in the United States Navy and seven years as a senior civilian in the Office of the Secretary of Defense.</p>
          <p className="about-strip-body">In those years I had successes, and frankly failures. I learned what creates success and what keeps people from it. In doing so, I developed a keen desire to help people avoid the pitfalls I hit, or at least recover more quickly from them.</p>
          <p className="about-strip-body">Those decades also taught me how to lead, how to recover, and how to help others. I learned what it costs to try to carry it all — and what becomes possible when you finally stop pretending you have to.</p>
          <div className="about-strip-credentials">CAPT, USN (Ret.) | EMBA | ACC (ICF) | DoD Certified Executive Coach</div>
          <a href="/about" className="btn btn-outline" style={{alignSelf:'flex-start'}}>Read the full story</a>
        </div>
      </section>

      {/* ===== 6. SCIENCE + CREDENTIALS ===== */}
      <section className="science">
        <div className="science-inner">
          <div>
            <h2 className="science-headline">Science-grounded. Experience-tested.</h2>
            <p className="science-body">The coaching and programs at Beyond the Horizon are grounded in peer-reviewed research on human flourishing — the same science underlying the U.S. Army's resilience programs — and address how stress, depletion, and financial and relational friction impair the judgment, decision-making, and equanimity leadership demands most.</p>
          </div>
          <div className="credentials-list">
            {[
              { main: 'ACC Certified', detail: 'International Coaching Federation' },
              { main: 'DoD Certified', detail: 'Executive Coach' },
              { main: 'LCOP', detail: 'Leadership Coaching and Organizational Performance' },
              { main: 'Research-grounded', detail: 'Grounded in peer-reviewed research on human flourishing' },
            ].map((cred, i) => (
              <div key={i} className="credential-row">
                <div className="credential-main">{cred.main}</div>
                <div className="credential-detail">{cred.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 7. TESTIMONIAL ===== */}
      <section className="testimonial-section">
        <div className="testimonial-inner">
          <div className="testimonial-label">What clients say</div>
          <TestimonialSlider testimonials={testimonials} />
        </div>
      </section>

      {/* ===== 8. CLOSING CTA ===== */}
      <section className="closing-cta">
        <div className="closing-cta-inner">
          <h2 className="cta-headline">It starts with a single conversation.</h2>
          <div>
            <p className="cta-body">Schedule a free 15-minute intro call. No pitch. No pressure. Just a direct conversation about where you are, what you'd like the future to hold — and whether this is the right fit for getting there.</p>
            <a href="/contact" className="btn btn-navy">Schedule Your Free Intro Call</a>
          </div>
        </div>
      </section>
    </>
  )
}