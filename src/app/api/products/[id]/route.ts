import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function normalizeSpecs(specs: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(specs).map(([k, v]) => [k.trim(), typeof v === 'string' ? v.trim() : v])
  )
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getAdminClient()
  const body = await req.json()
  if (body.specs) body.specs = normalizeSpecs(body.specs)
  const { data, error } = await supabase
    .from('products').update(body).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getAdminClient()
  const { error } = await supabase.from('products').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
