'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

type Page = { id: string; slug: string; title: string; content: Record<string, string> }
type Testimonial = { id: string; name: string; role: string; company: string; quote: string; is_active: boolean; sort_order: number }
type SiteSetting = { id: string; key: string; value: string }

const HOMEPAGE_CSS = `        :root {
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
`
const BIZ_CSS = `        :root {
          --navy: #0D1B2A; --navy-mid: #1A2E45; --slate: #4C78A0;
          --gold: #C9A23A; --gold-light: #D4B563;
          --ivory: #F7F4ED; --ivory-dark: #EDE8DC;
          --white: #FFFFFF; --text-body: #2C3E50; --text-muted: #6B7A8D;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--ivory); color: var(--navy); font-family: 'Inter', sans-serif; font-weight: 300; overflow-x: hidden; }
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .reveal.delay-1 { transition-delay: 0.1s; } .reveal.delay-2 { transition-delay: 0.2s; } .reveal.delay-3 { transition-delay: 0.3s; } .reveal.delay-4 { transition-delay: 0.4s; }
        .reveal.revealed { opacity: 1; transform: translateY(0); }

        /* HERO */
        .page-hero { min-height: 70vh; background: var(--navy); display: flex; align-items: center; position: relative; overflow: hidden; }
        .page-hero-bg { position: absolute; inset: 0; background: linear-gradient(135deg, var(--navy) 0%, #1A2E45 60%, #1B3A5C 100%); }
        .page-hero-pattern { position: absolute; inset: 0; opacity: 0.04; background-image: repeating-linear-gradient(45deg, var(--gold) 0, var(--gold) 1px, transparent 0, transparent 50%); background-size: 30px 30px; }
        .page-hero-line { position: absolute; left: 60px; top: 0; bottom: 0; width: 1px; background: linear-gradient(to bottom, transparent, rgba(201,162,58,0.3), transparent); }
        .page-hero-content { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; padding: 160px 60px 100px; width: 100%; }
        .breadcrumb { font-size: 0.68rem; color: rgba(247,244,237,0.4); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 32px; display: flex; align-items: center; gap: 10px; }
        .breadcrumb a { color: rgba(247,244,237,0.4); text-decoration: none; transition: color 0.2s; }
        .breadcrumb a:hover { color: var(--gold); }
        .breadcrumb-sep { opacity: 0.3; }
        .page-eyebrow { font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .page-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--gold); }
        .page-hero-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(48px, 7vw, 88px); font-weight: 600; line-height: 1.02; color: var(--white); margin-bottom: 24px; max-width: 800px; }
        .page-hero-title em { font-style: italic; color: var(--gold); }
        .page-hero-desc { font-size: 1.05rem; line-height: 1.8; color: rgba(247,244,237,0.65); max-width: 580px; margin-bottom: 44px; }
        .btn { display: inline-flex; align-items: center; gap: 10px; padding: 16px 36px; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: all 0.3s; font-weight: 500; }
        .btn-gold { background: var(--gold); color: var(--navy); }
        .btn-gold:hover { background: var(--gold-light); transform: translateY(-2px); }
        .btn-navy { background: var(--navy); color: var(--ivory); }
        .btn-navy:hover { background: var(--navy-mid); transform: translateY(-2px); }
        .btn-outline-light { background: transparent; color: var(--ivory); border: 1px solid rgba(247,244,237,0.25); }
        .btn-outline-light:hover { border-color: var(--gold); color: var(--gold); }
        .hero-btns { display: flex; gap: 16px; flex-wrap: wrap; }

        /* INTRO */
        .intro { padding: 100px 60px; background: var(--ivory); }
        .intro-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
        .eyebrow { font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
        .section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 4vw, 52px); font-weight: 600; line-height: 1.08; color: var(--navy); margin-bottom: 24px; }
        .section-title em { font-style: italic; color: var(--slate); }
        .body-text { font-size: 0.95rem; line-height: 1.85; color: var(--text-body); margin-bottom: 20px; }
        .intro-right { padding-top: 16px; }
        .stat-row { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin-bottom: 32px; }
        .stat-box { background: white; border: 1px solid rgba(13,27,42,0.08); padding: 28px 24px; }
        .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 2.4rem; font-weight: 700; color: var(--gold); line-height: 1; margin-bottom: 6px; }
        .stat-label { font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; }

        /* OFFERINGS */
        .offerings { padding: 100px 60px; background: var(--navy); }
        .offerings-inner { max-width: 1200px; margin: 0 auto; }
        .offerings-header { margin-bottom: 64px; }
        .eyebrow-light { font-size: 0.68rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .eyebrow-light::before { content: ''; width: 24px; height: 1px; background: var(--gold); }
        .section-title-light { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 4vw, 52px); font-weight: 600; line-height: 1.08; color: var(--white); }
        .section-title-light em { font-style: italic; color: var(--gold); }
        .offerings-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
        .offering-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); padding: 40px 32px; transition: all 0.4s; position: relative; overflow: hidden; }
        .offering-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 0; background: var(--gold); transition: width 0.3s; }
        .offering-card:hover::before { width: 3px; }
        .offering-card:hover { background: rgba(201,162,58,0.06); border-color: rgba(201,162,58,0.2); transform: translateY(-4px); }
        .offering-num { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 700; color: rgba(201,162,58,0.15); margin-bottom: 16px; line-height: 1; }
        .offering-name { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600; color: var(--white); margin-bottom: 12px; }
        .offering-desc { font-size: 0.87rem; line-height: 1.75; color: rgba(247,244,237,0.5); }

        /* WHO */
        .who { padding: 100px 60px; background: var(--ivory-dark); }
        .who-inner { max-width: 1200px; margin: 0 auto; }
        .who-header { text-align: center; margin-bottom: 64px; }
        .who-header .eyebrow { justify-content: center; }
        .who-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .who-card { background: var(--white); padding: 36px 28px; border-bottom: 3px solid transparent; transition: all 0.4s; }
        .who-card:hover { border-bottom-color: var(--gold); transform: translateY(-6px); box-shadow: 0 16px 48px rgba(13,27,42,0.08); }
        .who-icon { width: 48px; height: 48px; background: var(--navy); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; font-size: 1.2rem; transition: background 0.3s; }
        .who-card:hover .who-icon { background: var(--gold); }
        .who-title { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 600; color: var(--navy); margin-bottom: 10px; }
        .who-desc { font-size: 0.86rem; line-height: 1.7; color: var(--text-muted); }

        /* PROCESS */
        .process { padding: 100px 60px; background: var(--ivory); }
        .process-inner { max-width: 1200px; margin: 0 auto; }
        .process-header { margin-bottom: 64px; }
        .process-steps { display: flex; flex-direction: column; gap: 2px; }
        .process-step { background: white; border: 1px solid rgba(13,27,42,0.08); padding: 32px 40px; display: grid; grid-template-columns: auto 1fr; gap: 32px; align-items: start; transition: border-color 0.3s; }
        .process-step:hover { border-color: rgba(201,162,58,0.3); }
        .step-num { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 700; color: rgba(201,162,58,0.25); line-height: 1; min-width: 48px; }
        .step-content h4 { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600; color: var(--navy); margin-bottom: 8px; }
        .step-content p { font-size: 0.88rem; line-height: 1.75; color: var(--text-muted); }

        /* CTA */
        .cta-section { padding: 120px 60px; background: var(--navy); }
        .cta-inner { max-width: 700px; margin: 0 auto; text-align: center; }
        .cta-inner .eyebrow-light { justify-content: center; }
        .cta-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(40px, 6vw, 64px); font-weight: 600; line-height: 1.05; color: var(--white); margin-bottom: 20px; }
        .cta-title em { font-style: italic; color: var(--gold); }
        .cta-desc { font-size: 1rem; line-height: 1.8; color: rgba(247,244,237,0.6); margin-bottom: 40px; }
        .cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

        @media (max-width: 900px) {
          .page-hero-content { padding: 140px 24px 80px; }
          .page-hero-title { font-size: clamp(40px, 9vw, 64px); }
          .intro { padding: 72px 24px; }
          .intro-inner { grid-template-columns: 1fr; gap: 48px; }
          .offerings { padding: 72px 24px; }
          .offerings-grid { grid-template-columns: 1fr; }
          .who { padding: 72px 24px; }
          .who-grid { grid-template-columns: 1fr; }
          .process { padding: 72px 24px; }
          .process-step { grid-template-columns: auto 1fr; gap: 20px; padding: 24px; }
          .cta-section { padding: 80px 24px; }
          .stat-row { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 540px) {
          .hero-btns { flex-direction: column; }
          .cta-btns { flex-direction: column; align-items: center; }
          .cta-btns .btn { width: 100%; justify-content: center; }
          .stat-row { grid-template-columns: 1fr; }
        }
`

const ADMIN_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #0F1117; color: #E8E8E8; font-family: 'Inter', sans-serif; font-size: 14px; min-height: 100vh; }
  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
  .login-card { background: #1A1D27; border: 1px solid rgba(255,255,255,0.06); padding: 48px 44px; width: 100%; max-width: 400px; }
  .login-logo { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: #fff; margin-bottom: 4px; }
  .login-sub { font-size: 0.65rem; color: #C9A23A; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 40px; }
  .login-title { font-size: 1.3rem; font-weight: 600; color: #fff; margin-bottom: 24px; }
  .login-input { width: 100%; background: #0F1117; border: 1px solid rgba(255,255,255,0.1); color: #E8E8E8; font-family: 'Inter', sans-serif; font-size: 14px; padding: 12px 16px; outline: none; transition: border-color 0.2s; margin-bottom: 16px; }
  .login-input:focus { border-color: #C9A23A; }
  .login-btn { width: 100%; background: #C9A23A; color: #0D1B2A; border: none; padding: 14px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; }
  .login-error { font-size: 12px; color: #e74c3c; margin-bottom: 12px; }
  .admin-shell { display: grid; grid-template-columns: 220px 1fr; min-height: 100vh; }
  .sidebar { background: #12151E; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
  .sidebar-logo { padding: 28px 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .sidebar-logo-name { font-family: 'Playfair Display', serif; font-size: 0.9rem; color: #fff; margin-bottom: 2px; }
  .sidebar-logo-sub { font-size: 0.58rem; color: #C9A23A; letter-spacing: 0.15em; text-transform: uppercase; }
  .sidebar-group { padding: 16px 0 4px; }
  .sidebar-group-label { font-size: 0.58rem; color: rgba(255,255,255,0.2); letter-spacing: 0.15em; text-transform: uppercase; padding: 0 20px 8px; }
  .nav-item { display: flex; align-items: center; gap: 9px; padding: 9px 20px; font-size: 12.5px; color: rgba(255,255,255,0.45); cursor: pointer; transition: all 0.15s; border-left: 2px solid transparent; }
  .nav-item:hover { color: #fff; background: rgba(255,255,255,0.03); }
  .nav-item.active { color: #C9A23A; border-left-color: #C9A23A; background: rgba(201,162,58,0.05); }
  .sidebar-footer { margin-top: auto; padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.05); }
  .signout-btn { font-size: 11px; color: rgba(255,255,255,0.25); background: none; border: none; cursor: pointer; transition: color 0.2s; }
  .signout-btn:hover { color: #e74c3c; }
  .main-area { background: #0F1117; display: flex; flex-direction: column; min-height: 100vh; overflow: hidden; }
  .main-topbar { background: #12151E; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 14px 28px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
  .main-topbar-title { font-size: 13px; font-weight: 500; color: #fff; }
  .main-topbar-sub { font-size: 11px; color: rgba(255,255,255,0.3); }
  .save-bar { display: flex; align-items: center; gap: 12px; }
  .save-btn { background: #C9A23A; color: #0D1B2A; border: none; padding: 9px 22px; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; }
  .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .save-btn:hover:not(:disabled) { opacity: 0.88; }
  .save-success { font-size: 11px; color: #27ae60; }
  .open-link { font-size: 11px; color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.2s; }
  .open-link:hover { color: #C9A23A; }
  .editor-layout { display: grid; grid-template-columns: 400px 1fr; flex: 1; overflow: hidden; height: calc(100vh - 53px); }
  .editor-fields { background: #1A1D27; border-right: 1px solid rgba(255,255,255,0.05); padding: 0; overflow-y: auto; }
  .editor-preview { background: #f0f0f0; overflow-y: auto; }
  .fields-inner { padding: 24px; }
  .field-section { margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .field-section:last-child { border-bottom: none; margin-bottom: 0; }
  .field-section-title { font-size: 0.6rem; color: #C9A23A; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; margin-bottom: 14px; padding: 8px 0 8px; border-bottom: 1px solid rgba(201,162,58,0.15); }
  .field { margin-bottom: 12px; }
  .field-label { font-size: 10.5px; color: rgba(255,255,255,0.45); letter-spacing: 0.06em; text-transform: uppercase; font-weight: 500; margin-bottom: 4px; }
  .field-hint { font-size: 10px; color: rgba(255,255,255,0.2); display: block; margin-bottom: 5px; font-style: italic; }
  .field-input { width: 100%; background: #0F1117; border: 1px solid rgba(255,255,255,0.07); color: #E8E8E8; font-family: 'Inter', sans-serif; font-size: 12.5px; padding: 9px 12px; outline: none; transition: border-color 0.2s; }
  .field-input:focus { border-color: #C9A23A; }
  .field-input.gold { color: #C9A23A; font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 14px; }
  textarea.field-input { resize: vertical; min-height: 72px; line-height: 1.6; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .upload-zone { border: 1.5px dashed rgba(255,255,255,0.1); padding: 20px; text-align: center; cursor: pointer; transition: border-color 0.2s; position: relative; }
  .upload-zone:hover { border-color: rgba(201,162,58,0.3); }
  .upload-preview { width: 100%; max-height: 140px; object-fit: cover; display: block; margin-bottom: 8px; }
  .upload-hint { font-size: 10px; color: rgba(255,255,255,0.25); margin-top: 6px; }
  .preview-label { background: #1A1D27; border-bottom: 1px solid rgba(201,162,58,0.15); padding: 7px 20px; font-size: 10px; color: rgba(201,162,58,0.65); letter-spacing: 0.1em; text-transform: uppercase; position: sticky; top: 0; z-index: 10; }
  .site-wrap { font-family: 'Inter', sans-serif; }
  .t-manager { padding: 24px; }
  .add-t-btn { background: rgba(201,162,58,0.08); border: 1px solid rgba(201,162,58,0.2); color: #C9A23A; padding: 9px 18px; font-size: 11px; font-weight: 500; cursor: pointer; margin-bottom: 20px; }
  .t-form { background: #12151E; border: 1px solid rgba(255,255,255,0.05); padding: 20px; margin-bottom: 16px; }
  .t-item { background: #12151E; border: 1px solid rgba(255,255,255,0.05); padding: 16px 18px; margin-bottom: 8px; }
  .t-item-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
  .t-item-name { font-size: 13px; font-weight: 500; color: #fff; }
  .t-item-meta { font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 2px; }
  .t-item-quote { font-size: 12px; color: rgba(255,255,255,0.4); font-style: italic; line-height: 1.6; }
  .t-actions { display: flex; gap: 8px; align-items: center; flex-shrink: 0; margin-left: 12px; }
  .t-status { font-size: 10px; font-weight: 600; white-space: nowrap; }
  .t-status.on { color: #27ae60; }
  .t-status.off { color: rgba(255,255,255,0.2); }
  .t-btn { background: none; border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.35); padding: 4px 10px; font-size: 10.5px; cursor: pointer; white-space: nowrap; }
  .t-btn:hover { border-color: #C9A23A; color: #C9A23A; }
  .t-btn.del:hover { border-color: #e74c3c; color: #e74c3c; }
  .settings-wrap { padding: 24px; }
  @media (max-width: 1000px) {
    .editor-layout { grid-template-columns: 1fr; height: auto; }
    .editor-preview { display: none; }
    .admin-shell { grid-template-columns: 1fr; }
    .sidebar { position: relative; height: auto; }
  }
`
export default function AdminPanel() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [view, setView] = useState('home')
  const [pages, setPages] = useState<Page[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState('')
  const [ep, setEp] = useState<Page | null>(null) // editing page
  const [newT, setNewT] = useState({ name: '', role: '', company: '', quote: '' })
  const [addingT, setAddingT] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (sessionStorage.getItem('bth_admin') === 'true') { setAuthed(true); fetchAll() }
  }, [])

  async function login() {
    try {
      const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      if (res.ok) { sessionStorage.setItem('bth_admin', 'true'); setAuthed(true); fetchAll() }
      else setLoginError('Incorrect password.')
    } catch { setLoginError('Something went wrong.') }
  }

  async function fetchAll() {
    const [pRes, tRes, sRes] = await Promise.all([
      supabase.from('pages').select('*').order('slug'),
      supabase.from('testimonials').select('*').order('sort_order'),
      supabase.from('site_settings').select('*'),
    ])
    if (pRes.data) {
      setPages(pRes.data)
      const home = pRes.data.find((p: Page) => p.slug === 'home')
      if (home) setEp({ ...home, content: { ...home.content } })
    }
    if (tRes.data) setTestimonials(tRes.data)
    if (sRes.data) setSettings(sRes.data)
  }

  function selectPage(slug: string) {
    setView(slug)
    const p = pages.find(p => p.slug === slug)
    setEp(p ? { ...p, content: { ...p.content } } : null)
    setSaved('')
  }

  function u(key: string, val: string) {
    if (!ep) return
    setEp({ ...ep, content: { ...ep.content, [key]: val } })
  }

  async function savePage() {
    if (!ep) return
    setSaving(true)
    await supabase.from('pages').update({ content: ep.content, updated_at: new Date().toISOString() }).eq('id', ep.id)
    setSaving(false); setSaved('Saved'); setTimeout(() => setSaved(''), 2500); fetchAll()
  }

  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !ep) return
    setUploading(true)
    const path = `pages/${ep.slug}/${Date.now()}_${file.name.replace(/\s/g, '_')}`
    const { error } = await supabase.storage.from('images').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('images').getPublicUrl(path)
      u('about_photo', data.publicUrl)
    }
    setUploading(false)
  }

  async function saveSettings() {
    setSaving(true)
    await Promise.all(settings.map(s => supabase.from('site_settings').update({ value: s.value, updated_at: new Date().toISOString() }).eq('id', s.id)))
    setSaving(false); setSaved('Saved'); setTimeout(() => setSaved(''), 2500)
  }

  async function addTestimonial() {
    if (!newT.name || !newT.quote) return
    await supabase.from('testimonials').insert({ ...newT, is_active: true, sort_order: testimonials.length })
    setNewT({ name: '', role: '', company: '', quote: '' }); setAddingT(false); fetchAll()
  }

  async function toggleT(id: string, current: boolean) {
    await supabase.from('testimonials').update({ is_active: !current }).eq('id', id); fetchAll()
  }

  async function deleteT(id: string) {
    if (!confirm('Delete this testimonial? This cannot be undone.')) return
    await supabase.from('testimonials').delete().eq('id', id); fetchAll()
  }

  function updateSetting(key: string, val: string) {
    setSettings(settings.map(s => s.key === key ? { ...s, value: val } : s))
  }

  const c = ep?.content || {}
  const gs = (key: string) => settings.find(s => s.key === key)?.value || ''
  const pageLinks: Record<string, string> = { home: '/', business: '/business', individual: '/individual', contact: '/contact' }
  const pageLabels: Record<string, string> = { home: 'Home Page', business: 'Business Coaching', individual: 'Individual Coaching', contact: 'Contact Page' }

  if (!authed) return (
    <>
      <style>{ADMIN_STYLES}</style>
      <div className="login-wrap">
        <div className="login-card">
          <div className="login-logo">Beyond the Horizon</div>
          <div className="login-sub">Content Management</div>
          <div className="login-title">Sign in to edit your site</div>
          {loginError && <div className="login-error">{loginError}</div>}
          <input className="login-input" type="password" placeholder="Admin password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} autoFocus />
          <button className="login-btn" onClick={login}>Sign In →</button>
        </div>
      </div>
    </>
  )

  return (
    <>
      <style>{ADMIN_STYLES}</style>
      <div className="admin-shell">

        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-name">Beyond the Horizon</div>
            <div className="sidebar-logo-sub">Content Management</div>
          </div>
          <div className="sidebar-group">
            <div className="sidebar-group-label">Pages</div>
            {(['home','business','individual','contact'] as const).map(slug => (
              <div key={slug} className={`nav-item ${view === slug ? 'active' : ''}`} onClick={() => selectPage(slug)}>
                <span>{slug === 'home' ? '🏠' : slug === 'business' ? '💼' : slug === 'individual' ? '👤' : '📧'}</span>
                {pageLabels[slug]}
              </div>
            ))}
          </div>
          <div className="sidebar-group">
            <div className="sidebar-group-label">Content</div>
            <div className={`nav-item ${view === 'testimonials' ? 'active' : ''}`} onClick={() => { setView('testimonials'); setSaved('') }}>
              <span>💬</span>Testimonials
            </div>
            <div className={`nav-item ${view === 'settings' ? 'active' : ''}`} onClick={() => { setView('settings'); setSaved('') }}>
              <span>⚙️</span>Site Settings
            </div>
          </div>
          <div className="sidebar-footer">
            <button className="signout-btn" onClick={() => { sessionStorage.removeItem('bth_admin'); setAuthed(false) }}>Sign out</button>
          </div>
        </div>

        {/* MAIN */}
        <div className="main-area">
          <div className="main-topbar">
            <div>
              <div className="main-topbar-title">{pageLabels[view] || (view === 'testimonials' ? 'Testimonials' : 'Site Settings')}</div>
              <div className="main-topbar-sub">{['home','business','individual','contact'].includes(view) ? 'Edit on the left · See exactly how it looks on the right' : ''}</div>
            </div>
            <div className="save-bar">
              {saved && <span className="save-success">✓ {saved}</span>}
              {['home','business','individual','contact'].includes(view) && <>
                <a className="open-link" href={pageLinks[view]} target="_blank">Open live page →</a>
                <button className="save-btn" onClick={savePage} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
              </>}
              {view === 'settings' && <button className="save-btn" onClick={saveSettings} disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</button>}
            </div>
          </div>

          {/* ============ HOME ============ */}
          {view === 'home' && (
            <div className="editor-layout">
              <div className="editor-fields">
                <div className="fields-inner">

                  <div className="field-section">
                    <div className="field-section-title">🎯 Hero — The very first thing visitors see</div>
                    <div className="field">
                      <div className="field-label">Main headline</div>
                      <span className="field-hint">Large text on the left side. The last line becomes gold italic automatically. Type each line on a separate line using Enter.</span>
                      <textarea className="field-input" rows={3} value={c.hero_headline || 'I help people find and get\nwhat they want.'} onChange={e => u('hero_headline', e.target.value)} />
                    </div>
                    <div className="field">
                      <div className="field-label">First paragraph — below the headline</div>
                      <span className="field-hint">One or two sentences. Speaks directly to where the visitor is right now.</span>
                      <textarea className="field-input" rows={3} value={c.hero_subtext || "You earned your success — and now you're looking to unlock what's next. Professionally, personally, relationally. All of it, together."} onChange={e => u('hero_subtext', e.target.value)} />
                    </div>
                    <div className="field">
                      <div className="field-label">Second paragraph — below the first</div>
                      <span className="field-hint">Describes what you bring to clients. Slightly smaller and lighter than the first paragraph.</span>
                      <textarea className="field-input" rows={3} value={c.hero_subtext_2 || 'I bring a lifetime of hard-won insights, alongside genuine curiosity and unwavering support, to help you get clear on what you want — and unlock the potential already in you to achieve it.'} onChange={e => u('hero_subtext_2', e.target.value)} />
                    </div>
                    <div className="field">
                      <div className="field-label">Hero photo</div>
                      <span className="field-hint">Large photo on the right half of the hero. This is one of the most important elements of the page — use a strong, natural portrait of John.</span>
                      <div className="upload-zone" onClick={() => fileRef.current?.click()}>
                        <input ref={fileRef} type="file" accept="image/*" onChange={uploadPhoto} style={{display:'none'}} />
                        {c.hero_photo
                          ? <><img src={c.hero_photo} alt="Hero" className="upload-preview" /><div className="upload-hint">Click to replace</div></>
                          : <><div style={{fontSize:28,marginBottom:6}}>📷</div><div style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>{uploading ? 'Uploading...' : 'Click to upload hero photo'}</div><div className="upload-hint">Natural portrait of John. At least 1200px wide, JPG or PNG.</div></>
                        }
                      </div>
                    </div>
                  </div>

                  <div className="field-section">
                    <div className="field-section-title">📊 Hero Stats — Three credential cards on the right side of the hero</div>
                    <div className="field">
                      <div className="field-label">Stat 1 — Number or label</div>
                      <span className="field-hint">Large bold text. E.g. "20+" or "EMBA"</span>
                      <input className="field-input" value={c.stat1_num || '20+'} onChange={e => u('stat1_num', e.target.value)} />
                    </div>
                    <div className="field">
                      <div className="field-label">Stat 1 — Description</div>
                      <input className="field-input" value={c.stat1_label || 'Years of leadership experience in the U.S. Navy and private sector'} onChange={e => u('stat1_label', e.target.value)} />
                    </div>
                    <div className="field">
                      <div className="field-label">Stat 2 — Number or label</div>
                      <input className="field-input" value={c.stat2_num || 'EMBA'} onChange={e => u('stat2_num', e.target.value)} />
                    </div>
                    <div className="field">
                      <div className="field-label">Stat 2 — Description</div>
                      <input className="field-input" value={c.stat2_label || 'Executive MBA and ACC certified coach through the ICF'} onChange={e => u('stat2_label', e.target.value)} />
                    </div>
                    <div className="field">
                      <div className="field-label">Stat 3 — Number or label</div>
                      <input className="field-input" value={c.stat3_num || 'CAPT'} onChange={e => u('stat3_num', e.target.value)} />
                    </div>
                    <div className="field">
                      <div className="field-label">Stat 3 — Description</div>
                      <input className="field-input" value={c.stat3_label || 'Retired U.S. Navy Captain with proven leadership at every level'} onChange={e => u('stat3_label', e.target.value)} />
                    </div>
                  </div>

                  <div className="field-section">
                    <div className="field-section-title">🪪 About — Your story, on a slate blue background</div>
                    <div className="field">
                      <div className="field-label">Your photo — left column of the about section</div>
                      <span className="field-hint">A natural, environmental portrait works best here. At least 800x1000px.</span>
                      <div className="upload-zone" onClick={() => fileRef.current?.click()}>
                        <input ref={fileRef} type="file" accept="image/*" onChange={uploadPhoto} style={{display:'none'}} />
                        {c.about_photo
                          ? <><img src={c.about_photo} alt="About" className="upload-preview" /><div className="upload-hint">Click to replace</div></>
                          : <><div style={{fontSize:28,marginBottom:6}}>📷</div><div style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>{uploading ? 'Uploading...' : 'Click to upload about photo'}</div><div className="upload-hint">JPG or PNG</div></>
                        }
                      </div>
                    </div>
                    <div className="field">
                      <div className="field-label">Section title — first part</div>
                      <span className="field-hint">White text. The second half of the headline (the whole story) is gold italic and fixed.</span>
                      <input className="field-input" value={c.about_title || 'The immediate challenge is rarely'} onChange={e => u('about_title', e.target.value)} />
                    </div>
                    <div className="field">
                      <div className="field-label">Story — paragraph 1</div>
                      <span className="field-hint">The Naval Reserve command story. Sets up the whole-person philosophy.</span>
                      <textarea className="field-input" rows={5} value={c.about_body_1 || "I inherited one of the most underperforming commands in the Naval Reserve — a Reserve Center of 76 personnel responsible for over 3,000 Sailors around the nation and the globe. Morale was broken, performance and customer satisfaction were low. It was an organization that had stopped believing in itself."} onChange={e => u('about_body_1', e.target.value)} />
                    </div>
                    <div className="field">
                      <div className="field-label">Story — paragraph 2 (bold)</div>
                      <span className="field-hint">The turning point. Appears bold — this is the key insight of the story.</span>
                      <textarea className="field-input" rows={4} value={c.about_body_2 || "What turned it around wasn't a new strategy or a reorganization. It was learning to lead and care for the whole person in the room — starting with myself. Two years later, that command was recognized as the best large Center in the nation."} onChange={e => u('about_body_2', e.target.value)} />
                    </div>
                    <div className="field">
                      <div className="field-label">Pull quote</div>
                      <span className="field-hint">Appears in a gold-bordered box. These are John's own words. Do not add quote marks.</span>
                      <textarea className="field-input" rows={3} value={c.about_quote || "The immediate challenge is rarely the whole story. When we address the whole person, something unlocks. Potential they didn't know they had. Clarity they couldn't find alone."} onChange={e => u('about_quote', e.target.value)} />
                    </div>
                    <div className="field">
                      <div className="field-label">Closing line</div>
                      <span className="field-hint">One sentence that ties the story to the client.</span>
                      <input className="field-input" value={c.about_body_3 || "That's what I bring to every client."} onChange={e => u('about_body_3', e.target.value)} />
                    </div>
                  </div>

                  <div className="field-section">
                    <div className="field-section-title">🧩 What I Offer — Four service cards on the navy background</div>
                    <div className="field">
                      <div className="field-label">Section headline</div>
                      <input className="field-input" value={c.services_headline || 'Coaching built for real results.'} onChange={e => u('services_headline', e.target.value)} />
                    </div>
                    {[1,2,3,4].map(n => (
                      <div key={n} style={{background:'#0F1117',border:'1px solid rgba(255,255,255,0.06)',padding:'14px',marginBottom:10}}>
                        <div style={{fontSize:10,color:'#C9A23A',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:10}}>Service card {n}</div>
                        <div className="field">
                          <div className="field-label">Title</div>
                          <input className="field-input" value={c[`service${n}_name`] || ['Business Coaching','Individual Coaching','Executive Leadership','Strategic Consulting'][n-1]} onChange={e => u(`service${n}_name`, e.target.value)} />
                        </div>
                        <div className="field">
                          <div className="field-label">Description</div>
                          <textarea className="field-input" rows={3} value={c[`service${n}_desc`] || ['Strategic coaching for organizations, executives, and teams. Navigate complexity, build stronger cultures, and lead your business through change with clarity and confidence.','One on one coaching for professionals and leaders ready to level up. Whether you are stepping into a new role or redefining your path, this coaching meets you where you are.','Develop the executive presence, decision making skills, and strategic mindset that separates good leaders from great ones. Built on real experience at the highest levels.','Bring in an experienced advisor to help you think through your biggest challenges. From organizational design to growth strategy, get a clear outside perspective.'][n-1]} onChange={e => u(`service${n}_desc`, e.target.value)} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="field-section">
                                      <div className="field-section-title">📐 My Approach — Three steps connected by a line</div>
                    <div className="field">
                      <div className="field-label">Intro paragraph</div>
                      <span className="field-hint">Appears to the right of the headline. Describes the coaching relationship in your own words.</span>
                      <textarea className="field-input" rows={3} value={c.approach_desc || "You bring what's most present in the moment — the decision, the thing you can't stop thinking about — and we work through it together. Because life doesn't separate neatly into professional and personal, we don't either."} onChange={e => u('approach_desc', e.target.value)} />
                    </div>
                    {[1,2,3].map(n => (
                      <div key={n} style={{background:'#0F1117',border:'1px solid rgba(255,255,255,0.06)',padding:'14px',marginBottom:10}}>
                        <div style={{fontSize:10,color:'#C9A23A',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:10}}>Step {n} — {["You Bring What's Present","We Explore It Together","You Move Forward"][n-1]}</div>
                        <div className="field">
                          <div className="field-label">Title</div>
                          <input className="field-input" value={c[`approach${n}_title`] || ["You Bring What's Present","We Explore It Together","You Move Forward"][n-1]} onChange={e => u(`approach${n}_title`, e.target.value)} />
                        </div>
                        <div className="field">
                          <div className="field-label">Description</div>
                          <textarea className="field-input" rows={3} value={c[`approach${n}_desc`] || ["The decision. The challenge. The thing you can't stop thinking about. We start there, with what's actually on your mind.","We explore your values, challenge assumptions, and open perspectives you may not have considered from inside the situation.","Every session produces something concrete: a commitment you define, a step you choose, a thing you finally decide to do."][n-1]} onChange={e => u(`approach${n}_desc`, e.target.value)} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="field-section">
                    <div className="field-section-title">📣 Final CTA — Bottom of the page before the footer</div>
                    <div className="field">
                      <div className="field-label">Body copy</div>
                      <span className="field-hint">Appears on the right side next to the headline. Use John's own language. The headline "That's the work. And it starts with a single conversation." is fixed design text.</span>
                      <textarea className="field-input" rows={4} value={c.cta_desc || "No pitch. No pressure. Just a direct conversation about where you are, what you'd like the future to hold — and whether this is the right fit for getting there. Together we get Beyond your Horizon."} onChange={e => u('cta_desc', e.target.value)} />
                    </div>
                    <div className="field">
                      <div className="field-label">Services intro — shown above the services list</div>
                      <span className="field-hint">One or two sentences framing what you offer. Appears to the right of the "Support for every stage of leadership" headline.</span>
                      <textarea className="field-input" rows={3} value={c.services_intro || 'Whether you are leading an organization, navigating a transition, or ready to invest in your own growth — the work is the same. We start where you are.'} onChange={e => u('services_intro', e.target.value)} />
                    </div>
                  </div>

                </div>
              </div>

              {/* HOME LIVE PREVIEW */}
              <div className="editor-preview">
                <div className="preview-label">↓ Live preview — exactly how your homepage looks to visitors. Updates as you type.</div>
                <div className="site-wrap">
                  <style>{HOMEPAGE_CSS + `
                    .site-wrap .hero { min-height: unset; }
                    .site-wrap .hero-content { padding: 60px 48px 60px; }
                    .site-wrap .hero-eyebrow, .site-wrap .hero-headline, .site-wrap .hero-desc, .site-wrap .hero-btns, .site-wrap .hero-right { animation: none; opacity: 1; }
                    .site-wrap .about { padding: 60px 48px; }
                    .site-wrap .services { padding: 60px 48px; }
                    .site-wrap .approach { padding: 60px 48px; }
                    .site-wrap .cta-section { padding: 60px 48px; }
                    .site-wrap .reveal { opacity: 1 !important; transform: none !important; }
                    .site-wrap .btn { cursor: default; pointer-events: none; }
                    .site-wrap .btn-magnetic { transform: none !important; }
                    .site-wrap a { pointer-events: none; }
                  `}</style>

                  <section className="hero">
                    <div className="hero-bg" />
                    <div className="hero-pattern" />
                    <div className="hero-gold-line" />
                    <div className="hero-content">
                      <div className="hero-left">
                        <div className="hero-eyebrow">Executive Coaching and Consulting</div>
                        <h1 className="hero-headline">
                          {(c.hero_headline || 'Navigate.\nElevate.').split('\n').map((line, i) => (
                            <span key={i} style={{display:'block'}}>{line}</span>
                          ))}
                          <em>{c.hero_accent || 'Transform.'}</em>
                        </h1>
                        <p className="hero-desc">{c.hero_subheadline || 'Strategic guidance for leaders who are ready to go beyond the horizon. Executive coaching and consulting designed to help you lead with confidence and purpose.'}</p>
                        <div className="hero-btns">
                          <span className="btn btn-gold">Schedule a Session →</span>
                          <span className="btn btn-outline">Explore Coaching →</span>
                        </div>
                      </div>
                      <div className="hero-right">
                        <div className="hero-stat-card">
                          <div className="stat-num">{c.stat1_num || '20+'}</div>
                          <div className="stat-label">{c.stat1_label || 'Years of leadership experience in the U.S. Navy and private sector'}</div>
                        </div>
                        <div className="hero-stat-card">
                          <div className="stat-num">{c.stat2_num || 'EMBA'}</div>
                          <div className="stat-label">{c.stat2_label || 'Executive MBA and ACC certified coach through the ICF'}</div>
                        </div>
                        <div className="hero-stat-card">
                          <div className="stat-num">{c.stat3_num || 'CAPT'}</div>
                          <div className="stat-label">{c.stat3_label || 'Retired U.S. Navy Captain with proven leadership at every level'}</div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <div className="intro-strip">
                    <div className="intro-item">Business Coaching</div>
                    <div className="intro-dot" />
                    <div className="intro-item">Individual Coaching</div>
                    <div className="intro-dot" />
                    <div className="intro-item">Executive Leadership</div>
                    <div className="intro-dot" />
                    <div className="intro-item">Strategic Consulting</div>
                  </div>

                  <section className="about">
                    <div className="about-inner">
                      <div className="about-image">
                        <div className="about-photo">
                          {c.about_photo
                            ? <img src={c.about_photo} alt="John McCracken" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
                            : 'Your photo will appear here'}
                        </div>
                        <div className="about-badge">
                          <div className="about-badge-num">20+</div>
                          <div className="about-badge-label">Years Leading</div>
                        </div>
                      </div>
                      <div className="about-content">
                        <div className="eyebrow">About John McCracken</div>
                        <h2 className="section-title">{c.about_title || 'Leadership forged through experience.'}</h2>
                        <p className="body-text">{c.about_body_1 || 'John McCracken is a retired U.S. Navy Captain and certified executive coach with over two decades of leadership experience.'}</p>
                        {(c.about_body_2 || 'Whether you are leading a team through change, building a business, or seeking to unlock your own potential, John provides the guidance and accountability to help you get there.') && (
                          <p className="body-text">{c.about_body_2 || 'Whether you are leading a team through change, building a business, or seeking to unlock your own potential, John provides the guidance and accountability to help you get there.'}</p>
                        )}
                        <div className="credentials">
                          {(c.about_credentials || 'CAPT, USN (Ret.) — U.S. Navy\nExecutive MBA (EMBA)\nACC Certified Coach — International Coaching Federation\nFounder, Beyond the Horizon Executive Coaching and Consulting').split('\n').filter(Boolean).map((cred, i) => (
                            <div key={i} className="credential">{cred}</div>
                          ))}
                        </div>
                        <span className="btn btn-navy" style={{display:'inline-flex',marginTop:8}}>Work with John →</span>
                      </div>
                    </div>
                  </section>

                  <section className="services">
                    <div className="services-inner">
                      <div className="services-header">
                        <div className="eyebrow-light">What I Offer</div>
                        <h2 className="section-title-light">{c.services_headline || 'Coaching built for real results.'}</h2>
                      </div>
                      <div className="services-grid">
                        {[1,2,3,4].map(n => (
                          <div key={n} className="service-card">
                            <div className="service-num">0{n}</div>
                            <div className="service-name">{c[`service${n}_name`] || ['Business Coaching','Individual Coaching','Executive Leadership','Strategic Consulting'][n-1]}</div>
                            <p className="service-desc">{c[`service${n}_desc`] || ['Strategic coaching for organizations, executives, and teams.','One on one coaching for professionals and leaders ready to level up.','Develop the executive presence, decision making skills, and strategic mindset.','Bring in an experienced advisor to help you think through your biggest challenges.'][n-1]}</p>
                            <span className="service-link">{['Explore Business Coaching','Explore Individual Coaching','Learn More','Get in Touch'][n-1]} →</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section className="approach">
                    <div className="approach-inner">
                      <div className="approach-header">
                        <div className="eyebrow">My Approach</div>
                        <h2 className="section-title">{c.approach_headline || 'How we work together.'}</h2>
                      </div>
                      <div className="approach-grid">
                        {[1,2,3].map(n => (
                          <div key={n} className="approach-card">
                            <div className="approach-icon">
                              <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                                {n === 1 && <path d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" stroke="#C9A23A" strokeWidth="1.5" strokeLinecap="round"/>}
                                {n === 2 && <><path d="M9 11l3 3L22 4" stroke="#C9A23A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#C9A23A" strokeWidth="1.5" strokeLinecap="round"/></>}
                                {n === 3 && <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#C9A23A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
                              </svg>
                            </div>
                            <div className="approach-title">{c[`approach${n}_title`] || ['Discovery','Strategy','Growth'][n-1]}</div>
                            <p className="approach-desc">{c[`approach${n}_desc`] || ['We begin with a deep dive into where you are and where you want to go.','Together we build a clear, actionable plan tailored to your specific situation.','Sustained accountability and ongoing support to ensure the work sticks.'][n-1]}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section className="cta-section">
                    <div className="cta-inner">
                      <div className="eyebrow">Ready to Begin</div>
                      <h2 className="cta-title">{c.cta_headline || 'Your next chapter starts'} <em>{c.cta_accent || 'here.'}</em></h2>
                      <p className="cta-desc">{c.cta_desc || "Whether you are leading a business, navigating a transition, or ready to invest in your own growth — the first step is a conversation. Let's talk."}</p>
                      <div className="cta-btns">
                        <span className="btn btn-navy">{c.cta_btn1 || 'Schedule a Session →'}</span>
                        <span className="btn btn-outline-navy">{c.cta_btn2 || 'Explore Coaching →'}</span>
                      </div>
                    </div>
                  </section>

                </div>
              </div>
            </div>
          )}

          {/* ============ BUSINESS / INDIVIDUAL / CONTACT ============ */}
          {['business','individual','contact'].includes(view) && (
            <div className="editor-layout">
              <div className="editor-fields">
                <div className="fields-inner">
                  <div className="field-section">
                    <div className="field-section-title">🎯 Hero — Top of the {pageLabels[view]} page</div>
                    <div className="field">
                      <div className="field-label">Main headline</div>
                      <span className="field-hint">White text. Large. First thing visitors read.</span>
                      <input className="field-input" value={c.headline || ''} onChange={e => u('headline', e.target.value)} placeholder={view === 'business' ? 'Coaching that moves' : view === 'individual' ? 'Invest in the leader' : "Let's start a"} />
                    </div>
                    <div className="field">
                      <div className="field-label">Gold accent line</div>
                      <span className="field-hint">Gold italic text on the next line.</span>
                      <input className="field-input gold" value={c.headline_accent || ''} onChange={e => u('headline_accent', e.target.value)} placeholder={view === 'business' ? 'your business forward.' : view === 'individual' ? 'you are becoming.' : 'conversation.'} />
                    </div>
                    <div className="field">
                      <div className="field-label">Subheadline</div>
                      <textarea className="field-input" rows={3} value={c.subheadline || ''} onChange={e => u('subheadline', e.target.value)} placeholder="One or two sentences..." />
                    </div>
                  </div>

                  {view === 'business' && (<>
                    <div className="field-section">
                      <div className="field-section-title">📝 Introduction — Section below the hero</div>
                      <div className="field">
                        <div className="field-label">Section title</div>
                        <input className="field-input" value={c.intro_title || ''} onChange={e => u('intro_title', e.target.value)} placeholder="The right guidance at the right time." />
                      </div>
                      <div className="field">
                        <div className="field-label">Paragraph 1</div>
                        <textarea className="field-input" rows={4} value={c.intro_body_1 || ''} onChange={e => u('intro_body_1', e.target.value)} placeholder="Most leadership challenges are not about strategy..." />
                      </div>
                      <div className="field">
                        <div className="field-label">Paragraph 2</div>
                        <textarea className="field-input" rows={4} value={c.intro_body_2 || ''} onChange={e => u('intro_body_2', e.target.value)} placeholder="John McCracken brings over two decades..." />
                      </div>
                    </div>

                    <div className="field-section">
                      <div className="field-section-title">🧩 Coaching Programs — Six service cards on the navy background</div>
                      <div className="field">
                        <div className="field-label">Section headline</div>
                        <input className="field-input" value={c.offerings_headline || ''} onChange={e => u('offerings_headline', e.target.value)} placeholder="Business coaching programs." />
                      </div>
                      {[1,2,3,4,5,6].map(n => (
                        <div key={n} style={{background:'#0F1117',border:'1px solid rgba(255,255,255,0.06)',padding:'14px',marginBottom:10}}>
                          <div style={{fontSize:10,color:'#C9A23A',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:10}}>Program {n}</div>
                          <div className="field">
                            <div className="field-label">Title</div>
                            <input className="field-input" value={c[`offering${n}_name`] || ''} onChange={e => u(`offering${n}_name`, e.target.value)} placeholder={['Executive Coaching','Leadership Team Alignment','Organizational Transformation','New Leader Onboarding','High Performance Teams','Strategic Advisory'][n-1]} />
                          </div>
                          <div className="field">
                            <div className="field-label">Description</div>
                            <textarea className="field-input" rows={3} value={c[`offering${n}_desc`] || ''} onChange={e => u(`offering${n}_desc`, e.target.value)} placeholder="Describe this program..." />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="field-section">
                      <div className="field-section-title">👥 Who This Is For — Three cards</div>
                      <div className="field">
                        <div className="field-label">Section headline</div>
                        <input className="field-input" value={c.who_headline || ''} onChange={e => u('who_headline', e.target.value)} placeholder="Business coaching works best for leaders who are ready." />
                      </div>
                      {[1,2,3].map(n => (
                        <div key={n} style={{background:'#0F1117',border:'1px solid rgba(255,255,255,0.06)',padding:'14px',marginBottom:10}}>
                          <div style={{fontSize:10,color:'#C9A23A',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:10}}>Card {n}</div>
                          <div className="field">
                            <div className="field-label">Title</div>
                            <input className="field-input" value={c[`who${n}_title`] || ''} onChange={e => u(`who${n}_title`, e.target.value)} placeholder={['Executives and C-Suite','Growing Businesses','Teams in Transition'][n-1]} />
                          </div>
                          <div className="field">
                            <div className="field-label">Description</div>
                            <textarea className="field-input" rows={3} value={c[`who${n}_desc`] || ''} onChange={e => u(`who${n}_desc`, e.target.value)} placeholder="Describe who this is for..." />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="field-section">
                      <div className="field-section-title">📋 How It Works — Five process steps</div>
                      <div className="field">
                        <div className="field-label">Section headline</div>
                        <input className="field-input" value={c.process_headline || ''} onChange={e => u('process_headline', e.target.value)} placeholder="A structured path to results." />
                      </div>
                      {[1,2,3,4,5].map(n => (
                        <div key={n} style={{background:'#0F1117',border:'1px solid rgba(255,255,255,0.06)',padding:'14px',marginBottom:10}}>
                          <div style={{fontSize:10,color:'#C9A23A',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:10}}>Step {n}</div>
                          <div className="field">
                            <div className="field-label">Title</div>
                            <input className="field-input" value={c[`process${n}_title`] || ''} onChange={e => u(`process${n}_title`, e.target.value)} placeholder={['Discovery Call','Needs Assessment','Engagement Design','Coaching and Accountability','Measure and Adjust'][n-1]} />
                          </div>
                          <div className="field">
                            <div className="field-label">Description</div>
                            <textarea className="field-input" rows={3} value={c[`process${n}_desc`] || ''} onChange={e => u(`process${n}_desc`, e.target.value)} placeholder="Describe this step..." />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="field-section">
                      <div className="field-section-title">📣 Call to Action — Bottom of the page</div>
                      <div className="field">
                        <div className="field-label">Headline</div>
                        <input className="field-input" value={c.cta_headline || ''} onChange={e => u('cta_headline', e.target.value)} placeholder="Ready to invest in your" />
                      </div>
                      <div className="field">
                        <div className="field-label">Gold accent word</div>
                        <input className="field-input gold" value={c.cta_accent || ''} onChange={e => u('cta_accent', e.target.value)} placeholder="leadership?" />
                      </div>
                      <div className="field">
                        <div className="field-label">Description</div>
                        <textarea className="field-input" rows={3} value={c.cta_desc || ''} onChange={e => u('cta_desc', e.target.value)} placeholder="The first step is a conversation..." />
                      </div>
                    </div>
                  </>)}

                  {view === 'individual' && (<>
                    <div className="field-section">
                      <div className="field-section-title">📝 Introduction — Section below the hero</div>
                      <div className="field">
                        <div className="field-label">Section title</div>
                        <input className="field-input" value={c.intro_title || ''} onChange={e => u('intro_title', e.target.value)} placeholder="Coaching built around you." />
                      </div>
                      <div className="field">
                        <div className="field-label">Paragraph 1</div>
                        <textarea className="field-input" rows={4} value={c.intro_body_1 || ''} onChange={e => u('intro_body_1', e.target.value)} placeholder="Individual coaching is a deeply personal investment..." />
                      </div>
                      <div className="field">
                        <div className="field-label">Paragraph 2</div>
                        <textarea className="field-input" rows={4} value={c.intro_body_2 || ''} onChange={e => u('intro_body_2', e.target.value)} placeholder="John brings the same discipline..." />
                      </div>
                      <div className="field">
                        <div className="field-label">Pull quote</div>
                        <span className="field-hint">Appears in a gold-bordered box. Do not add quote marks.</span>
                        <textarea className="field-input" rows={3} value={c.intro_quote || ''} onChange={e => u('intro_quote', e.target.value)} placeholder="The goal is not to become someone different..." />
                      </div>
                    </div>

                    <div className="field-section">
                      <div className="field-section-title">🧩 Coaching Programs — Four program cards</div>
                      <div className="field">
                        <div className="field-label">Section headline</div>
                        <input className="field-input" value={c.programs_headline || ''} onChange={e => u('programs_headline', e.target.value)} placeholder="Find the right program for you." />
                      </div>
                      {[1,2,3,4].map(n => (
                        <div key={n} style={{background:'#0F1117',border:'1px solid rgba(255,255,255,0.06)',padding:'14px',marginBottom:10}}>
                          <div style={{fontSize:10,color:'#C9A23A',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:10}}>Program {n}</div>
                          <div className="field">
                            <div className="field-label">Tag</div>
                            <span className="field-hint">Small label above the title e.g. "Most Popular"</span>
                            <input className="field-input" value={c[`program${n}_tag`] || ''} onChange={e => u(`program${n}_tag`, e.target.value)} placeholder={['Most Popular','Career Transition','Executive','Ongoing'][n-1]} />
                          </div>
                          <div className="field">
                            <div className="field-label">Title</div>
                            <input className="field-input" value={c[`program${n}_name`] || ''} onChange={e => u(`program${n}_name`, e.target.value)} placeholder={['Leadership Accelerator','Next Chapter Coaching','Executive Presence','Ongoing Partnership'][n-1]} />
                          </div>
                          <div className="field">
                            <div className="field-label">Description</div>
                            <textarea className="field-input" rows={3} value={c[`program${n}_desc`] || ''} onChange={e => u(`program${n}_desc`, e.target.value)} placeholder="Describe this program..." />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="field-section">
                      <div className="field-section-title">🌱 What You Gain — Six outcome cards</div>
                      <div className="field">
                        <div className="field-label">Section headline</div>
                        <input className="field-input" value={c.outcomes_headline || ''} onChange={e => u('outcomes_headline', e.target.value)} placeholder="Real outcomes for real leaders." />
                      </div>
                      {[1,2,3,4,5,6].map(n => (
                        <div key={n} style={{background:'#0F1117',border:'1px solid rgba(255,255,255,0.06)',padding:'14px',marginBottom:10}}>
                          <div style={{fontSize:10,color:'#C9A23A',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:10}}>Outcome {n}</div>
                          <div className="field">
                            <div className="field-label">Title</div>
                            <input className="field-input" value={c[`outcome${n}_title`] || ''} onChange={e => u(`outcome${n}_title`, e.target.value)} placeholder={['Clarity','Confidence','Focus','Influence','Performance','Growth'][n-1]} />
                          </div>
                          <div className="field">
                            <div className="field-label">Description</div>
                            <textarea className="field-input" rows={2} value={c[`outcome${n}_desc`] || ''} onChange={e => u(`outcome${n}_desc`, e.target.value)} placeholder="Describe this outcome..." />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="field-section">
                      <div className="field-section-title">📣 Call to Action — Bottom of the page</div>
                      <div className="field">
                        <div className="field-label">Headline</div>
                        <input className="field-input" value={c.cta_headline || ''} onChange={e => u('cta_headline', e.target.value)} placeholder="Your growth starts with a" />
                      </div>
                      <div className="field">
                        <div className="field-label">Gold accent word</div>
                        <input className="field-input gold" value={c.cta_accent || ''} onChange={e => u('cta_accent', e.target.value)} placeholder="conversation." />
                      </div>
                      <div className="field">
                        <div className="field-label">Description</div>
                        <textarea className="field-input" rows={3} value={c.cta_desc || ''} onChange={e => u('cta_desc', e.target.value)} placeholder="Schedule a complimentary discovery call..." />
                      </div>
                    </div>
                  </>)}

                  {view === 'contact' && (
                    <div className="field-section">
                      <div className="field-section-title">📬 Contact Info — Shown on the contact page</div>
                      <div className="field">
                        <div className="field-label">Introduction text</div>
                        <span className="field-hint">Paragraph below the section title on the left side.</span>
                        <textarea className="field-input" rows={3} value={c.contact_intro || ''} onChange={e => u('contact_intro', e.target.value)} placeholder="Fill out the form and I will be in touch within one business day..." />
                      </div>
                      <div className="field">
                        <div className="field-label">Availability note</div>
                        <span className="field-hint">Shown in the dark navy box below your contact details.</span>
                        <textarea className="field-input" rows={3} value={c.contact_availability || ''} onChange={e => u('contact_availability', e.target.value)} placeholder="I am currently accepting new clients..." />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="editor-preview">
                <div className="preview-label">↓ Live preview — exactly how this page looks to visitors</div>
                <div className="site-wrap">
                  <style>{BIZ_CSS + `
                    .site-wrap .page-hero { min-height: unset; }
                    .site-wrap .page-hero-content { padding: 80px 48px 60px; }
                    .site-wrap .reveal { opacity: 1 !important; transform: none !important; }
                    .site-wrap .btn { cursor: default; pointer-events: none; }
                    .site-wrap a { pointer-events: none; }
                  `}</style>
                  <div className="page-hero">
                    <div className="page-hero-bg" />
                    <div className="page-hero-pattern" />
                    <div className="page-hero-line" />
                    <div className="page-hero-content">
                      <div className="breadcrumb">
                        <span style={{color:'rgba(247,244,237,0.4)'}}>Home</span>
                        <span className="breadcrumb-sep">→</span>
                        <span>{pageLabels[view]}</span>
                      </div>
                      <div className="page-eyebrow">
                        {view === 'business' ? 'For Organizations and Teams' : view === 'individual' ? 'One on One Coaching' : 'Get in Touch'}
                      </div>
                      <h1 className="page-hero-title">
                        {c.headline || (view === 'business' ? 'Coaching that moves' : view === 'individual' ? 'Invest in the leader' : "Let's start a")}<br />
                        <em>{c.headline_accent || (view === 'business' ? 'your business forward.' : view === 'individual' ? 'you are becoming.' : 'conversation.')}</em>
                      </h1>
                      <p className="page-hero-desc">{c.subheadline || 'Your subheadline will appear here.'}</p>
                      <div className="hero-btns">
                        <span className="btn btn-gold">Schedule a Consultation →</span>
                        {view !== 'contact' && <span className="btn btn-outline-light">View Offerings →</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============ TESTIMONIALS ============ */}
          {view === 'testimonials' && (
            <div className="t-manager">
              <button className="add-t-btn" onClick={() => setAddingT(!addingT)}>+ Add New Testimonial</button>
              {addingT && (
                <div className="t-form">
                  <div style={{fontSize:'0.6rem',color:'#C9A23A',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:16}}>New Testimonial</div>
                  <div className="two-col" style={{marginBottom:12}}>
                    <div className="field">
                      <div className="field-label">Client name *</div>
                      <input className="field-input" value={newT.name} onChange={e => setNewT({...newT, name: e.target.value})} placeholder="Full name" />
                    </div>
                    <div className="field">
                      <div className="field-label">Title or role</div>
                      <input className="field-input" value={newT.role} onChange={e => setNewT({...newT, role: e.target.value})} placeholder="CEO, Director, etc." />
                    </div>
                  </div>
                  <div className="field" style={{marginBottom:12}}>
                    <div className="field-label">Company</div>
                    <input className="field-input" value={newT.company} onChange={e => setNewT({...newT, company: e.target.value})} placeholder="Organization or company name" />
                  </div>
                  <div className="field" style={{marginBottom:16}}>
                    <div className="field-label">What they said *</div>
                    <span className="field-hint">Copy their exact words. Do not add quote marks — they are added automatically.</span>
                    <textarea className="field-input" rows={5} value={newT.quote} onChange={e => setNewT({...newT, quote: e.target.value})} placeholder="Paste the testimonial here..." />
                  </div>
                  <div style={{display:'flex',gap:10}}>
                    <button className="save-btn" onClick={addTestimonial}>Add Testimonial</button>
                    <button style={{background:'none',border:'1px solid rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.35)',padding:'9px 16px',fontSize:11,cursor:'pointer'}} onClick={() => setAddingT(false)}>Cancel</button>
                  </div>
                </div>
              )}
              {testimonials.length === 0 && !addingT && (
                <div style={{color:'rgba(255,255,255,0.25)',fontSize:13,padding:'24px 0'}}>No testimonials yet. Click above to add your first one.</div>
              )}
              {testimonials.map(t => (
                <div key={t.id} className="t-item">
                  <div className="t-item-top">
                    <div>
                      <div className="t-item-name">{t.name}</div>
                      {(t.role || t.company) && <div className="t-item-meta">{[t.role, t.company].filter(Boolean).join(' · ')}</div>}
                    </div>
                    <div className="t-actions">
                      <span className={`t-status ${t.is_active ? 'on' : 'off'}`}>{t.is_active ? '● Showing on site' : '○ Hidden'}</span>
                      <button className="t-btn" onClick={() => toggleT(t.id, t.is_active)}>{t.is_active ? 'Hide' : 'Show'}</button>
                      <button className="t-btn del" onClick={() => deleteT(t.id)}>Delete</button>
                    </div>
                  </div>
                  <div className="t-item-quote">"{t.quote}"</div>
                </div>
              ))}
            </div>
          )}

          {/* ============ SETTINGS ============ */}
          {view === 'settings' && (
            <div className="settings-wrap">
              <div style={{fontSize:'0.6rem',color:'#C9A23A',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:20}}>Contact Information — appears in footer and contact page</div>
              {[
                { key: 'phone', label: 'Phone number', hint: 'Shown in the footer and contact page.' },
                { key: 'email', label: 'Email address', hint: 'Where contact form messages are sent.' },
                { key: 'linkedin', label: 'LinkedIn URL', hint: 'Optional. Leave blank if not needed.' },
                { key: 'tagline', label: 'Tagline', hint: 'Short line shown under your name in the footer.' },
              ].map(({ key, label, hint }) => (
                <div key={key} className="field" style={{marginBottom:16}}>
                  <div className="field-label">{label}</div>
                  <span className="field-hint">{hint}</span>
                  <input className="field-input" value={gs(key)} onChange={e => updateSetting(key, e.target.value)} placeholder={key} />
                </div>
              ))}
              <div style={{marginTop:24}}>
                <button className="save-btn" onClick={saveSettings} disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</button>
                {saved && <span className="save-success" style={{marginLeft:12}}>✓ {saved}</span>}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}