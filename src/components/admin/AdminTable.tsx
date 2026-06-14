'use client'
import Image from 'next/image'
import type { Product, Category } from '@/types'
import { Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react'

interface AdminTableProps {
  products: Product[]
  categories: Category[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}

export default function AdminTable({ products, categories, onEdit, onDelete }: AdminTableProps) {
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || '—'

  if (products.length === 0) {
    return (
      <div className="text-center py-10 text-[#9CA3AF] text-sm">
        Aucun produit pour le moment.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {products.map(product => (
        <div key={product.id} className="bg-[#111111] border border-[#C9A84C]/10 rounded-xl p-4">
          <div className="flex gap-3">
            <div className="relative w-16 h-16 flex-shrink-0 bg-[#1a1a1a] rounded-lg overflow-hidden">
              {product.images[0] ? (
                <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#9CA3AF] text-xs">
                  IMG
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{product.name}</p>
                  <p className="text-[#9CA3AF] text-xs mt-0.5">{getCategoryName(product.category_id)}</p>
                </div>
                {product.is_available ? (
                  <CheckCircle className="w-4 h-4 text-[#25D366] flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                )}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => onEdit(product)}
                  className="flex items-center gap-1.5 text-xs bg-[#C9A84C]/10 text-[#C9A84C] px-3 py-1.5 rounded-lg"
                >
                  <Edit2 className="w-3 h-3" />
                  Modifier
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="flex items-center gap-1.5 text-xs bg-red-900/20 text-red-400 px-3 py-1.5 rounded-lg"
                >
                  <Trash2 className="w-3 h-3" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
