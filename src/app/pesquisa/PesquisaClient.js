'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BarChart3, CheckCircle } from 'lucide-react'

const SCORES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function scoreColor(n) {
  if (n >= 9) return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 active:bg-emerald-500/30'
  if (n >= 7) return 'bg-amber-500/10 border-amber-500/30 text-amber-400 active:bg-amber-500/30'
  return 'bg-rose-500/10 border-rose-500/30 text-rose-400 active:bg-rose-500/30'
}

function scoreColorActive(n) {
  if (n >= 9) return 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30'
  if (n >= 7) return 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/30'
  return 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/30'
}

function scoreLabel(n) {
  if (n >= 9) return { text: 'Promotor', color: 'text-emerald-400' }
  if (n >= 7) return { text: 'Neutro', color: 'text-amber-400' }
  return { text: 'Detrator', color: 'text-rose-400' }
}

export default function PesquisaClient({ store_id, company_id, atendentes, store_nome }) {
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
      <div className="min-h-screen flex items-center justify-center bg-[#0f1117] p-6">
        <div className="flex flex-col items-center gap-5 text-center max-w-sm w-full">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
            <CheckCircle size={40} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Obrigado!</h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Sua avaliação foi registrada com sucesso.<br />
              Sua opinião é muito importante para nós.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex flex-col">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 pt-8 pb-4 px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 size={15} className="text-white" />
          </div>
          <span className="font-bold text-white text-lg">VozCX</span>
        </div>
        {store_nome && (
          <span className="text-xs text-slate-500 tracking-wide">
            Unidade: <span className="text-slate-300 font-medium">{store_nome}</span>
          </span>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col justify-center px-4 pb-8">
        <div className="w-full max-w-lg mx-auto">
          <div className="bg-[#151820] border border-white/5 rounded-2xl p-6 sm:p-8">

            {/* Pergunta */}
            <div className="text-center mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Como foi sua experiência?
              </h1>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Em uma escala de 0 a 10, o quanto você nos recomendaria a um amigo ou familiar?
              </p>
            </div>

            {/* Botões de nota */}
            <div className="flex flex-wrap justify-center gap-2 mb-3">
              {SCORES.map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setScore(n)}
                  className={`w-12 h-12 sm:w-11 sm:h-11 rounded-xl border-2 font-bold text-base sm:text-sm transition-all touch-manipulation flex-shrink-0 ${
                    score === n ? scoreColorActive(n) : scoreColor(n)
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            {/* Legenda + feedback da nota */}
            <div className="flex justify-between text-xs text-slate-600 mb-2 px-1">
              <span>Muito improvável</span>
              <span>Muito provável</span>
            </div>

            {/* Indicador da nota selecionada */}
            <div className={`text-center text-sm font-semibold mb-6 h-5 transition-all ${score !== null ? scoreLabel(score).color : 'text-transparent'}`}>
              {score !== null ? `${score} — ${scoreLabel(score).text}` : '.'}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Atendente */}
              {atendentes.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-300">Quem te atendeu? <span className="text-slate-500 font-normal">(opcional)</span></label>
                  <select
                    value={attendant}
                    onChange={e => setAttendant(e.target.value)}
                    className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                <label className="text-sm font-medium text-slate-300">Comentário <span className="text-slate-500 font-normal">(opcional)</span></label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Conte-nos mais sobre sua experiência..."
                  rows={3}
                  className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
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
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold rounded-xl py-4 text-base transition-colors touch-manipulation mt-2"
              >
                {loading ? 'Enviando...' : 'Enviar avaliação'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
