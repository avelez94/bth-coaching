'use client'

import { useState, useRef, useCallback } from 'react'

const pillars = [
  {
    num: '01',
    name: 'Values, Ethical & Moral Compass',
    subtitle: 'Character, Integrity & Values-Aligned Decision-Making',
    body: 'A leader without a clearly articulated ethical framework will be caught flat-footed by decisions that require one. Under pressure, in ambiguous situations, with competing demands — character is what remains when everything else falls away.\n\nThis pillar addresses character, not compliance. Not what the rules require, but who you are when the rules don\'t cover it.',
    integration: 'Values don\'t switch off outside the office. Alignment between stated values and actual behavior — in all parts of life — is a source of resilience. Misalignment in any domain is a leak.',
  },
  {
    num: '02',
    name: 'Professional Excellence',
    subtitle: 'Craft, Credibility & Continued Development',
    body: 'At the executive level, credibility is currency — and it requires active stewardship. Continued, deliberate investment in the knowledge, skills, and capabilities specific to your domain and your leadership role.\n\nIt also means the willingness to recognize when current approaches are no longer sufficient — and to act on that recognition rather than defaulting to what has always worked.',
    integration: 'The leader who stays intellectually curious across broad domains — not just their professional specialty — brings more perspective and creativity to every challenge.',
  },
  {
    num: '03',
    name: 'Physical Health & Readiness',
    subtitle: 'Energy, Endurance & Cognitive Capacity',
    body: 'Physical condition is the biological substrate of professional performance. Research on sleep deprivation alone demonstrates measurable impairment of the prefrontal cortex at levels most executives routinely accept as normal. Chronic depletion impairs exactly the capabilities leadership demands most.\n\nThis pillar is not about fitness culture. It is about the infrastructure that makes sustained, high-quality leadership possible.',
    integration: 'Sleep, exercise, and recovery habits live in the personal domain and show up directly in professional performance. They are not separate.',
  },
  {
    num: '04',
    name: 'Financial Stewardship',
    subtitle: 'Stability & Freedom from Cognitive Load',
    body: 'Financial stress impairs executive function. A 2013 study in Science demonstrated that financial worry occupies working memory in a way that produces cognitive performance drops equivalent to losing significant sleep — not because the person is less capable, but because a portion of their cognitive bandwidth is already consumed.\n\nA senior leader carrying unresolved financial stress carries it into every organizational decision they make, often without knowing it.',
    integration: 'Financial stewardship lives in the personal domain but affects professional performance directly — one of the clearest examples of why the professional/personal distinction is a useful fiction rather than a real boundary.',
  },
  {
    num: '05',
    name: 'Cognitive Fortitude',
    subtitle: 'Clarity, Resilience & Sound Judgment Under Pressure',
    body: 'The capacity to think clearly and make sound judgments under sustained pressure is not a fixed trait — it is a developable capability. The leaders who perform well under pressure have built specific cognitive habits and frameworks for managing their own thinking.\n\nThis pillar addresses those habits: how you interpret setbacks, manage uncertainty, and maintain strategic perspective when the situation is loud and demanding.',
    integration: 'Cognitive fortitude is built across all of life\'s pressures. A leader who manages personal difficulty with clarity brings those same capacities to the office.',
  },
  {
    num: '06',
    name: 'Emotional Equanimity',
    subtitle: 'Regulation, Presence & Organizational Culture Impact',
    body: 'How a leader shows up emotionally is the primary driver of organizational culture. Not suppressing emotion — intelligently managing emotional experience. The capacity to feel difficulty without being governed by it.\n\nResearch on emotional contagion demonstrates that a leader\'s emotional state is transmitted through a team — affecting cognitive performance, risk tolerance, and creativity of the people around them.',
    integration: 'Emotional regulation is shaped by everything in a leader\'s life. A leader carrying unacknowledged difficulty at home brings that state into every meeting. Coaching that ignores this misses the real source.',
  },
  {
    num: '07',
    name: 'Relational Harmony',
    subtitle: 'Trust, Connection & the Quality of Key Relationships',
    body: 'The quality of a leader\'s most important relationships — at home, at work, and in their broader network — determines the resources available in difficult moments. Relational friction is a sustained drain that most leaders underestimate because it becomes normalized.\n\nResearch consistently shows that leaders who recover most effectively from setbacks have strong relational foundations across multiple life domains.',
    integration: 'This pillar explicitly covers relationships at work and at home. The quality of a leader\'s personal relationships shapes their emotional availability for everything else — examining only professional relationships misses half the picture.',
  },
  {
    num: '08',
    name: 'Environmental Harmony',
    subtitle: 'Organizational Culture, Values Alignment & Contextual Fit',
    body: 'The degree to which a leader\'s organizational environment — its culture, values, and operating norms — supports rather than erodes their capacity to lead and decide well.\n\nNot every leadership challenge is a leader problem. Some are context problems. Recognizing the difference — clearly, without defensiveness or denial — is itself a leadership capability.',
    integration: 'Environmental Harmony encompasses the non-work environment as well — the home context, the community, the overall shape of a leader\'s life and whether it sustains or depletes them. Both dimensions matter and both are in scope.',
  },
]

export default function TheFramework() {
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)
  const [openMobile, setOpenMobile] = useState<number | null>(0)
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])

  const selectPillar = useCallback((i: number) => {
    if (i === active) return
    setFading(true)
    setTimeout(() => {
      setActive(i)
      setFading(false)
    }, 200)
  }, [active])

  const handleKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.min(i + 1, pillars.length - 1)
      selectPillar(next)
      btnRefs.current[next]?.focus()
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = Math.max(i - 1, 0)
      selectPillar(prev)
      btnRefs.current[prev]?.focus()
    }
    if (e.key === 'Home') {
      e.preventDefault()
      selectPillar(0)
      btnRefs.current[0]?.focus()
    }
    if (e.key === 'End') {
      e.preventDefault()
      selectPillar(pillars.length - 1)
      btnRefs.current[pillars.length - 1]?.focus()
    }
  }

  const current = pillars[active]

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

        .btn-primary { display: inline-flex; align-items: center; gap: 9px; padding: 13px 28px; font-size: 0.72rem; letter-spacing: 0.07em; text-transform: uppercase; text-decoration: none; transition: all 0.22s ease; font-weight: 500; cursor: pointer; border: none; font-family: 'Inter', sans-serif; white-space: nowrap; background: var(--navy); color: var(--ivory); }
        .btn-primary:hover { background: var(--slate-mid); }

        /* ============================================================
           HERO
           Ivory. Headline opens a question, not a promise.
        ============================================================ */
        .hero {
          background: var(--ivory);
          padding: 160px 72px 100px;
        }
        /* Desktop: two-block asymmetric composition */
        .hero-composition {
          max-width: 1320px;
          position: relative;
        }
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
          margin-top: 10px;
          margin-left: auto;
          padding-right: 0;
        }

        /* ============================================================
           WHAT FRAMEWORKS MISS
           Ivory dark. Left: body argument. Right: pull quote.
           Asymmetric split — quote earns its visual weight.
        ============================================================ */
        .miss {
          background: var(--ivory-dark);
          padding: 100px 72px;
        }
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
        .miss-quote-col {
          padding-top: 8px;
          position: sticky;
          top: 100px;
        }
        .miss-quote {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(18px, 1.8vw, 22px);
          font-weight: 400;
          line-height: 1.55;
          color: var(--slate-mid);
          margin-bottom: 16px;
          font-style: italic;
        }
        .miss-quote-attr {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 400;
        }

        /* ============================================================
           SCIENCE FOUNDATIONS
           Slate pale. 2x2 typographic grid.
           Four independent but convergent bodies of evidence.
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
        .science-cell:nth-child(2) {
          border-top: 1px solid rgba(76,120,160,0.15);
        }
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
           RIVER PHOTO BREAK
           Between science and pillars. Editorial pause.
           Constrained height, no text overlay.
        ============================================================ */
        .river-break {
          line-height: 0;
          overflow: hidden;
        }
        .river-img {
          width: 100%;
          height: 400px;
          object-fit: cover;
          object-position: center 45%;
          display: block;
        }

        /* ============================================================
           8 PILLARS — full interactive Framework experience
           Desktop: continuous horizontal system.
           Active pillar dominant; others quieter but fully present.
           A single reading area below the index holds the full pillar
           content including the integration note.
           Connector line drops from active pillar to reading area.
           Mobile: accordion.
        ============================================================ */
        .pillars {
          background: var(--ivory);
          padding: 100px 72px;
        }
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


        /* Desktop pillar system — hidden on mobile */
        .pillars-desktop { display: block; }

        /* The continuous horizontal index */
        .pillar-index {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          border-top: 1px solid var(--rule);
          border-left: 1px solid var(--rule);
          position: relative;
          role: tablist;
        }
        .pillar-tab {
          border-right: 1px solid var(--rule);
          border-bottom: none;
          padding: 20px 14px 16px;
          cursor: pointer;
          background: none;
          text-align: left;
          transition: background 0.18s;
          position: relative;
          outline: none;
        }
        .pillar-tab:focus-visible {
          outline: 2px solid var(--slate);
          outline-offset: -2px;
          z-index: 2;
        }
        .pillar-tab:hover:not(.pillar-tab--active) {
          background: rgba(237,232,220,0.5);
        }
        .pillar-tab--active {
          background: var(--ivory-dark);
        }
        .pillar-tab-num {
          font-size: 0.62rem;
          color: var(--text-muted);
          font-weight: 500;
          letter-spacing: 0.04em;
          margin-bottom: 8px;
          transition: color 0.18s;
          display: block;
        }
        .pillar-tab--active .pillar-tab-num { color: var(--slate-mid); }
        .pillar-tab-name {
          font-size: 0.78rem;
          line-height: 1.35;
          color: var(--text-muted);
          font-weight: 300;
          transition: color 0.18s;
          display: block;
        }
        .pillar-tab--active .pillar-tab-name { color: var(--text); font-weight: 400; }
        .pillar-tab:hover:not(.pillar-tab--active) .pillar-tab-name { color: var(--text-mid); }

        /* Connector: thin line from active tab bottom to reading area */
        .pillar-connector-row {
          position: relative;
          height: 32px;
          border-left: 1px solid var(--rule);
          border-right: 1px solid var(--rule);
        }
        .pillar-connector-line {
          position: absolute;
          bottom: 0;
          width: 1px;
          height: 100%;
          background: var(--slate);
          opacity: 0.3;
          transition: left 0.22s ease;
        }

        /* Reading area */
        .pillar-panel {
          border: 1px solid var(--rule);
          border-top: none;
          padding: 48px 52px;
          min-height: 360px;
        }
        .panel-content {
          transition: opacity 0.2s ease;
        }
        .panel-content.fading { opacity: 0; }
        .panel-content.visible { opacity: 1; }
        .panel-num {
          font-size: 0.68rem;
          color: var(--text-muted);
          letter-spacing: 0.06em;
          margin-bottom: 12px;
          font-weight: 500;
        }
        .panel-name {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.6vw, 34px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 8px;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }
        .panel-subtitle {
          font-size: 0.82rem;
          color: var(--slate-mid);
          margin-bottom: 28px;
          font-weight: 400;
        }
        .panel-body-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
        }
        .panel-body {
          font-size: 0.93rem;
          line-height: 1.85;
          color: var(--text-mid);
          font-weight: 300;
        }
        .panel-body p + p { margin-top: 16px; }
        .panel-integration {
          padding-left: 20px;
          border-left: 1px solid var(--slate-light);
        }
        .panel-integration-label {
          font-size: 0.78rem;
          color: var(--slate-mid);
          font-weight: 500;
          margin-bottom: 8px;
        }
        .panel-integration-body {
          font-size: 0.88rem;
          line-height: 1.78;
          color: var(--text-mid);
          font-weight: 300;
        }

        /* Mobile accordion */
        .pillars-mobile { display: none; }
        .mob-pillar { border-bottom: 1px solid var(--rule); }
        .mob-pillar:first-child { border-top: 1px solid var(--rule); }
        .mob-trigger {
          width: 100%;
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 0;
          cursor: pointer;
          text-align: left;
        }
        .mob-trigger:focus-visible { outline: 2px solid var(--slate); outline-offset: 2px; }
        .mob-num {
          font-size: 0.68rem;
          color: var(--text-muted);
          font-weight: 500;
          min-width: 24px;
          flex-shrink: 0;
        }
        .mob-name {
          font-family: 'DM Serif Display', serif;
          font-size: 1rem;
          color: var(--text);
          flex: 1;
          line-height: 1.3;
        }
        .mob-chevron {
          font-size: 0.72rem;
          color: var(--text-muted);
          transition: transform 0.2s;
          flex-shrink: 0;
        }
        .mob-chevron.open { transform: rotate(180deg); }
        .mob-body {
          padding: 0 0 24px 38px;
          display: none;
        }
        .mob-body.open { display: block; }
        .mob-subtitle {
          font-size: 0.8rem;
          color: var(--slate-mid);
          margin-bottom: 14px;
          font-weight: 400;
        }
        .mob-text {
          font-size: 0.9rem;
          line-height: 1.82;
          color: var(--text-mid);
          font-weight: 300;
          margin-bottom: 16px;
        }
        .mob-integration {
          padding-left: 16px;
          border-left: 1px solid var(--slate-light);
          margin-top: 4px;
        }
        .mob-integration-label {
          font-size: 0.78rem;
          color: var(--slate-mid);
          font-weight: 500;
          margin-bottom: 6px;
        }
        .mob-integration-body {
          font-size: 0.85rem;
          line-height: 1.75;
          color: var(--text-mid);
          font-weight: 300;
        }

        .pillars-framework-link {
          margin-top: 40px;
          padding-top: 32px;
          border-top: 1px solid var(--rule);
        }

        /* ============================================================
           HOW PILLARS WORK IN COACHING
           Ivory. Single column, narrow measure.
           Conversational close — John directly to the visitor.
        ============================================================ */
        .coaching {
          background: var(--ivory-dark);
          padding: 100px 72px;
          border-top: 1px solid var(--rule);
        }
        .coaching-inner { max-width: 680px; margin: 0 auto; }
        .coaching-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 2.4vw, 30px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 32px;
          letter-spacing: -0.01em;
        }
        .coaching-body {
          font-size: 0.97rem;
          line-height: 1.88;
          color: var(--text-mid);
          margin-bottom: 20px;
          font-weight: 300;
        }
        .coaching-body:last-child { margin-bottom: 0; }

        /* ============================================================
           CLOSING CTA
           Ivory. John's v5 statement + button.
        ============================================================ */
        .cta-section {
          background: var(--ivory);
          padding: 100px 72px;
          border-top: 1px solid var(--rule);
        }
        .cta-inner {
          max-width: 640px;
          margin: 0 auto;
          text-align: center;
        }
        .cta-statement {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(20px, 2.2vw, 26px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 32px;
          letter-spacing: -0.01em;
          line-height: 1.4;
        }

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
          .panel-body-layout { grid-template-columns: 1fr; gap: 28px; }
          .coaching { padding: 80px 48px; }
          .cta-section { padding: 80px 48px; }
        }

        @media (max-width: 768px) {
          .pillars-desktop { display: none; }
          .pillars-mobile { display: block; }
        }

        @media (max-width: 640px) {
          .hero { padding: 120px 24px 64px; }
          .hero-subhead { margin-left: 0; max-width: 100%; margin-top: 24px; }
          .miss { padding: 64px 24px; }
          .science { padding: 64px 24px; }
          .river-img { height: 260px; }
          .pillars { padding: 64px 24px; }
          .coaching { padding: 64px 24px; }
          .cta-section { padding: 64px 24px; }
        }
      `}</style>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-composition">
          <h1 className="hero-headline">The immediate challenge is rarely the whole story.</h1>
          <p className="hero-subhead">The 8 Pillars of Mission-Ready Leadership is a whole-person framework grounded in peer-reviewed research on human flourishing and informed by neuroscience. It is the assessment and development foundation for all coaching and programs at Beyond the Horizon — because the whole person shows up everywhere, and that's who we develop.</p>
        </div>
      </section>

      {/* ===== WHAT FRAMEWORKS MISS ===== */}
      <section className="miss">
        <div className="miss-inner">
          <div>
            <h2 className="miss-headline">What most leadership frameworks miss.</h2>
            <p className="miss-body">Most frameworks ask: what do effective leaders do? What behaviors do they exhibit, what competencies do they need?</p>
            <p className="miss-body">The Mission-Ready Leadership framework asks a prior question: what is the condition of the leader doing all of those things?</p>
            <p className="miss-body">A leader managing chronic financial stress makes different decisions than the same leader who is financially clear. A leader carrying relational friction at home brings less emotional bandwidth to every meeting — not because they lack professionalism, but because we are not modular. What we carry in one part of our life shows up in all the others.</p>
            <p className="miss-body">When we address the whole person — every dimension of who they are and what they're carrying — something unlocks. Potential they didn't know they had. Clarity they couldn't find alone. An actionable, repeatable path forward that lasts.</p>
          </div>
          <div className="miss-quote-col">
            <p className="miss-quote">"We don't use the phrase 'work-life balance' because it implies a trade-off — time on one side costs the other. The research, and the experience of coaching, suggests the opposite. Strength built in any domain of a person's life reinforces the others. The goal is not balance. It is conscious, values-aligned integration."</p>
            <div className="miss-quote-attr">John McCracken</div>
          </div>
        </div>
      </section>

      {/* ===== SCIENCE FOUNDATIONS ===== */}
      <section className="science">
        <div className="science-inner">
          <h2 className="science-heading">Where the framework comes from.</h2>
          <div className="science-grid">
            {[
              {
                name: 'Positive Psychology — Seligman & PERMA',
                body: "Dr. Martin Seligman's peer-reviewed PERMA framework established that human flourishing operates across multiple interdependent life domains — not just the professional one. This formed the scientific foundation of the U.S. Army's Comprehensive Soldier and Family Fitness program, which demonstrated through large-scale implementation that whole-person resilience training improves performance and reduces mental health diagnoses.",
              },
              {
                name: 'Total Leadership — Friedman, Wharton School',
                body: 'Research demonstrated that leaders who pursue meaningful engagement across work, home, community, and self simultaneously outperform those who sacrifice one domain for another. Skills, energy, and perspective developed in any life domain transfer to and strengthen the others.',
              },
              {
                name: 'Neuroscience of Stress and Executive Function',
                body: 'Chronic stress across any domain measurably impairs the prefrontal cortex — the seat of judgment, strategic thinking, and emotional regulation. Financial stress alone produces cognitive performance drops equivalent to significant sleep deprivation (Mani et al., Science, 2013). Physical depletion, relational friction, and environmental misalignment produce analogous effects.',
              },
              {
                name: 'Work-Life Integration Research — Kossek et al.',
                body: 'Research on work-life boundary management demonstrates that flexible integration strategies produce better sustained performance than rigid separation. The goal is not balance. It is conscious, values-aligned management of how life\'s domains interact and reinforce each other.',
              },
            ].map((s, i) => (
              <div key={i} className="science-cell">
                <div className="science-cell-name">{s.name}</div>
                <p className="science-cell-body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RIVER PHOTO BREAK ===== */}
      <div className="river-break">
        <img
          src="/images/bth-river.jpg"
          alt=""
          aria-hidden="true"
          className="river-img"
        />
      </div>

      {/* ===== 8 PILLARS ===== */}
      <section className="pillars">
        <div className="pillars-inner">
          <h2 className="pillars-intro-head">The 8 Pillars — what each means and why it matters.</h2>

          {/* Desktop: horizontal index + reading area */}
          <div className="pillars-desktop">
            <div
              className="pillar-index"
              role="tablist"
              aria-label="The 8 Pillars of Mission-Ready Leadership"
            >
              {pillars.map((p, i) => (
                <button
                  key={i}
                  ref={el => { btnRefs.current[i] = el }}
                  role="tab"
                  aria-selected={active === i}
                  aria-controls="pillar-reading-area"
                  id={`pillar-tab-${i}`}
                  className={`pillar-tab${active === i ? ' pillar-tab--active' : ''}`}
                  onClick={() => selectPillar(i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  tabIndex={active === i ? 0 : -1}
                >
                  <span className="pillar-tab-num">{p.num}</span>
                  <span className="pillar-tab-name">{p.name}</span>
                </button>
              ))}
            </div>

            {/* Connector line from active tab to reading area */}
            <div className="pillar-connector-row" aria-hidden="true">
              <div
                className="pillar-connector-line"
                style={{
                  left: `calc(${active} * (100% / 8) + (100% / 16))`,
                }}
              />
            </div>

            {/* Reading area */}
            <div
              id="pillar-reading-area"
              role="tabpanel"
              aria-labelledby={`pillar-tab-${active}`}
              className="pillar-panel"
            >
              <div className={`panel-content ${fading ? 'fading' : 'visible'}`}>
                <div className="panel-num">{current.num} of 08</div>
                <div className="panel-name">{current.name}</div>
                <div className="panel-subtitle">{current.subtitle}</div>
                <div className="panel-body-layout">
                  <div className="panel-body">
                    {current.body.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                  <div className="panel-integration">
                    <div className="panel-integration-label">Integration</div>
                    <p className="panel-integration-body">{current.integration}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: accordion */}
          <div className="pillars-mobile">
            {pillars.map((p, i) => (
              <div key={i} className="mob-pillar">
                <button
                  className="mob-trigger"
                  onClick={() => setOpenMobile(openMobile === i ? null : i)}
                  aria-expanded={openMobile === i}
                >
                  <span className="mob-num">{p.num}</span>
                  <span className="mob-name">{p.name}</span>
                  <span className={`mob-chevron${openMobile === i ? ' open' : ''}`}>▾</span>
                </button>
                <div className={`mob-body${openMobile === i ? ' open' : ''}`}>
                  <div className="mob-subtitle">{p.subtitle}</div>
                  {p.body.split('\n\n').map((para, j) => (
                    <p key={j} className="mob-text">{para}</p>
                  ))}
                  <div className="mob-integration">
                    <div className="mob-integration-label">Integration</div>
                    <p className="mob-integration-body">{p.integration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW PILLARS WORK IN COACHING ===== */}
      <section className="coaching">
        <div className="coaching-inner">
          <h2 className="coaching-headline">How the Pillars work in coaching.</h2>
          <p className="coaching-body">The 8 Pillars are an assessment framework — a structured, honest picture of a leader's current condition across every dimension that affects their performance.</p>
          <p className="coaching-body">In every coaching engagement, the process works like this:</p>
          <p className="coaching-body">For each Pillar, you define what success looks like in that area — your definition, not an imposed standard.</p>
          <p className="coaching-body">You honestly assess where you currently stand.</p>
          <p className="coaching-body">The gap between where you are and where you want to be becomes the coaching agenda.</p>
          <p className="coaching-body">Together, we identify not only what needs to grow — but what you need to say no to in order to create the space for that growth.</p>
          <p className="coaching-body">This last step is consistently among the most valuable. Most people aren't underperforming because they lack capability. They're underperforming because they haven't been honest about what their current commitments are actually costing them.</p>
        </div>
      </section>

      {/* ===== CLOSING CTA ===== */}
      <section className="cta-section">
        <div className="cta-inner">
          <p className="cta-statement">The 8 Pillars are the foundation of every coaching engagement and organizational program.</p>
          <a href="/contact" className="btn-primary">Schedule a Conversation to Learn More</a>
        </div>
      </section>
    </>
  )
}