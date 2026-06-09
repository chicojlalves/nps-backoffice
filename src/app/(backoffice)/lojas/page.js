import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/auth'
import { canManageStores } from '@/lib/permissions'
import { redirect } from 'next/navigation'
import LojasClient from './LojasClient'

export default async function LojasPage() {
  const profile = await getProfile()
  if (!canManageStores(profile.role)) redirect('/dashboard')

  const supabase = await createClient()

  const [{ data: lojas }, { data: empresas }] = await Promise.all([
    supabase.from('stores').select('*, companies(nome)').order('created_at', { ascending: false }),
    supabase.from('companies').select('id, nome').order('nome'),
  ])

  return <LojasClient lojas={lojas ?? []} empresas={empresas ?? []} profile={profile} />
}
