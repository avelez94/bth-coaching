'use client'

// PLACEHOLDER NOTE:
// "Executive Development" entry (Heidrick & Struggles) is commented out below the
// coachingEngagements array. Enable only after approval is confirmed.
// Two OSD entries in commandEngagements require ethics counselor check before launch.

const coachingEngagements = [
  {
    title: 'Leading Through Consolidation',
    context: 'Executive Director, regional nonprofit council',
    body: 'The Executive Director of a regional nonprofit council faced an organizational consolidation and realignment. Through coaching, he led his team through the change, communicated clearly with his Board of Directors and national leadership, and answered a question the change forced: what role did he want next? He got clear on his own path and kept open communication with every stakeholder, turning a potentially divisive transition into a collaborative one.',
  },
  {
    title: 'Leading Through Influence',
    context: 'Senior leader, new cross-organizational role',
    body: "A leader came in to strengthen his executive presence. The real challenge was a new role that required leading across the organization without clear authority, while also wanting to be more present for a growing family. He shifted from chasing outcomes to building a process, drew on experience he'd been underusing, and built a plan for the presence he wanted at home.",
  },
  {
    title: 'Redefining Success',
    context: 'Program director, regional youth-serving nonprofit',
    body: "A program director wanted to become a stronger leader. She discovered that empathy and accountability weren't in conflict, and untangled a professional identity that had absorbed everything else. She finished with firmer boundaries, clearer confidence, and a definition of success that included health and relationships.",
  },
]

// NOT RENDERED — enable only after Heidrick & Struggles approval is confirmed:
// {
//   title: 'Executive Development',
//   context: 'Global leadership advisory firm',
//   body: 'Senior leaders in an executive development program delivered through a global leadership advisory firm worked with John as their external coach. Together they built executive presence, team leadership, and organizational influence, using a whole-person approach that integrated work and life rather than trading one for the other.',
// }

const commandEngagements = [
  {
    title: 'Turning Around an Underperforming Command',
    context: 'Commanding Officer, Navy Operational Support Center',
    body: "John took command of the largest unit of its type in the nation, and one of the lowest-performing in the Naval Reserve: five directors, about 75 people, missing key goals, with broken morale and poor customer service. Instead of launching a new program, he changed how he led — asking more, directing less, and building a metrics dashboard that gave people autonomy over the outcomes that mattered. Within one year the team was recognized as the region's #1 large Navy Operational Support Center. Retention rose, morale recovered, and customers became advocates.",
  },
  {
    title: 'Building a Workforce Plan Everyone Agreed On',
    context: 'Director, Manpower and Human Capital Strategy — Department of the Navy',
    body: "A command of more than 200 people hadn't reconciled its personnel against its authorized positions in years, and had no human capital strategy or succession plan. Working collaboratively across a matrixed organization, the team brought the manning plan in line with reality within a year. Every element agreed on what staffing should be and what it actually was. The team then built a full strategy covering onboarding, leadership development, and offboarding, plus a succession plan for planned and unexpected departures.",
  },
  {
    title: 'Rebuilding a Team in the First Week of COVID',
    context: 'Director, Policy and Executive Services — Office of the Assistant to the Secretary of Defense for Public Affairs',
    body: 'John stepped into a position vacated unexpectedly and reported for duty the week COVID shut everything down. The nine-person team administered public affairs policy for the Department of Defense and ran executive services for a staff of about 75. The team had to rebuild while the entire way of working changed around it. The result: a resilient, collaborative team known for responsiveness and outstanding results, built largely while working remotely.',
  },
  {
    title: 'Turning Distrust Into Teamwork',
    context: 'Director, Policy and Executive Services — Office of the Assistant to the Secretary of Defense for Public Affairs',
    body: "In the same role, John found a team of strong individual performers who didn't trust one another and weren't supporting each other across functions. Together they identified shared values, celebrated individual and collective wins, and built trust through shared goals and experiences. The team became cooperative and successful: organizational goals were met or exceeded, retention increased, and morale became a point of pride.",
  },
]

export default function SampleEngagements() {
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
          --slate-pale: #E8EFF5;
          --navy: #0D1B2A;
          --gold: #C9A23A;
          --text: #1C2B3A;
          --text-mid: #3D5166;
          --text-muted: #6B7A8D;
          --rule: rgba(28,43,58,0.1);
          --rule-light: rgba(247,244,237,0.14);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--ivory); color: var(--text); font-family: 'Inter', sans-serif; font-weight: 300; overflow-x: hidden; -webkit-font-smoothing: antialiased; }

        .btn { display: inline-flex; align-items: center; gap: 9px; padding: 13px 28px; font-size: 0.72rem; letter-spacing: 0.07em; text-transform: uppercase; text-decoration: none; transition: all 0.22s ease; font-weight: 500; cursor: pointer; border: none; font-family: 'Inter', sans-serif; white-space: nowrap; }
        .btn-gold { background: var(--gold); color: var(--navy); }
        .btn-gold:hover { background: #b8911f; }

        /* ============================================================
           1. INTRO / HERO
           Ivory. Narrow measure. Page headline + framing statement.
        ============================================================ */
        .hero {
          background: var(--ivory);
          padding: 160px 72px 100px;
        }
        .hero-inner { max-width: 820px; }
        .hero-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(32px, 3.8vw, 52px);
          font-weight: 400;
          line-height: 1.15;
          color: var(--text);
          margin-bottom: 28px;
          letter-spacing: -0.02em;
        }
        .hero-body {
          font-size: 1rem;
          line-height: 1.82;
          color: var(--text-mid);
          font-weight: 300;
          max-width: 640px;
        }

        /* ============================================================
           2. COACHING ENGAGEMENTS
           Ivory dark. Section label + ruled entry list.
           Each entry: bold title, small italic context, paragraph.
        ============================================================ */
        .section-coaching {
          background: var(--ivory-dark);
          padding: 100px 72px;
          border-top: 1px solid var(--rule);
        }
        .section-label {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 48px;
        }
        .entry-list {
          display: flex;
          flex-direction: column;
          max-width: 820px;
        }
        .entry {
          padding: 36px 0;
          border-top: 1px solid var(--rule);
        }
        .entry:last-child { border-bottom: 1px solid var(--rule); }
        .entry-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(18px, 1.8vw, 22px);
          font-weight: 400;
          color: var(--text);
          margin-bottom: 6px;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }
        .entry-context {
          font-size: 0.8rem;
          font-style: italic;
          color: var(--text-muted);
          margin-bottom: 16px;
          font-weight: 300;
        }
        .entry-body {
          font-size: 0.93rem;
          line-height: 1.82;
          color: var(--text-mid);
          font-weight: 300;
        }

        /* ============================================================
           3. COMMAND AND ENTERPRISE LEADERSHIP
           Slate. Same ruled entry pattern, light rules on dark bg.
        ============================================================ */
        .section-command {
          background: var(--slate);
          padding: 100px 72px;
        }
        .section-label-light {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(247,244,237,0.45);
          margin-bottom: 48px;
        }
        .entry-list-light { display: flex; flex-direction: column; max-width: 820px; }
        .entry-light {
          padding: 36px 0;
          border-top: 1px solid var(--rule-light);
        }
        .entry-light:last-child { border-bottom: 1px solid var(--rule-light); }
        .entry-title-light {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(18px, 1.8vw, 22px);
          font-weight: 400;
          color: var(--ivory);
          margin-bottom: 6px;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }
        .entry-context-light {
          font-size: 0.8rem;
          font-style: italic;
          color: rgba(247,244,237,0.45);
          margin-bottom: 16px;
          font-weight: 300;
        }
        .entry-body-light {
          font-size: 0.93rem;
          line-height: 1.82;
          color: rgba(247,244,237,0.72);
          font-weight: 300;
        }

        /* ============================================================
           4. CTA
           Ivory dark. Centered, clean.
        ============================================================ */
        .cta {
          background: var(--ivory-dark);
          padding: 100px 72px;
          border-top: 1px solid var(--rule);
          text-align: center;
        }

        /* ============================================================
           RESPONSIVE
        ============================================================ */
        @media (max-width: 1024px) {
          .hero { padding: 140px 48px 80px; }
          .section-coaching { padding: 80px 48px; }
          .section-command { padding: 80px 48px; }
          .cta { padding: 80px 48px; }
        }

        @media (max-width: 640px) {
          .hero { padding: 120px 24px 64px; }
          .section-coaching { padding: 64px 24px; }
          .section-command { padding: 64px 24px; }
          .cta { padding: 64px 24px; }
          .entry { padding: 28px 0; }
          .entry-light { padding: 28px 0; }
        }
      `}</style>

      {/* ===== 1. INTRO / HERO ===== */}
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-headline">Leadership in Practice</h1>
          <p className="hero-body">Every leader's situation is different. These examples show what changes when leaders get the right support — sometimes one leader at a turning point, sometimes a whole organization learning to lead differently. Client details are anonymized.</p>
        </div>
      </section>

      {/* ===== 2. COACHING ENGAGEMENTS ===== */}
      <section className="section-coaching">
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <div className="section-label">Coaching engagements</div>
          <div className="entry-list">
            {coachingEngagements.map((e, i) => (
              <div key={i} className="entry">
                <div className="entry-title">{e.title}</div>
                <div className="entry-context">{e.context}</div>
                <p className="entry-body">{e.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3. COMMAND AND ENTERPRISE LEADERSHIP ===== */}
      <section className="section-command">
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <div className="section-label-light">Command and enterprise leadership</div>
          <div className="entry-list-light">
            {commandEngagements.map((e, i) => (
              <div key={i} className="entry-light">
                <div className="entry-title-light">{e.title}</div>
                <div className="entry-context-light">{e.context}</div>
                <p className="entry-body-light">{e.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. CTA ===== */}
      <section className="cta">
        <a href="/contact" className="btn btn-gold">Schedule a Free 15-Minute Call</a>
      </section>
    </>
  )
}