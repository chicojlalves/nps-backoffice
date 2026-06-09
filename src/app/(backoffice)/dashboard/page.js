import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/auth'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const profile = await getProfile()
  const supabase = await createClient()

  const { data: lojas } = await supabase
    .from('stores')
    .select('id, nome')
    .order('nome')

  return <DashboardClient profile={profile} lojas={lojas ?? []} />
}
