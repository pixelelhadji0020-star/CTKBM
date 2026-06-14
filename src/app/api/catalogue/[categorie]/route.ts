import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { categorie: string } }
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.categorie)
    .single()

  if (!category) {
    return NextResponse.json({ error: 'Catégorie introuvable' }, { status: 404 })
  }

  const { searchParams } = new URL(req.url)

  const filterObj: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    if (key !== 'search') filterObj[key] = value
  })

  const search = searchParams.get('search')

  let query = supabase
    .from('products')
    .select('*')
    .eq('category_id', category.id)
    .eq('is_available', true)
    .order('created_at', { ascending: false })

  for (const [key, value] of Object.entries(filterObj)) {
    if (value) {
      query = query.filter(`specs->>${key}`, 'ilike', value.trim())
    }
  }

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data: products, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ category, products: products ?? [] })
}
