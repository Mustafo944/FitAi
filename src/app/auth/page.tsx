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
  const supabase = createClient()

  const setLocale = useUserStore((s) => s.setLocale)
  const { t } = useTranslation()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  // 1) Tilni localStorage dan store ga yuklaymiz
  useEffect(() => {
    const storedLang =
      localStorage.getItem('lang') ||
      localStorage.getItem('lang_selected') ||
      'uz'

    if (storedLang === 'ru' || storedLang === 'uz') {
      setLocale(storedLang)
    } else {
      setLocale('uz')
    }

    setReady(true)
  }, [setLocale])

  // 2) Language tanlanmagan bo‘lsa /language ga yuboramiz
  useEffect(() => {
    if (!ready) return

    const selected =
      localStorage.getItem('lang') || localStorage.getItem('lang_selected')

    if (!selected) {
      router.replace('/language')
      return
    }

    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        router.replace('/dashboard')
      }
    }

    checkAuth()
  }, [ready, router, supabase])

  // 3) URL error handler
  useEffect(() => {
    if (!ready) return

    const params = new URLSearchParams(window.location.search)
    const errorMsg = params.get('error')

    if (errorMsg) {
      setTimeout(() => {
        if (errorMsg === 'missing_keys') {
          toast.error(t('auth_error_env'))
        } else {
          toast.error(t('auth_error_generic'))
        }

        window.history.replaceState({}, document.title, window.location.pathname)
      }, 100)
    }
  }, [ready, t])

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

        router.push('/dashboard')
        router.refresh()
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
        router.push('/onboarding')
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
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch {
      toast.error(t('auth_error_google'))
    }
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-gray-400 text-sm">{t('loading')}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-3xl font-bold mb-1">
            Fit<span className="text-[#c8f55a]">AI</span>
          </div>
          <p className="text-gray-500 text-sm">
            {mode === 'login' ? t('auth_title_login') : t('auth_title_register')}
          </p>
        </div>

        <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
          <div className="flex bg-white/5 rounded-xl p-1 mb-6">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition"
                style={{
                  background: mode === m ? '#c8f55a' : 'transparent',
                  color: mode === m ? '#0a0a0a' : '#666',
                }}
              >
                {m === 'login' ? t('auth_login') : t('auth_register')}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {mode === 'register' && (
              <input
                type="text"
                placeholder={t('settings_name_placeholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 text-white placeholder:text-gray-500 px-4 py-3 rounded-xl outline-none focus:border-[#c8f55a]"
              />
            )}

            <input
              type="email"
              placeholder={t('auth_email_placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 text-white placeholder:text-gray-500 px-4 py-3 rounded-xl outline-none focus:border-[#c8f55a]"
            />

            <input
              type="password"
              placeholder={t('auth_password_placeholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 text-white placeholder:text-gray-500 px-4 py-3 rounded-xl outline-none focus:border-[#c8f55a]"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-5 py-3 rounded-full font-semibold transition disabled:opacity-60"
            style={{ background: '#c8f55a', color: '#0a0a0a' }}
          >
            {loading
              ? t('loading')
              : mode === 'login'
                ? t('auth_login')
                : t('auth_register')}
          </button>

          <div className="text-center my-4 text-gray-600 text-xs">
            {t('auth_or')}
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full py-3 rounded-xl border border-white/10 text-sm text-gray-300 transition hover:border-white/20"
          >
            {t('auth_google')}
          </button>
        </div>
      </div>
    </div>
  )
}