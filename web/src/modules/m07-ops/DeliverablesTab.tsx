'use client'

import { fmtDate } from '@/core/lib/format'
import type { Deliverable, ProjectSummary } from './types'

const STATUS_PILL: Record<string, { label: string; color: string; bg: string }> = {
  backlog:     { label: 'Backlog',     color: 'var(--ink-4)', bg: 'var(--bg-3)' },
  in_progress: { label: 'In progress', color: 'var(--m7)',    bg: '#4338ca18' },
  review:      { label: 'Review',      color: '#f59e0b',      bg: '#f59e0b18' },
  done:        { label: 'Done',        color: 'var(--m5)',    bg: '#15803d18' },
}

export function DeliverablesTab({ deliverables, projects }: {
  deliverables: Deliverable[]
  projects: ProjectSummary[]
}) {
  const projectMap = Object.fromEntries(projects.map(p => [p.id, p.title]))

  const thStyle: React.CSSProperties = {
    fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
    letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)',
    padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid var(--rule)',
    whiteSpace: 'nowrap',
  }

  const tdStyle: React.CSSProperties = {
    fontSize: 13, color: 'var(--ink-2)',
    padding: '10px 12px',
    borderBottom: '1px solid color-mix(in srgb, var(--rule) 50%, transparent)',
  }

  if (deliverables.length === 0) {
    return (
      <div style={{
        background: 'var(--bg-2)', border: '1px solid var(--rule)',
        borderRadius: 10, padding: '40px 24px', textAlign: 'center',
        color: 'var(--ink-4)', fontSize: 13,
      }}>
        No deliverables yet.
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            <th style={thStyle}>Deliverable</th>
            <th style={thStyle}>Project</th>
            <th style={thStyle}>Assignee</th>
            <th style={thStyle}>Due</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {deliverables.map(d => {
            const pill = STATUS_PILL[d.status] ?? STATUS_PILL.backlog
            const today = new Date(); today.setHours(0, 0, 0, 0)
            const isOverdue = !!d.due_date && !['done', 'review'].includes(d.status) && new Date(d.due_date) < today
            return (
              <tr key={d.id}>
                <td style={{ ...tdStyle, fontWeight: 500, color: 'var(--ink)' }}>{d.title}</td>
                <td style={{ ...tdStyle, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)' }}>
                  {projectMap[d.project_id] ?? '—'}
                </td>
                <td style={{ ...tdStyle, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)' }}>
                  {d.assignee_username ?? '—'}
                </td>
                <td style={{ ...tdStyle, fontFamily: 'var(--mono)', fontSize: 11, whiteSpace: 'nowrap', color: isOverdue ? '#ef4444' : 'inherit', fontWeight: isOverdue ? 700 : 'inherit' }}>
                  {fmtDate(d.due_date)}{isOverdue ? ' ⚠' : ''}
                </td>
                <td style={tdStyle}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                    textTransform: 'uppercase', color: pill.color, background: pill.bg,
                    padding: '3px 9px', borderRadius: 20, whiteSpace: 'nowrap',
                  }}>
                    {pill.label}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
