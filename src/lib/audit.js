import { createClient as createAdmin } from '@supabase/supabase-js'

function getAdmin() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function logAction({ user_id, user_nome, action, table_name, record_id, old_data, new_data }) {
  try {
    const admin = getAdmin()
    await admin.from('audit_logs').insert({
      user_id,
      user_nome,
      action,
      table_name,
      record_id,
      old_data: old_data ?? null,
      new_data: new_data ?? null,
    })
  } catch (err) {
    // Log não deve quebrar a operação principal
    console.error('Erro ao registrar audit log:', err.message)
  }
}
