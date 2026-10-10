'use client'

import './leader-development.css'

const stages = [
  { num: '01', label: 'Month 1 — Start with clarity.', body: 'An intake assessment and a one- to two-day kickoff. You define what success looks like for you and where you want to grow.' },
  { num: '02', label: 'Months 2–9 — One pillar at a time.', body: 'Each month focuses on one pillar, with two sessions: a structured session that uses a focused set of questions to assess where you are and where you want to be, and a coaching session where you set the agenda and work on whatever matters most right now.' },
  { num: '03', label: 'Month 10 — Lock it in.', body: 'Review what you\'ve learned, what has changed, and the commitments you\'re carrying forward.' },
  { num: '04', label: 'After the program — Support when you need it.', body: 'Optional as-needed coaching for the storms that come later.' },
]

export default function LeaderDevelopment() {
  return (
    <>

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