'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { BarChart3 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })

    if (error) {
      setErro('E-mail ou senha inválidos.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex bg-[#0f1117]">
      {/* Painel esquerdo decorativo */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0a0d14] border-r border-white/5 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <BarChart3 size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg">NPS Backoffice</span>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span className="text-blue-400 text-xs font-medium">Sistema de gestão NPS</span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Monitore a satisfação dos seus clientes em tempo real.
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Gerencie empresas, lojas e equipes com controle total de acesso e hierarquia.
          </p>
        </div>

        <p className="text-slate-600 text-xs">© {new Date().getFullYear()} NPS Backoffice</p>
      </div>

      {/* Formulário */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 size={15} className="text-white" />
            </div>
            <span className="font-bold text-white">NPS Backoffice</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Entrar</h1>
          <p className="text-slate-500 text-sm mb-8">Acesse com seu e-mail e senha</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="exemplo@empresa.com"
                className="bg-[#151820] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
                placeholder="••••••••"
                className="bg-[#151820] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {erro && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl py-3 text-sm transition-colors"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
