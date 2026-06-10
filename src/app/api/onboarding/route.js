import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/service'

export async function POST(request) {
  try {
    const { nome, email, senha, nomeEmpresa } = await request.json()

    if (!nome || !email || !senha || !nomeEmpresa) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 })
    }

    if (senha.length < 6) {
      return NextResponse.json({ error: 'A senha deve ter no mínimo 6 caracteres.' }, { status: 400 })
    }

    const supabase = createClient()

    // 1. Verifica se e-mail já existe
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', (await supabase.auth.admin.getUserByEmail(email)).data?.user?.id ?? '')
      .maybeSingle()

    // 2. Cria o auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
    })

    if (authError) {
      if (authError.message.includes('already been registered')) {
        return NextResponse.json({ error: 'Este e-mail já está cadastrado.' }, { status: 409 })
      }
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const userId = authData.user.id

    // 3. Cria a empresa
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        nome: nomeEmpresa,
        subscription_status: 'trialing',
        plan: 'free',
      })
      .select('id')
      .single()

    if (companyError) {
      await supabase.auth.admin.deleteUser(userId)
      return NextResponse.json({ error: 'Erro ao criar empresa: ' + companyError.message }, { status: 500 })
    }

    // 4. Cria o perfil como proprietario
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        nome,
        role: 'proprietario',
        company_id: company.id,
        store_id: null,
      })

    if (profileError) {
      await supabase.auth.admin.deleteUser(userId)
      await supabase.from('companies').delete().eq('id', company.id)
      return NextResponse.json({ error: 'Erro ao criar perfil: ' + profileError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
