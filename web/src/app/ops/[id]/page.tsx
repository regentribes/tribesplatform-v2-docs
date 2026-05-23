import { createClient } from '@/core/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ProjectDetailClient from '@/modules/m07-ops/ProjectDetailClient'
import { isOpsAdmin } from '@/core/lib/roles'
import type { Project, ProjectUpdate, CollaborationAgreement } from '@/modules/m07-ops/types'

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [profileRes, projectRes, updatesRes, pendingProposalsRes, deliverablesRes, myProposalRes] = await Promise.all([
    supabase.from('user_profiles').select('role, first_name').eq('id', user.id).maybeSingle(),
    supabase.from('projects').select('*, created_by, lead_user_id').eq('id', id).single(),
    supabase.from('project_updates')
      .select('id, project_id, content, created_at, user_profiles(first_name, username)')
      .eq('project_id', id)
      .order('created_at', { ascending: false }),
    supabase.from('collaboration_agreements')
      .select('id, user_id, work_description, expected_reward, conditions, status, created_at, user_profiles(first_name, username)')
      .eq('project_id', id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false }),
    supabase.from('deliverables')
      .select('id, project_id, title, status, due_date, assignee_id, progress, from_agreement_id, user_profiles!deliverables_assignee_id_fkey(first_name, username)')
      .eq('project_id', id)
      .order('created_at', { ascending: true }),
    supabase.from('collaboration_agreements')
      .select('id, work_description, expected_reward, conditions, status')
      .eq('project_id', id)
      .eq('user_id', user.id)
      .maybeSingle(),
  ])

  if (!projectRes.data) notFound()

  const isAdmin = isOpsAdmin(profileRes.data?.role ?? '')
  const project = projectRes.data as Project
  const isProjectCreator = project.created_by === user.id || project.lead_user_id === user.id

  return (
    <ProjectDetailClient
      project={project}
      updates={(updatesRes.data ?? []) as unknown as ProjectUpdate[]}
      pendingProposals={(pendingProposalsRes.data ?? []) as unknown as CollaborationAgreement[]}
      deliverables={(deliverablesRes.data ?? []) as unknown as import('@/modules/m07-ops/types').Deliverable[]}
      myProposal={myProposalRes.data ?? null}
      userId={user.id}
      userRole={profileRes.data?.role ?? 'explorer'}
      isAdmin={isAdmin}
      isProjectCreator={isProjectCreator}
    />
  )
}
