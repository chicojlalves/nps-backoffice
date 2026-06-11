import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@/lib/supabase/service'

const DEMO_EMAIL = 'demo@vozcx.com.br'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vozcx.com.br'

export async function GET() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Limpa os dados da demo antes de sair
  if (user?.email === DEMO_EMAIL) {
    const service = createServiceClient()
    const { data: profile } = await service
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single()

    if (profile?.company_id) {
      await service.from('responses').delete().eq('company_id', profile.company_id)
      await service.from('stores').delete().eq('company_id', profile.company_id)
      await service.from('profiles').delete().eq('company_id', profile.company_id)
      await service.from('companies').delete().eq('id', profile.company_id)
    }

    await service.auth.admin.deleteUser(user.id)
  }

  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/', SITE_URL))
}
