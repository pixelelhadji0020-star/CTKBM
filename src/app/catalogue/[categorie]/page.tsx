'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import type { Category, Product } from '@/types'
import ProductCard from '@/components/catalogue/ProductCard'
import FilterBar from '@/components/catalogue/FilterBar'
import { Loader2 } from 'lucide-react'

export default function CataloguePage() {
  const params = useParams()
  const categorie = params.categorie as string

  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [catError, setCatError] = useState(false)

  const fetchProducts = useCallback(async () => {
    setLoading(true)

    const qs = new URLSearchParams()
    Object.entries(selectedFilters).forEach(([k, v]) => { if (v) qs.set(k, v) })

    const res = await fetch(`/api/catalogue/${categorie}?${qs}`)

    if (!res.ok) {
      setCatError(true)
      setLoading(false)
      return
    }

    const data = await res.json()
    setCategory(data.category)
    setProducts(data.products)
    setLoading(false)
  }, [categorie, selectedFilters])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  if (catError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-[#9CA3AF]">Catégorie introuvable.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="px-4 py-6 border-b border-[#C9A84C]/10">
        <h1 className="font-display text-2xl font-bold text-white">
          {category?.name || ' '}
        </h1>
        {!loading && (
          <p className="text-[#9CA3AF] text-sm mt-1">
            {products.length} produit{products.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {category && category.filters.length > 0 && (
        <div className="py-3">
          <FilterBar
            filters={category.filters}
            selectedFilters={selectedFilters}
            onFilterChange={(key, value) => setSelectedFilters(prev => ({ ...prev, [key]: value }))}
            onReset={() => setSelectedFilters({})}
          />
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <p className="text-[#9CA3AF] text-center text-sm">Aucun produit disponible pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4 mt-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
