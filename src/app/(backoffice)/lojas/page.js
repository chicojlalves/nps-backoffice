import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/auth'
import { canManageStores } from '@/lib/permissions'
import { redirect } from 'next/navigation'
import LojasClient from './LojasClient'

const LIMITE_PLANO = { free: 1, pro: 5, business: null }

export default async function LojasPage() {
  const profile = await getProfile()
  if (!canManageStores(profile.role)) redirect('/dashboard')

  const supabase = await createClient()

  const [{ data: lojas }, { data: empresas }, { data: company }, { data: { user } }] = await Promise.all([
    supabase.from('stores').select('*, companies(nome)').order('created_at', { ascending: false }),
    supabase.from('companies').select('id, nome').order('nome'),
    supabase.from('companies').select('plan').eq('id', profile.company_id).single(),
    supabase.auth.getUser(),
  ])

  const plano = company?.plan ?? 'free'
  const limiteLojas = profile.role === 'admin' ? null : (plano in LIMITE_PLANO ? LIMITE_PLANO[plano] : 1)
  const isDemo = user?.email === 'demo@vozcx.com.br'

  return (
    <LojasClient
      lojas={lojas ?? []}
      empresas={empresas ?? []}
      profile={profile}
      limiteLojas={limiteLojas}
      plano={plano}
      isDemo={isDemo}
    />
  )
}
