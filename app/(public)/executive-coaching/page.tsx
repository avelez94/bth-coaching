'use client'

import { useState } from 'react'
import './executive-coaching.css'

// PLACEHOLDER: Confirm the executive-presence client is comfortable
// with the anonymized story in "What this looks like in practice"
// before this page goes live. Copy is from v7 exactly.

const workAreas = [
  {
    num: '01',
    title: 'Leading through others.',
    body: 'Moving from doing the work yourself to building a team that does it well, without lowering your standards.',
  },
  {
    num: '02',
    title: 'Presence and influence.',
    body: 'How you show up in hard conversations and high-stakes moments, including the patterns that are hardest to see from the inside.',
  },
  {
    num: '03',
    title: 'Sustainable performance.',
    body: "Finding what's draining you, at work and outside it, and building a foundation that doesn't depend on heroic effort.",
  },
  {
    num: '04',
    title: 'Whatever is most pressing.',
    body: "A career decision, a difficult relationship, the weight of carrying too much for too long. If it affects how you lead, it's in scope.",
  },
]

const engagementDetails = [
  '12 one-hour sessions, every other week',
  '8 Pillars whole-person assessment at the start',
  'Commitments at each session that you define',
  'Accountability between sessions by email or text',
  "Final session: reflection, integration, and a plan for what's next",
]

export default function ExecutiveCoaching() {
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)

  function select(i: number) {
    if (i === active) return
    setFading(true)
    setTimeout(() => { setActive(i); setFading(false) }, 200)
  }

  function handleKey(e: React.KeyboardEvent, i: number) {
    if (e.key === 'ArrowDown') { e.preventDefault(); select(Math.min(i + 1, workAreas.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); select(Math.max(i - 1, 0)) }
  }

  return (
    <>
      {/* styles in executive-coaching.css */}


      {/* ===== 1. HERO ===== */}
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-context">For Leaders</p>
          <h1 className="hero-headline">When the challenges are outpacing the solutions.</h1>
          <p className="hero-subhead">You're not getting the results you want from yourself or your team, and working harder isn't closing the gap.</p>
          <div className="hero-cta">
            <a href="/contact" className="btn btn-gold">Schedule a Free 15-Minute Call</a>
          </div>
        </div>
      </section>

      {/* ===== 2. SOUND FAMILIAR ===== */}
      <section className="familiar">
        <div className="familiar-inner">
          <h2 className="familiar-headline">Sound familiar?</h2>
          <p className="familiar-body">You've earned your role. But the challenges are complex, the environment is ambiguous, the pace is unrelenting, and the approach that got you here isn't working the way it used to. You're thinking about work at dinner. The team isn't moving the way you need it to. Goals you care about keep getting pushed to next quarter.</p>
          <p className="familiar-body">Most leaders respond by working harder. Holding course and speed rarely fixes it, and the cost usually shows up somewhere you can't afford: your health, your family, your team's trust in you.</p>
          <p className="familiar-body">The challenge in front of you is rarely the whole story. That's where we start.</p>
        </div>
      </section>

      {/* ===== 3. WHAT THIS LOOKS LIKE IN PRACTICE ===== */}
      {/* PLACEHOLDER: Confirm executive-presence client is comfortable
          with this anonymized story before page goes live. Copy is from v7 exactly. */}
      <section className="client-story">
        <div className="client-story-inner">
          <h2 className="story-heading">What this looks like in practice</h2>
          <div className="story-text">
            <p>A leader came to me to strengthen his executive presence. As we worked, the real challenge came into focus. His new role required him to lead through influence across the organization, without clear authority, while he also wanted to be more present for a growing family. He shifted from chasing outcomes to building a process and drew on experience he'd been underusing. He also defined what being present at home meant to him and built a plan to get there.</p>
          </div>
        </div>
      </section>

      {/* ===== 4. WHAT WE WORK ON ===== */}
      <section className="work-on">
        <div className="work-on-inner">
          <h2 className="work-on-heading">What we work on.</h2>

          {/* Desktop: editorial index + panel */}
          <div
            className="work-selector work-selector-desktop"
            role="tablist"
            aria-label="What we work on"
          >
            <div className="work-index">
              {workAreas.map((area, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={active === i}
                  aria-controls="work-panel"
                  id={`work-tab-${i}`}
                  className={`work-index-btn${active === i ? ' active' : ''}`}
                  onClick={() => select(i)}
                  onKeyDown={(e) => handleKey(e, i)}
                  tabIndex={active === i ? 0 : -1}
                >
                  <span className="work-index-num">{area.num}</span>
                  <span className="work-index-title">{area.title}</span>
                </button>
              ))}
            </div>
            <div
              id="work-panel"
              role="tabpanel"
              aria-labelledby={`work-tab-${active}`}
              aria-live="polite"
              className="work-panel"
            >
              <div className={`work-panel-content ${fading ? 'fading' : 'visible'}`}>
                <div className="work-panel-num">{workAreas[active].num}</div>
                <div className="work-panel-title">{workAreas[active].title}</div>
                <p className="work-panel-body">{workAreas[active].body}</p>
              </div>
            </div>
          </div>

          {/* Mobile: static stacked list */}
          <div className="work-mobile-list">
            {workAreas.map((area, i) => (
              <div key={i} className="work-mobile-item">
                <div className="work-mobile-num">{area.num}</div>
                <div className="work-mobile-title">{area.title}</div>
                <p className="work-mobile-body">{area.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5. HOW IT WORKS ===== */}
      <section className="how-it-works">
        <div className="how-inner">
          <h2 className="how-heading">How it works.</h2>
          <p className="how-body-1">You bring what matters most right now, and we work through it together. I'll ask questions that challenge your assumptions and open up options you can't see from inside the situation. You leave every session with a commitment you defined and a next step you chose.</p>
          <p className="how-body-2">This is your agenda. I bring the structure and the questions.</p>
        </div>
      </section>

      {/* ===== 6. WHAT'S POSSIBLE ===== */}
      <section className="possible">
        <div className="possible-inner">
          <h2 className="possible-heading">What's possible.</h2>
          <p className="possible-body">Your team brings you solutions, not problems. You make the hard calls without replaying them at 2 a.m. You're home for dinner, and you're actually present.</p>
        </div>
      </section>

      {/* ===== 7. THE ENGAGEMENT ===== */}
      <section className="engagement">
        <div className="engagement-inner">
          <div>
            <p className="engagement-context">The engagement</p>
            <h2 className="engagement-headline">Six months. Twelve sessions. Your agenda.</h2>
            <a href="/contact" className="btn btn-gold">Schedule a Free 15-Minute Call</a>
          </div>
          <div>
            <div className="engagement-details">
              {engagementDetails.map((item, i) => (
                <div key={i} className="engagement-detail-item">{item}</div>
              ))}
            </div>
            <div className="investment-block">
              <div className="investment-label">Investment</div>
              <div className="investment-amount">$3,600</div>
            </div>
          </div>
        </div>
        <div className="sponsor-link">
          Sponsoring a leader? If your organization is investing in developing one of its leaders, see how organizational engagements work. <a href="/for-organizations">For Organizations →</a>
        </div>
      </section>
    </>
  )
}