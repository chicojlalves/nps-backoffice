import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/auth'
import { canViewRelatorioAtendente, canViewRelatorioLoja, canViewComentarios } from '@/lib/permissions'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const profile = await getProfile()
  const supabase = await createClient()

  const [{ data: lojas }, { data: company }, { data: { user } }] = await Promise.all([
    supabase.from('stores').select('id, nome').order('nome'),
    supabase.from('companies').select('plan').eq('id', profile.company_id).single(),
    supabase.auth.getUser(),
  ])

  const plan = company?.plan ?? 'free'
  const isDemo = user?.email === 'demo@vozcx.com.br'

  return (
    <DashboardClient
      profile={profile}
      lojas={lojas ?? []}
      verRelatorioAtendente={canViewRelatorioAtendente(profile.role, plan)}
      verRelatorioLoja={canViewRelatorioLoja(profile.role, plan)}
      verComentarios={canViewComentarios(profile.role, plan)}
      plan={plan}
      isDemo={isDemo}
    />
  )
}
