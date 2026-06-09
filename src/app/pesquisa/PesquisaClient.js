'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BarChart3, CheckCircle } from 'lucide-react'

const SCORES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function scoreColor(n) {
  if (n >= 9) return 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20'
  if (n >= 7) return 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20'
  return 'bg-rose-500/10 border-rose-500/40 text-rose-400 hover:bg-rose-500/20'
}

function scoreColorActive(n) {
  if (n >= 9) return 'bg-emerald-500 border-emerald-500 text-white'
  if (n >= 7) return 'bg-amber-500 border-amber-500 text-white'
  return 'bg-rose-500 border-rose-500 text-white'
}

export default function PesquisaClient({ store_id, company_id, atendentes }) {
  const [score, setScore] = useState(null)
  const [attendant, setAttendant] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (score === null) {
      setErro('Por favor, selecione uma nota.')
      return
    }

    setErro('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.from('responses').insert({
      store_id,
      company_id,
      score,
      attendant: attendant || null,
      comment: comment || null,
    })

    setLoading(false)

    if (error) {
      setErro('Erro ao enviar. Tente novamente.')
      return
    }

    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1117] p-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Obrigado!</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Sua avaliação foi registrada com sucesso. Sua opinião é muito importante para nós.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1117] p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-10">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 size={15} className="text-white" />
          </div>
          <span className="font-bold text-white">NPS</span>
        </div>

        <div className="bg-[#151820] border border-white/5 rounded-2xl p-8">
          <h1 className="text-xl font-bold text-white mb-2 text-center">
            Como foi sua experiência?
          </h1>
          <p className="text-slate-500 text-sm text-center mb-8">
            Em uma escala de 0 a 10, o quanto você nos recomendaria a um amigo ou familiar?
          </p>

          {/* Notas */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {SCORES.map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setScore(n)}
                className={`w-11 h-11 rounded-xl border font-bold text-sm transition-all ${
                  score === n ? scoreColorActive(n) : scoreColor(n)
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          {/* Legenda */}
          <div className="flex justify-between text-xs text-slate-600 mb-8 px-1">
            <span>Muito improvável</span>
            <span>Muito provável</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Atendente — só aparece se houver atendentes cadastrados */}
            {atendentes.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-400">Quem te atendeu? (opcional)</label>
                <select
                  value={attendant}
                  onChange={e => setAttendant(e.target.value)}
                  className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="">Selecione…</option>
                  {atendentes.map(a => (
                    <option key={a.id} value={a.nome}>{a.nome}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Comentário */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400">Deixe um comentário (opcional)</label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Conte-nos mais sobre sua experiência..."
                rows={3}
                className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              />
            </div>

            {erro && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || score === null}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold rounded-xl py-3 text-sm transition-colors"
            >
              {loading ? 'Enviando...' : 'Enviar avaliação'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
