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
    const { data, error } = await supabaseAdmin
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (err: any) {
    console.error('GET /api/admin/assets error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to fetch assets' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, description, category_id, department_id } = body

    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('assets')
      .insert({
        name,
        description: description || '',
        category_id: category_id || null,
        department_id: department_id || null
      })
      .select()

    if (error) throw error

    return NextResponse.json(data?.[0] || {})
  } catch (err: any) {
    console.error('POST /api/admin/assets error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to create asset' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('assets')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('DELETE /api/admin/assets error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to delete asset' }, { status: 500 })
  }
}