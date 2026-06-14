'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Car, Smartphone, Phone } from 'lucide-react'
import SearchBar from '@/components/catalogue/SearchBar'

const navLinks = [
  { href: '/catalogue/voitures', label: 'Voitures', Icon: Car },
  { href: '/catalogue/chaussures', label: 'Chaussures', emoji: '👟' },
  { href: '/catalogue/telephones', label: 'Téléphones', Icon: Smartphone },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 h-14 bg-black/95 backdrop-blur-md border-b border-[#C9A84C]/20 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image src="/logo.jpeg" alt="CTK&BM" fill className="object-contain rounded-md" />
          </div>
          <span className="text-[#C9A84C] font-bold text-base tracking-wide">CTK&BM</span>
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 flex items-center justify-center text-white"
          aria-label="Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative ml-auto w-4/5 max-w-sm h-full bg-[#0a0a0a] border-l border-[#C9A84C]/20 flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[#C9A84C] font-bold text-lg">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-[#9CA3AF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <SearchBar onClose={() => setIsOpen(false)} />

            <nav className="mt-6 flex flex-col gap-1">
              {navLinks.map(({ href, label, Icon, emoji }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-[#111111] active:bg-[#1a1a1a] transition-colors"
                >
                  <div className="w-5 h-5 flex items-center justify-center text-[#C9A84C]">
                    {Icon ? <Icon className="w-5 h-5" /> : <span className="text-base leading-none">{emoji}</span>}
                  </div>
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-8">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '221771018557'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#25D366]/10 text-[#25D366]"
              >
                <Phone className="w-5 h-5" />
                <span className="font-medium text-sm">Contacter via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
