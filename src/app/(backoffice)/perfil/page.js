import { getProfile } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import PerfilClient from './PerfilClient'

export default async function PerfilPage() {
  const profile = await getProfile()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isDemo = user?.email === 'demo@vozcx.com.br'
  return <PerfilClient profile={profile} isDemo={isDemo} />
}
