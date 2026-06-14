import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.images[0]

  return (
    <Link href={`/produit/${product.id}`} className="block">
      <div className="bg-[#111111] rounded-2xl overflow-hidden border border-[#C9A84C]/10 active:scale-[0.98] transition-transform card-hover">
        <div className="relative aspect-[4/3] bg-[#1a1a1a]">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[#9CA3AF] text-xs">Aucune image</span>
            </div>
          )}
          {!product.is_available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-xs font-medium bg-black/80 px-2 py-1 rounded-full">Indisponible</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2">{product.name}</h3>
          <div className="gold-line w-8 my-2" />
          <p className="animate-glowPulse text-[#C9A84C] italic text-xs">✦ Prix sur demande</p>
        </div>
      </div>
    </Link>
  )
}
