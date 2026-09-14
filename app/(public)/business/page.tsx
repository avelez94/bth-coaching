import { createClient } from '@supabase/supabase-js'

export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getData() {
  const { data } = await supabase.from('pages').select('content').eq('slug', 'business').single()
  return (data?.content || {}) as Record<string, string>
}

export default async function BusinessCoaching() {
  const c = await getData()
  const g = (key: string, fallback: string) => c[key] || fallback

  const offerings = [1,2,3,4,5,6].map(n => ({
    num: `0${n}`,
    name: g(`offering${n}_name`, ['Executive Coaching','Leadership Team Alignment','Organizational Transformation','New Leader Onboarding','High Performance Teams','Strategic Advisory'][n-1]),
    desc: g(`offering${n}_desc`, [
      'One on one coaching for C-suite and senior leaders. Develop your leadership identity, sharpen decision making, and build the executive presence your role demands.',
      'Coaching for leadership teams to improve communication, resolve tension, and move forward with shared clarity and purpose. Highly effective for teams in transition.',
      'Engagements designed to help organizations navigate change — mergers, restructuring, culture shifts, or rapid growth. Strategy meets human behavior.',
      'Accelerate the success of newly promoted or newly hired leaders. Build confidence, establish credibility, and set a clear direction in the first 90 days.',
      'Build the foundations of a high performing team — clear roles, accountability systems, psychological safety, and a culture of continuous improvement.',
      'Ongoing advisory relationships for founders and executives who want a trusted thinking partner to pressure test ideas and navigate complex decisions.'
    ][n-1]),
  }))

  const whoCards = [1,2,3].map(n => ({
    title: g(`who${n}_title`, ['Executives and C-Suite','Growing Businesses','Teams in Transition'][n-1]),
    desc: g(`who${n}_desc`, [
      'Senior leaders who want to sharpen their edge, expand their impact, and lead at the highest level with clarity and confidence.',
      'Founders and operators scaling their teams and organizations who need structure, accountability, and an outside perspective.',
      'Leadership teams navigating change — new ownership, restructuring, rapid growth, or cultural shifts that require alignment.'
    ][n-1]),
  }))

  const processSteps = [1,2,3,4,5].map(n => ({
    title: g(`process${n}_title`, ['Discovery Call','Needs Assessment','Engagement Design','Coaching and Accountability','Measure and Adjust'][n-1]),
    desc: g(`process${n}_desc`, [
      'We start with a no-obligation conversation to understand your situation, your goals, and whether working together is the right fit. No pressure. Just clarity.',
      'A deeper look at your organization, your leadership, and the specific challenges and opportunities in front of you. This shapes everything that follows.',
      'We design a coaching engagement around your specific goals — the format, frequency, focus areas, and success metrics that are right for your situation.',
      'Regular sessions, real work, and the accountability structures that keep progress moving. This is where the transformation happens.',
      'We track what matters, measure progress, and adjust the approach as needed. Results are the standard we hold ourselves to.'
    ][n-1]),
  }))

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&display=swap');
        :root { --ivory:#F7F4ED; --ivory-dark:#EDE8DC; --slate:#4C78A0; --slate-dark:#3A607F; --navy:#0D1B2A; --navy-mid:#1A2E45; --gold:#C9A23A; --gold-light:#D4B563; --white:#FFFFFF; --text-body:#2C3E50; --text-muted:#6B7A8D; }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:var(--ivory);color:var(--navy);font-family:'Inter',sans-serif;font-weight:300;overflow-x:hidden;}
        .btn{display:inline-flex;align-items:center;gap:10px;padding:15px 32px;font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;transition:all 0.25s;font-weight:500;cursor:pointer;border:none;font-family:'Inter',sans-serif;}
        .btn-primary{background:var(--navy);color:var(--ivory);} .btn-primary:hover{background:var(--slate);}
        .btn-outline-light{background:transparent;color:var(--ivory);border:1px solid rgba(247,244,237,0.4);} .btn-outline-light:hover{background:rgba(247,244,237,0.1);}
        .btn-gold{background:var(--gold);color:var(--navy);} .btn-gold:hover{background:var(--gold-light);}

        /* HERO */
        .page-hero{background:var(--slate);min-height:72vh;display:grid;grid-template-columns:1fr 1fr;position:relative;overflow:hidden;}
        .hero-left{display:flex;flex-direction:column;justify-content:center;padding:160px 64px 100px 72px;position:relative;z-index:2;}
        .hero-eyebrow{font-size:0.63rem;color:var(--gold);letter-spacing:0.22em;text-transform:uppercase;font-weight:500;margin-bottom:24px;display:flex;align-items:center;gap:12px;}
        .hero-eyebrow::before{content:'';width:32px;height:1px;background:var(--gold);}
        .breadcrumb{font-size:0.63rem;color:rgba(247,244,237,0.4);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:28px;display:flex;align-items:center;gap:8px;}
        .breadcrumb a{color:rgba(247,244,237,0.4);text-decoration:none;transition:color 0.2s;} .breadcrumb a:hover{color:var(--gold);}
        .page-hero-title{font-family:'Playfair Display',serif;font-size:clamp(40px,5vw,62px);font-weight:700;line-height:1.1;color:var(--white);margin-bottom:24px;letter-spacing:-0.02em;}
        .page-hero-title em{font-style:italic;color:var(--gold);}
        .page-hero-desc{font-size:1rem;line-height:1.8;color:rgba(247,244,237,0.75);max-width:480px;margin-bottom:40px;font-weight:300;}
        .hero-btns{display:flex;gap:14px;flex-wrap:wrap;}
        .hero-right{background:var(--slate-dark);position:relative;overflow:hidden;min-height:480px;}
        .hero-right-inner{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:48px;}
        .hero-accent-text{font-family:'Cormorant Garamond',serif;font-size:clamp(80px,12vw,160px);font-weight:700;color:rgba(255,255,255,0.04);line-height:1;position:absolute;bottom:-20px;right:-10px;letter-spacing:-0.04em;pointer-events:none;user-select:none;}

        /* INTRO */
        .intro{padding:100px 72px;background:var(--ivory);}
        .intro-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1.2fr 1fr;gap:80px;align-items:start;}
        .eyebrow{font-size:0.63rem;color:var(--gold);letter-spacing:0.2em;text-transform:uppercase;font-weight:500;margin-bottom:20px;display:flex;align-items:center;gap:10px;}
        .eyebrow::before{content:'';width:24px;height:1px;background:var(--gold);}
        .section-title{font-family:'Playfair Display',serif;font-size:clamp(28px,3.5vw,44px);font-weight:700;line-height:1.12;color:var(--navy);margin-bottom:24px;letter-spacing:-0.02em;}
        .section-title em{font-style:italic;color:var(--slate);}
        .body-text{font-size:0.95rem;line-height:1.85;color:var(--text-body);margin-bottom:20px;font-weight:300;}
        .credentials-list{display:flex;flex-direction:column;gap:0;margin-top:8px;}
        .credential-row{display:flex;align-items:baseline;gap:16px;padding:16px 0;border-bottom:1px solid rgba(13,27,42,0.08);}
        .credential-row:first-child{border-top:1px solid rgba(13,27,42,0.08);}
        .credential-num{font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:700;color:var(--gold);min-width:48px;line-height:1;}
        .credential-text{font-size:0.82rem;color:var(--text-muted);line-height:1.4;}

        /* OFFERINGS */
        .offerings{padding:100px 72px;background:var(--ivory-dark);}
        .offerings-inner{max-width:1100px;margin:0 auto;}
        .offerings-header{margin-bottom:64px;}
        .section-title-large{font-family:'Playfair Display',serif;font-size:clamp(32px,4vw,52px);font-weight:700;line-height:1.1;color:var(--navy);letter-spacing:-0.02em;}
        .section-title-large em{font-style:italic;color:var(--slate);}
        .offerings-list{display:flex;flex-direction:column;}
        .offering-row{display:grid;grid-template-columns:64px 1fr;gap:28px;align-items:start;padding:36px 0;border-top:1px solid rgba(13,27,42,0.1);transition:all 0.2s;}
        .offering-row:last-child{border-bottom:1px solid rgba(13,27,42,0.1);}
        .offering-num{font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:700;color:rgba(13,27,42,0.12);line-height:1;transition:color 0.2s;}
        .offering-row:hover .offering-num{color:rgba(76,120,160,0.25);}
        .offering-name{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:var(--navy);margin-bottom:8px;letter-spacing:-0.01em;transition:color 0.2s;}
        .offering-row:hover .offering-name{color:var(--slate);}
        .offering-desc{font-size:0.87rem;line-height:1.75;color:var(--text-muted);}

        /* WHO */
        .who{padding:100px 72px;background:var(--slate);}
        .who-inner{max-width:1100px;margin:0 auto;}
        .who-header{margin-bottom:64px;}
        .eyebrow-light{font-size:0.63rem;color:var(--gold);letter-spacing:0.2em;text-transform:uppercase;font-weight:500;margin-bottom:20px;display:flex;align-items:center;gap:10px;}
        .eyebrow-light::before{content:'';width:24px;height:1px;background:var(--gold);}
        .section-title-light{font-family:'Playfair Display',serif;font-size:clamp(28px,3.5vw,44px);font-weight:700;line-height:1.12;color:var(--white);letter-spacing:-0.02em;}
        .section-title-light em{font-style:italic;color:var(--gold);}
        .who-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;}
        .who-card{background:rgba(13,27,42,0.2);padding:40px 32px;transition:background 0.25s;}
        .who-card:hover{background:rgba(13,27,42,0.35);}
        .who-title{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:var(--white);margin-bottom:12px;letter-spacing:-0.01em;}
        .who-desc{font-size:0.87rem;line-height:1.75;color:rgba(247,244,237,0.65);}

        /* PROCESS */
        .process{padding:100px 72px;background:var(--ivory);}
        .process-inner{max-width:1100px;margin:0 auto;}
        .process-header{margin-bottom:64px;}
        .process-steps{display:flex;flex-direction:column;gap:0;}
        .process-step{display:grid;grid-template-columns:80px 1fr;gap:32px;align-items:start;padding:36px 0;border-top:1px solid rgba(13,27,42,0.08);transition:all 0.2s;}
        .process-step:last-child{border-bottom:1px solid rgba(13,27,42,0.08);}
        .step-num{font-family:'Cormorant Garamond',serif;font-size:2.5rem;font-weight:700;color:rgba(13,27,42,0.1);line-height:1;}
        .step-title{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:var(--navy);margin-bottom:8px;letter-spacing:-0.01em;}
        .step-desc{font-size:0.87rem;line-height:1.75;color:var(--text-muted);}

        /* FINAL CTA */
        .final-cta{background:var(--navy);padding:100px 72px;}
        .final-cta-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;}
        .cta-headline{font-family:'Playfair Display',serif;font-size:clamp(32px,4vw,48px);font-weight:700;line-height:1.1;color:var(--white);letter-spacing:-0.02em;}
        .cta-headline em{font-style:italic;color:var(--gold);}
        .cta-body{font-size:0.95rem;line-height:1.85;color:rgba(247,244,237,0.65);margin-bottom:32px;}

        @media(max-width:1024px){
          .page-hero{grid-template-columns:1fr;min-height:unset;}
          .hero-left{padding:140px 40px 60px;}
          .hero-right{min-height:320px;}
          .intro{padding:72px 40px;} .intro-inner{grid-template-columns:1fr;gap:48px;}
          .offerings{padding:72px 40px;}
          .who{padding:72px 40px;} .who-grid{grid-template-columns:1fr;}
          .process{padding:72px 40px;}
          .final-cta{padding:72px 40px;} .final-cta-inner{grid-template-columns:1fr;gap:40px;}
        }
        @media(max-width:640px){
          .hero-left{padding:120px 24px 48px;}
          .hero-btns{flex-direction:column;}
          .intro{padding:60px 24px;} .offerings{padding:60px 24px;}
          .who{padding:60px 24px;} .process{padding:60px 24px;} .final-cta{padding:60px 24px;}
          .credential-row{flex-direction:column;gap:4px;}
        }
      `}</style>

      <div className="page-hero">
        <div className="hero-left">
          <div className="breadcrumb"><a href="/">Home</a><span>→</span><span>Business Coaching</span></div>
          <div className="hero-eyebrow">For Organizations and Teams</div>
          <h1 className="page-hero-title">{g('headline','Coaching that moves')}<br /><em>{g('headline_accent','your business forward.')}</em></h1>
          <p className="page-hero-desc">{g('subheadline','Strategic coaching for executives, leadership teams, and organizations navigating change, growth, and transformation. Built on decades of real leadership experience.')}</p>
          <div className="hero-btns">
            <a href="/contact" className="btn btn-primary">Schedule a Conversation →</a>
            <a href="#offerings" className="btn btn-outline-light">View Offerings →</a>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-accent-text">BTH</div>
          <div className="hero-right-inner" />
        </div>
      </div>

      <section className="intro">
        <div className="intro-inner">
          <div>
            <div className="eyebrow">Why Business Coaching</div>
            <h2 className="section-title">{g('intro_title','The right guidance at the right time.')}</h2>
            <p className="body-text">{g('intro_body_1','Most leadership challenges are not about strategy — they are about execution, alignment, and the human dynamics that either drive or stall progress. Business coaching creates the conditions for your people and your organization to perform at their best.')}</p>
            <p className="body-text">{g('intro_body_2','John McCracken brings 30 years of high-stakes leadership experience to every engagement. From commanding naval operations to building organizations in the private sector, he has led through complexity — and he brings that same clarity to his clients.')}</p>
            <a href="/contact" className="btn btn-primary" style={{marginTop:12}}>Work with John →</a>
          </div>
          <div>
            <div className="credentials-list">
              {[
                {num:'30', label:'Years U.S. Navy leadership and command experience'},
                {num:'CAPT', label:'Commanding Officer, U.S. Navy (Ret.)'},
                {num:'EMBA', label:'Naval Postgraduate School'},
                {num:'ACC', label:'ICF Certified Coach'},
                {num:'DoD', label:'DoD Certified Executive Coach'},
              ].map((cred, i) => (
                <div key={i} className="credential-row">
                  <div className="credential-num">{cred.num}</div>
                  <div className="credential-text">{cred.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="offerings" id="offerings">
        <div className="offerings-inner">
          <div className="offerings-header">
            <div className="eyebrow">What I Offer</div>
            <h2 className="section-title-large">{g('offerings_headline','Business coaching programs.')}</h2>
          </div>
          <div className="offerings-list">
            {offerings.map((o, i) => (
              <div key={i} className="offering-row">
                <div className="offering-num">{o.num}</div>
                <div>
                  <div className="offering-name">{o.name}</div>
                  <div className="offering-desc">{o.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="who">
        <div className="who-inner">
          <div className="who-header">
            <div className="eyebrow-light">Who This Is For</div>
            <h2 className="section-title-light">{g('who_headline','Business coaching works best for leaders who are')} <em>ready.</em></h2>
          </div>
          <div className="who-grid">
            {whoCards.map((w, i) => (
              <div key={i} className="who-card">
                <div className="who-title">{w.title}</div>
                <div className="who-desc">{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="process">
        <div className="process-inner">
          <div className="process-header">
            <div className="eyebrow">How It Works</div>
            <h2 className="section-title-large">{g('process_headline','A structured path to')} <em style={{fontStyle:'italic',color:'var(--slate)'}}>results.</em></h2>
          </div>
          <div className="process-steps">
            {processSteps.map((s, i) => (
              <div key={i} className="process-step">
                <div className="step-num">0{i+1}</div>
                <div>
                  <div className="step-title">{s.title}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="final-cta-inner">
          <div className="cta-headline">Ready to invest in your <em>leadership?</em></div>
          <div>
            <p className="cta-body">{g('cta_desc','The first step is a conversation. No pitch. No pressure. Just a direct conversation about where you are and what is possible.')}</p>
            <a href="/contact" className="btn btn-gold">Schedule a Conversation →</a>
          </div>
        </div>
      </section>
    </>
  )
}