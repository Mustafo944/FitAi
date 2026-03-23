import { getSupabaseServerClient } from '@/lib/supabase/server'
import { analyzeWithGemini } from '@/services/ai'
import { calculateBMI, calculateCalories } from '@/lib/calculations'
import { validateAnalysisResult } from '@/lib/validation'

export async function POST(request) {
  const supabase = await getSupabaseServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ message: 'Avtorizatsiya kerak' }, { status: 401 })
  }

  const { imageUrl } = await request.json()

  if (!imageUrl) {
    return Response.json({ message: 'Rasm URL kerak' }, { status: 400 })
  }

  // Profil ma'lumotlarini olish
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('height_cm, weight_kg, age, gender')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return Response.json(
      { message: "Profil ma'lumotlari topilmadi" },
      { status: 400 }
    )
  }

  try {
    // Rasmni yuklash va base64 ga o'girish
    const imageRes = await fetch(imageUrl)
    if (!imageRes.ok) throw new Error("Rasmni olishda xatolik")

    const imageBuffer = Buffer.from(await imageRes.arrayBuffer())
    const imageBase64 = imageBuffer.toString('base64')
    const mimeType = imageRes.headers.get('content-type') || 'image/jpeg'

    // AI tahlil
    let aiResult = await analyzeWithGemini(imageBase64, mimeType, {
      height: profile.height_cm,
      weight: profile.weight_kg,
      age: profile.age,
      gender: profile.gender,
    })

    // Hisoblangan qiymatlarni qo'shish/to'g'rilash
    const bmiValue = calculateBMI(profile.weight_kg, profile.height_cm)
    const calories = calculateCalories(
      profile.weight_kg,
      profile.height_cm,
      profile.age,
      profile.gender
    )

    aiResult.bmi = {
      value: bmiValue,
      category: aiResult.bmi?.category || '',
    }

    aiResult.estimated_calories = {
      maintenance: calories.maintenance,
      fat_loss: calories.fatLoss,
    }

    // Natijani tekshirish
    if (!validateAnalysisResult(aiResult)) {
      return Response.json(
        { message: 'AI natijasini tekshirishda xatolik' },
        { status: 500 }
      )
    }

    // Bazaga saqlash
    const { data, error: insertError } = await supabase
      .from('analyses')
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        height_cm: profile.height_cm,
        weight_kg: profile.weight_kg,
        age: profile.age,
        gender: profile.gender,
        result: aiResult,
      })
      .select()
      .single()

    if (insertError) {
      return Response.json(
        { message: 'Natijani saqlashda xatolik' },
        { status: 500 }
      )
    }

    return Response.json(data)
  } catch (err) {
    console.error('Analyze error:', err)
    return Response.json(
      { message: err.message || 'Tahlil qilishda xatolik yuz berdi' },
      { status: 500 }
    )
  }
}
