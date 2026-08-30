'use client'

'use client'

import { useEffect } from 'react'

export default function Nav() {
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('nav') as HTMLElement
      if (nav) nav.style.background = window.scrollY > 60
        ? 'rgba(247,244,237,0.98)'
        : 'rgba(247,244,237,0.95)'
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      padding: '20px 60px', display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', zIndex: 100,
      background: 'rgba(247,244,237,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(13,27,42,0.1)',
      transition: 'background 0.3s',
    }}>
      <a href="/" style={{display:'flex',alignItems:'center',gap:14,textDecoration:'none'}}>
        <div>
          <div style={{fontFamily:"'Playfair Display', serif",fontSize:'1rem',fontWeight:700,color:'#0D1B2A',letterSpacing:'0.04em',lineHeight:1.1}}>
            Beyond the Horizon
          </div>
          <div style={{fontSize:'0.6rem',color:'#C9A23A',letterSpacing:'0.18em',textTransform:'uppercase',fontWeight:500}}>
            Executive Coaching and Consulting
          </div>
        </div>
      </a>
      <div style={{display:'flex',gap:36,alignItems:'center'}}>
        {[
          { label: 'Business Coaching', href: '/business' },
          { label: 'Individual Coaching', href: '/individual' },
          { label: 'Contact', href: '/contact' },
        ].map(link => (
          <a key={link.href} href={link.href} style={{
            fontSize:'0.75rem', color:'#6B7A8D', textDecoration:'none',
            letterSpacing:'0.08em', textTransform:'uppercase',
            transition:'color 0.2s', fontWeight:500,
          }}
          onMouseEnter={e=>(e.target as HTMLElement).style.color='#0D1B2A'}
          onMouseLeave={e=>(e.target as HTMLElement).style.color='#6B7A8D'}
          >
            {link.label}
          </a>
        ))}
      </div>
      <a href="/contact" style={{
        background:'#0D1B2A', color:'#F7F4ED',
        padding:'12px 28px', fontSize:'0.72rem',
        letterSpacing:'0.1em', textTransform:'uppercase',
        textDecoration:'none', transition:'all 0.3s', fontWeight:500,
      }}
      onMouseEnter={e=>{(e.target as HTMLElement).style.background='#C9A23A';(e.target as HTMLElement).style.color='#0D1B2A'}}
      onMouseLeave={e=>{(e.target as HTMLElement).style.background='#0D1B2A';(e.target as HTMLElement).style.color='#F7F4ED'}}
      >
        Schedule a Session
      </a>
    </nav>
  )
}