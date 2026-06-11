import Link from 'next/link'
import { ArrowRight, Zap, Eye, TrendingUp, Heart } from 'lucide-react'
import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'

export const metadata = {
  title: 'Conheça a VozCX — Empresas melhores começam ouvindo seus clientes',
  description: 'Conheça a história, a missão e os valores da VozCX. Uma plataforma criada para transformar o feedback dos clientes em decisões inteligentes.',
}

const valores = [
  {
    icon: Zap,
    titulo: 'Simplicidade',
    descricao: 'Tecnologia precisa resolver problemas, não criar novos.',
  },
  {
    icon: Eye,
    titulo: 'Transparência',
    descricao: 'Dados claros para decisões melhores.',
  },
  {
    icon: TrendingUp,
    titulo: 'Evolução contínua',
    descricao: 'Estamos sempre melhorando nossa plataforma.',
  },
  {
    icon: Heart,
    titulo: 'Foco no cliente',
    descricao: 'Acreditamos que ouvir o cliente é o primeiro passo para crescer.',
  },
]

export default function ConhecaVozCX() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-white">

      <PublicHeader />

      {/* ===== HERO ===== */}
      <section className="pt-48 pb-24 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-indigo-400 text-sm font-medium mb-4 tracking-wide uppercase">Conheça a VozCX</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Empresas melhores começam{' '}
            <span className="text-indigo-400">ouvindo seus clientes.</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Acreditamos que empresas melhores começam ouvindo seus clientes.
          </p>
        </div>
      </section>

      {/* ===== NOSSA MISSÃO ===== */}
      <section className="py-24 px-4 sm:px-6 bg-[#0a0d14]">
        <div className="max-w-3xl mx-auto">
          <p className="text-indigo-400 text-sm font-medium mb-4 tracking-wide uppercase">Nossa missão</p>
          <h2 className="text-3xl font-bold text-white mb-8">
            Por que a VozCX existe
          </h2>
          <div className="flex flex-col gap-5 text-slate-400 text-base leading-relaxed">
            <p>
              A VozCX nasceu com um objetivo simples: ajudar empresas a entenderem melhor o que seus clientes realmente pensam.
            </p>
            <p>
              Muitos negócios investem em marketing, treinamento e tecnologia, mas ainda tomam decisões sem ouvir quem mais importa: o cliente.
            </p>
            <p>
              Criamos uma plataforma simples, rápida e acessível para transformar avaliações em dados que ajudam gestores a melhorar a experiência, desenvolver equipes e fortalecer seus negócios.
            </p>
          </div>
        </div>
      </section>

      {/* ===== FUNDADOR ===== */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-indigo-400 text-sm font-medium mb-4 tracking-wide uppercase">Sobre o fundador</p>
          <h2 className="text-3xl font-bold text-white mb-12">
            Aqui existe uma oportunidade enorme.
          </h2>
          <div className="flex flex-col sm:flex-row gap-10 items-start">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl font-bold text-white">
                FA
              </div>
            </div>
            {/* Texto */}
            <div className="flex flex-col gap-5 text-slate-400 text-base leading-relaxed">
              <p className="text-white font-semibold text-lg">Francisco Alves</p>
              <p>
                Olá, eu sou Francisco Alves, fundador da VozCX.
              </p>
              <p>
                Atuo há mais de 20 anos na área de tecnologia, liderando projetos, equipes e iniciativas de transformação digital para empresas de diferentes segmentos.
              </p>
              <p>
                Ao longo dessa jornada, percebi que muitos empresários têm acesso a diversos indicadores financeiros, mas ainda carecem de uma forma simples e eficiente de entender a experiência dos seus clientes.
              </p>
              <p>
                Foi dessa necessidade que nasceu a VozCX: uma plataforma desenvolvida para aproximar empresas da opinião de seus clientes e transformar feedback em decisões inteligentes.
              </p>
              <p>
                Meu compromisso é construir uma solução prática, acessível e em constante evolução, sempre ouvindo nossos clientes da mesma forma que incentivamos nossos parceiros a ouvirem os deles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VALORES ===== */}
      <section className="py-24 px-4 sm:px-6 bg-[#0a0d14]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-indigo-400 text-sm font-medium mb-4 tracking-wide uppercase">Nossos valores</p>
            <h2 className="text-3xl font-bold text-white">O que nos guia</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.map(v => (
              <div key={v.titulo} className="bg-[#1a1d27] rounded-xl p-6 border border-white/5 hover:border-indigo-600/30 transition">
                <div className="w-10 h-10 bg-indigo-600/15 rounded-xl flex items-center justify-center mb-4">
                  <v.icon size={20} className="text-indigo-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{v.titulo}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{v.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMPROMISSO ===== */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-indigo-400 text-sm font-medium mb-4 tracking-wide uppercase">Nosso compromisso</p>
          <h2 className="text-3xl font-bold text-white mb-8">
            Mais do que um sistema de NPS
          </h2>
          <div className="flex flex-col gap-5 text-slate-400 text-base leading-relaxed">
            <p>
              Mais do que fornecer um sistema de NPS, queremos ajudar empresas a criarem uma cultura orientada pela experiência do cliente.
            </p>
            <p>
              Acreditamos que pequenos ajustes, baseados em dados reais, podem gerar grandes resultados para equipes, gestores e clientes.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 px-4 sm:px-6 bg-[#0a0d14]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para ouvir seus clientes?
          </h2>
          <p className="text-slate-400 mb-8">
            Comece hoje mesmo com 30 dias gratuitos e descubra como a VozCX pode ajudar sua empresa a crescer.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition"
          >
            Criar minha conta <ArrowRight size={16} />
          </Link>
          <p className="text-slate-600 text-xs mt-4">30 dias grátis. Sem cartão de crédito.</p>
        </div>
      </section>

      <PublicFooter />

    </div>
  )
}
