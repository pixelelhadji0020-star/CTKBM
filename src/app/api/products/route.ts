import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

function normalizeSpecs(specs: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(specs).map(([k, v]) => [k.trim(), typeof v === 'string' ? v.trim() : v])
  )
}

export async function POST(req: NextRequest) {
  const supabase = getAdminClient()
  const body = await req.json()
  if (body.specs) body.specs = normalizeSpecs(body.specs)
  const { data, error } = await supabase.from('products').insert([body]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
