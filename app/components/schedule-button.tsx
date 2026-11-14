import type { CSSProperties, ReactNode } from 'react'

// "Schedule a call" button. Until John adds his Microsoft Bookings link in
// Admin > Scheduling, it renders exactly as before (disabled). Once a link
// is saved, it becomes a live link that opens the booking page.
export default function ScheduleButton({
  url, className, disabledStyle, children,
}: {
  url?: string
  className: string
  disabledStyle?: CSSProperties
  children: ReactNode
}) {
  if (url) {
    return (
      <a className={className} href={url} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }
  return (
    <button className={className} disabled aria-disabled="true" style={disabledStyle}>
      {children}
    </button>
  )
}
