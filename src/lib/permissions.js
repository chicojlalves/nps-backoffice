export function canManageCompanies(role) {
  return role === 'admin'
}

export function canViewAuditoria(role) {
  return role === 'admin'
}

export function canManageStores(role) {
  return ['admin', 'proprietario'].includes(role)
}

export function canManageUsers(role) {
  return ['admin', 'proprietario', 'supervisor'].includes(role)
}
