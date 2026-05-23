import { createClient } from '@/core/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent } from '@/core/components/ui/card'
import { Button } from '@/core/components/ui/button'
import { User, Gift, HelpCircle, Search, Sparkles } from 'lucide-react'
import MemberList from '@/modules/m01-network/MemberList'
import { computeMatch, type Bio, type MatchResult } from '@/modules/m01-network/lib/match-score'

export default async function NetworkDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [memberCountRes, recentRes] = await Promise.all([
    supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
    supabase.from('user_profiles')
      .select('id, username, first_name, last_name, avatar_url, user_types, city, country')
      .order('created_at', { ascending: false })
      .limit(8),
  ])

  const memberCount = memberCountRes.count ?? 0
  const recentUsers = (recentRes.data ?? []).filter(u => u.id !== user?.id)

  let offersCount = 0
  let seeksCount = 0
  let displayName: string | null = null
  let myBio: Bio = null
  let topMatches: { profile: NonNullable<typeof recentRes.data>[number]; score: number; reasons: string[] }[] = []
  const recentMatchScores: Record<string, MatchResult> = {}

  if (user) {
    const [offersRes, seeksRes, profileRes, allProfilesRes, allBiosRes, myBioRes] = await Promise.all([
      supabase.from('user_offers').select('id').eq('user_id', user.id),
      supabase.from('user_requests').select('id').eq('user_id', user.id),
      supabase.from('user_profiles').select('first_name, last_name, city, country').eq('id', user.id).maybeSingle(),
      supabase.from('user_profiles')
        .select('id, username, first_name, last_name, avatar_url, city, country, user_types')
        .neq('id', user.id),
      supabase.from('user_bio').select('*'),
      supabase.from('user_bio').select('*').eq('user_id', user.id).maybeSingle(),
    ])

    offersCount = offersRes.data?.length ?? 0
    seeksCount = seeksRes.data?.length ?? 0
    const profile = profileRes.data
    displayName = profile
      ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Explorer'
      : null

    // Merge location from user_profiles into Bio objects so computeMatch can use it.
    myBio = myBioRes.data ? { ...myBioRes.data, city: profile?.city, country: profile?.country } as Bio : null
    const profileLocById = new Map<string, { city?: string | null; country?: string | null }>()
    for (const p of allProfilesRes.data ?? []) profileLocById.set(p.id, { city: p.city, country: p.country })
    const bioMap: Record<string, Bio> = {}
    for (const b of allBiosRes.data ?? []) {
      const loc = profileLocById.get(b.user_id) ?? {}
      bioMap[b.user_id] = { ...b, city: loc.city, country: loc.country } as Bio
    }

    topMatches = (allProfilesRes.data ?? [])
      .map(p => {
        const { score, reasons } = computeMatch(myBio, bioMap[p.id] ?? null)
        return { profile: p, score, reasons }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)

    if (myBio) {
      for (const u of recentUsers) {
        recentMatchScores[u.id] = computeMatch(myBio, bioMap[u.id] ?? null)
      }
    }
  }

  const stats = user
    ? [
        { label: 'Network Members', value: memberCount, icon: User,       description: 'Total members' },
        { label: 'Active Offers',   value: offersCount, icon: Gift,       description: 'You provide' },
        { label: 'Active Requests', value: seeksCount,  icon: HelpCircle, description: 'Help you seek' },
        { label: 'Connections',     value: '—',         icon: Search,     description: 'Coming soon' },
      ]
    : [
        { label: 'Network Members', value: memberCount, icon: User,       description: 'Growing community' },
        { label: 'Skill Offers',    value: '—',         icon: Gift,       description: 'Sign in to post' },
        { label: 'Help Requests',   value: '—',         icon: HelpCircle, description: 'Sign in to post' },
        { label: 'Connections',     value: '—',         icon: Search,     description: 'Coming soon' },
      ]

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">

      {!user && (
        <div style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent)', borderRadius: 'var(--radius)', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 0 }}>
            You're browsing the network as a guest. <strong>Join free</strong> to post your offers, make requests, and connect with people.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/auth/signup" style={{ fontSize: 12.5, fontWeight: 700, color: '#fff', background: 'var(--accent)', padding: '5px 14px', borderRadius: 20, textDecoration: 'none' }}>
              Join free
            </Link>
            <Link href="/auth/login" style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent)', textDecoration: 'none', padding: '5px 4px' }}>
              Sign in
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {user && displayName ? `Welcome back, ${displayName}!` : 'Community Network'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {user ? "Here's what's happening in your regenerative network" : 'Browse the people building regenerative neighborhoods'}
          </p>
        </div>
        <Button asChild>
          <Link href="/network/discover"><Search className="mr-2 h-4 w-4" />Explore Network</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Card key={stat.label} className="border-card-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {user && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles style={{ width: 16, height: 16, color: 'var(--m1)' }} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
                Your Matches
              </span>
            </div>
            <Link href="/network/matches" style={{ fontSize: 12.5, color: 'var(--m1)', fontWeight: 600, textDecoration: 'none' }}>
              See all →
            </Link>
          </div>

          {!myBio ? (
            <div style={{
              background: 'color-mix(in srgb, var(--m1) 6%, var(--surface))',
              border: '1px solid color-mix(in srgb, var(--m1) 25%, var(--rule))',
              borderRadius: 12, padding: '16px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
            }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>Complete your profile to unlock matches</p>
                <p style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.5 }}>Add your skills, values, and personality to find the people most aligned with you.</p>
              </div>
              <Link href="/profile/edit" style={{
                background: 'var(--m1)', color: '#fff', fontSize: 13, fontWeight: 600,
                padding: '8px 18px', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                Complete profile →
              </Link>
            </div>
          ) : topMatches.length === 0 ? (
            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--rule)', borderRadius: 12, padding: '20px', textAlign: 'center', color: 'var(--ink-4)', fontSize: 13 }}>
              No other members yet — you'll be first when they join.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
              {topMatches.map(({ profile: p, score, reasons }) => {
                const name = [p.first_name, p.last_name].filter(Boolean).join(' ') || p.username
                const init = name[0]?.toUpperCase() ?? '?'
                const loc = [p.city, p.country].filter(Boolean).join(', ')
                const scoreColor = score >= 70 ? 'var(--m5)' : score >= 40 ? '#f59e0b' : 'var(--ink-4)'
                return (
                  <Link key={p.id} href={`/u/${p.username}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: 'var(--surface)', border: '1px solid var(--rule)', borderRadius: 12,
                      padding: '16px', display: 'flex', flexDirection: 'column', gap: 10,
                      transition: 'box-shadow 120ms, transform 120ms',
                    }} className="hover-elevate">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
                          background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: '2px solid var(--rule)',
                        }}>
                          {p.avatar_url
                            ? <img src={p.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>{init}</span>
                          }
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</p>
                          {loc && <p style={{ fontSize: 11, color: 'var(--ink-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loc}</p>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                          <Sparkles style={{ width: 11, height: 11, color: scoreColor }} />
                          <span style={{ fontSize: 15, fontWeight: 700, color: scoreColor }}>{score}%</span>
                        </div>
                      </div>
                      {reasons.length > 0 && (
                        <p style={{ fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.4 }}>
                          {reasons.slice(0, 2).join(' · ')}
                        </p>
                      )}
                      {(p.user_types ?? []).length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {(p.user_types as string[]).slice(0, 2).map((t: string) => (
                            <span key={t} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: 'var(--bg-2)', color: 'var(--ink-3)', border: '1px solid var(--rule)' }}>{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )}

      <MemberList members={recentUsers} matchScores={recentMatchScores} />
    </div>
  )
}
