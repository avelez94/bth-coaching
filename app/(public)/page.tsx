'use client'

import { useState } from 'react'

// PLACEHOLDER: Replace button hrefs with Microsoft Bookings URL when provided
const BOOKINGS_URL = '#'

export default function Home() {
  const [scheduleDisabled] = useState(true)

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
          --navy: #0D1B2A;
          --gold: #C9A23A;
          --gold-hover: #b5902f;
          --text: #1C2B3A;
          --text-mid: #3D5166;
          --text-muted: #6B7A8D;
          --rule: rgba(28,43,58,0.1);
          --rule-strong: rgba(28,43,58,0.28);
          --rule-slate: rgba(247,244,237,0.12);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: var(--ivory); color: var(--text); font-family: 'Inter', sans-serif; font-weight: 300; overflow-x: hidden; -webkit-font-smoothing: antialiased; }

        /* ============================================================
           1. HERO
        ============================================================ */
        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: var(--ivory);
          position: relative;
        }
        .hero-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 140px 72px 80px 96px;
          position: relative;
          z-index: 2;
        }
        .hero-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(36px, 3.8vw, 52px);
          font-weight: 400;
          line-height: 1.15;
          color: var(--text);
          margin-bottom: 24px;
          letter-spacing: -0.02em;
          max-width: 500px;
        }
        .hero-subhead {
          font-size: 0.97rem;
          line-height: 1.82;
          color: var(--text-mid);
          margin-bottom: 36px;
          max-width: 440px;
          font-weight: 300;
        }
        .hero-cta-stack {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 14px;
        }
        /* PLACEHOLDER: Replace with Microsoft Bookings URL when provided */
        .btn-gold {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 14px 30px;
          background: var(--gold);
          color: var(--navy);
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          font-weight: 500;
          text-decoration: none;
          border: none;
          cursor: not-allowed;
          opacity: 0.72;
        }
        .hero-org-link {
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 300;
        }
        .hero-org-link a {
          color: var(--text-mid);
          text-decoration: none;
          border-bottom: 1px solid var(--rule-strong);
          transition: color 0.2s, border-color 0.2s;
        }
        .hero-org-link a:hover {
          color: var(--gold);
          border-bottom-color: var(--gold);
        }
        .hero-right {
          position: relative;
          background: var(--slate-mid);
          overflow: hidden;
        }
        .hero-photo-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }
        .hero-photo-fade {
          position: absolute; inset: 0; z-index: 2;
          background: linear-gradient(
            to right,
            #F7F4ED 0%,
            rgba(247,244,237,0.6) 18%,
            rgba(247,244,237,0) 42%
          );
        }

        /* ============================================================
           2. THREE DOORS — "Which sounds like you?"
        ============================================================ */
        .doors {
          background: var(--ivory-dark);
          padding: 100px 72px;
        }
        .doors-inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .doors-label {
          font-size: 0.72rem;
          color: var(--slate-mid);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 48px;
          font-weight: 500;
        }
        .doors-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--rule-strong);
          border: 1px solid var(--rule-strong);
        }
        .door-card {
          background: var(--ivory);
          padding: 40px 36px 44px;
          display: flex;
          flex-direction: column;
        }
        .door-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(18px, 1.8vw, 22px);
          font-weight: 400;
          color: var(--text);
          line-height: 1.25;
          letter-spacing: -0.01em;
          margin-bottom: 16px;
        }
        .door-body {
          font-size: 0.88rem;
          line-height: 1.78;
          color: var(--text-mid);
          font-weight: 300;
          flex: 1;
          margin-bottom: 24px;
        }
        .door-link {
          font-size: 0.78rem;
          color: var(--slate-mid);
          text-decoration: none;
          letter-spacing: 0.04em;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: gap 0.2s;
        }
        .door-link:hover { gap: 14px; }

        /* ============================================================
           3. HOW IT WORKS — One Clear Path
        ============================================================ */
        .how-it-works {
          background: var(--ivory);
          padding: 100px 72px;
          border-top: 1px solid var(--rule);
        }
        .how-it-works-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 5fr 7fr;
          gap: 80px;
          align-items: start;
        }
        .how-label {
          font-size: 0.72rem;
          color: var(--slate-mid);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 16px;
          font-weight: 500;
        }
        .how-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(28px, 3vw, 40px);
          font-weight: 400;
          color: var(--text);
          letter-spacing: -0.01em;
          line-height: 1.2;
        }
        .how-steps {
          display: flex;
          flex-direction: column;
          gap: 0;
          padding-top: 8px;
        }
        .how-step {
          display: grid;
          grid-template-columns: 32px 1fr;
          gap: 20px;
          padding: 24px 0;
          border-bottom: 1px solid var(--rule);
          align-items: start;
        }
        .how-step:first-child { border-top: 1px solid var(--rule); }
        .how-step-num {
          font-size: 0.72rem;
          color: var(--gold);
          font-weight: 500;
          letter-spacing: 0.04em;
          padding-top: 3px;
        }
        .how-step-text {
          font-size: 0.95rem;
          line-height: 1.75;
          color: var(--text-mid);
          font-weight: 300;
        }

        /* ============================================================
           4. WHAT'S POSSIBLE
        ============================================================ */
        .whats-possible {
          background: var(--ivory-dark);
          padding: 80px 72px;
          border-top: 1px solid var(--rule);
        }
        .whats-possible-inner {
          max-width: 820px;
          margin: 0 auto;
        }
        .whats-possible-text {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(20px, 2.2vw, 28px);
          font-weight: 400;
          line-height: 1.45;
          color: var(--text);
          letter-spacing: -0.01em;
        }

        /* ============================================================
           5. PHILOSOPHY
        ============================================================ */
        .philosophy {
          background: var(--slate);
          padding: 100px 72px;
        }
        .philosophy-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 5fr 7fr;
          gap: 80px;
          align-items: start;
        }
        .philosophy-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.8vw, 36px);
          font-weight: 400;
          line-height: 1.28;
          color: var(--ivory);
          letter-spacing: -0.01em;
        }
        .philosophy-right { padding-top: 8px; }
        .philosophy-pull {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(18px, 2vw, 24px);
          font-weight: 400;
          line-height: 1.55;
          color: rgba(247,244,237,0.92);
          letter-spacing: -0.01em;
          margin-bottom: 36px;
        }
        .philosophy-link {
          font-size: 0.78rem;
          color: var(--gold);
          text-decoration: none;
          letter-spacing: 0.06em;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: gap 0.2s;
        }
        .philosophy-link:hover { gap: 14px; }

        /* ============================================================
           6. TESTIMONIAL
        ============================================================ */
        .testimonial-section {
          background: var(--ivory-dark);
          padding: 100px 72px;
          border-top: 1px solid var(--rule);
        }
        .testimonial-inner {
          max-width: 860px;
          margin: 0 auto;
        }
        .testimonial-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 48px;
          font-weight: 400;
        }
        .testimonial-quote {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(17px, 1.8vw, 21px);
          font-weight: 400;
          line-height: 1.62;
          color: var(--text);
          letter-spacing: -0.01em;
          margin-bottom: 36px;
        }
        .testimonial-quote::before { content: '\201C'; }
        .testimonial-quote::after  { content: '\201D'; }
        .testimonial-attribution {
          padding-top: 24px;
          border-top: 1px solid var(--rule);
        }
        .testimonial-name {
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 4px;
        }
        .testimonial-role {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 300;
          line-height: 1.5;
        }

        /* ============================================================
           7. ABOUT STRIP
        ============================================================ */
        .about-strip {
          background: var(--ivory);
          display: grid;
          grid-template-columns: 7fr 5fr;
          border-top: 1px solid var(--rule);
        }
        .about-strip-photo {
          position: relative;
          overflow: hidden;
          background: var(--slate-mid);
          min-height: 520px;
        }
        .about-strip-photo img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }
        .about-strip-content {
          padding: 72px 64px 72px 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .about-strip-label {
          font-size: 0.72rem;
          color: var(--slate-mid);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 20px;
          font-weight: 500;
        }
        .about-strip-body {
          font-size: 0.97rem;
          line-height: 1.85;
          color: var(--text-mid);
          font-weight: 300;
          margin-bottom: 28px;
        }
        .about-strip-credentials {
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.8;
          padding: 20px 0;
          margin-bottom: 28px;
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
          font-weight: 400;
        }
        .about-link {
          font-size: 0.78rem;
          color: var(--slate-mid);
          text-decoration: none;
          letter-spacing: 0.04em;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: gap 0.2s;
          align-self: flex-start;
        }
        .about-link:hover { gap: 14px; }

        /* ============================================================
           8. CREDIBILITY STRIP
        ============================================================ */
        .credibility {
          background: var(--ivory-dark);
          padding: 100px 72px;
          border-top: 1px solid var(--rule);
        }
        .credibility-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }
        .credibility-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 2.8vw, 34px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 24px;
          letter-spacing: -0.01em;
          line-height: 1.25;
        }
        .credibility-body {
          font-size: 0.93rem;
          line-height: 1.85;
          color: var(--text-mid);
          font-weight: 300;
        }
        .badges-list {
          display: flex;
          flex-direction: column;
        }
        .badge-row {
          padding: 20px 0;
          border-top: 1px solid var(--rule);
        }
        .badge-row:last-child { border-bottom: 1px solid var(--rule); }
        .badge-main {
          font-family: 'DM Serif Display', serif;
          font-size: 1.1rem;
          font-weight: 400;
          color: var(--slate-mid);
          margin-bottom: 4px;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }
        .badge-detail {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.5;
          font-weight: 300;
        }

        /* ============================================================
           9. CLOSING CTA
        ============================================================ */
        .closing-cta {
          background: var(--navy);
          padding: 100px 72px;
        }
        .closing-cta-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 5fr 7fr;
          gap: 80px;
          align-items: center;
        }
        .cta-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(28px, 3.4vw, 46px);
          font-weight: 400;
          line-height: 1.15;
          color: var(--gold);
          letter-spacing: -0.01em;
        }
        .cta-body {
          font-size: 0.97rem;
          line-height: 1.85;
          color: rgba(247,244,237,0.72);
          margin-bottom: 32px;
          font-weight: 300;
        }

        /* ============================================================
           RESPONSIVE
        ============================================================ */
        @media (max-width: 1024px) {
          .hero { grid-template-columns: 1fr; min-height: unset; }
          .hero-left { padding: 130px 48px 60px; }
          .hero-right { min-height: 460px; }
          .doors { padding: 80px 48px; }
          .doors-grid { grid-template-columns: 1fr; }
          .how-it-works { padding: 80px 48px; }
          .how-it-works-inner { grid-template-columns: 1fr; gap: 40px; }
          .whats-possible { padding: 64px 48px; }
          .philosophy { padding: 80px 48px; }
          .philosophy-inner { grid-template-columns: 1fr; gap: 40px; }
          .testimonial-section { padding: 80px 48px; }
          .about-strip { grid-template-columns: 1fr; }
          .about-strip-photo { min-height: 400px; }
          .about-strip-content { padding: 60px 48px; }
          .credibility { padding: 80px 48px; }
          .credibility-inner { grid-template-columns: 1fr; gap: 48px; }
          .closing-cta { padding: 80px 48px; }
          .closing-cta-inner { grid-template-columns: 1fr; gap: 40px; }
        }

        @media (max-width: 640px) {
          .hero-left { padding: 110px 24px 48px; }
          .hero-headline { font-size: clamp(30px, 8vw, 42px); }
          .doors { padding: 64px 24px; }
          .door-card { padding: 32px 24px 36px; }
          .how-it-works { padding: 64px 24px; }
          .whats-possible { padding: 56px 24px; }
          .philosophy { padding: 64px 24px; }
          .testimonial-section { padding: 64px 24px; }
          .about-strip-content { padding: 48px 24px; }
          .credibility { padding: 64px 24px; }
          .closing-cta { padding: 64px 24px; }
        }
      `}</style>

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
              { main: 'LCOP', detail: 'Leadership Coaching and Organizational Performance — American University / Heidrick & Struggles' },
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
