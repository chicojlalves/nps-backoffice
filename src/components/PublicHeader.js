import Link from 'next/link'
import { BarChart3 } from 'lucide-react'

export default function PublicHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f1117]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <BarChart3 size={20} className="text-white" />
          </div>
          <span className="font-bold text-white text-lg">VozCX</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/conheca-vozcx" className="text-sm text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-white/5">
            Conheça a VozCX
          </Link>
          <Link href="/#funcionalidades" className="text-sm text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-white/5">
            Funcionalidades
          </Link>
          <Link href="/#planos" className="text-sm text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-white/5">
            Planos
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="text-sm text-slate-400 hover:text-white border border-white/10 hover:border-white/20 px-4 py-2 rounded-lg transition">
            Entrar
          </Link>
          <Link href="/onboarding" className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg transition">
            Começar grátis
          </Link>
        </div>
      </div>
    </header>
  )
}
