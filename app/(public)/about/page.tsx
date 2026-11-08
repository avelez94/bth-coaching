'use client'

import { useState } from 'react'
import Image from 'next/image'
import './about.css'

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
      { title: 'LCOP Level 2', org: 'American University / Heidrick & Struggles', credUrl: 'https://www.parchment.com/lp/award/fc8113c5-7442-4408-b64e-ff05a7b99774' },
      { title: 'DoD Coach Training Program (ICF-accredited), graduate', org: '' },
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
      {/* ===== 1. OPENING / HERO ===== */}
      <section className="opening">
        <div className="opening-inner">
          <div className="opening-text-col">
            <div className="opening-name-block">
              <div className="opening-name">John McCracken</div>
            </div>
            <div className="opening-statement">
              <h1 className="opening-lead">I help leaders gain clarity and get results, in every part of their lives.</h1>
              <p className="opening-subhead">Thirty-seven years of leadership, the setbacks as well as the successes, and professional coach training, all focused on the results you want.</p>
            </div>
          </div>
          <div className="opening-portrait-col">
            <img
              src="/images/john-mccracken-about-hero.jpeg"
              alt="John McCracken in a navy blazer in front of the Navy Memorial wave sculpture"
              className="opening-portrait"
            />
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
            <p className="story-body">I put my renewed perspective and skills to work when I took command ashore of NOSC Washington, the largest Navy Operational Support Center in the nation, and one of the most underperforming in the Naval Reserve. Morale was broken, performance was low, and everyone expected more of the same.</p>
            <p className="story-body">I knew something had to change, and it had to start with me. Not a new program or a reorganization plan — how I showed up. The questions I asked instead of the answers I gave. Honesty about what wasn't working, including my own leadership.</p>
            <p className="story-body">Within a year, that team was recognized as the region's #1 large Navy Operational Support Center. Not because I had the answers, but because I learned to lead differently.</p>
          </div>

        </div>

        {/* Photo: Living the Change ceremony */}
        <div className="story-portrait-break">
          <figure className="story-portrait-figure">
            <img
              src="/images/12Livingthechange.jpeg"
              alt="John McCracken reenlisting the Command Master Chief of NOSC Washington"
              className="story-portrait-img"
            />
            <figcaption className="story-portrait-caption">Reenlisting NOSC Washington&apos;s Command Master Chief</figcaption>
          </figure>
        </div>

        <div className="story-inner" style={{ marginTop: '80px' }}>
          <div className="story-section">
            <div className="story-section-label">After the Navy</div>
            <p className="story-body">After retiring, I joined a Navy command as a senior civilian, and then the Office of the Assistant to the Secretary of Defense for Public Affairs. I reconciled long-standing manpower problems, built human capital strategy, learned to lead as a civilian, and rebuilt a team the week COVID shut everything down. Along the way, I've spent seven years watching how large organizations develop their leaders, and where they fall short.</p>
            <p className="story-body">Leaving uniform was harder than I expected. Losing my community, my professional reputation, and my sense of who I was out of uniform was disorienting. I found my footing again by reconnecting with the values and practices that made me successful, and having a coach helped. That experience is part of why I coach. I want to help people grow, build resilience, recover quickly from setbacks, and become the person and the leader they know they can be.</p>
          </div>
        </div>

        {/* Photo: After the Navy — square container, preserves Fair Winds sign */}
        <div className="story-square-break">
          <figure className="story-portrait-figure">
            <img
              src="/images/13AftertheNavy.jpeg"
              alt="John McCracken leaving Joint Base Andrews after completing command of NOSC Washington"
              className="story-square-img"
            />
            <figcaption className="story-portrait-caption">Leaving Joint Base Andrews after completing command of NOSC Washington.</figcaption>
          </figure>
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
                src="/images/14Beyondthework.jpeg"
                alt="John McCracken on a morning bike ride on a coastal road"
                className="beyond-photo beyond-photo-landscape"
              />
              <div className="beyond-photos-row">
                <img
                  src="/images/15Beyndthework.jpeg"
                  alt="John McCracken racing on an indoor cycling course"
                  className="beyond-photo-portrait"
                />
                <img
                  src="/images/17Beyondthework.jpeg"
                  alt="John McCracken and his wife under the cherry blossoms with the Washington Monument behind them"
                  className="beyond-photo-landscape-sm"
                />
              </div>
            </div>
            <div>
              <p className="beyond-body">I&apos;ve been married for more than 35 years. I&apos;m a father and a grandfather. And I&apos;m a lifelong endurance athlete: marathons, Ironman races, years of running, cycling, and swimming. Last year, wear and tear meant I had to give up running. I didn't quit; I adjusted. I'm still competing on the bike and in the water.</p>
              <p className="beyond-body">That's the same thing I help clients do: when something changes that you didn't choose, find the path that still gets you where you want to go.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. PULL QUOTE ===== */}
      <section className="pull-quote">
        <div className="pull-quote-inner">
          <p className="why-this-works-label">Why this works</p>
          <p className="pull-quote-text">When we address the whole person — every dimension of who you are and what you&apos;re carrying — something unlocks. Potential you didn&apos;t know you had. Clarity you couldn&apos;t find alone. A transformative path forward that lasts.</p>
        </div>
      </section>

      {/* ===== 5. CREDENTIALS ===== */}
      <section className="credentials">
        <div className="credentials-inner">

          <div style={{marginBottom: '48px'}}>
            <div style={{fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(24px, 2.8vw, 34px)', fontWeight: 400, color: 'var(--text)', letterSpacing: '-0.01em'}}>Preparation and credentials</div>
          </div>
          {/* ICF credential badges */}
          <div className="cred-badge-row">
            <Image
              src="/images/icf-acc-badge.png"
              alt="ICF Associate Certified Coach (ACC) credential badge"
              width={120}
              height={120}
              className="cred-acc-badge"
            />
            <Image
              src="/images/icf-member-badge.png"
              alt="ICF Member badge"
              width={120}
              height={120}
              className="cred-member-badge"
            />
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
                  <div className="cred-entry-title">
                    {'credUrl' in entry && entry.credUrl
                      ? <a href={entry.credUrl} target="_blank" rel="noopener noreferrer" className="cred-entry-link">{entry.title}</a>
                      : entry.title}
                  </div>
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
          <p className="how-i-coach-body">My coaching follows International Coaching Federation methodology and ethics. It&apos;s client-centered and goal-focused, built on questions rather than prescriptions. You bring the situation; I help you see it clearly and decide what to do next.</p>
          <p className="how-i-coach-body">I use the 8 Pillars of Whole Person Leadership as a framework, not a script. The pillars give us a shared language for what you&apos;re working on, and a way to see how every part of who you are — at work, at home, in how you think about yourself — connects to your results.</p>
          <p className="how-i-coach-body">Most of my clients come in focused on one problem. By the time we&apos;re done, they&apos;ve solved it and learned something larger: how they lead, how they live, and how those two things are the same.</p>
          {/* PENDING: replace span with <a href="/the-8-pillars"> when page is confirmed ready */}
          <a href="/the-8-pillars" className="how-i-coach-link">Explore the 8 Pillars →</a>
        </div>
      </section>

      {/* ===== 7. CLOSING ===== */}
      <section className="closing">
        <div className="closing-inner">
          <p className="closing-statement">I believe setbacks don&apos;t define people; what they do next does. Thirty-seven years of leading, and sometimes failing, taught me that lasting results come from developing the whole person, not just the work version of who they are. If that&apos;s the growth you want for yourself or your team, let&apos;s take 15 minutes to chart a path forward.</p>
          <img
            src="/images/john-mccracken-signature.png"
            alt="John McCracken signature"
            className="closing-signature"
            aria-hidden="true"
          />
          {/* PENDING MICROSOFT BOOKINGS URL */}
          <button className="btn btn-gold" disabled aria-disabled="true" style={{marginTop: '32px', opacity: 0.72, cursor: 'not-allowed'}}>
            Schedule a Free 15-Minute Call
          </button>
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
              <div className="cred-accordion-title">
                {'credUrl' in entry && entry.credUrl
                  ? <a href={entry.credUrl} target="_blank" rel="noopener noreferrer" className="cred-entry-link">{entry.title}</a>
                  : entry.title}
              </div>
              {entry.org && <div className="cred-accordion-org">{entry.org}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}