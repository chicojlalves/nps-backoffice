'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { BarChart3, Eye, EyeOff } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [showSenha, setShowSenha] = useState(false)

  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    nomeEmpresa: '',
  })

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErro('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErro('')

    try {
      // 1. Cria conta + empresa via API
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setErro(data.error || 'Erro ao criar conta.')
        setLoading(false)
        return
      }

      // 2. Faz login automaticamente
      const supabase = createClient()
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.senha,
      })

      if (loginError) {
        setErro('Conta criada! Faça login para continuar.')
        router.push('/login')
        return
      }

      // 3. Redireciona para escolha de plano
      router.push('/planos')
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <BarChart3 size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">NPS Backoffice</span>
        </div>

        {/* Card */}
        <div className="bg-[#1a1d27] rounded-2xl p-8 ring-1 ring-white/10">

          {/* Steps */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">1</div>
              <span className="text-xs font-medium text-indigo-400">Sua conta</span>
            </div>
            <div className="flex-1 h-px bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-slate-500">2</div>
              <span className="text-xs text-slate-500">Plano</span>
            </div>
            <div className="flex-1 h-px bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-slate-500">3</div>
              <span className="text-xs text-slate-500">Primeira loja</span>
            </div>
          </div>

          <h1 className="text-xl font-bold text-white mb-1">Crie sua conta</h1>
          <p className="text-slate-400 text-sm mb-6">Comece grátis, sem cartão de crédito.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Seu nome</label>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="João Silva"
                required
                className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Nome da empresa</label>
              <input
                type="text"
                name="nomeEmpresa"
                value={form.nomeEmpresa}
                onChange={handleChange}
                placeholder="Minha Rede de Lojas"
                required
                className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">E-mail</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="joao@empresa.com"
                required
                className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={showSenha ? 'text' : 'password'}
                  name="senha"
                  value={form.senha}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                  className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {erro && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? 'Criando conta...' : 'Criar conta e escolher plano →'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-indigo-400 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
