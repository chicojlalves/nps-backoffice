import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/auth'
import { canManageCompanies } from '@/lib/permissions'
import { redirect } from 'next/navigation'
import EmpresasClient from './EmpresasClient'

export default async function EmpresasPage() {
  const profile = await getProfile()
  if (!canManageCompanies(profile.role)) redirect('/dashboard')

  const supabase = await createClient()
  const { data: empresas } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false })

  return <EmpresasClient empresas={empresas ?? []} />
}
