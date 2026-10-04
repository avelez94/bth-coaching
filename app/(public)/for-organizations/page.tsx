const ways = [
  {
    title: 'Support a leader who\'s struggling.',
    body: 'You see potential worth investing in. I coach that leader one-on-one to help them regain their footing. You help define the purpose of the engagement and what success looks like. The coaching conversations stay confidential, which is what makes real change possible.',
    price: 'Six months, 12 sessions — $3,600',
  },
  {
    title: 'Develop leaders across your team.',
    body: 'The 8 Pillars Leadership Program combines leadership development with individual coaching, built around a whole-person framework. Your leaders build skills and resilience together, and each one works on their own goals with a coach.',
    price: 'Ten months, tailorable — $6,000 per participant',
  },
  {
    title: 'Build a custom leadership program.',
    body: 'Your situation doesn\'t fit a standard program. I start by understanding your organization, its culture, and the real problem behind the stated one. Then I design and deliver a program that fits: supervisor development, executive team alignment, off-sites, or a full leadership curriculum.',
    price: 'Custom-scoped',
  },
]

const howSteps = [
  { label: 'Start with a conversation.', body: 'Tell me what you\'re seeing and what you need.' },
  { label: 'Agree on the purpose.', body: 'We define goals, boundaries, and how you\'ll see progress.' },
  { label: 'Do the work.', body: 'Your leaders get real support, and you see the difference in how they lead.' },
]

export default function ForOrganizations() {
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
           Slate. Context label. Wide headline. Subhead offset right.
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
           Ivory dark. Left-anchored, wider reading measure.
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
        .familiar-body:last-child { margin-bottom: 0; }

        /* ============================================================
           3. THREE WAYS
           Ivory. Three equal-weight cards with top rule separators.
           Price line small, italic, secondary.
        ============================================================ */
        .ways { background: var(--ivory); padding: 100px 72px; border-top: 1px solid var(--rule); }
        .ways-inner { max-width: 1100px; margin: 0 auto; }
        .ways-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.8vw, 34px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 56px;
          letter-spacing: -0.01em;
        }
        .ways-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          border-top: 1px solid var(--rule);
        }
        .way-card {
          padding: 36px 40px 36px 0;
          border-right: 1px solid var(--rule);
        }
        .way-card:last-child {
          border-right: none;
          padding-right: 0;
          padding-left: 40px;
        }
        .way-card:nth-child(2) { padding-left: 40px; }
        .way-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(18px, 1.8vw, 22px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 16px;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }
        .way-body {
          font-size: 0.9rem;
          line-height: 1.82;
          color: var(--text-mid);
          margin-bottom: 20px;
          font-weight: 300;
        }
        .way-price {
          font-size: 0.78rem;
          font-style: italic;
          color: var(--text-muted);
          font-weight: 300;
        }

        /* Mobile: stacked */
        .ways-grid-mobile { display: none; flex-direction: column; }
        .way-mobile {
          padding: 32px 0;
          border-top: 1px solid var(--rule);
        }
        .way-mobile:last-child { border-bottom: 1px solid var(--rule); }

        /* ============================================================
           4. HOW IT WORKS
           Ivory dark. Three numbered steps, ruled list.
        ============================================================ */
        .how { background: var(--ivory-dark); padding: 100px 72px; border-top: 1px solid var(--rule); }
        .how-inner { max-width: 1100px; margin: 0 auto; }
        .how-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.8vw, 34px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 56px;
          letter-spacing: -0.01em;
        }
        .how-steps { display: flex; flex-direction: column; max-width: 720px; }
        .how-step {
          display: grid;
          grid-template-columns: 48px 1fr;
          gap: 0 24px;
          padding: 24px 0;
          border-top: 1px solid var(--rule);
          align-items: baseline;
        }
        .how-step:last-child { border-bottom: 1px solid var(--rule); }
        .how-step-num {
          font-size: 0.68rem;
          color: var(--slate-mid);
          letter-spacing: 0.06em;
          font-weight: 500;
          padding-top: 3px;
        }
        .how-step-content {}
        .how-step-label {
          font-family: 'DM Serif Display', serif;
          font-size: 1.05rem;
          font-weight: 400;
          color: var(--text);
          margin-bottom: 6px;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }
        .how-step-body {
          font-size: 0.9rem;
          line-height: 1.75;
          color: var(--text-mid);
          font-weight: 300;
        }

        /* ============================================================
           5. WHAT'S POSSIBLE
           Ivory. Single statement, editorial weight.
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
           6. CONFIDENTIALITY
           Slate pale. Single statement at editorial scale.
        ============================================================ */
        .confidentiality {
          background: var(--slate-pale);
          padding: 80px 72px;
          border-top: 1px solid rgba(76,120,160,0.12);
          border-bottom: 1px solid rgba(76,120,160,0.12);
        }
        .confidentiality-inner { max-width: 1100px; margin: 0 auto; }
        .conf-label {
          font-size: 0.75rem;
          color: var(--slate-mid);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 20px;
        }
        .conf-body {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(18px, 2vw, 26px);
          font-weight: 400;
          line-height: 1.5;
          color: var(--slate-mid);
          max-width: 820px;
          letter-spacing: -0.01em;
        }

        /* ============================================================
           7. WHY ME
           Ivory dark. Asymmetric: credential statement left, body right.
        ============================================================ */
        .why { background: var(--ivory-dark); padding: 100px 72px; border-top: 1px solid var(--rule); }
        .why-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 5fr 7fr;
          gap: 80px;
          align-items: start;
        }
        .why-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 2.4vw, 32px);
          font-weight: 400;
          color: var(--text);
          letter-spacing: -0.01em;
          line-height: 1.25;
        }
        .why-body {
          font-size: 0.97rem;
          line-height: 1.88;
          color: var(--text-mid);
          margin-bottom: 24px;
          font-weight: 300;
        }
        .why-link {
          font-size: 0.82rem;
          color: var(--slate-mid);
          text-decoration: none;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: gap 0.2s;
        }
        .why-link:hover { gap: 14px; }

        /* ============================================================
           RESPONSIVE
        ============================================================ */
        @media (max-width: 1024px) {
          .hero { padding: 140px 48px 80px; }
          .hero-subhead { margin-left: 0; max-width: 100%; }
          .hero-cta { margin-left: 0; }
          .familiar { padding: 80px 48px; }
          .ways { padding: 80px 48px; }
          .ways-grid { grid-template-columns: 1fr; border-top: none; }
          .way-card { border-right: none; padding-right: 0; padding-left: 0; border-top: 1px solid var(--rule); }
          .way-card:last-child { padding-left: 0; }
          .way-card:nth-child(2) { padding-left: 0; }
          .how { padding: 80px 48px; }
          .outcomes { padding: 80px 48px; }
          .confidentiality { padding: 64px 48px; }
          .why { padding: 80px 48px; }
          .why-inner { grid-template-columns: 1fr; gap: 40px; }

        }

        @media (max-width: 640px) {
          .hero { padding: 120px 24px 64px; }
          .familiar { padding: 64px 24px; }
          .ways { padding: 64px 24px; }
          .how { padding: 64px 24px; }
          .outcomes { padding: 64px 24px; }
          .confidentiality { padding: 56px 24px; }
          .why { padding: 64px 24px; }

        }
      `}</style>

      {/* ===== 1. HERO ===== */}
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-context">For Organizations</p>
          <h1 className="hero-headline">You need your leaders to lead.</h1>
          <p className="hero-subhead">When someone isn't there yet, you can replace them or invest in them. I help you invest well.</p>
          <div className="hero-cta">
            <a href="/contact" className="btn btn-gold">Schedule an Organizational Consultation</a>
          </div>
        </div>
      </section>

      {/* ===== 2. SOUND FAMILIAR ===== */}
      <section className="familiar">
        <div className="familiar-inner">
          <h2 className="familiar-headline">Sound familiar?</h2>
          <p className="familiar-body">A talented leader is struggling. They're new to the role, or the culture isn't a fit, or something outside work is pulling at them. A team that should be performing has stalled, and nobody can say exactly why. Your leadership training checks the box, but nothing changes afterward.</p>
          <p className="familiar-body">You've tried feedback. You've tried patience. You're running low on both, and you still believe this person is worth it.</p>
          <p className="familiar-body">Doing nothing is expensive. Turnover, lost momentum, and a team watching how you handle it all cost more than addressing the problem directly.</p>
        </div>
      </section>

      {/* ===== 3. THREE WAYS ===== */}
      <section className="ways">
        <div className="ways-inner">
          <h2 className="ways-heading">Three ways I work with organizations.</h2>

          {/* Desktop: three-column grid */}
          <div className="ways-grid">
            {ways.map((w, i) => (
              <div key={i} className="way-card">
                <div className="way-title">{w.title}</div>
                <p className="way-body">{w.body}</p>
                <p className="way-price">{w.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. HOW IT WORKS ===== */}
      <section className="how">
        <div className="how-inner">
          <h2 className="how-heading">How it works.</h2>
          <div className="how-steps">
            {howSteps.map((s, i) => (
              <div key={i} className="how-step">
                <div className="how-step-num">0{i + 1}</div>
                <div className="how-step-content">
                  <div className="how-step-label">{s.label}</div>
                  <p className="how-step-body">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5. WHAT'S POSSIBLE ===== */}
      <section className="outcomes">
        <div className="outcomes-inner">
          <h2 className="outcomes-heading">What's possible.</h2>
          <p className="outcomes-body">The leader you almost lost becomes one others learn from. Your team stops working around a problem and starts delivering. You made the call to invest, and it paid off.</p>
        </div>
      </section>

      {/* ===== 6. A NOTE ON CONFIDENTIALITY ===== */}
      <section className="confidentiality">
        <div className="confidentiality-inner">
          <p className="conf-label">A note on confidentiality</p>
          <p className="conf-body">When you sponsor coaching, you help set the direction, and the conversations belong to the leader. That trust is what makes coaching work, and it protects your investment.</p>
        </div>
      </section>

      {/* ===== 7. WHY ME ===== */}
      <section className="why">
        <div className="why-inner">
          <h2 className="why-headline">Thirty years leading in the Navy and seven as a senior defense civilian.</h2>
          <div>
            <p className="why-body">Including turning around one of the lowest-performing commands in the Naval Reserve. I've led people through consolidations, culture problems, and high-stakes transitions, and I've coached leaders through the same.</p>
            <a href="/sample-engagements" className="why-link">See Sample Engagements →</a>
            <div style={{marginTop: '32px'}}>
              <a href="/contact" className="btn btn-gold">Schedule an Organizational Consultation</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}