export function canManageCompanies(role) {
  return role === 'admin'
}

export function canViewAuditoria(role, plan) {
  if (role === 'admin') return true
  if (role === 'proprietario' && plan === 'business') return true
  return false
}

export function canViewRelatorioAtendente(role, plan) {
  if (role === 'admin') return true
  if (['pro', 'business'].includes(plan)) return true
  return false
}

export function canManageStores(role) {
  return ['admin', 'proprietario'].includes(role)
}

export function canManageUsers(role) {
  return ['admin', 'proprietario', 'supervisor'].includes(role)
}
