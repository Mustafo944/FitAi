import { GoogleGenAI } from '@google/genai'

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const SYSTEM_PROMPT = `Sen professional fitness mutaxassisi va dietologsan. 
Foydalanuvchi rasmini va tana ma'lumotlarini tahlil qil.
Javobni FAQAT qat'iy JSON formatida ber, boshqa hech narsa qo'shma.
Barcha matnlarni o'zbek tilida yoz.
Tibbiy tashxis qo'yma, faqat umumiy maslahatlar ber.

JSON tuzilishi:
{
  "summary": "Umumiy tana holati haqida qisqacha xulosa",
  "bmi": { "value": 0, "category": "Normal" },
  "estimated_calories": { "maintenance": 0, "fat_loss": 0 },
  "body_observations": ["kuzatish 1", "kuzatish 2"],
  "strengths": ["kuchli tomon 1"],
  "improvement_areas": ["yaxshilash kerak 1"],
  "workout_plan": [{ "title": "Mashq nomi", "description": "Tavsif", "frequency": "Haftada 3 marta" }],
  "diet_tips": ["maslahat 1"],
  "safety_note": "Ogohlantirish"
}`

export async function analyzeWithGemini(imageBase64, mimeType, metrics) {
  const userPrompt = `Foydalanuvchi ma'lumotlari:
- Bo'y: ${metrics.height} sm
- Vazn: ${metrics.weight} kg
- Yosh: ${metrics.age}
- Jins: ${metrics.gender === 'male' ? 'Erkak' : 'Ayol'}

Ushbu rasmni va ma'lumotlarni tahlil qilib, JSON formatida natija ber.`

  const result = await genai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { text: SYSTEM_PROMPT },
          {
            inlineData: {
              mimeType,
              data: imageBase64,
            },
          },
          { text: userPrompt },
        ],
      },
    ],
  })

  const text = result.text
  
  // JSON ni ajratib olish
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error("AI javobidan JSON ajratib bo'lmadi")
  }

  return JSON.parse(jsonMatch[0])
}
