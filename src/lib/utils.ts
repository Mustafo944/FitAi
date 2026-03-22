// src/lib/utils.ts

/**
 * BMI (Body Mass Index) hisoblash
 * @param weight - Vazn (kg)
 * @param height - Bo'y (cm)
 * @returns BMI qiymati
 */
export function calculateBMI(weight: number, height: number): number {
  if (weight <= 0 || height <= 0) return 0
  const heightInMeters = height / 100
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1))
}

/**
 * BMI statusini aniqlash
 * @param bmi - BMI qiymati
 * @returns BMI status kaliti
 */
export function getBMIStatus(bmi: number): string {
  if (bmi < 18.5) return 'bmi_underweight'
  if (bmi < 25) return 'bmi_normal'
  if (bmi < 30) return 'bmi_overweight'
  return 'bmi_obese'
}

/**
 * Kunlik kaloriya ehtiyojini hisoblash (Mifflin-St Jeor formula)
 * @param weight - Vazn (kg)
 * @param height - Bo'y (cm)
 * @param age - Yosh
 * @param gender - Jins ('male' | 'female')
 * @param activityLevel - Faollik darajasi (1.2 - 1.9)
 * @returns Kunlik kaloriya ehtiyoji
 */
export function calculateCalories(
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female',
  activityLevel: number = 1.2
): number {
  let bmr: number

  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  }

  return Math.round(bmr * activityLevel)
}

/**
 * Maqsadga qarab kaloriya o'zgartirish
 * @param baseCalories - Asosiy kaloriya
 * @param goal - Maqsad ('weight_loss' | 'muscle_gain' | 'maintain')
 * @returns Yangi kaloriya miqdori
 */
export function adjustCaloriesForGoal(
  baseCalories: number,
  goal: 'weight_loss' | 'muscle_gain' | 'maintain'
): number {
  switch (goal) {
    case 'weight_loss':
      return baseCalories - 500
    case 'muscle_gain':
      return baseCalories + 300
    case 'maintain':
    default:
      return baseCalories
  }
}

/**
 * Ideal vaznni hisoblash (Devine formula)
 * @param height - Bo'y (cm)
 * @param gender - Jins
 * @returns Ideal vazn (kg)
 */
export function calculateIdealWeight(
  height: number,
  gender: 'male' | 'female'
): number {
  const heightInInches = height / 2.54
  const baseHeight = 60 // 5 feet

  if (heightInInches <= baseHeight) {
    return gender === 'male' ? 50 : 45.5
  }

  const inchesOver5Feet = heightInInches - baseHeight

  if (gender === 'male') {
    return parseFloat((50 + 2.3 * inchesOver5Feet).toFixed(1))
  }

  return parseFloat((45.5 + 2.3 * inchesOver5Feet).toFixed(1))
}

/**
 * Yog' foizini taxmin qilish (BMI asosida)
 * @param bmi - BMI qiymati
 * @param age - Yosh
 * @param gender - Jins
 * @returns Yog' foizi
 */
export function estimateBodyFatPercentage(
  bmi: number,
  age: number,
  gender: 'male' | 'female'
): number {
  let bodyFat: number

  if (gender === 'male') {
    bodyFat = 1.2 * bmi + 0.23 * age - 16.2
  } else {
    bodyFat = 1.2 * bmi + 0.23 * age - 5.4
  }

  return parseFloat(Math.max(bodyFat, 5).toFixed(1))
}

/**
 * Haftalar sonini hisoblash maqsadga yetish uchun
 * @param currentWeight - Hozirgi vazn
 * @param targetWeight - Maqsadli vazn
 * @param lossPerWeek - Haftalik yo'qotish (kg)
 * @returns Haftalar soni
 */
export function calculateWeeksToGoal(
  currentWeight: number,
  targetWeight: number,
  lossPerWeek: number = 0.5
): number {
  const diff = currentWeight - targetWeight
  if (diff <= 0) return 0
  return Math.ceil(Math.abs(diff) / lossPerWeek)
}

/**
 * Suv ehtiyojini hisoblash (litrlarda)
 * @param weight - Vazn (kg)
 * @returns Suv ehtiyoji (litrlarda)
 */
export function calculateWaterIntake(weight: number): number {
  return parseFloat((weight * 0.033).toFixed(1))
}

/**
 * LocalStorage helper
 */
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : defaultValue
    } catch {
      return defaultValue
    }
  },
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  },
  remove: (key: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  },
  clear: (): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  },
}

/**
 * Format number with locale
 */
export function formatNumber(num: number, locale: string = 'uz'): string {
  return new Intl.NumberFormat(locale === 'uz' ? 'uz-UZ' : 'ru-RU').format(num)
}

/**
 * Format date to relative time (uz/ru)
 */
export function formatRelativeTime(date: Date, locale: 'uz' | 'ru' = 'uz'): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) {
    return locale === 'uz' ? 'Hoziroq' : 'Только что'
  }
  if (diffMins < 60) {
    return locale === 'uz' ? `${diffMins} daqiqa oldin` : `${diffMins} мин. назад`
  }
  if (diffHours < 24) {
    return locale === 'uz' ? `${diffHours} soat oldin` : `${diffHours} час. назад`
  }
  if (diffDays < 7) {
    return locale === 'uz' ? `${diffDays} kun oldin` : `${diffDays} дн. назад`
  }

  return date.toLocaleDateString(locale === 'uz' ? 'uz-UZ' : 'ru-RU')
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length === 0
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
