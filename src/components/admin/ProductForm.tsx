'use client'
import { useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { Product, Category, ProductOption } from '@/types'
import { X, Plus, Upload, Loader2, Trash2 } from 'lucide-react'

interface ProductFormProps {
  product?: Product | null
  categories: Category[]
  onSuccess: () => void
  onCancel: () => void
}

export default function ProductForm({ product, categories, onSuccess, onCancel }: ProductFormProps) {
  const [name, setName] = useState(product?.name || '')
  const [categoryId, setCategoryId] = useState(product?.category_id || categories[0]?.id || '')
  const [description, setDescription] = useState(product?.description || '')
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [specs, setSpecs] = useState<[string, string][]>(
    Object.keys(product?.specs || {}).length
      ? Object.entries(product!.specs).map(([k, v]) => [k, String(v)])
      : [['', '']]
  )
  const [options, setOptions] = useState<ProductOption[]>(product?.options || [])
  const [isAvailable, setIsAvailable] = useState(product?.is_available ?? true)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const uploadImages = async (files: FileList) => {
    setUploading(true)
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filename, file)
      if (!uploadError && data) {
        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(data.path)
        setImages(prev => [...prev, urlData.publicUrl])
      }
    }
    setUploading(false)
  }

  const updateSpec = (idx: number, field: 0 | 1, value: string) => {
    setSpecs(prev => prev.map((pair, i) =>
      i === idx
        ? (field === 0 ? [value, pair[1]] : [pair[0], value]) as [string, string]
        : pair
    ))
  }

  const updateOption = (idx: number, updates: Partial<ProductOption>) => {
    setOptions(prev => prev.map((opt, i) => i === idx ? { ...opt, ...updates } : opt))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const specsObj = Object.fromEntries(
      specs.filter(([k]) => k.trim()).map(([k, v]) => [k.trim(), v])
    )

    const payload = {
      name: name.trim(),
      category_id: categoryId,
      description: description.trim(),
      images,
      specs: specsObj,
      options: options.filter(o => o.name.trim()),
      is_available: isAvailable,
    }

    const { error: dbError } = product?.id
      ? await supabase.from('products').update(payload).eq('id', product.id)
      : await supabase.from('products').insert(payload)

    if (dbError) {
      setError(dbError.message)
      setSaving(false)
      return
    }
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6 pb-20">
      {/* Name */}
      <div>
        <label className="text-[#9CA3AF] text-xs uppercase tracking-wider mb-2 block">Nom *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
          placeholder="Ex: Toyota Corolla 2022"
        />
      </div>

      {/* Category */}
      <div>
        <label className="text-[#9CA3AF] text-xs uppercase tracking-wider mb-2 block">Catégorie *</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="text-[#9CA3AF] text-xs uppercase tracking-wider mb-2 block">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 resize-none"
          placeholder="Description du produit..."
        />
      </div>

      {/* Images */}
      <div>
        <label className="text-[#9CA3AF] text-xs uppercase tracking-wider mb-2 block">Images</label>
        <div className="grid grid-cols-3 gap-2">
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-[#111111]">
              <Image src={img} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                className="absolute top-1 right-1 w-5 h-5 bg-black/80 rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
          <label className="aspect-square rounded-lg border border-dashed border-[#C9A84C]/30 flex flex-col items-center justify-center cursor-pointer bg-[#111111] hover:border-[#C9A84C]/60 transition-colors">
            {uploading ? (
              <Loader2 className="w-6 h-6 text-[#C9A84C] animate-spin" />
            ) : (
              <>
                <Upload className="w-5 h-5 text-[#C9A84C] mb-1" />
                <span className="text-[#9CA3AF] text-xs">Ajouter</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && uploadImages(e.target.files)}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Specs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[#9CA3AF] text-xs uppercase tracking-wider">Spécifications</label>
          <button type="button" onClick={() => setSpecs(prev => [...prev, ['', '']])} className="text-[#C9A84C] text-xs flex items-center gap-1">
            <Plus className="w-3 h-3" /> Ajouter
          </button>
        </div>
        <div className="space-y-2">
          {specs.map(([key, value], idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={key}
                onChange={(e) => updateSpec(idx, 0, e.target.value)}
                placeholder="Clé (ex: marque)"
                className="flex-1 bg-[#111111] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => updateSpec(idx, 1, e.target.value)}
                placeholder="Valeur"
                className="flex-1 bg-[#111111] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
              />
              <button type="button" onClick={() => setSpecs(prev => prev.filter((_, i) => i !== idx))} className="text-red-400 w-8 flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Options */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[#9CA3AF] text-xs uppercase tracking-wider">Options</label>
          <button
            type="button"
            onClick={() => setOptions(prev => [...prev, { name: '', values: [], type: 'text' }])}
            className="text-[#C9A84C] text-xs flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {options.map((opt, idx) => (
            <div key={idx} className="bg-[#111111] border border-white/10 rounded-xl p-3">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={opt.name}
                  onChange={(e) => updateOption(idx, { name: e.target.value })}
                  placeholder="Nom de l'option (ex: Couleur)"
                  className="flex-1 bg-[#1a1a1a] border border-white/5 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                />
                <select
                  value={opt.type}
                  onChange={(e) => updateOption(idx, { type: e.target.value as 'color' | 'text' })}
                  className="bg-[#1a1a1a] border border-white/5 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                >
                  <option value="text">Texte</option>
                  <option value="color">Couleur</option>
                </select>
                <button type="button" onClick={() => setOptions(prev => prev.filter((_, i) => i !== idx))} className="text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                value={opt.values.join(', ')}
                onChange={(e) => updateOption(idx, { values: e.target.value.split(',').map(v => v.trim()).filter(Boolean) })}
                placeholder="Valeurs séparées par virgule"
                className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg px-3 py-2 text-white text-xs focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="flex items-center justify-between bg-[#111111] rounded-xl px-4 py-3 border border-white/10">
        <span className="text-white text-sm">Disponible à la commande</span>
        <button
          type="button"
          onClick={() => setIsAvailable(prev => !prev)}
          className={`relative w-12 h-6 rounded-full transition-colors ${isAvailable ? 'bg-[#25D366]' : 'bg-[#9CA3AF]/30'}`}
        >
          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isAvailable ? 'left-7' : 'left-1'}`} />
        </button>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {/* Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-[#C9A84C]/20 p-4 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-white/20 text-white py-3 rounded-xl text-sm font-medium"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={saving || uploading}
          className="flex-1 bg-[#C9A84C] text-black py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {product ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  )
}
