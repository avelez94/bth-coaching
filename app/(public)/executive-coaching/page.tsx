'use client'

import { useState } from 'react'

const workAreas = [
  {
    num: '01',
    title: 'Leadership Effectiveness',
    body: 'Moving from doing the work yourself to creating conditions for others to do it well — without losing your standards or your accountability for outcomes. For most high performers, this is the hardest shift they ever make.',
  },
  {
    num: '02',
    title: 'Presence, Communication & Influence',
    body: 'How you show up — in difficult conversations, high-stakes moments, and the ordinary interactions that define culture — determines more about your effectiveness than any strategy you produce. We work on the patterns shaping your impact, including the ones hardest to see from the inside.',
  },
  {
    num: '03',
    title: 'Resilience & Sustainable Performance',
    body: "We identify what's draining your reserves — professionally and personally — and build the whole-person foundation that makes excellence sustainable rather than just periodically heroic.",
  },
  {
    num: '04',
    title: 'Integration: Leadership & Life',
    body: 'The coaching is open to your whole situation. Whatever is most present — a team challenge, a career inflection, a transition, the weight of carrying too much for too long — that\'s where we go.',
  },
]

const engagementDetails = [
  '12 one-hour sessions over 24 weeks (bi-weekly)',
  '8 Pillars whole-person assessment in opening sessions',
  'Values and goals exploration',
  'Session-by-session commitments — defined by you',
  'Between-session accountability via email or text',
  'Final session: integration, reflection, and forward planning',
]

export default function ExecutiveCoaching() {
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)

  function select(i: number) {
    if (i === active) return
    setFading(true)
    setTimeout(() => { setActive(i); setFading(false) }, 200)
  }

  function handleKey(e: React.KeyboardEvent, i: number) {
    if (e.key === 'ArrowDown') { e.preventDefault(); select(Math.min(i + 1, workAreas.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); select(Math.max(i - 1, 0)) }
  }

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
          --slate-pale: #E8EFF5;
          --navy: #0D1B2A;
          --gold: #C9A23A;
          --text: #1C2B3A;
          --text-mid: #3D5166;
          --text-muted: #6B7A8D;
          --rule: rgba(28,43,58,0.1);
          --rule-light: rgba(247,244,237,0.14);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--ivory); color: var(--text); font-family: 'Inter', sans-serif; font-weight: 300; overflow-x: hidden; -webkit-font-smoothing: antialiased; }

        .btn { display: inline-flex; align-items: center; gap: 9px; padding: 13px 28px; font-size: 0.72rem; letter-spacing: 0.07em; text-transform: uppercase; text-decoration: none; transition: all 0.22s ease; font-weight: 500; cursor: pointer; border: none; font-family: 'Inter', sans-serif; white-space: nowrap; }
        .btn-navy { background: var(--navy); color: var(--ivory); }
        .btn-navy:hover { background: var(--slate-mid); }
        .btn-outline-light { background: transparent; color: var(--ivory); border: 1px solid rgba(247,244,237,0.35); }
        .btn-outline-light:hover { background: rgba(247,244,237,0.1); }
        .btn-outline-dark { background: transparent; color: var(--text); border: 1px solid rgba(28,43,58,0.28); }
        .btn-outline-dark:hover { background: var(--navy); color: var(--ivory); border-color: var(--navy); }

        /* ============================================================
           1. HERO
           Slate. "For Individuals" as quiet functional label.
           Wide asymmetric composition on desktop.
        ============================================================ */
        .hero {
          background: var(--slate);
          padding: 160px 72px 100px;
        }
        .hero-inner { max-width: 1200px; }
        .hero-context {
          font-size: 0.78rem;
          color: rgba(247,244,237,0.45);
          letter-spacing: 0.04em;
          margin-bottom: 24px;
          font-weight: 400;
        }
        .hero-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(38px, 4.8vw, 64px);
          font-weight: 400;
          line-height: 1.1;
          color: var(--ivory);
          letter-spacing: -0.02em;
          max-width: 820px;
          margin-bottom: 0;
        }
        .hero-subhead {
          font-size: 1rem;
          line-height: 1.82;
          color: rgba(247,244,237,0.72);
          margin-top: 36px;
          margin-left: auto;
          max-width: 480px;
          font-weight: 300;
          margin-bottom: 32px;
        }
        .hero-cta { margin-left: auto; max-width: 480px; }

        /* ============================================================
           2. CHALLENGE
           Ivory. Left-anchored, wider reading composition.
           Headline uses canvas, body holds comfortable measure.
        ============================================================ */
        .challenge {
          background: var(--ivory);
          padding: 100px 72px;
        }
        .challenge-inner { max-width: 1100px; margin: 0 auto; }
        .challenge-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(26px, 3vw, 38px);
          font-weight: 400;
          line-height: 1.22;
          color: var(--text);
          margin-bottom: 40px;
          letter-spacing: -0.01em;
          max-width: 740px;
        }
        .challenge-body {
          font-size: 0.97rem;
          line-height: 1.88;
          color: var(--text-mid);
          margin-bottom: 20px;
          font-weight: 300;
          max-width: 640px;
        }
        .challenge-body:last-child { margin-bottom: 0; }

        /* ============================================================
           3. COACHING EXAMPLE
           Ivory dark. "A coaching example" as DM Serif heading.
           Story text retains slate left rule — editorial case moment.
        ============================================================ */
        .client-story {
          background: var(--ivory-dark);
          padding: 80px 72px;
        }
        .client-story-inner {
          max-width: 720px;
          margin: 0 auto;
        }
        .story-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(18px, 1.8vw, 22px);
          font-weight: 400;
          color: var(--text-muted);
          letter-spacing: -0.01em;
          margin-bottom: 28px;
          font-style: italic;
        }
        .story-text {
          font-size: 0.97rem;
          line-height: 1.88;
          color: var(--text-mid);
          border-left: 2px solid var(--slate);
          padding-left: 32px;
          font-weight: 300;
        }

        /* ============================================================
           4. WHAT WE WORK ON — editorial coaching index
           Desktop: narrow number+title index left, description panel right.
           All four titles always visible. No boxed states.
           Active: 2px slate left indicator, title color deepens.
           Panel crossfades at 200ms.
           Mobile: static stacked list, all descriptions always visible.
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
          margin-bottom: 56px;
          letter-spacing: -0.01em;
        }

        /* Desktop selector — editorial, not a tab component */
        .work-selector { display: grid; grid-template-columns: 300px 1fr; border-top: 1px solid var(--rule); }
        .work-index { border-right: 1px solid var(--rule); }
        .work-index-btn {
          display: block;
          width: 100%;
          background: none;
          border: none;
          border-bottom: none;
          padding: 32px 28px 32px 20px;
          text-align: left;
          cursor: pointer;
          position: relative;
          transition: none;
        }
        .work-index-btn + .work-index-btn {
          border-top: 1px solid rgba(28,43,58,0.05);
        }
        .work-index-btn:focus-visible { outline: 2px solid var(--slate); outline-offset: -2px; z-index: 1; }
        /* Active: thin left indicator only, no background fill */
        .work-index-btn.active::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: var(--slate-mid);
        }
        .work-index-num {
          font-size: 0.65rem;
          color: var(--text-muted);
          letter-spacing: 0.04em;
          margin-bottom: 6px;
          font-weight: 400;
          display: block;
          transition: color 0.18s;
        }
        .work-index-btn.active .work-index-num { color: var(--slate-mid); }
        .work-index-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1rem;
          font-weight: 400;
          color: var(--text-muted);
          line-height: 1.3;
          letter-spacing: -0.01em;
          transition: color 0.18s;
          display: block;
        }
        .work-index-btn.active .work-index-title { color: var(--text); }
        .work-index-btn:hover:not(.active) .work-index-title { color: var(--text-mid); }

        /* Panel */
        .work-panel { padding: 40px 0 40px 56px; }
        .work-panel-content { transition: opacity 0.2s ease; }
        .work-panel-content.fading { opacity: 0; }
        .work-panel-content.visible { opacity: 1; }
        .work-panel-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 2.6vw, 32px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 20px;
          letter-spacing: -0.01em;
          line-height: 1.25;
        }
        .work-panel-body {
          font-size: 0.97rem;
          line-height: 1.88;
          color: var(--text-mid);
          max-width: 540px;
          font-weight: 300;
        }

        /* Mobile: static stacked list */
        .work-selector-desktop { display: grid; }
        .work-mobile-list { display: none; }
        .work-mobile-item { padding: 32px 0; border-bottom: 1px solid var(--rule); }
        .work-mobile-item:first-child { border-top: 1px solid var(--rule); }
        .work-mobile-num { font-size: 0.65rem; color: var(--slate-mid); letter-spacing: 0.04em; margin-bottom: 8px; font-weight: 400; }
        .work-mobile-title { font-family: 'DM Serif Display', serif; font-size: 1.1rem; color: var(--text); margin-bottom: 12px; line-height: 1.3; letter-spacing: -0.01em; }
        .work-mobile-body { font-size: 0.93rem; line-height: 1.82; color: var(--text-mid); font-weight: 300; }

        /* ============================================================
           5. FOR ORGANIZATIONS
           Slate. Asymmetric split — audience shift made architectural.
           Label + headline left (~5fr), body + CTA right (~7fr).
        ============================================================ */
        .organizational {
          background: var(--slate);
          padding: 100px 72px;
        }
        .organizational-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 5fr 7fr;
          gap: 80px;
          align-items: start;
        }
        .org-left { }
        .org-label {
          font-size: 0.75rem;
          color: rgba(247,244,237,0.45);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 20px;
          font-weight: 400;
        }
        .org-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 2.4vw, 32px);
          font-weight: 400;
          line-height: 1.25;
          color: var(--ivory);
          letter-spacing: -0.01em;
        }
        .org-right { padding-top: 8px; }
        .org-body {
          font-size: 0.97rem;
          line-height: 1.88;
          color: rgba(247,244,237,0.72);
          margin-bottom: 20px;
          font-weight: 300;
        }
        .org-body:last-of-type { margin-bottom: 36px; }

        /* ============================================================
           6. HOW IT WORKS
           Ivory dark. Own editorial composition — not another left/right split.
           Section title + coaching phrase establish the vertical anchor.
           Body paragraphs follow in a descending offset reading sequence:
           each paragraph indented slightly more than the last, creating
           a staircase of progressive depth without cards or numbering.
        ============================================================ */
        .how-it-works {
          background: var(--ivory-dark);
          padding: 100px 72px;
        }
        .how-inner { max-width: 1000px; margin: 0 auto; }
        .how-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.8vw, 34px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }
        .how-tagline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(16px, 1.6vw, 20px);
          font-weight: 400;
          font-style: italic;
          color: var(--slate-mid);
          margin-bottom: 56px;
          letter-spacing: -0.01em;
        }
        /* Staircase offset: three paragraphs at increasing left indent */
        .how-body-1 {
          font-size: 0.97rem;
          line-height: 1.88;
          color: var(--text-mid);
          margin-bottom: 24px;
          font-weight: 300;
          max-width: 620px;
          margin-left: 0;
        }
        .how-body-2 {
          font-size: 0.97rem;
          line-height: 1.88;
          color: var(--text-mid);
          margin-bottom: 24px;
          font-weight: 300;
          max-width: 580px;
          margin-left: clamp(32px, 6%, 72px);
        }
        .how-body-3 {
          font-size: 0.97rem;
          line-height: 1.88;
          color: var(--text-mid);
          font-weight: 300;
          max-width: 560px;
          margin-left: clamp(64px, 12%, 144px);
        }

        /* ============================================================
           7. THE ENGAGEMENT
           Ivory. Two-column preserved.
           Detail items larger and more prominent — not fine print.
           $3,600 treatment unchanged.
        ============================================================ */
        .engagement {
          background: var(--ivory);
          padding: 100px 72px 72px;
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
          margin-bottom: 24px;
          letter-spacing: -0.01em;
          line-height: 1.25;
        }
        .engagement-intro-note {
          font-size: 0.92rem;
          line-height: 1.75;
          color: var(--text-muted);
          margin-bottom: 32px;
          font-weight: 300;
        }
        /* Detail items — clear, readable, not fine print */
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
          padding-top: 32px;
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
          font-size: 2.2rem;
          font-weight: 400;
          color: var(--slate-mid);
          line-height: 1;
        }

        /* ============================================================
           8. CLOSING
           Ivory dark. Asymmetric: headline left, CTA right.
           Warm transition before navy footer.
        ============================================================ */
        .closing {
          background: var(--ivory-dark);
          padding: 100px 72px;
          border-top: 1px solid var(--rule);
        }
        .closing-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 5fr 7fr;
          gap: 80px;
          align-items: center;
        }
        .closing-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(26px, 3vw, 40px);
          font-weight: 400;
          line-height: 1.2;
          color: var(--text);
          letter-spacing: -0.01em;
        }

        /* ============================================================
           RESPONSIVE
        ============================================================ */
        @media (max-width: 1024px) {
          .hero { padding: 140px 48px 80px; }
          .hero-subhead { margin-left: 0; max-width: 100%; }
          .hero-cta { margin-left: 0; }
          .challenge { padding: 80px 48px; }
          .client-story { padding: 64px 48px; }
          .work-on { padding: 80px 48px; }
          .work-selector { grid-template-columns: 260px 1fr; }
          .work-panel { padding: 32px 0 32px 40px; }
          .organizational { padding: 80px 48px; }
          .organizational-inner { grid-template-columns: 1fr; gap: 40px; }
          .how-it-works { padding: 80px 48px; }
          .how-body-2 { margin-left: 40px; }
          .how-body-3 { margin-left: 80px; }
          .engagement { padding: 80px 48px; }
          .engagement-inner { grid-template-columns: 1fr; gap: 56px; }
          .closing { padding: 80px 48px; }
          .closing-inner { grid-template-columns: 1fr; gap: 40px; }
        }
        @media (max-width: 768px) {
          .work-selector-desktop { display: none; }
          .work-mobile-list { display: flex; flex-direction: column; }
        }
        @media (max-width: 640px) {
          .hero { padding: 120px 24px 64px; }
          .challenge { padding: 64px 24px; }
          .client-story { padding: 56px 24px; }
          .story-text { padding-left: 20px; }
          .work-on { padding: 64px 24px; }
          .organizational { padding: 64px 24px; }
          .how-it-works { padding: 64px 24px; }
          .how-body-2 { margin-left: 0; }
          .how-body-3 { margin-left: 0; }
          .engagement { padding: 64px 24px; }
          .closing { padding: 64px 24px; }
        }
      `}</style>

      {/* ===== 1. HERO ===== */}
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-context">For Individuals</p>
          <h1 className="hero-headline">Coaching that follows your lead.</h1>
          <p className="hero-subhead">One-to-one coaching for executives and senior leaders — addressing the professional challenge in front of you and everything connected to it. On your terms. For your success.</p>
          <div className="hero-cta">
            <a href="/contact" className="btn btn-outline-light">Schedule a Discovery Call</a>
          </div>
        </div>
      </section>

      {/* ===== 2. CHALLENGE ===== */}
      <section className="challenge">
        <div className="challenge-inner">
          <h2 className="challenge-headline">What got you here may not be enough for what comes next.</h2>
          <p className="challenge-body">Strong performance creates opportunity. But performing well and leading well are different capabilities — and at each new level, the demands shift in ways that catch even excellent leaders off guard.</p>
          <p className="challenge-body">Here's what most leadership development won't say directly: the challenge in front of you is rarely the whole story.</p>
          <p className="challenge-body">The pattern you keep running into at work often has a counterpart somewhere else — in how you manage your energy, a relationship under strain, something you haven't fully addressed financially, or a sense that your environment isn't quite right.</p>
          <p className="challenge-body">Addressing only the professional surface produces partial results. This coaching goes further.</p>
        </div>
      </section>

      {/* ===== 3. COACHING EXAMPLE ===== */}
      <section className="client-story">
        <div className="client-story-inner">
          <h2 className="story-heading">A coaching example</h2>
          <div className="story-text">A client came to me seeking to improve his executive presence and communication. What we found underneath was a true desire to function in a new role that required collaborative communication techniques across the organization and with no clear lines of authority coupled with a desire to be more present with his growing family. What changed was a new perspective that was less outcome and more process, and awareness that leveraged his previous experience, plus a definition of what family presence meant, and a plan to achieve it.</div>
        </div>
      </section>

      {/* ===== 4. WHAT WE WORK ON ===== */}
      <section className="work-on">
        <div className="work-on-inner">
          <h2 className="work-on-heading">What we work on.</h2>

          {/* Desktop: editorial index + panel */}
          <div
            className="work-selector work-selector-desktop"
            role="tablist"
            aria-label="What we work on"
          >
            <div className="work-index">
              {workAreas.map((area, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={active === i}
                  aria-controls="work-panel"
                  id={`work-tab-${i}`}
                  className={`work-index-btn${active === i ? ' active' : ''}`}
                  onClick={() => select(i)}
                  onKeyDown={(e) => handleKey(e, i)}
                  tabIndex={active === i ? 0 : -1}
                >
                  <span className="work-index-num">{area.num}</span>
                  <span className="work-index-title">{area.title}</span>
                </button>
              ))}
            </div>
            <div
              id="work-panel"
              role="tabpanel"
              aria-labelledby={`work-tab-${active}`}
              aria-live="polite"
              className="work-panel"
            >
              <div className={`work-panel-content ${fading ? 'fading' : 'visible'}`}>
                <div className="work-panel-title">{workAreas[active].title}</div>
                <p className="work-panel-body">{workAreas[active].body}</p>
              </div>
            </div>
          </div>

          {/* Mobile: static stacked list */}
          <div className="work-mobile-list">
            {workAreas.map((area, i) => (
              <div key={i} className="work-mobile-item">
                <div className="work-mobile-num">{area.num}</div>
                <div className="work-mobile-title">{area.title}</div>
                <p className="work-mobile-body">{area.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EDITORIAL PHOTO BREAK ===== */}
      <div style={{lineHeight:0,overflow:'hidden'}}>
        <img
          src="/images/executive-coaching.jpg"
          alt=""
          aria-hidden="true"
          style={{
            width:'100%',
            height:'clamp(280px, 32vw, 460px)',
            objectFit:'cover',
            objectPosition:'center center',
            display:'block',
          }}
        />
      </div>

      {/* ===== 5. FOR ORGANIZATIONS ===== */}
      <section className="organizational">
        <div className="organizational-inner">
          <div className="org-left">
            <div className="org-label">For Organizations</div>
            <h2 className="org-headline">When you're investing in a leader who's struggling.</h2>
          </div>
          <div className="org-right">
            <p className="org-body">Sometimes the right move isn't a performance plan — it's a genuine investment in someone worth investing in. Sponsors bring me in when a talented leader is struggling: over their head in a new role, worn down by something outside of work, or simply not yet who the position needs them to be.</p>
            <p className="org-body">This isn't remediation theater. The organization defines the purpose of the engagement and the outcomes to watch for — but the coaching conversation itself stays a confidential space for the leader to do real work. I've coached people through exactly this kind of moment. Real change is possible when someone gets genuine support instead of just a warning.</p>
            <a href="/contact" className="btn btn-outline-light">Schedule an Organizational Consultation</a>
          </div>
        </div>
      </section>

      {/* ===== 6. HOW IT WORKS ===== */}
      <section className="how-it-works">
        <div className="how-inner">
          <h2 className="how-heading">How it works.</h2>
          <p className="how-tagline">Coaching that follows your lead.</p>
          <p className="how-body-1">You bring what's most present in the moment — the decision, the thing you can't stop thinking about — and we work through it together. We explore your values, challenge assumptions, and open perspectives you may not have considered from inside the situation. This is results- and outcomes-focused work. You deserve a return on your time and investment as you identify and achieve your greatest goals.</p>
          <p className="how-body-2">And because life doesn't separate neatly into professional and personal, we don't either. We work with all of it — on your terms, for your success.</p>
          <p className="how-body-3">Insight without action is just an interesting conversation — we go beyond that. Every session produces something concrete: a commitment you define, a step you choose, a thing you finally decide to do. You keep pushing forward.</p>
        </div>
      </section>

      {/* ===== 7. THE ENGAGEMENT ===== */}
      <section className="engagement">
        <div className="engagement-inner">
          <div>
            <p className="engagement-context">The engagement</p>
            <h2 className="engagement-headline">Six Months. Twelve Sessions. Your Agenda.</h2>
            <p className="engagement-intro-note">15 minutes to understand your situation and confirm mutual fit — before any commitment.</p>
            <a href="/contact" className="btn btn-navy">Schedule Your Free Intro Call</a>
          </div>
          <div>
            <div className="engagement-details">
              {engagementDetails.map((item, i) => (
                <div key={i} className="engagement-detail-item">{item}</div>
              ))}
            </div>
            <div className="investment-block">
              <div className="investment-label">Investment</div>
              <div className="investment-amount">$3,600</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 8. CLOSING ===== */}
      <section className="closing">
        <div className="closing-inner">
          <h2 className="closing-headline">Together we get Beyond your Horizon.</h2>
          <div>
            <a href="/contact" className="btn btn-outline-dark">Schedule a Discovery Call</a>
          </div>
        </div>
      </section>
    </>
  )
}