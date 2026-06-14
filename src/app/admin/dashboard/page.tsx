'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { Product, Category } from '@/types'
import AdminTable from '@/components/admin/AdminTable'
import ProductForm from '@/components/admin/ProductForm'
import { Plus, LogOut, Loader2, Package, Tag } from 'lucide-react'

type FormState = Product | null | undefined // undefined = closed, null = new, Product = edit

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products')
  const [formState, setFormState] = useState<FormState>(undefined)
  const [selectedCat, setSelectedCat] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/admin/login')
      } else {
        setAuthed(true)
        setLoading(false)
      }
    })
  }, [router])

  const fetchData = useCallback(async () => {
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ])
    if (prods) setProducts(prods)
    if (cats) setCategories(cats)
  }, [])

  useEffect(() => {
    if (authed) fetchData()
  }, [authed, fetchData])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
      </div>
    )
  }

  if (formState !== undefined) {
    return (
      <div className="min-h-screen bg-black">
        <div className="px-4 py-4 border-b border-[#C9A84C]/20">
          <h1 className="text-white font-bold text-lg">
            {formState ? 'Modifier le produit' : 'Nouveau produit'}
          </h1>
        </div>
        <ProductForm
          product={formState}
          categories={categories}
          onSuccess={() => { setFormState(undefined); fetchData() }}
          onCancel={() => setFormState(undefined)}
        />
      </div>
    )
  }

  const filteredProducts = selectedCat
    ? products.filter(p => p.category_id === selectedCat)
    : products

  return (
    <div className="min-h-screen bg-black pb-8">
      {/* Header */}
      <div className="px-4 py-4 border-b border-[#C9A84C]/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image src="/logo.jpeg" alt="CTK&BM" fill className="object-contain rounded-md" />
          </div>
          <span className="text-[#C9A84C] font-bold">Admin</span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-[#9CA3AF] text-sm">
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 p-4">
        <div className="bg-[#111111] rounded-xl p-4 border border-[#C9A84C]/10">
          <p className="text-[#9CA3AF] text-xs">Produits</p>
          <p className="text-white text-2xl font-bold mt-1">{products.length}</p>
        </div>
        <div className="bg-[#111111] rounded-xl p-4 border border-[#C9A84C]/10">
          <p className="text-[#9CA3AF] text-xs">Catégories</p>
          <p className="text-white text-2xl font-bold mt-1">{categories.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 gap-2 mb-4">
        {(['products', 'categories'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab ? 'bg-[#C9A84C] text-black' : 'bg-[#111111] text-[#9CA3AF]'
            }`}
          >
            {tab === 'products' ? <Package className="w-4 h-4" /> : <Tag className="w-4 h-4" />}
            {tab === 'products' ? 'Produits' : 'Catégories'}
          </button>
        ))}
      </div>

      {activeTab === 'products' && (
        <div className="px-4">
          <div className="flex gap-2 mb-4">
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="flex-1 bg-[#111111] border border-[#C9A84C]/20 text-white text-sm rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <button
              onClick={() => setFormState(null)}
              className="flex items-center gap-2 bg-[#C9A84C] text-black font-semibold px-4 py-2 rounded-xl text-sm"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>
          <AdminTable
            products={filteredProducts}
            categories={categories}
            onEdit={(p) => setFormState(p)}
            onDelete={handleDelete}
          />
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="px-4 space-y-3">
          {categories.map(cat => (
            <div key={cat.id} className="bg-[#111111] border border-[#C9A84C]/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">{cat.name}</p>
                  <p className="text-[#9CA3AF] text-xs mt-0.5">/{cat.slug}</p>
                </div>
                <span className="text-[#9CA3AF] text-xs">
                  {cat.filters.length} filtre{cat.filters.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          ))}
          <p className="text-[#9CA3AF] text-xs text-center mt-4">
            Modifiez les catégories via Supabase SQL Editor.
          </p>
        </div>
      )}
    </div>
  )
}
