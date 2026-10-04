const pillars = [
  {
    num: '01',
    name: 'Values, Ethical & Moral Compass',
    subtitle: 'Character, integrity, and values-aligned decisions',
    body: 'Under pressure and in ambiguity, character is what remains. This pillar is about who you are when the rules don\'t cover it.',
  },
  {
    num: '02',
    name: 'Professional Excellence',
    subtitle: 'Craft, credibility, and continued development',
    body: 'Credibility is currency and needs active stewardship — including recognizing when what has always worked no longer does.',
  },
  {
    num: '03',
    name: 'Physical Health & Readiness',
    subtitle: 'Energy, endurance, and cognitive capacity',
    body: 'Sleep, exercise, and recovery are the infrastructure of sustained leadership, not a fitness trend.',
  },
  {
    num: '04',
    name: 'Financial Stewardship',
    subtitle: 'Stability and freedom from cognitive load',
    body: 'Unresolved financial stress consumes bandwidth a leader needs for every decision.',
  },
  {
    num: '05',
    name: 'Cognitive Fortitude',
    subtitle: 'Clarity and sound judgment under pressure',
    body: 'Thinking clearly under sustained pressure is a skill you can build: how you interpret setbacks, manage uncertainty, and keep perspective when the situation is loud.',
  },
  {
    num: '06',
    name: 'Emotional Equanimity',
    subtitle: 'Regulation, presence, and impact on culture',
    body: 'A leader\'s emotional state spreads through a team. The goal is to feel difficulty without being governed by it.',
  },
  {
    num: '07',
    name: 'Relational Harmony',
    subtitle: 'Trust and connection at work and at home',
    body: 'The quality of your most important relationships determines the support available when things get hard.',
  },
  {
    num: '08',
    name: 'Environmental Harmony',
    subtitle: 'Culture, values alignment, and contextual fit',
    body: 'Some leadership challenges are context problems, not leader problems. Recognizing the difference is itself a leadership skill.',
  },
]

const science = [
  {
    name: 'Positive psychology',
    body: 'Dr. Martin Seligman\'s PERMA research established that human flourishing spans multiple interdependent life domains. It became the scientific foundation of the U.S. Army\'s Comprehensive Soldier and Family Fitness program.',
  },
  {
    name: 'Total Leadership',
    body: 'Stewart Friedman\'s research at the Wharton School found that leaders who invest across work, home, community, and self outperform those who sacrifice one area for another.',
  },
  {
    name: 'Stress and executive function',
    body: 'Chronic stress impairs the prefrontal cortex, the seat of judgment and emotional regulation. Financial worry alone can reduce cognitive performance as much as significant sleep loss (Mani et al., Science, 2013).',
  },
  {
    name: 'Work-life boundary research',
    body: 'Studies of boundary management (Kossek et al.) show that flexible integration sustains performance better than rigid separation.',
  },
]

export default function The8Pillars() {
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

        /* ============================================================
           1. HERO
           Ivory. Headline + subhead asymmetric.
        ============================================================ */
        .hero { background: var(--ivory); padding: 160px 72px 100px; }
        .hero-composition { max-width: 1320px; position: relative; }
        .hero-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(34px, 4.8vw, 64px);
          font-weight: 400;
          line-height: 1.1;
          color: var(--text);
          letter-spacing: -0.02em;
          max-width: 680px;
          margin-bottom: 0;
        }
        .hero-subhead {
          font-size: 1rem;
          line-height: 1.82;
          color: var(--text-mid);
          max-width: 420px;
          font-weight: 300;
          margin-top: 5px;
          margin-left: auto;
        }

        /* ============================================================
           2. WHAT MOST FRAMEWORKS MISS
           Ivory dark. Left: body. Right: pull quote sticky.
        ============================================================ */
        .miss { background: var(--ivory-dark); padding: 100px 72px; }
        .miss-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 7fr 5fr;
          gap: 80px;
          align-items: start;
        }
        .miss-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 2.4vw, 30px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 32px;
          letter-spacing: -0.01em;
          line-height: 1.28;
        }
        .miss-body {
          font-size: 0.97rem;
          line-height: 1.88;
          color: var(--text-mid);
          margin-bottom: 20px;
          font-weight: 300;
        }
        .miss-body:last-child { margin-bottom: 0; }
        .miss-quote-col { padding-top: 8px; position: sticky; top: 100px; }
        .miss-quote {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(18px, 1.8vw, 22px);
          font-weight: 400;
          line-height: 1.55;
          color: var(--slate-mid);
          margin-bottom: 16px;
          font-style: italic;
        }
        .miss-quote-attr { font-size: 0.78rem; color: var(--text-muted); font-weight: 400; }

        /* ============================================================
           3. WHERE THE FRAMEWORK COMES FROM
           Slate pale. 2x2 typographic grid.
        ============================================================ */
        .science {
          background: var(--slate-pale);
          padding: 100px 72px;
          border-top: 1px solid rgba(76,120,160,0.15);
          border-bottom: 1px solid rgba(76,120,160,0.15);
        }
        .science-inner { max-width: 1100px; margin: 0 auto; }
        .science-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 2.4vw, 30px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 56px;
          letter-spacing: -0.01em;
          text-align: center;
          max-width: 560px;
          margin-left: auto;
          margin-right: auto;
        }
        .science-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 48px;
          row-gap: 0;
        }
        .science-cell {
          padding: 36px 0;
          border-bottom: 1px solid rgba(76,120,160,0.15);
        }
        .science-cell:nth-child(1),
        .science-cell:nth-child(2) { border-top: 1px solid rgba(76,120,160,0.15); }
        .science-cell-name {
          font-family: 'DM Serif Display', serif;
          font-size: 1.05rem;
          font-weight: 400;
          color: var(--slate-mid);
          margin-bottom: 16px;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }
        .science-cell-body {
          font-size: 0.88rem;
          line-height: 1.82;
          color: var(--text-muted);
          font-weight: 300;
        }

        /* ============================================================
           4. THE 8 PILLARS
           Ivory. Desktop: horizontal tab index + reading panel.
           Mobile: single-column stack.
        ============================================================ */
        .pillars { background: var(--ivory); padding: 100px 72px; }
        .pillars-inner { max-width: 1100px; margin: 0 auto; }
        .pillars-intro-head {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.8vw, 36px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 64px;
          letter-spacing: -0.01em;
          text-align: center;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        /* 4x2 card grid — desktop */
        .pillar-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          border-top: 1px solid var(--rule);
          border-left: 1px solid var(--rule);
        }
        .pillar-card {
          padding: 28px 24px 28px 20px;
          border-right: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
          border-left: 3px solid var(--navy);
          margin-left: -1px;
        }
        .pillar-card-num {
          font-size: 0.62rem;
          color: var(--text-muted);
          font-weight: 500;
          letter-spacing: 0.04em;
          margin-bottom: 10px;
          display: block;
        }
        .pillar-card-name {
          font-family: 'DM Serif Display', serif;
          font-size: 1rem;
          font-weight: 400;
          color: var(--text);
          line-height: 1.3;
          margin-bottom: 6px;
          letter-spacing: -0.01em;
        }
        .pillar-card-subtitle {
          font-size: 0.78rem;
          color: var(--gold);
          font-style: italic;
          font-weight: 300;
          margin-bottom: 14px;
          line-height: 1.4;
        }
        .pillar-card-body {
          font-size: 0.87rem;
          line-height: 1.78;
          color: var(--text-mid);
          font-weight: 300;
        }

        /* Mobile: single-column card stack */
        .pillar-grid-mobile { display: none; flex-direction: column; gap: 0; }
        .pillar-grid-mobile .pillar-card { border-right: none; border-bottom: 1px solid var(--rule); }

        /* ============================================================
           5. HOW THE PILLARS WORK IN COACHING
           Ivory dark. Narrow single column. Numbered statements.
        ============================================================ */
        .coaching { background: var(--ivory-dark); padding: 100px 72px; border-top: 1px solid var(--rule); }
        .coaching-inner { max-width: 680px; margin: 0 auto; }
        .coaching-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 2.4vw, 30px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 48px;
          letter-spacing: -0.01em;
        }
        .coaching-steps { display: flex; flex-direction: column; }
        .coaching-step {
          display: grid;
          grid-template-columns: 32px 1fr;
          gap: 16px;
          padding: 20px 0;
          border-top: 1px solid var(--rule);
          align-items: baseline;
        }
        .coaching-step:last-child { border-bottom: 1px solid var(--rule); }
        .coaching-step-num { font-size: 0.68rem; color: var(--slate-mid); font-weight: 500; letter-spacing: 0.04em; padding-top: 2px; }
        .coaching-step-body { font-size: 0.97rem; line-height: 1.82; color: var(--text-mid); font-weight: 300; }
        .coaching-body { font-size: 0.97rem; line-height: 1.88; color: var(--text-mid); font-weight: 300; margin-top: 28px; }

        /* ============================================================
           6. GOLD CTA
           Ivory. Centered.
        ============================================================ */
        .cta-section { background: var(--ivory); padding: 100px 72px; border-top: 1px solid var(--rule); text-align: center; }

        /* ============================================================
           RESPONSIVE
        ============================================================ */
        @media (max-width: 1024px) {
          .hero { padding: 140px 48px 80px; }
          .hero-subhead { margin-left: 0; max-width: 560px; margin-top: 32px; }
          .miss { padding: 80px 48px; }
          .miss-inner { grid-template-columns: 1fr; gap: 40px; }
          .miss-quote-col { position: static; }
          .science { padding: 80px 48px; }
          .science-grid { grid-template-columns: 1fr; gap: 2px; }
          .pillars { padding: 80px 48px; }
          .pillar-grid { grid-template-columns: repeat(2, 1fr); }
          .coaching { padding: 80px 48px; }
          .cta-section { padding: 80px 48px; }
        }

        @media (max-width: 768px) {
          .pillar-grid { display: none; }
          .pillar-grid-mobile { display: block; }
        }

        @media (max-width: 640px) {
          .hero { padding: 120px 24px 64px; }
          .hero-subhead { margin-left: 0; max-width: 100%; margin-top: 24px; }
          .miss { padding: 64px 24px; }
          .science { padding: 64px 24px; }
          .pillars { padding: 64px 24px; }
          .coaching { padding: 64px 24px; }
          .cta-section { padding: 64px 24px; }
        }
      `}</style>

      {/* ===== 1. HERO ===== */}
      <section className="hero">
        <div className="hero-composition">
          <h1 className="hero-headline">The challenge in front of you is rarely the whole story.</h1>
          <p className="hero-subhead">The 8 Pillars is a whole-person framework grounded in peer-reviewed research on human flourishing and informed by neuroscience. It's the foundation of every coaching engagement and program at Beyond the Horizon.</p>
        </div>
      </section>

      {/* ===== 2. WHAT MOST LEADERSHIP FRAMEWORKS MISS ===== */}
      <section className="miss">
        <div className="miss-inner">
          <div>
            <h2 className="miss-headline">What most leadership frameworks miss.</h2>
            <p className="miss-body">Most frameworks ask what effective leaders do: which behaviors and competencies they need. The 8 Pillars asks a prior question: what is the condition of the leader doing all of those things?</p>
            <p className="miss-body">A leader carrying financial stress makes different decisions than the same leader who is financially clear. A leader with friction at home brings less to every meeting — not from a lack of professionalism, but because people aren't modular. What we carry in one part of life shows up in all the others.</p>
          </div>
          <div className="miss-quote-col">
            <p className="miss-quote">We don't aim for work-life balance, because balance implies a trade-off. Strength built in any part of your life reinforces the others. The goal is conscious, values-aligned integration.</p>
          </div>
        </div>
      </section>

      {/* ===== 3. WHERE THE FRAMEWORK COMES FROM ===== */}
      <section className="science">
        <div className="science-inner">
          <h2 className="science-heading">Where the framework comes from.</h2>
          <div className="science-grid">
            {science.map((s, i) => (
              <div key={i} className="science-cell">
                <div className="science-cell-name">{s.name}</div>
                <p className="science-cell-body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. THE 8 PILLARS ===== */}
      <section className="pillars">
        <div className="pillars-inner">
          <h2 className="pillars-intro-head">The 8 Pillars</h2>

          {/* Desktop: 4x2 card grid */}
          <div className="pillar-grid">
            {pillars.map((p, i) => (
              <div key={i} className="pillar-card">
                <span className="pillar-card-num">{p.num}</span>
                <div className="pillar-card-name">{p.name}</div>
                <div className="pillar-card-subtitle">{p.subtitle}</div>
                <p className="pillar-card-body">{p.body}</p>
              </div>
            ))}
          </div>

          {/* Mobile: stacked cards */}
          <div className="pillar-grid-mobile">
            {pillars.map((p, i) => (
              <div key={i} className="pillar-card">
                <span className="pillar-card-num">{p.num}</span>
                <div className="pillar-card-name">{p.name}</div>
                <div className="pillar-card-subtitle">{p.subtitle}</div>
                <p className="pillar-card-body">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5. HOW THE PILLARS WORK IN COACHING ===== */}
      <section className="coaching">
        <div className="coaching-inner">
          <h2 className="coaching-headline">How the Pillars work in coaching.</h2>
          <div className="coaching-steps">
            {[
              'For each pillar, you define what success looks like — your definition, not an imposed standard.',
              'You honestly assess where you stand today.',
              'The gap becomes your coaching agenda.',
              'Together, we identify what to grow — and what to say no to, to make room for it.',
            ].map((s, i) => (
              <div key={i} className="coaching-step">
                <div className="coaching-step-num">0{i + 1}</div>
                <p className="coaching-step-body">{s}</p>
              </div>
            ))}
          </div>
          <p className="coaching-body">That last step is often the most valuable. Most people aren't underperforming because they lack ability. They haven't been honest about what their current commitments are costing them.</p>
        </div>
      </section>

      {/* PLACEHOLDER: 8 Pillars self-assessment — in development.
          When ready, add a second button here: "Take the free 8 Pillars self-assessment."
          See v7 spec for placement and styling. */}

      {/* ===== 7. GOLD CTA ===== */}
      <section className="cta-section">
        <a href="/contact" className="btn btn-gold">Schedule a Free 15-Minute Call</a>
      </section>
    </>
  )
}