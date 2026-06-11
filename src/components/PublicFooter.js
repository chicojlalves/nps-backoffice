import Link from 'next/link'
import { BarChart3 } from 'lucide-react'

export default function PublicFooter() {
  return (
    <footer className="border-t border-white/5 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
              <BarChart3 size={13} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-white">VozCX</span>
          </Link>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
            <Link href="/conheca-vozcx" className="text-slate-500 hover:text-white text-sm transition">
              Conheça a VozCX
            </Link>
            <Link href="/#planos" className="text-slate-500 hover:text-white text-sm transition">
              Planos
            </Link>
            <Link href="/contato" className="text-slate-500 hover:text-white text-sm transition">
              Contato
            </Link>
            <Link href="/termos-de-uso" className="text-slate-500 hover:text-white text-sm transition">
              Termos de Uso
            </Link>
            <Link href="/politica-de-privacidade" className="text-slate-500 hover:text-white text-sm transition">
              Política de Privacidade
            </Link>
          </div>
          <Link
            href="/onboarding"
            className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg transition"
          >
            Começar grátis
          </Link>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="text-slate-500 text-sm">Fundada no Brasil.</p>
            <p className="text-slate-600 text-xs mt-0.5">Desenvolvida por quem acredita que a tecnologia deve aproximar empresas e clientes.</p>
          </div>
          <p className="text-slate-600 text-xs">© {new Date().getFullYear()} VozCX. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
