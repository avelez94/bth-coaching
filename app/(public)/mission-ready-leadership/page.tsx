import { createClient } from '@supabase/supabase-js'

export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getData() {
  const { data } = await supabase.from('pages').select('content').eq('slug', 'mission-ready').single()
  return (data?.content || {}) as Record<string, string>
}

export default async function MissionReadyLeadership() {
  const c = await getData()
  const g = (key: string, fallback: string) => c[key] || fallback

  const pillars = [
    { num: '01', name: 'Values / Ethical / Moral Compass', desc: 'The foundation of everything. Clarity about what you stand for — and the discipline to act on it under pressure.' },
    { num: '02', name: 'Physical Wellness', desc: 'The body is the platform for everything else. Energy, resilience, and performance start here.' },
    { num: '03', name: 'Emotional Intelligence', desc: 'Understanding your own emotional landscape and reading the room — essential for leading people through anything.' },
    { num: '04', name: 'Cognitive Agility', desc: 'The ability to think clearly, adapt quickly, and make sound decisions when the stakes are high.' },
    { num: '05', name: 'Relational Health', desc: 'The quality of your relationships — at work, at home, in your community — shapes your capacity to lead.' },
    { num: '06', name: 'Spiritual Grounding', desc: 'A sense of purpose and meaning that sustains you through difficulty and anchors your leadership.' },
    { num: '07', name: 'Financial Clarity', desc: 'Understanding your relationship with money and resources — personal and professional — frees mental bandwidth for leadership.' },
    { num: '08', name: 'Environmental Harmony', desc: 'Your relationship with the spaces and systems you operate in, and how they support or undermine your effectiveness.' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&display=swap');
        :root{--ivory:#F7F4ED;--ivory-dark:#EDE8DC;--slate:#4C78A0;--slate-dark:#3A607F;--navy:#0D1B2A;--gold:#C9A23A;--gold-light:#D4B563;--white:#FFFFFF;--text-body:#2C3E50;--text-muted:#6B7A8D;}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:var(--ivory);color:var(--navy);font-family:'Inter',sans-serif;font-weight:300;overflow-x:hidden;}
        .btn{display:inline-flex;align-items:center;gap:10px;padding:15px 32px;font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;transition:all 0.25s;font-weight:500;cursor:pointer;border:none;font-family:'Inter',sans-serif;}
        .btn-primary{background:var(--navy);color:var(--ivory);} .btn-primary:hover{background:var(--slate);}
        .btn-gold{background:var(--gold);color:var(--navy);} .btn-gold:hover{background:var(--gold-light);}
        .btn-outline-light{background:transparent;color:var(--ivory);border:1px solid rgba(247,244,237,0.4);} .btn-outline-light:hover{background:rgba(247,244,237,0.1);}

        /* HERO */
        .page-hero{background:var(--navy);min-height:72vh;display:flex;align-items:center;position:relative;overflow:hidden;}
        .hero-bg{position:absolute;inset:0;background:linear-gradient(135deg,var(--navy) 0%,#1A2E45 60%,#1B3A5C 100%);}
        .hero-pattern{position:absolute;inset:0;opacity:0.04;background-image:repeating-linear-gradient(45deg,var(--gold) 0,var(--gold) 1px,transparent 0,transparent 50%);background-size:28px 28px;}
        .hero-content{position:relative;z-index:2;max-width:1100px;margin:0 auto;padding:160px 72px 100px;width:100%;}
        .breadcrumb{font-size:0.63rem;color:rgba(247,244,237,0.35);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:28px;display:flex;align-items:center;gap:8px;}
        .breadcrumb a{color:rgba(247,244,237,0.35);text-decoration:none;} .breadcrumb a:hover{color:var(--gold);}
        .hero-eyebrow{font-size:0.63rem;color:var(--gold);letter-spacing:0.22em;text-transform:uppercase;font-weight:500;margin-bottom:24px;display:flex;align-items:center;gap:12px;}
        .hero-eyebrow::before{content:'';width:32px;height:1px;background:var(--gold);}
        .hero-audience{font-size:0.75rem;color:rgba(247,244,237,0.5);letter-spacing:0.06em;font-style:italic;margin-bottom:28px;}
        .page-hero-title{font-family:'Playfair Display',serif;font-size:clamp(36px,5vw,60px);font-weight:700;line-height:1.1;color:var(--white);margin-bottom:24px;letter-spacing:-0.02em;max-width:780px;}
        .page-hero-title em{font-style:italic;color:var(--gold);}
        .page-hero-desc{font-size:1rem;line-height:1.8;color:rgba(247,244,237,0.7);max-width:620px;margin-bottom:40px;font-weight:300;}
        .hero-btns{display:flex;gap:14px;flex-wrap:wrap;}

        /* INTRO */
        .intro{padding:100px 72px;background:var(--ivory);}
        .intro-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start;}
        .eyebrow{font-size:0.63rem;color:var(--gold);letter-spacing:0.2em;text-transform:uppercase;font-weight:500;margin-bottom:20px;display:flex;align-items:center;gap:10px;}
        .eyebrow::before{content:'';width:24px;height:1px;background:var(--gold);}
        .section-title{font-family:'Playfair Display',serif;font-size:clamp(28px,3.5vw,44px);font-weight:700;line-height:1.12;color:var(--navy);margin-bottom:24px;letter-spacing:-0.02em;}
        .section-title em{font-style:italic;color:var(--slate);}
        .body-text{font-size:0.95rem;line-height:1.85;color:var(--text-body);margin-bottom:20px;font-weight:300;}
        .body-text strong{color:var(--navy);font-weight:500;}
        .science-box{background:var(--ivory-dark);padding:32px 36px;}
        .science-title{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:var(--navy);margin-bottom:16px;}
        .science-body{font-size:0.87rem;line-height:1.75;color:var(--text-muted);}

        /* PILLARS */
        .pillars{padding:100px 72px;background:var(--slate);}
        .pillars-inner{max-width:1100px;margin:0 auto;}
        .pillars-header{margin-bottom:48px;}
        .eyebrow-light{font-size:0.63rem;color:var(--gold);letter-spacing:0.2em;text-transform:uppercase;font-weight:500;margin-bottom:20px;display:flex;align-items:center;gap:10px;}
        .eyebrow-light::before{content:'';width:24px;height:1px;background:var(--gold);}
        .section-title-light{font-family:'Playfair Display',serif;font-size:clamp(28px,3.5vw,44px);font-weight:700;line-height:1.12;color:var(--white);letter-spacing:-0.02em;margin-bottom:16px;}
        .pillars-subhead{font-size:0.9rem;font-style:italic;color:rgba(247,244,237,0.6);margin-bottom:48px;line-height:1.7;max-width:700px;}
        .pillars-list{display:flex;flex-direction:column;}
        .pillar-row{display:grid;grid-template-columns:64px 200px 1fr;gap:24px;align-items:baseline;padding:24px 0;border-top:1px solid rgba(255,255,255,0.1);}
        .pillar-row:last-child{border-bottom:1px solid rgba(255,255,255,0.1);}
        .pillar-num{font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:700;color:rgba(201,162,58,0.4);line-height:1;}
        .pillar-name{font-family:'Playfair Display',serif;font-size:0.95rem;font-weight:700;color:var(--white);line-height:1.4;}
        .pillar-desc{font-size:0.85rem;line-height:1.7;color:rgba(247,244,237,0.6);}

        /* HOW IT WORKS */
        .how{padding:100px 72px;background:var(--ivory);}
        .how-inner{max-width:1100px;margin:0 auto;}
        .how-header{margin-bottom:64px;}
        .section-title-large{font-family:'Playfair Display',serif;font-size:clamp(32px,4vw,52px);font-weight:700;line-height:1.1;color:var(--navy);letter-spacing:-0.02em;}
        .how-subhead{font-size:0.95rem;font-style:italic;color:var(--text-muted);margin-top:12px;line-height:1.7;}
        .sessions-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-bottom:48px;}
        .session-card{padding:48px 40px;background:var(--ivory-dark);}
        .session-label{font-size:0.62rem;color:var(--gold);letter-spacing:0.15em;text-transform:uppercase;font-weight:600;margin-bottom:16px;}
        .session-name{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:700;color:var(--navy);margin-bottom:16px;letter-spacing:-0.01em;}
        .session-body{font-size:0.88rem;line-height:1.8;color:var(--text-body);}
        .session-body strong{color:var(--navy);font-weight:500;}
        .icf-note{background:var(--navy);padding:28px 32px;margin-top:2px;}
        .icf-note p{font-size:0.85rem;line-height:1.75;color:rgba(247,244,237,0.6);font-style:italic;}
        .icf-note strong{color:rgba(247,244,237,0.85);font-weight:500;}

        /* PROGRAM ARC */
        .arc{padding:100px 72px;background:var(--ivory-dark);}
        .arc-inner{max-width:1100px;margin:0 auto;}
        .arc-header{margin-bottom:64px;}
        .arc-phases{display:flex;flex-direction:column;}
        .arc-phase{display:grid;grid-template-columns:220px 1fr;gap:40px;padding:36px 0;border-top:1px solid rgba(13,27,42,0.1);}
        .arc-phase:last-child{border-bottom:1px solid rgba(13,27,42,0.1);}
        .phase-label{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:var(--navy);line-height:1.3;}
        .phase-sub{font-size:0.72rem;color:var(--gold);letter-spacing:0.1em;text-transform:uppercase;margin-top:4px;}
        .phase-body{font-size:0.88rem;line-height:1.8;color:var(--text-body);}

        /* CONFIDENTIALITY */
        .confidentiality{padding:72px 72px;background:var(--slate);}
        .confidentiality-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:220px 1fr;gap:48px;align-items:start;}
        .conf-label{font-size:0.63rem;color:var(--gold);letter-spacing:0.15em;text-transform:uppercase;font-weight:600;padding-top:4px;}
        .conf-body{font-size:0.92rem;line-height:1.85;color:rgba(247,244,237,0.75);}

        /* INVESTMENT */
        .investment{padding:100px 72px;background:var(--ivory);}
        .investment-inner{max-width:1100px;margin:0 auto;}
        .investment-header{margin-bottom:64px;}
        .pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-bottom:48px;}
        .pricing-card{padding:40px 32px;background:var(--ivory-dark);}
        .pricing-card.featured{background:var(--navy);}
        .pricing-track{font-size:0.62rem;color:var(--gold);letter-spacing:0.15em;text-transform:uppercase;font-weight:600;margin-bottom:16px;}
        .pricing-amount{font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:700;color:var(--navy);line-height:1;margin-bottom:12px;}
        .pricing-card.featured .pricing-amount{color:var(--gold);}
        .pricing-desc{font-size:0.85rem;line-height:1.7;color:var(--text-muted);}
        .pricing-card.featured .pricing-desc{color:rgba(247,244,237,0.6);}
        .pricing-card.featured .pricing-track{color:var(--gold);}

        /* FINAL CTA */
        .final-cta{background:var(--slate);padding:100px 72px;}
        .final-cta-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;}
        .cta-headline{font-family:'Playfair Display',serif;font-size:clamp(32px,4vw,48px);font-weight:700;line-height:1.1;color:var(--white);letter-spacing:-0.02em;}
        .cta-headline em{font-style:italic;color:var(--gold);}
        .cta-body{font-size:0.95rem;line-height:1.85;color:rgba(247,244,237,0.7);margin-bottom:32px;}

        @media(max-width:1024px){
          .hero-content{padding:140px 40px 80px;}
          .intro{padding:72px 40px;} .intro-inner{grid-template-columns:1fr;gap:48px;}
          .pillars{padding:72px 40px;}
          .pillar-row{grid-template-columns:48px 1fr;} .pillar-desc{grid-column:2;}
          .how{padding:72px 40px;} .sessions-grid{grid-template-columns:1fr;}
          .arc{padding:72px 40px;} .arc-phase{grid-template-columns:1fr;gap:12px;}
          .confidentiality{padding:60px 40px;} .confidentiality-inner{grid-template-columns:1fr;gap:20px;}
          .investment{padding:72px 40px;} .pricing-grid{grid-template-columns:1fr;}
          .final-cta{padding:72px 40px;} .final-cta-inner{grid-template-columns:1fr;gap:40px;}
        }
        @media(max-width:640px){
          .hero-content{padding:120px 24px 60px;}
          .hero-btns{flex-direction:column;}
          .intro{padding:60px 24px;} .pillars{padding:60px 24px;} .how{padding:60px 24px;}
          .arc{padding:60px 24px;} .confidentiality{padding:48px 24px;} .investment{padding:60px 24px;} .final-cta{padding:60px 24px;}
          .pillar-row{grid-template-columns:1fr;gap:8px;}
          .session-card{padding:32px 24px;}
        }
      `}</style>

      {/* HERO */}
      <div className="page-hero">
        <div className="hero-bg" />
        <div className="hero-pattern" />
        <div className="hero-content">
          <div className="breadcrumb"><a href="/">Home</a><span>→</span><span>Mission-Ready Leadership</span></div>
          <div className="hero-eyebrow">Mission-Ready Leadership Program</div>
          <div className="hero-audience">For Executives, Teams, Organizations and Individuals in Transition</div>
          <h1 className="page-hero-title">Leadership development that treats the whole person — and produces results the individual and organization can <em>see.</em></h1>
          <p className="page-hero-desc">The Mission-Ready Leadership Program is a science-grounded, whole-person coaching experience built around the 8 Pillars of Mission-Ready Leadership — for sponsored leaders, self-directed individuals, teams, and anyone finding their footing in a new role.</p>
          <div className="hero-btns">
            <a href="/contact" className="btn btn-gold">Schedule a Conversation →</a>
          </div>
        </div>
      </div>

      {/* INTRO */}
      <section className="intro">
        <div className="intro-inner">
          <div>
            <div className="eyebrow">The Difference</div>
            <h2 className="section-title">Most programs develop skills. This one develops <em>leaders.</em></h2>
            <p className="body-text">Skills matter. But the leaders who sustain high performance over time — who can lead through ambiguity, navigate personal and professional complexity simultaneously, and bring out the best in the people around them — are the ones who have done the harder work of understanding themselves.</p>
            <p className="body-text">The Mission-Ready Leadership Program is built on a simple but counterintuitive premise: <strong>the immediate challenge is rarely the whole story.</strong> When we address the whole person, something unlocks. Potential they did not know they had. Clarity they could not find alone. An actionable path forward that lasts.</p>
          </div>
          <div>
            <div className="science-box">
              <div className="science-title">Science-grounded. Experience-tested.</div>
              <p className="science-body">The 8 Pillars of Mission-Ready Leadership are grounded in research on human performance, leadership effectiveness, and whole-person wellness. They are also tested across 30 years of real leadership experience — in the Navy, in executive settings, and in one-on-one coaching relationships.</p>
              <p className="science-body" style={{marginTop:16}}>The framework exists because leadership is not a professional skill. It is a human one. And developing it requires tending to the whole person — not just the resume.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="pillars">
        <div className="pillars-inner">
          <div className="pillars-header">
            <div className="eyebrow-light">The Framework</div>
            <h2 className="section-title-light">The 8 Pillars of Mission-Ready Leadership</h2>
            <p className="pillars-subhead">Building unshakable wholeness under pressure. Think of these as strategic risk factors — compromise in any one area degrades judgment across all the others.</p>
          </div>
          <div className="pillars-list">
            {pillars.map((p, i) => (
              <div key={i} className="pillar-row">
                <div className="pillar-num">{p.num}</div>
                <div className="pillar-name">{p.name}</div>
                <div className="pillar-desc">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how">
        <div className="how-inner">
          <div className="how-header">
            <div className="eyebrow">How the Program Works</div>
            <h2 className="section-title-large">Two sessions a month. Two different modes. Both designed to reinforce one another.</h2>
            <p className="how-subhead">Each month of the program is built around one of the 8 Pillars, and each month includes two distinct kinds of conversation.</p>
          </div>
          <div className="sessions-grid">
            <div className="session-card">
              <div className="session-label">Session One</div>
              <div className="session-name">The Pillar Session</div>
              <p className="session-body">I bring a structured set of questions built around that month's Pillar — where you stand, what's working, where you want to grow, and what you're willing to commit to. This session is <strong>intentionally more directive than traditional coaching.</strong> It is a deliberate design choice, to assist and cultivate growth — and we name it as exactly that before we start.</p>
              <p className="session-body" style={{marginTop:14}}>Every Pillar Session opens with a quick check: is this the right place to spend today's time, or is something else more present for you?</p>
            </div>
            <div className="session-card">
              <div className="session-label">Session Two</div>
              <div className="session-name">The Traditional Coaching Session</div>
              <p className="session-body">Fully client-led, following International Coaching Federation (ICF) core competencies. Your agenda, your pace, no imposed frame. This is where the insights from the Pillar Session — or something more pressing — gets worked through in whatever way actually serves you.</p>
            </div>
          </div>
          <div className="icf-note">
            <p><strong>Why we tell you this:</strong> The ICF credentialing body holds non-directive, client-led conversation as the standard. We believe a structured framework has real value alongside that standard — so rather than blur the two, we keep them distinct and name which one you're in. This integrity and transparency is at the heart of who we are.</p>
          </div>
        </div>
      </section>

      {/* PROGRAM ARC */}
      <section className="arc">
        <div className="arc-inner">
          <div className="arc-header">
            <div className="eyebrow">Program Arc</div>
            <h2 className="section-title-large">How the ten months unfold.</h2>
          </div>
          <div className="arc-phases">
            <div className="arc-phase">
              <div>
                <div className="phase-label">Phase 0</div>
                <div className="phase-sub">Intake and Orientation</div>
              </div>
              <div className="phase-body">A self-administered intake survey, followed by a 1 to 2 day intro session (in-person or virtual): relationship-building, expectations, and a first look at where you stand across all 8 Pillars.</div>
            </div>
            <div className="arc-phase">
              <div>
                <div className="phase-label">Months 1 to 8</div>
                <div className="phase-sub">One Pillar per Month</div>
              </div>
              <div className="phase-body">Two sessions each month, as described above. First a dive into the Pillar, next an open session to address your most pressing challenges or explore the pillars more fully.</div>
            </div>
            <div className="arc-phase">
              <div>
                <div className="phase-label">Months 9 to 10</div>
                <div className="phase-sub">Close-Out</div>
              </div>
              <div className="phase-body">Ongoing coaching and lessons learned across all 8 Pillars, a plan for what you sustain on your own, and — if it is a fit — an introduction to ongoing support between engagements.</div>
            </div>
          </div>
        </div>
      </section>

      {/* CONFIDENTIALITY */}
      <section className="confidentiality">
        <div className="confidentiality-inner">
          <div className="conf-label">A note on confidentiality</div>
          <div className="conf-body">When an organization sponsors this coaching, the coaching conversation remains a confidential space for the leader to do real work. The organization helps define the purpose of the engagement. The content of sessions belongs to the leader.</div>
        </div>
      </section>

      {/* INVESTMENT */}
      <section className="investment">
        <div className="investment-inner">
          <div className="investment-header">
            <div className="eyebrow">Investment</div>
            <h2 className="section-title-large">Three ways to engage.</h2>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card featured">
              <div className="pricing-track">Individual / Executive Track</div>
              <div className="pricing-amount">$6,000</div>
              <p className="pricing-desc">The full 10-month arc, all-inclusive. No per-session billing. One commitment, one price, one complete program.</p>
            </div>
            <div className="pricing-card">
              <div className="pricing-track">Team / Cohort Track</div>
              <div className="pricing-amount">Custom</div>
              <p className="pricing-desc">Custom-scoped based on cohort size. Pillar Sessions are typically delivered once per month to the full cohort; Coaching Sessions remain one-on-one per participant. Contact us for a per-person quote once your cohort size is set.</p>
            </div>
            <div className="pricing-card">
              <div className="pricing-track">Organization-Wide Track</div>
              <div className="pricing-amount">Custom SOW</div>
              <p className="pricing-desc">Scoped to your organization's structure and goals — similar to our Leadership Consulting engagements. We design an engagement that fits where your organization actually is.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="final-cta-inner">
          <div className="cta-headline">Ready to build something that <em>lasts?</em></div>
          <div>
            <p className="cta-body">No pitch. No pressure. Just a direct conversation about where you are, what you are looking to build — and whether this is the right fit for getting there.</p>
            <a href="/contact" className="btn btn-gold">Schedule a Conversation →</a>
          </div>
        </div>
      </section>
    </>
  )
}