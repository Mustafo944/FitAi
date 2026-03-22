'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      // 2. User login bo'lganmi?
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()

      if (data.user) {
        router.replace('/dashboard')
      } else {
        router.replace('/landing')
      }
    }

    run().finally(() => {
      // Agar router.replace ishlagan bo'lsa, bu ko'rinmaydi
      setTimeout(() => setIsLoading(false), 2000)
    })
  }, [router])

  if (!isLoading) return null

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
      <div className="relative">
        <div className="text-5xl animate-float mb-6">🏋️</div>
        <div className="absolute -inset-6 bg-[#c8f55a]/10 rounded-full blur-3xl animate-pulse" />
      </div>
      <div
        className="text-3xl font-bold mb-2 animate-fade-in"
        style={{ fontFamily: 'var(--font-clash)' }}
      >
        Fit<span className="text-[#c8f55a] accent-glow">AI</span>
      </div>
      <div className="mt-4 flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-[#c8f55a]/50 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-[#c8f55a]/50 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-[#c8f55a]/50 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}