'use client'
// src/app/auth/page.tsx

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useTranslation } from '@/lib/i18n'
import { useUserStore } from '@/store/userStore'
import toast from 'react-hot-toast'

export default function AuthPage() {
  const router = useRouter()
  const setLocale = useUserStore((s) => s.setLocale)
  const { t } = useTranslation()
  const supabase = createClient()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Til yuklash
    const storedLang = localStorage.getItem('lang') || 'uz'
    setLocale(storedLang === 'ru' ? 'ru' : 'uz')

    // Auth tekshiruv
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) router.replace('/dashboard')
    }
    checkUser()

    // URL error
    const errorMsg = new URLSearchParams(window.location.search).get('error')
    if (errorMsg) {
      setTimeout(() => {
        toast.error(errorMsg === 'missing_keys'
          ? (storedLang === 'ru' ? 'Настройки Supabase не найдены' : 'Supabase sozlamalari topilmadi')
          : (storedLang === 'ru' ? 'Произошла ошибка' : 'Xato yuz berdi')
        )
        window.history.replaceState({}, document.title, window.location.pathname)
      }, 100)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, setLocale])

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error(t('val_fill_all'))
      return
    }

    if (mode === 'register' && !name) {
      toast.error(t('val_fill_all'))
      return
    }

    if (password.length < 6) {
      toast.error(t('auth_error_password'))
      return
    }

    setLoading(true)

    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        const meta = data.user?.user_metadata

        if (meta?.analysis) {
          useUserStore.getState().setAnalysis(meta.analysis)
        }

        if (meta?.dietPlan) {
          useUserStore.getState().setDietPlan(meta.dietPlan)
        }

        if (meta?.workoutPlan) {
          useUserStore.getState().setWorkoutPlan(meta.workoutPlan)
        }

        router.replace('/dashboard')
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        })

        if (error) throw error

        toast.success(t('auth_success_register'))
        router.replace('/onboarding')
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message.toLowerCase() : ''

      if (
        errorMessage.includes('invalid login credentials') ||
        errorMessage.includes('invalid') ||
        errorMessage.includes('email not confirmed')
      ) {
        toast.error(t('auth_error_invalid'))
      } else if (
        errorMessage.includes('already registered') ||
        errorMessage.includes('user already registered')
      ) {
        toast.error(t('auth_error_exists'))
      } else {
        toast.error(t('auth_error_generic'))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    if (googleLoading) return

    setGoogleLoading(true)

    try {
      // Tilni URL ga qo'shish
      const currentLang = localStorage.getItem('lang') || 'uz'
      const redirectTo = `${window.location.origin}/auth/callback?lang=${currentLang}`

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: false,
        },
      })

      if (error) throw error

      if (data?.url) {
        window.location.href = data.url
        return
      }
    } catch {
      setGoogleLoading(false)
      toast.error(t('auth_error_google'))
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#c8f55a]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className={`w-full max-w-sm relative z-10 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="text-center mb-8">
          <div
            className="text-3xl font-bold mb-1"
            style={{ fontFamily: 'var(--font-clash)' }}
          >
            Fit<span className="text-[#c8f55a] accent-glow">AI</span>
          </div>
          <p className="text-gray-500 text-sm">
            {mode === 'login' ? t('auth_title_login') : t('auth_title_register')}
          </p>
        </div>

        <div className="bg-[#111] border border-white/8 rounded-2xl p-6 shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
          <div className="flex bg-white/5 rounded-xl p-1 mb-6">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300"
                style={{
                  background: mode === m ? '#c8f55a' : 'transparent',
                  color: mode === m ? '#0a0a0a' : '#666',
                  boxShadow: mode === m ? '0 0 20px rgba(200,245,90,0.15)' : 'none',
                }}
              >
                {m === 'login' ? t('auth_login') : t('auth_register')}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {mode === 'register' && (
              <div className="animate-fade-in-down">
                <input
                  type="text"
                  placeholder={t('settings_name_placeholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 text-white placeholder:text-gray-600 px-4 py-3.5 rounded-xl outline-none focus:border-[#c8f55a] transition-all duration-300"
                />
              </div>
            )}

            <input
              type="email"
              placeholder={t('auth_email_placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 text-white placeholder:text-gray-600 px-4 py-3.5 rounded-xl outline-none focus:border-[#c8f55a] transition-all duration-300"
            />

            <input
              type="password"
              placeholder={t('auth_password_placeholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full bg-[#0a0a0a] border border-white/10 text-white placeholder:text-gray-600 px-4 py-3.5 rounded-xl outline-none focus:border-[#c8f55a] transition-all duration-300"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || googleLoading}
            className="w-full mt-5 py-3.5 rounded-full font-semibold transition-all duration-300 disabled:opacity-60 hover:shadow-[0_0_25px_rgba(200,245,90,0.2)] hover:scale-[1.01] active:scale-[0.99] btn-primary"
            style={{ background: '#c8f55a', color: '#0a0a0a' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
                {t('loading')}
              </span>
            ) : mode === 'login' ? t('auth_login') : t('auth_register')}
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-gray-600 text-xs">{t('auth_or')}</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full py-3.5 rounded-xl border border-white/10 text-sm text-gray-300 transition-all duration-300 hover:border-white/20 hover:bg-white/3 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.99]"
          >
            {googleLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-gray-500/30 border-t-gray-300 rounded-full animate-spin" />
                {t('loading')}
              </span>
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="18" height="18" className="shrink-0">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {t('auth_google')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}