import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { canViewAuditoria } from '@/lib/permissions'
import AuditoriaClient from './AuditoriaClient'

export default async function AuditoriaPage() {
  const profile = await getProfile()

  // Busca plano da empresa
  const supabase = await createClient()
  const { data: company } = await supabase
    .from('companies')
    .select('plan')
    .eq('id', profile.company_id)
    .single()

  const plan = company?.plan ?? 'free'

  if (!canViewAuditoria(profile.role, plan)) redirect('/dashboard')

  // Admin vê tudo, proprietario business vê só da sua empresa
  let query = supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  if (profile.role !== 'admin') {
    query = query.eq('company_id', profile.company_id)
  }

  const { data: logs } = await query

  return <AuditoriaClient logs={logs ?? []} />
}
