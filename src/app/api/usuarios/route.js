import { createClient as createAdmin } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { canManageUsers } from '@/lib/permissions'

export async function POST(request) {
  try {
    // Verifica sessão do usuário logado
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Não autenticado.' }, { status: 401 })
    }

    // Busca perfil do usuário logado
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!currentProfile || !canManageUsers(currentProfile.role)) {
      return Response.json({ error: 'Sem permissão.' }, { status: 403 })
    }

    const { nome, email, senha, role, company_id, store_id } = await request.json()

    if (!nome || !email || !senha || !role || !company_id) {
      return Response.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 })
    }

    // Admin client com service role — cria usuários sem restrição de RLS
    const admin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // 1. Cria o usuário no Auth
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
    })

    if (authError) {
      return Response.json({ error: authError.message }, { status: 400 })
    }

    // 2. Cria o perfil
    const { data: profileData, error: profileError } = await admin
      .from('profiles')
      .insert({
        id: authData.user.id,
        nome,
        role,
        company_id,
        store_id: store_id || null,
      })
      .select('*, companies(nome), stores(nome)')
      .single()

    if (profileError) {
      // Rollback: remove o usuário do Auth se o perfil falhou
      await admin.auth.admin.deleteUser(authData.user.id)
      console.error('Erro ao criar perfil:', profileError)
      return Response.json({ error: 'Erro ao criar perfil: ' + profileError.message }, { status: 500 })
    }

    return Response.json({ usuario: profileData }, { status: 201 })
  } catch (err) {
    console.error('Erro interno:', err)
    return Response.json({ error: 'Erro interno: ' + err.message }, { status: 500 })
  }
}
