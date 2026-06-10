'use client'

import { useState } from 'react'
import { Users, Plus, X, Pencil, Trash2, TrendingUp } from 'lucide-react'

const ROLES = [
  { value: 'proprietario', label: 'Proprietário(a)', needsStore: false },
  { value: 'supervisor', label: 'Supervisor(a)', needsStore: true },
  { value: 'gerente', label: 'Gerente', needsStore: true },
  { value: 'atendente', label: 'Atendente', needsStore: true },
]

const roleColors = {
  admin:        'bg-blue-500/10 text-blue-400 border-blue-500/20',
  proprietario: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  supervisor:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  gerente:      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  atendente:    'bg-slate-500/10 text-slate-400 border-slate-500/20',
}

const EMPTY_FORM = { nome: '', email: '', senha: '', role: '', company_id: '', store_id: '' }

export default function UsuariosClient({ usuarios: inicial, empresas, lojas, profile, limiteUsuarios, plano }) {
  const [usuarios, setUsuarios] = useState(inicial)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [showConfirm, setShowConfirm] = useState(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState({ ...EMPTY_FORM, company_id: profile.company_id ?? '', store_id: profile.store_id ?? '' })

  const lojasFiltradas = lojas.filter(l => l.company_id === form.company_id)
  const roleAtual = ROLES.find(r => r.value === form.role)
  const precisaLoja = roleAtual?.needsStore ?? true

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value, ...(name === 'company_id' ? { store_id: '' } : {}) }))
  }

  function openCreate() {
    setEditing(null)
    setForm({ ...EMPTY_FORM, company_id: profile.company_id ?? '', store_id: profile.store_id ?? '' })
    setErro('')
    setShowForm(true)
  }

  function openEdit(u) {
    setEditing(u)
    setForm({
      nome: u.nome ?? '',
      email: '',
      senha: '',
      role: u.role ?? '',
      company_id: u.company_id ?? '',
      store_id: u.store_id ?? '',
    })
    setErro('')
    setShowForm(true)
  }

  const atingiuLimite = limiteUsuarios !== null && usuarios.length >= limiteUsuarios

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!form.nome || !form.role || !form.company_id) {
      setErro('Preencha todos os campos obrigatórios.')
      return
    }
    if (!editing && (!form.email || !form.senha)) {
      setErro('E-mail e senha são obrigatórios para novos usuários.')
      return
    }
    if (!editing && form.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (!editing && atingiuLimite) {
      setErro(`Seu plano ${plano} permite no máximo ${limiteUsuarios} usuários. Faça upgrade para adicionar mais.`)
      return
    }
    if (precisaLoja && !form.store_id) {
      setErro('Selecione uma loja para este perfil.')
      return
    }

    setLoading(true)

    if (editing) {
      const res = await fetch('/api/usuarios', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing.id, nome: form.nome, role: form.role, company_id: form.company_id, store_id: form.store_id }),
      })
      const json = await res.json()
      setLoading(false)
      if (!res.ok) { setErro(json.error || 'Erro ao atualizar.'); return }
      setUsuarios(prev => prev.map(u => u.id === editing.id ? json.usuario : u))
    } else {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      setLoading(false)
      if (!res.ok) { setErro(json.error || 'Erro ao cadastrar.'); return }
      setUsuarios(prev => [json.usuario, ...prev])
    }

    setShowForm(false)
    setEditing(null)
  }

  async function handleDelete(id) {
    const res = await fetch('/api/usuarios', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (!res.ok) { alert('Erro ao excluir usuário.'); return }
    setUsuarios(prev => prev.filter(u => u.id !== id))
    setShowConfirm(null)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Usuários</h1>
          <p className="text-slate-500 text-sm mt-1">
            {usuarios.length} usuário{usuarios.length !== 1 ? 's' : ''} cadastrado{usuarios.length !== 1 ? 's' : ''}
            {limiteUsuarios !== null && (
              <span className="ml-2 text-xs text-slate-600">
                ({usuarios.length}/{limiteUsuarios} no plano {plano})
              </span>
            )}
          </p>
        </div>
        <button onClick={openCreate} disabled={atingiuLimite}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          <Plus size={16} />
          Novo usuário
        </button>
      </div>

      {/* Banner de limite atingido */}
      {atingiuLimite && (
        <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp size={18} className="text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-300">Limite do plano {plano} atingido</p>
              <p className="text-xs text-amber-400/70 mt-0.5">Você usou {usuarios.length} de {limiteUsuarios} usuário{limiteUsuarios > 1 ? 's' : ''} disponíveis.</p>
            </div>
          </div>
          <a href="/planos"
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition flex-shrink-0">
            <TrendingUp size={13} />
            Fazer upgrade
          </a>
        </div>
      )}

      {/* Modal criar/editar */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#151820] border border-white/10 rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{editing ? 'Editar usuário' : 'Novo usuário'}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-400">Nome *</label>
                <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome completo"
                  className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
              </div>

              {!editing && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-400">E-mail *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="usuario@empresa.com"
                      className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-400">Senha *</label>
                    <input name="senha" type="password" value={form.senha} onChange={handleChange} placeholder="Mínimo 6 caracteres"
                      className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                  </div>
                </>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-400">Perfil *</label>
                <select name="role" value={form.role} onChange={handleChange}
                  className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                  <option value="">Selecione…</option>
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-400">Empresa *</label>
                <select name="company_id" value={form.company_id} onChange={handleChange}
                  disabled={!!profile.company_id}
                  className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50">
                  <option value="">Selecione…</option>
                  {empresas.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>

              {precisaLoja && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-400">Loja *</label>
                  <select name="store_id" value={form.store_id} onChange={handleChange}
                    disabled={!!profile.store_id}
                    className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50">
                    <option value="">Selecione…</option>
                    {lojasFiltradas.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
                  </select>
                </div>
              )}

              {erro && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{erro}</p>}

              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-white/10 text-slate-400 hover:text-white rounded-xl py-2.5 text-sm transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors">
                  {loading ? 'Salvando...' : editing ? 'Salvar alterações' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal confirmação exclusão */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#151820] border border-white/10 rounded-2xl w-full max-w-sm p-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center">
                <Trash2 size={20} className="text-rose-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Excluir usuário?</h3>
                <p className="text-slate-500 text-sm mt-1">O acesso deste usuário será revogado imediatamente. Essa ação não pode ser desfeita.</p>
              </div>
              <div className="flex gap-3 w-full">
                <button onClick={() => setShowConfirm(null)}
                  className="flex-1 border border-white/10 text-slate-400 hover:text-white rounded-xl py-2.5 text-sm transition-colors">
                  Cancelar
                </button>
                <button onClick={() => handleDelete(showConfirm)}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors">
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista */}
      {usuarios.length === 0 ? (
        <div className="bg-[#151820] border border-white/5 rounded-2xl p-12 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center">
            <Users size={22} className="text-slate-500" />
          </div>
          <p className="text-slate-400 font-medium">Nenhum usuário cadastrado</p>
          <p className="text-slate-600 text-sm">Clique em &quot;Novo usuário&quot; para começar</p>
        </div>
      ) : (
        <div className="bg-[#151820] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-medium text-slate-500 px-6 py-4">Usuário</th>
                <th className="text-left text-xs font-medium text-slate-500 px-6 py-4">Perfil</th>
                <th className="text-left text-xs font-medium text-slate-500 px-6 py-4 hidden sm:table-cell">Empresa</th>
                <th className="text-left text-xs font-medium text-slate-500 px-6 py-4 hidden md:table-cell">Loja</th>
                <th className="text-right text-xs font-medium text-slate-500 px-6 py-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, i) => (
                <tr key={u.id} className={`${i !== usuarios.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/[0.02] transition-colors`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0">
                        {u.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <p className="text-sm font-medium text-white">{u.nome}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${roleColors[u.role] ?? roleColors.atendente}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell text-sm text-slate-400">{u.companies?.nome ?? '–'}</td>
                  <td className="px-6 py-4 hidden md:table-cell text-sm text-slate-400">{u.stores?.nome ?? '–'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(u)}
                        className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setShowConfirm(u.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
