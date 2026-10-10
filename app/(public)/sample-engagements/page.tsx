'use client'

import './sample-engagements.css'

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