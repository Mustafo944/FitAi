'use client'
// src/app/onboarding/page.tsx

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useUserStore } from '@/store/userStore'
import { useTranslation } from '@/lib/i18n'
import toast from 'react-hot-toast'
import type { Gender, Goal } from '@/types'

const supabase = createClient()

export default function OnboardingPage() {
  const router = useRouter()
  const { t } = useTranslation()

  const onboardingData = useUserStore((s) => s.onboardingData)
  const setOnboardingData = useUserStore((s) => s.setOnboardingData)
  const setAnalysis = useUserStore((s) => s.setAnalysis)
  const setDietPlan = useUserStore((s) => s.setDietPlan)
  const setWorkoutPlan = useUserStore((s) => s.setWorkoutPlan)
  const setProgress = useUserStore((s) => s.setProgress)
  const locale = useUserStore((s) => s.locale)

  const [step, setStep] = useState(1)
  const [analyzing, setAnalyzing] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [progressValue, setProgressValue] = useState(0)
  const [progressText, setProgressText] = useState('')
  const [preview, setPreview] = useState('')

  const GOALS = [
    { value: 'weight_loss', emoji: '🔥', labelKey: 'onboarding_goal_loss' as const },
    { value: 'muscle_gain', emoji: '💪', labelKey: 'onboarding_goal_gain' as const },
    { value: 'maintain', emoji: '⚖️', labelKey: 'onboarding_goal_maintain' as const },
    { value: 'healthy_life', emoji: '🏃', labelKey: 'onboarding_goal_healthy' as const },
  ]

  useEffect(() => {
    const selected = localStorage.getItem('lang')

    if (!selected) {
      router.replace('/language')
      return
    }

    let isMounted = true

    const checkUserAndRedirect = async () => {
      const searchParams = new URLSearchParams(window.location.search)

      if (searchParams.get('reanalyze') === 'true') {
        if (isMounted) setIsChecking(false)
        return
      }

      if (useUserStore.getState().analysis) {
        router.replace('/dashboard')
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      const meta = user?.user_metadata

      if (meta?.analysis) {
        setAnalysis(meta.analysis)
        setDietPlan(meta.dietPlan || [])
        setWorkoutPlan(meta.workoutPlan || [])
        router.replace('/dashboard')
      } else {
        if (isMounted) setIsChecking(false)
      }
    }

    checkUserAndRedirect()

    return () => {
      isMounted = false
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview, router, setAnalysis, setDietPlan, setWorkoutPlan])

  const validateStepOne = () => {
    const { height, weight, age, gender } = onboardingData

    const h = Number(height)
    const w = Number(weight)
    const a = Number(age)

    if (!height || !weight || !age || !gender) {
      toast.error(t('val_fill_all'))
      return false
    }

    if (Number.isNaN(h) || h < 100 || h > 250) {
      toast.error(t('val_height'))
      return false
    }

    if (Number.isNaN(w) || w < 30 || w > 300) {
      toast.error(t('val_weight'))
      return false
    }

    if (Number.isNaN(a) || a < 10 || a > 100) {
      toast.error(t('val_age'))
      return false
    }

    return true
  }

  const handleNextStep = () => {
    if (!validateStepOne()) return
    setStep(2)
  }

  const handleAnalyze = async () => {
    if (analyzing) return

    const { height, weight, age, gender, goal, image } = onboardingData

    if (!validateStepOne()) return

    if (!goal) {
      toast.error(t('val_goal'))
      return
    }

    setAnalyzing(true)
    setProgressValue(0)
    setProgressText('')

    const steps = [
      [12, t('onboarding_step_preparing')],
      [25, t('onboarding_step_scanning')],
      [42, t('onboarding_step_contour')],
      [58, t('onboarding_step_bmi')],
      [76, t('onboarding_step_diet')],
      [91, t('onboarding_step_workout')],
    ] as const

    let si = 0
    const interval = setInterval(() => {
      if (si < steps.length) {
        setProgressValue(steps[si][0])
        setProgressText(steps[si][1])
        si++
      }
    }, 1200)

    try {
      const formData = new FormData()

      if (image) {
        formData.append('image', image)
      }

      formData.append('height', String(height).trim())
      formData.append('weight', String(weight).trim())
      formData.append('age', String(age).trim())
      formData.append('gender', String(gender).trim())
      formData.append('goal', String(goal).trim())
      formData.append('locale', locale || 'uz')

      const aiPlanRes = await fetch('/api/ai-plan', {
        method: 'POST',
        body: formData,
      })

      const aiPlanData = await aiPlanRes.json()

      if (!aiPlanRes.ok || !aiPlanData.success) {
        throw new Error(aiPlanData.error || t('auth_error_generic'))
      }

      const raw = aiPlanData.data.analysis

      const analysis = {
        ...raw,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        level: raw.level || 'beginner',
        weeks_to_goal: raw.weeks_to_goal || 4,
        features: {
          belly_fat: raw?.features?.belly_fat || 'medium',
          muscle_visibility: raw?.features?.muscle_visibility || 'medium',
          posture: raw?.features?.posture || 'average',
        },
        coach_message:
          raw.coach_message ||
          (locale === 'ru'
            ? 'Продолжайте план сегодня.'
            : 'Bugun rejangizni davom ettiring.'),
      }

      setAnalysis(analysis)
      setDietPlan(aiPlanData.data.diet || [])
      setWorkoutPlan(aiPlanData.data.workout || [])
      setProgress([
        {
          week: 1,
          estimated_weight: Number(weight),
        },
      ])

      await supabase.auth.updateUser({
        data: {
          analysis,
          dietPlan: aiPlanData.data.diet || [],
          workoutPlan: aiPlanData.data.workout || [],
        },
      })

      clearInterval(interval)
      setProgressValue(100)
      setProgressText(t('onboarding_done'))

      setTimeout(() => {
        router.replace('/dashboard')
      }, 900)
    } catch (err: unknown) {
      clearInterval(interval)
      setAnalyzing(false)

      const message = err instanceof Error ? err.message : t('auth_error_generic')
      toast.error(message)
    }
  }

  const handleImageChange = (file: File | null) => {
    setOnboardingData({ image: file })

    if (preview) {
      URL.revokeObjectURL(preview)
      setPreview('')
    }

    if (file) {
      const localUrl = URL.createObjectURL(file)
      setPreview(localUrl)
    }
  }

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview)
    setPreview('')
    setOnboardingData({ image: null })
  }

  if (analyzing) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="relative bg-[#0f0f0f] border border-[#c8f55a]/20 rounded-[28px] p-6 overflow-hidden shadow-[0_0_40px_rgba(200,245,90,0.08)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(200,245,90,0.08),transparent_35%)]" />
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-4">🤖</div>

              <h2
                className="text-2xl font-bold text-white mb-2"
                style={{ fontFamily: 'var(--font-clash)' }}
              >
                {t('onboarding_ai_scan')}
              </h2>

              <p className="text-gray-500 mb-6">{progressText}</p>

              {preview ? (
                <div className="relative mb-6 rounded-3xl overflow-hidden border border-[#c8f55a]/20 bg-black">
                  <img
                    src={preview}
                    alt="Body scan preview"
                    className="w-full h-72 object-cover opacity-70"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute inset-0">
                    <div className="absolute left-0 right-0 h-[3px] bg-[#c8f55a] shadow-[0_0_20px_rgba(200,245,90,0.8)] animate-[scan_2.4s_linear_infinite]" />
                  </div>

                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-4 left-4 right-4 bottom-4 border border-[#c8f55a]/20 rounded-2xl" />
                    <div className="absolute top-4 bottom-4 left-1/3 w-px bg-[#c8f55a]/20" />
                    <div className="absolute top-4 bottom-4 right-1/3 w-px bg-[#c8f55a]/20" />
                    <div className="absolute top-1/3 left-4 right-4 h-px bg-[#c8f55a]/20" />
                    <div className="absolute bottom-1/3 left-4 right-4 h-px bg-[#c8f55a]/20" />
                  </div>

                  <div className="absolute top-3 right-3 text-[10px] px-3 py-1.5 rounded-full bg-black/70 text-[#c8f55a] border border-[#c8f55a]/20 tracking-[0.2em]">
                    {t('scan_scanning')}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-2">
                    <div className="rounded-xl border border-white/10 bg-black/60 p-2 text-center">
                      <div className="text-[10px] text-gray-400">{t('scan_vision')}</div>
                      <div className="text-xs text-white font-medium">{t('scan_active')}</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/60 p-2 text-center">
                      <div className="text-[10px] text-gray-400">{t('scan_body_type')}</div>
                      <div className="text-xs text-white font-medium">{t('scan_estimating')}</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/60 p-2 text-center">
                      <div className="text-[10px] text-gray-400">{t('scan_fat')}</div>
                      <div className="text-xs text-white font-medium">{t('scan_analyzing')}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 rounded-3xl border border-dashed border-white/10 bg-white/5 h-72 flex items-center justify-center text-gray-500">
                  {t('onboarding_no_image')}
                </div>
              )}

              <div className="w-full bg-white/10 rounded-full h-2.5 mb-3 overflow-hidden">
                <div
                  className="h-2.5 bg-[#c8f55a] rounded-full transition-all duration-500 shadow-[0_0_20px_rgba(200,245,90,0.7)]"
                  style={{ width: `${progressValue}%` }}
                />
              </div>

              <p className="text-sm text-gray-600">{progressValue}%</p>
            </div>
          </div>

          <style jsx>{`
            @keyframes scan {
              0% {
                top: 8%;
                opacity: 0.5;
              }
              50% {
                opacity: 1;
              }
              100% {
                top: 88%;
                opacity: 0.5;
              }
            }
          `}</style>
        </div>
      </div>
    )
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
        <div className="text-4xl animate-bounce mb-4">🏋️</div>
        <div className="text-[#c8f55a] animate-pulse font-medium text-sm tracking-widest uppercase">
          {t('loading')}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex gap-2 mb-8">
          {[1, 2].map((s) => (
            <div
              key={s}
              className="flex-1 h-1 rounded-full transition-all duration-300"
              style={{ background: s <= step ? '#c8f55a' : 'rgba(255,255,255,0.1)' }}
            />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2
              className="text-3xl font-bold text-white mb-2"
              style={{ fontFamily: 'var(--font-clash)' }}
            >
              {t('onboarding_hello')}
            </h2>

            <p className="text-gray-500 mb-8">{t('onboarding_subtitle')}</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1.5 block">
                  {t('onboarding_height')}
                </label>
                <input
                  type="number"
                  placeholder="175"
                  value={onboardingData.height}
                  onChange={(e) => setOnboardingData({ height: e.target.value })}
                  className="w-full bg-[#111] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#c8f55a] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1.5 block">
                  {t('onboarding_weight')}
                </label>
                <input
                  type="number"
                  placeholder="75"
                  value={onboardingData.weight}
                  onChange={(e) => setOnboardingData({ weight: e.target.value })}
                  className="w-full bg-[#111] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#c8f55a] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1.5 block">
                  {t('onboarding_age')}
                </label>
                <input
                  type="number"
                  placeholder="28"
                  value={onboardingData.age}
                  onChange={(e) => setOnboardingData({ age: e.target.value })}
                  className="w-full bg-[#111] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#c8f55a] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1.5 block">
                  {t('onboarding_gender')}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOnboardingData({ gender: 'male' as Gender })}
                    className={`flex-1 py-3 rounded-xl text-center transition-all duration-300 ${onboardingData.gender === 'male'
                      ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border-2 border-blue-400 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.2)] scale-[1.02]'
                      : 'bg-[#111] border border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                  >
                    <div className="text-2xl mb-0.5">🚹</div>
                    <div className="text-[11px] font-semibold">{t('onboarding_gender_male')}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOnboardingData({ gender: 'female' as Gender })}
                    className={`flex-1 py-3 rounded-xl text-center transition-all duration-300 ${onboardingData.gender === 'female'
                      ? 'bg-gradient-to-br from-pink-500/20 to-rose-500/10 border-2 border-pink-400 text-pink-300 shadow-[0_0_20px_rgba(236,72,153,0.2)] scale-[1.02]'
                      : 'bg-[#111] border border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                  >
                    <div className="text-2xl mb-0.5">🚺</div>
                    <div className="text-[11px] font-semibold">{t('onboarding_gender_female')}</div>
                  </button>
                </div>
              </div>

              <div className="col-span-2 mt-2">
                <div className="relative rounded-[28px] border border-[#c8f55a]/20 bg-[#0f0f0f] p-4 overflow-hidden shadow-[0_0_30px_rgba(200,245,90,0.06)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(200,245,90,0.08),transparent_35%)]" />

                  <div className="relative z-10 flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{t('onboarding_ai_scan')}</h3>
                      <p className="text-xs text-gray-500">{t('onboarding_ai_scan_desc')}</p>
                    </div>
                    <div className="h-11 w-11 rounded-2xl bg-[#c8f55a]/10 border border-[#c8f55a]/20 flex items-center justify-center text-[#c8f55a] text-xl">
                      ✨
                    </div>
                  </div>

                  {!preview ? (
                    <label className="relative z-10 block cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                      />

                      <div className="rounded-[24px] border border-dashed border-[#c8f55a]/30 bg-[#c8f55a]/5 hover:bg-[#c8f55a]/10 transition-colors p-8 text-center">
                        <div className="mx-auto mb-3 h-16 w-16 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center text-3xl">
                          📷
                        </div>
                        <div className="text-white font-semibold mb-1">{t('onboarding_pick_image')}</div>
                        <div className="text-xs text-gray-500 mb-4">{t('onboarding_image_format')}</div>

                        <div className="inline-flex items-center gap-2 rounded-full bg-[#c8f55a] text-black font-semibold px-5 py-3 text-sm shadow-[0_0_20px_rgba(200,245,90,0.25)]">
                          <span>{t('onboarding_start_scan')}</span>
                        </div>
                      </div>
                    </label>
                  ) : (
                    <div className="relative z-10 space-y-4">
                      <div className="relative rounded-[24px] overflow-hidden border border-[#c8f55a]/20 bg-black">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-72 object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

                        <div className="absolute top-3 left-3">
                          <span className="text-[10px] px-3 py-1.5 rounded-full bg-black/70 text-white border border-white/10 tracking-[0.2em]">
                            {t('scan_before')}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3 flex gap-2">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                            />
                            <span className="text-[10px] px-3 py-2 rounded-full bg-black/70 text-white border border-white/10">
                              {t('onboarding_replace')}
                            </span>
                          </label>

                          <button
                            type="button"
                            onClick={removeImage}
                            className="text-[10px] px-3 py-2 rounded-full bg-red-500/20 text-red-300 border border-red-400/20"
                          >
                            {t('onboarding_remove')}
                          </button>
                        </div>

                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-4 left-4 right-4 bottom-4 border border-[#c8f55a]/20 rounded-2xl" />
                          <div className="absolute top-4 bottom-4 left-1/3 w-px bg-[#c8f55a]/20" />
                          <div className="absolute top-4 bottom-4 right-1/3 w-px bg-[#c8f55a]/20" />
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-2">
                          <div className="rounded-xl border border-white/10 bg-black/60 p-2 text-center">
                            <div className="text-[10px] text-gray-400">{t('scan_vision')}</div>
                            <div className="text-xs text-white font-medium">{t('scan_ready')}</div>
                          </div>
                          <div className="rounded-xl border border-white/10 bg-black/60 p-2 text-center">
                            <div className="text-[10px] text-gray-400">{t('scan_body_type')}</div>
                            <div className="text-xs text-white font-medium">{t('scan_auto_detect')}</div>
                          </div>
                          <div className="rounded-xl border border-white/10 bg-black/60 p-2 text-center">
                            <div className="text-[10px] text-gray-400">{t('scan_fat')}</div>
                            <div className="text-xs text-white font-medium">{t('scan_estimate')}</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white/10 bg-[#111] p-4">
                          <div className="text-xs text-gray-500 mb-1">{t('scan_before')}</div>
                          <div className="text-white font-medium">{t('scan_uploaded')}</div>
                          <div className="text-xs text-gray-500 mt-1">{t('scan_ai_analyze')}</div>
                        </div>

                        <div className="rounded-2xl border border-[#c8f55a]/20 bg-[#c8f55a]/8 p-4 shadow-[0_0_20px_rgba(200,245,90,0.05)]">
                          <div className="text-xs text-gray-500 mb-1">{t('scan_after')}</div>
                          <div className="text-[#c8f55a] font-medium">{t('scan_smart')}</div>
                          <div className="text-xs text-gray-400 mt-1">{t('scan_smart_desc')}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full bg-[#c8f55a] text-black font-semibold py-4 rounded-full mt-2 hover:opacity-90 transition-opacity shadow-[0_0_25px_rgba(200,245,90,0.18)]"
            >
              {t('continue')}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2
              className="text-3xl font-bold text-white mb-2"
              style={{ fontFamily: 'var(--font-clash)' }}
            >
              {t('onboarding_goal_title')}
            </h2>

            <p className="text-gray-500 mb-8">{t('onboarding_goal_subtitle')}</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {GOALS.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setOnboardingData({ goal: g.value as Goal })}
                  className={`p-4 rounded-2xl border text-left transition-all ${onboardingData.goal === g.value
                    ? 'border-[#c8f55a] bg-[#c8f55a]/10 text-[#c8f55a] shadow-[0_0_20px_rgba(200,245,90,0.08)]'
                    : 'border-white/10 bg-[#111] text-white hover:border-white/25'
                    }`}
                >
                  <span className="text-2xl block mb-2">{g.emoji}</span>
                  <span className="text-sm font-medium">{t(g.labelKey)}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!onboardingData.goal || analyzing}
              className="w-full bg-[#c8f55a] text-black font-semibold py-4 rounded-full hover:opacity-90 transition-opacity disabled:opacity-30 shadow-[0_0_25px_rgba(200,245,90,0.18)]"
            >
              {analyzing ? t('loading') : t('onboarding_start_analysis')}
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full text-gray-500 py-3 text-sm mt-2 hover:text-white transition-colors"
            >
              {t('back')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}