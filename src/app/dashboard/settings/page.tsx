'use client'
// src/app/dashboard/settings/page.tsx

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import { useTranslation } from '@/lib/i18n'
import { createClient } from '@/lib/supabase'
import type { Gender, Goal } from '@/types'
import toast from 'react-hot-toast'
import BottomNav from '@/components/BottomNav'

const GOALS = [
  { value: 'weight_loss', emoji: '🔥' },
  { value: 'muscle_gain', emoji: '💪' },
  { value: 'maintain', emoji: '⚖️' },
  { value: 'healthy_life', emoji: '🏃' },
]

const goalLabelKeys = {
  weight_loss: 'onboarding_goal_loss',
  muscle_gain: 'onboarding_goal_gain',
  maintain: 'onboarding_goal_maintain',
  healthy_life: 'onboarding_goal_healthy',
} as const

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const { t } = useTranslation()

  const {
    theme,
    setTheme,
    userName,
    setUserName,
    userSurname,
    setUserSurname,
    onboardingData,
    setOnboardingData,
    resetOnboarding,
    setAnalysis,
    setDietPlan,
    setWorkoutPlan,
  } = useUserStore()

  const [editingProfile, setEditingProfile] = useState(false)
  const [localHeight, setLocalHeight] = useState(onboardingData.height)
  const [localWeight, setLocalWeight] = useState(onboardingData.weight)
  const [localAge, setLocalAge] = useState(onboardingData.age)
  const [localGender, setLocalGender] = useState(onboardingData.gender)
  const [localGoal, setLocalGoal] = useState(onboardingData.goal)

  useEffect(() => {
    // Til sozlamasi faqat settings sahifasida ko'rinadi
    // Bu yerda hech qanday redirect kerak emas
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()

    resetOnboarding()
    setAnalysis(null)
    setDietPlan([])
    setWorkoutPlan([])

    localStorage.setItem('lang_selected', 'true')

    router.push('/')
    router.refresh()
  }

  const handleSaveProfile = () => {
    setOnboardingData({
      height: localHeight,
      weight: localWeight,
      age: localAge,
      gender: localGender as Gender,
      goal: localGoal as Goal,
    })
    setEditingProfile(false)
    toast.success(t('settings_saved'))
  }

  const handleReanalyze = () => {
    setAnalysis(null)
    setDietPlan([])
    setWorkoutPlan([])
    router.push('/onboarding?reanalyze=true')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      {/* Header */}
      <div className="border-b border-white/8 px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-bold" style={{ fontFamily: 'var(--font-clash)' }}>
          Fit<span className="text-[#c8f55a]">AI</span>
        </div>
        <button
          onClick={handleLogout}
          type="button"
          className="text-gray-500 text-sm hover:text-red-400 transition-colors px-3 py-2"
        >
          {t('logout')}
        </button>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        <h1
          className="text-2xl font-bold mb-6"
          style={{ fontFamily: 'var(--font-clash)' }}
        >
          ⚙️ {t('settings_title')}
        </h1>

        {/* Name & Surname */}
        <div className="bg-[#111] border border-white/8 rounded-2xl p-5 mb-4">
          <div className="text-xs text-[#c8f55a] font-semibold mb-4">
            👤 {t('settings_name')} / {t('settings_surname')}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                {t('settings_name')}
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={t('settings_name_placeholder')}
                className="w-full bg-[#0a0a0a] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#c8f55a] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                {t('settings_surname')}
              </label>
              <input
                type="text"
                value={userSurname}
                onChange={(e) => setUserSurname(e.target.value)}
                placeholder={t('settings_surname_placeholder')}
                className="w-full bg-[#0a0a0a] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#c8f55a] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="bg-[#111] border border-white/8 rounded-2xl p-5 mb-4">
          <div className="text-xs text-[#c8f55a] font-semibold mb-4">
            🎨 {t('settings_theme')}
          </div>

          <div className="flex gap-3">
            {(['dark', 'light'] as const).map((th) => (
              <button
                key={th}
                onClick={() => setTheme(th)}
                type="button"
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${theme === th
                  ? 'bg-[#c8f55a] text-black shadow-[0_0_20px_rgba(200,245,90,0.15)]'
                  : 'bg-[#0a0a0a] border border-white/10 text-gray-400 hover:border-white/20'
                  }`}
              >
                {th === 'dark'
                  ? `🌙 ${t('settings_theme_dark')}`
                  : `☀️ ${t('settings_theme_light')}`}
              </button>
            ))}
          </div>
        </div>

        {/* Profile data */}
        <div className="bg-[#111] border border-white/8 rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-[#c8f55a] font-semibold">
              📋 {t('settings_profile')}
            </div>

            <button
              onClick={() => setEditingProfile(!editingProfile)}
              type="button"
              className="text-xs text-[#c8f55a] hover:text-white transition-colors"
            >
              {editingProfile ? t('cancel') : t('settings_edit_profile')}
            </button>
          </div>

          {!editingProfile ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0a0a0a] rounded-xl p-3">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                  {t('onboarding_height')}
                </div>
                <div className="text-white font-semibold">
                  {onboardingData.height || '—'} sm
                </div>
              </div>

              <div className="bg-[#0a0a0a] rounded-xl p-3">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                  {t('onboarding_weight')}
                </div>
                <div className="text-white font-semibold">
                  {onboardingData.weight || '—'} kg
                </div>
              </div>

              <div className="bg-[#0a0a0a] rounded-xl p-3">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                  {t('onboarding_age')}
                </div>
                <div className="text-white font-semibold">
                  {onboardingData.age || '—'}
                </div>
              </div>

              <div className="bg-[#0a0a0a] rounded-xl p-3">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                  {t('onboarding_gender')}
                </div>
                <div className="text-white font-semibold">
                  {onboardingData.gender === 'male'
                    ? t('onboarding_gender_male')
                    : onboardingData.gender === 'female'
                      ? t('onboarding_gender_female')
                      : '—'}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    {t('onboarding_height')}
                  </label>
                  <input
                    type="number"
                    value={localHeight}
                    onChange={(e) => setLocalHeight(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#c8f55a]"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    {t('onboarding_weight')}
                  </label>
                  <input
                    type="number"
                    value={localWeight}
                    onChange={(e) => setLocalWeight(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#c8f55a]"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    {t('onboarding_age')}
                  </label>
                  <input
                    type="number"
                    value={localAge}
                    onChange={(e) => setLocalAge(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#c8f55a]"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    {t('onboarding_gender')}
                  </label>
                  <div className="flex gap-2">
                    {(['male', 'female'] as Gender[]).map((g) => (
                      <button
                        key={g}
                        onClick={() => setLocalGender(g)}
                        type="button"
                        className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${localGender === g
                          ? 'bg-[#c8f55a]/15 border border-[#c8f55a] text-[#c8f55a]'
                          : 'bg-[#0a0a0a] border border-white/10 text-gray-400'
                          }`}
                      >
                        {g === 'male'
                          ? `🚹 ${t('onboarding_gender_male')}`
                          : `🚺 ${t('onboarding_gender_female')}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-2 block">
                  {t('onboarding_goal_title')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {GOALS.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => setLocalGoal(g.value as Goal)}
                      type="button"
                      className={`p-3 rounded-xl border text-left text-sm transition-all ${localGoal === g.value
                        ? 'border-[#c8f55a] bg-[#c8f55a]/10 text-[#c8f55a]'
                        : 'border-white/10 bg-[#0a0a0a] text-gray-400 hover:border-white/20'
                        }`}
                    >
                      <span className="mr-2">{g.emoji}</span>
                      {t(goalLabelKeys[g.value as keyof typeof goalLabelKeys])}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                type="button"
                className="w-full bg-[#c8f55a] text-black font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                {t('save')}
              </button>
            </div>
          )}
        </div>

        {/* Reanalyze */}
        <button
          onClick={handleReanalyze}
          type="button"
          className="w-full bg-[#111] border border-[#c8f55a]/30 text-[#c8f55a] font-semibold py-4 rounded-2xl hover:bg-[#c8f55a]/10 transition-all mb-4"
        >
          🤖 {t('settings_reanalyze')}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          type="button"
          className="w-full bg-red-500/10 border border-red-500/20 text-red-400 font-semibold py-4 rounded-2xl hover:bg-red-500/20 transition-all"
        >
          🚪 {t('logout')}
        </button>
      </div>

      <BottomNav />
    </div>
  )
}