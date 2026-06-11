'use client'

import { useState } from 'react'
import { Zap, Loader2 } from 'lucide-react'

export default function DemoButton() {
  const [loading, setLoading] = useState(false)

  function handleClick() {
    setLoading(true)
    window.location.href = '/api/auth/demo'
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-medium px-6 py-3 rounded-xl transition text-sm border border-white/10 disabled:opacity-70 disabled:cursor-wait"
    >
      {loading ? (
        <>
          <Loader2 size={15} className="animate-spin text-indigo-400" />
          Criando sua demonstração...
        </>
      ) : (
        <>
          <Zap size={15} className="text-indigo-400" />
          Ver demonstração
        </>
      )}
    </button>
  )
}
