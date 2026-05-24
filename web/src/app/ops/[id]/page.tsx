import { createClient } from '@/core/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ProjectDetailClient from '@/modules/m07-ops/ProjectDetailClient'
import { isOpsAdmin } from '@/core/lib/roles'
import type { Project, ProjectUpdate, CollaborationAgreement, SubscriberProfile } from '@/modules/m07-ops/types'

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [
    profileRes, projectRes, updatesRes,
    pendingProposalsRes, deliverablesRes, myProposalRes,
    projectSubsRes, deliverableSubsRes,
  ] = await Promise.all([
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
    // Project subscribers
    supabase.from('project_subscriptions')
      .select('user_id, user_profiles(first_name, username)')
      .eq('project_id', id),
    // Deliverable subscribers for all deliverables of this project
    supabase.from('deliverable_subscriptions')
      .select('deliverable_id, user_id, user_profiles(first_name, username)')
      .in('deliverable_id',
        // We can't easily filter by project here without a subquery — fetch all and filter client-side
        // But we need the deliverable IDs. Let's fetch all for now; we filter in the component.
        // Alternative: pass empty array if we don't have IDs yet — we'll re-fetch in component.
        ['__placeholder__'] // will be replaced below
      ),
  ])

  if (!projectRes.data) notFound()

  // Fetch deliverable subs properly using the real deliverable IDs
  const deliverableIds = (deliverablesRes.data ?? []).map((d: any) => d.id as string)
  const deliverableSubsReal = deliverableIds.length > 0
    ? await supabase
        .from('deliverable_subscriptions')
        .select('deliverable_id, user_id, user_profiles(first_name, username)')
        .in('deliverable_id', deliverableIds)
    : { data: [] }

  // Shape project subscribers
  const projectSubscribers: SubscriberProfile[] = (projectSubsRes.data ?? []).map((s: any) => ({
    user_id: s.user_id,
    first_name: s.user_profiles?.first_name ?? null,
    username: s.user_profiles?.username ?? null,
  }))
  const isProjectSubscribed = projectSubscribers.some(s => s.user_id === user.id)

  // Shape deliverable subscribers: keyed by deliverable_id
  const deliverableSubscribers: Record<string, SubscriberProfile[]> = {}
  for (const row of deliverableSubsReal.data ?? []) {
    const r = row as any
    if (!deliverableSubscribers[r.deliverable_id]) deliverableSubscribers[r.deliverable_id] = []
    deliverableSubscribers[r.deliverable_id].push({
      user_id: r.user_id,
      first_name: r.user_profiles?.first_name ?? null,
      username: r.user_profiles?.username ?? null,
    })
  }

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
      projectSubscribers={projectSubscribers}
      isProjectSubscribed={isProjectSubscribed}
      deliverableSubscribers={deliverableSubscribers}
    />
  )
}
