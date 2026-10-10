import './home.css'

export default function Home() {
  return (
    <>
      {/* ===== 1. HERO ===== */}
      <section className="hero">
        <div className="hero-left">
          <h1 className="hero-headline">The challenge in your job is only part of what you're carrying.</h1>
          <p className="hero-subhead">Executive and leadership coaching for people who want strong results at work without sacrificing everything else. Guided by 37 years of leadership in the Navy and the Pentagon.</p>
          <div className="hero-cta-stack">
            {/* PLACEHOLDER: Replace with Microsoft Bookings URL when provided */}
            <button className="btn-gold" disabled aria-disabled="true">
              Schedule a Free 15-Minute Call
            </button>
            <p className="hero-org-link">
              Hiring for your organization?{' '}
              <a href="/for-organizations">Start here →</a>
            </p>
          </div>
        </div>
        <div className="hero-right">
          {/* PLACEHOLDER: Replace with new navy blazer open collar portrait when John provides photos */}
          <img
            src="/images/john-mccracken-blue-tie.jpg"
            alt="John McCracken"
            className="hero-photo-img"
          />
          <div className="hero-photo-fade" aria-hidden="true" />
        </div>
      </section>

      {/* ===== 2. THREE DOORS ===== */}
      <section className="doors">
        <div className="doors-inner">
          <div className="doors-label">Which sounds like you?</div>
          <div className="doors-grid">

            <div className="door-card">
              <h2 className="door-headline">The challenges are outpacing the solutions.</h2>
              <p className="door-body">You're good at what you do, but problems are arriving faster than you can solve them. The stress is following you home, and the results aren't what you know you're capable of. Holding course and speed and hoping it gets better rarely fixes it. Coaching helps you find what's driving the pressure, at work and outside it, and build a plan you can sustain.</p>
              <a href="/executive-coaching" className="door-link">Executive Coaching →</a>
            </div>

            <div className="door-card">
              <h2 className="door-headline">You're leading people, and it's harder than you expected.</h2>
              <p className="door-body">Maybe you were just promoted over last week's peers. Maybe your team has stalled and you can't see why. You don't need another seminar. You need help with the real situation in front of you. Together, we'll build the skills and habits that get your team moving and help you lead with confidence.</p>
              <a href="/leader-development" className="door-link">Leader Development →</a>
            </div>

            <div className="door-card">
              <h2 className="door-headline">Someone on your team is struggling, and you'd rather invest than replace.</h2>
              <p className="door-body">A talented leader is in over their head: a new role, a culture mismatch, or something outside work pulling at them. A performance plan documents the problem but rarely solves it, and replacing a leader is slow and expensive. Coaching gives them real support in a confidential setting, working toward outcomes you help define.</p>
              <a href="/for-organizations" className="door-link">For Organizations →</a>
            </div>

          </div>
        </div>
      </section>

      {/* ===== 3. HOW IT WORKS ===== */}
      <section className="how-it-works">
        <div className="how-it-works-inner">
          <div>
            <div className="how-label">How it works</div>
            <h2 className="how-headline">One Clear Path</h2>
          </div>
          <div className="how-steps">
            <div className="how-step">
              <div className="how-step-num">01</div>
              <p className="how-step-text">Book a free 15-minute call. Tell me what's hardest right now.</p>
            </div>
            <div className="how-step">
              <div className="how-step-num">02</div>
              <p className="how-step-text">Get clear on where you want to go. We define success in your own terms.</p>
            </div>
            <div className="how-step">
              <div className="how-step-num">03</div>
              <p className="how-step-text">Work the plan with a coach beside you. You make the decisions, and I help you stay on track.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. WHAT'S POSSIBLE ===== */}
      <section className="whats-possible">
        <div className="whats-possible-inner">
          <p className="whats-possible-text">You make the hard calls with confidence. Your team trusts where you're taking them. And success at work stops costing you everything else. You're more present for the parts of your life that matter most.</p>
        </div>
      </section>

      {/* ===== 5. PHILOSOPHY ===== */}
      <section className="philosophy">
        <div className="philosophy-inner">
          <h2 className="philosophy-headline">You're not one person at work and another at home. Your development shouldn't treat you that way.</h2>
          <div className="philosophy-right">
            <p className="philosophy-pull">When we address the whole person — every dimension of who you are and what you're carrying — something unlocks. Potential you didn't know you had. Clarity you couldn't find alone. A transformative path forward that lasts.</p>
            <a href="/the-8-pillars" className="philosophy-link">Explore the 8 Pillars →</a>
          </div>
        </div>
      </section>

      {/* ===== 6. TESTIMONIAL ===== */}
      {/*
        PLACEHOLDER: Confirm Linnea's exact title wording before go-live.
        Hold space here for 2–3 more testimonials when approved.
      */}
      <section className="testimonial-section">
        <div className="testimonial-inner">
          <div className="testimonial-label">What clients say</div>
          <p className="testimonial-quote">When I started coaching, I was looking to become a stronger leader. What I found was far more transformative. Through our work together, I learned that empathy and accountability are not opposites — and that much of my identity and self-worth had become tied to my work in ways that weren't serving me. Coaching helped me redefine success to include my relationships, health, and personal happiness — not just professional achievement. Rather than giving me answers, John consistently asked the right questions, helping me uncover insights that felt authentic and sustainable. I leave with greater confidence, stronger boundaries, and a much deeper understanding of the value I bring as both a leader and a person.</p>
          <div className="testimonial-attribution">
            <div className="testimonial-name">Linnea Landowski</div>
            <div className="testimonial-role">Director of Camping Programs, Scouting America, Western Los Angeles County Council</div>
          </div>
        </div>
      </section>

      {/* ===== 7. ABOUT STRIP ===== */}
      <section className="about-strip">
        <div className="about-strip-photo">
          {/* PLACEHOLDER: Replace with new portrait when John provides photos */}
          <img src="/images/john-mccracken-anchor-portrait.jpg" alt="John McCracken" />
        </div>
        <div className="about-strip-content">
          <div className="about-strip-label">Your guide</div>
          <p className="about-strip-body">I know what it's like to carry more than the job, and to hit a setback you didn't see coming. I spent 30 years leading in the Navy and seven as a senior civilian at the Pentagon learning how people recover and grow. Now I help leaders do it faster and better than I did.</p>
          <div className="about-strip-credentials">CAPT, USN (Ret.) | EMBA | ACC (ICF) | DoD Certified Executive Coach</div>
          <a href="/about" className="about-link">Read my story →</a>
        </div>
      </section>

      {/* ===== 8. CREDIBILITY STRIP ===== */}
      <section className="credibility">
        <div className="credibility-inner">
          <div>
            <h2 className="credibility-headline">Research-grounded. Experience-tested.</h2>
            <p className="credibility-body">The coaching and programs at Beyond the Horizon draw on peer-reviewed research on human flourishing — the same science behind the U.S. Army's resilience programs.</p>
          </div>
          <div className="badges-list">
            {[
              { main: 'ACC', detail: 'International Coaching Federation' },
              { main: 'DoD Certified Executive Coach', detail: '' },
              { main: 'LCOP Certificate', detail: 'American University / Heidrick & Struggles' },
            ].map((b, i) => (
              <div key={i} className="badge-row">
                <div className="badge-main">{b.main}</div>
                {b.detail && <div className="badge-detail">{b.detail}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 9. CLOSING CTA ===== */}
      <section className="closing-cta">
        <div className="closing-cta-inner">
          <h2 className="cta-headline">It starts with a single conversation.</h2>
          <div>
            <p className="cta-body">A free 15-minute call. No pitch, no pressure. Just a direct conversation about where you are, where you want to go, and whether we're the right fit to get you there.</p>
            {/* PLACEHOLDER: Replace with Microsoft Bookings URL when provided */}
            <button className="btn-gold" disabled aria-disabled="true">
              Schedule a Free 15-Minute Call
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
