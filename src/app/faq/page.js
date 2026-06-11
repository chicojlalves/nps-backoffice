'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'
import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'

const faqs = [
  {
    pergunta: 'O que é a VozCX?',
    resposta: 'A VozCX é uma plataforma de Customer Experience que ajuda empresas a acompanharem a satisfação dos clientes através de QR Code e dashboards em tempo real.',
  },
  {
    pergunta: 'O cliente precisa instalar algum aplicativo?',
    resposta: 'Não. Basta escanear o QR Code com a câmera do celular e responder a avaliação.',
  },
  {
    pergunta: 'Posso cadastrar mais de uma loja?',
    resposta: 'Sim. A VozCX foi desenvolvida para redes de lojas e franquias.',
  },
  {
    pergunta: 'É possível acompanhar o desempenho dos atendentes?',
    resposta: 'Sim. Nos planos compatíveis, você pode visualizar indicadores e comentários por atendente.',
  },
  {
    pergunta: 'Quanto tempo leva para começar?',
    resposta: 'A configuração é simples e leva apenas alguns minutos.',
  },
  {
    pergunta: 'Posso testar antes de contratar?',
    resposta: 'Sim. Oferecemos 30 dias gratuitos para novos clientes, sem necessidade de cartão de crédito.',
  },
  {
    pergunta: 'Preciso de conhecimento técnico?',
    resposta: 'Não. A plataforma foi desenvolvida para ser simples e intuitiva.',
  },
  {
    pergunta: 'Os dados ficam seguros?',
    resposta: 'Sim. Adotamos boas práticas de segurança e proteção de dados, respeitando a LGPD.',
  },
  {
    pergunta: 'Posso cancelar quando quiser?',
    resposta: 'Sim. O cancelamento pode ser solicitado a qualquer momento, conforme as condições do plano contratado.',
  },
  {
    pergunta: 'Como entro em contato com a equipe?',
    resposta: 'Você pode falar conosco através do e-mail contato@vozcx.com.br ou pelos nossos canais de atendimento.',
    link: { label: 'Ir para Contato', href: '/contato' },
  },
]

function FaqItem({ pergunta, resposta, link }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-white font-medium text-sm sm:text-base">{pergunta}</span>
        {open
          ? <ChevronUp size={16} className="text-indigo-400 flex-shrink-0" />
          : <ChevronDown size={16} className="text-slate-500 flex-shrink-0" />
        }
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-slate-400 text-sm leading-relaxed">{resposta}</p>
          {link && (
            <Link href={link.href} className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-sm mt-3 transition">
              {link.label} <ArrowRight size={13} />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <PublicHeader />

      <main className="pt-40 pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">

          {/* Hero */}
          <div className="text-center mb-14">
            <p className="text-indigo-400 text-sm font-medium mb-4 tracking-wide uppercase">FAQ</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Perguntas frequentes</h1>
            <p className="text-slate-400 text-lg">Tire suas dúvidas sobre a VozCX.</p>
          </div>

          {/* Accordion */}
          <div className="bg-[#1a1d27] rounded-2xl border border-white/5 overflow-hidden mb-12">
            {faqs.map(faq => (
              <FaqItem key={faq.pergunta} {...faq} />
            ))}
          </div>

          {/* CTA */}
          <div className="bg-indigo-600/10 border border-indigo-600/20 rounded-2xl p-8 text-center">
            <h2 className="text-lg font-bold text-white mb-2">Não encontrou o que procurava?</h2>
            <p className="text-slate-400 text-sm mb-6">Nossa equipe está pronta para ajudar.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contato"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl transition text-sm"
              >
                Falar com a equipe <ArrowRight size={15} />
              </Link>
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-6 py-2.5 rounded-xl transition text-sm"
              >
                Começar grátis
              </Link>
            </div>
          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
