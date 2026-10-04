const stages = [
  { num: '01', label: 'Month 1 — Start with clarity.', body: 'An intake assessment and a one- to two-day kickoff. You define what success looks like for you and where you want to grow.' },
  { num: '02', label: 'Months 2–9 — One pillar at a time.', body: 'Each month focuses on one pillar, with two sessions: a structured session that uses a focused set of questions to assess where you are and where you want to be, and a coaching session where you set the agenda and work on whatever matters most right now.' },
  { num: '03', label: 'Month 10 — Lock it in.', body: 'Review what you\'ve learned, what has changed, and the commitments you\'re carrying forward.' },
  { num: '04', label: 'After the program — Support when you need it.', body: 'Optional as-needed coaching for the storms that come later.' },
]

export default function LeaderDevelopment() {
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
          --rule-light: rgba(247,244,237,0.12);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--ivory); color: var(--text); font-family: 'Inter', sans-serif; font-weight: 300; overflow-x: hidden; -webkit-font-smoothing: antialiased; }

        .btn { display: inline-flex; align-items: center; gap: 9px; padding: 13px 28px; font-size: 0.72rem; letter-spacing: 0.07em; text-transform: uppercase; text-decoration: none; transition: all 0.22s ease; font-weight: 500; cursor: pointer; border: none; font-family: 'Inter', sans-serif; white-space: nowrap; }
        .btn-gold { background: var(--gold); color: var(--navy); }
        .btn-gold:hover { background: #b8911f; }
        .btn-navy { background: var(--navy); color: var(--ivory); }
        .btn-navy:hover { background: var(--slate-mid); }
        .btn-outline-light { background: transparent; color: var(--ivory); border: 1px solid rgba(247,244,237,0.35); }
        .btn-outline-light:hover { background: rgba(247,244,237,0.1); }
        .btn-outline { background: transparent; color: var(--text); border: 1px solid rgba(28,43,58,0.28); }
        .btn-outline:hover { background: var(--navy); color: var(--ivory); border-color: var(--navy); }

        /* ============================================================
           1. HERO
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
        ============================================================ */
        .familiar { background: var(--ivory-dark); padding: 100px 72px; }
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

        /* ============================================================
           3. THE 8 PILLARS PROGRAM
        ============================================================ */
        .pillars { background: var(--ivory); padding: 100px 72px; border-top: 1px solid var(--rule); }
        .pillars-inner { max-width: 1100px; margin: 0 auto; }
        .pillars-intro { max-width: 860px; margin-bottom: 40px; }
        .pillars-intro-head {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.8vw, 34px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }
        .pillars-intro-label {
          font-size: 0.85rem;
          font-style: italic;
          color: var(--text-muted);
          margin-bottom: 20px;
          font-weight: 300;
        }
        .pillars-subhead {
          font-size: 0.93rem;
          line-height: 1.78;
          color: var(--text-muted);
          font-weight: 300;
          margin-bottom: 16px;
        }
        .pillars-names {
          font-size: 0.87rem;
          color: var(--text-muted);
          font-weight: 300;
          line-height: 1.6;
          margin-bottom: 8px;
        }

        .pillars-framework-link { margin-top: 48px; padding-top: 32px; border-top: 1px solid var(--rule); }
        .framework-link { font-size: 0.82rem; color: var(--slate-mid); text-decoration: none; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; transition: gap 0.2s; }
        .framework-link:hover { gap: 14px; }

        /* ============================================================
           4. HOW IT WORKS — four-stage horizontal timeline
        ============================================================ */
        .how { background: var(--ivory-dark); padding: 100px 72px; border-top: 1px solid var(--rule); }
        .how-inner { max-width: 1100px; margin: 0 auto; }
        .how-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.8vw, 34px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 64px;
          letter-spacing: -0.01em;
        }

        .how-timeline { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; position: relative; }
        .how-timeline::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 0;
          right: 0;
          height: 1px;
          background: var(--rule);
        }
        .how-stage { padding: 0 32px 0 0; position: relative; }
        .how-stage:last-child { padding-right: 0; }
        .how-stage-dot {
          width: 9px; height: 9px; border-radius: 50%;
          background: var(--slate-mid);
          position: relative; z-index: 1;
          margin-bottom: 28px; flex-shrink: 0;
        }
        .how-stage-num { font-size: 0.65rem; color: var(--slate-mid); letter-spacing: 0.06em; font-weight: 500; margin-bottom: 10px; display: block; }
        .how-stage-label { font-family: 'DM Serif Display', serif; font-size: 1.05rem; font-weight: 400; color: var(--text); margin-bottom: 14px; line-height: 1.3; letter-spacing: -0.01em; }
        .how-stage-body { font-size: 0.88rem; line-height: 1.78; color: var(--text-muted); font-weight: 300; }

        .how-list-mobile { display: none; flex-direction: column; }
        .how-list-item { padding: 28px 0 28px 24px; border-top: 1px solid var(--rule); border-left: 2px solid var(--rule); }
        .how-list-item:last-child { border-bottom: 1px solid var(--rule); }
        .how-list-num { font-size: 0.65rem; color: var(--slate-mid); letter-spacing: 0.06em; font-weight: 500; margin-bottom: 6px; display: block; }
        .how-list-label { font-family: 'DM Serif Display', serif; font-size: 1rem; font-weight: 400; color: var(--text); margin-bottom: 10px; line-height: 1.3; }
        .how-list-body { font-size: 0.9rem; line-height: 1.78; color: var(--text-muted); font-weight: 300; }

        /* ============================================================
           5. WHAT'S POSSIBLE
        ============================================================ */
        .outcomes { background: var(--ivory); padding: 100px 72px; border-top: 1px solid var(--rule); }
        .outcomes-inner { max-width: 1100px; margin: 0 auto; }
        .outcomes-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.8vw, 34px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 32px;
          letter-spacing: -0.01em;
        }
        .outcomes-body {
          font-size: 0.97rem;
          line-height: 1.88;
          color: var(--text-mid);
          font-weight: 300;
          max-width: 640px;
        }

        /* ============================================================
           6. THE ENGAGEMENT
        ============================================================ */
        .engagement { background: var(--ivory-dark); padding: 100px 72px; border-top: 1px solid var(--rule); }
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
          margin-bottom: 32px;
          letter-spacing: -0.01em;
          line-height: 1.25;
        }
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
        .investment-block { margin-top: 36px; padding-top: 32px; border-top: 1px solid var(--rule); }
        .investment-label { font-size: 0.72rem; color: var(--text-muted); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 10px; font-weight: 500; }
        .investment-amount { font-family: 'DM Serif Display', serif; font-size: 2.2rem; font-weight: 400; color: var(--slate-mid); line-height: 1; margin-bottom: 10px; }
        .investment-note { font-size: 0.82rem; color: var(--text-muted); font-weight: 300; line-height: 1.6; }

        /* ============================================================
           7. TEAM LINK
        ============================================================ */
        .team-link-section { background: var(--slate); padding: 80px 72px; }
        .team-link-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 5fr 7fr;
          gap: 80px;
          align-items: center;
        }
        .team-link-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 2.4vw, 32px);
          font-weight: 400;
          line-height: 1.25;
          color: var(--ivory);
          letter-spacing: -0.01em;
        }
        .team-link-body {
          font-size: 0.97rem;
          line-height: 1.88;
          color: rgba(247,244,237,0.72);
          margin-bottom: 28px;
          font-weight: 300;
        }

        /* ============================================================
           RESPONSIVE
        ============================================================ */
        @media (max-width: 1024px) {
          .hero { padding: 140px 48px 80px; }
          .hero-subhead { margin-left: 0; max-width: 100%; }
          .hero-cta { margin-left: 0; }
          .familiar { padding: 80px 48px; }
          .pillars { padding: 80px 48px; }
          .how { padding: 80px 48px; }
          .how-timeline { grid-template-columns: 1fr 1fr; gap: 48px 40px; }
          .how-timeline::before { display: none; }
          .outcomes { padding: 80px 48px; }
          .engagement { padding: 80px 48px; }
          .engagement-inner { grid-template-columns: 1fr; gap: 56px; }
          .team-link-section { padding: 64px 48px; }
          .team-link-inner { grid-template-columns: 1fr; gap: 32px; }
        }

        @media (max-width: 768px) {
          .how-timeline { display: none; }
          .how-list-mobile { display: flex; }
        }

        @media (max-width: 640px) {
          .hero { padding: 120px 24px 64px; }
          .familiar { padding: 64px 24px; }
          .pillars { padding: 64px 24px; }
          .how { padding: 64px 24px; }
          .outcomes { padding: 64px 24px; }
          .engagement { padding: 64px 24px; }
          .team-link-section { padding: 56px 24px; }
        }
      `}</style>

      {/* ===== 1. HERO ===== */}
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-context">For Leaders</p>
          <h1 className="hero-headline">You're leading people, and it's harder than you expected.</h1>
          <p className="hero-subhead">A ten-month development and coaching program for new leaders, stretched leaders, and anyone ready to become the leader they want to be, and the one their team needs.</p>
          <div className="hero-cta">
            <a href="/contact" className="btn btn-gold">Schedule a Free 15-Minute Call</a>
          </div>
        </div>
      </section>

      {/* ===== 2. SOUND FAMILIAR ===== */}
      <section className="familiar">
        <div className="familiar-inner">
          <h2 className="familiar-headline">Sound familiar?</h2>
          <p className="familiar-body">Maybe you were promoted over the people who were your peers last week. Maybe you've led for years, but your team has stalled and you can't see why. Maybe the role grew faster than you did.</p>
          <p className="familiar-body">You're capable. But leading people draws on more than your professional skills. It draws on your energy, judgment, relationships, and values, all at once. Most leadership training covers the first part and ignores the rest.</p>
          <p className="familiar-body">Figuring it out by trial and error works eventually. It usually costs a year and a few relationships along the way.</p>
        </div>
      </section>

      {/* ===== 3. THE 8 PILLARS PROGRAM ===== */}
      <section className="pillars">
        <div className="pillars-inner">
          <div className="pillars-intro">
            <h2 className="pillars-intro-head">The 8 Pillars Leadership Program</h2>
            <p className="pillars-intro-label">Leadership, Personal Development &amp; Coaching</p>
            <p className="pillars-subhead">This program develops the whole leader, not just leadership behaviors. It's built on the 8 Pillars, the areas of life that shape how well you lead:</p>
            <p className="pillars-names">Values · Professional Excellence · Physical Health · Financial Stewardship · Cognitive Fortitude · Emotional Equanimity · Relational Harmony · Environmental Harmony</p>
            <p className="pillars-subhead" style={{marginTop: '12px'}}>A weakness in one area shows up everywhere else. Strength in one area reinforces the others.</p>
          </div>

          <div className="pillars-framework-link">
            <a href="/the-8-pillars" className="framework-link">Explore the 8 Pillars →</a>
          </div>
        </div>
      </section>

      {/* ===== 4. HOW IT WORKS ===== */}
      <section className="how">
        <div className="how-inner">
          <h2 className="how-heading">How it works.</h2>

          {/* Desktop: horizontal timeline */}
          <div className="how-timeline">
            {stages.map((s, i) => (
              <div key={i} className="how-stage">
                <div className="how-stage-dot" aria-hidden="true" />
                <span className="how-stage-num">{s.num}</span>
                <div className="how-stage-label">{s.label}</div>
                <p className="how-stage-body">{s.body}</p>
              </div>
            ))}
          </div>

          {/* Mobile: stacked list */}
          <div className="how-list-mobile">
            {stages.map((s, i) => (
              <div key={i} className="how-list-item">
                <span className="how-list-num">{s.num}</span>
                <div className="how-list-label">{s.label}</div>
                <p className="how-list-body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5. WHAT'S POSSIBLE ===== */}
      <section className="outcomes">
        <div className="outcomes-inner">
          <h2 className="outcomes-heading">What's possible.</h2>
          <p className="outcomes-body">Your former peers now come to you for direction. Your team is moving, and you know why. And the growth holds, because it's built on more than technique.</p>
        </div>
      </section>

      {/* ===== 6. THE ENGAGEMENT ===== */}
      <section className="engagement">
        <div className="engagement-inner">
          <div>
            <p className="engagement-context">The engagement</p>
            <h2 className="engagement-headline">About 10 months, 16 or more sessions plus a kickoff.</h2>
            <a href="/contact" className="btn btn-gold">Schedule a Free 15-Minute Call</a>
          </div>
          <div>
            <div className="engagement-details">
              {[
                'About 10 months, 16 or more sessions plus a kickoff',
                '8 Pillars whole-person assessment',
                'Structured pillar sessions plus open coaching sessions',
                'Accountability between sessions by email or text',
                'Optional ongoing support after the program',
              ].map((item, i) => (
                <div key={i} className="engagement-detail-item">{item}</div>
              ))}
            </div>
            <div className="investment-block">
              <div className="investment-label">Investment</div>
              <div className="investment-amount">$6,000</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 7. TEAM LINK ===== */}
      <section className="team-link-section">
        <div className="team-link-inner">
          <h2 className="team-link-headline">Developing a whole team?</h2>
          <div>
            <p className="team-link-body">The program also runs for cohorts inside organizations.</p>
            <a href="/for-organizations" className="btn btn-outline-light">For Organizations →</a>
          </div>
        </div>
      </section>
    </>
  )
}