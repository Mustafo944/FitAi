// src/types/index.ts

export type Goal = 'weight_loss' | 'muscle_gain' | 'maintain' | 'healthy_life'
export type Gender = 'male' | 'female'
export type BodyType = 'ectomorph' | 'mesomorph' | 'endomorph' | 'unknown'
export type PlanType = 'free' | 'pro_monthly' | 'pro_yearly'

export type ImageQuality = 'low' | 'medium' | 'high'
export type UserLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite'
export type BellyFatLevel = 'low' | 'medium' | 'high'
export type MuscleVisibilityLevel = 'low' | 'medium' | 'high'
export type PostureLevel = 'good' | 'average' | 'bad'

export interface UserProfile {
  id: string
  height: number
  weight: number
  age: number
  gender: Gender
  goal: Goal
  body_type?: BodyType
  bmi?: number
  fat_percentage?: number
  plan_type: PlanType
  created_at: string
}

export interface AnalysisFeatures {
  belly_fat: BellyFatLevel
  muscle_visibility: MuscleVisibilityLevel
  posture: PostureLevel
}

export interface AnalysisResult {
  id: string
  bmi: number
  fat_percentage: number
  body_type: BodyType
  ai_summary: string
  weight_loss_estimate: number
  recommendations: string[]

  body_score?: number
  confidence?: number
  image_quality?: ImageQuality

  level?: UserLevel
  weeks_to_goal?: number
  features?: AnalysisFeatures
  coach_message?: string

  created_at: string
}

export interface Meal {
  name: string
  time: string
  foods: FoodItem[]
  total_calories: number
  recipe?: Recipe
}

export interface FoodItem {
  name: string
  amount: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface Recipe {
  ingredients: string[]
  steps: string[]
  cook_time: number
}

export interface DietDay {
  day: number
  meals: Meal[]
  total_calories: number
  water_intake: number
}

export interface Exercise {
  name: string
  sets?: number
  reps?: string
  duration?: number
  rest: number
  description: string
  muscle_group: string
  video_url?: string
}

export interface WorkoutDay {
  day: number
  title: string
  exercises: Exercise[]
  duration: number
  calories_burned: number
}

export interface WeightProgress {
  week: number
  estimated_weight: number
  actual_weight?: number
}

export interface OnboardingData {
  height: string
  weight: string
  age: string
  gender: Gender | ''
  goal: Goal | ''
  image: File | null
}