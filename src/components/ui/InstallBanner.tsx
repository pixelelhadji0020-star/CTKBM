'use client'
import { useInstallPrompt } from '@/lib/pwa'

export default function InstallBanner() {
  const { isInstallable, triggerInstall, dismiss } = useInstallPrompt()

  if (!isInstallable) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-[#C9A84C]/40 px-4 py-3 flex items-center gap-3 animate-fadeInUp">
      <span className="text-2xl flex-shrink-0">📲</span>
      <p className="flex-1 text-white text-sm leading-tight">
        Installez <span className="text-[#C9A84C] font-semibold">CTK&BM</span> sur votre écran d&apos;accueil
      </p>
      <button
        onClick={triggerInstall}
        className="btn-gold text-black text-sm font-semibold px-4 py-2 rounded-full flex-shrink-0"
      >
        Installer
      </button>
      <button
        onClick={dismiss}
        className="text-[#9CA3AF] ml-1 flex-shrink-0"
        aria-label="Fermer"
      >
        ✕
      </button>
    </div>
  )
}
