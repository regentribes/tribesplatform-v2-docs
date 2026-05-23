import { createClient } from '@/core/lib/supabase/server'
import Link from 'next/link'
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

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px 28px 80px' }}>

      {/* ── Page header ── */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 8 }}>
          M01 · Community Network
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(20px, 3vw, 28px)', color: 'var(--ink)', lineHeight: 1.1, margin: '0 0 6px' }}>
              {user && displayName ? `${greeting}, ${displayName}.` : 'Community Network'}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: 0 }}>
              {user
                ? <>You're connected with <span style={{ color: 'var(--ink-2)', fontWeight: 600 }}>{memberCount}</span> member{memberCount !== 1 ? 's' : ''} building regenerative neighborhoods.</>
                : 'Browse the people building regenerative neighborhoods.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
            <Link href="/network/discover" style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', padding: '7px 14px', border: '1px solid var(--rule)', borderRadius: 8, textDecoration: 'none', background: 'var(--surface)' }}>
              Search network
            </Link>
            {user && (
              <Link href="/network/matches" style={{ fontSize: 13, fontWeight: 700, color: '#fff', padding: '7px 16px', borderRadius: 8, textDecoration: 'none', background: 'var(--m1)' }}>
                See your matches →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Guest CTA banner ── */}
      {!user && (
        <div style={{
          background: 'color-mix(in srgb, var(--m1) 6%, var(--surface))',
          border: '1px dashed color-mix(in srgb, var(--m1) 30%, var(--rule))',
          borderRadius: 10, padding: '14px 18px', marginBottom: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: 'var(--m1)', letterSpacing: '0.08em', marginBottom: 4 }}>
              BROWSING AS GUEST
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>
              Join free to post your offers, make requests, and unlock match scoring.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <Link href="/auth/login" style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', padding: '7px 14px', border: '1px solid var(--rule)', borderRadius: 8, textDecoration: 'none' }}>
              Sign in
            </Link>
            <Link href="/auth/signup" style={{ fontSize: 13, fontWeight: 700, color: '#fff', padding: '7px 16px', borderRadius: 8, textDecoration: 'none', background: 'var(--m1)' }}>
              Join free
            </Link>
          </div>
        </div>
      )}

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 22 }}>
        <StatCard label="Members" value={String(memberCount)} delta="across the network" href="/network/discover" />
        <StatCard
          label="Your offers"
          value={user ? String(offersCount) : '—'}
          delta={user ? (offersCount > 0 ? 'live on your profile' : 'add some') : 'sign in to post'}
          href={user ? '/network/offers' : '/auth/signup'}
        />
        <StatCard
          label="Your seeks"
          value={user ? String(seeksCount) : '—'}
          delta={user ? (seeksCount > 0 ? 'live on your profile' : 'add some') : 'sign in to post'}
          href={user ? '/network/seeks' : '/auth/signup'}
        />
        <StatCard
          label="Top match"
          value={user && topMatches.length > 0 ? `${topMatches[0].score}%` : '—'}
          delta={user
            ? (topMatches.length > 0
                ? ([topMatches[0].profile.first_name, topMatches[0].profile.last_name].filter(Boolean).join(' ') || topMatches[0].profile.username)
                : 'complete profile to unlock')
            : 'sign in to see'}
          deltaColor={user && topMatches.length > 0 ? 'var(--m1)' : undefined}
          href={user ? '/network/matches' : '/auth/signup'}
        />
      </div>

      {/* ── Your matches strip (logged-in only) ── */}
      {user && (
        <section style={{ marginBottom: 22 }}>
          <SectionHeader label="Your matches" actionHref="/network/matches" actionLabel="See all →" />
          {!myBio ? (
            <NextStepCard
              eyebrow="GET MATCHED"
              title="Complete your profile to unlock matches"
              body="Add your skills, values, and personality so we can find the people most aligned with you."
              ctaLabel="Complete profile →"
              ctaHref="/profile/edit"
              color="var(--m1)"
            />
          ) : topMatches.length === 0 ? (
            <EmptyCard text="No other members yet — you'll be the first when they join." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
              {topMatches.map(({ profile: p, score, reasons }) => (
                <MatchCard key={p.id} profile={p} score={score} reasons={reasons} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Members section ── */}
      <section>
        <MemberList members={recentUsers} matchScores={recentMatchScores} />
      </section>
    </div>
  )
}

/* ── Helpers ── */

function StatCard({ label, value, delta, deltaColor, href }: {
  label: string; value: string; delta: string; deltaColor?: string; href?: string
}) {
  const inner = (
    <div className={href ? 'dash-stat-card dash-stat-card--link' : 'dash-stat-card'}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-4)', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 26, fontWeight: 700, color: 'var(--ink)', lineHeight: 1, marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 11.5, color: deltaColor ?? 'var(--ink-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {delta}
      </div>
    </div>
  )
  if (href) return <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>{inner}</Link>
  return inner
}

function SectionHeader({ label, actionHref, actionLabel }: {
  label: string; actionHref?: string; actionLabel?: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
        {label}
      </span>
      {actionHref && actionLabel && (
        <Link href={actionHref} style={{ fontSize: 12.5, color: 'var(--m1)', fontWeight: 600, textDecoration: 'none' }}>
          {actionLabel}
        </Link>
      )}
    </div>
  )
}

function NextStepCard({ eyebrow, title, body, ctaLabel, ctaHref, color }: {
  eyebrow: string; title: string; body: string; ctaLabel: string; ctaHref: string; color: string
}) {
  return (
    <div style={{
      background: `color-mix(in srgb, ${color} 6%, var(--surface))`,
      border: `1px dashed color-mix(in srgb, ${color} 30%, var(--rule))`,
      borderRadius: 10, padding: '16px 18px',
    }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color, letterSpacing: '0.08em', marginBottom: 5 }}>
        {eyebrow}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 5 }}>{title}</div>
      <div style={{ fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.55, marginBottom: 12 }}>{body}</div>
      <Link href={ctaHref} style={{ display: 'inline-block', fontSize: 13, fontWeight: 700, color: '#fff', background: color, padding: '8px 16px', borderRadius: 8, textDecoration: 'none' }}>
        {ctaLabel}
      </Link>
    </div>
  )
}

function EmptyCard({ text }: { text: string }) {
  return (
    <div style={{ background: 'var(--bg-2)', border: '1px solid var(--rule)', borderRadius: 10, padding: '20px', textAlign: 'center', color: 'var(--ink-4)', fontSize: 13 }}>
      {text}
    </div>
  )
}

function MatchCard({ profile: p, score, reasons }: {
  profile: { id: string; username: string; first_name: string | null; last_name: string | null; avatar_url: string | null; city: string | null; country: string | null; user_types: string[] | null }
  score: number; reasons: string[]
}) {
  const name = [p.first_name, p.last_name].filter(Boolean).join(' ') || p.username
  const init = name[0]?.toUpperCase() ?? '?'
  const loc = [p.city, p.country].filter(Boolean).join(', ')
  const scoreColor = score >= 70 ? 'var(--m5)' : score >= 40 ? 'var(--m4)' : 'var(--ink-4)'
  return (
    <Link href={`/u/${p.username}`} style={{ textDecoration: 'none' }}>
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'var(--surface)', border: '1px solid var(--rule)', borderRadius: 10,
        padding: '14px 14px 12px',
        transition: 'box-shadow 140ms, transform 140ms',
      }} className="hover-elevate">
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--m1)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
            background: 'color-mix(in srgb, var(--m1) 12%, var(--surface))', display: 'grid', placeItems: 'center',
          }}>
            {p.avatar_url
              ? <img src={p.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--m1)' }}>{init}</span>
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
            {loc && <div style={{ fontSize: 11, color: 'var(--ink-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loc}</div>}
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 700, color: scoreColor, flexShrink: 0 }}>
            {score}%
          </div>
        </div>
        {reasons.length > 0 && (
          <div style={{ fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.45 }}>
            {reasons.slice(0, 2).join(' · ')}
          </div>
        )}
      </div>
    </Link>
  )
}
