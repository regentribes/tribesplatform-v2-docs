import { createClient } from '@/core/lib/supabase/server'
import { redirect } from 'next/navigation'
import LandingClient from './LandingClient'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/home')

  const { data: bp } = await supabase
    .from('blueprints')
    .select('answers')
    .eq('is_community', true)
    .maybeSingle()
  const communityPurpose = ((bp?.answers as Record<string, unknown>)?.purpose as string) || null

  return <LandingClient firstName={null} communityPurpose={communityPurpose} />
}
