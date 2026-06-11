import Link from 'next/link'
import {
  BarChart3, QrCode, Users, ShieldCheck,
  TrendingUp, Star, ArrowRight, Check, Zap, Building2
} from 'lucide-react'

export const metadata = {
  title: 'VozCX: A voz do cliente transformada em resultados',
  description: 'Plataforma de NPS para redes de lojas e franquias. Colete avaliações via QR Code e transforme o feedback dos clientes em decisões inteligentes.',
}

const features = [
  {
    icon: QrCode,
    titulo: 'QR Code instantâneo',
    descricao: 'Gere QR Codes por loja em segundos. O cliente escaneia e avalia em menos de 1 minuto.',
  },
  {
    icon: BarChart3,
    titulo: 'Dashboard em tempo real',
    descricao: 'Acompanhe o NPS por loja, por atendente e por período. Tudo atualizado automaticamente.',
  },
  {
    icon: Users,
    titulo: 'Multi-usuário',
    descricao: 'Gestores, supervisores e atendentes com acessos distintos. Cada um vê o que precisa.',
  },
  {
    icon: ShieldCheck,
    titulo: 'Auditoria completa',
    descricao: 'Registro de todas as ações realizadas na plataforma. Transparência total para sua operação.',
  },
  {
    icon: TrendingUp,
    titulo: 'Relatórios por atendente',
    descricao: 'Identifique os melhores e os que precisam de atenção. Dados para decisões mais inteligentes.',
  },
  {
    icon: Building2,
    titulo: 'Multi-loja e franquias',
    descricao: 'Gerencie todas as unidades em um só lugar. Ideal para redes com múltiplas filiais.',
  },
]

const passos = [
  {
    numero: '01',
    titulo: 'Cadastre sua empresa e lojas',
    descricao: 'Crie sua conta, adicione suas lojas e configure os usuários em minutos.',
  },
  {
    numero: '02',
    titulo: 'Gere o QR Code',
    descricao: 'Cada loja tem seu próprio QR Code. Imprima e cole no balcão ou na saída.',
  },
  {
    numero: '03',
    titulo: 'Acompanhe os resultados',
    descricao: 'Os clientes avaliam e você vê o NPS em tempo real no dashboard.',
  },
]

const planos = [
  {
    key: 'free',
    nome: 'Free',
    preco: 'Grátis',
    periodo: '30 dias de teste',
    descricao: 'Para testar sem compromisso.',
    recursos: [
      '1 loja',
      'Até 3 usuários',
      'QR Code por loja',
      'KPIs gerais de NPS',
      'Gráfico de evolução',
    ],
    nao_inclui: [
      'NPS por atendente',
      'Comentários dos clientes',
      'NPS por loja',
    ],
    destaque: false,
    cta: 'Começar grátis',
  },
  {
    key: 'pro',
    nome: 'Pro',
    preco: 'R$ 97',
    periodo: '/mês',
    descricao: 'Para pequenas redes que querem gestão do time.',
    recursos: [
      'Até 5 lojas',
      'Até 15 usuários',
      'Tudo do Free',
      'NPS por atendente',
      'Comentários dos clientes',
    ],
    nao_inclui: [
      'NPS por loja',
    ],
    destaque: true,
    cta: 'Assinar Pro',
  },
  {
    key: 'business',
    nome: 'Business',
    preco: 'R$ 247',
    periodo: '/mês',
    descricao: 'Para redes e franquias com visão completa.',
    recursos: [
      'Lojas ilimitadas',
      'Usuários ilimitados',
      'Tudo do Pro',
      'NPS por loja',
      'Auditoria de ações',
      'Suporte prioritário',
    ],
    nao_inclui: [],
    destaque: false,
    cta: 'Assinar Business',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-white">

      {/* ===== HEADER ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f1117]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">VozCX</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link
              href="/conheca-vozcx"
              className="text-sm text-slate-400 hover:text-white transition px-3 py-1.5 hidden sm:block"
            >
              Sobre
            </Link>
            <Link
              href="/login"
              className="text-sm text-slate-400 hover:text-white transition px-3 py-1.5"
            >
              Entrar
            </Link>
            <Link
              href="/onboarding"
              className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-1.5 rounded-lg transition"
            >
              Começar grátis
            </Link>
          </nav>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="pt-40 pb-24 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <Zap size={12} />
            Feito para redes de lojas e franquias
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Descubra o que seus{' '}
            <span className="text-indigo-400">clientes</span>{' '}
            realmente pensam
          </h1>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            A voz do cliente transformada em resultados.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition text-sm"
            >
              Começar grátis sem cartão <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-medium px-6 py-3 rounded-xl transition text-sm border border-white/10"
            >
              Já tenho uma conta
            </Link>
          </div>
          <p className="text-slate-600 text-xs mt-4">Não cobraremos nada até o fim dos 30 dias de teste. Cancele quando quiser.</p>
        </div>

        {/* Mockup */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-[#1a1d27] rounded-2xl border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'NPS Score', valor: '72', cor: 'text-green-400' },
                { label: 'Promotores', valor: '68%', cor: 'text-indigo-400' },
                { label: 'Neutros', valor: '20%', cor: 'text-yellow-400' },
                { label: 'Detratores', valor: '12%', cor: 'text-red-400' },
              ].map(k => (
                <div key={k.label} className="bg-[#0f1117] rounded-xl p-4 border border-white/5">
                  <p className="text-slate-500 text-xs mb-1">{k.label}</p>
                  <p className={`text-2xl font-bold ${k.cor}`}>{k.valor}</p>
                </div>
              ))}
            </div>
            <div className="h-24 bg-[#0f1117] rounded-xl border border-white/5 flex items-center justify-center">
              <div className="flex items-end gap-2 h-16 px-4">
                {[40, 65, 55, 80, 72, 85, 78, 90, 72, 88, 76, 92].map((h, i) => (
                  <div
                    key={i}
                    className="w-4 bg-indigo-600/60 rounded-sm"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-24 px-4 sm:px-6 bg-[#0a0d14]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">O que você ganha com a VozCX</h2>
            <p className="text-slate-400">Uma plataforma completa para gerenciar a satisfação dos clientes.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.titulo} className="bg-[#1a1d27] rounded-xl p-6 border border-white/5 hover:border-indigo-600/30 transition">
                <div className="w-10 h-10 bg-indigo-600/15 rounded-xl flex items-center justify-center mb-4">
                  <f.icon size={20} className="text-indigo-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.titulo}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMO FUNCIONA ===== */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Como funciona</h2>
            <p className="text-slate-400">Em 3 passos você já está coletando avaliações.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {passos.map((p, i) => (
              <div key={p.numero} className="relative text-center">
                {i < passos.length - 1 && (
                  <div className="hidden sm:block absolute top-8 left-[60%] w-full h-px bg-white/5" />
                )}
                <div className="w-16 h-16 bg-indigo-600/10 border border-indigo-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-indigo-400">{p.numero}</span>
                </div>
                <h3 className="font-semibold text-white mb-2">{p.titulo}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{p.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <section className="py-16 px-4 sm:px-6 bg-[#0a0d14]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <blockquote className="text-lg text-slate-300 italic mb-4">
            &ldquo;Finalmente consigo ver em tempo real o que os clientes acham de cada loja.
            O QR Code foi a solução mais simples que encontrei.&rdquo;
          </blockquote>
          <p className="text-slate-500 text-sm">Proprietário de rede com 4 lojas</p>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Planos simples e transparentes</h2>
            <p className="text-slate-400">Comece grátis e escale conforme seu negócio cresce.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planos.map(plano => (
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
                  <h3 className="text-lg font-bold text-white mb-1">{plano.nome}</h3>
                  <p className={`text-sm mb-4 ${plano.destaque ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {plano.descricao}
                  </p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-white">{plano.preco}</span>
                    <span className={`text-sm mb-1 ${plano.destaque ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {plano.periodo}
                    </span>
                  </div>
                </div>
                <ul className="flex-1 space-y-2.5 mb-8">
                  {plano.recursos.map(r => (
                    <li key={r} className="flex items-center gap-2">
                      <Check size={14} className={plano.destaque ? 'text-indigo-200' : 'text-indigo-400'} />
                      <span className={`text-sm ${plano.destaque ? 'text-indigo-100' : 'text-slate-300'}`}>{r}</span>
                    </li>
                  ))}
                  {plano.nao_inclui?.map(r => (
                    <li key={r} className="flex items-center gap-2 opacity-40">
                      <span className={`text-sm font-bold ${plano.destaque ? 'text-indigo-200' : 'text-slate-500'}`}>✕</span>
                      <span className={`text-sm line-through ${plano.destaque ? 'text-indigo-200' : 'text-slate-500'}`}>{r}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/onboarding"
                  className={`w-full py-3 rounded-xl font-semibold text-sm text-center transition ${
                    plano.destaque
                      ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                      : 'bg-indigo-600 text-white hover:bg-indigo-500'
                  }`}
                >
                  {plano.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Tabela comparativa */}
          <div className="mt-12 bg-[#1a1d27] rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs font-medium text-slate-400 px-6 py-4">Recurso</th>
                  <th className="text-center text-xs font-medium text-slate-400 px-4 py-4">Free</th>
                  <th className="text-center text-xs font-medium text-indigo-400 px-4 py-4">Pro</th>
                  <th className="text-center text-xs font-medium text-amber-400 px-4 py-4">Business</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { recurso: 'Lojas',                   free: '1',   pro: '5',   business: 'Ilimitadas' },
                  { recurso: 'Usuários',                free: '3',   pro: '15',  business: 'Ilimitados' },
                  { recurso: 'QR Code por loja',        free: true,  pro: true,  business: true },
                  { recurso: 'KPIs gerais de NPS',      free: true,  pro: true,  business: true },
                  { recurso: 'Gráfico de evolução',     free: true,  pro: true,  business: true },
                  { recurso: 'NPS por atendente',       free: false, pro: true,  business: true },
                  { recurso: 'Comentários dos clientes',free: false, pro: true,  business: true },
                  { recurso: 'NPS por loja',            free: false, pro: false, business: true },
                  { recurso: 'Auditoria de ações',      free: false, pro: false, business: true },
                  { recurso: 'Suporte prioritário',     free: false, pro: false, business: true },
                ].map((row, i, arr) => (
                  <tr key={row.recurso} className={`${i !== arr.length - 1 ? 'border-b border-white/5' : ''}`}>
                    <td className="px-6 py-3.5 text-slate-300 text-sm">{row.recurso}</td>
                    {['free', 'pro', 'business'].map(p => (
                      <td key={p} className="px-4 py-3.5 text-center">
                        {typeof row[p] === 'boolean' ? (
                          row[p]
                            ? <span className="text-indigo-400 font-bold">✓</span>
                            : <span className="text-slate-700">—</span>
                        ) : (
                          <span className={`text-xs font-medium ${
                            p === 'business' ? 'text-amber-400' :
                            p === 'pro'      ? 'text-indigo-400' : 'text-slate-400'
                          }`}>{row[p]}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-24 px-4 sm:px-6 bg-[#0a0d14]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Transforme a voz do cliente em resultados reais.
          </h2>
          <p className="text-slate-400 mb-8">
            Crie sua conta grátis em menos de 2 minutos.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition"
          >
            Criar minha conta grátis <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/5 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <BarChart3 size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-white">VozCX</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/conheca-vozcx" className="text-slate-500 hover:text-white text-sm transition">
              Sobre
            </Link>
            <Link href="/planos" className="text-slate-500 hover:text-white text-sm transition">
              Planos
            </Link>
            <Link href="/onboarding" className="text-slate-500 hover:text-white text-sm transition">
              Cadastro
            </Link>
            <Link href="/login" className="text-slate-500 hover:text-white text-sm transition">
              Login
            </Link>
          </div>
          <p className="text-slate-600 text-xs">© 2026 VozCX. Todos os direitos reservados.</p>
        </div>
      </footer>

    </div>
  )
}
