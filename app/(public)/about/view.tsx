'use client'

import { useState } from 'react'
import Image from 'next/image'
import './about.css'
import ScheduleButton from '../../components/schedule-button'
import type { ViewProps } from '@/lib/view-props'

type CredEntry = { title: string; org: string; credUrl?: string }
type CredCategory = { label: string; entries: CredEntry[] }

// Credential links are fixed; titles and details are editable.
const CRED_LINKS: Record<string, string> = {
  'cert.2': 'https://www.parchment.com/lp/award/fc8113c5-7442-4408-b64e-ff05a7b99774',
}
const CRED_GROUPS: [string, number][] = [['exp', 4], ['edu', 4], ['cert', 3]]

export default function AboutView({ c, booking }: ViewProps) {
  const credCategories: CredCategory[] = CRED_GROUPS.map(([g, n]) => ({
    label: c[`creds.${g}.label`],
    entries: Array.from({ length: n }, (_, i) => ({
      title: c[`creds.${g}.${i + 1}.title`],
      org: c[`creds.${g}.${i + 1}.org`],
      credUrl: CRED_LINKS[`${g}.${i + 1}`],
    })).filter(e => e.title),
  }))
  const [activeCred, setActiveCred] = useState(0)
  const [credFading, setCredFading] = useState(false)

  function selectCred(i: number) {
    if (i === activeCred) return
    setCredFading(true)
    setTimeout(() => {
      setActiveCred(i)
      setCredFading(false)
    }, 175)
  }

  function handleCredKey(e: React.KeyboardEvent, i: number) {
    if (e.key === 'ArrowRight') { e.preventDefault(); selectCred(Math.min(i + 1, credCategories.length - 1)) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); selectCred(Math.max(i - 1, 0)) }
  }

  return (
    <>
      {/* ===== 1. OPENING / HERO ===== */}
      <section className="opening">
        <div className="opening-inner">
          <div className="opening-text-col">
            <div className="opening-name-block">
              <div className="opening-name">{c['hero.name']}</div>
            </div>
            <div className="opening-statement">
              <h1 className="opening-lead">{c['hero.lead']}</h1>
              <p className="opening-subhead">{c['hero.subhead']}</p>
            </div>
          </div>
          <div className="opening-portrait-col">
            <img
              src={c['hero.image']}
              alt="John McCracken in a navy blazer in front of the Navy Memorial wave sculpture"
              className="opening-portrait"
            />
          </div>
        </div>
      </section>

      {/* ===== 2. STORY ===== */}
      <section className="story">
        <div className="story-inner">

          <div className="story-section">
            <div className="story-section-label">{c['started.label']}</div>
            <p className="story-body">{c['started.body1']}</p>
          </div>

          <div className="story-section">
            <div className="story-section-label">{c['failure.label']}</div>
            <p className="story-body">{c['failure.body1']}</p>
            <p className="story-body">{c['failure.body2']}</p>
            <p className="story-body">{c['failure.body3']}</p>
            <p className="story-body">{c['failure.body4']}</p>
          </div>

          <div className="story-section">
            <div className="story-section-label">{c['living.label']}</div>
            <p className="story-body">{c['living.body1']}</p>
            <p className="story-body">{c['living.body2']}</p>
            <p className="story-body">{c['living.body3']}</p>
          </div>

        </div>

        {/* Photo: Living the Change ceremony */}
        <div className="story-portrait-break">
          <figure className="story-portrait-figure">
            <img
              src={c['living.image']}
              alt="John McCracken reenlisting the Command Master Chief of NOSC Washington"
              className="story-portrait-img"
            />
            <figcaption className="story-portrait-caption">{c['living.caption']}</figcaption>
          </figure>
        </div>

        <div className="story-inner" style={{ marginTop: '80px' }}>
          <div className="story-section">
            <div className="story-section-label">{c['after.label']}</div>
            <p className="story-body">{c['after.body1']}</p>
            <p className="story-body">{c['after.body2']}</p>
          </div>
        </div>

        {/* Photo: After the Navy — square container, preserves Fair Winds sign */}
        <div className="story-square-break">
          <figure className="story-portrait-figure">
            <img
              src={c['after.image']}
              alt="John McCracken leaving Joint Base Andrews after completing command of NOSC Washington"
              className="story-square-img"
            />
            <figcaption className="story-portrait-caption">{c['after.caption']}</figcaption>
          </figure>
        </div>
      </section>

      {/* ===== 3. BEYOND WORK ===== */}
      {/* Photos: cycling or open-water swim (left/top), beach photo with wife (right/bottom) */}
      <section className="beyond">
        <div className="beyond-inner">
          <div className="beyond-section-label">{c['beyond.label']}</div>
          <div className="beyond-layout">
            <div className="beyond-photos">
              <img
                src={c['beyond.image1']}
                alt="John McCracken on a morning bike ride on a coastal road"
                className="beyond-photo beyond-photo-landscape"
              />
              <div className="beyond-photos-row">
                <img
                  src={c['beyond.image2']}
                  alt="John McCracken racing on an indoor cycling course"
                  className="beyond-photo-portrait"
                />
                <img
                  src={c['beyond.image3']}
                  alt="John McCracken and his wife under the cherry blossoms with the Washington Monument behind them"
                  className="beyond-photo-landscape-sm"
                />
              </div>
            </div>
            <div>
              <p className="beyond-body">{c['beyond.body1']}</p>
              <p className="beyond-body">{c['beyond.body2']}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. PULL QUOTE ===== */}
      <section className="pull-quote">
        <div className="pull-quote-inner">
          <p className="why-this-works-label">{c['quote.label']}</p>
          <p className="pull-quote-text">{c['quote.text']}</p>
        </div>
      </section>

      {/* ===== 5. CREDENTIALS ===== */}
      <section className="credentials">
        <div className="credentials-inner">

          <div style={{marginBottom: '48px'}}>
            <div style={{fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(24px, 2.8vw, 34px)', fontWeight: 400, color: 'var(--text)', letterSpacing: '-0.01em'}}>{c['creds.heading']}</div>
          </div>
          {/* ICF credential badges */}
          <div className="cred-badge-row">
            <Image
              src="/images/icf-acc-badge.png"
              alt="ICF Associate Certified Coach (ACC) credential badge"
              width={140}
              height={140}
              className="cred-acc-badge"
            />
            <Image
              src="/images/icf-member-badge.png"
              alt="ICF Member badge"
              width={140}
              height={140}
              className="cred-member-badge"
            />
          </div>

          {/* Desktop: tab selector */}
          <div
            className="cred-selector cred-selector-desktop"
            role="tablist"
            aria-label="Credentials by category"
          >
            {credCategories.map((cat, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={activeCred === i}
                aria-controls="cred-panel"
                id={`cred-tab-${i}`}
                className={`cred-tab${activeCred === i ? ' active' : ''}`}
                onClick={() => selectCred(i)}
                onKeyDown={(e) => handleCredKey(e, i)}
                tabIndex={activeCred === i ? 0 : -1}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Desktop panel */}
          <div
            id="cred-panel"
            role="tabpanel"
            aria-labelledby={`cred-tab-${activeCred}`}
            className={`cred-panel cred-selector-desktop ${credFading ? 'fading' : 'visible'}`}
          >
            <div className="cred-entries-grid">
              {credCategories[activeCred].entries.map((entry, i) => (
                <div key={i} className="cred-entry-block">
                  <div className="cred-entry-title">
                    {'credUrl' in entry && entry.credUrl
                      ? <a href={entry.credUrl} target="_blank" rel="noopener noreferrer" className="cred-entry-link">{entry.title}</a>
                      : entry.title}
                  </div>
                  {entry.org && <div className="cred-entry-org">{entry.org}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: accordion */}
          <div className="cred-selector-mobile">
            {credCategories.map((cat, i) => (
              <MobileAccordion key={i} cat={cat} />
            ))}
          </div>

        </div>
      </section>

      {/* ===== 6. HOW I COACH ===== */}
      <section className="how-i-coach">
        <div className="how-i-coach-inner">
          <div className="how-i-coach-label">{c['coach.label']}</div>
          <p className="how-i-coach-body">{c['coach.body1']}</p>
          <p className="how-i-coach-body">{c['coach.body2']}</p>
          <p className="how-i-coach-body">{c['coach.body3']}</p>
                    <a href="/the-8-pillars" className="how-i-coach-link">{c['coach.link']}</a>
        </div>
      </section>

      {/* ===== 7. CLOSING ===== */}
      <section className="closing">
        <div className="closing-inner">
          <p className="closing-statement">{c['closing.body']}</p>
          <img
            src="/images/john-mccracken-signature.png"
            alt="John McCracken signature"
            className="closing-signature"
            aria-hidden="true"
          />
          {booking?.free
            ? <a className="btn btn-gold" href={booking.free} target="_blank" rel="noopener noreferrer" style={{marginTop: '32px'}}>Schedule a Free 15-Minute Call</a>
            : <ScheduleButton className="btn btn-gold" disabledStyle={{marginTop: '32px', opacity: 0.72, cursor: 'not-allowed'}}>Schedule a Free 15-Minute Call</ScheduleButton>}
        </div>
      </section>
    </>
  )
}

function MobileAccordion({ cat }: { cat: CredCategory }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="cred-accordion-item">
      <button
        className="cred-accordion-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="cred-accordion-label">{cat.label}</span>
        <span className={`cred-accordion-chevron${open ? ' open' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="cred-accordion-body">
          {cat.entries.map((entry, i) => (
            <div key={i} className="cred-accordion-entry">
              <div className="cred-accordion-title">
                {'credUrl' in entry && entry.credUrl
                  ? <a href={entry.credUrl} target="_blank" rel="noopener noreferrer" className="cred-entry-link">{entry.title}</a>
                  : entry.title}
              </div>
              {entry.org && <div className="cred-accordion-org">{entry.org}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}