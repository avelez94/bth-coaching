'use client'

import { useState, useRef, useEffect } from 'react'

const capabilities = [
  'Leadership development programs and learning journeys',
  'New supervisor and manager development curricula',
  'Senior leader and executive development programs',
  'Mission-Ready Leadership cohort experiences',
  'Workshop design and facilitation',
  'Program evaluation and measurement frameworks',
  'Whole-person leadership assessment processes',
  'Military-to-civilian leadership transition programs',
]

const leftCaps = capabilities.slice(0, 4)
const rightCaps = capabilities.slice(4)

const processSteps = [
  {
    num: '01',
    name: 'Discovery',
    body: 'We learn the organization, the culture, and the real problems behind the stated problems. No assumptions. No template applied before the context is understood.',
  },
  {
    num: '02',
    name: 'Design',
    body: 'A custom development system built for your context, your people, and your desired outcomes — incorporating whole-person leadership principles where they serve the mission.',
  },
  {
    num: '03',
    name: 'Delivery',
    body: 'Facilitation, coaching, and program delivery. Present in the work, invested in the result.',
  },
  {
    num: '04',
    name: 'Evaluation',
    body: 'We measure what matters and adjust throughout. The goal is development that holds after we leave.',
  },
]

const caseStudies = [
  {
    challenge: 'An underperforming team of five primary directors and 75 total employees was missing key metric goals and providing insufficient customer service.',
    approach: "We built a custom, metrics-driven dashboard, identified each subordinate team's high-value functions and outcomes, and increased autonomy and communication to enable better individual decision-making.",
    result: "Within one year, the organization went from one of the worst in the country to one of the best, earning formal recognition as the region's #1 large organization. Retention increased, morale improved, and customer service reached the point where customers became \"raving supporters.\"",
  },
  {
    challenge: 'A headquarters organization undergoing transition needed to unify eight disparate functions into one coherent structure for nationwide human resource policy and organizational readiness.',
    approach: "We identified key goals, resource constraints, and opportunities, then maximized individual autonomy and communication to surface the organization's best ideas, implementing programs that improved both effectiveness and efficiency.",
    result: 'The organization became recognized as a go-to, responsive, forward-leaning team.',
  },
  {
    challenge: 'A team performed admirably within individual functions but lacked cross-functional trust, support, and results.',
    approach: 'We identified key individual and team values, increased positive communication by celebrating individual and collective wins, and rebuilt trust through shared experiences and shared goals.',
    result: 'A cooperative, high-performing team where wins were celebrated together, organizational goals were met or exceeded, retention increased, and team morale became a recognized asset.',
  },
]

export default function LeadershipConsulting() {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');

        :root {
          --ivory: #F7F4ED;
          --ivory-dark: #EDE8DC;
          --ivory-mid: #E8E2D4;
          --slate: #4C78A0;
          --slate-mid: #3A607F;
          --slate-light: #6B9ABF;
          --navy: #0D1B2A;
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

        /* ============================================================
           HERO
           Ivory. Direct address to an organizational decision-maker.
           Long headline carries authority — no oversizing needed.
        ============================================================ */
        .hero {
          background: var(--ivory);
          padding: 160px 72px 100px;
        }
        .hero-inner { max-width: 820px; }
        .hero-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(32px, 3.8vw, 48px);
          font-weight: 400;
          line-height: 1.18;
          color: var(--text);
          margin-bottom: 28px;
          letter-spacing: -0.01em;
        }
        .hero-subhead {
          font-size: 1rem;
          line-height: 1.82;
          color: var(--text-mid);
          margin-bottom: 40px;
          max-width: 640px;
          font-weight: 300;
        }

        /* ============================================================
           MORE THAN A WORKSHOP
           Ivory dark. Editorial split: headline left, body right.
           Composition does the work — no scroll animation borrowed
           from Mission-Ready.
        ============================================================ */
        .workshop {
          background: var(--ivory-dark);
          padding: 100px 72px;
        }
        .workshop-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 5fr 7fr;
          gap: 80px;
          align-items: start;
        }
        .workshop-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 2.4vw, 30px);
          font-weight: 400;
          line-height: 1.28;
          color: var(--text);
          letter-spacing: -0.01em;
          position: sticky;
          top: 100px;
        }
        .workshop-body {
          font-size: 0.97rem;
          line-height: 1.88;
          color: var(--text-mid);
          margin-bottom: 20px;
          font-weight: 300;
        }
        .workshop-body:last-child { margin-bottom: 0; }

        /* ============================================================
           WHAT WE BUILD
           Ivory. Two-column typographic capability index.
           Thin vertical rule between columns on desktop.
           Names only — no invented descriptions, no icons.
        ============================================================ */
        .capabilities {
          background: var(--ivory);
          padding: 100px 72px;
          border-top: 1px solid var(--rule);
        }
        .capabilities-inner { max-width: 1100px; margin: 0 auto; }
        .capabilities-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 2.4vw, 30px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 52px;
          letter-spacing: -0.01em;
        }
        .capabilities-grid {
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
          gap: 0;
        }
        .capabilities-col { padding: 0; }
        .capabilities-col:last-child { padding-left: 52px; }
        .cap-divider {
          background: var(--rule);
          margin: 0 52px 0 0;
        }
        .cap-item {
          padding: 18px 0;
          border-bottom: 1px solid var(--rule);
          font-size: 0.92rem;
          line-height: 1.5;
          color: var(--text-mid);
          font-weight: 300;
          transition: color 0.18s, padding-left 0.18s;
          cursor: default;
        }
        .cap-item:first-child { border-top: 1px solid var(--rule); }
        .cap-item:hover { color: var(--text); padding-left: 6px; }

        /* ============================================================
           THE PROCESS
           Slate pale. Four stages with restrained hover emphasis.
           All stages visible simultaneously. Horizontal on desktop,
           vertical progression on mobile. Not a clone of Mission-Ready arc.
        ============================================================ */
        .process {
          background: #E4EDF5;
          padding: 100px 72px;
        }
        .process-inner { max-width: 1100px; margin: 0 auto; }
        .process-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 2.4vw, 30px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 64px;
          letter-spacing: -0.01em;
        }
        .process-track {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
        }
        .process-step {
          padding: 32px 28px;
          background: rgba(255,255,255,0.45);
          transition: background 0.22s;
          cursor: default;
          position: relative;
        }
        .process-step:hover,
        .process-step.active {
          background: rgba(255,255,255,0.82);
        }
        /* Directional connector between steps */
        .process-step:not(:last-child)::after {
          content: '';
          position: absolute;
          right: -2px;
          top: 50%;
          width: 2px;
          height: 24px;
          background: var(--slate-light);
          opacity: 0.3;
          transform: translateY(-50%);
        }
        .process-step-num {
          font-size: 0.68rem;
          color: var(--slate-mid);
          font-weight: 500;
          letter-spacing: 0.04em;
          margin-bottom: 14px;
        }
        .process-step-name {
          font-family: 'DM Serif Display', serif;
          font-size: 1.15rem;
          font-weight: 400;
          color: var(--text);
          margin-bottom: 12px;
          letter-spacing: -0.01em;
          transition: color 0.22s;
        }
        .process-step:hover .process-step-name,
        .process-step.active .process-step-name {
          color: var(--slate-mid);
        }
        .process-step-body {
          font-size: 0.87rem;
          line-height: 1.78;
          color: var(--text-muted);
          font-weight: 300;
          transition: color 0.22s;
        }
        .process-step:hover .process-step-body,
        .process-step.active .process-step-body {
          color: var(--text-mid);
        }

        /* ============================================================
           CASE STUDIES
           Slate. All three visible. Full-width narrative prose.
           No labels, no testimonial styling, no cards.
           Thin rules between studies. John's verbatim language.
        ============================================================ */
        .case-studies {
          background: var(--slate);
          padding: 100px 72px;
        }
        .case-studies-inner { max-width: 860px; margin: 0 auto; }
        .case-study {
          padding: 48px 0;
          border-bottom: 1px solid var(--rule-light);
        }
        .case-study:first-child {
          padding-top: 0;
          border-top: none;
        }
        .case-study:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .case-study-label {
          font-size: 0.65rem;
          color: rgba(247,244,237,0.45);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 6px;
        }
        .case-study-text {
          font-size: 0.93rem;
          line-height: 1.82;
          color: rgba(247,244,237,0.78);
          font-weight: 300;
          margin-bottom: 20px;
        }
        .case-study-text:last-child { margin-bottom: 0; }

        /* ============================================================
           ENGAGEMENT + CTA
           Ivory. Narrow measure. John's exact closing statement.
        ============================================================ */
        .engagement {
          background: var(--ivory);
          padding: 100px 72px;
          border-top: 1px solid var(--rule);
        }
        .engagement-inner {
          max-width: 640px;
          margin: 0 auto;
          text-align: center;
        }
        .engagement-body {
          font-size: 0.97rem;
          line-height: 1.85;
          color: var(--text-mid);
          margin-bottom: 36px;
          font-weight: 300;
        }

        /* ============================================================
           RESPONSIVE
        ============================================================ */
        @media (max-width: 1024px) {
          .hero { padding: 140px 48px 80px; }
          .workshop { padding: 80px 48px; }
          .workshop-inner { grid-template-columns: 1fr; gap: 36px; }
          .workshop-headline { position: static; }
          .capabilities { padding: 80px 48px; }
          .process { padding: 80px 48px; }
          .process-track { grid-template-columns: 1fr 1fr; gap: 2px; }
          .process-step:nth-child(2)::after { display: none; }
          .case-studies { padding: 80px 48px; }
          .engagement { padding: 80px 48px; }
        }

        @media (max-width: 768px) {
          .capabilities-grid { grid-template-columns: 1fr; gap: 0; }
          .cap-divider { display: none; }
          .capabilities-col:last-child { padding-left: 0; }
          .process-track { grid-template-columns: 1fr; gap: 0; }
          .process-step { padding: 24px 0; background: transparent; }
          .process-step:hover, .process-step.active { background: transparent; }
          .process-step::after { display: none; }
          /* Vertical progression line on mobile */
          .process-track {
            position: relative;
            padding-left: 28px;
          }
          .process-track::before {
            content: '';
            position: absolute;
            left: 5px;
            top: 8px;
            bottom: 8px;
            width: 1px;
            background: var(--slate-light);
            opacity: 0.4;
          }
          .process-step-num {
            position: relative;
          }
          .process-step-num::before {
            content: '';
            position: absolute;
            left: -28px;
            top: 50%;
            transform: translateY(-50%);
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: var(--slate-mid);
            z-index: 2;
          }
          .process-step:not(:last-child) {
            border-bottom: none;
            padding-bottom: 36px;
          }
        }

        @media (max-width: 640px) {
          .hero { padding: 120px 24px 64px; }
          .workshop { padding: 64px 24px; }
          .capabilities { padding: 64px 24px; }
          .process { padding: 64px 24px; }
          .case-studies { padding: 64px 24px; }
          .engagement { padding: 64px 24px; }
        }
      `}</style>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-headline">Your organization's leadership and their relationships are either an asset or a liability. Let's build the system that makes it an asset.</h1>
          <p className="hero-subhead">Custom design and delivery of leadership development and communication systems for mission-driven enterprises, federal agencies, defense organizations, and others.</p>
          <a href="/contact" className="btn btn-navy">Schedule a Consultation</a>
        </div>
      </section>

      {/* ===== MORE THAN A WORKSHOP ===== */}
      <section className="workshop">
        <div className="workshop-inner">
          <h2 className="workshop-headline">More than a workshop. A custom-built system addressing your unique needs.</h2>
          <div>
            <p className="workshop-body">A training event rarely changes how people lead. Lasting development requires a system — a deliberate sequence of learning, practice, reflection, and accountability built around how your people actually work, what your culture rewards, and what your mission requires.</p>
            <p className="workshop-body">Beyond the Horizon designs and delivers those systems. Every engagement begins with understanding your specific context — not with a template looking for a home.</p>
          </div>
        </div>
      </section>

      {/* ===== WHAT WE BUILD ===== */}
      <section className="capabilities">
        <div className="capabilities-inner">
          <h2 className="capabilities-heading">What we build.</h2>
          <div className="capabilities-grid">
            <div className="capabilities-col">
              {leftCaps.map((cap, i) => (
                <div key={i} className="cap-item">{cap}</div>
              ))}
            </div>
            <div className="cap-divider" aria-hidden="true" />
            <div className="capabilities-col">
              {rightCaps.map((cap, i) => (
                <div key={i} className="cap-item">{cap}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== THE PROCESS ===== */}
      <section className="process">
        <div className="process-inner">
          <h2 className="process-heading">The process.</h2>
          <div className="process-track">
            {processSteps.map((step, i) => (
              <div
                key={i}
                className={`process-step${activeStep === i ? ' active' : ''}`}
                onMouseEnter={() => setActiveStep(i)}
                onMouseLeave={() => setActiveStep(null)}
                onFocus={() => setActiveStep(i)}
                onBlur={() => setActiveStep(null)}
                tabIndex={0}
              >
                <div className="process-step-num">{step.num}</div>
                <div className="process-step-name">{step.name}</div>
                <p className="process-step-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CASE STUDIES ===== */}
      <section className="case-studies">
        <div className="case-studies-inner">
          {caseStudies.map((study, i) => (
            <div key={i} className="case-study">
              <div className="case-study-label">The Challenge</div>
              <p className="case-study-text">{study.challenge}</p>
              <div className="case-study-label">The Approach</div>
              <p className="case-study-text">{study.approach}</p>
              <div className="case-study-label">The Result</div>
              <p className="case-study-text">{study.result}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ENGAGEMENT + CTA ===== */}
      <section className="engagement">
        <div className="engagement-inner">
          <p className="engagement-body">Every consulting engagement is custom-scoped. Contact us to discuss your organization's specific situation.</p>
          <a href="/contact" className="btn btn-navy">Schedule a Consultation</a>
        </div>
      </section>
    </>
  )
}