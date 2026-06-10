'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Store, Plus, X, QrCode, ExternalLink, Pencil, Trash2, TrendingUp } from 'lucide-react'

const EMPTY = { nome: '', company_id: '' }

export default function LojasClient({ lojas: inicial, empresas, profile, limiteLojas, plano }) {
  const [lojas, setLojas] = useState(inicial)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [showConfirm, setShowConfirm] = useState(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState({ nome: '', company_id: profile.company_id ?? '' })

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function openCreate() {
    setEditing(null)
    setForm({ nome: '', company_id: profile.company_id ?? '' })
    setErro('')
    setShowForm(true)
  }

  function openEdit(loja) {
    setEditing(loja)
    setForm({ nome: loja.nome, company_id: loja.company_id })
    setErro('')
    setShowForm(true)
  }

  const atingiuLimite = limiteLojas !== null && lojas.length >= limiteLojas

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!form.nome || !form.company_id) {
      setErro('Nome e empresa são obrigatórios.')
      return
    }

    if (!editing && atingiuLimite) {
      setErro(`Seu plano ${plano} permite no máximo ${limiteLojas} loja${limiteLojas > 1 ? 's' : ''}. Faça upgrade para adicionar mais.`)
      return
    }

    setLoading(true)
    const supabase = createClient()

    if (editing) {
      const { data, error } = await supabase
        .from('stores')
        .update({ nome: form.nome, company_id: form.company_id })
        .eq('id', editing.id)
        .select('*, companies(nome)')
        .single()

      setLoading(false)
      if (error) { setErro('Erro ao atualizar loja.'); return }
      setLojas(prev => prev.map(l => l.id === editing.id ? data : l))
    } else {
      const { data, error } = await supabase
        .from('stores')
        .insert({ nome: form.nome, company_id: form.company_id })
        .select('*, companies(nome)')
        .single()

      setLoading(false)
      if (error) { setErro('Erro ao cadastrar loja.'); return }
      setLojas(prev => [data, ...prev])
    }

    setShowForm(false)
    setEditing(null)
  }

  async function handleDelete(id) {
    const supabase = createClient()
    const { error } = await supabase.from('stores').delete().eq('id', id)
    if (error) { alert('Erro ao excluir loja.'); return }
    setLojas(prev => prev.filter(l => l.id !== id))
    setShowConfirm(null)
  }

  function qrUrl(loja) {
    return `/pesquisa?store=${loja.id}&company=${loja.company_id}`
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Lojas</h1>
          <p className="text-slate-500 text-sm mt-1">
            {lojas.length} loja{lojas.length !== 1 ? 's' : ''} cadastrada{lojas.length !== 1 ? 's' : ''}
            {limiteLojas !== null ? (
              <span className="ml-2 text-xs text-slate-600">
                ({lojas.length}/{limiteLojas} no plano {plano})
              </span>
            ) : (
              <span className="ml-2 text-xs text-slate-600">
                (plano {plano} — ilimitado)
              </span>
            )}
          </p>
        </div>
        <button onClick={openCreate} disabled={atingiuLimite}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          <Plus size={16} />
          Nova loja
        </button>
      </div>

      {/* Banner de limite atingido */}
      {atingiuLimite && (
        <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp size={18} className="text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-300">Limite do plano {plano} atingido</p>
              <p className="text-xs text-amber-400/70 mt-0.5">Você usou {lojas.length} de {limiteLojas} loja{limiteLojas > 1 ? 's' : ''} disponíveis.</p>
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
          <div className="bg-[#151820] border border-white/10 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{editing ? 'Editar loja' : 'Nova loja'}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-400">Empresa *</label>
                <select name="company_id" value={form.company_id} onChange={handleChange}
                  disabled={!!profile.company_id}
                  className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50">
                  <option value="">Selecione…</option>
                  {empresas.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-400">Nome da loja *</label>
                <input name="nome" value={form.nome} onChange={handleChange}
                  placeholder="Ex: Unidade Centro"
                  className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
              </div>

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
                <h3 className="text-white font-bold text-lg">Excluir loja?</h3>
                <p className="text-slate-500 text-sm mt-1">Todas as respostas vinculadas também serão excluídas. Essa ação não pode ser desfeita.</p>
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
      {lojas.length === 0 ? (
        <div className="bg-[#151820] border border-white/5 rounded-2xl p-12 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center">
            <Store size={22} className="text-slate-500" />
          </div>
          <p className="text-slate-400 font-medium">Nenhuma loja cadastrada</p>
          <p className="text-slate-600 text-sm">Clique em &quot;Nova loja&quot; para começar</p>
        </div>
      ) : (
        <div className="bg-[#151820] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-medium text-slate-500 px-6 py-4">Loja</th>
                <th className="text-left text-xs font-medium text-slate-500 px-6 py-4 hidden sm:table-cell">Empresa</th>
                <th className="text-center text-xs font-medium text-slate-500 px-6 py-4">QR Code</th>
                <th className="text-center text-xs font-medium text-slate-500 px-6 py-4 hidden md:table-cell">Pesquisa</th>
                <th className="text-right text-xs font-medium text-slate-500 px-6 py-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lojas.map((l, i) => (
                <tr key={l.id} className={`${i !== lojas.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/[0.02] transition-colors`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Store size={14} className="text-violet-400" />
                      </div>
                      <p className="text-sm font-medium text-white">{l.nome}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell text-sm text-slate-400">{l.companies?.nome ?? '–'}</td>
                  <td className="px-6 py-4 text-center">
                    <a href={`/qrcode?store=${l.id}&company=${l.company_id}`} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors">
                      <QrCode size={13} />
                      QR Code
                    </a>
                  </td>
                  <td className="px-6 py-4 text-center hidden md:table-cell">
                    <a href={qrUrl(l)} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                      <ExternalLink size={13} />
                      Ver pesquisa
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(l)}
                        className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setShowConfirm(l.id)}
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
