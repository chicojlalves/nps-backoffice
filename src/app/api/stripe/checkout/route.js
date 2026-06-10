import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, PLANS } from '@/lib/stripe'

export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { planKey } = await request.json()
    const plan = PLANS[planKey]
    if (!plan) return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })

    // Busca company do usuário
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id, companies(nome, email, stripe_customer_id)')
      .eq('id', user.id)
      .single()

    if (!profile?.company_id) {
      return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 400 })
    }

    const company = profile.companies
    let customerId = company.stripe_customer_id

    // Cria customer no Stripe se não existir
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: company.email || user.email,
        name: company.nome,
        metadata: { company_id: profile.company_id },
      })
      customerId = customer.id

      // Salva o customer_id na empresa
      const { createClient: createServiceClient } = await import('@/lib/supabase/service')
      const serviceSupabase = createServiceClient()
      await serviceSupabase
        .from('companies')
        .update({ stripe_customer_id: customerId })
        .eq('id', profile.company_id)
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL

    // Verifica se empresa já tem lojas — define destino pós pagamento
    const { count } = await supabase
      .from('stores')
      .select('id', { count: 'exact', head: true })
      .eq('company_id', profile.company_id)

    const successUrl = count === 0
      ? `${appUrl}/onboarding/loja`
      : `${appUrl}/dashboard?upgrade=1`

    const sessionParams = {
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: plan.priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: `${appUrl}/planos`,
      metadata: { company_id: profile.company_id, plan: planKey },
    }

    if (plan.trialDays > 0) {
      sessionParams.subscription_data = { trial_period_days: plan.trialDays }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Erro ao criar sessão de pagamento' }, { status: 500 })
  }
}
