import { createClient } from '@/lib/supabase/server'
import QrCodeClient from './QrCodeClient'

export default async function QrCodePage({ searchParams }) {
  const params = await searchParams
  const store_id = params?.store ?? null
  const company_id = params?.company ?? null

  if (!store_id || !company_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1117]">
        <p className="text-slate-500 text-sm">Link inválido.</p>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: loja } = await supabase
    .from('stores')
    .select('nome, companies(nome)')
    .eq('id', store_id)
    .single()

  const pesquisaUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pesquisa?store=${store_id}&company=${company_id}`

  return (
    <QrCodeClient
      loja={loja}
      pesquisaUrl={pesquisaUrl}
    />
  )
}
