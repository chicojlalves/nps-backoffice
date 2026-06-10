import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { canViewAuditoria } from '@/lib/permissions'
import AuditoriaClient from './AuditoriaClient'

export default async function AuditoriaPage() {
  const profile = await getProfile()
  if (!canViewAuditoria(profile.role)) redirect('/dashboard')

  const supabase = await createClient()
  const { data: logs } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  return <AuditoriaClient logs={logs ?? []} />
}
