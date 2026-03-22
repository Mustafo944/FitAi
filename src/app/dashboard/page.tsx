'use client'
// src/app/dashboard/page.tsx

import { useUserStore } from '@/store/userStore'
import { useTranslation, getLoc } from '@/lib/i18n'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const { t, locale } = useTranslation()
  const {
    analysis,
    dietPlan,
    workoutPlan,
    resetOnboarding,
    setAnalysis,
    setDietPlan,
    setWorkoutPlan,
    userName,
  } = useUserStore()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    resetOnboarding()
    setAnalysis(null)
    setDietPlan([])
    setWorkoutPlan([])
    router.push('/')
    router.refresh()
  }

  useEffect(() => {
    // Dashboard - faqat authorized user uchun
    // Agar analysis yo'q bo'lsa, onboarding ga redirect
    if (!analysis) {
      router.replace('/onboarding')
    }
  }, [analysis, router])

  if (!analysis) return null

  const bodyTypeLabels: Record<string, string> = {
    ectomorph: t('body_ectomorph'),
    mesomorph: t('body_mesomorph'),
    endomorph: t('body_endomorph'),
    unknown: t('body_unknown'),
  }

  const levelLabels: Record<string, string> = {
    beginner: t('level_beginner'),
    intermediate: t('level_intermediate'),
    advanced: t('level_advanced'),
    elite: t('level_elite'),
  }

  const featureLabels = {
    belly_fat: { low: t('feat_low'), medium: t('feat_medium'), high: t('feat_high') },
    muscle_visibility: { low: t('feat_low'), medium: t('feat_medium'), high: t('feat_high') },
    posture: { good: t('feat_good'), average: t('feat_average'), bad: t('feat_bad') },
  }

  const bmiLabel = (bmi: number) => {
    if (bmi < 18.5) return { text: t('bmi_underweight'), color: '#60a5fa' }
    if (bmi < 25) return { text: t('bmi_normal'), color: '#c8f55a' }
    if (bmi < 30) return { text: t('bmi_overweight'), color: '#fbbf24' }
    return { text: t('bmi_obese'), color: '#f87171' }
  }

  const getScoreColor = (score: number) => {
    if (score < 50) return '#f87171'
    if (score < 70) return '#fbbf24'
    if (score < 85) return '#c8f55a'
    return '#4ade80'
  }

  const getLevelColor = (level: string) => {
    if (level === 'beginner') return 'text-red-400 border-red-400/20 bg-red-400/10'
    if (level === 'intermediate') return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10'
    if (level === 'advanced') return 'text-lime-400 border-lime-400/20 bg-lime-400/10'
    return 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10'
  }

  const safeAnalysis = {
    bmi: typeof analysis?.bmi === 'number' ? analysis.bmi : 0,
    fat_percentage: typeof analysis?.fat_percentage === 'number' ? analysis.fat_percentage : 0,
    body_type: analysis?.body_type || 'unknown',
    weight_loss_estimate: typeof analysis?.weight_loss_estimate === 'number' ? analysis.weight_loss_estimate : 0,
    ai_summary: analysis?.ai_summary || '',
    recommendations: Array.isArray(analysis?.recommendations) ? analysis.recommendations : [],
    body_score: typeof analysis?.body_score === 'number' ? analysis.body_score : 0,
    confidence: typeof analysis?.confidence === 'number' ? analysis.confidence : 0,
    image_quality: analysis?.image_quality || 'low',
    level: analysis?.level || 'beginner',
    weeks_to_goal: typeof analysis?.weeks_to_goal === 'number' ? analysis.weeks_to_goal : 0,
    coach_message: analysis?.coach_message || '',
    features: {
      belly_fat: analysis?.features?.belly_fat || 'medium',
      muscle_visibility: analysis?.features?.muscle_visibility || 'medium',
      posture: analysis?.features?.posture || 'average',
    },
  }

  const bmi = typeof analysis?.bmi === 'number' ? bmiLabel(analysis.bmi) : { text: t('body_unknown'), color: '#999999' }
  const scoreColor = getScoreColor(safeAnalysis.body_score)
  const scoreWidth = `${Math.max(6, Math.min(100, safeAnalysis.body_score))}%`
  const todayDiet = Array.isArray(dietPlan) ? dietPlan[0] : null
  const todayWorkout = Array.isArray(workoutPlan) ? workoutPlan[0] : null

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24 md:pb-8">
      <div className="border-b border-white/8 px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-bold" style={{ fontFamily: 'var(--font-clash)' }}>
          Fit<span className="text-[#c8f55a]">AI</span>
        </div>

        <div className="flex items-center gap-3">
          {userName && (
            <span className="text-xs text-gray-400 hidden md:inline">
              {userName}
            </span>
          )}
          <span className="text-xs bg-[#c8f55a]/10 text-[#c8f55a] border border-[#c8f55a]/20 px-3 py-1 rounded-full font-medium">
            {t('freeplan')}
          </span>

          <Link href="/dashboard/settings" className="text-gray-500 text-sm hover:text-white transition-colors px-2 py-2 hidden md:inline-flex">
            ⚙️
          </Link>

          <button
            onClick={handleLogout}
            className="text-gray-500 text-sm hover:text-white transition-colors px-3 py-2 hidden md:inline-flex"
          >
            {t('logout')}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 md:py-8">
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-clash)' }}>
            {t('dash_results')}
          </h1>
          <p className="text-gray-500 text-sm mb-6">{t('dash_your_metrics')}</p>

          <div className="flex items-center gap-2 md:gap-3 mb-5 flex-wrap">
            <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${getLevelColor(safeAnalysis.level)}`}>
              {t('dash_level')}: {levelLabels[safeAnalysis.level] || safeAnalysis.level}
            </span>

            <span className="text-xs px-3 py-1 rounded-full border border-white/10 bg-white/5 text-gray-300">
              {t('dash_confidence')}: {safeAnalysis.confidence}%
            </span>

            <span className="text-xs px-3 py-1 rounded-full border border-white/10 bg-white/5 text-gray-300">
              {t('dash_image_quality')}: {safeAnalysis.image_quality}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[#111] border border-white/8 rounded-2xl p-4 md:p-5 text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color: bmi.color, fontFamily: 'var(--font-clash)' }}>
                {safeAnalysis.bmi.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">{t('dash_bmi')}</div>
              <div className="text-xs mt-1 font-medium" style={{ color: bmi.color }}>{bmi.text}</div>
            </div>

            <div className="bg-[#111] border border-white/8 rounded-2xl p-4 md:p-5 text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#ff6b35] mb-1" style={{ fontFamily: 'var(--font-clash)' }}>
                {safeAnalysis.fat_percentage}%
              </div>
              <div className="text-xs text-gray-500">{t('dash_fat')}</div>
            </div>

            <div className="bg-[#111] border border-white/8 rounded-2xl p-4 md:p-5 text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-clash)' }}>
                {bodyTypeLabels[safeAnalysis.body_type] || safeAnalysis.body_type}
              </div>
              <div className="text-xs text-gray-500">{t('dash_body_type')}</div>
            </div>

            <div className="bg-[#c8f55a]/8 border border-[#c8f55a]/25 rounded-2xl p-4 md:p-5 text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#c8f55a] mb-1" style={{ fontFamily: 'var(--font-clash)' }}>
                ~{safeAnalysis.weight_loss_estimate} kg
              </div>
              <div className="text-xs text-gray-500">{t('dash_estimate')}</div>
            </div>
          </div>

          <div className="bg-[#111] border border-white/8 rounded-2xl p-5 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-white">{t('dash_body_score')}</div>
              <div className="text-2xl font-bold" style={{ color: scoreColor, fontFamily: 'var(--font-clash)' }}>
                {safeAnalysis.body_score}/100
              </div>
            </div>

            <div className="w-full h-3 rounded-full bg-white/8 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: scoreWidth, backgroundColor: scoreColor }} />
            </div>

            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>{t('dash_low')}</span>
              <span>{t('dash_medium')}</span>
              <span>{t('dash_high')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[#111] border border-white/8 rounded-2xl p-4">
              <div className="text-xs text-gray-500 mb-1">{t('dash_belly_fat')}</div>
              <div className="text-lg font-semibold text-white">
                {featureLabels.belly_fat[safeAnalysis.features.belly_fat as keyof typeof featureLabels.belly_fat] || safeAnalysis.features.belly_fat}
              </div>
            </div>

            <div className="bg-[#111] border border-white/8 rounded-2xl p-4">
              <div className="text-xs text-gray-500 mb-1">{t('dash_muscle')}</div>
              <div className="text-lg font-semibold text-white">
                {featureLabels.muscle_visibility[safeAnalysis.features.muscle_visibility as keyof typeof featureLabels.muscle_visibility] || safeAnalysis.features.muscle_visibility}
              </div>
            </div>

            <div className="bg-[#111] border border-white/8 rounded-2xl p-4">
              <div className="text-xs text-gray-500 mb-1">{t('dash_posture')}</div>
              <div className="text-lg font-semibold text-white">
                {featureLabels.posture[safeAnalysis.features.posture as keyof typeof featureLabels.posture] || safeAnalysis.features.posture}
              </div>
            </div>

            <div className="bg-[#111] border border-white/8 rounded-2xl p-4">
              <div className="text-xs text-gray-500 mb-1">{t('dash_goal_time')}</div>
              <div className="text-lg font-semibold text-[#c8f55a]">
                {safeAnalysis.weeks_to_goal > 0 ? `${safeAnalysis.weeks_to_goal} ${t('dash_weeks')}` : t('dash_calculating')}
              </div>
            </div>
          </div>

          <div className="bg-[#c8f55a]/8 border border-[#c8f55a]/25 rounded-2xl p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-[#c8f55a] font-semibold">{t('dash_ai_coach')}</div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${safeAnalysis.body_score >= 80 ? 'bg-green-500/15 text-green-400'
                  : safeAnalysis.body_score >= 60 ? 'bg-yellow-500/15 text-yellow-400'
                    : 'bg-red-500/15 text-red-400'
                }`}>
                {safeAnalysis.body_score >= 80 && t('dash_excellent')}
                {safeAnalysis.body_score >= 60 && safeAnalysis.body_score < 80 && t('dash_good')}
                {safeAnalysis.body_score < 60 && t('dash_needs_work')}
              </span>
            </div>

            <p className="text-sm text-gray-200 leading-relaxed mb-4">{getLoc(safeAnalysis.coach_message, locale)}</p>

            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <div className="bg-black/20 border border-white/5 rounded-xl p-3 text-center">
                <div className="text-[11px] text-gray-500 mb-1">{t('dash_score')}</div>
                <div className="text-white font-semibold">{safeAnalysis.body_score}</div>
              </div>
              <div className="bg-black/20 border border-white/5 rounded-xl p-3 text-center">
                <div className="text-[11px] text-gray-500 mb-1">{t('dash_level')}</div>
                <div className="text-white font-semibold">{levelLabels[safeAnalysis.level]}</div>
              </div>
              <div className="bg-black/20 border border-white/5 rounded-xl p-3 text-center">
                <div className="text-[11px] text-gray-500 mb-1">{t('dash_goal_time')}</div>
                <div className="text-white font-semibold">{safeAnalysis.weeks_to_goal} {t('dash_weeks')}</div>
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
            <div className="text-xs text-[#c8f55a] font-semibold mb-2">{t('dash_ai_summary')}</div>
            <p className="text-gray-300 text-sm leading-relaxed">{getLoc(safeAnalysis.ai_summary, locale)}</p>

            {safeAnalysis.recommendations.length > 0 && (
              <ul className="mt-3 space-y-1">
                {safeAnalysis.recommendations.map((r: any, i: number) => (
                  <li key={i} className="text-sm text-gray-500 flex gap-2">
                    <span className="text-[#c8f55a] mt-0.5">→</span>
                    <span>{getLoc(r, locale)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold" style={{ fontFamily: 'var(--font-clash)' }}>
              {t('dash_today_plan')}
            </h2>
            <span className="text-xs text-gray-500">{t('dash_1day')}</span>
          </div>

          {todayDiet && (
            <Link href="/dashboard/diet">
              <div className="bg-[#111] border border-white/8 rounded-2xl p-4 md:p-5 mb-3 hover:border-white/20 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🍽️</span>
                    <span className="font-semibold">{t('dash_today_diet')}</span>
                  </div>
                  <span className="text-xs text-[#c8f55a] font-medium">
                    {todayDiet.total_calories ?? 0} {t('diet_kcal')} →
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {todayDiet.meals?.slice(0, 3).map(
                    (meal: { time?: string; name?: any; total_calories?: number }, i: number) => (
                      <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
                        <div className="text-xs text-gray-400 mb-1">{meal.time || '--:--'}</div>
                        <div className="text-[13px] font-medium truncate">{getLoc(meal.name, locale)}</div>
                        <div className="text-xs text-[#c8f55a] mt-1">{meal.total_calories ?? 0} {t('diet_kcal')}</div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </Link>
          )}

          {todayWorkout && (
            <Link href="/dashboard/workout">
              <div className="bg-[#111] border border-white/8 rounded-2xl p-4 md:p-5 hover:border-white/20 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💪</span>
                    <span className="font-semibold">{getLoc(todayWorkout.title, locale) || t('dash_workout')}</span>
                  </div>
                  <span className="text-xs text-[#c8f55a] font-medium">
                    {todayWorkout.duration ?? 0} {t('workout_min')} →
                  </span>
                </div>

                <div className="flex gap-3 text-sm text-gray-400">
                  <span>🔥 {todayWorkout.calories_burned ?? 0} {t('diet_kcal')}</span>
                  <span>· {todayWorkout.exercises?.length ?? 0} {t('nav_workout').toLowerCase()}</span>
                </div>
              </div>
            </Link>
          )}

          <Link href="/dashboard/progress">
            <div className="bg-[#111] border border-white/8 rounded-2xl p-4 md:p-5 mt-3 hover:border-white/20 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📊</span>
                  <span className="font-semibold">{t('dash_progress')}</span>
                </div>
                <span className="text-xs text-[#c8f55a] font-medium">{t('dash_view')}</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-gradient-to-br from-[#c8f55a]/10 to-[#c8f55a]/5 border border-[#c8f55a]/20 rounded-2xl p-6 text-center">
          <div className="text-2xl mb-2">🚀</div>
          <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-clash)' }}>
            {t('dash_pro_title')}
          </h3>
          <p className="text-gray-400 text-sm mb-4">{t('dash_pro_desc')}</p>
          <button className="bg-[#c8f55a] text-black font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
            {t('dash_pro_btn')}
          </button>
          <p className="text-xs text-gray-600 mt-3">{t('dash_pro_cancel')}</p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}