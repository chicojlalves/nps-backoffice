import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/auth'
import { canManageUsers } from '@/lib/permissions'
import { redirect } from 'next/navigation'
import UsuariosClient from './UsuariosClient'

const LIMITE_USUARIOS = { free: 3, pro: 15, business: null }

export default async function UsuariosPage() {
  const profile = await getProfile()
  if (!canManageUsers(profile.role)) redirect('/dashboard')

  const supabase = await createClient()

  const [{ data: usuarios }, { data: empresas }, { data: lojas }, { data: company }] = await Promise.all([
    supabase.from('profiles').select('*, companies(nome), stores(nome)').order('created_at', { ascending: false }),
    supabase.from('companies').select('id, nome').order('nome'),
    supabase.from('stores').select('id, nome, company_id').order('nome'),
    supabase.from('companies').select('plan').eq('id', profile.company_id).single(),
  ])

  const plano = company?.plan ?? 'free'
  const limiteUsuarios = profile.role === 'admin' ? null : (plano in LIMITE_USUARIOS ? LIMITE_USUARIOS[plano] : 3)
  const { data: { user } } = await supabase.auth.getUser()
  const isDemo = user?.email === 'demo@vozcx.com.br'

  return (
    <UsuariosClient
      usuarios={usuarios ?? []}
      empresas={empresas ?? []}
      lojas={lojas ?? []}
      profile={profile}
      limiteUsuarios={limiteUsuarios}
      plano={plano}
      isDemo={isDemo}
    />
  )
}
