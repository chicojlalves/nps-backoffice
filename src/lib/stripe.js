import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
})

export const PLANS = {
  free: {
    name: 'Free',
    priceId: process.env.STRIPE_PRICE_FREE,
    maxLojas: 1,
    trialDays: 30,
  },
  pro: {
    name: 'Pro',
    priceId: process.env.STRIPE_PRICE_PRO,
    maxLojas: 5,
    trialDays: 0,
  },
  business: {
    name: 'Business',
    priceId: process.env.STRIPE_PRICE_BUSINESS,
    maxLojas: null, // ilimitado
    trialDays: 0,
  },
}

export function getPlanByPriceId(priceId) {
  return Object.entries(PLANS).find(([, plan]) => plan.priceId === priceId)?.[0] ?? 'free'
}
