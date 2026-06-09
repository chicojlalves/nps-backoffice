import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/auth'
import { canManageUsers } from '@/lib/permissions'
import { redirect } from 'next/navigation'
import UsuariosClient from './UsuariosClient'

export default async function UsuariosPage() {
  const profile = await getProfile()
  if (!canManageUsers(profile.role)) redirect('/dashboard')

  const supabase = await createClient()

  const [{ data: usuarios }, { data: empresas }, { data: lojas }] = await Promise.all([
    supabase.from('profiles').select('*, companies(nome), stores(nome)').order('created_at', { ascending: false }),
    supabase.from('companies').select('id, nome').order('nome'),
    supabase.from('stores').select('id, nome, company_id').order('nome'),
  ])

  return (
    <UsuariosClient
      usuarios={usuarios ?? []}
      empresas={empresas ?? []}
      lojas={lojas ?? []}
      profile={profile}
    />
  )
}
