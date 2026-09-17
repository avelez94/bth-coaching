export default async function ExecutiveCoaching() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&family=Lora:ital,wght@1,400;1,500&display=swap');

        :root {
          --ivory: #F7F4ED;
          --ivory-dark: #EDE8DC;
          --ivory-mid: #E8E2D4;
          --slate: #4C78A0;
          --slate-mid: #3A607F;
          --slate-pale: #E8EFF5;
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
           HERO
           Slate background. Page label, headline, subhead, single CTA.
           No photo here — John's photo is established on the homepage.
        ============================================================ */
        .hero {
          background: var(--slate);
          padding: 160px 72px 100px;
          position: relative;
        }
        .hero-inner { max-width: 720px; }

        .hero-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(38px, 4.5vw, 58px);
          font-weight: 400;
          line-height: 1.12;
          color: #F7F4ED;
          margin-bottom: 24px;
          letter-spacing: -0.01em;
        }
        .hero-subhead {
          font-size: 1rem;
          line-height: 1.8;
          color: rgba(247,244,237,0.72);
          margin-bottom: 40px;
          max-width: 560px;
          font-weight: 300;
        }

        /* ============================================================
           CHALLENGE SECTION
           Ivory. Full-width single column. John's copy breathes here.
        ============================================================ */
        .challenge {
          background: var(--ivory);
          padding: 100px 72px;
        }
        .challenge-inner { max-width: 720px; margin: 0 auto; }
        .section-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(26px, 3vw, 38px);
          font-weight: 400;
          line-height: 1.22;
          color: var(--text);
          margin-bottom: 36px;
          letter-spacing: -0.01em;
        }
        .body-text {
          font-size: 0.97rem;
          line-height: 1.88;
          color: var(--text-mid);
          margin-bottom: 20px;
          font-weight: 300;
        }
        .body-text:last-child { margin-bottom: 0; }

        /* ============================================================
           CLIENT STORY
           Ivory dark. Offset pull format — not a testimonial card.
           No name, no attribution, no decoration beyond the left rule.
        ============================================================ */
        .client-story {
          background: var(--ivory-dark);
          padding: 80px 72px;
        }
        .client-story-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 60px;
          align-items: start;
        }
        .story-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-weight: 500;
          padding-top: 6px;
          line-height: 1.5;
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
           WHAT WE WORK ON
           Ivory. Numbered vertical list. Asymmetric — number left,
           title + body right. No cards, no icons.
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
          margin-bottom: 64px;
          letter-spacing: -0.01em;
        }
        .work-items { display: flex; flex-direction: column; }
        .work-item {
          display: grid;
          grid-template-columns: 64px 1fr;
          gap: 32px;
          padding: 36px 0;
          border-top: 1px solid var(--rule);
          align-items: start;
        }
        .work-item:last-child { border-bottom: 1px solid var(--rule); }
        .work-num {
          font-size: 0.72rem;
          color: var(--slate-mid);
          font-weight: 500;
          letter-spacing: 0.06em;
          padding-top: 4px;
        }
        .work-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.15rem;
          font-weight: 400;
          color: var(--text);
          margin-bottom: 12px;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }
        .work-body {
          font-size: 0.9rem;
          line-height: 1.82;
          color: var(--text-muted);
          max-width: 600px;
        }

        /* ============================================================
           ORGANIZATIONAL
           Slate blue. Distinct from individual section above.
           Section label, headline, body, CTA.
        ============================================================ */
        .organizational {
          background: var(--slate);
          padding: 100px 72px;
        }
        .organizational-inner { max-width: 860px; margin: 0 auto; }
        .org-label {
          font-size: 0.72rem;
          color: rgba(247,244,237,0.45);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 28px;
          font-weight: 400;
        }
        .org-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.8vw, 36px);
          font-weight: 400;
          line-height: 1.22;
          color: #F7F4ED;
          margin-bottom: 28px;
          letter-spacing: -0.01em;
        }
        .org-body {
          font-size: 0.97rem;
          line-height: 1.88;
          color: rgba(247,244,237,0.72);
          margin-bottom: 20px;
          font-weight: 300;
        }
        .org-body:last-of-type { margin-bottom: 40px; }

        /* ============================================================
           HOW IT WORKS
           Ivory dark. Intro phrase, then body paragraphs.
           Not a step-by-step card grid.
        ============================================================ */
        .how-it-works {
          background: var(--ivory-dark);
          padding: 100px 72px;
        }
        .how-inner { max-width: 720px; margin: 0 auto; }
        .how-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.8vw, 34px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 20px;
          letter-spacing: -0.01em;
        }
        .how-intro {
          font-family: 'DM Serif Display', serif;
          font-size: 1.2rem;
          font-weight: 400;
          color: var(--text);
          margin-bottom: 28px;
          letter-spacing: -0.01em;
        }

        /* ============================================================
           ENGAGEMENT
           Ivory. Two-column: label/headline left, details right.
           Details as clean typographic list, not bullets.
        ============================================================ */
        .engagement {
          background: var(--ivory);
          padding: 100px 72px;
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
        .engagement-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 20px;
          font-weight: 500;
        }
        .engagement-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 2.5vw, 32px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 20px;
          letter-spacing: -0.01em;
          line-height: 1.25;
        }
        .engagement-intro-note {
          font-size: 0.88rem;
          line-height: 1.75;
          color: var(--text-muted);
          margin-bottom: 28px;
        }
        .engagement-details { display: flex; flex-direction: column; }
        .engagement-detail-item {
          padding: 14px 0;
          border-bottom: 1px solid var(--rule);
          font-size: 0.88rem;
          line-height: 1.65;
          color: var(--text-mid);
        }
        .engagement-detail-item:first-child { border-top: 1px solid var(--rule); }
        .investment-block {
          margin-top: 32px;
          padding-top: 28px;
          border-top: 1px solid var(--rule);
        }
        .investment-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 8px;
          font-weight: 500;
        }
        .investment-amount {
          font-family: 'DM Serif Display', serif;
          font-size: 2rem;
          font-weight: 400;
          color: var(--slate-mid);
          margin-bottom: 8px;
          line-height: 1;
        }
        .investment-note {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.65;
          margin-bottom: 28px;
        }

        /* ============================================================
           CLOSING
           Navy. John's brand closing line + CTA.
        ============================================================ */
        .closing {
          background: var(--navy);
          padding: 100px 72px;
        }
        .closing-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .closing-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(28px, 3.2vw, 42px);
          font-weight: 400;
          line-height: 1.2;
          color: #F7F4ED;
          letter-spacing: -0.01em;
        }

        /* ============================================================
           RESPONSIVE
        ============================================================ */
        @media (max-width: 1024px) {
          .hero { padding: 140px 48px 80px; }
          .challenge { padding: 80px 48px; }
          .client-story { padding: 64px 48px; }
          .client-story-inner { grid-template-columns: 1fr; gap: 24px; }
          .work-on { padding: 80px 48px; }
          .organizational { padding: 80px 48px; }
          .how-it-works { padding: 80px 48px; }
          .engagement { padding: 80px 48px; }
          .engagement-inner { grid-template-columns: 1fr; gap: 48px; }
          .closing { padding: 80px 48px; }
          .closing-inner { grid-template-columns: 1fr; gap: 40px; }
        }
        @media (max-width: 640px) {
          .hero { padding: 120px 24px 64px; }
          .challenge { padding: 64px 24px; }
          .client-story { padding: 56px 24px; }
          .story-text { padding-left: 20px; }
          .work-on { padding: 64px 24px; }
          .work-item { grid-template-columns: 48px 1fr; gap: 16px; }
          .organizational { padding: 64px 24px; }
          .how-it-works { padding: 64px 24px; }
          .engagement { padding: 64px 24px; }
          .closing { padding: 64px 24px; }
        }
      `}</style>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-headline">Coaching that follows your lead.</h1>
          <p className="hero-subhead">One-to-one coaching for executives and senior leaders — addressing the professional challenge in front of you and everything connected to it. On your terms. For your success.</p>
          <a href="/contact" className="btn btn-outline-light">Schedule a Discovery Call</a>
        </div>
      </section>

      {/* ===== CHALLENGE ===== */}
      <section className="challenge">
        <div className="challenge-inner">
          <h2 className="section-headline">What got you here may not be enough for what comes next.</h2>
          <p className="body-text">Strong performance creates opportunity. But performing well and leading well are different capabilities — and at each new level, the demands shift in ways that catch even excellent leaders off guard.</p>
          <p className="body-text">Here's what most leadership development won't say directly: the challenge in front of you is rarely the whole story.</p>
          <p className="body-text">The pattern you keep running into at work often has a counterpart somewhere else — in how you manage your energy, a relationship under strain, something you haven't fully addressed financially, or a sense that your environment isn't quite right.</p>
          <p className="body-text">Addressing only the professional surface produces partial results. This coaching goes further.</p>
        </div>
      </section>

      {/* ===== CLIENT STORY ===== */}
      <section className="client-story">
        <div className="client-story-inner">
          <div className="story-label">A coaching example</div>
          <div className="story-text">A client came to me seeking to improve his executive presence and communication. What we found underneath was a true desire to function in a new role that required collaborative communication techniques across the organization and with no clear lines of authority coupled with a desire to be more present with his growing family. What changed was a new perspective that was less outcome and more process, and awareness that leveraged his previous experience, plus a definition of what family presence meant, and a plan to achieve it.</div>
        </div>
      </section>

      {/* ===== WHAT WE WORK ON ===== */}
      <section className="work-on">
        <div className="work-on-inner">
          <h2 className="work-on-heading">What we work on.</h2>
          <div className="work-items">
            {[
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
                body: 'We identify what\'s draining your reserves — professionally and personally — and build the whole-person foundation that makes excellence sustainable rather than just periodically heroic.',
              },
              {
                num: '04',
                title: 'Integration: Leadership & Life',
                body: 'The coaching is open to your whole situation. Whatever is most present — a team challenge, a career inflection, a transition, the weight of carrying too much for too long — that\'s where we go.',
              },
            ].map((item, i) => (
              <div key={i} className="work-item">
                <div className="work-num">{item.num}</div>
                <div>
                  <div className="work-title">{item.title}</div>
                  <p className="work-body">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ORGANIZATIONAL ===== */}
      <section className="organizational">
        <div className="organizational-inner">
          <div className="org-label">For Organizations</div>
          <h2 className="org-headline">When you're investing in a leader who's struggling.</h2>
          <p className="org-body">Sometimes the right move isn't a performance plan — it's a genuine investment in someone worth investing in. Sponsors bring me in when a talented leader is struggling: over their head in a new role, worn down by something outside of work, or simply not yet who the position needs them to be.</p>
          <p className="org-body">This isn't remediation theater. The organization defines the purpose of the engagement and the outcomes to watch for — but the coaching conversation itself stays a confidential space for the leader to do real work. I've coached people through exactly this kind of moment. Real change is possible when someone gets genuine support instead of just a warning.</p>
          <a href="/contact" className="btn btn-outline-light">Schedule an Organizational Consultation</a>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="how-it-works">
        <div className="how-inner">
          <h2 className="how-heading">How it works.</h2>
          <p className="how-intro">Coaching that follows your lead.</p>
          <p className="body-text">You bring what's most present in the moment — the decision, the thing you can't stop thinking about — and we work through it together. We explore your values, challenge assumptions, and open perspectives you may not have considered from inside the situation. This is results- and outcomes-focused work. You deserve a return on your time and investment as you identify and achieve your greatest goals.</p>
          <p className="body-text">And because life doesn't separate neatly into professional and personal, we don't either. We work with all of it — on your terms, for your success.</p>
          <p className="body-text">Insight without action is just an interesting conversation — we go beyond that. Every session produces something concrete: a commitment you define, a step you choose, a thing you finally decide to do. You keep pushing forward.</p>
        </div>
      </section>

      {/* ===== ENGAGEMENT ===== */}
      <section className="engagement">
        <div className="engagement-inner">
          <div>
            <div className="engagement-label">The engagement</div>
            <h2 className="engagement-headline">Six Months. Twelve Sessions. Your Agenda.</h2>
            <p className="engagement-intro-note">15 minutes to understand your situation and confirm mutual fit — before any commitment.</p>
            <a href="/contact" className="btn btn-navy">Schedule Your Free Intro Call</a>
          </div>
          <div>
            <div className="engagement-details">
              {[
                '12 one-hour sessions over 24 weeks (bi-weekly)',
                '8 Pillars whole-person assessment in opening sessions',
                'Values and goals exploration',
                'Session-by-session commitments — defined by you',
                'Between-session accountability via email or text',
                'Final session: integration, reflection, and forward planning',
              ].map((item, i) => (
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

      {/* ===== CLOSING ===== */}
      <section className="closing">
        <div className="closing-inner">
          <h2 className="closing-headline">Together we get Beyond your Horizon.</h2>
          <div>
            <a href="/contact" className="btn btn-outline-light">Schedule a Discovery Call</a>
          </div>
        </div>
      </section>
    </>
  )
}