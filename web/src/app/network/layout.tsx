import { createClient } from '@/core/lib/supabase/server'
import NetworkSidebar from '@/modules/m01-network/NetworkSidebar'
import NetworkRightPanel from '@/modules/m01-network/NetworkRightPanel'

// All /network/* pages render inside the M01 shell: left module sidebar + main + right panel.
// Same structure as /u/[username] so the M01 module looks consistent everywhere.
export default async function NetworkLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [viewerProfileRes, viewerBioRes, viewerOffersRes] = await Promise.all([
    user ? supabase.from('user_profiles').select('username, avatar_url, first_name, headline').eq('id', user.id).maybeSingle() : Promise.resolve({ data: null }),
    user ? supabase.from('user_bio').select('values_principles, skills, goals, personality_details').eq('user_id', user.id).maybeSingle() : Promise.resolve({ data: null }),
    user ? supabase.from('user_offers').select('id').eq('user_id', user.id) : Promise.resolve({ data: null }),
  ])

  const vp = viewerProfileRes.data as { username: string | null; avatar_url: string | null; first_name: string | null; headline: string | null } | null
  const vb = viewerBioRes.data as { values_principles: string | null; skills: string[] | null; goals: string | null; personality_details: { myersBriggs?: string | null } | null } | null
  const vpd = vb?.personality_details
  const sidebarUser = vp ? { username: vp.username, first_name: vp.first_name, avatar_url: vp.avatar_url } : null

  let rightPanelData: { steps: { label: string; complete: boolean }[]; completed: number; completeness: number } | null = null
  if (user && vp) {
    const steps = [
      { label: 'Name',        complete: !!vp.first_name },
      { label: 'Headline',    complete: !!vp.headline },
      { label: 'Values',      complete: !!vb?.values_principles },
      { label: 'Personality', complete: !!vpd?.myersBriggs },
      { label: 'Skills',      complete: (vb?.skills?.length ?? 0) > 0 },
      { label: 'Goals',       complete: !!vb?.goals },
      { label: 'Offers',      complete: (viewerOffersRes.data?.length ?? 0) > 0 },
    ]
    const completed = steps.filter(s => s.complete).length
    rightPanelData = { steps, completed, completeness: Math.round((completed / steps.length) * 100) }
  }

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 52px)', alignItems: 'flex-start' }}>
      <NetworkSidebar user={sidebarUser} />
      <main className="net-content" style={{ flex: 1, minWidth: 0 }}>
        {children}
      </main>
      <NetworkRightPanel data={rightPanelData} />
    </div>
  )
}
