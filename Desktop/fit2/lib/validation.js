import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  MIN_AGE,
  MAX_AGE,
  MIN_HEIGHT,
  MAX_HEIGHT,
  MIN_WEIGHT,
  MAX_WEIGHT,
} from './constants'

export function validateProfileData({ height, weight, age, gender }) {
  const errors = []

  const h = Number(height)
  const w = Number(weight)
  const a = Number(age)

  if (!h || h < MIN_HEIGHT || h > MAX_HEIGHT) {
    errors.push(`Bo'y ${MIN_HEIGHT}–${MAX_HEIGHT} sm orasida bo'lishi kerak`)
  }

  if (!w || w < MIN_WEIGHT || w > MAX_WEIGHT) {
    errors.push(`Vazn ${MIN_WEIGHT}–${MAX_WEIGHT} kg orasida bo'lishi kerak`)
  }

  if (!a || a < MIN_AGE || a > MAX_AGE) {
    errors.push(`Yosh ${MIN_AGE}–${MAX_AGE} orasida bo'lishi kerak`)
  }

  if (!['male', 'female'].includes(gender)) {
    errors.push("Jinsni tanlang")
  }

  return { valid: errors.length === 0, errors }
}

export function validateImage(file) {
  const errors = []

  if (!file) {
    errors.push("Rasm tanlang")
    return { valid: false, errors }
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    errors.push("Faqat JPG, PNG yoki WebP formatlar qabul qilinadi")
  }

  if (file.size > MAX_IMAGE_SIZE) {
    errors.push("Rasm hajmi 5 MB dan oshmasligi kerak")
  }

  return { valid: errors.length === 0, errors }
}

export function validateAnalysisResult(result) {
  if (!result || typeof result !== 'object') return false

  const requiredFields = [
    'summary',
    'bmi',
    'estimated_calories',
    'body_observations',
    'strengths',
    'improvement_areas',
    'workout_plan',
    'diet_tips',
    'safety_note',
  ]

  return requiredFields.every((field) => field in result)
}
