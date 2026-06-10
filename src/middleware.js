import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/', '/login', '/onboarding', '/onboarding/loja', '/planos', '/pesquisa', '/qrcode', '/api']

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Libera rotas públicas
  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Admin nunca é bloqueado por assinatura
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, company_id')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'admin') return response

  // Verifica assinatura da empresa
  if (profile?.company_id) {
    const { data: company } = await supabase
      .from('companies')
      .select('subscription_status')
      .eq('id', profile.company_id)
      .single()

    const status = company?.subscription_status
    const allowed = ['active', 'trialing'].includes(status)

    if (!allowed) {
      return NextResponse.redirect(new URL('/planos', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.png$|.*\\.svg$).*)'],
}
