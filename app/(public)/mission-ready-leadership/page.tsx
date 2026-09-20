'use client'

import { useState } from 'react'

const pillars = [
  { num: '01', name: 'Values, Ethical & Moral Compass', address: 'Character, integrity & values-aligned decisions', desc: 'A leader without a clearly articulated ethical framework will be caught flat-footed by decisions that require one. Under pressure, in ambiguous situations, with competing demands — character is what remains when everything else falls away. This pillar addresses character, not compliance. Not what the rules require, but who you are when the rules don\'t cover it.' },
  { num: '02', name: 'Professional Excellence', address: 'Craft, credibility & continued development', desc: 'At the executive level, credibility is currency — and it requires active stewardship. Continued, deliberate investment in the knowledge, skills, and capabilities specific to your domain and your leadership role. It also means the willingness to recognize when current approaches are no longer sufficient — and to act on that recognition rather than defaulting to what has always worked.' },
  { num: '03', name: 'Physical Health & Readiness', address: 'Energy, endurance & cognitive capacity', desc: 'Physical condition is the biological substrate of professional performance. Research on sleep deprivation alone demonstrates measurable impairment of the prefrontal cortex at levels most executives routinely accept as normal. Chronic depletion impairs exactly the capabilities leadership demands most. This pillar is not about fitness culture. It is about the infrastructure that makes sustained, high-quality leadership possible.' },
  { num: '04', name: 'Financial Stewardship', address: 'Stability & freedom from cognitive load', desc: 'Financial stress impairs executive function. A 2013 study in Science demonstrated that financial worry occupies working memory in a way that produces cognitive performance drops equivalent to losing significant sleep — not because the person is less capable, but because a portion of their cognitive bandwidth is already consumed. A senior leader carrying unresolved financial stress carries it into every organizational decision they make, often without knowing it.' },
  { num: '05', name: 'Cognitive Fortitude', address: 'Clarity & sound judgment under pressure', desc: 'The capacity to think clearly and make sound judgments under sustained pressure is not a fixed trait — it is a developable capability. The leaders who perform well under pressure have built specific cognitive habits and frameworks for managing their own thinking. This pillar addresses those habits: how you interpret setbacks, manage uncertainty, and maintain strategic perspective when the situation is loud and demanding.' },
  { num: '06', name: 'Emotional Equanimity', address: 'Regulation, presence & culture impact', desc: 'How a leader shows up emotionally is the primary driver of organizational culture. Not suppressing emotion — intelligently managing emotional experience. The capacity to feel difficulty without being governed by it. Research on emotional contagion demonstrates that a leader\'s emotional state is transmitted through a team — affecting cognitive performance, risk tolerance, and creativity of the people around them.' },
  { num: '07', name: 'Relational Harmony', address: 'Trust & connection at work and at home', desc: 'The quality of a leader\'s most important relationships — at home, at work, and in their broader network — determines the resources available in difficult moments. Relational friction is a sustained drain that most leaders underestimate because it becomes normalized. Research consistently shows that leaders who recover most effectively from setbacks have strong relational foundations across multiple life domains.' },
  { num: '08', name: 'Environmental Harmony', address: 'Culture, values alignment & contextual fit', desc: 'The degree to which a leader\'s organizational environment — its culture, values, and operating norms — supports rather than erodes their capacity to lead and decide well. Not every leadership challenge is a leader problem. Some are context problems. Recognizing the difference — clearly, without defensiveness or denial — is itself a leadership capability.' },
]

const phases = [
  { label: 'Phase 0', sub: 'Intake & Orientation', body: 'A self-administered intake survey, followed by a 1–2 day intro session (in-person or virtual): relationship-building, expectations, and a first look at where you stand across all 8 Pillars.' },
  { label: 'Months 1–8', sub: 'One Pillar per Month', body: 'Two sessions each month, as described above. First a dive into the Pillar, next an open session to address your most pressing challenges or explore the pillars more fully.' },
  { label: 'Months 9–10', sub: 'Close-Out', body: 'Ongoing coaching and lessons learned across all 8 Pillars, a plan for what you sustain on your own, and — if it\'s a fit — an introduction to ongoing support between engagements.' },
]

const tracks = [
  { track: 'Individual / Executive Track', audience: 'Self-directed individuals and executives', price: '$6,000', note: 'The full 10-month arc, all-inclusive. No per-session billing.' },
  { track: 'Team / Cohort Track', audience: 'Teams and cohorts', price: 'Custom', note: 'Custom-scoped based on cohort size. Pillar Sessions typically delivered once per month to the full cohort; Coaching Sessions remain one-on-one per participant. Contact us for a per-person quote once your cohort size is set.' },
  { track: 'Organization-Wide Track', audience: 'Organizations', price: 'Custom SOW', note: 'Scoped to your organization\'s structure and goals — similar to our Leadership Consulting engagements.' },
]

export default function MissionReadyLeadership() {
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
           Ivory. Headline spans wider canvas left-anchored.
           Subhead + audience + CTA offset lower-right.
        ============================================================ */
        .hero { background: var(--ivory); padding: 160px 72px 100px; }
        .hero-inner { max-width: 1200px; }
        .hero-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(34px, 4vw, 54px);
          font-weight: 400;
          line-height: 1.15;
          color: var(--text);
          letter-spacing: -0.02em;
          max-width: 920px;
          margin-bottom: 0;
        }
        .hero-right {
          margin-top: 44px;
          margin-left: auto;
          max-width: 520px;
        }
        .hero-subhead {
          font-size: 1rem;
          line-height: 1.82;
          color: var(--text-mid);
          margin-bottom: 20px;
          font-weight: 300;
        }
        .hero-audience {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 400;
          margin-bottom: 32px;
        }

        /* ============================================================
           2. POSITIONING — "Most programs develop skills."
           Ivory dark. Asymmetric, static. Thesis line elevated.
        ============================================================ */
        .positioning { background: var(--ivory-dark); padding: 100px 72px; }
        .positioning-inner { max-width: 1100px; margin: 0 auto; }
        .positioning-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(26px, 3vw, 38px);
          font-weight: 400;
          line-height: 1.22;
          color: var(--text);
          margin-bottom: 40px;
          letter-spacing: -0.01em;
          max-width: 820px;
        }
        .positioning-body {
          font-size: 0.97rem;
          line-height: 1.88;
          color: var(--text-mid);
          margin-bottom: 20px;
          font-weight: 300;
          max-width: 620px;
        }
        .positioning-thesis {
          font-size: 0.97rem;
          line-height: 1.88;
          color: var(--text);
          margin-top: 32px;
          font-weight: 300;
          max-width: 620px;
        }

        /* ============================================================
           3. SCIENCE
           Slate pale. Full-width heading above grid.
           Left: research items. Right: authority statement larger + bolder.
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
        }
        .science-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .science-item { margin-bottom: 36px; }
        .science-item:last-child { margin-bottom: 0; }
        .science-item-name {
          font-family: 'DM Serif Display', serif;
          font-size: 1rem;
          font-weight: 400;
          color: var(--slate-mid);
          margin-bottom: 8px;
          line-height: 1.3;
        }
        .science-item-body {
          font-size: 0.87rem;
          line-height: 1.78;
          color: var(--text-muted);
        }
        /* Authority statement — larger, left-aligned, dominant */
        .science-authority {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.8vw, 38px);
          font-weight: 400;
          line-height: 1.28;
          color: var(--slate-mid);
          text-align: left;
          letter-spacing: -0.01em;
        }

        /* ============================================================
           4. PILLARS — interaction preserved exactly.
           Heading wider. Right-side active indicator preserved.
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
        .pillars-subhead { font-size: 0.93rem; line-height: 1.78; color: var(--text-muted); font-weight: 300; }

        /* Desktop: index + panel — unchanged */
        .pillars-layout { display: grid; grid-template-columns: 280px 1fr; gap: 0; border-top: 1px solid var(--rule); }
        .pillars-index { border-right: 1px solid var(--rule); }
        .pillar-index-item {
          display: flex; align-items: baseline; gap: 14px;
          padding: 16px 24px 16px 0;
          border-bottom: 1px solid var(--rule);
          cursor: pointer; transition: background 0.15s;
          background: none; border-left: none; outline: none;
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
        /* Right-side active indicator — preserved */
        .pillar-index-item.active::after {
          content: ''; position: absolute; right: 0; top: 20%; bottom: 20%; width: 2px; background: var(--slate);
        }
        .pillars-panel { padding: 40px 0 40px 56px; min-height: 320px; display: flex; flex-direction: column; justify-content: flex-start; }
        .panel-num { font-size: 0.68rem; color: var(--text-muted); letter-spacing: 0.06em; margin-bottom: 16px; font-weight: 500; }
        .panel-name { font-family: 'DM Serif Display', serif; font-size: clamp(22px, 2.4vw, 30px); font-weight: 400; color: var(--text); margin-bottom: 10px; letter-spacing: -0.01em; line-height: 1.25; }
        .panel-address { font-size: 0.82rem; color: var(--slate-mid); margin-bottom: 24px; font-weight: 400; }
        .panel-desc { font-size: 0.93rem; line-height: 1.85; color: var(--text-mid); max-width: 520px; font-weight: 300; }

        /* Mobile accordion — unchanged */
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
           5. TWO SESSIONS
           Slate. Preserved. Heading slightly wider.
        ============================================================ */
        .sessions { background: var(--slate); padding: 100px 72px; }
        .sessions-inner { max-width: 1100px; margin: 0 auto; }
        .sessions-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 2.6vw, 32px);
          font-weight: 400;
          color: var(--ivory);
          margin-bottom: 56px;
          letter-spacing: -0.01em;
          max-width: 820px;
        }
        .sessions-pair {
          display: grid;
          grid-template-columns: 450px 90px 450px;
          gap: 0;
          align-items: start;
        }
        /* Gap column — separation from negative space only */
        .session-divider { display: none; }
        .session { }
        .session-two { padding-top: 72px; }
        .session-label { font-size: 0.8rem; color: rgba(247,244,237,0.72); margin-bottom: 12px; font-weight: 500; }
        .session-name { font-family: 'DM Serif Display', serif; font-size: clamp(18px, 2vw, 24px); font-weight: 400; color: var(--ivory); margin-bottom: 20px; letter-spacing: -0.01em; line-height: 1.3; }
        .session-body { font-size: 0.9rem; line-height: 1.85; color: rgba(247,244,237,0.72); margin-bottom: 16px; font-weight: 300; }
        .session-body strong { color: rgba(247,244,237,0.9); font-weight: 500; }
        .sessions-icf { margin-top: 72px; padding-top: 32px; border-top: 1px solid rgba(247,244,237,0.12); font-size: 0.85rem; line-height: 1.78; color: rgba(247,244,237,0.5); font-style: italic; }
        .sessions-icf strong { color: rgba(247,244,237,0.7); font-weight: 500; font-style: normal; }

        /* ============================================================
           6. PROGRAM ARC
           Ivory dark. Editorially weighted: 20% / 55% / 25%.
           Vertical rules between phases. No dots. No gradient line.
        ============================================================ */
        .arc { background: var(--ivory-dark); padding: 100px 72px; }
        .arc-inner { max-width: 1100px; margin: 0 auto; }
        .arc-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 2.4vw, 30px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 64px;
          letter-spacing: -0.01em;
        }
        .arc-track {
          display: grid;
          grid-template-columns: 20fr 55fr 25fr;
          gap: 0;
          border-top: 1px solid var(--rule);
        }
        .arc-phase {
          padding: 36px 40px 36px 0;
          border-right: 1px solid var(--rule);
        }
        .arc-phase:last-child { border-right: none; padding-left: 40px; padding-right: 0; }
        .arc-phase:nth-child(2) { padding-left: 40px; }
        .arc-phase-label {
          font-family: 'DM Serif Display', serif;
          font-weight: 400;
          color: var(--text);
          margin-bottom: 4px;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }
        /* Scale label size to phase weight */
        .arc-phase:nth-child(1) .arc-phase-label { font-size: 0.95rem; }
        .arc-phase:nth-child(2) .arc-phase-label { font-size: clamp(16px, 1.6vw, 20px); }
        .arc-phase:nth-child(3) .arc-phase-label { font-size: 1rem; }
        .arc-phase-sub { font-size: 0.73rem; color: var(--slate-mid); margin-bottom: 16px; font-weight: 400; }
        .arc-phase-body { font-size: 0.87rem; line-height: 1.78; color: var(--text-muted); font-weight: 300; }

        /* ============================================================
           7. CONFIDENTIALITY
           Slate pale own section. Statement at editorial scale.
           No card, no quote marks, no callout box.
        ============================================================ */
        .confidentiality {
          background: var(--slate-pale);
          padding: 80px 72px;
          border-top: 1px solid rgba(76,120,160,0.12);
          border-bottom: 1px solid rgba(76,120,160,0.12);
        }
        .confidentiality-inner { max-width: 1100px; margin: 0 auto; }
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
           8. INVESTMENT — Option A
           Ivory dark. Left: price anchor. Right: track info.
           Price and track name share visual weight.
           Mobile: track name first, then audience, price, note.
        ============================================================ */
        .investment { background: var(--ivory-dark); padding: 100px 72px; border-top: 1px solid var(--rule); }
        .investment-inner { max-width: 1100px; margin: 0 auto; }
        .investment-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 2.4vw, 30px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 56px;
          letter-spacing: -0.01em;
        }
        .investment-tracks { display: flex; flex-direction: column; }
        .investment-track {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 0 52px;
          align-items: start;
          padding: 36px 0;
          border-top: 1px solid var(--rule);
        }
        .investment-track:last-child { border-bottom: 1px solid var(--rule); }
        /* Price — left anchor, strong but not dominant */
        .track-price {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.3rem, 1.8vw, 1.7rem);
          font-weight: 400;
          color: var(--slate-mid);
          line-height: 1.1;
          padding-top: 4px;
        }
        /* Track info — right, track name matches price in weight */
        .track-info { }
        .track-name {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.1rem, 1.6vw, 1.5rem);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 6px;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }
        .track-audience { font-size: 0.78rem; color: var(--text-muted); margin-bottom: 14px; font-weight: 400; }
        .track-note { font-size: 0.88rem; line-height: 1.75; color: var(--text-muted); font-weight: 300; }

        /* Mobile: stacked, track name first */
        .track-mobile { display: none; }

        .investment-cta { margin-top: 48px; }

        /* ============================================================
           RESPONSIVE
        ============================================================ */
        @media (max-width: 1024px) {
          .hero { padding: 140px 48px 80px; }
          .hero-right { margin-left: 0; max-width: 100%; }
          .positioning { padding: 80px 48px; }
          .science { padding: 80px 48px; }
          .science-grid { grid-template-columns: 1fr; gap: 48px; }
          .pillars { padding: 80px 48px; }
          .pillars-layout { grid-template-columns: 220px 1fr; }
          .pillars-panel { padding: 32px 0 32px 40px; }
          .sessions { padding: 80px 48px; }
          .sessions-pair { grid-template-columns: 1fr; gap: 0; }
          .session-two { padding-top: 40px; }
          .arc { padding: 80px 48px; }
          .arc-track { grid-template-columns: 1fr; border-top: none; }
          .arc-phase { padding: 28px 0 28px 24px; border-right: none; border-top: 1px solid var(--rule); border-left: 2px solid var(--rule); }
          .arc-phase:last-child { padding-left: 24px; }
          .arc-phase:nth-child(2) { padding-left: 24px; }
          .arc-phase:nth-child(1) .arc-phase-label,
          .arc-phase:nth-child(2) .arc-phase-label,
          .arc-phase:nth-child(3) .arc-phase-label { font-size: 1rem; }
          .confidentiality { padding: 64px 48px; }
          .investment { padding: 80px 48px; }
        }

        @media (max-width: 768px) {
          .pillars-layout { display: none; }
          .pillars-accordion { display: block; }
          .investment-track { display: none; }
          .track-mobile {
            display: block;
            padding: 28px 0;
            border-top: 1px solid var(--rule);
          }
          .track-mobile:last-child { border-bottom: 1px solid var(--rule); }
          .track-mobile .track-name { font-size: 1.05rem; margin-bottom: 4px; font-family: 'DM Serif Display', serif; font-weight: 400; color: var(--text); letter-spacing: -0.01em; line-height: 1.3; }
          .track-mobile .track-audience { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 10px; }
          .track-mobile .track-price { font-family: 'DM Serif Display', serif; font-size: 1.3rem; color: var(--slate-mid); margin-bottom: 10px; }
          .track-mobile .track-note { font-size: 0.85rem; line-height: 1.72; color: var(--text-muted); font-weight: 300; }
        }

        @media (max-width: 640px) {
          .hero { padding: 120px 24px 64px; }
          .positioning { padding: 64px 24px; }
          .science { padding: 64px 24px; }
          .pillars { padding: 64px 24px; }
          .sessions { padding: 64px 24px; }
          .session-two { padding-top: 32px; }
          .arc { padding: 64px 24px; }
          .confidentiality { padding: 56px 24px; }
          .investment { padding: 64px 24px; }
        }
      `}</style>

      {/* ===== 1. HERO ===== */}
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-headline">Leadership development that treats the whole person — and produces results the individual and organization can see.</h1>
          <div className="hero-right">
            <p className="hero-subhead">The Mission-Ready Leadership Program is a science-grounded, whole-person coaching experience built around the 8 Pillars of Mission-Ready Leadership — for sponsored leaders, self-directed individuals, teams, and anyone finding their footing in a new role.</p>
            <p className="hero-audience">For Executives, Teams, Organizations &amp; Individuals in Transition</p>
            <a href="/contact" className="btn btn-navy">Schedule a Conversation</a>
          </div>
        </div>
      </section>

      {/* ===== 2. POSITIONING ===== */}
      <section className="positioning">
        <div className="positioning-inner">
          <h2 className="positioning-headline">Most programs develop skills. This one develops leaders.</h2>
          <p className="positioning-body">Leadership training typically addresses competencies and behaviors. Those matter. But they miss the most common reason leaders underperform, burn out, or plateau: compromise in the whole person.</p>
          <p className="positioning-body">The immediate challenge a leader faces is rarely the whole story. The weight they carry professionally has company somewhere else — financial stress, relational friction, physical depletion, a culture that doesn't fit. Addressing only the professional surface produces partial results. Most programs never look underneath.</p>
          <p className="positioning-thesis">The Mission-Ready Leadership Program starts where most programs stop.</p>
        </div>
      </section>

      {/* ===== 3. SCIENCE ===== */}
      <section className="science">
        <div className="science-inner">
          <h2 className="science-heading">Science-grounded. Experience-tested.</h2>
          <div className="science-grid">
            <div>
              <div className="science-item">
                <div className="science-item-name">Positive Psychology</div>
                <p className="science-item-body">Dr. Martin Seligman's peer-reviewed PERMA framework — the scientific foundation of the U.S. Army's Comprehensive Soldier and Family Fitness program — established that human flourishing operates across multiple interdependent life domains. Compromise in one cannot be offset by strength in another.</p>
              </div>
              <div className="science-item">
                <div className="science-item-name">Work-Life Integration</div>
                <p className="science-item-body">Stewart Friedman's Total Leadership research at the Wharton School demonstrated that leaders who pursue meaningful engagement across work, home, community, and self simultaneously outperform those who sacrifice one domain for another. Strength built in any area of a leader's life reinforces all the others.</p>
              </div>
              <div className="science-item">
                <div className="science-item-name">Neuroscience of Performance</div>
                <p className="science-item-body">Chronic stress across any life domain — financial, relational, physical, environmental — measurably impairs the prefrontal cortex: the seat of judgment, strategic thinking, and emotional regulation. These are precisely the capabilities leadership demands most.</p>
              </div>
            </div>
            <div>
              <p className="science-authority">This is not a wellness initiative. It is strategic personnel development and risk mitigation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. PILLARS ===== */}
      <section className="pillars">
        <div className="pillars-inner">
          <div className="pillars-intro">
            <h2 className="pillars-intro-head">The 8 Pillars of Mission-Ready Leadership</h2>
            <p className="pillars-subhead">Building unshakable wholeness under pressure. Think of these as strategic risk factors — compromise in any one area degrades judgment across all the others.</p>
          </div>

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
            <a href="/the-framework" className="framework-link">Explore the full framework →</a>
          </div>
        </div>
      </section>

      {/* ===== 5. TWO SESSIONS ===== */}
      <section className="sessions">
        <div className="sessions-inner">
          <h2 className="sessions-heading">Two sessions a month. Two different modes. Both designed to reinforce one another.</h2>
          <div className="sessions-pair">
            <div className="session">
              <div className="session-label">Session one</div>
              <div className="session-name">The Pillar Session</div>
              <p className="session-body">I bring a structured set of questions built around that month's Pillar — where you stand, what's working, where you want to grow, and what you're willing to commit to. This session is <strong>intentionally more directive than traditional coaching.</strong> It's a deliberate design choice, to assist and cultivate growth — and we name it as exactly that before we start. Every Pillar Session opens with a quick check: is this the right place to spend today's time, or is something else more present for you?</p>
            </div>
            <div className="session-divider" aria-hidden="true" />
            <div className="session session-two">
              <div className="session-label">Session two</div>
              <div className="session-name">The Traditional Coaching Session</div>
              <p className="session-body">Fully client-led, following International Coaching Federation (ICF) core competencies. Your agenda, your pace, no imposed frame. This is where the insights from the Pillar Session, or something more pressing, gets worked through in whatever way actually serves you.</p>
            </div>
          </div>
          <p className="sessions-icf"><strong>Why we tell you this:</strong> The ICF credentialing body holds non-directive, client-led conversation as the standard. We believe a structured framework has real value alongside that standard — so rather than blur the two, we keep them distinct and name which one you're in. This integrity and transparency is at the heart of who we are.</p>
        </div>
      </section>

      {/* ===== 6. PROGRAM ARC ===== */}
      <section className="arc">
        <div className="arc-inner">
          <h2 className="arc-heading">The Program Arc</h2>
          <div className="arc-track">
            {phases.map((phase, i) => (
              <div key={i} className="arc-phase">
                <div className="arc-phase-label">{phase.label}</div>
                <div className="arc-phase-sub">{phase.sub}</div>
                <p className="arc-phase-body">{phase.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 7. CONFIDENTIALITY ===== */}
      <section className="confidentiality">
        <div className="confidentiality-inner">
          <p className="conf-body">When an organization sponsors this coaching, the coaching conversation remains a confidential space for the leader to do real work. The organization helps define the purpose of the engagement. The content of sessions belongs to the leader.</p>
        </div>
      </section>

      {/* ===== 8. INVESTMENT ===== */}
      <section className="investment">
        <div className="investment-inner">
          <h2 className="investment-heading">Investment</h2>
          <div className="investment-tracks">
            {tracks.map((t, i) => (
              <>
                {/* Desktop: price left, info right */}
                <div key={`desk-${i}`} className="investment-track">
                  <div className="track-price">{t.price}</div>
                  <div className="track-info">
                    <div className="track-name">{t.track}</div>
                    <div className="track-audience">{t.audience}</div>
                    <p className="track-note">{t.note}</p>
                  </div>
                </div>
                {/* Mobile: track name first */}
                <div key={`mob-${i}`} className="track-mobile">
                  <div className="track-name">{t.track}</div>
                  <div className="track-audience">{t.audience}</div>
                  <div className="track-price">{t.price}</div>
                  <p className="track-note">{t.note}</p>
                </div>
              </>
            ))}
          </div>
          <div className="investment-cta">
            <a href="/contact" className="btn btn-navy">Schedule a Conversation</a>
          </div>
        </div>
      </section>
    </>
  )
}