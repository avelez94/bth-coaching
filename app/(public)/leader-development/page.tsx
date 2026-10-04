'use client'

import { useState } from 'react'

const pillars = [
  { num: '01', name: 'Values, Ethical & Moral Compass', address: 'Character, integrity & values-aligned decisions', desc: 'A leader without a clearly articulated ethical framework will be caught flat-footed by decisions that require one. Under pressure, in ambiguous situations, with competing demands — character is what remains when everything else falls away. This pillar addresses character, not compliance. Not what the rules require, but who you are when the rules don\'t cover it.' },
  { num: '02', name: 'Professional Excellence', address: 'Craft, credibility & continued development', desc: 'At the executive level, credibility is currency — and it requires active stewardship. Continued, deliberate investment in the knowledge, skills, and capabilities specific to your domain and your leadership role. It also means the willingness to recognize when current approaches are no longer sufficient — and to act on that recognition rather than defaulting to what has always worked.' },
  { num: '03', name: 'Physical Health & Readiness', address: 'Energy, endurance & cognitive capacity', desc: 'Physical condition is the biological substrate of professional performance. Research on sleep deprivation alone demonstrates measurable impairment of the prefrontal cortex at levels most executives routinely accept as normal. Chronic depletion impairs exactly the capabilities leadership demands most. This pillar is not about fitness culture. It is about the infrastructure that makes sustained, high-quality leadership possible.' },
  { num: '04', name: 'Financial Stewardship', address: 'Stability & freedom from cognitive load', desc: 'Financial stress impairs executive function. A 2013 study in Science demonstrated that financial worry occupies working memory in a way that produces cognitive performance drops equivalent to losing significant sleep. A senior leader carrying unresolved financial stress carries it into every organizational decision they make, often without knowing it.' },
  { num: '05', name: 'Cognitive Fortitude', address: 'Clarity & sound judgment under pressure', desc: 'The capacity to think clearly and make sound judgments under sustained pressure is not a fixed trait — it is a developable capability. The leaders who perform well under pressure have built specific cognitive habits and frameworks for managing their own thinking. This pillar addresses those habits: how you interpret setbacks, manage uncertainty, and maintain strategic perspective when the situation is loud and demanding.' },
  { num: '06', name: 'Emotional Equanimity', address: 'Regulation, presence & culture impact', desc: 'How a leader shows up emotionally is the primary driver of organizational culture. Not suppressing emotion — intelligently managing emotional experience. The capacity to feel difficulty without being governed by it. Research on emotional contagion demonstrates that a leader\'s emotional state is transmitted through a team — affecting cognitive performance, risk tolerance, and creativity of the people around them.' },
  { num: '07', name: 'Relational Harmony', address: 'Trust & connection at work and at home', desc: 'The quality of a leader\'s most important relationships — at home, at work, and in their broader network — determines the resources available in difficult moments. Relational friction is a sustained drain that most leaders underestimate because it becomes normalized. Research consistently shows that leaders who recover most effectively from setbacks have strong relational foundations across multiple life domains.' },
  { num: '08', name: 'Environmental Harmony', address: 'Culture, values alignment & contextual fit', desc: 'The degree to which a leader\'s organizational environment — its culture, values, and operating norms — supports rather than erodes their capacity to lead and decide well. Not every leadership challenge is a leader problem. Some are context problems. Recognizing the difference — clearly, without defensiveness or denial — is itself a leadership capability.' },
]

const stages = [
  { num: '01', label: 'Intake & Orientation', body: 'A self-administered intake survey, followed by a 1 to 2 day intro session (in-person or virtual): relationship-building, expectations, and a first look at where you stand across all 8 Pillars.' },
  { num: '02', label: 'One Pillar per Month', body: 'Two sessions each month. The first is structured around that month\'s Pillar. The second is a fully client-led coaching session — your agenda, your pace.' },
  { num: '03', label: 'Between-Session Work', body: 'Commitments you define, a step you choose, a thing you finally decide to do. Insight without action is just an interesting conversation.' },
  { num: '04', label: 'Close-Out', body: 'Lessons learned across all 8 Pillars, a plan for what you sustain on your own, and an introduction to ongoing support if it\'s a fit.' },
]

const outcomes = [
  { name: 'Clarity about what you actually want', desc: 'Not the role you\'re performing — the life you\'re building. Most leaders haven\'t stopped long enough to name it.' },
  { name: 'Better decisions under pressure', desc: 'Because the things that degrade judgment — financial stress, relational friction, physical depletion — are in scope and addressed.' },
  { name: 'A sustainable way to lead', desc: 'Not periodic heroics. A foundation that holds, whether you\'re at your best or carrying something heavy.' },
  { name: 'Results your organization can see', desc: 'Stronger presence, clearer communication, better team leverage. The whole-person work produces visible professional change.' },
]

export default function LeaderDevelopment() {
  const [activePillar, setActivePillar] = useState(0)
  const [openPillar, setOpenPillar] = useState<number | null>(null)

  function handlePillarKey(e: React.KeyboardEvent, i: number) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActivePillar(Math.min(i + 1, pillars.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActivePillar(Math.max(i - 1, 0)) }
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
          --rule-light: rgba(247,244,237,0.12);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--ivory); color: var(--text); font-family: 'Inter', sans-serif; font-weight: 300; overflow-x: hidden; -webkit-font-smoothing: antialiased; }

        .btn { display: inline-flex; align-items: center; gap: 9px; padding: 13px 28px; font-size: 0.72rem; letter-spacing: 0.07em; text-transform: uppercase; text-decoration: none; transition: all 0.22s ease; font-weight: 500; cursor: pointer; border: none; font-family: 'Inter', sans-serif; white-space: nowrap; }
        .btn-navy { background: var(--navy); color: var(--ivory); }
        .btn-navy:hover { background: var(--slate-mid); }
        .btn-outline-light { background: transparent; color: var(--ivory); border: 1px solid rgba(247,244,237,0.35); }
        .btn-outline-light:hover { background: rgba(247,244,237,0.1); }
        .btn-outline { background: transparent; color: var(--text); border: 1px solid rgba(28,43,58,0.28); }
        .btn-outline:hover { background: var(--navy); color: var(--ivory); border-color: var(--navy); }

        /* ============================================================
           1. HERO
           Slate. Context label top. Wide headline. Subhead offset right.
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
           Ivory dark. Left-anchored. Wider reading measure.
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
        .familiar-thesis {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(18px, 1.8vw, 22px);
          font-weight: 400;
          line-height: 1.55;
          color: var(--text);
          margin-top: 32px;
          letter-spacing: -0.01em;
          max-width: 640px;
        }

        /* ============================================================
           3. THE 8 PILLARS PROGRAM
           Ivory. Index + panel interaction, same as mission-ready page.
        ============================================================ */
        .pillars { background: var(--ivory); padding: 100px 72px; border-top: 1px solid var(--rule); }
        .pillars-inner { max-width: 1100px; margin: 0 auto; }
        .pillars-intro { max-width: 860px; margin-bottom: 64px; }
        .pillars-intro-head {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.8vw, 34px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 16px;
          letter-spacing: -0.01em;
        }
        .pillars-subhead {
          font-size: 0.93rem;
          line-height: 1.78;
          color: var(--text-muted);
          font-weight: 300;
        }

        .pillars-layout { display: grid; grid-template-columns: 280px 1fr; gap: 0; border-top: 1px solid var(--rule); }
        .pillars-index { border-right: 1px solid var(--rule); }
        .pillar-index-item {
          display: flex; align-items: baseline; gap: 14px;
          padding: 16px 24px 16px 0;
          border-bottom: 1px solid var(--rule);
          cursor: pointer; transition: background 0.15s;
          background: none; outline: none;
          width: 100%; text-align: left;
        }
        .pillar-index-item:focus-visible { outline: 2px solid var(--slate); outline-offset: -2px; }
        .pillar-index-item.active { background: var(--ivory-dark); position: relative; }
        .pillar-index-item:hover:not(.active) { background: rgba(237,232,220,0.5); }
        .pillar-idx-num { font-size: 0.68rem; color: var(--text-muted); font-weight: 500; letter-spacing: 0.04em; min-width: 22px; flex-shrink: 0; transition: color 0.15s; }
        .pillar-index-item.active .pillar-idx-num { color: var(--slate-mid); }
        .pillar-idx-name { font-family: 'DM Serif Display', serif; font-size: 0.97rem; font-weight: 400; color: var(--text-muted); line-height: 1.35; transition: color 0.15s; }
        .pillar-index-item.active .pillar-idx-name,
        .pillar-index-item:hover .pillar-idx-name { color: var(--text); }
        .pillar-index-item.active::after {
          content: ''; position: absolute; right: 0; top: 20%; bottom: 20%; width: 2px; background: var(--slate);
        }
        .pillars-panel { padding: 40px 0 40px 56px; min-height: 320px; display: flex; flex-direction: column; justify-content: flex-start; }
        .panel-num { font-size: 0.68rem; color: var(--text-muted); letter-spacing: 0.06em; margin-bottom: 16px; font-weight: 500; }
        .panel-name { font-family: 'DM Serif Display', serif; font-size: clamp(22px, 2.4vw, 30px); font-weight: 400; color: var(--text); margin-bottom: 10px; letter-spacing: -0.01em; line-height: 1.25; }
        .panel-address { font-size: 0.82rem; color: var(--slate-mid); margin-bottom: 24px; font-weight: 400; }
        .panel-desc { font-size: 0.93rem; line-height: 1.85; color: var(--text-mid); max-width: 520px; font-weight: 300; }

        .pillars-accordion { display: none; }
        .accordion-item { border-bottom: 1px solid var(--rule); }
        .accordion-item:first-child { border-top: 1px solid var(--rule); }
        .accordion-trigger { width: 100%; background: none; border: none; display: flex; align-items: baseline; gap: 14px; padding: 18px 0; cursor: pointer; text-align: left; }
        .accordion-trigger:focus-visible { outline: 2px solid var(--slate); outline-offset: 2px; }
        .accordion-num { font-size: 0.68rem; color: var(--text-muted); font-weight: 500; min-width: 22px; flex-shrink: 0; }
        .accordion-name { font-family: 'DM Serif Display', serif; font-size: 1rem; color: var(--text); line-height: 1.3; flex: 1; }
        .accordion-chevron { font-size: 0.75rem; color: var(--text-muted); transition: transform 0.2s; flex-shrink: 0; }
        .accordion-chevron.open { transform: rotate(180deg); }
        .accordion-body { padding: 0 0 20px 36px; display: none; }
        .accordion-body.open { display: block; }
        .accordion-address { font-size: 0.8rem; color: var(--slate-mid); margin-bottom: 12px; }
        .accordion-desc { font-size: 0.9rem; line-height: 1.82; color: var(--text-mid); font-weight: 300; }

        .pillars-framework-link { margin-top: 48px; padding-top: 32px; border-top: 1px solid var(--rule); }
        .framework-link { font-size: 0.82rem; color: var(--slate-mid); text-decoration: none; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; transition: gap 0.2s; }
        .framework-link:hover { gap: 14px; }

        /* ============================================================
           4. HOW IT WORKS — four-stage horizontal timeline
           Ivory dark. Desktop: four equal columns with step numbers
           and vertical connector line at top. Mobile: stacked list.
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

        /* Desktop timeline */
        .how-timeline { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; position: relative; }
        /* Continuous rule across the top of all four stages */
        .how-timeline::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 0;
          right: 0;
          height: 1px;
          background: var(--rule);
        }
        .how-stage {
          padding: 0 32px 0 0;
          position: relative;
        }
        .how-stage:last-child { padding-right: 0; }
        /* Step dot sitting on the rule */
        .how-stage-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--slate-mid);
          position: relative;
          z-index: 1;
          margin-bottom: 28px;
          flex-shrink: 0;
        }
        .how-stage-num {
          font-size: 0.65rem;
          color: var(--slate-mid);
          letter-spacing: 0.06em;
          font-weight: 500;
          margin-bottom: 10px;
          display: block;
        }
        .how-stage-label {
          font-family: 'DM Serif Display', serif;
          font-size: 1.05rem;
          font-weight: 400;
          color: var(--text);
          margin-bottom: 14px;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }
        .how-stage-body {
          font-size: 0.88rem;
          line-height: 1.78;
          color: var(--text-muted);
          font-weight: 300;
        }

        /* Mobile: stacked list with left border */
        .how-list-mobile { display: none; flex-direction: column; }
        .how-list-item {
          padding: 28px 0 28px 24px;
          border-top: 1px solid var(--rule);
          border-left: 2px solid var(--rule);
        }
        .how-list-item:last-child { border-bottom: 1px solid var(--rule); }
        .how-list-num { font-size: 0.65rem; color: var(--slate-mid); letter-spacing: 0.06em; font-weight: 500; margin-bottom: 6px; display: block; }
        .how-list-label { font-family: 'DM Serif Display', serif; font-size: 1rem; font-weight: 400; color: var(--text); margin-bottom: 10px; line-height: 1.3; }
        .how-list-body { font-size: 0.9rem; line-height: 1.78; color: var(--text-muted); font-weight: 300; }

        /* ============================================================
           5. WHAT'S POSSIBLE
           Ivory. Outcome items in a list with rule separators.
           Names prominent in DM Serif Display.
        ============================================================ */
        .outcomes { background: var(--ivory); padding: 100px 72px; border-top: 1px solid var(--rule); }
        .outcomes-inner { max-width: 1100px; margin: 0 auto; }
        .outcomes-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.8vw, 34px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 56px;
          letter-spacing: -0.01em;
        }
        .outcomes-list { display: flex; flex-direction: column; max-width: 820px; }
        .outcome-item { padding: 24px 0; border-top: 1px solid var(--rule); }
        .outcome-item:last-child { border-bottom: 1px solid var(--rule); }
        .outcome-name {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(18px, 1.8vw, 22px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 8px;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }
        .outcome-desc {
          font-size: 0.9rem;
          line-height: 1.75;
          color: var(--text-mid);
          font-weight: 300;
        }

        /* ============================================================
           6. THE ENGAGEMENT
           Ivory dark. Two-column: info left, details right.
           Investment amount prominent.
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
          margin-bottom: 24px;
          letter-spacing: -0.01em;
          line-height: 1.25;
        }
        .engagement-note {
          font-size: 0.92rem;
          line-height: 1.75;
          color: var(--text-muted);
          margin-bottom: 32px;
          font-weight: 300;
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
          margin-bottom: 10px;
        }
        .investment-note {
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 300;
          line-height: 1.6;
        }

        /* ============================================================
           7. FOR ORGANIZATIONS
           Slate. Asymmetric split — audience shift made architectural.
        ============================================================ */
        .organizational { background: var(--slate); padding: 100px 72px; }
        .organizational-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 5fr 7fr;
          gap: 80px;
          align-items: start;
        }
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
           8. CLOSING CTA
           Ivory dark. Asymmetric: headline left, body and button right.
        ============================================================ */
        .closing { background: var(--ivory-dark); padding: 100px 72px; border-top: 1px solid var(--rule); }
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
        .closing-body {
          font-size: 0.97rem;
          line-height: 1.85;
          color: var(--text-mid);
          margin-bottom: 32px;
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
          .pillars-layout { grid-template-columns: 220px 1fr; }
          .pillars-panel { padding: 32px 0 32px 40px; }
          .how { padding: 80px 48px; }
          .how-timeline { grid-template-columns: 1fr 1fr; gap: 48px 40px; }
          .how-timeline::before { display: none; }
          .outcomes { padding: 80px 48px; }
          .engagement { padding: 80px 48px; }
          .engagement-inner { grid-template-columns: 1fr; gap: 56px; }
          .organizational { padding: 80px 48px; }
          .organizational-inner { grid-template-columns: 1fr; gap: 40px; }
          .closing { padding: 80px 48px; }
          .closing-inner { grid-template-columns: 1fr; gap: 40px; }
        }

        @media (max-width: 768px) {
          .pillars-layout { display: none; }
          .pillars-accordion { display: block; }
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
          .organizational { padding: 64px 24px; }
          .closing { padding: 64px 24px; }
        }
      `}</style>

      {/* ===== 1. HERO ===== */}
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-context">For Individuals, Executives, Teams, and Organizations</p>
          <h1 className="hero-headline">Leadership development that works on the whole person — and produces results you can see.</h1>
          <p className="hero-subhead">The 8 Pillars Leadership Program is a science-grounded, whole-person coaching experience for leaders at any level — including anyone finding their footing in a new role.</p>
          <div className="hero-cta">
            <a href="/contact" className="btn btn-outline-light">Schedule a Free 15-Minute Call</a>
          </div>
        </div>
      </section>

      {/* ===== 2. SOUND FAMILIAR ===== */}
      <section className="familiar">
        <div className="familiar-inner">
          <h2 className="familiar-headline">Sound familiar?</h2>
          <p className="familiar-body">You are performing well. You have been identified as someone with more to give. And yet something keeps getting in the way — a pattern that won't quit, a weight that never fully lifts, a clarity that stays just out of reach.</p>
          <p className="familiar-body">Most leadership development programs address the professional surface. They work on skills, behaviors, and competencies. Those matter. But they miss the most common reason leaders plateau, burn out, or underperform: compromise in the whole person.</p>
          <p className="familiar-body">The challenge you are facing at work rarely lives only at work. Financial stress, relational friction, physical depletion, a culture that doesn't fit — these are not personal problems separate from professional performance. They show up in your judgment, your presence, your ability to lead others through difficulty.</p>
          <p className="familiar-thesis">This program starts where most programs stop.</p>
        </div>
      </section>

      {/* ===== 3. THE 8 PILLARS PROGRAM ===== */}
      <section className="pillars">
        <div className="pillars-inner">
          <div className="pillars-intro">
            <h2 className="pillars-intro-head">The 8 Pillars of Mission-Ready Leadership</h2>
            <p className="pillars-subhead">Eight dimensions of the whole person — each one a strategic risk factor if compromised, and a source of real strength when developed. The coaching works all eight, not just the ones visible at work.</p>
          </div>

          {/* Desktop: index + panel */}
          <div className="pillars-layout">
            <div className="pillars-index" role="tablist" aria-label="8 Pillars of Mission-Ready Leadership">
              {pillars.map((p, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={activePillar === i}
                  aria-controls="pillar-panel"
                  className={`pillar-index-item${activePillar === i ? ' active' : ''}`}
                  onClick={() => setActivePillar(i)}
                  onKeyDown={(e) => handlePillarKey(e, i)}
                  tabIndex={activePillar === i ? 0 : -1}
                >
                  <span className="pillar-idx-num">{p.num}</span>
                  <span className="pillar-idx-name">{p.name}</span>
                </button>
              ))}
            </div>
            <div id="pillar-panel" role="tabpanel" className="pillars-panel">
              <div className="panel-num">{pillars[activePillar].num} of 08</div>
              <div className="panel-name">{pillars[activePillar].name}</div>
              <div className="panel-address">{pillars[activePillar].address}</div>
              <p className="panel-desc">{pillars[activePillar].desc}</p>
            </div>
          </div>

          {/* Mobile: accordion */}
          <div className="pillars-accordion">
            {pillars.map((p, i) => (
              <div key={i} className="accordion-item">
                <button
                  className="accordion-trigger"
                  onClick={() => setOpenPillar(openPillar === i ? null : i)}
                  aria-expanded={openPillar === i}
                >
                  <span className="accordion-num">{p.num}</span>
                  <span className="accordion-name">{p.name}</span>
                  <span className={`accordion-chevron${openPillar === i ? ' open' : ''}`}>▾</span>
                </button>
                <div className={`accordion-body${openPillar === i ? ' open' : ''}`}>
                  <div className="accordion-address">{p.address}</div>
                  <p className="accordion-desc">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pillars-framework-link">
            <a href="/the-8-pillars" className="framework-link">Explore the full framework →</a>
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
          <div className="outcomes-list">
            {outcomes.map((o, i) => (
              <div key={i} className="outcome-item">
                <div className="outcome-name">{o.name}</div>
                <p className="outcome-desc">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 6. THE ENGAGEMENT ===== */}
      <section className="engagement">
        <div className="engagement-inner">
          <div>
            <p className="engagement-context">The engagement</p>
            <h2 className="engagement-headline">10 Months. 20 Sessions. Your Definition of Success.</h2>
            <p className="engagement-note">A self-administered intake and orientation session to start. One Pillar per month for 8 months. Two sessions each month — one structured around the Pillar, one fully client-led. Close-out and integration in months 9 and 10.</p>
            <a href="/contact" className="btn btn-navy">Schedule a Free 15-Minute Call</a>
          </div>
          <div>
            <div className="engagement-details">
              {[
                '10-month whole-person program',
                '20 one-hour sessions total (bi-monthly)',
                '8 Pillars assessment in orientation',
                'One Pillar Session per month — structured, directed',
                'One Coaching Session per month — fully client-led',
                'Between-session accountability via email or text',
                'Close-out: integration, lessons learned, and forward plan',
              ].map((item, i) => (
                <div key={i} className="engagement-detail-item">{item}</div>
              ))}
            </div>
            <div className="investment-block">
              <div className="investment-label">Investment — Individual / Executive Track</div>
              <div className="investment-amount">$6,000</div>
              <p className="investment-note">The full 10-month program, all-inclusive. No per-session billing. Team, cohort, and organization-wide pricing available — contact us for a custom scope.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 7. FOR ORGANIZATIONS ===== */}
      <section className="organizational">
        <div className="organizational-inner">
          <div>
            <div className="org-label">For Organizations</div>
            <h2 className="org-headline">When you're investing in a leader — or a team of them.</h2>
          </div>
          <div className="org-right">
            <p className="org-body">Organizations sponsor this program for high-potential leaders, leaders in transition, and teams that need to perform at a higher level. The organization helps define the purpose of the engagement and the outcomes to watch for.</p>
            <p className="org-body">The coaching conversation itself remains a confidential space for the leader to do real work. That confidentiality is not a concession — it is what makes the work possible. Real change requires a safe place to be honest.</p>
            <p className="org-body">Team, cohort, and organization-wide tracks are available. Scope and pricing are custom. Contact us to start the conversation.</p>
            <a href="/contact" className="btn btn-outline-light">Schedule an Organizational Consultation</a>
          </div>
        </div>
      </section>

      {/* ===== 8. CLOSING CTA ===== */}
      <section className="closing">
        <div className="closing-inner">
          <h2 className="closing-headline">It starts with a single conversation.</h2>
          <div>
            <p className="closing-body">Schedule a free 15-minute intro call. No pitch. No pressure. Just a direct conversation about where you are, what you would like to change — and whether this program is the right fit for getting there.</p>
            <a href="/contact" className="btn btn-navy">Schedule Your Free 15-Minute Call</a>
          </div>
        </div>
      </section>
    </>
  )
}