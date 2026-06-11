import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vozcx.com.br'

export async function GET() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/', SITE_URL))
}
