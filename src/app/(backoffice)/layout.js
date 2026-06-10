import { getProfile } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'
import { AlertTriangle } from 'lucide-react'

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

export default async function BackofficeLayout({ children }) {
  const profile = await getProfile()
  const trialInfo = await getTrialInfo(profile.company_id)

  return (
    <div className="min-h-screen flex bg-[#0f1117]">
      <Sidebar profile={profile} />
      <div className="flex-1 flex flex-col min-w-0">
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
