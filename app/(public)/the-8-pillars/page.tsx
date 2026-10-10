'use client'

import './the-8-pillars.css'

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