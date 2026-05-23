'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/core/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card'
import { Badge } from '@/core/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/core/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/ui/tabs'
import { Skeleton } from '@/core/components/ui/skeleton'
import { Button } from '@/core/components/ui/button'
import { Progress } from '@/core/components/ui/progress'
import {
  Pencil, MapPin, User, Heart, Brain, Star,
  Target, Gift, HelpCircle, Plane, Briefcase, Camera, Loader2,
} from 'lucide-react'

const OCEAN_LABELS = [
  { key: 'openness',          label: 'Openness' },
  { key: 'conscientiousness', label: 'Conscientiousness' },
  { key: 'extraversion',      label: 'Extraversion' },
  { key: 'agreeableness',     label: 'Agreeableness' },
  { key: 'neuroticism',       label: 'Neuroticism' },
]

export default function NetworkProfilePage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [bio, setBio] = useState<any>(null)
  const [offers, setOffers] = useState<any[]>([])
  const [seeks, setSeeks] = useState<any[]>([])
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const [p, b, o, s] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('id', user.id).single(),
        supabase.from('user_bio').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('user_offers').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('user_requests').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ])

      setProfile(p.data)
      setAvatarUrl(p.data?.avatar_url ?? null)
      setBio(b.data)
      setOffers(o.data ?? [])
      setSeeks(s.data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-4">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-10 rounded-lg" />
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="p-4 sm:p-6 max-w-5xl mx-auto">
        <Card className="border-card-border">
          <CardContent className="py-16 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Profile not found</p>
            <Button asChild><Link href="/profile/edit">Create Profile</Link></Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !profile?.id) return
    setAvatarUploading(true)
    try {
      const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase()
      const path = `${profile.id}/avatar.${ext}`
      const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      if (upErr) throw upErr
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      const { error: dbErr } = await supabase.from('user_profiles').update({ avatar_url: publicUrl }).eq('id', profile.id)
      if (dbErr) throw dbErr
      setAvatarUrl(publicUrl + '?t=' + Date.now())
    } catch (err: any) {
      alert('Photo upload failed: ' + (err?.message ?? String(err)))
    } finally {
      setAvatarUploading(false)
      e.target.value = ''
    }
  }

  const displayName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || profile.username
  const initial = displayName[0]?.toUpperCase() ?? '?'
  const location = [profile.city, profile.country].filter(Boolean).join(', ')
  const pd = bio?.personality_details as any
  const arc = bio?.archetypes as any
  const travels = (bio?.places_traveling ?? []) as any[]

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px 28px 80px' }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 8 }}>
          M01 · My Profile
        </div>
      </div>

      {/* Profile header card */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'var(--surface)', border: '1px solid var(--rule)', borderRadius: 10,
        padding: '18px 18px 16px', marginBottom: 18,
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--m1)' }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginTop: 4 }}>
          <label htmlFor="avatar-upload-profile" style={{ cursor: 'pointer', position: 'relative', flexShrink: 0, width: 72, height: 72 }} className="group">
            <div style={{
              width: 72, height: 72, borderRadius: '50%', overflow: 'hidden',
              background: 'color-mix(in srgb, var(--m1) 12%, var(--surface))',
              border: '2px solid var(--rule)', display: 'grid', placeItems: 'center',
            }}>
              {avatarUrl
                ? <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 26, fontWeight: 700, color: 'var(--m1)' }}>{initial}</span>
              }
            </div>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: avatarUploading ? 1 : 0, transition: 'opacity 120ms',
            }} className="group-hover:opacity-100">
              {avatarUploading
                ? <Loader2 style={{ width: 18, height: 18, color: '#fff' }} className="animate-spin" />
                : <Camera style={{ width: 18, height: 18, color: '#fff' }} />}
            </div>
            <input id="avatar-upload-profile" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
          </label>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ minWidth: 0 }}>
                <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(20px, 3vw, 26px)', color: 'var(--ink)', lineHeight: 1.15, margin: '0 0 2px' }}>
                  {displayName}
                </h1>
                <div style={{ fontSize: 12.5, color: 'var(--ink-4)' }}>@{profile.username}</div>
              </div>
              <Link href="/profile/edit" style={{
                fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', padding: '7px 14px',
                border: '1px solid var(--rule)', borderRadius: 8, textDecoration: 'none',
                background: 'var(--surface)', display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
              }}>
                <Pencil style={{ width: 14, height: 14 }} />
                Edit profile
              </Link>
            </div>

            {profile.headline && (
              <div style={{ fontSize: 13.5, color: 'var(--ink-2)', marginTop: 8, lineHeight: 1.5 }}>{profile.headline}</div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginTop: 10 }}>
              {location && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--ink-4)' }}>
                  <MapPin style={{ width: 12, height: 12 }} />{location}
                </span>
              )}
              {(profile.user_types ?? []).map((t: string) => (
                <span key={t} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: 'var(--bg-2)', color: 'var(--ink-3)', border: '1px solid var(--rule)' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="personality">Personality</TabsTrigger>
          <TabsTrigger value="offers">Offers ({offers.length})</TabsTrigger>
          <TabsTrigger value="seeks">Requests ({seeks.length})</TabsTrigger>
          <TabsTrigger value="travel">Travel</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="mt-6 space-y-4">
          {!bio ? (
            <Card className="border-card-border">
              <CardContent className="py-12 text-center">
                <User className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm mb-4">No bio details yet</p>
                <Button variant="outline" asChild><Link href="/profile/edit">Complete Your Profile</Link></Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {bio.values_principles && (
                <Card className="border-card-border">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Heart className="h-4 w-4 text-primary" />Values & Principles</CardTitle></CardHeader>
                  <CardContent><p className="text-sm whitespace-pre-wrap">{bio.values_principles}</p></CardContent>
                </Card>
              )}
              {((bio.skills?.length > 0) || (bio.interests?.length > 0)) && (
                <Card className="border-card-border">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Briefcase className="h-4 w-4 text-primary" />Skills & Interests</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {bio.skills?.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Skills</p>
                        <div className="flex flex-wrap gap-1.5">{bio.skills.map((s: string) => <Badge key={s} variant="secondary">{s}</Badge>)}</div>
                      </div>
                    )}
                    {bio.interests?.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Interests</p>
                        <div className="flex flex-wrap gap-1.5">{bio.interests.map((i: string) => <Badge key={i} variant="outline">{i}</Badge>)}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              {(bio.goals || bio.what_creating) && (
                <Card className="border-card-border">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Target className="h-4 w-4 text-primary" />Goals & Projects</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {bio.goals && <div><p className="text-xs text-muted-foreground mb-1">Goals</p><p className="text-sm whitespace-pre-wrap">{bio.goals}</p></div>}
                    {bio.what_creating && <div><p className="text-xs text-muted-foreground mb-1">Currently Creating</p><p className="text-sm whitespace-pre-wrap">{bio.what_creating}</p></div>}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="personality" className="mt-6 space-y-4">
          {!pd?.myersBriggs && !pd?.ocean && !arc ? (
            <Card className="border-card-border">
              <CardContent className="py-12 text-center">
                <Brain className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm mb-4">No personality data yet</p>
                <Button variant="outline" asChild><Link href="/profile/edit">Add Personality Info</Link></Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {pd?.myersBriggs && (
                <Card className="border-card-border">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Brain className="h-4 w-4 text-primary" />Myers-Briggs Type</CardTitle></CardHeader>
                  <CardContent><div className="text-4xl font-bold text-primary">{pd.myersBriggs}</div></CardContent>
                </Card>
              )}
              {pd?.ocean && (
                <Card className="border-card-border">
                  <CardHeader><CardTitle className="text-base">OCEAN Personality Traits</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {OCEAN_LABELS.map(({ key, label }) => {
                      const val = pd.ocean?.[key] ?? 50
                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between text-sm"><span>{label}</span><span className="text-muted-foreground">{val}%</span></div>
                          <Progress value={val} className="h-2" />
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )}
              {arc && (arc.astrology?.sun || arc.astrology?.moon || arc.astrology?.rising || arc.humanDesign || arc.geneKey || arc.mayan) && (
                <Card className="border-card-border">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Star className="h-4 w-4 text-primary" />Archetypes</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {(arc.astrology?.sun || arc.astrology?.moon || arc.astrology?.rising) && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Astrology</p>
                        <div className="grid grid-cols-3 gap-3">
                          {arc.astrology?.sun && <div className="text-center p-2 rounded-lg bg-muted"><p className="text-xs text-muted-foreground">Sun</p><p className="font-medium text-sm">{arc.astrology.sun}</p></div>}
                          {arc.astrology?.moon && <div className="text-center p-2 rounded-lg bg-muted"><p className="text-xs text-muted-foreground">Moon</p><p className="font-medium text-sm">{arc.astrology.moon}</p></div>}
                          {arc.astrology?.rising && <div className="text-center p-2 rounded-lg bg-muted"><p className="text-xs text-muted-foreground">Rising</p><p className="font-medium text-sm">{arc.astrology.rising}</p></div>}
                        </div>
                      </div>
                    )}
                    {arc.humanDesign && <div><p className="text-xs text-muted-foreground">Human Design</p><p className="font-medium">{arc.humanDesign}</p></div>}
                    {arc.geneKey && <div><p className="text-xs text-muted-foreground">Gene Key</p><p className="font-medium">{arc.geneKey}</p></div>}
                    {arc.mayan && <div><p className="text-xs text-muted-foreground">Mayan Sign</p><p className="font-medium">{arc.mayan}</p></div>}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="offers" className="mt-6">
          {offers.length === 0 ? (
            <Card className="border-card-border">
              <CardContent className="py-12 text-center">
                <Gift className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm mb-4">No offers yet</p>
                <Button variant="outline" asChild><Link href="/profile/edit">Add Offers</Link></Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {offers.map((o: any) => (
                <Card key={o.id} className="border-card-border">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{o.title}</CardTitle>
                      {o.category && <Badge variant="secondary" className="shrink-0">{o.category}</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {o.description && <p className="text-sm text-muted-foreground mb-3">{o.description}</p>}
                    <div className="flex items-center gap-2">
                      {o.compensation_model && <Badge variant="outline">{o.compensation_model}</Badge>}
                      {o.price && <span className="text-sm font-medium">{o.price}</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="seeks" className="mt-6">
          {seeks.length === 0 ? (
            <Card className="border-card-border">
              <CardContent className="py-12 text-center">
                <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm mb-4">No requests yet</p>
                <Button variant="outline" asChild><Link href="/profile/edit">Add Requests</Link></Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {seeks.map((s: any) => (
                <Card key={s.id} className="border-card-border">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm flex-1">{s.request_text}</p>
                      <div className="flex gap-2 shrink-0">
                        {s.category && <Badge variant="secondary">{s.category}</Badge>}
                        {s.urgency && s.urgency !== 'normal' && (
                          <Badge variant={s.urgency === 'urgent' ? 'destructive' : 'outline'}>{s.urgency}</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="travel" className="mt-6">
          {!travels.length ? (
            <Card className="border-card-border">
              <CardContent className="py-12 text-center">
                <Plane className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm mb-4">No travel plans yet</p>
                <Button variant="outline" asChild><Link href="/profile/edit">Add Travel Plans</Link></Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {travels.map((t: any, i: number) => (
                <Card key={i} className="border-card-border">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{t.location}</p>
                        {(t.startDate || t.endDate) && (
                          <p className="text-sm text-muted-foreground">
                            {t.startDate && new Date(t.startDate).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                            {t.startDate && t.endDate && ' – '}
                            {t.endDate && new Date(t.endDate).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                          </p>
                        )}
                        {t.notes && <p className="text-sm text-muted-foreground mt-1">{t.notes}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
