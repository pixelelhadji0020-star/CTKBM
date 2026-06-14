'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { buildWhatsAppURL } from '@/lib/whatsapp'
import type { Product, Category } from '@/types'
import { ArrowLeft, MessageCircle, Loader2 } from 'lucide-react'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

  useEffect(() => {
    async function fetchProduct() {
      const { data: prod } = await supabase.from('products').select('*').eq('id', id).single()
      if (prod) {
        setProduct(prod)
        const initial: Record<string, string> = {}
        prod.options.forEach((opt: { name: string; values: string[] }) => {
          if (opt.values.length > 0) initial[opt.name] = opt.values[0]
        })
        setSelectedOptions(initial)
        const { data: cat } = await supabase.from('categories').select('*').eq('id', prod.category_id).single()
        if (cat) setCategory(cat)
      }
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <p className="text-[#9CA3AF]">Produit introuvable.</p>
        <button onClick={() => router.back()} className="text-[#C9A84C] text-sm">
          ← Retour
        </button>
      </div>
    )
  }

  const whatsappURL = buildWhatsAppURL({
    productName: product.name,
    category: category?.name || '',
    selectedOptions,
  })

  return (
    <div className="min-h-screen bg-black pb-28">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 px-4 py-3 text-[#9CA3AF]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Retour</span>
      </button>

      {/* Image gallery */}
      {product.images.length > 0 ? (
        <div className="overflow-x-auto flex snap-x snap-mandatory scrollbar-none">
          {product.images.map((img, idx) => (
            <div key={idx} className="flex-none w-full snap-start relative aspect-square">
              <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" priority={idx === 0} />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full aspect-square bg-[#111111] flex items-center justify-center">
          <span className="text-[#9CA3AF] text-sm">Aucune image</span>
        </div>
      )}

      <div className="px-4 mt-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[#9CA3AF] text-xs uppercase tracking-wider">{category?.name}</p>
            <h1 className="font-display text-xl font-bold text-white mt-1">{product.name}</h1>
          </div>
          {!product.is_available && (
            <span className="text-xs text-[#9CA3AF] border border-[#9CA3AF]/30 rounded-full px-3 py-1 flex-shrink-0">
              Indisponible
            </span>
          )}
        </div>

        {/* Price placeholder */}
        <p className="text-[#C9A84C] italic text-center my-5 text-sm">
          ✦ Prix &amp; disponibilité sur demande
        </p>

        {/* Description */}
        {product.description && (
          <div className="mb-6">
            <h2 className="text-white font-semibold text-sm mb-2">Description</h2>
            <p className="text-[#9CA3AF] text-sm leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Options */}
        {product.options.length > 0 && (
          <div className="mb-6 space-y-4">
            {product.options.map((option) => (
              <div key={option.name}>
                <h3 className="text-white font-semibold text-sm mb-2">{option.name}</h3>
                {option.type === 'color' ? (
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((val) => (
                      <button
                        key={val}
                        onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: val }))}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedOptions[option.name] === val ? 'border-[#C9A84C] scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: val }}
                        title={val}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((val) => (
                      <button
                        key={val}
                        onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: val }))}
                        className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${
                          selectedOptions[option.name] === val
                            ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]'
                            : 'border-[#9CA3AF]/20 text-[#9CA3AF]'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Specs */}
        {Object.keys(product.specs).length > 0 && (
          <div className="mb-6">
            <h2 className="text-white font-semibold text-sm mb-3">Spécifications</h2>
            <div className="bg-[#111111] rounded-2xl overflow-hidden">
              {Object.entries(product.specs).map(([key, value], idx, arr) => (
                <div
                  key={key}
                  className={`flex items-center justify-between px-4 py-3 ${idx < arr.length - 1 ? 'border-b border-white/5' : ''}`}
                >
                  <span className="text-[#9CA3AF] text-sm capitalize">{key}</span>
                  <span className="text-white text-sm font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky WhatsApp CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-[#C9A84C]/20 p-4 z-40">
        <a
          href={whatsappURL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-bold py-4 rounded-2xl text-base active:scale-[0.98] transition-transform"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Commander via WhatsApp</span>
        </a>
      </div>
    </div>
  )
}
