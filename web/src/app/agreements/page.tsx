import { createClient } from '@/core/lib/supabase/server'
import { isCircleAdmin } from '@/core/lib/roles'
import { promoteToMemberIfEligible } from '@/core/lib/promotions'
import { colorForId, initialForName } from '@/core/lib/format'
import AgreementsAdminClient from '@/modules/m06-agreements/AgreementsAdminClient'
import AgreementsClient from '@/modules/m06-agreements/AgreementsClient'

export default async function AgreementsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let role = 'explorer'
  if (user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
    role = profile?.role ?? 'explorer'

    role = await promoteToMemberIfEligible(supabase, user.id, role)
  }

  const isAdmin = isCircleAdmin(role)

  if (isAdmin) {
    const { data: allAgreements } = await supabase
      .from('collaboration_agreements')
      .select(`
        id, user_id, project_id, work_description, expected_reward, status, admin_notes, created_at,
        user_profiles!collaboration_agreements_user_id_fkey(first_name, username),
        projects!collaboration_agreements_project_id_fkey(title)
      `)
      .order('created_at', { ascending: false })

    const enriched = (allAgreements ?? []).map((a: any) => ({
      id: a.id as string,
      user_id: a.user_id as string,
      project_id: a.project_id as string,
      work_description: a.work_description as string,
      expected_reward: a.expected_reward as string,
      status: a.status as string,
      admin_notes: (a.admin_notes ?? null) as string | null,
      created_at: a.created_at as string,
      first_name: a.user_profiles?.first_name ?? null,
      username: a.user_profiles?.username ?? null,
      project_title: a.projects?.title ?? null,
    }))

    return <AgreementsAdminClient agreements={enriched} />
  }

  const { data: rawProjects } = await supabase
    .from('projects')
    .select('id, title, description, status, open_for_collaborators, needs, deadline, lead_user_id, created_by')
    .in('status', ['backlog', 'in_progress', 'review'])
    .eq('open_for_collaborators', true)
    .order('created_at', { ascending: false })

  const projectRows = rawProjects ?? []
  const leadIds = [
    ...new Set(
      projectRows
        .map(p => p.lead_user_id ?? p.created_by)
        .filter((id): id is string => !!id)
    ),
  ]

  const [leadProfilesRes, myAgreementsRes] = await Promise.all([
    leadIds.length > 0
      ? supabase.from('user_profiles').select('id, first_name, username').in('id', leadIds)
      : Promise.resolve({ data: [] }),
    user
      ? supabase
          .from('collaboration_agreements')
          .select('id, project_id, work_description, expected_reward, status, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
      : Promise.resolve({ data: [] }),
  ])

  const leadProfileMap = Object.fromEntries(
    (leadProfilesRes.data ?? []).map(p => [p.id, p])
  )

  const projects = projectRows.map(p => {
    const leadId = p.lead_user_id ?? p.created_by ?? null
    const leadProfile = leadId ? leadProfileMap[leadId] : null
    const leadName = leadProfile?.first_name ?? leadProfile?.username ?? null
    return {
      id: p.id,
      title: p.title,
      description: p.description ?? null,
      status: p.status,
      open_for_collaborators: p.open_for_collaborators,
      needs: (p.needs ?? []) as string[],
      deadline: p.deadline ?? null,
      lead_user_id: p.lead_user_id ?? null,
      created_by: p.created_by ?? null,
      lead_name: leadName,
      lead_initial: initialForName(leadName),
      lead_color: colorForId(leadId),
    }
  })

  const myAgreements = (myAgreementsRes.data ?? []).map(a => ({
    id: a.id,
    project_id: a.project_id,
    work_description: a.work_description,
    expected_reward: a.expected_reward,
    status: a.status,
    created_at: a.created_at,
  }))

  return (
    <AgreementsClient
      projects={projects}
      myAgreements={myAgreements}
      userRole={role}
      userId={user?.id ?? null}
    />
  )
}
