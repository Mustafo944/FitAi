'use client'

import { useEffect } from 'react'
import { useTranslation, type Locale } from '@/lib/i18n'
import { useUserStore } from '@/store/userStore'

export default function LanguageToggle() {
  const { locale } = useTranslation()
  const { setLocale, theme, setTheme } = useUserStore()

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('theme-light')
    } else {
      document.documentElement.classList.remove('theme-light')
    }
  }, [theme])

  const toggleLanguage = () => {
    const newLocale: Locale = locale === 'uz' ? 'ru' : 'uz'
    setLocale(newLocale)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-[100] flex flex-col gap-2">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="bg-[#111] hover:bg-[#c8f55a]/10 border border-white/10 hover:border-[#c8f55a]/30 text-[#c8f55a] rounded-full p-3 shadow-lg backdrop-blur-md transition-all flex items-center justify-center self-end"
        title="Mavzuni almashtirish"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className="bg-[#111] hover:bg-[#c8f55a]/10 border border-white/10 hover:border-[#c8f55a]/30 text-[#c8f55a] rounded-full px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur-md transition-all flex items-center gap-2"
        title="Tilni almashtirish"
      >
        <span className="text-white/50">{locale === 'uz' ? "O'zbek" : 'Русский'}</span>
        <span className="text-white/20">|</span>
        <span>{locale === 'uz' ? 'UZ' : 'RU'}</span>
      </button>
    </div>
  )
}
