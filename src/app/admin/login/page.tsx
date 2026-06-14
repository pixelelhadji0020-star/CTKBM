'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Lock, Mail, Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = sessionStorage.getItem('admin_token')
    if (stored) router.push('/admin/dashboard')
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Erreur de connexion')
        setLoading(false)
        return
      }

      // Stocker le token et définir la session Supabase
      sessionStorage.setItem('admin_token', data.access_token)
      sessionStorage.setItem('admin_refresh', data.refresh_token)
      sessionStorage.setItem('admin_email', data.user.email)

      await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      })

      router.push('/admin/dashboard')
    } catch {
      setError('Impossible de contacter le serveur')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <Image src="/logo.jpeg" alt="CTK&BM" fill className="object-contain rounded-xl" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Administration</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">CTK&BM — Espace admin</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#111111] rounded-2xl p-6 border border-[#C9A84C]/20">
          <div className="mb-4">
            <label className="text-[#9CA3AF] text-xs uppercase tracking-wider mb-2 block">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 pl-10 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
                placeholder="admin@example.com"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            </div>
          </div>

          <div className="mb-6">
            <label className="text-[#9CA3AF] text-xs uppercase tracking-wider mb-2 block">Mot de passe</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 pl-10 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
                placeholder="••••••••"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4 text-center bg-red-400/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9A84C] text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Se connecter
          </button>
        </form>
      </div>
    </div>
  )
}
