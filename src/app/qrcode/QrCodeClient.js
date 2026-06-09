'use client'

import { useEffect, useRef } from 'react'
import { BarChart3, Download, ExternalLink, Printer } from 'lucide-react'
import QRCode from 'qrcode'

export default function QrCodeClient({ loja, pesquisaUrl }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, pesquisaUrl, {
        width: 280,
        margin: 2,
        color: { dark: '#0f1117', light: '#ffffff' },
      })
    }
  }, [pesquisaUrl])

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `qrcode-${loja?.nome ?? 'loja'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  function handlePrint() {
    window.print()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1117] p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-10">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 size={15} className="text-white" />
          </div>
          <span className="font-bold text-white">NPS</span>
        </div>

        <div className="bg-[#151820] border border-white/5 rounded-2xl p-8 flex flex-col items-center gap-6">
          {/* Info da loja */}
          <div className="text-center">
            <p className="text-xs text-slate-500 mb-1">{loja?.companies?.nome}</p>
            <h1 className="text-lg font-bold text-white">{loja?.nome}</h1>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-2xl p-4">
            <canvas ref={canvasRef} />
          </div>

          <p className="text-slate-500 text-xs text-center leading-relaxed">
            Escaneie o QR Code para responder a pesquisa de satisfação
          </p>

          {/* Ações */}
          <div className="flex flex-col gap-2 w-full print:hidden">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl py-3 text-sm transition-colors"
            >
              <Download size={16} />
              Baixar imagem
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 bg-[#0f1117] border border-white/10 text-slate-300 hover:text-white rounded-xl py-3 text-sm transition-colors"
            >
              <Printer size={16} />
              Imprimir
            </button>
            <a
              href={pesquisaUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 text-slate-500 hover:text-slate-300 text-sm transition-colors py-1"
            >
              <ExternalLink size={14} />
              Abrir pesquisa
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
