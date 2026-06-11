import { createClient } from '@/lib/supabase/service'

const DEMO_EMAIL = 'demo@vozcx.com.br'

export async function seedDemo() {
  const supabase = createClient()

  // --- Cleanup previous demo data ---
  const { data: { users } } = await supabase.auth.admin.listUsers()
  const demoAuthUser = users.find(u => u.email === DEMO_EMAIL)
  if (demoAuthUser) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', demoAuthUser.id)
      .single()
    if (profile?.company_id) {
      await supabase.from('responses').delete().eq('company_id', profile.company_id)
      await supabase.from('stores').delete().eq('company_id', profile.company_id)
      await supabase.from('profiles').delete().eq('company_id', profile.company_id)
      await supabase.from('companies').delete().eq('id', profile.company_id)
    }
    await supabase.auth.admin.deleteUser(demoAuthUser.id)
  }

  // --- Create demo company ---
  const { data: company, error: companyErr } = await supabase
    .from('companies')
    .insert({ nome: 'Rede Essencial', plan: 'business', subscription_status: 'active' })
    .select('id')
    .single()
  if (companyErr) throw new Error('company: ' + companyErr.message)
  const companyId = company.id

  // --- Create stores ---
  const storeNames = ['Centro', 'Shopping', 'Zona Norte', 'Zona Sul', 'Alphaville']
  const { data: stores, error: storesErr } = await supabase
    .from('stores')
    .insert(storeNames.map(nome => ({ nome, company_id: companyId })))
    .select('id, nome')
  if (storesErr) throw new Error('stores: ' + storesErr.message)

  // --- Create demo auth user ---
  const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
    email: DEMO_EMAIL,
    password: process.env.DEMO_PASSWORD,
    email_confirm: true,
  })
  if (authErr) throw new Error('auth: ' + authErr.message)

  // --- Create proprietario profile ---
  const { error: profileErr } = await supabase.from('profiles').insert({
    id: authData.user.id,
    nome: 'Carlos Mendes',
    role: 'proprietario',
    company_id: companyId,
    store_id: null,
  })
  if (profileErr) throw new Error('profile: ' + profileErr.message)

  // --- Generate 548 responses ---
  const months = [
    { month: 1, nps: 68, count: 82 },
    { month: 2, nps: 70, count: 88 },
    { month: 3, nps: 72, count: 92 },
    { month: 4, nps: 74, count: 96 },
    { month: 5, nps: 75, count: 95 },
    { month: 6, nps: 76, count: 95 },
  ]

  const attendants = [
    'Ana Paula', 'Camila Rocha', 'Felipe Souza', 'Bruno Santos',
    'Henrique Costa', 'Daniel Lima', 'Eduarda Alves', 'Gabriela Martins',
  ]

  const promoterComments = [
    'Atendimento excelente, voltarei com certeza!',
    'Superou minhas expectativas. Muito satisfeito.',
    'Atendente muito atencioso e prestativo.',
    'Produto de qualidade e atendimento impecável.',
    'Recomendo a todos. Experiência incrível.',
    'Fui bem atendido e saí satisfeito.',
    'Melhor atendimento que já tive.',
    'Ótima experiência, parabéns à equipe!',
    'Muito profissional e eficiente.',
    'Sempre que venho aqui saio feliz.',
  ]

  const neutralComments = [
    'Atendimento ok, mas poderia melhorar.',
    'Fui atendido, mas demorou um pouco.',
    'Satisfatório, sem reclamações graves.',
    null, null,
  ]

  const detractorComments = [
    'Esperei muito tempo para ser atendido.',
    'O atendimento deixou a desejar.',
    'Produto com defeito e sem solução rápida.',
    'Equipe pouco treinada.',
    null,
  ]

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

  function scoreForNps(nps) {
    const detractorRate = 0.10
    const promoterRate = (nps / 100) + detractorRate
    const r = Math.random()
    if (r < promoterRate) return 9 + Math.floor(Math.random() * 2)
    if (r < promoterRate + (1 - promoterRate - detractorRate)) return 7 + Math.floor(Math.random() * 2)
    return Math.floor(Math.random() * 7)
  }

  function randomDate(year, month) {
    const daysInMonth = new Date(year, month, 0).getDate()
    const day = 1 + Math.floor(Math.random() * daysInMonth)
    const hour = 8 + Math.floor(Math.random() * 11)
    const min = Math.floor(Math.random() * 60)
    return new Date(year, month - 1, day, hour, min).toISOString()
  }

  const storeIds = stores.map(s => s.id)
  const rows = []

  for (const { month, nps, count } of months) {
    for (let i = 0; i < count; i++) {
      const score = scoreForNps(nps)
      let comment = null
      if (score >= 9 && Math.random() < 0.45) comment = pick(promoterComments)
      else if (score >= 7 && Math.random() < 0.25) comment = pick(neutralComments)
      else if (score <= 6 && Math.random() < 0.35) comment = pick(detractorComments)

      rows.push({
        company_id: companyId,
        store_id: pick(storeIds),
        score,
        attendant: pick(attendants),
        comment,
        created_at: randomDate(2026, month),
      })
    }
  }

  for (let i = 0; i < rows.length; i += 100) {
    const { error } = await supabase.from('responses').insert(rows.slice(i, i + 100))
    if (error) throw new Error('responses: ' + error.message)
  }

  return { companyId, stores: storeNames, responses: rows.length }
}
