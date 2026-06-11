import { getProfile } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'
import { AlertTriangle, Zap, ArrowRight } from 'lucide-react'

async function getTrialInfo(companyId) {
  if (!companyId) return null
  const supabase = await createClient()
  const { data } = await supabase
    .from('companies')
    .select('subscription_status, plan, created_at')
    .eq('id', companyId)
    .single()

  if (!data || data.subscription_status !== 'trialing') return null

  const createdAt = new Date(data.created_at)
  const expiraEm = new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000)
  const hoje = new Date()
  const diasRestantes = Math.ceil((expiraEm - hoje) / (1000 * 60 * 60 * 24))

  if (diasRestantes > 5) return null
  return { diasRestantes: Math.max(diasRestantes, 0) }
}

async function getIsDemo() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.email === 'demo@vozcx.com.br'
}

export default async function BackofficeLayout({ children }) {
  const profile = await getProfile()
  const [trialInfo, isDemo] = await Promise.all([
    getTrialInfo(profile.company_id),
    getIsDemo(),
  ])

  return (
    <div className="min-h-screen flex bg-[#0f1117]">
      <Sidebar profile={profile} />
      <div className="flex-1 flex flex-col min-w-0">
        {isDemo && (
          <div className="flex items-center justify-between bg-indigo-600/10 border-b border-indigo-600/20 px-4 sm:px-8 py-2.5 gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Zap size={15} className="text-indigo-400 flex-shrink-0" />
              <p className="text-xs text-indigo-300 truncate">
                Você está explorando uma conta de demonstração. Os dados são fictícios e reiniciados a cada acesso.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a href="/api/auth/demo-logout"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-all">
                Finalizar demo
              </a>
              <a href="/onboarding"
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all animate-pulse hover:animate-none">
                Criar minha conta grátis <ArrowRight size={12} />
              </a>
            </div>
          </div>
        )}
        {trialInfo && (
          <div className="flex items-center justify-between bg-amber-500/10 border-b border-amber-500/20 px-4 sm:px-8 py-2.5">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-amber-400 flex-shrink-0" />
              <p className="text-xs text-amber-300">
                {trialInfo.diasRestantes === 0
                  ? 'Seu período de teste expira hoje!'
                  : `Seu período de teste expira em ${trialInfo.diasRestantes} dia${trialInfo.diasRestantes > 1 ? 's' : ''}.`}
                {' '}Escolha um plano para continuar usando.
              </p>
            </div>
            <a href="/planos"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline flex-shrink-0 ml-4">
              Ver planos
            </a>
          </div>
        )}
        <main className="flex-1 p-4 sm:p-8 pt-20 md:pt-8">
          {children}
        </main>
      </div>
    </div>
  )
}
