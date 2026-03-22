'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import { createClient } from '@/lib/supabase'
import type { Locale } from '@/lib/i18n'

export default function LanguagePage() {
  const router = useRouter()
  const { locale, setLocale } = useUserStore()
  const supabase = createClient()

  useEffect(() => {
    const selected = localStorage.getItem('lang_selected')

    // Agar til allaqachon tanlangan bo'lsa
    if (selected) {
      router.replace('/landing')
    }
  }, [])

  const handleSelect = async (lang: Locale) => {
    setLocale(lang)

    localStorage.setItem('lang_selected', 'true')
    localStorage.setItem('fitai-language', lang)

    // Til tanlangandan so'ng landing sahifasiga
    router.push('/landing')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div
            className="text-4xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-clash)' }}
          >
            Fit<span className="text-[#c8f55a]">AI</span>
          </div>

          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-clash)' }}
          >
            Tilni tanlang
          </h1>

          <p className="text-gray-500 text-sm">
            Выберите язык / Select your language later in settings
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleSelect('uz')}
            type="button"
            className={`w-full rounded-2xl border p-5 text-left transition-all ${locale === 'uz'
                ? 'border-[#c8f55a] bg-[#c8f55a]/10'
                : 'border-white/10 bg-[#111] hover:border-white/20'
              }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-white">🇺🇿 O‘zbekcha</div>
                <div className="text-sm text-gray-500 mt-1">
                  Sayt o‘zbek tilida ishlaydi
                </div>
              </div>
              <div className="text-[#c8f55a] text-xl">→</div>
            </div>
          </button>

          <button
            onClick={() => handleSelect('ru')}
            type="button"
            className={`w-full rounded-2xl border p-5 text-left transition-all ${locale === 'ru'
                ? 'border-[#c8f55a] bg-[#c8f55a]/10'
                : 'border-white/10 bg-[#111] hover:border-white/20'
              }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-white">🇷🇺 Русский</div>
                <div className="text-sm text-gray-500 mt-1">
                  Сайт будет работать на русском языке
                </div>
              </div>
              <div className="text-[#c8f55a] text-xl">→</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}