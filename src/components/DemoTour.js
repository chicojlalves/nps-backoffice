'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ArrowRight, ArrowLeft } from 'lucide-react'

const STEPS = [
  {
    target: 'tour-kpis',
    emoji: '👋',
    titulo: 'Bem-vindo à VozCX!',
    mensagem: 'Aqui estão os indicadores principais: NPS, total de respostas, promotores e detratores — tudo atualizado em tempo real.',
  },
  {
    target: 'tour-evolucao',
    emoji: '📈',
    titulo: 'Evolução do NPS',
    mensagem: 'Acompanhe como a satisfação dos seus clientes evoluiu ao longo do tempo. O gráfico de distribuição mostra o percentual de promotores, neutros e detratores.',
  },
  {
    target: 'tour-atendente',
    emoji: '🏆',
    titulo: 'Ranking de atendentes',
    mensagem: 'Veja o desempenho individual de cada atendente. Identifique os destaques e quem precisa de atenção.',
  },
  {
    target: 'tour-loja',
    emoji: '🏪',
    titulo: 'NPS por loja',
    mensagem: 'Compare o resultado entre todas as suas unidades em tempo real. Ideal para redes com múltiplas lojas.',
  },
  {
    target: 'tour-comentarios',
    emoji: '💬',
    titulo: 'Comentários dos clientes',
    mensagem: 'Leia o que os clientes estão dizendo sobre o atendimento. Feedbacks reais para decisões mais inteligentes.',
  },
]

const STORAGE_KEY = 'vozcx_demo_tour_done'

export default function DemoTour() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)
  const [rect, setRect] = useState(null)

  const current = STEPS[step]

  const updateRect = useCallback(() => {
    const el = document.getElementById(current.target)
    if (el) {
      const r = el.getBoundingClientRect()
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
    }
  }, [current.target])

  const scrollToTarget = useCallback(() => {
    const el = document.getElementById(current.target)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [current.target])

  // Inicia o tour após os dados carregarem
  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return
    const timer = setTimeout(() => {
      setVisible(true)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Atualiza rect e scroll ao mudar step ou quando o tour fica visível
  useEffect(() => {
    if (!visible) return
    // Pequeno delay para o scroll completar antes de calcular rect
    const timer = setTimeout(() => {
      updateRect()
    }, 300)
    scrollToTarget()
    window.addEventListener('resize', updateRect)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateRect)
    }
  }, [visible, step, updateRect, scrollToTarget])

  function close() {
    sessionStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      close()
    }
  }

  function prev() {
    if (step > 0) setStep(s => s - 1)
  }

  if (!visible || !rect) return null

  const padding = 8
  const spaceBelow = window.innerHeight - rect.bottom
  const tooltipBelow = spaceBelow > 200

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 pointer-events-none" style={{ background: 'rgba(0,0,0,0.55)' }} />

      {/* Spotlight ring */}
      <div
        className="fixed z-50 pointer-events-none"
        style={{
          top: rect.top - padding,
          left: rect.left - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.55), 0 0 0 2px #6366f1',
          borderRadius: '1rem',
        }}
      />

      {/* Tooltip card */}
      <div
        className="fixed z-50 w-80 max-w-[calc(100vw-2rem)]"
        style={{
          left: Math.min(
            Math.max(rect.left + rect.width / 2 - 160, 16),
            window.innerWidth - 336
          ),
          ...(tooltipBelow
            ? { top: rect.bottom + padding + 12 }
            : { bottom: window.innerHeight - rect.top + padding + 12 }),
        }}
      >
        <div className="bg-[#1a1d27] border border-indigo-500/30 rounded-2xl shadow-2xl shadow-black/50 p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{current.emoji}</span>
              <h3 className="text-sm font-bold text-white">{current.titulo}</h3>
            </div>
            <button onClick={close} className="text-slate-500 hover:text-white transition-colors flex-shrink-0 mt-0.5">
              <X size={14} />
            </button>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed mb-4">{current.mensagem}</p>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all ${
                    i === step ? 'w-4 h-1.5 bg-indigo-500'
                    : i < step ? 'w-1.5 h-1.5 bg-indigo-500/40'
                    : 'w-1.5 h-1.5 bg-white/10'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {step > 0 && (
                <button
                  onClick={prev}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                >
                  <ArrowLeft size={12} /> Anterior
                </button>
              )}
              <button
                onClick={next}
                className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                {step < STEPS.length - 1 ? <><span>Próximo</span> <ArrowRight size={12} /></> : <span>Entendido! ✓</span>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
