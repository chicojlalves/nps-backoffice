'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { canManageCompanies, canManageStores, canManageUsers, canViewAuditoria } from '@/lib/permissions'
import {
  LayoutDashboard, Building2, Store, Users,
  LogOut, BarChart3, Menu, X, UserCircle, ShieldCheck,
} from 'lucide-react'

function NavLinks({ links, pathname, onClick }) {
  return (
    <>
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href
        return (
          <Link key={href} href={href} onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              active ? 'bg-blue-600/20 text-blue-400' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
            }`}>
            <Icon size={20} className="flex-shrink-0" />
            <span className="text-sm font-medium">{label}</span>
          </Link>
        )
      })}
    </>
  )
}

export default function Sidebar({ profile }) {
  const pathname = usePathname()
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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
    { href: '/auditoria', label: 'Auditoria', icon: ShieldCheck, show: canViewAuditoria(profile.role) },
  ].filter(l => l.show)

  const initials = profile.nome
    .split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()

  return (
    <>
      {/* ===== DESKTOP sidebar ===== */}
      <aside
        className={`hidden md:flex flex-col bg-[#0a0d14] border-r border-white/5 transition-all duration-300 ease-in-out ${expanded ? 'w-56' : 'w-16'}`}
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
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-2 py-2.5 rounded-lg transition-colors overflow-hidden ${
                  active ? 'bg-blue-600/20 text-blue-400' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
                }`}>
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
          <Link href="/perfil"
            className={`flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors overflow-hidden ${pathname === '/perfil' ? 'bg-blue-600/20' : ''}`}>
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
              {initials}
            </div>
            <div className={`flex flex-col min-w-0 transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-xs font-semibold text-slate-200 truncate">{profile.nome}</span>
              <span className="text-xs text-slate-500 capitalize">{profile.role}</span>
            </div>
          </Link>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-2 py-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors overflow-hidden">
            <LogOut size={18} className="flex-shrink-0" />
            <span className={`text-sm whitespace-nowrap transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
              Sair
            </span>
          </button>
        </div>
      </aside>

      {/* ===== MOBILE topbar ===== */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0a0d14] border-b border-white/5 h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 size={14} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm">NPS</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="text-slate-400 hover:text-white p-1">
          <Menu size={22} />
        </button>
      </div>

      {/* ===== MOBILE drawer ===== */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />

          {/* Drawer */}
          <div className="relative w-64 bg-[#0a0d14] flex flex-col h-full ml-auto">
            {/* Header drawer */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BarChart3 size={14} className="text-white" />
                </div>
                <span className="font-bold text-white text-sm">NPS</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 flex flex-col gap-1">
              <NavLinks links={links} pathname={pathname} onClick={() => setMobileOpen(false)} />
            </nav>

            {/* User + Logout */}
            <div className="border-t border-white/5 p-3 flex flex-col gap-1">
              <Link href="/perfil" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0">
                  {initials}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-200 truncate">{profile.nome}</span>
                  <span className="text-xs text-slate-500 capitalize">{profile.role}</span>
                </div>
              </Link>
              <button onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                <LogOut size={18} />
                <span className="text-sm">Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
