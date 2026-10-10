'use client'

import { useState } from 'react'

// PLACEHOLDER: Confirm the executive-presence client is comfortable
// with the anonymized story in "What this looks like in practice"
// before this page goes live. Copy is from v7 exactly.

const workAreas = [
  {
    num: '01',
    title: 'Leading through others.',
    body: 'Moving from doing the work yourself to building a team that does it well, without lowering your standards.',
  },
  {
    num: '02',
    title: 'Presence and influence.',
    body: 'How you show up in hard conversations and high-stakes moments, including the patterns that are hardest to see from the inside.',
  },
  {
    num: '03',
    title: 'Sustainable performance.',
    body: "Finding what's draining you, at work and outside it, and building a foundation that doesn't depend on heroic effort.",
  },
  {
    num: '04',
    title: 'Whatever is most pressing.',
    body: "A career decision, a difficult relationship, the weight of carrying too much for too long. If it affects how you lead, it's in scope.",
  },
]

const engagementDetails = [
  '12 one-hour sessions, every other week',
  '8 Pillars whole-person assessment at the start',
  'Commitments at each session that you define',
  'Accountability between sessions by email or text',
  "Final session: reflection, integration, and a plan for what's next",
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
      <style dangerouslySetInnerHTML={{ __html: `
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
        .btn-gold { background: var(--gold); color: var(--navy); }
        .btn-gold:hover { background: #b8911f; }
        .btn-outline-light { background: transparent; color: var(--ivory); border: 1px solid rgba(247,244,237,0.35); }
        .btn-outline-light:hover { background: rgba(247,244,237,0.1); }

        /* ============================================================
           1. HERO
           Slate. "For Leaders" context label.
        ============================================================ */
        .hero { background: var(--slate); padding: 160px 72px 100px; }
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
           2. SOUND FAMILIAR
           Ivory. Left-anchored wider composition.
        ============================================================ */
        .familiar { background: var(--ivory); padding: 100px 72px; }
        .familiar-inner { max-width: 1100px; margin: 0 auto; }
        .familiar-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(26px, 3vw, 38px);
          font-weight: 400;
          line-height: 1.22;
          color: var(--text);
          margin-bottom: 40px;
          letter-spacing: -0.01em;
          max-width: 740px;
        }
        .familiar-body {
          font-size: 0.97rem;
          line-height: 1.88;
          color: var(--text-mid);
          margin-bottom: 20px;
          font-weight: 300;
          max-width: 640px;
        }
        .familiar-body:last-child { margin-bottom: 0; }

        /* ============================================================
           3. WHAT THIS LOOKS LIKE IN PRACTICE
           Ivory dark. Narrow column, slate left rule.
        ============================================================ */
        .client-story { background: var(--ivory-dark); padding: 80px 72px; }
        .client-story-inner { max-width: 720px; margin: 0 auto; }
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
           4. WHAT WE WORK ON
           Ivory. Desktop: index left, panel right.
           v7: gold number, navy bold title, regular body.
           Mobile: static stacked list.
        ============================================================ */
        .work-on { background: var(--ivory); padding: 100px 72px; border-top: 1px solid var(--rule); }
        .work-on-inner { max-width: 1100px; margin: 0 auto; }
        .work-on-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.8vw, 34px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 56px;
          letter-spacing: -0.01em;
        }

        .work-selector { display: grid; grid-template-columns: 300px 1fr; border-top: 1px solid var(--rule); }
        .work-index { border-right: 1px solid var(--rule); }
        .work-index-btn {
          display: block; width: 100%; background: none; border: none;
          padding: 32px 28px 32px 20px; text-align: left; cursor: pointer;
          position: relative; transition: none;
        }
        .work-index-btn + .work-index-btn { border-top: 1px solid rgba(28,43,58,0.05); }
        .work-index-btn:focus-visible { outline: 2px solid var(--slate); outline-offset: -2px; z-index: 1; }
        .work-index-btn.active::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 2px; background: var(--slate-mid);
        }
        .work-index-num {
          font-size: 0.65rem;
          color: var(--gold);
          letter-spacing: 0.04em;
          margin-bottom: 6px;
          font-weight: 500;
          display: block;
        }
        .work-index-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-muted);
          line-height: 1.3;
          letter-spacing: -0.01em;
          transition: color 0.18s;
          display: block;
        }
        .work-index-btn.active .work-index-title { color: var(--text); }
        .work-index-btn:hover:not(.active) .work-index-title { color: var(--text-mid); }

        .work-panel { padding: 40px 0 40px 56px; }
        .work-panel-content { transition: opacity 0.2s ease; }
        .work-panel-content.fading { opacity: 0; }
        .work-panel-content.visible { opacity: 1; }
        .work-panel-num {
          font-size: 0.65rem;
          color: var(--gold);
          letter-spacing: 0.04em;
          margin-bottom: 10px;
          font-weight: 500;
        }
        .work-panel-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 2.6vw, 32px);
          font-weight: 600;
          color: var(--navy);
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

        .work-selector-desktop { display: grid; }
        .work-mobile-list { display: none; }
        .work-mobile-item { padding: 32px 0; border-bottom: 1px solid var(--rule); }
        .work-mobile-item:first-child { border-top: 1px solid var(--rule); }
        .work-mobile-num { font-size: 0.65rem; color: var(--gold); letter-spacing: 0.04em; margin-bottom: 8px; font-weight: 500; }
        .work-mobile-title { font-family: 'DM Serif Display', serif; font-size: 1.1rem; color: var(--navy); font-weight: 600; margin-bottom: 12px; line-height: 1.3; letter-spacing: -0.01em; }
        .work-mobile-body { font-size: 0.93rem; line-height: 1.82; color: var(--text-mid); font-weight: 300; }

        /* ============================================================
           5. HOW IT WORKS
           Ivory dark. Staircase layout — preserved from current page.
        ============================================================ */
        .how-it-works { background: var(--ivory-dark); padding: 100px 72px; }
        .how-inner { max-width: 1000px; margin: 0 auto; }
        .how-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.8vw, 34px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 56px;
          letter-spacing: -0.01em;
        }
        .how-body-1 {
          font-size: 0.97rem; line-height: 1.88; color: var(--text-mid);
          margin-bottom: 24px; font-weight: 300; max-width: 620px; margin-left: 0;
        }
        .how-body-2 {
          font-size: 0.97rem; line-height: 1.88; color: var(--text-mid);
          font-weight: 300; max-width: 560px;
          margin-left: clamp(64px, 12%, 144px);
        }

        /* ============================================================
           6. WHAT'S POSSIBLE
           Ivory. Single statement.
        ============================================================ */
        .possible { background: var(--ivory); padding: 100px 72px; border-top: 1px solid var(--rule); }
        .possible-inner { max-width: 1100px; margin: 0 auto; }
        .possible-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.8vw, 34px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 32px;
          letter-spacing: -0.01em;
        }
        .possible-body {
          font-size: 0.97rem;
          line-height: 1.88;
          color: var(--text-mid);
          font-weight: 300;
          max-width: 640px;
        }

        /* ============================================================
           7. THE ENGAGEMENT
           Ivory dark. Two-column with detail list and investment.
        ============================================================ */
        .engagement { background: var(--ivory-dark); padding: 100px 72px 72px; border-top: 1px solid var(--rule); }
        .engagement-inner {
          max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: start;
        }
        .engagement-context {
          font-size: 0.78rem; color: var(--text-muted);
          letter-spacing: 0.03em; font-weight: 500;
          text-transform: uppercase; margin-bottom: 16px;
        }
        .engagement-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 2.5vw, 32px);
          font-weight: 400; color: var(--text);
          margin-bottom: 32px; letter-spacing: -0.01em; line-height: 1.25;
        }
        .engagement-details { display: flex; flex-direction: column; }
        .engagement-detail-item {
          padding: 18px 0; border-bottom: 1px solid var(--rule);
          font-size: 0.93rem; line-height: 1.7;
          color: var(--text-mid); font-weight: 300;
        }
        .engagement-detail-item:first-child { border-top: 1px solid var(--rule); }
        .investment-block { margin-top: 36px; padding-top: 32px; border-top: 1px solid var(--rule); }
        .investment-label {
          font-size: 0.72rem; color: var(--text-muted);
          letter-spacing: 0.06em; text-transform: uppercase;
          margin-bottom: 10px; font-weight: 500;
        }
        .investment-amount {
          font-family: 'DM Serif Display', serif;
          font-size: 2.2rem; font-weight: 400;
          color: var(--slate-mid); line-height: 1;
        }

        /* Sponsor link */
        .sponsor-link {
          font-size: 0.88rem;
          color: var(--text-muted);
          font-weight: 300;
          line-height: 1.7;
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid var(--rule);
          max-width: 1100px;
          margin-left: auto;
          margin-right: auto;
        }
        .sponsor-link a {
          color: var(--slate-mid);
          text-decoration: none;
          font-weight: 400;
        }
        .sponsor-link a:hover { text-decoration: underline; }

        /* ============================================================
           RESPONSIVE
        ============================================================ */
        @media (max-width: 1024px) {
          .hero { padding: 140px 48px 80px; }
          .hero-subhead { margin-left: 0; max-width: 100%; }
          .hero-cta { margin-left: 0; }
          .familiar { padding: 80px 48px; }
          .client-story { padding: 64px 48px; }
          .work-on { padding: 80px 48px; }
          .work-selector { grid-template-columns: 260px 1fr; }
          .work-panel { padding: 32px 0 32px 40px; }
          .how-it-works { padding: 80px 48px; }
          .how-body-2 { margin-left: 40px; }
          .possible { padding: 80px 48px; }
          .engagement { padding: 80px 48px; }
          .engagement-inner { grid-template-columns: 1fr; gap: 56px; }
        }
        @media (max-width: 768px) {
          .work-selector-desktop { display: none; }
          .work-mobile-list { display: flex; flex-direction: column; }
        }
        @media (max-width: 640px) {
          .hero { padding: 120px 24px 64px; }
          .familiar { padding: 64px 24px; }
          .client-story { padding: 56px 24px; }
          .story-text { padding-left: 20px; }
          .work-on { padding: 64px 24px; }
          .how-it-works { padding: 64px 24px; }
          .how-body-2 { margin-left: 0; }
          .possible { padding: 64px 24px; }
          .engagement { padding: 64px 24px; }
        }
      ` }} />

      {/* ===== 1. HERO ===== */}
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-context">For Leaders</p>
          <h1 className="hero-headline">When the challenges are outpacing the solutions.</h1>
          <p className="hero-subhead">You're not getting the results you want from yourself or your team, and working harder isn't closing the gap.</p>
          <div className="hero-cta">
            <a href="/contact" className="btn btn-gold">Schedule a Free 15-Minute Call</a>
          </div>
        </div>
      </section>

      {/* ===== 2. SOUND FAMILIAR ===== */}
      <section className="familiar">
        <div className="familiar-inner">
          <h2 className="familiar-headline">Sound familiar?</h2>
          <p className="familiar-body">You've earned your role. But the challenges are complex, the environment is ambiguous, the pace is unrelenting, and the approach that got you here isn't working the way it used to. You're thinking about work at dinner. The team isn't moving the way you need it to. Goals you care about keep getting pushed to next quarter.</p>
          <p className="familiar-body">Most leaders respond by working harder. Holding course and speed rarely fixes it, and the cost usually shows up somewhere you can't afford: your health, your family, your team's trust in you.</p>
          <p className="familiar-body">The challenge in front of you is rarely the whole story. That's where we start.</p>
        </div>
      </section>

      {/* ===== 3. WHAT THIS LOOKS LIKE IN PRACTICE ===== */}
      {/* PLACEHOLDER: Confirm executive-presence client is comfortable
          with this anonymized story before page goes live. Copy is from v7 exactly. */}
      <section className="client-story">
        <div className="client-story-inner">
          <h2 className="story-heading">What this looks like in practice</h2>
          <div className="story-text">
            <p>A leader came to me to strengthen his executive presence. As we worked, the real challenge came into focus. His new role required him to lead through influence across the organization, without clear authority, while he also wanted to be more present for a growing family. He shifted from chasing outcomes to building a process and drew on experience he'd been underusing. He also defined what being present at home meant to him and built a plan to get there.</p>
          </div>
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
                <div className="work-panel-num">{workAreas[active].num}</div>
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

      {/* ===== 5. HOW IT WORKS ===== */}
      <section className="how-it-works">
        <div className="how-inner">
          <h2 className="how-heading">How it works.</h2>
          <p className="how-body-1">You bring what matters most right now, and we work through it together. I'll ask questions that challenge your assumptions and open up options you can't see from inside the situation. You leave every session with a commitment you defined and a next step you chose.</p>
          <p className="how-body-2">This is your agenda. I bring the structure and the questions.</p>
        </div>
      </section>

      {/* ===== 6. WHAT'S POSSIBLE ===== */}
      <section className="possible">
        <div className="possible-inner">
          <h2 className="possible-heading">What's possible.</h2>
          <p className="possible-body">Your team brings you solutions, not problems. You make the hard calls without replaying them at 2 a.m. You're home for dinner, and you're actually present.</p>
        </div>
      </section>

      {/* ===== 7. THE ENGAGEMENT ===== */}
      <section className="engagement">
        <div className="engagement-inner">
          <div>
            <p className="engagement-context">The engagement</p>
            <h2 className="engagement-headline">Six months. Twelve sessions. Your agenda.</h2>
            <a href="/contact" className="btn btn-gold">Schedule a Free 15-Minute Call</a>
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
        <div className="sponsor-link">
          Sponsoring a leader? If your organization is investing in developing one of its leaders, see how organizational engagements work. <a href="/for-organizations">For Organizations →</a>
        </div>
      </section>
    </>
  )
}