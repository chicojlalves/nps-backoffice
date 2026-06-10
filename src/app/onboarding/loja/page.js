'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BarChart3, Store, QrCode, ArrowRight, Check } from 'lucide-react'

export default function OnboardingLojaPage() {
  const router = useRouter()
  const [nomeLoja, setNomeLoja] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [lojaCriada, setLojaCriada] = useState(null)
  const [qrUrl, setQrUrl] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!nomeLoja.trim()) {
      setErro('Digite o nome da loja.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    // Busca company_id do usuário logado
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single()

    if (!profile?.company_id) {
      setErro('Empresa não encontrada. Contate o suporte.')
      setLoading(false)
      return
    }

    // Cria a loja
    const { data: loja, error } = await supabase
      .from('stores')
      .insert({ nome: nomeLoja.trim(), company_id: profile.company_id })
      .select('id, nome, company_id')
      .single()

    setLoading(false)

    if (error) {
      setErro('Erro ao criar loja. Tente novamente.')
      return
    }

    const url = `${window.location.origin}/pesquisa?store=${loja.id}&company=${loja.company_id}`
    setLojaCriada(loja)
    setQrUrl(url)
  }

  function irParaDashboard() {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <BarChart3 size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">VozCX</span>
        </div>

        {/* Card */}
        <div className="bg-[#1a1d27] rounded-2xl p-8 ring-1 ring-white/10">

          {/* Steps */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-600 flex items-center justify-center">
                <Check size={14} className="text-indigo-400" />
              </div>
              <span className="text-xs text-indigo-400">Conta</span>
            </div>
            <div className="flex-1 h-px bg-indigo-600/40" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-600 flex items-center justify-center">
                <Check size={14} className="text-indigo-400" />
              </div>
              <span className="text-xs text-indigo-400">Plano</span>
            </div>
            <div className="flex-1 h-px bg-indigo-600/40" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">3</div>
              <span className="text-xs font-medium text-indigo-400">Primeira loja</span>
            </div>
          </div>

          {!lojaCriada ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center">
                  <Store size={20} className="text-indigo-400" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Crie sua primeira loja</h1>
                  <p className="text-slate-400 text-xs">Você poderá adicionar mais depois.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Nome da loja
                  </label>
                  <input
                    type="text"
                    value={nomeLoja}
                    onChange={e => { setNomeLoja(e.target.value); setErro('') }}
                    placeholder="Ex: Loja Centro, Unidade SP, Filial 01"
                    required
                    className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {erro && (
                  <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {erro}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? 'Criando...' : (
                    <>Criar loja e gerar QR Code <ArrowRight size={16} /></>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Loja criada com sucesso */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check size={24} className="text-green-400" />
                </div>
                <h1 className="text-lg font-bold text-white mb-1">Tudo pronto! 🎉</h1>
                <p className="text-slate-400 text-sm">
                  Loja <span className="text-white font-medium">{lojaCriada.nome}</span> criada com sucesso.
                </p>
              </div>

              {/* QR Code */}
              <div className="bg-[#0f1117] rounded-xl p-4 mb-4 border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <QrCode size={16} className="text-indigo-400" />
                  <span className="text-xs font-medium text-slate-300">Link da pesquisa</span>
                </div>
                <p className="text-xs text-slate-500 break-all mb-3">{qrUrl}</p>
                <a
                  href={`/qrcode?store=${lojaCriada.id}&company=${lojaCriada.company_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-600/30 font-medium py-2 rounded-lg text-sm transition flex items-center justify-center gap-2"
                >
                  <QrCode size={15} /> Ver e imprimir QR Code
                </a>
              </div>

              <button
                onClick={irParaDashboard}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg text-sm transition cursor-pointer flex items-center justify-center gap-2"
              >
                Ir para o dashboard <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
