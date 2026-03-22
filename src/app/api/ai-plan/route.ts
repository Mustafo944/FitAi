import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function generateWithRetry(model: any, content: unknown[], retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(content)
      const text = result.response.text()
      if (!text) throw new Error('Bo\'sh javob qaytdi')
      return text
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`[AI] attempt ${i + 1} failed:`, msg)

      const isRateLimit = msg.includes('429') || msg.includes('rate') ||
        msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')

      if (isRateLimit && i < retries - 1) {
        const wait = 8000 * (i + 1)
        console.log(`[AI] rate limit, waiting ${wait}ms...`)
        await new Promise((res) => setTimeout(res, wait))
        continue
      }

      throw err
    }
  }

  throw new Error('AI javob bermadi')
}

function clamp(num: number, min: number, max: number) {
  return Math.max(min, Math.min(max, num))
}

function getFormulaFatPercentage(bmi: number, age: number, gender: string) {
  const raw =
    gender === 'male'
      ? 1.2 * bmi + 0.23 * age - 16.2
      : 1.2 * bmi + 0.23 * age - 5.4

  return Math.round(clamp(raw, 5, 50))
}

function getFormulaBodyType(
  fatPct: number,
  gender: string
): 'ectomorph' | 'mesomorph' | 'endomorph' {
  if (gender === 'male') {
    if (fatPct < 15) return 'ectomorph'
    if (fatPct < 25) return 'mesomorph'
    return 'endomorph'
  }

  if (fatPct < 22) return 'ectomorph'
  if (fatPct < 32) return 'mesomorph'
  return 'endomorph'
}

function getLevel(score: number) {
  if (score < 50) return 'beginner'
  if (score < 70) return 'intermediate'
  if (score < 85) return 'advanced'
  return 'elite'
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'GEMINI_API_KEY topilmadi' },
        { status: 500 }
      )
    }

    const contentType = req.headers.get('content-type') || ''

    let image: File | null = null
    let height = 0
    let weight = 0
    let age = 0
    let gender = ''
    let goal = ''
    let locale = 'uz'
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      image = formData.get('image') as File | null
      height = Number(formData.get('height'))
      weight = Number(formData.get('weight'))
      age = Number(formData.get('age'))
      gender = String(formData.get('gender') || '').trim()
      goal = String(formData.get('goal') || '').trim()
      locale = String(formData.get('locale') || 'uz').trim()
    } else {
      const body = await req.json()
      height = Number(body.height)
      weight = Number(body.weight)
      age = Number(body.age)
      gender = String(body.gender || '').trim()
      goal = String(body.goal || '').trim()
      locale = String(body.locale || 'uz').trim()
    }

    if (!height || !weight || !age || !gender || !goal) {
      return NextResponse.json(
        { success: false, error: "Ma'lumotlar yetarli emas" },
        { status: 400 }
      )
    }

    if (
      height < 100 || height > 250 ||
      weight < 30 || weight > 300 ||
      age < 10 || age > 100 ||
      !['male', 'female'].includes(gender) ||
      !['weight_loss', 'muscle_gain', 'maintain', 'healthy_life'].includes(goal)
    ) {
      return NextResponse.json(
        { success: false, error: "Kiritilgan ma'lumotlar noto'g'ri" },
        { status: 400 }
      )
    }

    const isImageFile = image instanceof File && image.size > 0
    let base64Data = ''

    if (isImageFile && image) {
      const bytes = await image.arrayBuffer()
      base64Data = Buffer.from(bytes).toString('base64')
    }

    const bmi = weight / Math.pow(height / 100, 2)

    const bmr =
      gender === 'male'
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161

    const targetCalories =
      goal === 'weight_loss'
        ? Math.round(bmr * 1.3 - 500)
        : goal === 'muscle_gain'
          ? Math.round(bmr * 1.5 + 300)
          : Math.round(bmr * 1.4)

    const formulaFatPct = getFormulaFatPercentage(bmi, age, gender)
    const formulaBodyType = getFormulaBodyType(formulaFatPct, gender)

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    })

    const prompt = `
You are a HIGH-LEVEL professional fitness coach, body analyst and nutrition expert.

STRICT RULES:
- You MUST respond ONLY in ${locale === 'ru' ? 'Russian' : 'Uzbek'} language
- DO NOT use English at all
- DO NOT explain anything outside JSON
- DO NOT return markdown
- Return ONLY valid JSON

YOUR TASK:
Analyze user's body deeply like a real coach.

PRIORITY:
1. If image exists → visual analysis is PRIMARY
2. If image weak → combine with formulas
3. Give realistic and personalized feedback (NOT generic)

USER DATA:
- Height: ${height}
- Weight: ${weight}
- Age: ${age}
- Gender: ${gender}
- Goal: ${goal}

FORMULAS:
- BMI: ${bmi.toFixed(1)}
- Fat: ${formulaFatPct}
- Body type: ${formulaBodyType}

ANALYZE:
- body composition
- fat distribution
- muscle visibility
- posture
- realistic fitness level

YOU MUST:
- think like real coach
- identify weaknesses
- give actionable advice
- be specific (NO generic phrases)

FEATURES:
- belly_fat: low | medium | high
- muscle_visibility: low | medium | high
- posture: good | average | bad

RETURN JSON:

{
  "vision_analysis": {
    "body_type": "ectomorph|mesomorph|endomorph",
    "fat_percentage": number,
    "body_score": number (0-100),
    "confidence": number (0-100),
    "image_quality": "low|medium|high",
    "ai_summary": "TEXT",
    "recommendations": ["TEXT", "TEXT"],
    "features": {
      "belly_fat": "low|medium|high",
      "muscle_visibility": "low|medium|high",
      "posture": "good|average|bad"
    }
  }
}
`

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content: any[] = []

    if (isImageFile && image) {
      content.push({
        inlineData: {
          data: base64Data,
          mimeType: image.type,
        },
      })
    }

    content.push({ text: prompt })

    const text = await generateWithRetry(model, content)
    const cleanedText = text.replace(/```json|```/g, '').trim()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let parsed: any

    try {
      parsed = JSON.parse(cleanedText)
    } catch {
      const match = cleanedText.match(/\{[\s\S]*\}/)
      if (!match) {
        throw new Error("AI noto'g'ri JSON qaytardi")
      }
      parsed = JSON.parse(match[0])
    }

    const vision = parsed?.vision_analysis || {}

    const features = {
      belly_fat: vision?.features?.belly_fat || 'medium',
      muscle_visibility: vision?.features?.muscle_visibility || 'medium',
      posture: vision?.features?.posture || 'average',
    }

    const aiFat =
      typeof vision.fat_percentage === 'number'
        ? clamp(Math.round(vision.fat_percentage), 5, 50)
        : formulaFatPct

    const aiConfidence =
      typeof vision.confidence === 'number'
        ? clamp(Math.round(vision.confidence), 0, 100)
        : isImageFile ? 65 : 50

    const imageQuality: 'low' | 'medium' | 'high' =
      vision.image_quality === 'high' ||
        vision.image_quality === 'medium' ||
        vision.image_quality === 'low'
        ? vision.image_quality
        : isImageFile ? 'medium' : 'low'

    const finalFatPercentage =
      isImageFile && aiConfidence >= 70
        ? aiFat
        : Math.round((aiFat + formulaFatPct) / 2)

    const finalBodyType =
      vision.body_type === 'ectomorph' ||
        vision.body_type === 'mesomorph' ||
        vision.body_type === 'endomorph'
        ? vision.body_type
        : formulaBodyType

    const weightLossEstimate =
      goal === 'weight_loss'
        ? parseFloat(clamp((bmi - 22) * 0.75, 1.5, 6).toFixed(1))
        : goal === 'muscle_gain'
          ? parseFloat(clamp((22 - bmi) * 0.5 + 1, 0.5, 2).toFixed(1))
          : parseFloat(clamp(Math.abs(bmi - 22) * 0.2, 0.1, 2).toFixed(1))

    let score = 100

    score -= finalFatPercentage * 1.2

    if (features.muscle_visibility === 'high') score += 8
    if (features.muscle_visibility === 'low') score -= 5

    if (features.posture === 'bad') score -= 6

    if (features.belly_fat === 'high') score -= 8
    if (features.belly_fat === 'medium') score -= 3

    const bodyScore = clamp(Math.round(score), 20, 98)
    const level = getLevel(bodyScore)

    const weeksToGoal =
      goal === 'weight_loss'
        ? Math.ceil(weightLossEstimate / 0.5)
        : goal === 'muscle_gain'
          ? Math.ceil(weightLossEstimate / 0.25)
          : 4

    const summary =
      typeof vision.ai_summary === 'string'
        ? vision.ai_summary
        : locale === 'ru'
          ? `Ваш ИМТ ${bmi.toFixed(1)}. Процент жира около ${finalFatPercentage}%.`
          : `Sizning BMI ${bmi.toFixed(1)}. Yog' foizi taxminan ${finalFatPercentage}%.`

    const recommendations =
      Array.isArray(vision.recommendations)
        ? vision.recommendations
        : locale === 'ru'
          ? [
            `Цель калорий: ${targetCalories} ккал`,
            'Соблюдайте режим питания',
            'Добавьте физическую активность',
          ]
          : [
            `Kunlik kaloriya: ${targetCalories}`,
            "Ovqatlanishni nazorat qiling",
            "Faollikni oshiring",
          ]
    let coachUz = ''
    let coachRu = ''

    if (goal === 'weight_loss') {
      if (features.belly_fat === 'high') {
        coachUz = "Qorin yog'ini kamaytirishga e'tibor bering. Kardio va kaloriya defitsiti muhim."
        coachRu = "Сосредоточьтесь на уменьшении жира на животе. Кардио и дефицит калорий важны."
      } else {
        coachUz = "Barqaror yog' yo'qotish uchun dietani nazorat qiling va aktivlikni oshiring."
        coachRu = "Контролируйте диету и увеличьте активность для стабильной потери жира."
      }
    } else if (goal === 'muscle_gain') {
      if (features.muscle_visibility === 'low') {
        coachUz = "Mushak ko'rinishini oshirish uchun og'irlik mashqlarini ko'paytiring."
        coachRu = "Увеличьте силовые тренировки для улучшения рельефа мышц."
      } else {
        coachUz = "Sizda yaxshi baza bor. Endi progressiv overloadga o'ting."
        coachRu = "У вас хорошая база. Переходите к прогрессивной перегрузке."
      }
    } else {
      coachUz = "Hozirgi formani saqlash uchun ovqatlanish va yengil mashqlar balansini ushlang."
      coachRu = "Соблюдайте баланс питания и легких тренировок, чтобы сохранить текущую форму."
    }

    if (features.posture === 'bad') {
      coachUz += " Posturani yaxshilash uchun bel mashqlarini qo'shing."
      coachRu += " Добавьте упражнения на спину для улучшения осанки."
    }

    const coach_message = locale === 'ru' ? coachRu : coachUz

    const analysis = {
      body_type: finalBodyType,
      fat_percentage: finalFatPercentage,
      bmi: parseFloat(bmi.toFixed(1)),
      weight_loss_estimate: weightLossEstimate,
      ai_summary:
        aiConfidence < 60
          ? locale === 'ru'
            ? "Качество фото недостаточное. Результат оценен приблизительно."
            : "Rasm sifati yetarli emas. Natija taxminiy baholandi."
          : summary,
      recommendations,
      body_score: bodyScore,
      level,
      weeks_to_goal: weeksToGoal,
      confidence: aiConfidence,
      image_quality: imageQuality,
      features,
      coach_message,
    }

    const proteinPerMeal = Math.round(weight * (goal === 'muscle_gain' ? 0.6 : 0.4))

    const diet = [
      {
        day: 1,
        total_calories: targetCalories,
        water_intake: parseFloat((weight * 0.033).toFixed(1)),
        meals: [
          {
            name: { uz: 'Nonushta', ru: 'Завтрак' },
            time: '08:00',
            total_calories: Math.round(targetCalories * 0.25),
            foods: [
              {
                name: { uz: 'Tuxum', ru: 'Яйца' },
                amount: { uz: '2 dona', ru: '2 шт' },
                calories: 140,
                protein: 12,
                carbs: 1,
                fat: 10,
              },
            ],
            recipe: {
              ingredients: { uz: ['Tuxum', "1 ch q. yog'"], ru: ['Яйца', '1 ч.л. масла'] },
              steps: { uz: ['Tuxumni pishiring'], ru: ['Приготовьте яйца'] },
              cook_time: 5,
            },
          },
          {
            name: { uz: 'Tushlik', ru: 'Обед' },
            time: '13:00',
            total_calories: Math.round(targetCalories * 0.35),
            foods: [
              {
                name: { uz: 'Tovuq ko‘kragi', ru: 'Куриная грудка' },
                amount: { uz: `${proteinPerMeal}g`, ru: `${proteinPerMeal}г` },
                calories: Math.round(proteinPerMeal * 2),
                protein: Math.round(proteinPerMeal * 0.25),
                carbs: 0,
                fat: 8,
              },
            ],
            recipe: {
              ingredients: { uz: ['Go‘sht', 'Sabzavot'], ru: ['Мясо', 'Овощи'] },
              steps: { uz: ['Pishiring va garnir bilan bering'], ru: ['Приготовьте и подавайте с гарниром'] },
              cook_time: 25,
            },
          },
        ],
      },
    ]

    const workout = [
      {
        day: 1,
        title: { uz: "Yog' yoqish mashqi", ru: 'Жиросжигающая тренировка' },
        duration: 45,
        calories_burned: Math.round(weight * 4),
        exercises: [
          {
            name: { uz: 'Sakrash (Jumping Jack)', ru: 'Прыжки (Jumping Jack)' },
            sets: 3,
            reps: '30',
            rest: 45,
            muscle_group: { uz: 'Kardio', ru: 'Кардио' },
            description: { uz: 'Tez tempda bajaring', ru: 'Выполняйте в быстром темпе' },
          },
          {
            name: { uz: 'Planka', ru: 'Планка' },
            sets: 3,
            reps: { uz: '30-45 soniya', ru: '30-45 секунд' },
            rest: 45,
            muscle_group: { uz: 'Qorin', ru: 'Кор' },
            description: { uz: "Tanani to'g'ri tuting", ru: 'Держите тело прямо' },
          },
        ],
      },
    ]

    return NextResponse.json({
      success: true,
      data: {
        analysis,
        diet,
        workout,
      },
    })
  } catch (err: unknown) {
    console.error('AI PLAN ERROR:', err)
    const msg = err instanceof Error ? err.message : "Noma'lum xato"

    if (msg.includes('429') || msg.includes('rate') || msg.includes('quota')) {
      return NextResponse.json(
        {
          success: false,
          error: "API limiti vaqtincha to'ldi. Birozdan keyin qayta urinib ko'ring.",
        },
        { status: 429 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'AI plan yaratishda xato: ' + msg,
      },
      { status: 500 }
    )
  }
}