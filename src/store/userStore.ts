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

interface UserStore {
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