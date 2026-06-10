import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/auth'
import { canViewRelatorioAtendente } from '@/lib/permissions'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const profile = await getProfile()
  const supabase = await createClient()

  const [{ data: lojas }, { data: company }] = await Promise.all([
    supabase.from('stores').select('id, nome').order('nome'),
    supabase.from('companies').select('plan').eq('id', profile.company_id).single(),
  ])

  const plan = company?.plan ?? 'free'
  const verRelatorioAtendente = canViewRelatorioAtendente(profile.role, plan)

  return (
    <DashboardClient
      profile={profile}
      lojas={lojas ?? []}
      verRelatorioAtendente={verRelatorioAtendente}
      plan={plan}
    />
  )
}
