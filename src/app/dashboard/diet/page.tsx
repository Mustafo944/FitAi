'use client'
// src/app/dashboard/diet/page.tsx

import { useState } from 'react'
import { useUserStore } from '@/store/userStore'
import { useRouter } from 'next/navigation'
import { useTranslation, getLoc } from '@/lib/i18n'
import type { Meal, FoodItem } from '@/types'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

const mealIcons: Record<string, string> = {
  'Nonushta': '🌅',
  'Завтрак': '🌅',
  'Tushlik': '☀️',
  'Обед': '☀️',
  'Kechki ovqat': '🌙',
  'Ужин': '🌙',
  'Snack': '🍎',
  'Перекус': '🍎',
}

export default function DietPage() {
  const router = useRouter()
  const { dietPlan } = useUserStore()
  const { t, locale } = useTranslation()
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const [checkedFoods, setCheckedFoods] = useState<Set<string>>(new Set())

  const today = dietPlan[0]

  if (!today) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍽️</div>
          <p className="text-gray-400">Dieta reja topilmadi</p>
          <button onClick={() => router.push('/onboarding')} className="mt-4 text-[#c8f55a] text-sm">
            Qayta tahlil qilish →
          </button>
        </div>
      </div>
    )
  }

  const toggleFood = (key: string) => {
    setCheckedFoods(prev => {
      const next = new Set(prev)
      if (next.has(key)) { next.delete(key) } else { next.add(key) }
      return next
    })
  }

  const totalEaten = today.meals?.reduce((sum: number, meal: Meal) => {
    return sum + meal.foods.reduce((s: number, food: FoodItem, fi: number) => {
      const key = `${meal.name}-${fi}`
      return checkedFoods.has(key) ? s + food.calories : s
    }, 0)
  }, 0) || 0

  const caloriePercent = Math.min(100, Math.round((totalEaten / today.total_calories) * 100))

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24 md:pb-8">
      {/* Header */}
      <div className="border-b border-white/8 px-4 py-4 flex items-center gap-3">
        <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-lg">←</Link>
        <div>
          <h1 className="font-bold text-lg" style={{ fontFamily: 'var(--font-clash)' }}>{t('dash_today_diet')}</h1>
          <p className="text-xs text-gray-500">{t('dash_1day')} · {today.total_calories} {t('diet_kcal')}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 animate-fade-in-up">

        {/* Kaloriya progress */}
        <div className="bg-[#111] border border-white/8 rounded-2xl p-5 mb-6">
          <div className="flex justify-between items-end mb-3">
            <div>
              <div className="text-3xl font-bold text-[#c8f55a]" style={{ fontFamily: 'var(--font-clash)' }}>
                {totalEaten}
              </div>
              <div className="text-xs text-gray-500">{t('diet_kcal')}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white">{today.total_calories - totalEaten}</div>
              <div className="text-xs text-gray-500">qoldi</div>
            </div>
          </div>
          <div className="w-full bg-white/8 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${caloriePercent}%`,
                background: caloriePercent >= 100 ? '#f87171' : '#c8f55a'
              }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-600">{caloriePercent}%</span>
            <div className="flex gap-3 text-xs text-gray-500">
              <span>💧 {today.water_intake} {t('diet_liters')}</span>
            </div>
          </div>
        </div>

        {/* Ovqatlar ro'yxati */}
        <div className="space-y-3">
          {today.meals?.map((meal: Meal, mi: number) => (
            <div key={mi} className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden card-hover">
              {/* Meal header */}
              <button
                onClick={() => setSelectedMeal(selectedMeal?.name === meal.name ? null : meal)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{mealIcons[meal.name] || '🍴'}</span>
                  <div className="text-left">
                    <div className="font-medium text-sm">{getLoc(meal.name, locale)}</div>
                    <div className="text-xs text-gray-500">{meal.time} · {meal.foods.length} ta mahsulot</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#c8f55a]">{meal.total_calories} {t('diet_kcal')}</span>
                  <span className="text-gray-600 text-xs">{selectedMeal?.name === meal.name ? '▲' : '▼'}</span>
                </div>
              </button>

              {/* Expanded */}
              {selectedMeal?.name === meal.name && (
                <div className="border-t border-white/8 px-4 pb-4">
                  {/* Foods */}
                  <div className="pt-3 space-y-2 mb-4">
                    {meal.foods.map((food: FoodItem, fi: number) => {
                      const key = `${meal.name}-${fi}`
                      const checked = checkedFoods.has(key)
                      return (
                        <div
                          key={fi}
                          onClick={() => toggleFood(key)}
                          className="flex items-center justify-between py-2 cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-5 h-5 rounded-md border flex items-center justify-center transition-all flex-shrink-0"
                              style={{
                                background: checked ? '#c8f55a' : 'transparent',
                                borderColor: checked ? '#c8f55a' : 'rgba(255,255,255,0.15)',
                              }}
                            >
                              {checked && <span className="text-black text-xs font-bold">✓</span>}
                            </div>
                            <div>
                              <div className={`text-sm font-medium transition-colors ${checked ? 'text-gray-500 line-through' : 'text-white'}`}>
                                {getLoc(food.name, locale)}
                              </div>
                              <div className="text-xs text-gray-600">{getLoc(food.amount, locale)}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-300">{food.calories} kkal</div>
                            <div className="text-xs text-gray-600">
                              P:{food.protein}g · K:{food.carbs}g · Y:{food.fat}g
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Retsept */}
                  {meal.recipe && meal.recipe.steps.length > 0 && (
                    <div className="bg-white/4 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs font-semibold text-[#c8f55a]">📖 Recipe / Retsept</div>
                        <div className="text-xs text-gray-500">⏱ {meal.recipe.cook_time} {t('workout_min')}</div>
                      </div>

                      {/* Ingredientlar */}
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1.5">
                          {meal.recipe.ingredients.map((ing: string, i: number) => (
                            <span key={i} className="text-xs bg-white/6 px-2.5 py-1 rounded-lg text-gray-300">
                              {getLoc(ing, locale)}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bosqichlar */}
                      <div>
                        <ol className="space-y-1.5">
                          {meal.recipe.steps.map((step: string, i: number) => (
                            <li key={i} className="flex gap-2 text-xs text-gray-300">
                              <span className="text-[#c8f55a] font-bold flex-shrink-0">{i + 1}.</span>
                              <span>{getLoc(step, locale)}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pro upsell - 30 kunlik reja */}
        <div className="mt-6 bg-[#c8f55a]/8 border border-[#c8f55a]/20 rounded-2xl p-5 text-center accent-border-glow">
          <div className="text-lg mb-1">🔒</div>
          <h3 className="font-bold mb-1" style={{ fontFamily: 'var(--font-clash)' }}>
            {t('dash_pro_title')}
          </h3>
          <p className="text-gray-400 text-xs mb-3">
            {t('dash_pro_desc')}
          </p>
          <button className="bg-[#c8f55a] text-black text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity">
            {t('dash_pro_btn')}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
