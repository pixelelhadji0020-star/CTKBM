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
        <h1 className="font-display text-2xl font-bold text-white animate-slideInLeft">
          {category?.name || ' '}
        </h1>
        {!loading && (
          <p className="text-[#9CA3AF] text-sm mt-1">
            {products.length} produit{products.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {categorie === 'voitures' && (
        <div className="mx-4 mb-6 mt-4 p-4 rounded-2xl bg-[#111111] border border-[#C9A84C]/30 flex items-start gap-3 animate-fadeInUp">
          <span className="text-2xl">🚗</span>
          <div>
            <p className="text-[#C9A84C] font-semibold text-sm">
              Vente &amp; Location de Véhicules
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Tous nos véhicules sont disponibles à la vente ou à la location.
              Contactez-nous via WhatsApp pour connaître les tarifs de location
              journaliers, hebdomadaires ou mensuels.
            </p>
          </div>
        </div>
      )}

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
          {products.map((product, idx) => (
            <div key={product.id} className="animate-fadeInUp" style={{ animationDelay: `${idx * 0.1}s`, opacity: 0 }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
