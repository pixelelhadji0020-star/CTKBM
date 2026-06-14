import Link from 'next/link'
import Image from 'next/image'
import { Car, Smartphone } from 'lucide-react'

const categories = [
  {
    name: 'Voitures',
    slug: 'voitures',
    Icon: Car,
    description: 'Véhicules premium & occasions',
  },
  {
    name: 'Chaussures',
    slug: 'chaussures',
    Icon: null,
    description: 'Sneakers & luxe pour tous',
  },
  {
    name: 'Téléphones',
    slug: 'telephones',
    Icon: Smartphone,
    description: 'Smartphones neufs & reconditionnés',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <section className="flex flex-col items-center justify-center px-4 pt-12 pb-12">
        {/* Logo */}
        <div className="relative w-32 h-32 mb-6">
          <Image
            src="/logo.jpeg"
            alt="CTK&BM"
            fill
            className="object-contain rounded-2xl"
            priority
          />
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl font-bold text-center text-white leading-tight mb-3">
          L&apos;Excellence,<br />
          <span className="text-[#C9A84C]">Livrée Chez Vous</span>
        </h1>

        {/* Subtitle */}
        <p className="text-[#9CA3AF] text-sm font-light tracking-widest uppercase text-center mb-8">
          Voitures · Chaussures · Téléphones
        </p>

        <div className="w-16 h-px bg-[#C9A84C]/40 mb-10" />

        {/* Category cards */}
        <div className="flex flex-col gap-4 w-full max-w-sm">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalogue/${cat.slug}`}
              className="bg-[#111111] border border-[#C9A84C]/20 rounded-2xl p-5 flex items-center justify-between active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center">
                  {cat.Icon ? (
                    <cat.Icon className="w-6 h-6 text-[#C9A84C]" />
                  ) : (
                    <span className="text-[#C9A84C] text-lg">👟</span>
                  )}
                </div>
                <div>
                  <h2 className="text-white font-semibold text-base">{cat.name}</h2>
                  <p className="text-[#9CA3AF] text-xs mt-0.5">{cat.description}</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-[#C9A84C]/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
