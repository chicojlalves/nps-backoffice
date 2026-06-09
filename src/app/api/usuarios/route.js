import { createClient as createAdmin } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { canManageUsers } from '@/lib/permissions'

async function getAuthenticatedProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return profile
}

export async function POST(request) {
  try {
    const profile = await getAuthenticatedProfile()
    if (!profile || !canManageUsers(profile.role)) {
      return Response.json({ error: 'Sem permissão.' }, { status: 403 })
    }

    const { nome, email, senha, role, company_id, store_id } = await request.json()

    if (!nome || !email || !senha || !role || !company_id) {
      return Response.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 })
    }

    const admin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
    })

    if (authError) return Response.json({ error: authError.message }, { status: 400 })

    const { data: profileData, error: profileError } = await admin
      .from('profiles')
      .insert({ id: authData.user.id, nome, role, company_id, store_id: store_id || null })
      .select('*, companies(nome), stores(nome)')
      .single()

    if (profileError) {
      await admin.auth.admin.deleteUser(authData.user.id)
      return Response.json({ error: 'Erro ao criar perfil: ' + profileError.message }, { status: 500 })
    }

    return Response.json({ usuario: profileData }, { status: 201 })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const profile = await getAuthenticatedProfile()
    if (!profile || !canManageUsers(profile.role)) {
      return Response.json({ error: 'Sem permissão.' }, { status: 403 })
    }

    const { id, nome, role, company_id, store_id } = await request.json()

    if (!id || !nome || !role || !company_id) {
      return Response.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 })
    }

    const admin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data, error } = await admin
      .from('profiles')
      .update({ nome, role, company_id, store_id: store_id || null })
      .eq('id', id)
      .select('*, companies(nome), stores(nome)')
      .single()

    if (error) return Response.json({ error: error.message }, { status: 500 })

    return Response.json({ usuario: data })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const profile = await getAuthenticatedProfile()
    if (!profile || !canManageUsers(profile.role)) {
      return Response.json({ error: 'Sem permissão.' }, { status: 403 })
    }

    const { id } = await request.json()
    if (!id) return Response.json({ error: 'ID obrigatório.' }, { status: 400 })

    const admin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { error } = await admin.auth.admin.deleteUser(id)
    if (error) return Response.json({ error: error.message }, { status: 500 })

    return Response.json({ ok: true })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
