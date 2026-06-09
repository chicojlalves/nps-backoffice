import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
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

  // Pega a URL base dos headers da requisição — funciona em qualquer ambiente
  const headersList = await headers()
  const host = headersList.get('host')
  const proto = headersList.get('x-forwarded-proto') ?? 'https'
  const baseUrl = `${proto}://${host}`

  const pesquisaUrl = `${baseUrl}/pesquisa?store=${store_id}&company=${company_id}`

  return (
    <QrCodeClient
      loja={loja}
      pesquisaUrl={pesquisaUrl}
    />
  )
}
