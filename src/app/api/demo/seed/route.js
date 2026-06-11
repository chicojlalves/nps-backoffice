import { NextResponse } from 'next/server'
import { seedDemo } from '@/lib/demo/seedDemo'

const DEMO_SECRET = process.env.DEMO_SEED_SECRET

export async function POST(request) {
  const { searchParams } = new URL(request.url)
  if (!DEMO_SECRET || searchParams.get('secret') !== DEMO_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await seedDemo()
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
