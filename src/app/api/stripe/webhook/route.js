import { NextResponse } from 'next/server'
import { stripe, getPlanByPriceId } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/service'

export async function POST(request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature inválida:', err.message)
    return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 })
  }

  const supabase = createClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const companyId = session.metadata?.company_id
      const planKey = session.metadata?.plan

      if (companyId) {
        await supabase.from('companies').update({
          subscription_status: 'active',
          plan: planKey,
          stripe_subscription_id: session.subscription,
        }).eq('id', companyId)
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object
      const customerId = subscription.customer
      const priceId = subscription.items.data[0]?.price?.id
      const planKey = getPlanByPriceId(priceId)

      const statusMap = {
        active: 'active',
        trialing: 'trialing',
        past_due: 'past_due',
        canceled: 'canceled',
        unpaid: 'past_due',
      }

      await supabase.from('companies').update({
        subscription_status: statusMap[subscription.status] ?? subscription.status,
        plan: planKey,
        stripe_subscription_id: subscription.id,
      }).eq('stripe_customer_id', customerId)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object
      await supabase.from('companies').update({
        subscription_status: 'canceled',
        plan: 'free',
      }).eq('stripe_subscription_id', subscription.id)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object
      await supabase.from('companies').update({
        subscription_status: 'past_due',
      }).eq('stripe_customer_id', invoice.customer)
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}
