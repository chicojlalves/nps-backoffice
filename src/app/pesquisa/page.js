import { createClient } from '@/lib/supabase/server'
import PesquisaClient from './PesquisaClient'

export default async function PesquisaPage({ searchParams }) {
  const params = await searchParams
  const store_id = params?.store ?? null
  const company_id = params?.company ?? null

  if (!store_id || !company_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1117]">
        <p className="text-slate-500 text-sm">Link inválido. Solicite um novo QR Code.</p>
      </div>
    )
  }

  const supabase = await createClient()

  // Busca atendentes da loja
  const { data: atendentes } = await supabase
    .from('profiles')
    .select('id, nome')
    .eq('store_id', store_id)
    .eq('role', 'atendente')
    .order('nome')

  return (
    <PesquisaClient
      store_id={store_id}
      company_id={company_id}
      atendentes={atendentes ?? []}
    />
  )
}
