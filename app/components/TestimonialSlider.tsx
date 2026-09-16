'use client'

import { useState } from 'react'

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  quote: string
}

interface TestimonialSliderProps {
  testimonials: Testimonial[]
}

export default function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  const [index, setIndex] = useState(0)

  if (!testimonials.length) return null

  const total = testimonials.length
  const current = testimonials[index]

  const prev = () => setIndex(i => (i === 0 ? total - 1 : i - 1))
  const next = () => setIndex(i => (i === total - 1 ? 0 : i + 1))

  return (
    <>
      <style>{`
        .ts-wrap { position: relative; }
        .ts-quote {
          font-family: 'Lora', serif;
          font-size: clamp(1rem, 1.4vw, 1.12rem);
          font-style: italic;
          line-height: 1.82;
          color: rgba(247,244,237,0.88);
          margin-bottom: 36px;
        }
        .ts-attribution {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 40px;
        }
        .ts-rule {
          width: 32px;
          height: 1px;
          background: #C9A23A;
          flex-shrink: 0;
        }
        .ts-name {
          font-size: 0.82rem;
          color: rgba(247,244,237,0.7);
          font-weight: 500;
          margin-bottom: 2px;
        }
        .ts-role {
          font-size: 0.75rem;
          color: rgba(247,244,237,0.4);
          line-height: 1.5;
        }
        .ts-controls {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .ts-btn {
          background: none;
          border: 1px solid rgba(247,244,237,0.2);
          color: rgba(247,244,237,0.55);
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
          flex-shrink: 0;
        }
        .ts-btn:hover {
          border-color: rgba(247,244,237,0.5);
          color: rgba(247,244,237,0.9);
        }
        .ts-counter {
          font-size: 0.72rem;
          color: rgba(247,244,237,0.35);
          letter-spacing: 0.06em;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          user-select: none;
        }
        .ts-counter-current {
          color: rgba(247,244,237,0.65);
        }
      `}</style>

      <div className="ts-wrap">
        <div className="ts-quote">{current.quote}</div>
        <div className="ts-attribution">
          <div className="ts-rule" />
          <div>
            <div className="ts-name">{current.name}</div>
            <div className="ts-role">
              {[current.role, current.company].filter(Boolean).join(', ')}
            </div>
          </div>
        </div>
        {total > 1 && (
          <div className="ts-controls">
            <button className="ts-btn" onClick={prev} aria-label="Previous testimonial">←</button>
            <button className="ts-btn" onClick={next} aria-label="Next testimonial">→</button>
            <span className="ts-counter">
              <span className="ts-counter-current">
                {String(index + 1).padStart(2, '0')}
              </span>
              {' / '}
              {String(total).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>
    </>
  )
}