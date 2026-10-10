'use client'

import './for-organizations.css'

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