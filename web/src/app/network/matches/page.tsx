import { createClient } from '@/core/lib/supabase/server'
import Link from 'next/link'
import { computeMatch } from '@/modules/m01-network/lib/match-score'
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card'
import { Button } from '@/core/components/ui/button'
import { Sparkles, Pencil } from 'lucide-react'
import MatchesTabs from '@/modules/m01-network/MatchesTabs'

export default async function MatchesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6" style={{ paddingTop: 64 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Sparkles style={{ width: 40, height: 40, color: 'var(--accent)', margin: '0 auto 16px' }} />
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 32, color: 'var(--ink)', marginBottom: 12 }}>Your Matches</h1>
          <p style={{ color: 'var(--ink-3)', fontSize: 15, lineHeight: 1.6, maxWidth: 440, margin: '0 auto 28px' }}>
            Create a free profile to unlock match scores — we compare your values, skills, personality,
            and goals to surface the people most aligned with your vision.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/signup" style={{ background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '10px 24px', borderRadius: 'var(--radius)', textDecoration: 'none' }}>
              Join free
            </Link>
            <Link href="/auth/login" style={{ border: '1px solid var(--rule)', color: 'var(--ink-2)', fontSize: 14, padding: '10px 24px', borderRadius: 'var(--radius)', textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>
        </div>
        <Card className="border-card-border bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader><CardTitle className="text-lg">How Matching Works</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>We analyze multiple dimensions to find your best matches:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong>Shared Skills</strong> — up to 25 pts (fuzzy, allows typos)</li>
              <li><strong>Shared Interests</strong> — up to 15 pts (fuzzy)</li>
              <li><strong>OCEAN Similarity</strong> — up to 20 pts</li>
              <li><strong>MBTI Compatibility</strong> — up to 20 pts</li>
              <li><strong>Location proximity</strong> — up to 5 pts (city + country)</li>
              <li><strong>Travel overlap</strong> — up to 10 pts (same place, same time)</li>
              <li><strong>Aligned goals</strong> — up to 5 pts (regenerative-keyword overlap)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    )
  }

  const [profilesRes, biosRes, myProfileRes, myBioRes] = await Promise.all([
    supabase
      .from('user_profiles')
      .select('id, username, first_name, last_name, city, country, avatar_url, user_types')
      .neq('id', user.id),
    supabase.from('user_bio').select('*'),
    supabase.from('user_profiles').select('city, country').eq('id', user.id).maybeSingle(),
    supabase.from('user_bio').select('*').eq('user_id', user.id).maybeSingle(),
  ])

  // Merge city/country from user_profiles into bios so computeMatch can score location.
  const myBio = myBioRes.data
    ? { ...myBioRes.data, city: myProfileRes.data?.city, country: myProfileRes.data?.country }
    : null
  const profileLocById = new Map<string, { city?: string | null; country?: string | null }>()
  for (const p of profilesRes.data ?? []) profileLocById.set(p.id, { city: p.city, country: p.country })
  const bioMap: Record<string, any> = {}
  for (const b of biosRes.data ?? []) {
    const loc = profileLocById.get(b.user_id) ?? {}
    bioMap[b.user_id] = { ...b, city: loc.city, country: loc.country }
  }

  const matches = (profilesRes.data ?? [])
    .map(p => {
      const { score, reasons } = computeMatch(myBio, bioMap[p.id] ?? null)
      return { profile: p, bio: bioMap[p.id] ?? null, score, reasons }
    })
    .sort((a, b) => b.score - a.score)

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          Your Matches
        </h1>
        <p className="text-muted-foreground mt-2">People in the network who share your values, interests, and goals</p>
      </div>

      {!myBio && (
        <Card className="border-card-border bg-primary/5 border-primary/20">
          <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="font-semibold mb-1">Complete your profile to unlock match scores</p>
              <p className="text-sm text-muted-foreground">Add your values, skills, and personality to find your best matches.</p>
            </div>
            <Button asChild>
              <Link href="/profile/edit"><Pencil className="h-4 w-4 mr-2" />Complete Profile</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="border-card-border bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader><CardTitle className="text-lg">How Matching Works</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>We analyze multiple dimensions to find your best matches:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Shared Skills</strong> — up to 25 pts (fuzzy, allows typos)</li>
            <li><strong>Shared Interests</strong> — up to 15 pts (fuzzy)</li>
            <li><strong>OCEAN Similarity</strong> — up to 20 pts</li>
            <li><strong>MBTI Compatibility</strong> — up to 20 pts</li>
            <li><strong>Location proximity</strong> — up to 5 pts (city + country)</li>
            <li><strong>Travel overlap</strong> — up to 10 pts (same place, same time)</li>
            <li><strong>Aligned goals</strong> — up to 5 pts (regenerative-keyword overlap)</li>
          </ul>
        </CardContent>
      </Card>

      <MatchesTabs matches={matches} />
    </div>
  )
}
