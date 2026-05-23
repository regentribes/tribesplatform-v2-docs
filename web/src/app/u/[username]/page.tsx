import { createClient } from '@/core/lib/supabase/server'
import { notFound } from 'next/navigation'
import { computeMatch } from '@/modules/m01-network/lib/match-score'
import UserProfileClient from './UserProfileClient'
import NetworkSidebar from '@/modules/m01-network/NetworkSidebar'
import NetworkRightPanel from '@/modules/m01-network/NetworkRightPanel'

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Profile being viewed + viewer's own data (for sidebar/right panel) fetched in parallel
  const [profileRes, viewerProfileRes, viewerBioRes, viewerOffersRes, viewerRequestsRes] = await Promise.all([
    supabase.from('user_profiles').select('*').eq('username', username).maybeSingle(),
    user ? supabase.from('user_profiles').select('username, avatar_url, first_name, headline, city, country').eq('id', user.id).maybeSingle() : Promise.resolve({ data: null }),
    user ? supabase.from('user_bio').select('values_principles, skills, interests, goals, places_traveling, personality_details').eq('user_id', user.id).maybeSingle() : Promise.resolve({ data: null }),
    user ? supabase.from('user_offers').select('id').eq('user_id', user.id) : Promise.resolve({ data: null }),
    user ? supabase.from('user_requests').select('id').eq('user_id', user.id) : Promise.resolve({ data: null }),
  ])

  const profile = profileRes.data
  if (!profile) notFound()

  const [bioRes, offersRes, requestsRes] = await Promise.all([
    supabase.from('user_bio').select('*').eq('user_id', profile.id).maybeSingle(),
    supabase.from('user_offers').select('*').eq('user_id', profile.id).eq('is_active', true),
    supabase.from('user_requests').select('*').eq('user_id', profile.id).eq('is_active', true),
  ])

  // Compute match score between viewer and profile being viewed.
  // Merge city/country from each user_profile so the match function can score location proximity.
  const isOwn = user?.id === profile.id
  const viewerBioWithLoc = viewerBioRes.data && viewerProfileRes.data
    ? { ...viewerBioRes.data, city: (viewerProfileRes.data as any).city, country: (viewerProfileRes.data as any).country }
    : viewerBioRes.data
  const subjectBioWithLoc = bioRes.data
    ? { ...bioRes.data, city: (profile as any).city, country: (profile as any).country }
    : null
  const match = (!isOwn && user && viewerBioWithLoc && subjectBioWithLoc)
    ? computeMatch(viewerBioWithLoc as any, subjectBioWithLoc as any)
    : null

  // Build sidebar + right panel data from the viewer's own profile
  const vp = viewerProfileRes.data
  const vb = viewerBioRes.data
  const vpd = vb?.personality_details as any
  const sidebarUser = vp ? { username: vp.username, first_name: vp.first_name, avatar_url: vp.avatar_url } : null

  let rightPanelData = null
  if (user && vp) {
    const steps = [
      { label: 'Name',        complete: !!(vp.first_name) },
      { label: 'Headline',    complete: !!(vp.headline) },
      { label: 'Values',      complete: !!(vb?.values_principles) },
      { label: 'Personality', complete: !!(vpd?.myersBriggs) },
      { label: 'Skills',      complete: (vb?.skills?.length ?? 0) > 0 },
      { label: 'Goals',       complete: !!(vb?.goals) },
      { label: 'Offers',      complete: (viewerOffersRes.data?.length ?? 0) > 0 },
    ]
    const completed = steps.filter(s => s.complete).length
    rightPanelData = { steps, completed, completeness: Math.round((completed / steps.length) * 100) }
  }

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 52px)', alignItems: 'flex-start' }}>
      <NetworkSidebar user={sidebarUser} />
      <main className="net-content" style={{ flex: 1, minWidth: 0 }}>
        <UserProfileClient
          profile={profile}
          bio={bioRes.data ?? null}
          offers={offersRes.data ?? []}
          requests={requestsRes.data ?? []}
          isOwn={isOwn}
          match={match}
        />
      </main>
      <NetworkRightPanel data={rightPanelData} />
    </div>
  )
}
