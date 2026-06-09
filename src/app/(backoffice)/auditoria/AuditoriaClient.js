'use client'

import { useState } from 'react'
import { ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react'

const actionLabels = {
  INSERT:      { label: 'Criou registro',   color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  UPDATE:      { label: 'Alterou registro', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  DELETE:      { label: 'Excluiu registro', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  CREATE_USER: { label: 'Criou usuário',    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  DELETE_USER: { label: 'Excluiu usuário',  color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
}

const tableLabels = {
  profiles:  'Usuários',
  companies: 'Empresas',
  stores:    'Lojas',
}

function Diff({ oldData, newData }) {
  if (!oldData && !newData) return null

  const IGNORE = ['id', 'created_at', 'updated_at']

  if (oldData && newData) {
    const changed = Object.keys(newData).filter(
      k => !IGNORE.includes(k) && JSON.stringify(newData[k]) !== JSON.stringify(oldData[k])
    )
    if (!changed.length) return <span className="text-slate-600 text-xs">Sem alterações visíveis</span>
    return (
      <div className="flex flex-col gap-1 mt-1">
        {changed.map(k => (
          <div key={k} className="text-xs flex gap-2 flex-wrap">
            <span className="text-slate-500 font-medium">{k}:</span>
            <span className="text-rose-400 line-through">{String(oldData[k] ?? '–')}</span>
            <span className="text-slate-400">→</span>
            <span className="text-emerald-400">{String(newData[k] ?? '–')}</span>
          </div>
        ))}
      </div>
    )
  }

  const data = newData ?? oldData
  const keys = Object.keys(data).filter(k => !IGNORE.includes(k))
  return (
    <div className="flex flex-col gap-1 mt-1">
      {keys.map(k => (
        <div key={k} className="text-xs flex gap-2 flex-wrap">
          <span className="text-slate-500 font-medium">{k}:</span>
          <span className="text-slate-300">{String(data[k] ?? '–')}</span>
        </div>
      ))}
    </div>
  )
}

function LogRow({ log }) {
  const [open, setOpen] = useState(false)
  const action = actionLabels[log.action] ?? { label: log.action, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' }
  const hasDetails = log.old_data || log.new_data

  return (
    <div className="border-b border-white/5 last:border-0">
      <div
        className={`px-6 py-4 flex items-start gap-4 ${hasDetails ? 'cursor-pointer hover:bg-white/[0.02]' : ''} transition-colors`}
        onClick={() => hasDetails && setOpen(o => !o)}
      >
        {/* Data */}
        <div className="text-xs text-slate-500 whitespace-nowrap w-32 flex-shrink-0 pt-0.5">
          {new Date(log.created_at).toLocaleString('pt-BR', { hour12: false })}
        </div>

        {/* Usuário */}
        <div className="flex-shrink-0 w-28 hidden sm:block">
          <p className="text-sm text-slate-300 truncate">{log.user_nome ?? '–'}</p>
        </div>

        {/* Ação + tabela */}
        <div className="flex-1 flex flex-wrap items-center gap-2">
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${action.color}`}>
            {action.label}
          </span>
          {log.table_name && (
            <span className="text-xs text-slate-500">
              em <span className="text-slate-400">{tableLabels[log.table_name] ?? log.table_name}</span>
            </span>
          )}
        </div>

        {/* Expandir */}
        {hasDetails && (
          <div className="flex-shrink-0 text-slate-600">
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        )}
      </div>

      {/* Detalhes expandidos */}
      {open && hasDetails && (
        <div className="px-6 pb-4 ml-32">
          <div className="bg-[#0f1117] border border-white/5 rounded-xl p-4">
            <Diff oldData={log.old_data} newData={log.new_data} />
          </div>
        </div>
      )}
    </div>
  )
}

export default function AuditoriaClient({ logs }) {
  const [search, setSearch] = useState('')

  const filtered = logs.filter(l => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (l.user_nome ?? '').toLowerCase().includes(q) ||
      (l.action ?? '').toLowerCase().includes(q) ||
      (l.table_name ?? '').toLowerCase().includes(q)
    )
  })

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Auditoria</h1>
          <p className="text-slate-500 text-sm mt-1">Histórico de ações no sistema</p>
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por usuário ou ação…"
          className="bg-[#151820] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-[#151820] border border-white/5 rounded-2xl p-12 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={22} className="text-slate-500" />
          </div>
          <p className="text-slate-400 font-medium">Nenhum registro encontrado</p>
          <p className="text-slate-600 text-sm">As ações do sistema aparecerão aqui</p>
        </div>
      ) : (
        <div className="bg-[#151820] border border-white/5 rounded-2xl overflow-hidden">
          {/* Cabeçalho */}
          <div className="px-6 py-3 border-b border-white/5 hidden sm:flex items-center gap-4">
            <span className="text-xs font-medium text-slate-500 w-32 flex-shrink-0">Data</span>
            <span className="text-xs font-medium text-slate-500 w-28 flex-shrink-0">Usuário</span>
            <span className="text-xs font-medium text-slate-500 flex-1">Ação</span>
          </div>
          {filtered.map(log => <LogRow key={log.id} log={log} />)}
        </div>
      )}

      {filtered.length > 0 && (
        <p className="text-xs text-slate-600 text-center mt-4">
          Mostrando {filtered.length} de {logs.length} registros
        </p>
      )}
    </div>
  )
}
