import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { seedDemo } from '@/lib/demo/seedDemo'

const DEMO_EMAIL = 'demo@vozcx.com.br'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vozcx.com.br'

export async function GET() {
  if (!process.env.DEMO_PASSWORD) {
    return NextResponse.redirect(new URL('/?demo_error=1', SITE_URL))
  }

  try {
    await seedDemo()
  } catch {
    return NextResponse.redirect(new URL('/?demo_error=1', SITE_URL))
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: process.env.DEMO_PASSWORD,
  })

  if (error) {
    return NextResponse.redirect(new URL('/?demo_error=1', SITE_URL))
  }

  return NextResponse.redirect(new URL('/dashboard', SITE_URL))
}
