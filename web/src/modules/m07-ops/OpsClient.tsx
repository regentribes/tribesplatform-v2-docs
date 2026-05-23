'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/core/lib/supabase/client'
import { isPillar, PILLAR_META } from '@/core/lib/pillars'
import { PROJECT_KANBAN_COLUMNS } from '@/core/lib/project-status'
import { DeliverablesTab } from './DeliverablesTab'
import { UpdatesTab } from './UpdatesTab'
import type { Project, Deliverable, ProjectUpdate } from './types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface OpsClientProps {
  projects: Project[]
  deliverables: Deliverable[]
  updates: ProjectUpdate[]
  activeCount: number
  deliverableCount: number
  doneCount: number
  atRiskCount: number
  isAdmin: boolean
  userId: string | null
  userRole: string
  leadCircles: string[]
  sprintName: string | null
}

/** Whether the current user can drag a project between Kanban columns.
 *   - admin                    → any project
 *   - project_lead             → projects they created or lead
 *   - circle_lead              → projects in circles they lead
 *   - member / joining / etc.  → cannot move
 */
function canMoveProject(
  p: Project,
  userId: string | null,
  userRole: string,
  leadCircles: string[],
): boolean {
  if (!userId) return false
  if (userRole === 'admin') return true
  if (userRole === 'project_lead' && (p.created_by === userId || p.lead_user_id === userId)) return true
  if (userRole === 'circle_lead' && p.circle && leadCircles.includes(p.circle)) return true
  return false
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  delta,
  valueColor = 'var(--ink)',
}: {
  label: string
  value: string | number
  delta: string
  valueColor?: string
}) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--rule)',
      borderRadius: 10,
      padding: '14px 16px',
    }}>
      <div style={{
        fontFamily: 'var(--mono)',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--ink-3)',
        marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--mono)',
        fontSize: 26,
        fontWeight: 700,
        letterSpacing: '-0.02em',
        color: valueColor,
      }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>
        {delta}
      </div>
    </div>
  )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

// ─── Project Kanban Card ──────────────────────────────────────────────────────

function ProjectKanbanCard({
  project,
  subtaskCount,
  doneCount,
  canMove,
  onDragStart,
  onDragEnd,
  isDragging,
}: {
  project: Project
  subtaskCount: number
  doneCount: number
  canMove: boolean
  onDragStart?: (id: string) => void
  onDragEnd?: () => void
  isDragging?: boolean
}) {
  const circleMeta = isPillar(project.circle) ? PILLAR_META[project.circle] : null
  const accent = circleMeta?.color ?? 'var(--m7)'
  return (
    <Link href={`/ops/${project.id}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 8 }}>
      <div
        draggable={canMove}
        onDragStart={canMove ? (e) => {
          e.dataTransfer.effectAllowed = 'move'
          e.dataTransfer.setData('text/plain', project.id)
          onDragStart?.(project.id)
        } : undefined}
        onDragEnd={canMove ? () => onDragEnd?.() : undefined}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--rule)',
          borderLeft: `3px solid ${accent}`,
          borderRadius: 8,
          padding: '10px 12px',
          boxShadow: 'var(--shadow-sm)',
          cursor: canMove ? 'grab' : 'pointer',
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        <div style={{
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 6,
          color: 'var(--ink)',
          lineHeight: 1.35,
        }}>
          {project.title}
        </div>
        {circleMeta && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 9, fontWeight: 600, color: circleMeta.color, background: `${circleMeta.color}15`, padding: '1px 6px', borderRadius: 20, marginBottom: 6 }}>
            {circleMeta.emoji} {circleMeta.label}
          </div>
        )}
        {project.description && (
          <p style={{
            fontSize: 11,
            color: 'var(--ink-3)',
            margin: '0 0 6px',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {project.description}
          </p>
        )}
        <div style={{
          fontFamily: 'var(--mono)',
          fontSize: 10,
          color: 'var(--ink-4)',
          marginTop: 4,
        }}>
          {subtaskCount === 0 ? 'no subtasks' : `${doneCount}/${subtaskCount} done`}
        </div>
      </div>
    </Link>
  )
}

// ─── Main Client Component ────────────────────────────────────────────────────

export default function OpsClient({
  projects,
  deliverables: initialDeliverables,
  updates,
  activeCount,
  deliverableCount,
  doneCount,
  atRiskCount,
  isAdmin,
  userId,
  userRole,
  leadCircles,
  sprintName,
}: OpsClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'board' | 'deliverables' | 'updates'>('board')
  const [boardProjects, setBoardProjects] = useState<Project[]>(projects)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<string | null>(null)

  async function moveProject(projectId: string, newStatus: string) {
    const p = boardProjects.find(x => x.id === projectId)
    if (!p || p.status === newStatus) return
    if (!canMoveProject(p, userId, userRole, leadCircles)) return

    setBoardProjects(prev => prev.map(x => x.id === projectId ? { ...x, status: newStatus } : x))
    const supabase = createClient()
    const { error } = await supabase.from('projects').update({ status: newStatus }).eq('id', projectId)
    if (error) {
      setBoardProjects(prev => prev.map(x => x.id === projectId ? { ...x, status: p.status } : x))
    } else {
      router.refresh()
    }
  }

  // Sprint info
  const sprintLabel = sprintName ?? 'Community Projects'
  const onTrackCount = initialDeliverables.filter(d => d.status === 'in_progress').length
  const totalProjects = boardProjects.filter(p => ['backlog', 'in_progress', 'review'].includes(p.status)).length

  // Subtask counts per project for the card footer
  const subtasksByProject = new Map<string, { total: number; done: number }>()
  for (const d of initialDeliverables) {
    const e = subtasksByProject.get(d.project_id) ?? { total: 0, done: 0 }
    e.total += 1
    if (d.status === 'done') e.done += 1
    subtasksByProject.set(d.project_id, e)
  }

  // Kanban: group projects by status (paused projects don't appear on the board)
  const grouped = Object.fromEntries(
    PROJECT_KANBAN_COLUMNS.map(col => [
      col.key,
      boardProjects.filter(p => p.status === col.key),
    ])
  )

  // Tab styles
  function tabStyle(tab: typeof activeTab): React.CSSProperties {
    const isActive = activeTab === tab
    return {
      fontSize: 13,
      fontWeight: isActive ? 600 : 400,
      color: isActive ? 'var(--ink)' : 'var(--ink-3)',
      padding: '8px 14px',
      background: 'none',
      border: 'none',
      borderBottom: isActive ? '2px solid var(--m7)' : '2px solid transparent',
      cursor: 'pointer',
      marginBottom: -1,
      transition: 'color 120ms',
      outline: 'none',
    }
  }

  return (
    <div style={{ padding: '26px 32px 60px' }}>

      {/* ── Page Head ─────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <div>
          {/* Eyebrow pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#4338ca18',
            color: 'var(--m7)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '3px 10px',
            borderRadius: 20,
            marginBottom: 10,
          }}>
            Module 07 · Operations
          </div>

          {/* H1 */}
          <h1 style={{
            fontFamily: 'var(--display)',
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--ink)',
            lineHeight: 1.1,
            margin: '0 0 8px',
          }}>
            {sprintLabel}
          </h1>

          {/* Sub */}
          <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: 0 }}>
            {activeCount} active project{activeCount !== 1 ? 's' : ''} &middot;{' '}
            {deliverableCount} deliverable{deliverableCount !== 1 ? 's' : ''} &middot;{' '}
            {doneCount} done
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button style={{
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--ink-2)',
            background: 'var(--surface)',
            border: '1px solid var(--rule)',
            borderRadius: 8,
            padding: '8px 16px',
            cursor: 'pointer',
          }}>
            Timeline
          </button>
          <button style={{
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--ink-2)',
            background: 'var(--surface)',
            border: '1px solid var(--rule)',
            borderRadius: 8,
            padding: '8px 16px',
            cursor: 'pointer',
          }}>
            Sprint review →
          </button>
          {isAdmin && (
            <Link href="/ops/new" style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#fff',
              background: 'var(--m7)',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              cursor: 'pointer',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              display: 'inline-block',
            }}>
              + Project
            </Link>
          )}
        </div>
      </div>

      {/* ── Stat Cards ────────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
        gap: 10,
        marginBottom: 18,
      }}>
        <StatCard
          label="Active"
          value={activeCount}
          delta={`+${activeCount} this sprint`}
        />
        <StatCard
          label="Deliverables"
          value={deliverableCount}
          delta={`${doneCount} done · ${deliverableCount - doneCount} to go`}
        />
        <StatCard
          label="On track"
          value={onTrackCount}
          valueColor="var(--m5)"
          delta="across active projects"
        />
        <StatCard
          label="At risk"
          value={atRiskCount}
          valueColor={atRiskCount > 0 ? '#f59e0b' : 'var(--ink)'}
          delta={atRiskCount === 0 ? 'no late items' : `${atRiskCount} overdue`}
        />
        <StatCard
          label="Projects"
          value={totalProjects}
          delta={`${totalProjects} total`}
        />
      </div>

      {/* ── Tab Row ───────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        gap: 2,
        borderBottom: '1px solid var(--rule)',
        marginBottom: 18,
      }}>
        <button onClick={() => setActiveTab('board')} style={tabStyle('board')}>
          Board
        </button>
        <button onClick={() => setActiveTab('deliverables')} style={tabStyle('deliverables')}>
          Deliverables
        </button>
        <button onClick={() => setActiveTab('updates')} style={tabStyle('updates')}>
          Updates
        </button>
      </div>

      {/* ── Board Tab ─────────────────────────────────────────────────────── */}
      {activeTab === 'board' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
        }}>
          {PROJECT_KANBAN_COLUMNS.map(col => {
            const cards = grouped[col.key] ?? []
            const isTarget = dropTarget === col.key
            return (
              <div
                key={col.key}
                onDragOver={(e) => {
                  if (!draggingId) return
                  e.preventDefault()
                  e.dataTransfer.dropEffect = 'move'
                  if (dropTarget !== col.key) setDropTarget(col.key)
                }}
                onDragLeave={(e) => {
                  if (e.currentTarget === e.target) setDropTarget(null)
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  const id = e.dataTransfer.getData('text/plain')
                  if (id) moveProject(id, col.key)
                  setDropTarget(null)
                  setDraggingId(null)
                }}
                style={{
                  background: isTarget ? `${col.color}10` : 'var(--bg-2)',
                  borderRadius: 10,
                  padding: 10,
                  border: isTarget ? `1px dashed ${col.color}` : '1px solid transparent',
                  transition: 'background 120ms, border-color 120ms',
                }}
              >
                {/* Column header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--ink)',
                  }}>
                    {col.label}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 10,
                      color: 'var(--ink-3)',
                    }}>
                      {cards.length}
                    </span>
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: col.color,
                      flexShrink: 0,
                    }} />
                  </div>
                </div>

                {/* Cards */}
                {cards.length === 0 ? (
                  <div style={{
                    fontSize: 11,
                    color: 'var(--ink-4)',
                    padding: '12px 4px',
                    textAlign: 'center',
                  }}>
                    Empty
                  </div>
                ) : (
                  cards.map(p => {
                    const stats = subtasksByProject.get(p.id) ?? { total: 0, done: 0 }
                    const canMove = canMoveProject(p, userId, userRole, leadCircles)
                    return (
                      <ProjectKanbanCard
                        key={p.id}
                        project={p}
                        subtaskCount={stats.total}
                        doneCount={stats.done}
                        canMove={canMove}
                        onDragStart={(id) => setDraggingId(id)}
                        onDragEnd={() => { setDraggingId(null); setDropTarget(null) }}
                        isDragging={draggingId === p.id}
                      />
                    )
                  })
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Deliverables Tab ──────────────────────────────────────────────── */}
      {activeTab === 'deliverables' && (
        <DeliverablesTab deliverables={initialDeliverables} projects={boardProjects} />
      )}

      {/* ── Updates Tab ───────────────────────────────────────────────────── */}
      {activeTab === 'updates' && (
        <UpdatesTab updates={updates} projects={projects} />
      )}

    </div>
  )
}
