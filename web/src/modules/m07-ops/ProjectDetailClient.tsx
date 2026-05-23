'use client'
import { useState } from 'react'
import { createClient } from '@/core/lib/supabase/client'
import { fmtDate } from '@/core/lib/format'
import { isJoiningOrAbove } from '@/core/lib/roles'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Project, Deliverable, ProjectUpdate, CollaborationAgreement, MyProposal } from './types'
import { PILLARS, PILLAR_META, isPillar, type Pillar } from '@/core/lib/pillars'
import { isActiveProject, isOpenForProposals, PROJECT_STATUS_META, PROJECT_KANBAN_COLUMNS } from '@/core/lib/project-status'

// ─── Constants ────────────────────────────────────────────────────────────────
// Status label/color for the project header pill comes from PROJECT_STATUS_META.


const BLOCKING_STATUSES = ['pending', 'accepted', 'active', 'completed']
const PROPOSAL_STATUS_INFO: Record<string, { label: string; color: string; note: string }> = {
  pending:   { label: 'Pending review', color: '#f59e0b', note: 'Your proposal is waiting for admin review.' },
  accepted:  { label: 'Accepted',       color: '#22c55e', note: 'Your proposal was accepted. Start your contribution!' },
  active:    { label: 'Active',         color: '#3b82f6', note: 'Your collaboration is underway.' },
  completed: { label: 'Completed',      color: '#94a3b8', note: 'This collaboration has been marked complete.' },
  rejected:  { label: 'Not accepted',   color: '#ef4444', note: 'Your previous proposal was not accepted. You can submit a new one.' },
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProjectDetailClient({
  project, updates, pendingProposals: initialPendingProposals,
  deliverables: initialDeliverables, myProposal: initialMyProposal, userId, userRole, isAdmin, isProjectCreator,
}: {
  project: Project
  updates: ProjectUpdate[]
  pendingProposals: CollaborationAgreement[]
  deliverables: Deliverable[]
  myProposal: MyProposal | null
  userId: string
  userRole: string
  isAdmin: boolean
  isProjectCreator: boolean
}) {
  const supabase = createClient()
  const router = useRouter()
  const s = PROJECT_STATUS_META[project.status] ?? PROJECT_STATUS_META.backlog

  const canManage = isAdmin || isProjectCreator
  const canPropose = !canManage && isJoiningOrAbove(userRole) && project.open_for_collaborators && isOpenForProposals(project.status)

  // ── Kanban state (deliverables + pending proposals as Ideas) ──────────────
  const [deliverables, setDeliverables] = useState<Deliverable[]>(initialDeliverables)
  const [pendingProposals, setPendingProposals] = useState<CollaborationAgreement[]>(initialPendingProposals)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDue, setNewTaskDue] = useState('')
  const [addingTask, setAddingTask] = useState(false)
  const [taskError, setTaskError] = useState<string | null>(null)

  // ── Drag-and-drop state ───────────────────────────────────────────────────
  const [dragging, setDragging] = useState<{ kind: 'deliverable' | 'proposal'; id: string } | null>(null)
  const [dropTarget, setDropTarget] = useState<string | null>(null)

  // ── Updates state ───────────────────────────────────────────────────────────
  const [updateText, setUpdateText] = useState('')
  const [postingUpdate, setPostingUpdate] = useState(false)

  // ── Project settings (admin only) ───────────────────────────────────────────
  const [editStatus, setEditStatus] = useState(project.status)
  const [editOpenCollab, setEditOpenCollab] = useState(project.open_for_collaborators)
  const [editCircle, setEditCircle] = useState<Pillar | ''>(isPillar(project.circle) ? project.circle : '')
  const [savingSettings, setSavingSettings] = useState(false)

  // ── Proposal form ───────────────────────────────────────────────────────────
  const [myProposal, setMyProposal] = useState<MyProposal | null>(initialMyProposal)
  const hasBlockingProposal = !!myProposal && BLOCKING_STATUSES.includes(myProposal.status)
  const [showProposalForm, setShowProposalForm] = useState(false)
  const [workDesc, setWorkDesc] = useState(myProposal?.work_description ?? '')
  const [reward, setReward] = useState(myProposal?.expected_reward ?? '')
  const [conditions, setConditions] = useState(myProposal?.conditions ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  async function submitProposal() {
    if (!workDesc.trim() || !reward.trim()) return
    setSubmitting(true)
    setSubmitError(null)
    const { data, error } = await supabase
      .from('collaboration_agreements')
      .upsert({
        project_id: project.id,
        user_id: userId,
        work_description: workDesc.trim(),
        expected_reward: reward.trim(),
        conditions: conditions.trim() || null,
        status: 'pending',
      }, { onConflict: 'project_id,user_id' })
      .select('id, work_description, expected_reward, conditions, status')
      .single()
    if (error) {
      setSubmitError(error.message)
      setSubmitting(false)
      return
    }
    setMyProposal(data)
    setShowProposalForm(false)
    setSubmitting(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    padding: '10px 14px', borderRadius: 'var(--radius)',
    border: '1px solid var(--rule)', background: 'var(--surface)',
    color: 'var(--ink)', fontSize: 14, outline: 'none', fontFamily: 'inherit',
  }

  async function addSubtask() {
    if (!newTaskTitle.trim()) return
    setAddingTask(true)
    setTaskError(null)
    const { data, error } = await supabase.from('deliverables').insert({
      project_id: project.id,
      title: newTaskTitle.trim(),
      due_date: newTaskDue || null,
      status: 'backlog',
      progress: 0,
    }).select('id, project_id, title, status, due_date, assignee_id, progress').single()
    if (error) {
      setTaskError(error.message)
      setAddingTask(false)
      return
    }
    setDeliverables(prev => [...prev, data])
    setNewTaskTitle('')
    setNewTaskDue('')
    setAddingTask(false)
  }

  async function updateTaskStatus(taskId: string, newStatus: string) {
    setDeliverables(prev => prev.map(d => d.id === taskId ? { ...d, status: newStatus } : d))
    await supabase.from('deliverables').update({ status: newStatus }).eq('id', taskId)
  }

  async function deleteTask(taskId: string) {
    setDeliverables(prev => prev.filter(d => d.id !== taskId))
    await supabase.from('deliverables').delete().eq('id', taskId)
  }

  /** Accept a pending proposal: flip its status to 'accepted' and spawn a
   * matching deliverable that lands in the backlog column. The deliverable
   * carries from_agreement_id so we can trace the link later. */
  async function acceptProposal(agreementId: string, targetStatus: string = 'backlog') {
    const proposal = pendingProposals.find(p => p.id === agreementId)
    if (!proposal) return

    setPendingProposals(prev => prev.filter(p => p.id !== agreementId))
    const optimisticDeliverable: Deliverable = {
      id: `optimistic-${agreementId}`,
      project_id: project.id,
      title: (proposal.work_description ?? '').slice(0, 120) || 'Contribution',
      status: targetStatus,
      due_date: null,
      assignee_id: (proposal as CollaborationAgreement & { user_id?: string }).user_id ?? null,
      progress: 0,
      from_agreement_id: agreementId,
      user_profiles: proposal.user_profiles ?? null,
    }
    setDeliverables(prev => [...prev, optimisticDeliverable])

    const { error: agreementErr } = await supabase
      .from('collaboration_agreements')
      .update({ status: 'accepted' })
      .eq('id', agreementId)

    if (agreementErr) {
      setPendingProposals(prev => [proposal, ...prev])
      setDeliverables(prev => prev.filter(d => d.id !== optimisticDeliverable.id))
      return
    }

    const { data: newDeliverable, error: insertErr } = await supabase
      .from('deliverables')
      .insert({
        project_id: project.id,
        title: optimisticDeliverable.title,
        status: targetStatus,
        progress: 0,
        assignee_id: optimisticDeliverable.assignee_id,
        from_agreement_id: agreementId,
      })
      .select('id, project_id, title, status, due_date, assignee_id, progress, from_agreement_id')
      .single()

    if (insertErr || !newDeliverable) {
      setDeliverables(prev => prev.filter(d => d.id !== optimisticDeliverable.id))
      return
    }
    setDeliverables(prev => prev.map(d =>
      d.id === optimisticDeliverable.id
        ? { ...newDeliverable, user_profiles: proposal.user_profiles ?? null }
        : d
    ))
    router.refresh()
  }

  function handleDrop(columnKey: string) {
    if (!dragging) return
    if (dragging.kind === 'proposal') {
      if (columnKey === 'pending') return
      acceptProposal(dragging.id, columnKey === 'pending' ? 'backlog' : columnKey)
    } else {
      if (columnKey === 'pending') return
      updateTaskStatus(dragging.id, columnKey)
    }
    setDragging(null)
    setDropTarget(null)
  }

  async function postUpdate() {
    if (!updateText.trim()) return
    setPostingUpdate(true)
    await supabase.from('project_updates').insert({
      project_id: project.id,
      user_id: userId,
      content: updateText.trim(),
    })
    setUpdateText('')
    setPostingUpdate(false)
    router.refresh()
  }

  async function saveProjectSettings() {
    setSavingSettings(true)
    await supabase.from('projects').update({
      status: editStatus,
      open_for_collaborators: editOpenCollab,
      circle: editCircle || null,
    }).eq('id', project.id)
    setSavingSettings(false)
    router.refresh()
  }

  return (
    <div className="ops-detail-root" style={{ maxWidth: 920, margin: '0 auto', padding: '48px 20px 80px' }}>

      {/* Back */}
      <Link href="/ops" style={{ fontSize: 13, color: 'var(--ink-4)', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 28 }}>
        ← Operations
      </Link>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <h1 className="ops-detail-h1" style={{ fontFamily: 'var(--display)', fontSize: 28, color: 'var(--ink)', lineHeight: 1.1 }}>
            {project.title}
          </h1>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: s.color, background: `${s.color}15`, padding: '3px 10px', borderRadius: 20 }}>
            {s.label}
          </span>
          {project.open_for_collaborators && isActiveProject(project.status) && (
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#3b82f6', background: '#3b82f615', padding: '3px 10px', borderRadius: 20 }}>
              Open for collaborators
            </span>
          )}
          {isPillar(project.circle) && (() => {
            const m = PILLAR_META[project.circle]
            return (
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: m.color, background: `${m.color}15`, padding: '3px 10px', borderRadius: 20 }}>
                {m.emoji} {m.label}
              </span>
            )
          })()}
        </div>
        {project.description && (
          <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.65, maxWidth: 640 }}>
            {project.description}
          </p>
        )}
        {canPropose && !hasBlockingProposal && (
          <button
            onClick={() => setShowProposalForm(v => !v)}
            style={{ display: 'block', width: '100%', maxWidth: 260, marginTop: 16, background: showProposalForm ? 'var(--bg-2)' : '#3b82f6', color: showProposalForm ? 'var(--ink-3)' : '#fff', fontSize: 13, fontWeight: 600, padding: '10px 20px', borderRadius: 'var(--radius)', border: showProposalForm ? '1px solid var(--rule)' : 'none', cursor: 'pointer', textAlign: 'center' }}
          >
            {showProposalForm ? 'Cancel' : 'Propose collaboration →'}
          </button>
        )}
        {canPropose && hasBlockingProposal && myProposal && (() => {
          const info = PROPOSAL_STATUS_INFO[myProposal.status]
          return (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 16, background: `${info.color}12`, border: `1px solid ${info.color}40`, borderRadius: 'var(--radius)', padding: '8px 14px' }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: info.color }}>{info.label}</span>
              <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{info.note}</span>
            </div>
          )
        })()}
      </div>

      {/* ── Inline proposal form ─────────────────────────────────────────────── */}
      {showProposalForm && canPropose && (
        <div style={{
          background: 'color-mix(in srgb, #3b82f6 5%, var(--surface))',
          border: '1px solid color-mix(in srgb, #3b82f6 30%, var(--rule))',
          borderRadius: 12, padding: '22px 24px', marginBottom: 32,
        }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3b82f6', marginBottom: 18 }}>
            Propose collaboration
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', marginBottom: 6 }}>
                What will you contribute? <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                value={workDesc}
                onChange={e => setWorkDesc(e.target.value)}
                placeholder="Describe what you'll do, deliver, or create for this project…"
                rows={3}
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 'var(--radius)', border: '1px solid var(--rule)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 14, resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', marginBottom: 6 }}>
                What do you expect in return? <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                value={reward}
                onChange={e => setReward(e.target.value)}
                placeholder="Mentorship, credits, revenue share, recognition…"
                rows={2}
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 'var(--radius)', border: '1px solid var(--rule)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 14, resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', marginBottom: 6 }}>
                Any conditions or notes? <span style={{ color: 'var(--ink-4)', fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                value={conditions}
                onChange={e => setConditions(e.target.value)}
                placeholder="Timing constraints, availability, dependencies…"
                rows={2}
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 'var(--radius)', border: '1px solid var(--rule)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 14, resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit', outline: 'none' }}
              />
            </div>
            {submitError && (
              <p style={{ fontSize: 12, color: '#ef4444', margin: 0 }}>{submitError}</p>
            )}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button
                onClick={submitProposal}
                disabled={submitting || !workDesc.trim() || !reward.trim()}
                style={{ background: '#3b82f6', color: '#fff', fontSize: 13, fontWeight: 600, padding: '9px 22px', borderRadius: 'var(--radius)', border: 'none', cursor: submitting || !workDesc.trim() || !reward.trim() ? 'not-allowed' : 'pointer', opacity: submitting || !workDesc.trim() || !reward.trim() ? 0.6 : 1 }}
              >
                {submitting ? 'Submitting…' : 'Submit proposal'}
              </button>
              <button
                onClick={() => setShowProposalForm(false)}
                style={{ background: 'none', border: 'none', fontSize: 13, color: 'var(--ink-4)', cursor: 'pointer', padding: '9px 4px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="ops-detail-grid" style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr 340px' : '1fr', gap: 32 }}>

        {/* ── Left column ──────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* ── Project Kanban: Ideas (proposals) + deliverables ──────────── */}
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 14, display: 'flex', justifyContent: 'space-between' }}>
              <span>
                Subtasks · {deliverables.length}
                {canManage && pendingProposals.length > 0 && ` · ${pendingProposals.length} idea${pendingProposals.length === 1 ? '' : 's'}`}
              </span>
            </div>

            {canManage && (
              <div style={{
                background: 'var(--bg-2)', border: '1px solid var(--rule)',
                borderRadius: 10, padding: '14px 16px', marginBottom: 14,
              }}>
                <div className="ops-subtask-form" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addSubtask()}
                    placeholder="New subtask title…"
                    style={{ ...inputStyle, flex: '1 1 200px', padding: '8px 12px', fontSize: 13 }}
                  />
                  <input
                    type="date"
                    value={newTaskDue}
                    onChange={e => setNewTaskDue(e.target.value)}
                    style={{ ...inputStyle, width: 'auto', padding: '8px 12px', fontSize: 13, colorScheme: 'dark' }}
                  />
                  <button
                    onClick={addSubtask}
                    disabled={addingTask || !newTaskTitle.trim()}
                    style={{
                      background: 'var(--m7)', color: '#fff', fontSize: 13, fontWeight: 600,
                      padding: '8px 18px', borderRadius: 8, border: 'none', whiteSpace: 'nowrap',
                      cursor: addingTask || !newTaskTitle.trim() ? 'not-allowed' : 'pointer',
                      opacity: addingTask || !newTaskTitle.trim() ? 0.55 : 1,
                    }}
                  >
                    {addingTask ? 'Adding…' : '+ Add'}
                  </button>
                </div>
                {taskError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 8, marginBottom: 0 }}>{taskError}</p>}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10 }}>
              {PROJECT_KANBAN_COLUMNS.map(col => {
                const isTarget = dropTarget === col.key
                const cards = col.key === 'pending'
                  ? (canManage ? pendingProposals : [])
                  : deliverables.filter(d => d.status === col.key)
                const droppable = canManage
                return (
                  <div
                    key={col.key}
                    onDragOver={(e) => {
                      if (!droppable || !dragging) return
                      e.preventDefault()
                      e.dataTransfer.dropEffect = 'move'
                      if (dropTarget !== col.key) setDropTarget(col.key)
                    }}
                    onDragLeave={(e) => {
                      if (e.currentTarget === e.target) setDropTarget(null)
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      handleDrop(col.key)
                    }}
                    style={{
                      background: isTarget ? `${col.color}10` : 'var(--bg-2)',
                      borderRadius: 10,
                      padding: 8,
                      border: isTarget ? `1px dashed ${col.color}` : '1px solid transparent',
                      transition: 'background 120ms, border-color 120ms',
                      minHeight: 100,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink)' }}>{col.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)' }}>{cards.length}</span>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: col.color }} />
                      </div>
                    </div>

                    {cards.length === 0 ? (
                      <div style={{ fontSize: 11, color: 'var(--ink-4)', padding: '8px 4px', textAlign: 'center' }}>
                        {col.key === 'pending' && !canManage ? '—' : 'Empty'}
                      </div>
                    ) : col.key === 'pending' ? (
                      cards.map(p => {
                        const proposal = p as CollaborationAgreement
                        const name = proposal.user_profiles?.first_name ?? proposal.user_profiles?.username ?? 'Community member'
                        return (
                          <div
                            key={proposal.id}
                            draggable={canManage}
                            onDragStart={(e) => {
                              if (!canManage) return
                              e.dataTransfer.effectAllowed = 'move'
                              e.dataTransfer.setData('text/plain', proposal.id)
                              setDragging({ kind: 'proposal', id: proposal.id })
                            }}
                            onDragEnd={() => { setDragging(null); setDropTarget(null) }}
                            style={{
                              background: 'var(--surface)', border: '1px solid var(--rule)',
                              borderLeft: `3px solid #3b82f6`,
                              borderRadius: 8, padding: '10px 12px', marginBottom: 6,
                              cursor: canManage ? 'grab' : 'default',
                              opacity: dragging?.id === proposal.id ? 0.5 : 1,
                            }}
                          >
                            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>{name}</div>
                            <div style={{ fontSize: 11, color: 'var(--ink-2)', lineHeight: 1.45, marginBottom: 4 }}>
                              <span style={{ color: 'var(--ink-3)' }}>Offers: </span>{proposal.work_description}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--ink-2)', lineHeight: 1.45, marginBottom: 8 }}>
                              <span style={{ color: 'var(--ink-3)' }}>Wants: </span>{proposal.expected_reward}
                            </div>
                            {canManage && (
                              <button
                                onClick={() => acceptProposal(proposal.id, 'backlog')}
                                style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, border: 'none', background: '#22c55e', color: '#fff', cursor: 'pointer' }}
                              >
                                Accept →
                              </button>
                            )}
                          </div>
                        )
                      })
                    ) : (
                      cards.map(c => {
                        const d = c as Deliverable
                        const assignee = d.user_profiles?.first_name ?? d.user_profiles?.username ?? null
                        return (
                          <div
                            key={d.id}
                            draggable={canManage}
                            onDragStart={(e) => {
                              if (!canManage) return
                              e.dataTransfer.effectAllowed = 'move'
                              e.dataTransfer.setData('text/plain', d.id)
                              setDragging({ kind: 'deliverable', id: d.id })
                            }}
                            onDragEnd={() => { setDragging(null); setDropTarget(null) }}
                            style={{
                              background: 'var(--surface)', border: '1px solid var(--rule)',
                              borderRadius: 8, padding: '8px 10px', marginBottom: 6,
                              cursor: canManage ? 'grab' : 'default',
                              opacity: dragging?.id === d.id ? 0.5 : 1,
                            }}
                          >
                            <div style={{
                              fontSize: 12, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.35, marginBottom: 6,
                              textDecoration: d.status === 'done' ? 'line-through' : 'none',
                              opacity: d.status === 'done' ? 0.6 : 1,
                            }}>
                              {d.title}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', fontSize: 10, color: 'var(--ink-4)', fontFamily: 'var(--mono)' }}>
                              {assignee && <span>· {assignee}</span>}
                              {d.due_date && <span>· {fmtDate(d.due_date)}</span>}
                              {canManage && (
                                <button
                                  onClick={() => deleteTask(d.id)}
                                  style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--ink-4)', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0 }}
                                  title="Remove subtask"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Updates feed ──────────────────────────────────────────────── */}
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 14 }}>
              Updates
            </div>

            {canManage && (
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--rule)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: 20 }}>
                <textarea
                  value={updateText}
                  onChange={e => setUpdateText(e.target.value)}
                  placeholder="Post an update for this project…"
                  rows={3}
                  style={{ ...inputStyle, background: 'var(--surface)', resize: 'vertical', lineHeight: 1.6, marginBottom: 10 }}
                />
                <button
                  onClick={postUpdate}
                  disabled={postingUpdate || !updateText.trim()}
                  style={{ background: '#4338ca', color: '#fff', fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 'var(--radius)', border: 'none', cursor: postingUpdate || !updateText.trim() ? 'not-allowed' : 'pointer', opacity: postingUpdate || !updateText.trim() ? 0.65 : 1 }}
                >
                  {postingUpdate ? 'Posting…' : 'Post update'}
                </button>
              </div>
            )}

            {updates.length === 0 ? (
              <div style={{ color: 'var(--ink-4)', fontSize: 13, padding: '24px 0' }}>No updates yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {updates.map((u, i) => {
                  const author = u.user_profiles?.first_name ?? u.user_profiles?.username ?? 'Team'
                  const date = new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  return (
                    <div key={u.id} className="ops-update-row" style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0 16px', paddingBottom: 24 }}>
                      <div style={{ paddingTop: 3 }}>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-4)' }}>{date}</div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--accent)', marginTop: 2 }}>{author}</div>
                      </div>
                      <div style={{ borderLeft: '1px solid var(--rule)', paddingLeft: 16, position: 'relative' }}>
                        <div style={{ position: 'absolute', left: -5, top: 6, width: 8, height: 8, borderRadius: '50%', background: i === 0 ? '#4338ca' : 'var(--rule)', border: '1.5px solid var(--surface)' }} />
                        <p style={{ color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>{u.content}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Right column — admin panel only ──────────────────────────────── */}
        {isAdmin && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Project settings */}
            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--rule)', borderRadius: 'var(--radius)', padding: '16px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 12 }}>Project settings</div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', marginBottom: 6 }}>Status</label>
                <select value={editStatus} onChange={e => setEditStatus(e.target.value)} style={{ ...inputStyle, padding: '8px 12px', fontSize: 13 }}>
                  <option value="pending">Idea</option>
                  <option value="backlog">Backlog</option>
                  <option value="in_progress">In progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', marginBottom: 6 }}>Circle</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {PILLARS.map(p => {
                    const meta = PILLAR_META[p]
                    const active = editCircle === p
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setEditCircle(active ? '' : p)}
                        style={{
                          fontSize: 11, fontWeight: 600,
                          padding: '4px 9px', borderRadius: 20,
                          background: active ? meta.color : 'var(--surface)',
                          color: active ? '#fff' : 'var(--ink-3)',
                          border: `1px solid ${active ? meta.color : 'var(--rule)'}`,
                          cursor: 'pointer',
                        }}
                      >
                        {meta.emoji} {meta.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 14 }}>
                <input type="checkbox" checked={editOpenCollab} onChange={e => setEditOpenCollab(e.target.checked)} style={{ accentColor: '#4338ca' }} />
                <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>Open for collaborators</span>
              </label>
              <button onClick={saveProjectSettings} disabled={savingSettings} style={{ background: '#4338ca', color: '#fff', fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 'var(--radius)', border: 'none', cursor: savingSettings ? 'not-allowed' : 'pointer', opacity: savingSettings ? 0.65 : 1 }}>
                {savingSettings ? 'Saving…' : 'Save settings'}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
