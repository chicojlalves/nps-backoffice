'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const planos = [
  {
    key: 'free',
    nome: 'Free',
    preco: 'Grátis',
    periodo: '30 dias',
    descricao: 'Para testar a plataforma sem compromisso.',
    recursos: [
      '1 loja',
      'Coleta de NPS via QR Code',
      'Dashboard básico',
      'Válido por 30 dias',
    ],
    destaque: false,
    cta: 'Começar grátis',
  },
  {
    key: 'pro',
    nome: 'Pro',
    preco: 'R$ 97',
    periodo: '/mês',
    descricao: 'Para pequenas redes que querem crescer.',
    recursos: [
      'Até 5 lojas',
      'Dashboard completo',
      'Múltiplos usuários',
      'Relatórios por atendente',
      'Suporte por e-mail',
    ],
    destaque: true,
    cta: 'Assinar Pro',
  },
  {
    key: 'business',
    nome: 'Business',
    preco: 'R$ 247',
    periodo: '/mês',
    descricao: 'Para redes e franquias sem limites.',
    recursos: [
      'Lojas ilimitadas',
      'Tudo do Pro',
      'Auditoria de ações',
      'Múltiplos gestores',
      'Suporte prioritário',
    ],
    destaque: false,
    cta: 'Assinar Business',
  },
]

export default function PlanosPage() {
  const [loading, setLoading] = useState(null)
  const router = useRouter()

  async function handleAssinar(planKey) {
    setLoading(planKey)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planKey }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Erro ao iniciar pagamento')
      }
    } catch {
      alert('Erro ao conectar com o servidor')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-3">Escolha seu plano</h1>
        <p className="text-gray-400 text-lg">
          Comece grátis e escale conforme seu negócio cresce.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {planos.map((plano) => (
          <div
            key={plano.key}
            className={`relative rounded-2xl p-8 flex flex-col ${
              plano.destaque
                ? 'bg-indigo-600 ring-2 ring-indigo-400'
                : 'bg-[#1a1d27] ring-1 ring-white/10'
            }`}
          >
            {plano.destaque && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-400 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Mais popular
              </span>
            )}

            <div className="mb-6">
              <h2 className={`text-xl font-bold mb-1 ${plano.destaque ? 'text-white' : 'text-white'}`}>
                {plano.nome}
              </h2>
              <p className={`text-sm mb-4 ${plano.destaque ? 'text-indigo-200' : 'text-gray-400'}`}>
                {plano.descricao}
              </p>
              <div className="flex items-end gap-1">
                <span className={`text-4xl font-bold ${plano.destaque ? 'text-white' : 'text-white'}`}>
                  {plano.preco}
                </span>
                <span className={`text-sm mb-1 ${plano.destaque ? 'text-indigo-200' : 'text-gray-400'}`}>
                  {plano.periodo}
                </span>
              </div>
            </div>

            <ul className="flex-1 space-y-3 mb-8">
              {plano.recursos.map((r) => (
                <li key={r} className="flex items-center gap-2">
                  <span className={`text-lg ${plano.destaque ? 'text-indigo-200' : 'text-indigo-400'}`}>✓</span>
                  <span className={`text-sm ${plano.destaque ? 'text-indigo-100' : 'text-gray-300'}`}>{r}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleAssinar(plano.key)}
              disabled={loading === plano.key}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition cursor-pointer ${
                plano.destaque
                  ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500'
              } disabled:opacity-50`}
            >
              {loading === plano.key ? 'Aguarde...' : plano.cta}
            </button>
          </div>
        ))}
      </div>

      <p className="text-gray-500 text-sm mt-10">
        Dúvidas? Entre em contato:{' '}
        <a href="mailto:suporte@seudominio.com.br" className="text-indigo-400 hover:underline">
          suporte@seudominio.com.br
        </a>
      </p>
    </div>
  )
}
