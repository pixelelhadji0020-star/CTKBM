import { WhatsAppMessageParams } from '@/types'

export function buildWhatsAppURL(params: WhatsAppMessageParams): string {
  const { productName, category, selectedOptions, demande } = params
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '221771018557'

  const optionsText = Object.entries(selectedOptions)
    .filter(([, val]) => val)
    .map(([key, val]) => `${key}: ${val}`)
    .join(', ')

  const message = [
    `Bonjour CTK&BM 👋, je suis intéressé(e) par :`,
    ``,
    `📦 *Produit* : ${productName}`,
    `🏷️ *Catégorie* : ${category}`,
    optionsText ? `⚙️ *Options* : ${optionsText}` : '',
    demande ? `🔑 *Je suis intéressé(e) par* : ${demande}` : '',
    ``,
    `Pouvez-vous m'indiquer le prix, la disponibilité et les modalités de livraison ? Merci !`
  ].filter(line => line !== undefined && line !== '').join('\n')

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
