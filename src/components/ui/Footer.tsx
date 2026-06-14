import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#C9A84C]/10 px-4 py-8">
      <div className="max-w-lg mx-auto text-center">
        <p className="text-[#C9A84C] font-bold text-lg mb-1">CTK&BM</p>
        <p className="text-[#9CA3AF] text-sm mb-4">Catalogue Premium</p>
        <div className="flex justify-center gap-6 text-xs text-[#9CA3AF] mb-4">
          <Link href="/catalogue/voitures" className="hover:text-[#C9A84C] transition-colors">Voitures</Link>
          <Link href="/catalogue/chaussures" className="hover:text-[#C9A84C] transition-colors">Chaussures</Link>
          <Link href="/catalogue/telephones" className="hover:text-[#C9A84C] transition-colors">Téléphones</Link>
        </div>
        <p className="text-[#9CA3AF] text-xs">
          © 2025 CTK&BM. Tous droits réservés.
        </p>
      </div>
    </footer>
  )
}
