import { createClient } from '@supabase/supabase-js'

export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getData() {
  const { data } = await supabase.from('pages').select('content').eq('slug', 'individual').single()
  return (data?.content || {}) as Record<string, string>
}

export default async function IndividualCoaching() {
  const c = await getData()
  const g = (key: string, fallback: string) => c[key] || fallback

  const programs = [1,2,3,4].map(n => ({
    tag: g(`program${n}_tag`, ['Most Popular','Career Transition','Executive','Ongoing'][n-1]),
    name: g(`program${n}_name`, ['Leadership Accelerator','Next Chapter Coaching','Executive Presence','Ongoing Partnership'][n-1]),
    desc: g(`program${n}_desc`, [
      'A focused 3-month engagement for professionals stepping into or growing within a leadership role. Build the foundation, confidence, and skills to lead effectively from day one.',
      'For professionals navigating a career change, promotion, or major professional transition. Gain clarity on your direction and a concrete plan to get there.',
      'A deep dive into the skills, mindset, and habits that define exceptional executives. Designed for senior leaders who want to operate at their highest level.',
      'A long-term coaching relationship for leaders who want consistent support, accountability, and a thinking partner as their career evolves.'
    ][n-1]),
  }))

  const outcomes = [1,2,3,4,5,6].map(n => ({
    title: g(`outcome${n}_title`, ['Clarity','Confidence','Focus','Influence','Performance','Growth'][n-1]),
    desc: g(`outcome${n}_desc`, [
      'Know exactly where you are going and why. Eliminate the noise and confusion that keeps you stuck.',
      'Lead with conviction. Make decisions faster and with greater certainty in your own judgment.',
      'Identify what actually moves the needle and build the discipline to stay focused on what matters most.',
      'Communicate with greater impact, build stronger relationships, and lead others more effectively.',
      'Consistently show up at your best and build the habits and systems that sustain high performance.',
      'Become the leader you know you are capable of being — and lay the foundation for continued growth.'
    ][n-1]),
  }))

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&display=swap');
        :root{--ivory:#F7F4ED;--ivory-dark:#EDE8DC;--slate:#4C78A0;--slate-dark:#3A607F;--navy:#0D1B2A;--gold:#C9A23A;--gold-light:#D4B563;--white:#FFFFFF;--text-body:#2C3E50;--text-muted:#6B7A8D;}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:var(--ivory);color:var(--navy);font-family:'Inter',sans-serif;font-weight:300;overflow-x:hidden;}
        .btn{display:inline-flex;align-items:center;gap:10px;padding:15px 32px;font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;transition:all 0.25s;font-weight:500;cursor:pointer;border:none;font-family:'Inter',sans-serif;}
        .btn-primary{background:var(--navy);color:var(--ivory);} .btn-primary:hover{background:var(--slate);}
        .btn-outline-light{background:transparent;color:var(--ivory);border:1px solid rgba(247,244,237,0.4);} .btn-outline-light:hover{background:rgba(247,244,237,0.1);}
        .btn-navy{background:var(--navy);color:var(--ivory);} .btn-navy:hover{background:var(--slate);}

        .page-hero{background:var(--ivory);min-height:72vh;display:grid;grid-template-columns:1fr 1fr;position:relative;overflow:hidden;}
        .hero-left{display:flex;flex-direction:column;justify-content:center;padding:160px 64px 100px 72px;position:relative;z-index:2;}
        .breadcrumb{font-size:0.63rem;color:var(--text-muted);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:28px;display:flex;align-items:center;gap:8px;}
        .breadcrumb a{color:var(--text-muted);text-decoration:none;transition:color 0.2s;} .breadcrumb a:hover{color:var(--gold);}
        .hero-eyebrow{font-size:0.63rem;color:var(--gold);letter-spacing:0.22em;text-transform:uppercase;font-weight:500;margin-bottom:24px;display:flex;align-items:center;gap:12px;}
        .hero-eyebrow::before{content:'';width:32px;height:1px;background:var(--gold);}
        .page-hero-title{font-family:'Playfair Display',serif;font-size:clamp(40px,5vw,62px);font-weight:700;line-height:1.1;color:var(--navy);margin-bottom:24px;letter-spacing:-0.02em;}
        .page-hero-title em{font-style:italic;color:var(--slate);}
        .page-hero-desc{font-size:1rem;line-height:1.8;color:var(--text-body);max-width:480px;margin-bottom:40px;font-weight:300;}
        .hero-btns{display:flex;gap:14px;flex-wrap:wrap;}
        .hero-right{background:var(--slate);position:relative;overflow:hidden;min-height:480px;display:flex;align-items:center;justify-content:center;}
        .hero-right-quote{position:relative;z-index:2;padding:48px 40px;max-width:380px;}
        .hero-quote-text{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-style:italic;line-height:1.6;color:var(--white);margin-bottom:20px;}
        .hero-quote-attr{font-size:0.65rem;color:var(--gold);letter-spacing:0.15em;text-transform:uppercase;}
        .hero-accent-bg{position:absolute;inset:0;opacity:0.04;background-image:repeating-linear-gradient(45deg,var(--gold) 0,var(--gold) 1px,transparent 0,transparent 50%);background-size:28px 28px;}

        .intro{padding:100px 72px;background:var(--ivory);}
        .intro-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start;}
        .eyebrow{font-size:0.63rem;color:var(--gold);letter-spacing:0.2em;text-transform:uppercase;font-weight:500;margin-bottom:20px;display:flex;align-items:center;gap:10px;}
        .eyebrow::before{content:'';width:24px;height:1px;background:var(--gold);}
        .section-title{font-family:'Playfair Display',serif;font-size:clamp(28px,3.5vw,44px);font-weight:700;line-height:1.12;color:var(--navy);margin-bottom:24px;letter-spacing:-0.02em;}
        .section-title em{font-style:italic;color:var(--slate);}
        .body-text{font-size:0.95rem;line-height:1.85;color:var(--text-body);margin-bottom:20px;font-weight:300;}
        .pull-quote{border-left:2px solid var(--gold);padding:20px 24px;background:var(--ivory-dark);margin:24px 0;}
        .pull-quote p{font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-style:italic;line-height:1.65;color:var(--navy);}
        .what-to-expect{background:var(--navy);padding:32px 36px;}
        .expect-title{font-size:0.63rem;color:var(--gold);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:24px;}
        .expect-item{display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:0.87rem;color:rgba(247,244,237,0.65);line-height:1.6;}
        .expect-item:last-child{border-bottom:none;}
        .expect-item::before{content:'';width:16px;height:1px;background:var(--gold);flex-shrink:0;}

        .programs{padding:100px 72px;background:var(--ivory-dark);}
        .programs-inner{max-width:1100px;margin:0 auto;}
        .programs-header{margin-bottom:64px;}
        .section-title-large{font-family:'Playfair Display',serif;font-size:clamp(32px,4vw,52px);font-weight:700;line-height:1.1;color:var(--navy);letter-spacing:-0.02em;}
        .section-title-large em{font-style:italic;color:var(--slate);}
        .programs-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px;}
        .program-card{background:var(--white);padding:44px 36px;border-bottom:3px solid transparent;transition:border-color 0.3s;}
        .program-card:hover{border-bottom-color:var(--gold);}
        .program-tag{font-size:0.62rem;color:var(--gold);letter-spacing:0.15em;text-transform:uppercase;font-weight:600;margin-bottom:14px;}
        .program-name{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:700;color:var(--navy);margin-bottom:12px;letter-spacing:-0.01em;}
        .program-desc{font-size:0.87rem;line-height:1.75;color:var(--text-muted);}

        .outcomes{padding:100px 72px;background:var(--slate);}
        .outcomes-inner{max-width:1100px;margin:0 auto;}
        .outcomes-header{margin-bottom:64px;}
        .eyebrow-light{font-size:0.63rem;color:var(--gold);letter-spacing:0.2em;text-transform:uppercase;font-weight:500;margin-bottom:20px;display:flex;align-items:center;gap:10px;}
        .eyebrow-light::before{content:'';width:24px;height:1px;background:var(--gold);}
        .section-title-light{font-family:'Playfair Display',serif;font-size:clamp(28px,3.5vw,44px);font-weight:700;line-height:1.12;color:var(--white);letter-spacing:-0.02em;}
        .outcomes-list{display:flex;flex-direction:column;}
        .outcome-row{display:grid;grid-template-columns:180px 1fr;gap:24px;align-items:baseline;padding:28px 0;border-top:1px solid rgba(255,255,255,0.1);}
        .outcome-row:last-child{border-bottom:1px solid rgba(255,255,255,0.1);}
        .outcome-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:var(--white);}
        .outcome-desc{font-size:0.87rem;line-height:1.75;color:rgba(247,244,237,0.65);}

        .final-cta{background:var(--ivory);padding:100px 72px;}
        .final-cta-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;}
        .cta-headline{font-family:'Playfair Display',serif;font-size:clamp(32px,4vw,48px);font-weight:700;line-height:1.1;color:var(--navy);letter-spacing:-0.02em;}
        .cta-headline em{font-style:italic;color:var(--slate);}
        .cta-body{font-size:0.95rem;line-height:1.85;color:var(--text-muted);margin-bottom:32px;}

        @media(max-width:1024px){
          .page-hero{grid-template-columns:1fr;min-height:unset;}
          .hero-left{padding:140px 40px 60px;}
          .hero-right{min-height:280px;}
          .intro{padding:72px 40px;} .intro-inner{grid-template-columns:1fr;gap:48px;}
          .programs{padding:72px 40px;} .programs-grid{grid-template-columns:1fr;}
          .outcomes{padding:72px 40px;}
          .outcome-row{grid-template-columns:1fr;gap:8px;}
          .final-cta{padding:72px 40px;} .final-cta-inner{grid-template-columns:1fr;gap:40px;}
        }
        @media(max-width:640px){
          .hero-left{padding:120px 24px 48px;}
          .hero-btns{flex-direction:column;}
          .intro{padding:60px 24px;} .programs{padding:60px 24px;} .outcomes{padding:60px 24px;} .final-cta{padding:60px 24px;}
        }
      `}</style>

      <div className="page-hero">
        <div className="hero-left">
          <div className="breadcrumb"><a href="/">Home</a><span>→</span><span>Individual Coaching</span></div>
          <div className="hero-eyebrow">One on One Coaching</div>
          <h1 className="page-hero-title">{g('headline','Invest in the leader')}<br /><em>{g('headline_accent','you are becoming.')}</em></h1>
          <p className="page-hero-desc">{g('subheadline','Personalized coaching for professionals and leaders who are ready to grow, transition, or unlock the next level of their potential. Built around you.')}</p>
          <div className="hero-btns">
            <a href="/contact" className="btn btn-primary">Schedule a Conversation →</a>
            <a href="#programs" className="btn-outline-light btn" style={{borderColor:'rgba(13,27,42,0.3)',color:'var(--navy)'}}>View Programs →</a>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-accent-bg" />
          <div className="hero-right-quote">
            <div className="hero-quote-text">{g('intro_quote','"The goal is not to become someone different. It is to become a more fully realized version of who you already are."')}</div>
            <div className="hero-quote-attr">John McCracken</div>
          </div>
        </div>
      </div>

      <section className="intro">
        <div className="intro-inner">
          <div>
            <div className="eyebrow">About Individual Coaching</div>
            <h2 className="section-title">{g('intro_title','Coaching built around')} <em>you.</em></h2>
            <p className="body-text">{g('intro_body_1','Individual coaching is a deeply personal investment. It is not about following a script — it is about having a trusted thinking partner who challenges you, holds you accountable, and helps you see what you cannot see on your own.')}</p>
            <p className="body-text">{g('intro_body_2','John brings the same discipline and strategic clarity that defined his naval career to every individual coaching relationship. The sessions are direct, practical, and always focused on what moves you forward.')}</p>
            <div className="pull-quote">
              <p>{g('pull_quote','Coaching that follows your lead. You bring what is most present — the decision, the challenge, the thing you cannot stop thinking about. We work through it together.')}</p>
            </div>
          </div>
          <div className="what-to-expect">
            <div className="expect-title">What to expect</div>
            {[
              'A structured but flexible coaching relationship',
              'Sessions tailored to your goals and pace',
              'Direct, honest feedback without sugarcoating',
              'Accountability between sessions',
              'Tools and frameworks you can apply immediately',
              'A trusted thinking partner invested in your growth',
            ].map((item, i) => (
              <div key={i} className="expect-item">{item}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="programs" id="programs">
        <div className="programs-inner">
          <div className="programs-header">
            <div className="eyebrow">Coaching Programs</div>
            <h2 className="section-title-large">{g('programs_headline','Find the right program for')} <em>you.</em></h2>
          </div>
          <div className="programs-grid">
            {programs.map((p, i) => (
              <div key={i} className="program-card">
                <div className="program-tag">{p.tag}</div>
                <div className="program-name">{p.name}</div>
                <div className="program-desc">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="outcomes">
        <div className="outcomes-inner">
          <div className="outcomes-header">
            <div className="eyebrow-light">What You Gain</div>
            <h2 className="section-title-light">{g('outcomes_headline','Real outcomes for real leaders.')}</h2>
          </div>
          <div className="outcomes-list">
            {outcomes.map((o, i) => (
              <div key={i} className="outcome-row">
                <div className="outcome-title">{o.title}</div>
                <div className="outcome-desc">{o.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="final-cta-inner">
          <div className="cta-headline">Your growth starts with a <em>conversation.</em></div>
          <div>
            <p className="cta-body">{g('cta_desc','Schedule a complimentary discovery call. No commitment, no pressure — just an honest conversation about where you are and where you want to go.')}</p>
            <a href="/contact" className="btn btn-primary">Schedule a Discovery Call →</a>
          </div>
        </div>
      </section>
    </>
  )
}