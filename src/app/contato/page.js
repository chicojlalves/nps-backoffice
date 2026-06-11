import Link from 'next/link'
import { Mail, Globe, Clock, ArrowRight, HeadphonesIcon, ShoppingBag, MessageCircle } from 'lucide-react'
import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'

export const metadata = {
  title: 'Contato — VozCX',
  description: 'Entre em contato com a VozCX. Estamos prontos para ajudar sua empresa a ouvir melhor seus clientes.',
}

export default function Contato() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <PublicHeader />

      <main className="pt-40 pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">

          {/* Hero */}
          <div className="text-center mb-16">
            <p className="text-indigo-400 text-sm font-medium mb-4 tracking-wide uppercase">Contato</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Entre em contato
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
              Estamos prontos para ajudar sua empresa a ouvir melhor seus clientes.
            </p>
          </div>

          {/* Cards de contato */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">

            <div className="bg-[#1a1d27] rounded-2xl p-8 border border-white/5 hover:border-indigo-600/30 transition flex flex-col gap-4">
              <div className="w-10 h-10 bg-indigo-600/15 rounded-xl flex items-center justify-center">
                <ShoppingBag size={20} className="text-indigo-400" />
              </div>
              <div>
                <h2 className="font-semibold text-white mb-1">Comercial</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Quer conhecer a plataforma ou contratar um plano?
                </p>
                <a
                  href="mailto:comercial@vozcx.com.br"
                  className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm transition"
                >
                  <Mail size={14} />
                  comercial@vozcx.com.br
                </a>
              </div>
            </div>

            <div className="bg-[#1a1d27] rounded-2xl p-8 border border-white/5 hover:border-indigo-600/30 transition flex flex-col gap-4">
              <div className="w-10 h-10 bg-indigo-600/15 rounded-xl flex items-center justify-center">
                <HeadphonesIcon size={20} className="text-indigo-400" />
              </div>
              <div>
                <h2 className="font-semibold text-white mb-1">Suporte</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Precisa de ajuda com sua conta ou configuração?
                </p>
                <a
                  href="mailto:suporte@vozcx.com.br"
                  className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm transition"
                >
                  <Mail size={14} />
                  suporte@vozcx.com.br
                </a>
              </div>
            </div>

            <div className="bg-[#1a1d27] rounded-2xl p-8 border border-white/5 hover:border-indigo-600/30 transition flex flex-col gap-4">
              <div className="w-10 h-10 bg-indigo-600/15 rounded-xl flex items-center justify-center">
                <MessageCircle size={20} className="text-indigo-400" />
              </div>
              <div>
                <h2 className="font-semibold text-white mb-1">Atendimento Geral</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-3">
                  Para demais assuntos e informações.
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href="mailto:contato@vozcx.com.br"
                    className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm transition"
                  >
                    <Mail size={14} />
                    contato@vozcx.com.br
                  </a>
                  <a
                    href="https://www.vozcx.com.br"
                    className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm transition"
                  >
                    <Globe size={14} />
                    www.vozcx.com.br
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Demonstração + Horário */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">

            {/* Demo */}
            <div className="bg-indigo-600/10 border border-indigo-600/20 rounded-2xl p-8 flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white">Demonstração</h2>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">
                Quer ver a plataforma funcionando? Solicite uma demonstração e descubra como a VozCX
                pode ajudar sua empresa a transformar a voz do cliente em resultados.
              </p>
              <a
                href="mailto:comercial@vozcx.com.br?subject=Solicitação de demonstração"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm w-fit"
              >
                Solicitar demonstração <ArrowRight size={15} />
              </a>
            </div>

            {/* Horário */}
            <div className="bg-[#1a1d27] border border-white/5 rounded-2xl p-8 flex flex-col gap-4">
              <div className="w-10 h-10 bg-indigo-600/15 rounded-xl flex items-center justify-center">
                <Clock size={20} className="text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Horário de atendimento</h2>
              <div>
                <p className="text-slate-300 text-sm font-medium">Segunda a Sexta-feira</p>
                <p className="text-indigo-400 text-2xl font-bold mt-1">09:00 às 18:00</p>
              </div>
            </div>

          </div>

          {/* Compromisso */}
          <div className="bg-[#1a1d27] border border-white/5 rounded-2xl p-10 text-center">
            <h2 className="text-xl font-bold text-white mb-4">Nosso compromisso</h2>
            <p className="text-slate-400 leading-relaxed max-w-2xl mx-auto mb-2">
              Nosso objetivo é responder todas as solicitações o mais rápido possível e oferecer
              um atendimento próximo e transparente.
            </p>
            <p className="text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Acreditamos que empresas melhores começam ouvindo seus clientes — e fazemos questão
              de ouvir os nossos também.
            </p>
          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
