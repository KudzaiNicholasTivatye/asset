import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function createAdminClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return { error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env variables' }
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  })

  return { supabaseAdmin }
}

export async function GET() {
  try {
    const { supabaseAdmin, error: envError } = createAdminClient() as any
    if (envError) return NextResponse.json({ error: envError }, { status: 500 })

    const { data, error } = await supabaseAdmin
      .from('departments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data || [])
  } catch (err: any) {
    console.error('GET /api/admin/departments error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to fetch departments' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { supabaseAdmin, error: envError } = createAdminClient() as any
    if (envError) return NextResponse.json({ error: envError }, { status: 500 })

    const body = await req.json()
    const { name, description } = body
    if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('departments')
      .insert({ name, description: description || '' })
      .select()

    if (error) throw error
    return NextResponse.json(data?.[0] || {})
  } catch (err: any) {
    console.error('POST /api/admin/departments error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to create department' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { supabaseAdmin, error: envError } = createAdminClient() as any
    if (envError) return NextResponse.json({ error: envError }, { status: 500 })

    const body = await req.json()
    const { id } = body
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const { error } = await supabaseAdmin
      .from('departments')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('DELETE /api/admin/departments error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to delete department' }, { status: 500 })
  }
}