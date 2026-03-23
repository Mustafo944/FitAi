import { BMI_CATEGORIES } from './constants'

export function calculateBMI(weightKg, heightCm) {
  const heightM = heightCm / 100
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10
}

export function getBMICategory(bmi) {
  if (bmi < BMI_CATEGORIES.UNDERWEIGHT.max) return BMI_CATEGORIES.UNDERWEIGHT
  if (bmi < BMI_CATEGORIES.NORMAL.max) return BMI_CATEGORIES.NORMAL
  if (bmi < BMI_CATEGORIES.OVERWEIGHT.max) return BMI_CATEGORIES.OVERWEIGHT
  return BMI_CATEGORIES.OBESE
}

// Mifflin-St Jeor formulasi
export function calculateCalories(weightKg, heightCm, age, gender) {
  let bmr

  if (gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161
  }

  const maintenance = Math.round(bmr * 1.55)
  const fatLoss = Math.round(maintenance - 500)

  return { maintenance, fatLoss }
}
