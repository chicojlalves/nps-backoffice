'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Lock, CheckCircle } from 'lucide-react'

const roleColors = {
  admin:        'bg-blue-500/10 text-blue-400 border-blue-500/20',
  proprietario: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  supervisor:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  gerente:      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  atendente:    'bg-slate-500/10 text-slate-400 border-slate-500/20',
}

export default function PerfilClient({ profile }) {
  const initials = profile.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()

  const [nome, setNome] = useState(profile.nome)
  const [loadingNome, setLoadingNome] = useState(false)
  const [successNome, setSuccessNome] = useState(false)
  const [erroNome, setErroNome] = useState('')

  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmaSenha, setConfirmaSenha] = useState('')
  const [loadingSenha, setLoadingSenha] = useState(false)
  const [successSenha, setSuccessSenha] = useState(false)
  const [erroSenha, setErroSenha] = useState('')

  async function handleSaveNome(e) {
    e.preventDefault()
    setErroNome('')
    setSuccessNome(false)

    if (!nome.trim() || nome.trim().length < 2) {
      setErroNome('Nome deve ter pelo menos 2 caracteres.')
      return
    }

    setLoadingNome(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ nome: nome.trim() })
      .eq('id', profile.id)

    setLoadingNome(false)
    if (error) { setErroNome('Erro ao atualizar nome.'); return }
    setSuccessNome(true)
    setTimeout(() => setSuccessNome(false), 3000)
  }

  async function handleSaveSenha(e) {
    e.preventDefault()
    setErroSenha('')
    setSuccessSenha(false)

    if (!senhaAtual || !novaSenha || !confirmaSenha) {
      setErroSenha('Preencha todos os campos.')
      return
    }
    if (novaSenha.length < 6) {
      setErroSenha('A nova senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (novaSenha !== confirmaSenha) {
      setErroSenha('As senhas não coincidem.')
      return
    }

    setLoadingSenha(true)
    const supabase = createClient()

    // Reautentica para verificar a senha atual
    const { data: { user } } = await supabase.auth.getUser()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: senhaAtual,
    })

    if (signInError) {
      setLoadingSenha(false)
      setErroSenha('Senha atual incorreta.')
      return
    }

    const { error } = await supabase.auth.updateUser({ password: novaSenha })
    setLoadingSenha(false)

    if (error) { setErroSenha('Erro ao atualizar senha.'); return }
    setSuccessSenha(true)
    setSenhaAtual('')
    setNovaSenha('')
    setConfirmaSenha('')
    setTimeout(() => setSuccessSenha(false), 3000)
  }

  return (
    <div className="max-w-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Meu perfil</h1>
        <p className="text-slate-500 text-sm mt-1">Gerencie suas informações pessoais e senha</p>
      </div>

      {/* Avatar + info */}
      <div className="bg-[#151820] border border-white/5 rounded-2xl p-6 flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center text-lg font-bold text-slate-200 flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-white text-lg">{profile.nome}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border capitalize ${roleColors[profile.role] ?? roleColors.atendente}`}>
              {profile.role}
            </span>
            {profile.companies?.nome && (
              <span className="text-xs text-slate-500">{profile.companies.nome}</span>
            )}
            {profile.stores?.nome && (
              <span className="text-xs text-slate-600">· {profile.stores.nome}</span>
            )}
          </div>
        </div>
      </div>

      {/* Alterar nome */}
      <div className="bg-[#151820] border border-white/5 rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-2 mb-5">
          <User size={16} className="text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-300">Alterar nome</h2>
        </div>

        <form onSubmit={handleSaveNome} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400">Nome completo</label>
            <input
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Seu nome"
              className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {erroNome && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{erroNome}</p>
          )}

          {successNome && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
              <CheckCircle size={15} />
              Nome atualizado com sucesso!
            </div>
          )}

          <button type="submit" disabled={loadingNome || nome.trim() === profile.nome}
            className="self-start bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition-colors">
            {loadingNome ? 'Salvando...' : 'Salvar nome'}
          </button>
        </form>
      </div>

      {/* Alterar senha */}
      <div className="bg-[#151820] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Lock size={16} className="text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-300">Alterar senha</h2>
        </div>

        <form onSubmit={handleSaveSenha} className="flex flex-col gap-4">
          {[
            { label: 'Senha atual', value: senhaAtual, set: setSenhaAtual },
            { label: 'Nova senha', value: novaSenha, set: setNovaSenha, hint: 'Mínimo 6 caracteres' },
            { label: 'Confirmar nova senha', value: confirmaSenha, set: setConfirmaSenha },
          ].map(({ label, value, set, hint }) => (
            <div key={label} className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400">{label}</label>
              <input
                type="password"
                value={value}
                onChange={e => set(e.target.value)}
                placeholder={hint ?? '••••••••'}
                className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          ))}

          {erroSenha && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{erroSenha}</p>
          )}

          {successSenha && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
              <CheckCircle size={15} />
              Senha atualizada com sucesso!
            </div>
          )}

          <button type="submit" disabled={loadingSenha}
            className="self-start bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition-colors">
            {loadingSenha ? 'Salvando...' : 'Alterar senha'}
          </button>
        </form>
      </div>
    </div>
  )
}
