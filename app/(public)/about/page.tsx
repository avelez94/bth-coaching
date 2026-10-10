'use client'

import { useState } from 'react'

const credCategories = [
  {
    label: 'Experience',
    entries: [
      { title: 'Commanding Officer and progressively senior leadership roles', org: 'U.S. Navy, 30 years' },
      { title: 'Director, Manpower and Human Capital Strategy', org: 'Department of the Navy' },
      { title: 'Director, Policy and Executive Services', org: 'Office of the Assistant to the Secretary of Defense for Public Affairs' },
      { title: 'Senior defense civilian', org: 'Department of the Navy and Office of the Secretary of Defense, 7 years' },
    ],
  },
  {
    label: 'Education',
    entries: [
      { title: 'Executive Master of Business Administration', org: 'Naval Postgraduate School' },
      { title: 'Master of Arts, National Security and Strategic Studies', org: 'Naval War College' },
      { title: 'Bachelor of Science, Geography', org: 'Old Dominion University' },
      { title: 'Leadership Coaching for Organizational Performance (LCOP) Certificate', org: 'American University / Heidrick & Struggles (ICF Level 2 accredited)' },
    ],
  },
  {
    label: 'Certifications',
    entries: [
      { title: 'Associate Certified Coach (ACC)', org: 'International Coaching Federation' },
      { title: 'DoD Certified Executive Coach', org: '' },
    ],
  },
]

export default function About() {
  const [activeCred, setActiveCred] = useState(0)
  const [credFading, setCredFading] = useState(false)

  function selectCred(i: number) {
    if (i === activeCred) return
    setCredFading(true)
    setTimeout(() => {
      setActiveCred(i)
      setCredFading(false)
    }, 175)
  }

  function handleCredKey(e: React.KeyboardEvent, i: number) {
    if (e.key === 'ArrowRight') { e.preventDefault(); selectCred(Math.min(i + 1, credCategories.length - 1)) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); selectCred(Math.max(i - 1, 0)) }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
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
        .btn-gold { background: var(--gold); color: var(--navy); }
        .btn-gold:hover { background: #b8911f; }

        /* ============================================================
           1. OPENING / HERO
           Ivory. New professional portrait right. Headline + subhead left.
        ============================================================ */
        .opening {
          background: var(--ivory);
          padding: 140px 72px 100px;
          min-height: 80vh;
          display: flex;
          align-items: flex-start;
        }
        .opening-inner {
          max-width: 1320px;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 360px;
          grid-template-rows: auto auto;
          gap: 0 72px;
          align-items: start;
        }
        .opening-name-block { grid-column: 1; grid-row: 1; padding-bottom: 48px; }
        .opening-name {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(18px, 1.8vw, 24px);
          font-weight: 400;
          color: var(--text-muted);
          letter-spacing: 0.01em;
          line-height: 1.1;
        }
        .opening-portrait-col { grid-column: 2; grid-row: 1 / 3; padding-top: 72px; }
        .opening-portrait {
          width: 100%;
          max-width: 360px;
          aspect-ratio: 3 / 4;
          object-fit: cover;
          object-position: center top;
          display: block;
        }
        .opening-statement { grid-column: 1; grid-row: 2; }
        .opening-lead {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(28px, 3.4vw, 46px);
          font-weight: 400;
          line-height: 1.15;
          color: var(--text);
          letter-spacing: -0.02em;
          margin-bottom: 20px;
          max-width: 680px;
        }
        .opening-subhead {
          font-size: 1rem;
          line-height: 1.82;
          color: var(--text-mid);
          max-width: 580px;
          font-weight: 300;
        }

        /* ============================================================
           2. STORY — four labeled sections in a single column
        ============================================================ */
        .story { background: var(--ivory-dark); padding: 120px 72px 80px; }
        .story-inner { max-width: 680px; margin: 0 auto; }

        .story-section { margin-bottom: 64px; }
        .story-section:last-child { margin-bottom: 0; }

        .story-section-label {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 20px;
        }
        .story-body {
          font-size: 0.97rem;
          line-height: 1.92;
          color: var(--text-mid);
          margin-bottom: 20px;
          font-weight: 300;
        }
        .story-body:last-child { margin-bottom: 0; }

        /* Award ceremony photo — after "Living the change" section */
        .story-photo-break { margin: 80px auto 0; max-width: 980px; line-height: 0; }
        .story-photo-img {
          width: 100%;
          height: auto;
          display: block;
          max-width: 980px;
          object-fit: cover;
          object-position: center top;
        }
        .story-photo-caption {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-style: italic;
          text-align: center;
          margin-top: 10px;
          font-weight: 300;
        }

        /* ============================================================
           3. BEYOND WORK — personal section
           Ivory. Two photos: cycling/swim left, beach with wife right.
        ============================================================ */
        .beyond { background: var(--ivory); padding: 100px 72px; border-top: 1px solid var(--rule); }
        .beyond-inner { max-width: 1100px; margin: 0 auto; }
        .beyond-section-label {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 48px;
        }
        .beyond-layout {
          display: grid;
          grid-template-columns: 5fr 7fr;
          gap: 72px;
          align-items: start;
        }
        .beyond-photos { display: flex; flex-direction: column; gap: 16px; }
        .beyond-photo {
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          display: block;
        }
        .beyond-body {
          font-size: 0.97rem;
          line-height: 1.92;
          color: var(--text-mid);
          margin-bottom: 20px;
          font-weight: 300;
        }
        .beyond-body:last-child { margin-bottom: 0; }

        /* ============================================================
           4. PULL QUOTE
           Slate. Large, bold. Exact v7 wording.
        ============================================================ */
        .pull-quote { background: var(--slate); padding: 100px 72px; }
        .pull-quote-inner { max-width: 820px; margin: 0 auto; }
        .pull-quote-text {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(22px, 2.8vw, 36px);
          font-weight: 400;
          line-height: 1.4;
          color: var(--ivory);
          letter-spacing: -0.01em;
        }

        /* ============================================================
           5. CREDENTIALS
           Ivory dark. Interactive editorial tab index.
        ============================================================ */
        .credentials { background: var(--ivory-dark); padding: 100px 72px; border-top: 1px solid var(--rule); }
        .credentials-inner { max-width: 1200px; margin: 0 auto; }

        .cred-selector {
          display: flex;
          gap: 0;
          border-bottom: 1px solid var(--rule);
          margin-bottom: 64px;
        }
        .cred-tab {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(20px, 2.2vw, 28px);
          font-weight: 400;
          color: var(--text-mid);
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          padding: 0 0 20px;
          margin-right: 52px;
          cursor: pointer;
          letter-spacing: -0.01em;
          line-height: 1.2;
          transition: color 0.18s;
          margin-bottom: -1px;
        }
        .cred-tab:last-child { margin-right: 0; }
        .cred-tab:hover { color: var(--text); }
        .cred-tab:focus-visible { outline: 2px solid var(--slate); outline-offset: 4px; }
        .cred-tab.active { color: var(--text); border-bottom: 2px solid var(--slate-mid); }

        .cred-panel { display: block; transition: opacity 0.175s ease; }
        .cred-panel.fading { opacity: 0; }
        .cred-panel.visible { opacity: 1; }

        .cred-entries-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0 48px;
        }
        .cred-entry-block { padding: 32px 0; border-top: 1px solid var(--rule); }
        .cred-entry-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(16px, 1.8vw, 22px);
          font-weight: 400;
          color: var(--text);
          line-height: 1.3;
          letter-spacing: -0.01em;
          margin-bottom: 8px;
        }
        .cred-entry-org {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.6;
          font-weight: 300;
        }

        .cred-selector-desktop { display: flex; }
        .cred-selector-mobile { display: none; }
        .cred-accordion-item { border-bottom: 1px solid var(--rule); }
        .cred-accordion-item:first-child { border-top: 1px solid var(--rule); }
        .cred-accordion-trigger {
          width: 100%; background: none; border: none;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 0; cursor: pointer; text-align: left;
        }
        .cred-accordion-label {
          font-family: 'DM Serif Display', serif;
          font-size: 1.2rem; font-weight: 400;
          color: var(--text); letter-spacing: -0.01em;
        }
        .cred-accordion-chevron { font-size: 0.75rem; color: var(--text-muted); transition: transform 0.2s; }
        .cred-accordion-chevron.open { transform: rotate(180deg); }
        .cred-accordion-body { padding-bottom: 8px; }
        .cred-accordion-entry { padding: 20px 0; border-top: 1px solid var(--rule); }
        .cred-accordion-title { font-size: 0.93rem; color: var(--text); font-weight: 400; margin-bottom: 4px; line-height: 1.45; }
        .cred-accordion-org { font-size: 0.82rem; color: var(--text-muted); font-weight: 300; line-height: 1.5; }

        /* ============================================================
           6. HOW I COACH
           Ivory. Narrow, left-anchored.
        ============================================================ */
        .how-i-coach { background: var(--ivory); padding: 100px 72px; border-top: 1px solid var(--rule); }
        .how-i-coach-inner { max-width: 680px; }
        .how-i-coach-label {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 20px;
        }
        .how-i-coach-body {
          font-size: 0.97rem;
          line-height: 1.88;
          color: var(--text-mid);
          font-weight: 300;
        }

        /* ============================================================
           7. CLOSING
           Ivory dark. Centered. Closing line + gold CTA.
        ============================================================ */
        .closing { background: var(--ivory-dark); padding: 100px 72px; border-top: 1px solid var(--rule); }
        .closing-inner { max-width: 600px; margin: 0 auto; text-align: center; }
        .closing-lead {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(20px, 2.2vw, 28px);
          font-weight: 400;
          color: var(--text);
          line-height: 1.35;
          letter-spacing: -0.01em;
          margin-bottom: 36px;
        }

        /* ============================================================
           RESPONSIVE
        ============================================================ */
        @media (max-width: 1024px) {
          .opening { padding: 130px 48px 80px; min-height: unset; }
          .opening-inner { grid-template-columns: 1fr 280px; gap: 0 48px; }
          .opening-portrait-col { padding-top: 48px; }
          .story { padding: 100px 48px 80px; }
          .beyond { padding: 80px 48px; }
          .beyond-layout { grid-template-columns: 1fr; gap: 48px; }
          .beyond-photos { flex-direction: row; }
          .beyond-photo { aspect-ratio: 1 / 1; }
          .pull-quote { padding: 80px 48px; }
          .credentials { padding: 80px 48px; }
          .cred-entries-grid { grid-template-columns: 1fr; }
          .how-i-coach { padding: 80px 48px; }
          .closing { padding: 80px 48px; }
        }
        @media (max-width: 768px) {
          .opening-inner { grid-template-columns: 1fr; grid-template-rows: auto auto auto; }
          .opening-portrait-col { grid-column: 1; grid-row: 2; padding-top: 32px; padding-bottom: 32px; }
          .opening-portrait { max-width: 220px; }
          .opening-name-block { grid-row: 1; }
          .opening-statement { grid-column: 1; grid-row: 3; }
          .beyond-photos { flex-direction: column; }
          .cred-selector-desktop { display: none; }
          .cred-selector-mobile { display: block; }
        }
        @media (max-width: 640px) {
          .opening { padding: 120px 24px 64px; }
          .story { padding: 80px 24px 64px; }
          .beyond { padding: 64px 24px; }
          .pull-quote { padding: 64px 24px; }
          .credentials { padding: 64px 24px; }
          .how-i-coach { padding: 64px 24px; }
          .closing { padding: 64px 24px; }
        }
      ` }} />

      {/* ===== 1. OPENING / HERO ===== */}
      {/* Photo: new professional portrait (navy blazer, open collar) */}
      <section className="opening">
        <div className="opening-inner">
          <div className="opening-name-block">
            <div className="opening-name">John McCracken</div>
          </div>
          <div className="opening-portrait-col">
            <img
              src="/images/john-mccracken-blue-tie.jpg"
              alt="John McCracken"
              className="opening-portrait"
            />
          </div>
          <div className="opening-statement">
            <h1 className="opening-lead">I help leaders get clear and get results.</h1>
            <p className="opening-subhead">Thirty-seven years of leadership, the setbacks as well as the successes, and professional coach training, all focused on the results you want.</p>
          </div>
        </div>
      </section>

      {/* ===== 2. STORY ===== */}
      <section className="story">
        <div className="story-inner">

          <div className="story-section">
            <div className="story-section-label">Where I started</div>
            <p className="story-body">I spent 11 of my first 16 years in the Navy at sea, learning, leading, and performing in a demanding but rewarding environment. I went from Division Officer leading a team of 30, to Department Head leading an engineering team of 70, to Executive Officer running the day-to-day operations of a destroyer and her crew of about 350.</p>
          </div>

          <div className="story-section">
            <div className="story-section-label">What failure taught me that success couldn't</div>
            <p className="story-body">Up to that point, almost everything had gone to plan. Then came my greatest career setback: I wasn't selected for command at sea. And that setback wasn't private. Whether you are selected is visible to everyone, in the pins on your uniform or their absence.</p>
            <p className="story-body">It took me five years to get over it. I internalized it far more than I should have. I went on to have a great career, but it wasn't the career I had wanted.</p>
            <p className="story-body">If I'd been selected, I likely would have kept leading the way I always had, which wasn't always the kindest or most empowering way to lead. Not being selected forced a change I wouldn't have made on my own. I made more room for people's autonomy. I listened more than I directed. And I stopped holding people to my idea of perfection and started holding them to "good enough, done well."</p>
            <p className="story-body">While it took me years to get there, I want to help you move through your own version of this faster and more smoothly than I did — whether it's a career-altering setback or the everyday challenge of a hard meeting or a hard relationship.</p>
          </div>

          <div className="story-section">
            <div className="story-section-label">Living the change</div>
            <p className="story-body">I put my renewed perspective and skills to work when I took command of the largest unit of its type in the nation, and one of the most underperforming in the Naval Reserve. Morale was broken, performance was low, and everyone expected more of the same.</p>
            <p className="story-body">I knew something had to change, and it had to start with me. Not a new program or a reorganization plan — how I showed up. The questions I asked instead of the answers I gave. Honesty about what wasn't working, including my own leadership.</p>
            <p className="story-body">Within a year, that team was recognized as the region's #1 large Navy Operational Support Center. Not because I had the answers, but because I learned to lead differently.</p>
          </div>

        </div>

        {/* Photo: award ceremony — cropped tight on John and the presenter */}
        <div className="story-photo-break">
          <img
            src="/images/john-mccracken-navy-ceremony.jpg"
            alt=""
            aria-hidden="true"
            className="story-photo-img"
            style={{ objectPosition: 'center 20%' }}
          />
        </div>

        <div className="story-inner" style={{ marginTop: '80px' }}>
          <div className="story-section">
            <div className="story-section-label">After the Navy</div>
            <p className="story-body">After retiring, I joined a Navy command as a senior civilian, and then the Office of the Assistant to the Secretary of Defense for Public Affairs. I reconciled long-standing manpower problems, built human capital strategy, learned to lead as a civilian, and rebuilt a team the week COVID shut everything down. Along the way, I've spent seven years watching how large organizations develop their leaders, and where they fall short.</p>
            <p className="story-body">Leaving uniform was harder than I expected. Losing my community, my professional reputation, and my sense of who I was out of uniform was disorienting. I found my footing again by reconnecting with the values and practices that made me successful, and having a coach helped. That experience is part of why I coach. I want to help people grow, build resilience, recover quickly from setbacks, and become the person and the leader they know they can be.</p>
          </div>
        </div>
      </section>

      {/* ===== 3. BEYOND WORK ===== */}
      {/* Photos: cycling or open-water swim (left/top), beach photo with wife (right/bottom) */}
      <section className="beyond">
        <div className="beyond-inner">
          <div className="beyond-section-label">Beyond work</div>
          <div className="beyond-layout">
            <div className="beyond-photos">
              <img
                src="/images/john-mccracken-cycling.jpg"
                alt=""
                aria-hidden="true"
                className="beyond-photo"
              />
              <img
                src="/images/john-mccracken-beach.jpg"
                alt=""
                aria-hidden="true"
                className="beyond-photo"
              />
            </div>
            <div>
              <p className="beyond-body">I've been married for 36 years. I'm a father and a grandfather. And I'm a lifelong endurance athlete: marathons, Ironman races, years of running, cycling, and swimming. Last year, wear and tear meant I had to give up running. I didn't quit; I adjusted. I'm still competing on the bike and in the water.</p>
              <p className="beyond-body">That's the same thing I help clients do: when something changes that you didn't choose, find the path that still gets you where you want to go.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. PULL QUOTE ===== */}
      <section className="pull-quote">
        <div className="pull-quote-inner">
          <p className="pull-quote-text">When we address the whole person — every dimension of who you are and what you're carrying — something unlocks. Potential you didn't know you had. Clarity you couldn't find alone. A transformative path forward that lasts.</p>
        </div>
      </section>

      {/* ===== 5. CREDENTIALS ===== */}
      <section className="credentials">
        <div className="credentials-inner">

          <div style={{marginBottom: '48px'}}>
            <div style={{fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(24px, 2.8vw, 34px)', fontWeight: 400, color: 'var(--text)', letterSpacing: '-0.01em'}}>Preparation and credentials</div>
          </div>

          {/* Desktop: tab selector */}
          <div
            className="cred-selector cred-selector-desktop"
            role="tablist"
            aria-label="Credentials by category"
          >
            {credCategories.map((cat, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={activeCred === i}
                aria-controls="cred-panel"
                id={`cred-tab-${i}`}
                className={`cred-tab${activeCred === i ? ' active' : ''}`}
                onClick={() => selectCred(i)}
                onKeyDown={(e) => handleCredKey(e, i)}
                tabIndex={activeCred === i ? 0 : -1}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Desktop panel */}
          <div
            id="cred-panel"
            role="tabpanel"
            aria-labelledby={`cred-tab-${activeCred}`}
            className={`cred-panel cred-selector-desktop ${credFading ? 'fading' : 'visible'}`}
          >
            <div className="cred-entries-grid">
              {credCategories[activeCred].entries.map((entry, i) => (
                <div key={i} className="cred-entry-block">
                  <div className="cred-entry-title">{entry.title}</div>
                  {entry.org && <div className="cred-entry-org">{entry.org}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: accordion */}
          <div className="cred-selector-mobile">
            {credCategories.map((cat, i) => (
              <MobileAccordion key={i} cat={cat} />
            ))}
          </div>

        </div>
      </section>

      {/* ===== 6. HOW I COACH ===== */}
      <section className="how-i-coach">
        <div className="how-i-coach-inner">
          <div className="how-i-coach-label">How I coach</div>
          <p className="how-i-coach-body">My coaching follows International Coaching Federation methodology and ethics. It's client-centered and goal-focused, built on questions rather than prescriptions. You bring the situation; I help you see it clearly and decide what to do next.</p>
        </div>
      </section>

      {/* ===== 7. CLOSING ===== */}
      <section className="closing">
        <div className="closing-inner">
          <p className="closing-lead">You know what you want, or you have a sense of it. I help you define it, get there, and get back on course faster and better than I did.</p>
          <a href="/contact" className="btn btn-gold">Schedule a Free 15-Minute Call</a>
        </div>
      </section>
    </>
  )
}

function MobileAccordion({ cat }: { cat: typeof credCategories[0] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="cred-accordion-item">
      <button
        className="cred-accordion-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="cred-accordion-label">{cat.label}</span>
        <span className={`cred-accordion-chevron${open ? ' open' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="cred-accordion-body">
          {cat.entries.map((entry, i) => (
            <div key={i} className="cred-accordion-entry">
              <div className="cred-accordion-title">{entry.title}</div>
              {entry.org && <div className="cred-accordion-org">{entry.org}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}