'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import './rotator.css'

export interface RotatorItem {
  key: string
  node: ReactNode
  /** Rough word count, used to give each item enough reading time. */
  words: number
}

// A quiet rotating window: one item at a time with a soft cross fade.
// Every item sits in the same grid cell, so the section keeps the height of
// the tallest item and nothing below it jumps. Rotation pauses while the
// visitor hovers, focuses, or reads elsewhere (tab hidden or scrolled away),
// and never runs on its own for visitors who prefer reduced motion.
export default function Rotator({ items, label, tone = 'light' }: { items: RotatorItem[]; label: string; tone?: 'light' | 'dark' }) {
  const [i, setI] = useState(0)
  const [hold, setHold] = useState(false)
  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const n = items.length

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const upd = () => setReduced(mq.matches)
    upd()
    mq.addEventListener('change', upd)
    return () => mq.removeEventListener('change', upd)
  }, [])

  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const go = useCallback((d: number) => setI(x => (x + d + n) % n), [n])

  useEffect(() => {
    if (n < 2 || hold || !visible || reduced) return
    // About 200 words a minute, never less than 9 seconds
    const ms = Math.max(9000, items[i].words * 300)
    const t = window.setTimeout(() => { if (!document.hidden) go(1) }, ms)
    return () => window.clearTimeout(t)
  }, [i, n, hold, visible, reduced, items, go])

  if (n === 0) return null
  if (n === 1) return <>{items[0].node}</>

  return (
    <div
      ref={root}
      className={`rot rot-${tone}${reduced ? ' rot-still' : ''}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocusCapture={() => setHold(true)}
      onBlurCapture={() => setHold(false)}
    >
      <div className="rot-stage">
        {items.map((it, j) => (
          <div
            key={it.key}
            className={`rot-item${j === i ? ' is-active' : ''}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${j + 1} of ${n}`}
            aria-hidden={j !== i}
            inert={j !== i}
          >
            {it.node}
          </div>
        ))}
      </div>
      <div className="rot-controls">
        <button type="button" className="rot-btn" onClick={() => go(-1)} aria-label="Previous">
          <span aria-hidden="true">←</span>
        </button>
        <span className="rot-count" aria-live={hold ? 'polite' : 'off'}>{i + 1} / {n}</span>
        <button type="button" className="rot-btn" onClick={() => go(1)} aria-label="Next">
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  )
}
