import { MessageCircle } from 'lucide-react'
import { buildWhatsAppURL } from '@/lib/whatsapp'
import type { WhatsAppMessageParams } from '@/types'

interface WhatsAppButtonProps {
  params: WhatsAppMessageParams
  fullWidth?: boolean
  large?: boolean
}

export default function WhatsAppButton({ params, fullWidth, large }: WhatsAppButtonProps) {
  const url = buildWhatsAppURL(params)
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        flex items-center justify-center gap-2
        bg-[#25D366] text-white font-semibold
        active:scale-[0.98] transition-transform rounded-xl
        ${large ? 'py-4 px-6 text-base font-bold rounded-2xl' : 'py-3 px-5 text-sm'}
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      <MessageCircle className={large ? 'w-5 h-5' : 'w-4 h-4'} />
      <span>Commander via WhatsApp</span>
    </a>
  )
}
