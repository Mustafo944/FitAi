'use client'

import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import type { Locale } from '@/lib/i18n'

export default function LanguagePage() {
  const router = useRouter()
  const locale = useUserStore((s) => s.locale)
  const setLocale = useUserStore((s) => s.setLocale)

  const handleSelect = (lang: Locale) => {
    // localStorage ga saqlash
    localStorage.setItem('lang', lang)
    // Cookie ga ham saqlash (middleware uchun)
    document.cookie = `lang=${lang}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`

    setLocale(lang)

    // Landing sahifaga yo'naltirish
    router.replace('/landing')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#c8f55a]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#c8f55a]/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in-up relative z-10">
        <div className="text-center mb-10">
          <div
            className="text-4xl font-bold mb-4 animate-fade-in"
            style={{ fontFamily: 'var(--font-clash)' }}
          >
            Fit<span className="text-[#c8f55a] accent-glow">AI</span>
          </div>

          <h1
            className="text-3xl font-bold mb-3 animate-fade-in-up stagger-1"
            style={{ fontFamily: 'var(--font-clash)' }}
          >
            Tilni tanlang
          </h1>

          <p className="text-gray-500 text-sm animate-fade-in-up stagger-2">
            Til keyinroq sozlamalarda ham o&apos;zgartiriladi
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleSelect('uz')}
            type="button"
            className={`w-full rounded-2xl border p-5 text-left transition-all duration-300 card-hover animate-fade-in-up stagger-3 ${locale === 'uz'
              ? 'border-[#c8f55a] bg-[#c8f55a]/10 shadow-[0_0_30px_rgba(200,245,90,0.1)]'
              : 'border-white/10 bg-[#111] hover:border-white/20'
              }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-white">🇺🇿 O&apos;zbekcha</div>
                <div className="text-sm text-gray-500 mt-1">
                  Sayt o&apos;zbek tilida ishlaydi
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#c8f55a]/10 flex items-center justify-center text-[#c8f55a] text-lg transition-transform group-hover:translate-x-1">
                →
              </div>
            </div>
          </button>

          <button
            onClick={() => handleSelect('ru')}
            type="button"
            className={`w-full rounded-2xl border p-5 text-left transition-all duration-300 card-hover animate-fade-in-up stagger-4 ${locale === 'ru'
              ? 'border-[#c8f55a] bg-[#c8f55a]/10 shadow-[0_0_30px_rgba(200,245,90,0.1)]'
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
              <div className="w-10 h-10 rounded-xl bg-[#c8f55a]/10 flex items-center justify-center text-[#c8f55a] text-lg">
                →
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}