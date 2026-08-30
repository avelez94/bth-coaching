'use client'

import { useEffect, useRef } from 'react'

export default function Home() {

  useEffect(() => {
    // Scroll reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' })

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

    // Counter animation
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement
          const target = el.getAttribute('data-target')
          if (!target) return
          const isNum = !isNaN(Number(target))
          if (isNum) {
            const num = parseInt(target)
            let start = 0
            const duration = 1800
            const step = (timestamp: number) => {
              if (!start) start = timestamp
              const progress = Math.min((timestamp - start) / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 3)
              el.textContent = Math.floor(eased * num) + (el.getAttribute('data-suffix') || '')
              if (progress < 1) requestAnimationFrame(step)
            }
            requestAnimationFrame(step)
          }
          counterObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.5 })

    document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el))

    // Parallax hero
    const handleScroll = () => {
      const hero = document.querySelector('.hero-bg') as HTMLElement
      const pattern = document.querySelector('.hero-pattern') as HTMLElement
      if (hero) hero.style.transform = `translateY(${window.scrollY * 0.3}px)`
      if (pattern) pattern.style.transform = `translateY(${window.scrollY * 0.15}px)`

      // Nav scroll
      const nav = document.querySelector('nav') as HTMLElement
      if (nav) nav.style.background = window.scrollY > 60 ? 'rgba(247,244,237,0.98)' : 'rgba(247,244,237,0.95)'
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // Magnetic buttons
    const buttons = document.querySelectorAll('.btn-magnetic')
    buttons.forEach(btn => {
      const el = btn as HTMLElement
      el.addEventListener('mousemove', (e: Event) => {
        const evt = e as MouseEvent
        const rect = el.getBoundingClientRect()
        const x = evt.clientX - rect.left - rect.width / 2
        const y = evt.clientY - rect.top - rect.height / 2
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`
      })
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)'
      })
    })

    // Text split animation on headlines
    document.querySelectorAll('.split-text').forEach(el => {
      const words = el.textContent?.split(' ') || []
      el.innerHTML = words.map((word, i) =>
        `<span class="word" style="animation-delay:${i * 0.08}s">${word}</span>`
      ).join(' ')
    })

    return () => {
      observer.disconnect()
      counterObserver.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <style>{`
        :root {
          --navy: #0D1B2A;
          --navy-mid: #1A2E45;
          --slate: #4C78A0;
          --slate-light: #6B9ABF;
          --gold: #C9A23A;
          --gold-light: #D4B563;
          --ivory: #F7F4ED;
          --ivory-dark: #EDE8DC;
          --white: #FFFFFF;
          --text-body: #2C3E50;
          --text-muted: #6B7A8D;
          --border: rgba(13,27,42,0.1);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: var(--ivory); color: var(--navy); font-family: 'Inter', sans-serif; font-weight: 300; overflow-x: hidden; }

        /* REVEAL ANIMATIONS */
        .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .reveal.delay-1 { transition-delay: 0.1s; }
        .reveal.delay-2 { transition-delay: 0.2s; }
        .reveal.delay-3 { transition-delay: 0.3s; }
        .reveal.delay-4 { transition-delay: 0.4s; }
        .reveal.delay-5 { transition-delay: 0.5s; }
        .reveal.revealed { opacity: 1; transform: translateY(0); }

        /* SPLIT TEXT */
        .split-text .word { display: inline-block; opacity: 0; transform: translateY(20px); animation: none; }
        .split-text.revealed .word { animation: wordIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes wordIn { to { opacity: 1; transform: translateY(0); } }

        /* MAGNETIC */
        .btn-magnetic { transition: transform 0.3s cubic-bezier(0.16,1,0.3,1) !important; }

        /* NAV */
        nav { position: fixed; top: 0; left: 0; right: 0; padding: 20px 60px; display: flex; justify-content: space-between; align-items: center; z-index: 100; background: rgba(247,244,237,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); transition: background 0.3s; }
        .nav-brand { display: flex; align-items: center; gap: 14px; text-decoration: none; }
        .nav-logo-text { display: flex; flex-direction: column; }
        .nav-name { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 700; color: var(--navy); letter-spacing: 0.04em; line-height: 1.1; }
        .nav-sub { font-size: 0.6rem; color: var(--gold); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 500; }
        .nav-links { display: flex; gap: 36px; align-items: center; }
        .nav-links a { font-size: 0.75rem; color: var(--text-muted); text-decoration: none; letter-spacing: 0.08em; text-transform: uppercase; transition: color 0.2s; font-weight: 500; }
        .nav-links a:hover { color: var(--navy); }
        .nav-cta { background: var(--navy); color: var(--ivory); padding: 12px 28px; font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: all 0.3s; font-weight: 500; }
        .nav-cta:hover { background: var(--gold); color: var(--navy); }

        /* HERO */
        .hero { min-height: 100vh; background: var(--navy); position: relative; overflow: hidden; display: flex; align-items: center; }
        .hero-bg { position: absolute; inset: 0; background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 50%, #1B3A5C 100%); will-change: transform; }
        .hero-pattern { position: absolute; inset: 0; opacity: 0.04; background-image: repeating-linear-gradient(45deg, var(--gold) 0, var(--gold) 1px, transparent 0, transparent 50%); background-size: 30px 30px; will-change: transform; }
        .hero-gold-line { position: absolute; left: 0; right: 0; bottom: 0; height: 4px; background: linear-gradient(90deg, transparent, var(--gold), transparent); animation: shimmer 3s ease-in-out infinite; }
        @keyframes shimmer { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        .hero-content { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; padding: 140px 60px 100px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; width: 100%; }
        .hero-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 28px; opacity: 0; animation: fadeUp 0.8s 0.2s cubic-bezier(0.16,1,0.3,1) forwards; }
        .hero-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--gold); }
        .hero-headline { font-family: 'Cormorant Garamond', serif; font-size: clamp(52px, 6.5vw, 82px); font-weight: 600; line-height: 1.02; color: var(--white); margin-bottom: 28px; letter-spacing: -0.01em; opacity: 0; animation: fadeUp 0.9s 0.35s cubic-bezier(0.16,1,0.3,1) forwards; }
        .hero-headline em { font-style: italic; color: var(--gold); }
        .hero-desc { font-size: 1rem; line-height: 1.8; color: rgba(247,244,237,0.7); margin-bottom: 44px; max-width: 460px; opacity: 0; animation: fadeUp 0.9s 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
        .hero-btns { display: flex; gap: 16px; flex-wrap: wrap; opacity: 0; animation: fadeUp 0.9s 0.65s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } from { opacity: 0; transform: translateY(24px); } }
        .btn { display: inline-flex; align-items: center; gap: 10px; padding: 16px 36px; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: all 0.3s cubic-bezier(0.16,1,0.3,1); font-weight: 500; cursor: pointer; border: none; }
        .btn-gold { background: var(--gold); color: var(--navy); }
        .btn-gold:hover { background: var(--gold-light); }
        .btn-outline { background: transparent; color: var(--ivory); border: 1px solid rgba(247,244,237,0.3); }
        .btn-outline:hover { border-color: var(--gold); color: var(--gold); }
        .hero-right { display: flex; flex-direction: column; gap: 16px; opacity: 0; animation: fadeIn 1.2s 0.8s ease forwards; }
        @keyframes fadeIn { to { opacity: 1; } }
        .hero-stat-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(201,162,58,0.2); padding: 28px 32px; backdrop-filter: blur(10px); transition: all 0.3s; }
        .hero-stat-card:hover { background: rgba(201,162,58,0.08); border-color: rgba(201,162,58,0.4); transform: translateX(6px); }
        .hero-stat-card:first-child { border-left: 3px solid var(--gold); }
        .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 3rem; font-weight: 700; color: var(--gold); line-height: 1; margin-bottom: 6px; }
        .stat-label { font-size: 0.8rem; color: rgba(247,244,237,0.6); letter-spacing: 0.06em; line-height: 1.5; }

        /* INTRO STRIP */
        .intro-strip { background: var(--gold); padding: 20px 60px; display: flex; justify-content: center; gap: 60px; align-items: center; overflow: hidden; }
        .intro-item { font-size: 0.72rem; color: var(--navy); letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; white-space: nowrap; }
        .intro-dot { width: 4px; height: 4px; background: var(--navy); border-radius: 50%; opacity: 0.4; flex-shrink: 0; }

        /* ABOUT */
        .about { padding: 140px 60px; background: var(--ivory); }
        .about-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 100px; align-items: center; }
        .about-image { position: relative; }
        .about-photo { width: 100%; aspect-ratio: 3/4; background: linear-gradient(135deg, var(--navy-mid), var(--slate)); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.2); font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; overflow: hidden; }
        .about-photo::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(13,27,42,0.3), transparent); }
        .about-badge { position: absolute; bottom: -20px; right: -20px; background: var(--gold); padding: 24px 28px; }
        .about-badge-num { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 700; color: var(--navy); line-height: 1; }
        .about-badge-label { font-size: 0.65rem; color: var(--navy); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; opacity: 0.7; }
        .eyebrow { font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
        .section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px, 4vw, 54px); font-weight: 600; line-height: 1.08; color: var(--navy); margin-bottom: 24px; letter-spacing: -0.01em; }
        .section-title em { font-style: italic; color: var(--slate); }
        .body-text { font-size: 0.95rem; line-height: 1.85; color: var(--text-body); margin-bottom: 20px; }
        .credentials { display: flex; flex-direction: column; gap: 10px; margin: 32px 0; }
        .credential { display: flex; align-items: center; gap: 12px; font-size: 0.85rem; color: var(--text-muted); }
        .credential::before { content: ''; width: 20px; height: 1px; background: var(--gold); flex-shrink: 0; }
        .btn-navy { background: var(--navy); color: var(--ivory); }
        .btn-navy:hover { background: var(--navy-mid); }

        /* SERVICES */
        .services { padding: 140px 60px; background: var(--navy); }
        .services-inner { max-width: 1200px; margin: 0 auto; }
        .services-header { margin-bottom: 64px; }
        .eyebrow-light { font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .eyebrow-light::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
        .section-title-light { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px, 4vw, 54px); font-weight: 600; line-height: 1.08; color: var(--white); letter-spacing: -0.01em; }
        .section-title-light em { font-style: italic; color: var(--gold); }
        .services-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
        .service-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); padding: 48px 40px; transition: all 0.4s cubic-bezier(0.16,1,0.3,1); cursor: pointer; position: relative; overflow: hidden; }
        .service-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 0; background: var(--gold); transition: width 0.3s ease; }
        .service-card:hover::before { width: 3px; }
        .service-card:hover { background: rgba(201,162,58,0.06); border-color: rgba(201,162,58,0.2); transform: translateY(-4px); }
        .service-num { font-family: 'Cormorant Garamond', serif; font-size: 3rem; font-weight: 700; color: rgba(201,162,58,0.15); line-height: 1; margin-bottom: 20px; transition: color 0.3s; }
        .service-card:hover .service-num { color: rgba(201,162,58,0.3); }
        .service-name { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 600; color: var(--white); margin-bottom: 14px; }
        .service-desc { font-size: 0.88rem; line-height: 1.75; color: rgba(247,244,237,0.5); margin-bottom: 28px; }
        .service-link { font-size: 0.7rem; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: gap 0.3s; font-weight: 500; }
        .service-link:hover { gap: 14px; }

        /* APPROACH */
        .approach { padding: 140px 60px; background: var(--ivory-dark); }
        .approach-inner { max-width: 1200px; margin: 0 auto; }
        .approach-header { text-align: center; margin-bottom: 80px; }
        .approach-header .eyebrow { justify-content: center; }
        .approach-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
        .approach-card { background: var(--white); padding: 48px 36px; border-bottom: 3px solid transparent; transition: all 0.4s cubic-bezier(0.16,1,0.3,1); }
        .approach-card:hover { border-bottom-color: var(--gold); transform: translateY(-8px); box-shadow: 0 20px 60px rgba(13,27,42,0.08); }
        .approach-icon { width: 56px; height: 56px; background: var(--navy); display: flex; align-items: center; justify-content: center; margin-bottom: 24px; transition: background 0.3s; }
        .approach-card:hover .approach-icon { background: var(--gold); }
        .approach-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 600; color: var(--navy); margin-bottom: 14px; }
        .approach-desc { font-size: 0.88rem; line-height: 1.75; color: var(--text-muted); }

        /* TESTIMONIALS */
        .testimonials { padding: 140px 60px; background: var(--navy); }
        .testimonials-inner { max-width: 1200px; margin: 0 auto; }
        .testimonials-header { text-align: center; margin-bottom: 64px; }
        .testimonials-header .eyebrow-light { justify-content: center; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .testimonial-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 40px 32px; transition: all 0.4s cubic-bezier(0.16,1,0.3,1); }
        .testimonial-card:hover { background: rgba(255,255,255,0.07); transform: translateY(-6px); border-color: rgba(201,162,58,0.2); }
        .testimonial-quote { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-style: italic; line-height: 1.7; color: rgba(247,244,237,0.75); margin-bottom: 28px; }
        .quote-mark { font-size: 4rem; color: var(--gold); opacity: 0.25; line-height: 0; vertical-align: -0.5em; display: inline-block; margin-right: 4px; font-family: 'Cormorant Garamond', serif; }
        .testimonial-author { font-size: 0.8rem; color: var(--gold); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500; }
        .testimonial-role { font-size: 0.75rem; color: rgba(247,244,237,0.35); margin-top: 4px; }

        /* CTA */
        .cta-section { padding: 140px 60px; background: var(--ivory); }
        .cta-inner { max-width: 800px; margin: 0 auto; text-align: center; }
        .cta-inner .eyebrow { justify-content: center; }
        .cta-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(44px, 6vw, 72px); font-weight: 600; line-height: 1.05; color: var(--navy); margin-bottom: 24px; }
        .cta-title em { font-style: italic; color: var(--gold); }
        .cta-desc { font-size: 1rem; line-height: 1.8; color: var(--text-muted); margin-bottom: 44px; }
        .cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .btn-outline-navy { background: transparent; color: var(--navy); border: 1px solid rgba(13,27,42,0.25); }
        .btn-outline-navy:hover { border-color: var(--navy); }

        /* FOOTER */
        footer { background: var(--navy); padding: 80px 60px 40px; border-top: 1px solid rgba(201,162,58,0.15); }
        .footer-inner { max-width: 1200px; margin: 0 auto; }
        .footer-top { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 60px; margin-bottom: 60px; }
        .footer-brand-name { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: var(--white); margin-bottom: 4px; }
        .footer-brand-sub { font-size: 0.65rem; color: var(--gold); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 20px; }
        .footer-desc { font-size: 0.82rem; line-height: 1.75; color: rgba(247,244,237,0.35); }
        .footer-col-title { font-size: 0.65rem; color: var(--gold); letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; margin-bottom: 20px; }
        .footer-col a { display: block; font-size: 0.82rem; color: rgba(247,244,237,0.45); text-decoration: none; margin-bottom: 12px; transition: color 0.2s; }
        .footer-col a:hover { color: var(--white); }
        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 28px; display: flex; justify-content: space-between; align-items: center; }
        .footer-copy { font-size: 0.75rem; color: rgba(247,244,237,0.25); }
        .footer-gold-line { width: 40px; height: 2px; background: var(--gold); opacity: 0.4; }

        @media (max-width: 900px) {
          .hero-content { grid-template-columns: 1fr; padding: 120px 24px 80px; gap: 48px; }
          .hero-headline { font-size: clamp(40px, 10vw, 64px); }
          .hero-right { flex-direction: row; flex-wrap: wrap; gap: 12px; }
          .hero-stat-card { flex: 1; min-width: 140px; padding: 20px; }
          .stat-num { font-size: 2rem; }
          .about { padding: 80px 24px; }
          .about-inner { grid-template-columns: 1fr; gap: 48px; }
          .about-photo { aspect-ratio: 4/3; }
          .about-badge { display: none; }
          .services { padding: 80px 24px; }
          .services-grid { grid-template-columns: 1fr; }
          .service-card { padding: 32px 24px; }
          .approach { padding: 80px 24px; }
          .approach-grid { grid-template-columns: 1fr; gap: 20px; }
          .approach-card { padding: 32px 24px; }
          .testimonials { padding: 80px 24px; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .testimonial-card { padding: 28px 24px; }
          .cta-section { padding: 80px 24px; }
          .cta-title { font-size: clamp(36px, 8vw, 56px); }
          .intro-strip { gap: 16px; padding: 14px 24px; flex-wrap: wrap; justify-content: flex-start; }
          .section-title { font-size: clamp(32px, 6vw, 48px); }
          .section-title-light { font-size: clamp(32px, 6vw, 48px); }
        }
        @media (max-width: 540px) {
          .hero-content { padding: 100px 20px 60px; }
          .hero-headline { font-size: clamp(36px, 9vw, 52px); }
          .hero-right { flex-direction: column; }
          .hero-stat-card { min-width: unset; }
          .hero-btns { flex-direction: column; }
          .hero-btns .btn { width: 100%; justify-content: center; }
          .cta-btns { flex-direction: column; align-items: center; }
          .cta-btns .btn { width: 100%; justify-content: center; }
          .services-header { gap: 12px; }
          .testimonials-header, .approach-header, .cta-inner { text-align: left; }
          .testimonials-header .eyebrow-light, .approach-header .eyebrow, .cta-inner .eyebrow { justify-content: flex-start; }
        }
      `}</style>

      <nav>
        <a href="/" className="nav-brand">
          <div className="nav-logo-text">
            <div className="nav-name">Beyond the Horizon</div>
            <div className="nav-sub">Executive Coaching and Consulting</div>
          </div>
        </a>
        <div className="nav-links">
          <a href="/business">Business Coaching</a>
          <a href="/individual">Individual Coaching</a>
          <a href="/contact">Contact</a>
        </div>
        <a href="/contact" className="nav-cta btn-magnetic">Schedule a Session</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-pattern" />
        <div className="hero-gold-line" />
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-eyebrow">Executive Coaching and Consulting</div>
            <h1 className="hero-headline">
              Navigate.<br />
              Elevate.<br />
              <em>Transform.</em>
            </h1>
            <p className="hero-desc">Strategic guidance for leaders who are ready to go beyond the horizon. Executive coaching and consulting designed to help you lead with confidence and purpose.</p>
            <div className="hero-btns">
              <a href="/contact" className="btn btn-gold btn-magnetic">Schedule a Session →</a>
              <a href="/business" className="btn btn-outline btn-magnetic">Explore Coaching →</a>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-stat-card">
              <div className="stat-num"><span className="counter" data-target="20" data-suffix="+">20+</span></div>
              <div className="stat-label">Years of leadership experience in the U.S. Navy and private sector</div>
            </div>
            <div className="hero-stat-card">
              <div className="stat-num">EMBA</div>
              <div className="stat-label">Executive MBA and ACC certified coach through the ICF</div>
            </div>
            <div className="hero-stat-card">
              <div className="stat-num">CAPT</div>
              <div className="stat-label">Retired U.S. Navy Captain with proven leadership at every level</div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO STRIP */}
      <div className="intro-strip">
        <div className="intro-item">Business Coaching</div>
        <div className="intro-dot" />
        <div className="intro-item">Individual Coaching</div>
        <div className="intro-dot" />
        <div className="intro-item">Executive Leadership</div>
        <div className="intro-dot" />
        <div className="intro-item">Strategic Consulting</div>
      </div>

      {/* ABOUT */}
      <section className="about">
        <div className="about-inner">
          <div className="about-image reveal">
            <div className="about-photo">Photo coming soon</div>
            <div className="about-badge">
              <div className="about-badge-num"><span className="counter" data-target="20" data-suffix="+">20+</span></div>
              <div className="about-badge-label">Years Leading</div>
            </div>
          </div>
          <div className="about-content">
            <div className="eyebrow reveal">About John McCracken</div>
            <h2 className="section-title split-text reveal delay-1">Leadership forged through experience.</h2>
            <p className="body-text reveal delay-2">John McCracken is a retired U.S. Navy Captain and certified executive coach with over two decades of leadership experience. He founded Beyond the Horizon to bring the same clarity, discipline, and strategic thinking that defined his military career to business leaders and individuals ready to grow.</p>
            <p className="body-text reveal delay-3">Whether you are leading a team through change, building a business, or seeking to unlock your own potential, John provides the guidance and accountability to help you get there.</p>
            <div className="credentials reveal delay-4">
              <div className="credential">CAPT, USN (Ret.) — U.S. Navy</div>
              <div className="credential">Executive MBA (EMBA)</div>
              <div className="credential">ACC Certified Coach — International Coaching Federation</div>
              <div className="credential">Founder, Beyond the Horizon Executive Coaching and Consulting</div>
            </div>
            <a href="/contact" className="btn btn-navy btn-magnetic reveal delay-5" style={{display:'inline-flex',marginTop:8}}>Work with John →</a>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services">
        <div className="services-inner">
          <div className="services-header">
            <div className="eyebrow-light reveal">What I Offer</div>
            <h2 className="section-title-light split-text reveal delay-1">Coaching built for real results.</h2>
          </div>
          <div className="services-grid">
            {[
              { num: '01', name: 'Business Coaching', desc: 'Strategic coaching for organizations, executives, and teams. Navigate complexity, build stronger cultures, and lead your business through change with clarity and confidence.', href: '/business', cta: 'Explore Business Coaching' },
              { num: '02', name: 'Individual Coaching', desc: 'One on one coaching for professionals and leaders ready to level up. Whether you are stepping into a new role or redefining your path, this coaching meets you where you are.', href: '/individual', cta: 'Explore Individual Coaching' },
              { num: '03', name: 'Executive Leadership', desc: 'Develop the executive presence, decision making skills, and strategic mindset that separates good leaders from great ones. Built on real experience at the highest levels.', href: '/contact', cta: 'Learn More' },
              { num: '04', name: 'Strategic Consulting', desc: 'Bring in an experienced advisor to help you think through your biggest challenges. From organizational design to growth strategy, get a clear outside perspective.', href: '/contact', cta: 'Get in Touch' },
            ].map((s, i) => (
              <div key={i} className={`service-card reveal delay-${i+1}`}>
                <div className="service-num">{s.num}</div>
                <div className="service-name">{s.name}</div>
                <p className="service-desc">{s.desc}</p>
                <a href={s.href} className="service-link">{s.cta} →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="approach">
        <div className="approach-inner">
          <div className="approach-header">
            <div className="eyebrow reveal">My Approach</div>
            <h2 className="section-title split-text reveal delay-1">How we work together.</h2>
          </div>
          <div className="approach-grid">
            {[
              { title: 'Discovery', desc: 'We begin with a deep dive into where you are and where you want to go. No assumptions, no templates — just a genuine conversation about your goals, challenges, and what success looks like for you.', icon: <path d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" stroke="#C9A23A" strokeWidth="1.5" strokeLinecap="round"/> },
              { title: 'Strategy', desc: 'Together we build a clear, actionable plan. Every engagement is tailored to your specific situation — grounded in real experience and focused on measurable outcomes that move the needle.', icon: <><path d="M9 11l3 3L22 4" stroke="#C9A23A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#C9A23A" strokeWidth="1.5" strokeLinecap="round"/></> },
              { title: 'Growth', desc: 'Sustained accountability and ongoing support to ensure the work sticks. Real growth requires real follow through, and I stay with you through every step of the journey.', icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#C9A23A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> },
            ].map((a, i) => (
              <div key={i} className={`approach-card reveal delay-${i+1}`}>
                <div className="approach-icon">
                  <svg viewBox="0 0 24 24" fill="none" width="24" height="24">{a.icon}</svg>
                </div>
                <div className="approach-title">{a.title}</div>
                <p className="approach-desc">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="testimonials-inner">
          <div className="testimonials-header">
            <div className="eyebrow-light reveal">What Clients Say</div>
            <h2 className="section-title-light split-text reveal delay-1">Results that speak for themselves.</h2>
          </div>
          <div className="testimonials-grid">
            {[
              { quote: 'Working with John gave me a completely new perspective on how I approach leadership. His military background brings a level of discipline and clarity I had never experienced in a coach before.', author: 'Testimonial Coming Soon', role: 'Executive Client' },
              { quote: 'John does not just tell you what you want to hear. He challenges you to think bigger and hold yourself accountable. The results have been transformational for our team.', author: 'Testimonial Coming Soon', role: 'Business Owner' },
              { quote: 'I came in with a clear career plateau and left with a roadmap and the confidence to execute it. The investment has paid for itself many times over.', author: 'Testimonial Coming Soon', role: 'Individual Coaching Client' },
            ].map((t, i) => (
              <div key={i} className={`testimonial-card reveal delay-${i+1}`}>
                <div className="testimonial-quote"><span className="quote-mark">"</span>{t.quote}</div>
                <div className="testimonial-author">{t.author}</div>
                <div className="testimonial-role">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <div className="eyebrow reveal">Ready to Begin</div>
          <h2 className="cta-title split-text reveal delay-1">Your next chapter starts <em>here.</em></h2>
          <p className="cta-desc reveal delay-2">Whether you are leading a business, navigating a transition, or ready to invest in your own growth — the first step is a conversation. Let's talk.</p>
          <div className="cta-btns reveal delay-3">
            <a href="/contact" className="btn btn-navy btn-magnetic">Schedule a Session →</a>
            <a href="/business" className="btn btn-outline-navy btn-magnetic">Explore Coaching →</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-brand-name">Beyond the Horizon</div>
              <div className="footer-brand-sub">Executive Coaching and Consulting</div>
              <p className="footer-desc">Strategic coaching and consulting for leaders who are ready to navigate change, unlock potential, and create lasting impact.</p>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Services</div>
              <a href="/business">Business Coaching</a>
              <a href="/individual">Individual Coaching</a>
              <a href="/contact">Executive Leadership</a>
              <a href="/contact">Strategic Consulting</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Company</div>
              <a href="/">About John</a>
              <a href="/contact">Contact</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Contact</div>
              <a href="mailto:john@mccrackencoaching.com">john@mccrackencoaching.com</a>
              <a href="tel:7033436960">703.343.6960</a>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copy">© 2026 Beyond the Horizon Executive Coaching and Consulting. All rights reserved.</div>
            <div className="footer-gold-line" />
          </div>
        </div>
      </footer>
    </>
  )
}