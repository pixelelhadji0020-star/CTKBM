export type Category = {
  id: string
  name: string
  slug: string
  icon: string
  filters: FilterConfig[]
  created_at: string
}

export type FilterConfig = {
  key: string
  label: string
  type: 'select' | 'multiselect'
  options: string[]
}

export type Product = {
  id: string
  name: string
  category_id: string
  description: string
  images: string[]
  specs: Record<string, string | number>
  options: ProductOption[]
  is_available: boolean
  created_at: string
}

export type ProductOption = {
  name: string
  values: string[]
  type: 'color' | 'text'
}

export type WhatsAppMessageParams = {
  productName: string
  category: string
  selectedOptions: Record<string, string>
}
