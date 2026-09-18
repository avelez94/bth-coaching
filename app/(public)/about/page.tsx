'use client'

import { useRef, useEffect } from 'react'

export default function About() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&family=Lora:ital,wght@1,400;1,500&display=swap');

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

        .btn-primary { display: inline-flex; align-items: center; gap: 9px; padding: 13px 28px; font-size: 0.72rem; letter-spacing: 0.07em; text-transform: uppercase; text-decoration: none; transition: all 0.22s ease; font-weight: 500; cursor: pointer; border: none; font-family: 'Inter', sans-serif; white-space: nowrap; background: var(--navy); color: var(--ivory); }
        .btn-primary:hover { background: var(--slate-mid); }

        /* ============================================================
           OPENING
           Desktop: asymmetric three-element composition.
           Left column: John's name + Bio opening statement.
           Right: portrait at controlled size, offset vertically
           so it sits beside the opening statement, not floating alone.
           The name anchors the top-left. The statement runs wide.
           The portrait is an integrated presence, not a hero image.
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
          grid-template-columns: 1fr 320px;
          grid-template-rows: auto auto;
          gap: 0 72px;
          align-items: start;
        }
        .opening-name-block {
          grid-column: 1;
          grid-row: 1;
          padding-bottom: 48px;
        }
        .opening-name {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(18px, 1.8vw, 24px);
          font-weight: 400;
          color: var(--text-muted);
          letter-spacing: 0.01em;
          line-height: 1.1;
          margin-bottom: 0;
        }

        /* Portrait sits in the right column, spanning both rows,
           offset from top to align with the statement rather than the name */
        .opening-portrait-col {
          grid-column: 2;
          grid-row: 1 / 3;
          padding-top: 72px;
          margin-left: -48px;
        }
        .opening-portrait {
          width: 100%;
          max-width: 300px;
          aspect-ratio: 3 / 4;
          object-fit: cover;
          object-position: center top;
          display: block;
          filter: none;
        }
        .opening-portrait-placeholder {
          width: 100%;
          max-width: 300px;
          aspect-ratio: 3 / 4;
          background: var(--slate-pale);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 10px;
          color: var(--text-muted);
          font-size: 0.72rem;
          letter-spacing: 0.06em;
        }
        .opening-statement {
          grid-column: 1;
          grid-row: 2;
        }
        .opening-lead {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(28px, 3.4vw, 46px);
          font-weight: 400;
          line-height: 1.15;
          color: var(--text);
          letter-spacing: -0.02em;
          margin-bottom: 32px;
          max-width: 680px;
        }
        .opening-body {
          font-size: 1rem;
          line-height: 1.85;
          color: var(--text-mid);
          margin-bottom: 18px;
          max-width: 560px;
          font-weight: 300;
        }
        .opening-body:last-child { margin-bottom: 0; }

        /* ============================================================
           THE STORY
           Ivory dark. Continuous long-form narrative.
           Centered reading column — essay treatment, not service copy.
           Navy ceremony photograph breaks the narrative editorially
           at the Reserve Center turnaround moment.
        ============================================================ */
        .story {
          background: var(--ivory-dark);
          padding: 100px 72px;
        }
        .story-inner {
          max-width: 680px;
          margin: 0 auto;
        }
        .story-body {
          font-size: 0.97rem;
          line-height: 1.92;
          color: var(--text-mid);
          margin-bottom: 24px;
          font-weight: 300;
        }
        .story-body:last-child { margin-bottom: 0; }
        .story-body strong {
          color: var(--text);
          font-weight: 500;
        }
        /* Bridge sentence — the pivot between turnaround and failure */
        .story-bridge {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(18px, 1.8vw, 22px);
          font-weight: 400;
          font-style: italic;
          line-height: 1.5;
          color: var(--text);
          margin: 40px 0;
          letter-spacing: -0.01em;
        }

        /* Navy ceremony photograph — contained editorial break within narrative */
        .story-photo-break {
          margin: 56px auto;
          max-width: 980px;
          line-height: 0;
        }
        .story-photo-img {
          width: 100%;
          height: auto;
          display: block;
          max-width: 980px;
        }
        .story-photo-placeholder {
          width: 100%;
          max-width: 980px;
          height: 400px;
          background: var(--slate-pale);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 10px;
          color: var(--text-muted);
          font-size: 0.72rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* ============================================================
           MY APPROACH
           Slate. Bio MY APPROACH section verbatim.
           "Coaching that follows your lead." as display heading.
           Three approach paragraphs in reading column.
        ============================================================ */
        .approach {
          background: var(--slate);
          padding: 100px 72px;
        }
        .approach-inner {
          max-width: 720px;
          margin: 0 auto;
        }
        .approach-heading {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(28px, 3.2vw, 42px);
          font-weight: 400;
          line-height: 1.15;
          color: var(--ivory);
          margin-bottom: 40px;
          letter-spacing: -0.01em;
        }
        .approach-body {
          font-size: 0.97rem;
          line-height: 1.9;
          color: rgba(247,244,237,0.75);
          margin-bottom: 22px;
          font-weight: 300;
        }
        .approach-body:last-child { margin-bottom: 0; }

        /* ============================================================
           WHAT BECOMES POSSIBLE
           Ivory. Narrow centered reading column.
           Natural emotional close of John's self-description.
           "That's the work." closes without a CTA button.
        ============================================================ */
        .possible {
          background: var(--ivory);
          padding: 100px 72px;
          border-top: 1px solid var(--rule);
        }
        .possible-inner {
          max-width: 600px;
          margin: 0 auto;
        }
        .possible-body {
          font-size: 0.97rem;
          line-height: 1.9;
          color: var(--text-mid);
          margin-bottom: 22px;
          font-weight: 300;
        }
        .possible-body:last-child { margin-bottom: 0; }
        .possible-close {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(20px, 2.2vw, 28px);
          font-weight: 400;
          color: var(--text);
          margin-top: 40px;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }

        /* ============================================================
           CREDENTIALS
           Ivory dark. Three columns: Experience, Education, Certifications.
           Typographic list — restrained, secondary, honest.
        ============================================================ */
        .credentials {
          background: var(--ivory-dark);
          padding: 100px 72px;
          border-top: 1px solid var(--rule);
        }
        .credentials-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .credentials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px;
        }
        .cred-col-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 24px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--rule);
        }
        .cred-entry {
          margin-bottom: 20px;
        }
        .cred-entry:last-child { margin-bottom: 0; }
        .cred-title {
          font-size: 0.88rem;
          line-height: 1.55;
          color: var(--text);
          font-weight: 400;
          margin-bottom: 3px;
        }
        .cred-org {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.5;
          font-weight: 300;
        }

        /* ============================================================
           CLOSING
           Ivory. Sourced from Bio / v5.
           "No pitch. No pressure." + Schedule a Conversation.
        ============================================================ */
        .closing {
          background: var(--ivory);
          padding: 100px 72px;
          border-top: 1px solid var(--rule);
        }
        .closing-inner {
          max-width: 640px;
          margin: 0 auto;
          text-align: center;
        }
        .closing-body {
          font-size: 0.97rem;
          line-height: 1.85;
          color: var(--text-mid);
          margin-bottom: 32px;
          font-weight: 300;
        }

        /* ============================================================
           RESPONSIVE
        ============================================================ */
        @media (max-width: 1024px) {
          .opening { padding: 130px 48px 80px; min-height: unset; }
          .opening-inner {
            grid-template-columns: 1fr 260px;
            gap: 0 48px;
          }
          .opening-portrait-col { padding-top: 48px; }
          .story { padding: 80px 48px; }
          .story-photo-break { margin: 48px auto; max-width: 100%; }
          .approach { padding: 80px 48px; }
          .possible { padding: 80px 48px; }
          .credentials { padding: 80px 48px; }
          .closing { padding: 80px 48px; }
        }

        @media (max-width: 768px) {
          .opening-inner {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
          }
          .opening-portrait-col {
            grid-column: 1;
            grid-row: 2;
            padding-top: 32px;
            padding-bottom: 32px;
          }
          .opening-portrait,
          .opening-portrait-placeholder {
            max-width: 220px;
          }
          .opening-name-block { grid-row: 1; }
          .opening-statement {
            grid-column: 1;
            grid-row: 3;
          }
          .credentials-grid { grid-template-columns: 1fr; gap: 40px; }
        }

        @media (max-width: 640px) {
          .opening { padding: 120px 24px 64px; }
          .story { padding: 64px 24px; }
          .story-photo-break { margin: 40px auto; }
          .approach { padding: 64px 24px; }
          .possible { padding: 64px 24px; }
          .credentials { padding: 64px 24px; }
          .closing { padding: 64px 24px; }
        }
      `}</style>

      {/* ===== OPENING ===== */}
      {/* Desktop: name top-left, portrait right (offset to align with
          statement), Bio opening statement spanning the left column.
          Three elements in intentional asymmetric relationship.
          Portrait is integrated presence, not dominant hero image. */}
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
            <h1 className="opening-lead">I help people find and get what they want.</h1>
            <p className="opening-body">You earned your success — and now you're looking to unlock what's next. Professionally, personally, relationally. All of it, together.</p>
            <p className="opening-body">I bring a lifetime of hard-won insights, alongside genuine curiosity and unwavering support, to help you get clear on what you want — and unlock the potential already in you to achieve it.</p>
          </div>

        </div>
      </section>

      {/* ===== THE STORY ===== */}
      {/* Complete merged addendum narrative as one continuous reading experience.
          Navy ceremony photograph inserts editorially at the Reserve Center moment.
          Bridge sentence marks the pivot to the failure story. */}
      <section className="story">
        <div className="story-inner">
          <p className="story-body">I know what it's like to wake up in the middle of the night wondering how to do it all — and do it all well.</p>
          <p className="story-body">Supporting a family, leading at work, taking care of yourself and your relationships, pursuing goals that matter — the weight of it is real. Most people carry it alone.</p>
          <p className="story-body">My own shift was both a process and a moment.</p>
          <p className="story-body">I inherited one of the most underperforming commands in the Naval Reserve — a Reserve Center of 76 personnel responsible for over 3,000 Sailors around the nation and the globe. Morale was broken, performance and customer satisfaction were low. It was an organization that had stopped believing in itself.</p>
          <p className="story-body">What turned it around wasn't a new strategy or a reorganization. It was learning to lead and care for the whole person in the room — starting with myself. Two years later, that command was recognized as the best large Center in the nation.</p>
          <p className="story-body">But the award wasn't the point. What mattered was what we built: a culture of people genuinely taking care of themselves and one another — with dignity, with respect, pushing forward, and with a commitment to each other's ongoing growth. That culture outlasted every individual who left.</p>
        </div>

        {/* Navy ceremony photograph — editorial break at the turnaround moment */}
        <div className="story-photo-break">
          <img
            src="/images/john-mccracken-navy-ceremony.jpg"
            alt=""
            aria-hidden="true"
            className="story-photo-img"
          />
        </div>

        <div className="story-inner">
          <p className="story-bridge">That turnaround didn't start with a plan. It started years earlier, with the hardest professional setback of my career.</p>
          <p className="story-body">My greatest career setback was failing a command selection I'd spent 16 years working toward — 11 of them at sea. In the Navy, that failure isn't private. Whether you selected for command is visible to everyone, simply by looking at the pins on your uniform, or their absence. It reroutes your career and your opportunities, and for me, it landed hard.</p>
          <p className="story-body">If I'd been selected, I likely would have kept leading the way I always had — which wasn't always the kindest or most empowering way to lead people. Not selecting forced a change I wouldn't have made on my own. I had to step back and look honestly at what was working, and more importantly, what wasn't. I made more room for people's autonomy and empowerment. I made a conscious effort to listen more than I directed. And I stopped holding people to my own idea of perfection, and started holding them to a standard of "good enough, done well."</p>
          <p className="story-body">It took me years to get there. But I want to help people move through their own version of this — from the career-altering to the everyday challenge of showing up better in a hard meeting or a hard relationship — faster and more effectively than I did. That's part of what I bring to every session.</p>
          <p className="story-body">That experience confirmed what most leadership and coaching programs still won't say directly: the immediate challenge is rarely the whole story. When we address the whole person — every dimension of who they are and what they're carrying — something unlocks. Potential they didn't know they had. Clarity they couldn't find alone. An actionable, repeatable path forward that lasts.</p>
          <p className="story-body">That's what I bring to every client.</p>
        </div>
      </section>

      {/* ===== MY APPROACH ===== */}
      {/* Bio: MY APPROACH — verbatim */}
      <section className="approach">
        <div className="approach-inner">
          <h2 className="approach-heading">Coaching that follows your lead.</h2>
          <p className="approach-body">You bring what's most present in the moment — the decision, the thing you can't stop thinking about — and we work through it together. We explore your values, challenge assumptions, and open perspectives you may not have considered from inside the situation. You lead the way.</p>
          <p className="approach-body">And because life doesn't separate neatly into professional and personal, we don't either. We work with all of it — on your terms — for your success.</p>
          <p className="approach-body">Insight without action is just an interesting conversation — we go beyond that. Every session produces something concrete: a commitment you define, a step you choose, a thing you finally decide to do. You keep pushing forward.</p>
        </div>
      </section>

      {/* ===== WHAT BECOMES POSSIBLE ===== */}
      {/* Bio: WHAT BECOMES POSSIBLE — verbatim */}
      <section className="possible">
        <div className="possible-inner">
          <p className="possible-body">Clients describe it differently, but the through-line is consistent.</p>
          <p className="possible-body">Real, lasting change — clarity, confidence, and a renewed sense of what's possible. A perspective you didn't know you had access to, and an action plan to match. Tools and approaches you hadn't considered. A sense that every part of your life is finally pulling in the same direction.</p>
          <p className="possible-close">That's the work. And it starts with a single conversation.</p>
        </div>
      </section>

      {/* ===== CREDENTIALS ===== */}
      {/* Bio: CREDENTIALS — full set, typographic list */}
      <section className="credentials">
        <div className="credentials-inner">
          <div className="credentials-grid">
            <div>
              <div className="cred-col-label">Experience</div>
              <div className="cred-entry">
                <div className="cred-title">Commanding Officer, U.S. Navy</div>
                <div className="cred-org">30 years of progressively responsible leadership, command, and strategic development positions</div>
              </div>
              <div className="cred-entry">
                <div className="cred-title">Director, Manpower & Human Capital Strategy</div>
                <div className="cred-org">Department of the Navy</div>
              </div>
              <div className="cred-entry">
                <div className="cred-title">Executive Coach & Director, Policy and Executive Services</div>
                <div className="cred-org">Office of the Secretary of Defense, 7 years</div>
              </div>
            </div>
            <div>
              <div className="cred-col-label">Education</div>
              <div className="cred-entry">
                <div className="cred-title">Executive Master of Business Administration</div>
                <div className="cred-org">Naval Postgraduate School</div>
              </div>
              <div className="cred-entry">
                <div className="cred-title">Master of Arts, National Security & Strategic Studies</div>
                <div className="cred-org">Naval War College</div>
              </div>
              <div className="cred-entry">
                <div className="cred-title">Leadership Coaching & Organizational Performance</div>
                <div className="cred-org">American University / Heidrick & Struggles</div>
              </div>
            </div>
            <div>
              <div className="cred-col-label">Certifications</div>
              <div className="cred-entry">
                <div className="cred-title">Associate Certified Coach (ACC)</div>
                <div className="cred-org">International Coaching Federation</div>
              </div>
              <div className="cred-entry">
                <div className="cred-title">DoD Certified Executive Coach</div>
              </div>
              <div className="cred-entry">
                <div className="cred-title">LCOP Certificate</div>
                <div className="cred-org">American University</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CLOSING ===== */}
      {/* Bio / v5: closing invitation — sourced */}
      <section className="closing">
        <div className="closing-inner">
          <p className="closing-body">No pitch. No pressure. Just a direct conversation about where you are, what you'd like the future to hold — and whether this is the right fit for getting there.</p>
          <a href="/contact" className="btn-primary">Schedule a Conversation</a>
        </div>
      </section>
    </>
  )
}