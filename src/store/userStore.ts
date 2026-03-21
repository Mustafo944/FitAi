// src/store/userStore.ts

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  UserProfile,
  AnalysisResult,
  DietDay,
  WorkoutDay,
  OnboardingData,
  WeightProgress,
} from '@/types'
import type { Locale } from '@/lib/i18n'

interface UserStore {
  // i18n & theme
  locale: Locale
  setLocale: (locale: Locale) => void
  theme: 'dark' | 'light'
  setTheme: (theme: 'dark' | 'light') => void

  // User info
  userName: string
  userSurname: string
  setUserName: (name: string) => void
  setUserSurname: (surname: string) => void

  onboardingData: OnboardingData
  setOnboardingData: (data: Partial<OnboardingData>) => void
  resetOnboarding: () => void

  profile: UserProfile | null
  setProfile: (profile: UserProfile | null) => void

  analysis: AnalysisResult | null
  setAnalysis: (analysis: AnalysisResult | null) => void

  dietPlan: DietDay[]
  workoutPlan: WorkoutDay[]
  setDietPlan: (plan: DietDay[]) => void
  setWorkoutPlan: (plan: WorkoutDay[]) => void

  progress: WeightProgress[]
  setProgress: (progress: WeightProgress[]) => void
  addProgress: (entry: WeightProgress) => void
  resetProgress: () => void

  isLoading: boolean
  setLoading: (loading: boolean) => void
}

const defaultOnboarding: OnboardingData = {
  height: '',
  weight: '',
  age: '',
  gender: '',
  goal: '',
  image: null,
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      locale: 'uz',
      setLocale: (locale) => set({ locale }),
      theme: 'dark',
      setTheme: (theme) => set({ theme }),

      userName: '',
      userSurname: '',
      setUserName: (userName) => set({ userName }),
      setUserSurname: (userSurname) => set({ userSurname }),

      onboardingData: defaultOnboarding,
      setOnboardingData: (data) =>
        set((s) => ({
          onboardingData: { ...s.onboardingData, ...data },
        })),
      resetOnboarding: () => set({ onboardingData: defaultOnboarding }),

      profile: null,
      setProfile: (profile) => set({ profile }),

      analysis: null,
      setAnalysis: (analysis) => set({ analysis }),

      dietPlan: [],
      workoutPlan: [],
      setDietPlan: (dietPlan) => set({ dietPlan }),
      setWorkoutPlan: (workoutPlan) => set({ workoutPlan }),

      progress: [],
      setProgress: (progress) => set({ progress }),
      addProgress: (entry) =>
        set((s) => ({
          progress: [...s.progress, entry],
        })),
      resetProgress: () => set({ progress: [] }),

      isLoading: false,
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'fitai-store',
      partialize: (s) => ({
        locale: s.locale,
        theme: s.theme,
        userName: s.userName,
        userSurname: s.userSurname,
        onboardingData: s.onboardingData,
        profile: s.profile,
        analysis: s.analysis,
        dietPlan: s.dietPlan,
        workoutPlan: s.workoutPlan,
        progress: s.progress,
      }),
    }
  )
)