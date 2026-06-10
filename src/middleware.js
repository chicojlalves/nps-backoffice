import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Rotas públicas — deixa passar sempre
  const publicRoutes = ['/login', '/pesquisa', '/qrcode', '/planos', '/api/stripe/webhook']
  if (publicRoutes.some(r => pathname.startsWith(r))) {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Não autenticado → login
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Busca status da assinatura da empresa do usuário
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, companies(subscription_status, plan)')
    .eq('id', user.id)
    .single()

  // Admin global nunca é bloqueado
  if (profile?.role === 'admin') return response

  const status = profile?.companies?.subscription_status
  const statusesPermitidos = ['active', 'trialing']

  // Sem assinatura válida → página de planos
  if (!statusesPermitidos.includes(status)) {
    if (pathname !== '/planos') {
      return NextResponse.redirect(new URL('/planos', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
