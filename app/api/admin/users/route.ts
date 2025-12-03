import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env variables')
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
})

export async function GET() {
  try {
    // List auth users (admin endpoint)
    // supabase-js admin.listUsers() returns { users, ... } in many versions
    // try both shapes for compatibility
    // @ts-ignore
    const res = await supabaseAdmin.auth.admin.listUsers?.() ?? await supabaseAdmin.auth.api.listUsers?.()
    const users = res?.users ?? res?.data ?? res
    return NextResponse.json(users)
  } catch (err: any) {
    console.error('GET /api/admin/users error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to list users' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name, role } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'email and password required' }, { status: 400 })
    }

    // create auth user via admin API
    // @ts-ignore
    const createRes = await supabaseAdmin.auth.admin.createUser?.({
      email,
      password,
      user_metadata: { full_name: name, role }
    }) ?? await supabaseAdmin.auth.api.createUser?.({
      email,
      password,
      user_metadata: { full_name: name, role }
    })

    const createdUser = createRes?.user ?? createRes?.data ?? createRes

    if (createRes?.error) {
      throw createRes.error
    }

    // ensure profiles table has a profile row for this user
    const profileInsert = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: createdUser.id,
        full_name: name || null,
        email,
        role: role || 'user'
      }, { onConflict: 'id' })

    if (profileInsert.error) {
      console.warn('Warning: profile upsert failed after creating auth user:', profileInsert.error)
    }

    return NextResponse.json({ user: createdUser })
  } catch (err: any) {
    console.error('POST /api/admin/users error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to create user' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { id } = body
    if (!id) {
      return NextResponse.json({ error: 'user id required' }, { status: 400 })
    }

    // delete auth user via admin API
    // @ts-ignore
    const delRes = await supabaseAdmin.auth.admin.deleteUser?.(id) ?? await supabaseAdmin.auth.api.deleteUser?.(id)

    if (delRes?.error) {
      throw delRes.error
    }

    // also remove profile row
    const profileDel = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', id)

    if (profileDel.error) {
      console.warn('Warning: profile delete failed after deleting auth user:', profileDel.error)
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('DELETE /api/admin/users error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to delete user' }, { status: 500 })
  }
}