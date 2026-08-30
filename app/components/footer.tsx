export default function Footer() {
  const links = {
    Services: [
      { label: 'Business Coaching', href: '/business' },
      { label: 'Individual Coaching', href: '/individual' },
      { label: 'Executive Leadership', href: '/contact' },
      { label: 'Strategic Consulting', href: '/contact' },
    ],
    Company: [
      { label: 'About John', href: '/' },
      { label: 'Contact', href: '/contact' },
    ],
    Contact: [
      { label: 'john@mccrackencoaching.com', href: 'mailto:john@mccrackencoaching.com' },
      { label: '703.343.6960', href: 'tel:7033436960' },
    ],
  }

  return (
    <footer style={{background:'#0D1B2A', padding:'80px 60px 40px', borderTop:'1px solid rgba(201,162,58,0.15)'}}>
      <div style={{maxWidth:1200, margin:'0 auto'}}>
        <div style={{display:'grid', gridTemplateColumns:'1.5fr 1fr 1fr 1fr', gap:60, marginBottom:60}}>
          <div>
            <div style={{fontFamily:"'Playfair Display', serif", fontSize:'1.1rem', fontWeight:700, color:'#fff', marginBottom:4}}>
              Beyond the Horizon
            </div>
            <div style={{fontSize:'0.65rem', color:'#C9A23A', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:20}}>
              Executive Coaching and Consulting
            </div>
            <p style={{fontSize:'0.82rem', lineHeight:1.75, color:'rgba(247,244,237,0.35)'}}>
              Strategic coaching and consulting for leaders who are ready to navigate change, unlock potential, and create lasting impact.
            </p>
          </div>
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <div style={{fontSize:'0.65rem', color:'#C9A23A', letterSpacing:'0.15em', textTransform:'uppercase', fontWeight:600, marginBottom:20}}>
                {title}
              </div>
              {items.map(item => (
                <a key={item.href} href={item.href} style={{
                  display:'block', fontSize:'0.82rem',
                  color:'rgba(247,244,237,0.45)', textDecoration:'none',
                  marginBottom:12, transition:'color 0.2s',
                }}
                onMouseEnter={e=>(e.target as HTMLElement).style.color='#fff'}
                onMouseLeave={e=>(e.target as HTMLElement).style.color='rgba(247,244,237,0.45)'}
                >
                  {item.label}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div style={{borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:28, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12}}>
          <div style={{fontSize:'0.75rem', color:'rgba(247,244,237,0.25)'}}>
            © 2026 Beyond the Horizon Executive Coaching and Consulting. All rights reserved.
          </div>
          <div style={{fontSize:'0.75rem', color:'rgba(247,244,237,0.25)'}}>
            Made with <span style={{color:'#C9A23A'}}>♥</span> by{' '}
            <a href="https://alantevelez.com" target="_blank" style={{color:'rgba(247,244,237,0.4)', textDecoration:'none', transition:'color 0.2s'}}
            onMouseEnter={e=>(e.target as HTMLElement).style.color='#C9A23A'}
            onMouseLeave={e=>(e.target as HTMLElement).style.color='rgba(247,244,237,0.4)'}
            >
              Alante Velez
            </a>
          </div>
          <div style={{width:40, height:2, background:'#C9A23A', opacity:0.4}} />
        </div>
      </div>
    </footer>
  )
}