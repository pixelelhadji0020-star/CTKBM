'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { buildWhatsAppURL } from '@/lib/whatsapp'
import type { Product } from '@/types'
import { ArrowLeft, MessageCircle, Loader2 } from 'lucide-react'

interface ProductWithCategory extends Product {
  categories: { name: string; slug: string } | null
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [product, setProduct] = useState<ProductWithCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [demande, setDemande] = useState('Achat')

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/produit/${id}`)
      if (!res.ok) { setLoading(false); return }
      const data: ProductWithCategory = await res.json()
      setProduct(data)
      const initial: Record<string, string> = {}
      data.options.forEach((opt) => {
        if (opt.values.length > 0) initial[opt.name] = opt.values[0]
      })
      setSelectedOptions(initial)
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
    category: product.categories?.name || '',
    selectedOptions,
    demande: product.categories?.slug === 'voitures' ? demande : undefined,
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
        <div className="overflow-x-auto flex snap-x snap-mandatory scrollbar-none animate-fadeIn">
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

      <div className="px-4 mt-5 animate-slideInLeft">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[#9CA3AF] text-xs uppercase tracking-wider">{product.categories?.name}</p>
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
                  className={`flex items-center justify-between px-4 py-3 animate-fadeInUp ${idx < arr.length - 1 ? 'border-b border-white/5' : ''}`}
                  style={{ animationDelay: `${idx * 0.08}s`, opacity: 0 }}
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
        {product.categories?.slug === 'voitures' && (
          <div className="mb-4">
            <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">
              Type de demande
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDemande('Achat')}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  demande === 'Achat'
                    ? 'bg-[#C9A84C] text-black border-[#C9A84C]'
                    : 'bg-transparent text-gray-400 border-gray-700'
                }`}
              >
                🛒 Achat
              </button>
              <button
                onClick={() => setDemande('Location')}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  demande === 'Location'
                    ? 'bg-[#C9A84C] text-black border-[#C9A84C]'
                    : 'bg-transparent text-gray-400 border-gray-700'
                }`}
              >
                🔑 Location
              </button>
            </div>
          </div>
        )}
        <a
          href={whatsappURL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 btn-gold text-black w-full font-bold py-4 rounded-2xl text-base active:scale-[0.98]"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Commander via WhatsApp</span>
        </a>
      </div>
    </div>
  )
}
