'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Building2, Plus, X } from 'lucide-react'

export default function EmpresasClient({ empresas: inicial }) {
  const [empresas, setEmpresas] = useState(inicial)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState({ nome: '', cnpj: '', email: '', responsavel: '', telefone: '' })

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!form.nome || !form.responsavel || !form.email) {
      setErro('Nome, responsável e e-mail são obrigatórios.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from('companies')
      .insert({ ...form })
      .select()
      .single()

    setLoading(false)

    if (error) {
      setErro('Erro ao cadastrar empresa.')
      return
    }

    setEmpresas(prev => [data, ...prev])
    setForm({ nome: '', cnpj: '', email: '', responsavel: '', telefone: '' })
    setShowForm(false)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Empresas</h1>
          <p className="text-slate-500 text-sm mt-1">{empresas.length} empresa{empresas.length !== 1 ? 's' : ''} cadastrada{empresas.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} />
          Nova empresa
        </button>
      </div>

      {/* Modal de cadastro */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#151820] border border-white/10 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Nova empresa</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {[
                { name: 'nome', label: 'Nome *', placeholder: 'Razão social' },
                { name: 'cnpj', label: 'CNPJ', placeholder: '00.000.000/0001-00' },
                { name: 'responsavel', label: 'Responsável *', placeholder: 'Nome do responsável' },
                { name: 'email', label: 'E-mail *', placeholder: 'contato@empresa.com', type: 'email' },
                { name: 'telefone', label: 'Telefone', placeholder: '(11) 99999-9999' },
              ].map(field => (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-400">{field.label}</label>
                  <input
                    name={field.name}
                    type={field.type || 'text'}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              ))}

              {erro && (
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  {erro}
                </p>
              )}

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-white/10 text-slate-400 hover:text-white rounded-xl py-2.5 text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista */}
      {empresas.length === 0 ? (
        <div className="bg-[#151820] border border-white/5 rounded-2xl p-12 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center">
            <Building2 size={22} className="text-slate-500" />
          </div>
          <p className="text-slate-400 font-medium">Nenhuma empresa cadastrada</p>
          <p className="text-slate-600 text-sm">Clique em "Nova empresa" para começar</p>
        </div>
      ) : (
        <div className="bg-[#151820] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-medium text-slate-500 px-6 py-4">Empresa</th>
                <th className="text-left text-xs font-medium text-slate-500 px-6 py-4 hidden sm:table-cell">Responsável</th>
                <th className="text-left text-xs font-medium text-slate-500 px-6 py-4 hidden md:table-cell">E-mail</th>
                <th className="text-left text-xs font-medium text-slate-500 px-6 py-4 hidden lg:table-cell">Telefone</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((e, i) => (
                <tr key={e.id} className={`${i !== empresas.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/[0.02] transition-colors`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 size={14} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{e.nome}</p>
                        {e.cnpj && <p className="text-xs text-slate-500">{e.cnpj}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell text-sm text-slate-300">{e.responsavel}</td>
                  <td className="px-6 py-4 hidden md:table-cell text-sm text-slate-400">{e.email}</td>
                  <td className="px-6 py-4 hidden lg:table-cell text-sm text-slate-400">{e.telefone || '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
