'use client'

import { useState, useEffect, useCallback } from 'react'
import { TrendingUp, Users, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react'
import { LineChart, BarChart, DonutChart } from '@/components/Charts'

const scoreClass = {
  promotor: 'text-emerald-400',
  neutro: 'text-amber-400',
  detrator: 'text-rose-400',
}

function npsColor(nps) {
  if (nps >= 75) return 'text-emerald-400'
  if (nps >= 50) return 'text-blue-400'
  if (nps >= 0) return 'text-amber-400'
  return 'text-rose-400'
}

const PRESETS = [
  { label: 'Hoje', days: 0 },
  { label: '7 dias', days: 6 },
  { label: '30 dias', days: 29 },
  { label: '90 dias', days: 89 },
]

function dateAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

export default function DashboardClient({ profile, lojas }) {
  const today = new Date().toISOString().slice(0, 10)

  const [from, setFrom] = useState(dateAgo(6))
  const [to, setTo] = useState(today)
  const [preset, setPreset] = useState('7 dias')
  const [storeId, setStoreId] = useState('0')

  function applyPreset(p) {
    setPreset(p.label)
    setFrom(dateAgo(p.days))
    setTo(today)
  }
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ from, to })
    if (storeId !== '0') params.append('store', storeId)

    const res = await fetch(`/api/dashboard?${params}`)
    const json = await res.json()
    setData(json)
    setLastUpdate(new Date().toLocaleString('pt-BR'))
    setLoading(false)
  }, [from, to, storeId])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load() }, [load])

  const s = data?.summary ?? {}
  const kpis = [
    { label: 'NPS', value: s.nps != null ? `${s.nps}%` : '–', sub: 'Score do período', icon: TrendingUp, color: 'blue' },
    { label: 'Respostas', value: s.total ?? '–', sub: 'Total no período', icon: Users, color: 'violet' },
    { label: 'Promotores', value: s.promoters ?? '–', sub: 'Nota 9 ou 10', icon: ThumbsUp, color: 'emerald' },
    { label: 'Detratores', value: s.detractors ?? '–', sub: 'Nota 0 a 6', icon: ThumbsDown, color: 'rose' },
  ]

  const colorMap = {
    blue:    { bg: 'bg-blue-500/10',    icon: 'text-blue-400',    border: 'border-blue-500/20' },
    violet:  { bg: 'bg-violet-500/10',  icon: 'text-violet-400',  border: 'border-violet-500/20' },
    emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', border: 'border-emerald-500/20' },
    rose:    { bg: 'bg-rose-500/10',    icon: 'text-rose-400',    border: 'border-rose-500/20' },
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Bem vindo(a), {profile.nome}</p>
        </div>
        {lastUpdate && (
          <p className="text-xs text-slate-600">Atualizado: {lastUpdate}</p>
        )}
      </div>

      {/* Filtros */}
      <div className="bg-[#151820] border border-white/5 rounded-2xl p-4 mb-6 flex flex-col gap-4">
        {/* Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          {PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                preset === p.label
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#0f1117] border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
          <span className="text-slate-700 text-xs ml-1">ou escolha um período</span>
        </div>

        {/* Datas + loja + botão */}
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500">De</label>
            <input
              type="date"
              value={from}
              onChange={e => { setFrom(e.target.value); setPreset('') }}
              className="bg-[#0f1117] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-500">Até</label>
            <input
              type="date"
              value={to}
              onChange={e => { setTo(e.target.value); setPreset('') }}
              className="bg-[#0f1117] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {lojas.length > 0 && (
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-500">Loja</label>
              <select
                value={storeId}
                onChange={e => setStoreId(e.target.value)}
                className="bg-[#0f1117] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">Todas</option>
                {lojas.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
              </select>
            </div>
          )}
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Atualizar
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map(({ label, value, sub, icon: Icon, color }) => {
          const c = colorMap[color]
          return (
            <div key={label} className={`bg-[#151820] rounded-2xl border ${c.border} p-5 flex flex-col gap-4`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">{label}</span>
                <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}>
                  <Icon size={18} className={c.icon} />
                </div>
              </div>
              <div>
                <p className={`text-3xl font-bold ${color === 'blue' && s.nps != null ? npsColor(s.nps) : 'text-white'}`}>
                  {loading ? '...' : value}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Gráficos linha + donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 bg-[#151820] border border-white/5 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Evolução do NPS</h3>
          {!loading && data?.timeseries?.length > 0 ? (
            <LineChart
              series={[{ name: 'NPS', data: data.timeseries.map(t => ({ x: new Date(t.date).getTime(), y: t.nps })) }]}
            />
          ) : (
            <div className="h-[280px] flex items-center justify-center text-slate-600 text-sm">
              {loading ? 'Carregando...' : 'Sem dados no período'}
            </div>
          )}
        </div>

        <div className="bg-[#151820] border border-white/5 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Distribuição</h3>
          {!loading && s.total > 0 ? (
            <DonutChart
              promoters={s.promoters ?? 0}
              passives={s.passives ?? 0}
              detractors={s.detractors ?? 0}
            />
          ) : (
            <div className="h-[280px] flex items-center justify-center text-slate-600 text-sm">
              {loading ? 'Carregando...' : 'Sem dados no período'}
            </div>
          )}
        </div>
      </div>

      {/* Gráfico por atendente */}
      {!loading && data?.byAttendant?.length > 0 && (
        <div className="bg-[#151820] border border-white/5 rounded-2xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">NPS por atendente</h3>
          <BarChart
            series={[{ name: 'NPS', data: data.byAttendant.map(a => a.nps) }]}
            categories={data.byAttendant.map(a => a.attendant)}
          />
        </div>
      )}

      {/* Tabela de comentários */}
      {!loading && data?.comments?.length > 0 && (
        <div className="bg-[#151820] border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <h3 className="text-sm font-semibold text-slate-300">Últimos comentários</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Data</th>
                <th className="text-left text-xs font-medium text-slate-500 px-6 py-3 hidden sm:table-cell">Atendente</th>
                <th className="text-center text-xs font-medium text-slate-500 px-6 py-3">Nota</th>
                <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">Comentário</th>
              </tr>
            </thead>
            <tbody>
              {data.comments.map((c, i) => {
                const scoreType = c.score >= 9 ? 'promotor' : c.score >= 7 ? 'neutro' : 'detrator'
                return (
                  <tr key={i} className={`${i !== data.comments.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/[0.02]`}>
                    <td className="px-6 py-3 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(c.timestamp).toLocaleString('pt-BR', { hour12: false })}
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-400 hidden sm:table-cell">{c.attendant}</td>
                    <td className={`px-6 py-3 text-center font-bold text-sm ${scoreClass[scoreType]}`}>{c.score}</td>
                    <td className="px-6 py-3 text-sm text-slate-300 max-w-xs truncate">{c.comment}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
