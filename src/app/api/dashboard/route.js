import { createClient } from '@/lib/supabase/server'

export async function GET(request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Não autenticado.' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const store_id = searchParams.get('store')

    // Monta query base
    let query = supabase.from('responses').select('*')
    if (from) query = query.gte('created_at', from)
    if (to) query = query.lte('created_at', to + 'T23:59:59')
    if (store_id && store_id !== '0') query = query.eq('store_id', store_id)

    const { data: responses, error } = await query.order('created_at', { ascending: true })
    if (error) return Response.json({ error: error.message }, { status: 500 })

    const total = responses.length
    const promoters = responses.filter(r => r.score >= 9).length
    const detractors = responses.filter(r => r.score <= 6).length
    const passives = total - promoters - detractors
    const nps = total === 0 ? 0 : Math.round(((promoters - detractors) / total) * 100)

    // NPS por atendente
    const byAttendant = {}
    responses.forEach(r => {
      if (!r.attendant) return
      if (!byAttendant[r.attendant]) byAttendant[r.attendant] = { promoters: 0, detractors: 0, total: 0 }
      byAttendant[r.attendant].total++
      if (r.score >= 9) byAttendant[r.attendant].promoters++
      if (r.score <= 6) byAttendant[r.attendant].detractors++
    })
    const byAttendantArr = Object.entries(byAttendant).map(([name, v]) => ({
      attendant: name,
      nps: Math.round(((v.promoters - v.detractors) / v.total) * 100),
      total: v.total,
    })).sort((a, b) => b.nps - a.nps)

    // Timeseries — agrupa por dia
    const byDay = {}
    responses.forEach(r => {
      const day = r.created_at.slice(0, 10)
      if (!byDay[day]) byDay[day] = { promoters: 0, detractors: 0, total: 0 }
      byDay[day].total++
      if (r.score >= 9) byDay[day].promoters++
      if (r.score <= 6) byDay[day].detractors++
    })
    const timeseries = Object.entries(byDay).map(([date, v]) => ({
      date,
      nps: Math.round(((v.promoters - v.detractors) / v.total) * 100),
    }))

    // Últimos 50 comentários
    const comments = responses
      .filter(r => r.comment)
      .slice(-50)
      .reverse()
      .map(r => ({
        timestamp: r.created_at,
        attendant: r.attendant ?? '–',
        score: r.score,
        comment: r.comment,
      }))

    return Response.json({
      summary: { nps, total, promoters, detractors, passives },
      byAttendant: byAttendantArr,
      timeseries,
      comments,
    })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
