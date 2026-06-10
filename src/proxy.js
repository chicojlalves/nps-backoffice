import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function proxy(request) {
  const { pathname } = request.nextUrl

  // Rotas públicas — deixa passar sempre
  const publicRoutes = ['/login', '/onboarding', '/pesquisa', '/qrcode', '/planos', '/api/stripe/webhook', '/api/onboarding']
  if (publicRoutes.some(r => pathname.startsWith(r))) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Não autenticado → login
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Logado tentando acessar login → dashboard
  if (pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Busca status da assinatura
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, companies(subscription_status)')
    .eq('id', user.id)
    .single()

  // Admin nunca é bloqueado
  if (profile?.role === 'admin') return supabaseResponse

  const status = profile?.companies?.subscription_status
  const statusesPermitidos = ['active', 'trialing']

  // Sem assinatura válida → página de planos
  if (!statusesPermitidos.includes(status) && pathname !== '/planos') {
    return NextResponse.redirect(new URL('/planos', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
