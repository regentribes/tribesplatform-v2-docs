'use client'
import { useState, useRef, useEffect } from 'react'

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

interface CalendarPickerProps {
  value: string | null          // ISO "YYYY-MM-DD"
  onChange: (date: string | null) => void
  placeholder?: string
  accentColor?: string
  align?: 'left' | 'right'
}

export function CalendarPicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  accentColor = 'var(--m7)',
  align = 'left',
}: CalendarPickerProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const selectedDate = value ? new Date(value + 'T00:00:00') : null

  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(selectedDate?.getFullYear() ?? today.getFullYear())
  const [viewMonth, setViewMonth] = useState(selectedDate?.getMonth() ?? today.getMonth())
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Sync view to value when it changes externally
  useEffect(() => {
    if (selectedDate) {
      setViewYear(selectedDate.getFullYear())
      setViewMonth(selectedDate.getMonth())
    }
  }, [value])

  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function selectDay(day: number) {
    const mm = String(viewMonth + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    onChange(`${viewYear}-${mm}-${dd}`)
    setOpen(false)
  }

  const displayLabel = selectedDate
    ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '7px 12px', borderRadius: 8,
          border: '1px solid var(--rule)', background: 'var(--surface)',
          color: displayLabel ? 'var(--ink)' : 'var(--ink-4)',
          fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
          whiteSpace: 'nowrap', transition: 'border-color 100ms',
          outline: open ? `2px solid color-mix(in srgb, ${accentColor} 40%, transparent)` : 'none',
          outlineOffset: 1,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.7 }}>
          <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M5 1v4M11 1v4M1 7h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        {displayLabel ?? placeholder}
      </button>

      {/* Dropdown calendar */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          ...(align === 'right' ? { right: 0 } : { left: 0 }),
          zIndex: 300,
          background: 'var(--surface)',
          border: '1px solid var(--rule)',
          borderRadius: 12,
          boxShadow: '0 8px 32px -8px rgba(0,0,0,0.18), 0 2px 10px rgba(0,0,0,0.07)',
          padding: '12px 12px 8px',
          minWidth: 256,
          animation: 'calFadeIn 120ms ease-out',
        }}>
          {/* Month / year nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <button type="button" onClick={prevMonth} style={navBtn}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: 'var(--ink)', letterSpacing: '0.02em' }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={nextMonth} style={navBtn}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>

          {/* Day-of-week header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
            {DAY_LABELS.map(d => (
              <div key={d} style={{
                textAlign: 'center', fontSize: 9.5,
                fontFamily: 'var(--mono)', fontWeight: 700,
                color: 'var(--ink-4)', padding: '3px 0',
                letterSpacing: '0.04em',
              }}>
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`pad-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const thisDate = new Date(viewYear, viewMonth, day)
              const isSelected = selectedDate?.getTime() === thisDate.getTime()
              const isToday = today.getTime() === thisDate.getTime()
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDay(day)}
                  style={{
                    width: '100%', aspectRatio: '1',
                    borderRadius: 7,
                    border: isToday && !isSelected
                      ? `1.5px solid ${accentColor}`
                      : '1.5px solid transparent',
                    background: isSelected ? accentColor : 'transparent',
                    color: isSelected ? '#fff' : isToday ? accentColor : 'var(--ink-2)',
                    fontSize: 12,
                    fontWeight: isSelected || isToday ? 700 : 400,
                    cursor: 'pointer',
                    transition: 'background 80ms, color 80ms',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-2)'
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                  }}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Footer: clear */}
          <div style={{ borderTop: '1px solid var(--rule)', marginTop: 8, paddingTop: 7, display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => { onChange(null); setOpen(false) }}
              style={{
                fontSize: 11, color: value ? 'var(--ink-3)' : 'var(--ink-4)',
                background: 'none', border: 'none', cursor: value ? 'pointer' : 'default',
                textDecoration: value ? 'underline' : 'none',
                fontFamily: 'var(--mono)', letterSpacing: '0.04em',
              }}
            >
              {value ? 'Clear date' : 'No date set'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const navBtn: React.CSSProperties = {
  width: 26, height: 26, borderRadius: 6,
  border: 'none', background: 'var(--bg-2)',
  color: 'var(--ink-2)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'background 100ms',
}
