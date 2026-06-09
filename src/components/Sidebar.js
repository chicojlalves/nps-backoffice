'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { canManageCompanies, canManageStores, canManageUsers } from '@/lib/permissions'
import {
  LayoutDashboard,
  Building2,
  Store,
  Users,
  LogOut,
  BarChart3,
} from 'lucide-react'

export default function Sidebar({ profile }) {
  const pathname = usePathname()
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, show: true },
    { href: '/empresas', label: 'Empresas', icon: Building2, show: canManageCompanies(profile.role) },
    { href: '/lojas', label: 'Lojas', icon: Store, show: canManageStores(profile.role) },
    { href: '/usuarios', label: 'Usuários', icon: Users, show: canManageUsers(profile.role) },
  ].filter(l => l.show)

  const initials = profile.nome
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <aside
      className={`relative flex flex-col bg-[#0a0d14] border-r border-white/5 transition-all duration-300 ease-in-out ${
        expanded ? 'w-56' : 'w-16'
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5 overflow-hidden">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <BarChart3 size={16} className="text-white" />
        </div>
        <span className={`font-bold text-white whitespace-nowrap transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
          NPS
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-2 py-2.5 rounded-lg transition-colors overflow-hidden ${
                active
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span className={`text-sm font-medium whitespace-nowrap transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/5 p-2 flex flex-col gap-1">
        <div className="flex items-center gap-3 px-2 py-2 overflow-hidden">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
            {initials}
          </div>
          <div className={`flex flex-col min-w-0 transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-xs font-semibold text-slate-200 truncate">{profile.nome}</span>
            <span className="text-xs text-slate-500 capitalize">{profile.role}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-2 py-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors overflow-hidden"
        >
          <LogOut size={18} className="flex-shrink-0" />
          <span className={`text-sm whitespace-nowrap transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
            Sair
          </span>
        </button>
      </div>
    </aside>
  )
}
