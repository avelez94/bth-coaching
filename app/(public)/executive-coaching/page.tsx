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
    title: 'Whole-life integration.',
    body: "Your work, health, family, and finances aren't separate problems. We look at how they affect each other, and build a foundation that doesn't depend on heroic effort.",
  },
  {
    num: '04',
    title: 'Whatever is most pressing.',
    body: "A career decision, a difficult relationship, the weight of carrying too much for too long. If it affects how you lead, it's in scope.",
  },
]

// engagement details rendered inline to allow link in first item


export default function ExecutiveCoaching() {
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
            {/* PENDING MICROSOFT BOOKINGS URL */}
            <button className="btn btn-gold" disabled aria-disabled="true" style={{opacity: 0.72, cursor: 'not-allowed'}}>
              Schedule a Free 15-Minute Call
            </button>
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

      {/* ===== IMAGE BREAK ===== */}
      <div className="ec-photo-banner">
        <img
          src="/images/5Hero.jpeg"
          alt="John McCracken"
          className="ec-photo-banner-img"
        />
      </div>

      {/* ===== 3. WHAT THIS LOOKS LIKE IN PRACTICE ===== */}
      {/* PLACEHOLDER: Confirm executive-presence client is comfortable
          with this anonymized story before page goes live. Copy is from v7 exactly. */}
      <section className="client-story">
        <div className="client-story-inner">
          <h2 className="story-heading">What this looks like in practice</h2>
          <div className="story-text">
            <p>A leader came to me to strengthen his executive presence. As we worked, the real challenge came into focus. His new role required him to lead through influence across the organization, without clear authority, while he also wanted to be more present for a growing family. He shifted from chasing outcomes to building a process and drew on experience he&apos;d been underusing. He also defined what being present at home meant to him and built a plan to get there.</p>
            <p className="story-attribution">Senior leader, new cross-organizational role.</p>
          </div>
        </div>
      </section>

      {/* ===== 4. WHAT WE WORK ON ===== */}
      <section className="work-on">
        <div className="work-on-inner">
          <h2 className="work-on-heading">What we work on</h2>

          {/* All four areas shown at once */}
          <div className="work-list">
            {workAreas.map((area, i) => (
              <div key={i} className="work-list-item">
                <div className="work-list-num">{area.num}</div>
                <div className="work-list-title">{area.title}</div>
                <p className="work-list-body">{area.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5. HOW IT WORKS ===== */}
      <section className="how-it-works">
        <div className="how-inner">
          <h2 className="how-heading">How it works</h2>
          <p className="how-body-1">You bring what matters most right now, and we work through it together. I'll ask questions that challenge your assumptions and open up options you can't see from inside the situation. You leave every session with a commitment you defined and a next step you chose.</p>
          <p className="how-body-2">This is your agenda. I bring the structure and the questions.</p>
        </div>
      </section>

      {/* ===== 6. WHAT'S POSSIBLE ===== */}
      <section className="possible">
        <div className="possible-inner">
          <h2 className="possible-heading">What&apos;s possible</h2>
          <p className="possible-body">Your team brings you solutions, not problems. You make the hard calls without replaying them at 2 a.m. You're home for dinner, and you're actually present.</p>
        </div>
      </section>

      {/* ===== 7. THE ENGAGEMENT ===== */}
      <section className="engagement">
        <div className="engagement-inner">
          <div>
            <p className="engagement-context">The engagement</p>
            <h2 className="engagement-headline">Six months. Twelve sessions. Your agenda.</h2>
            {/* PENDING MICROSOFT BOOKINGS URL */}
            <button className="btn btn-gold" disabled aria-disabled="true" style={{opacity: 0.72, cursor: 'not-allowed'}}>
              Schedule a Free 15-Minute Call
            </button>
            {/* PENDING ENROLL PAGE */}
            <p className="enroll-link-placeholder">
              Already decided? <span className="enroll-link-text">Enroll now →</span>
            </p>
          </div>
          <div>
            <div className="engagement-details">
              <div className="engagement-detail-item">12 one-hour sessions, every other week</div>
              <div className="engagement-detail-item"><a href="/the-8-pillars" className="engagement-detail-link">8 Pillars whole-person assessment</a> at the start</div>
              <div className="engagement-detail-item">Commitments at each session that you define</div>
              <div className="engagement-detail-item">Final session: reflection, integration, and a plan for what&apos;s next</div>
            </div>
            <div className="investment-block">
              <div className="investment-label">Investment</div>
              <div className="investment-amount">$3,600, or 6 monthly payments of $600</div>
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