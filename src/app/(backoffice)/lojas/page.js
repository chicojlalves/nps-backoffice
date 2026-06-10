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

  const [{ data: lojas }, { data: empresas }, { data: company }] = await Promise.all([
    supabase.from('stores').select('*, companies(nome)').order('created_at', { ascending: false }),
    supabase.from('companies').select('id, nome').order('nome'),
    supabase.from('companies').select('plan').eq('id', profile.company_id).single(),
  ])

  const plano = company?.plan ?? 'free'
  const limiteLojas = LIMITE_PLANO[plano] ?? 1

  return (
    <LojasClient
      lojas={lojas ?? []}
      empresas={empresas ?? []}
      profile={profile}
      limiteLojas={limiteLojas}
      plano={plano}
    />
  )
}
