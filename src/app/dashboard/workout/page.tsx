'use client'
// src/app/dashboard/workout/page.tsx

import { useState, useEffect, useRef } from 'react'
import { useUserStore } from '@/store/userStore'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import type { Exercise } from '@/types'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

export default function WorkoutPage() {
  const router = useRouter()
  const { workoutPlan } = useUserStore()
  const { t } = useTranslation()
  const [completedSets, setCompletedSets] = useState<Record<string, number>>({})
  const [restTimer, setRestTimer] = useState<number | null>(null)
  const [activeExercise, setActiveExercise] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const today = workoutPlan[0]

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  if (!today) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">💪</div>
          <p className="text-gray-400">Mashq reja topilmadi</p>
          <button onClick={() => router.push('/onboarding')} className="mt-4 text-[#c8f55a] text-sm">
            Qayta tahlil qilish →
          </button>
        </div>
      </div>
    )
  }

  const totalSets = today.exercises?.reduce((sum: number, ex: Exercise) => sum + (ex.sets || 1), 0) || 0
  const doneSets = Object.values(completedSets).reduce((a, b) => a + b, 0)
  const workoutPercent = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0
  const isWorkoutDone = workoutPercent >= 100

  const startRest = (seconds: number, exName: string) => {
    setRestTimer(seconds)
    setActiveExercise(exName)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setRestTimer(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timerRef.current!)
          setActiveExercise(null)
          return null
        }
        return prev - 1
      })
    }, 1000)
  }

  const addSet = (exName: string, totalSetsForEx: number, restSeconds: number) => {
    setCompletedSets(prev => {
      const current = prev[exName] || 0
      if (current >= totalSetsForEx) return prev
      const next = current + 1
      if (next < totalSetsForEx) startRest(restSeconds, exName)
      return { ...prev, [exName]: next }
    })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24 md:pb-8">
      {/* Header */}
      <div className="border-b border-white/8 px-4 py-4 flex items-center gap-3">
        <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-lg">←</Link>
        <div>
          <h1 className="font-bold text-lg" style={{ fontFamily: 'var(--font-clash)' }}>{today.title}</h1>
          <p className="text-xs text-gray-500">{today.duration} {t('workout_min')} · 🔥 {today.calories_burned} {t('diet_kcal')}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">

        {/* Progress */}
        <div className="bg-[#111] border border-white/8 rounded-2xl p-5 mb-6">
          <div className="flex justify-between items-end mb-3">
            <div>
              <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-clash)', color: isWorkoutDone ? '#c8f55a' : 'white' }}>
                {isWorkoutDone ? `🎉 ${t('workout_done')}` : `${doneSets} / ${totalSets}`}
              </div>
              <div className="text-xs text-gray-500">
                {isWorkoutDone ? t('workout_excellent') : t('workout_sets_done')}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#c8f55a]">{workoutPercent}%</div>
              <div className="text-xs text-gray-500">{t('workout_completed')}</div>
            </div>
          </div>
          <div className="w-full bg-white/8 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{ width: `${workoutPercent}%`, background: '#c8f55a' }}
            />
          </div>
        </div>

        {/* Rest timer */}
        {restTimer !== null && (
          <div className="bg-[#1a1a1a] border border-[#c8f55a]/30 rounded-2xl p-4 mb-4 text-center">
            <div className="text-xs text-gray-500 mb-1">{t('workout_rest_time')} — {activeExercise}</div>
            <div className="text-4xl font-bold text-[#c8f55a]" style={{ fontFamily: 'var(--font-clash)' }}>
              {restTimer}s
            </div>
            <button
              onClick={() => { clearInterval(timerRef.current!); setRestTimer(null); setActiveExercise(null) }}
              className="mt-2 text-xs text-gray-500 hover:text-white transition-colors"
            >
              {t('workout_skip')}
            </button>
          </div>
        )}

        {/* Mashqlar */}
        <div className="space-y-3">
          {today.exercises?.map((ex: Exercise, ei: number) => {
            const exSets = ex.sets || 1
            const done = completedSets[ex.name] || 0
            const isDone = done >= exSets
            const isExp = expanded === ex.name

            return (
              <div
                key={ei}
                className="bg-[#111] border rounded-2xl overflow-hidden transition-all"
                style={{ borderColor: isDone ? 'rgba(200,245,90,0.3)' : 'rgba(255,255,255,0.08)' }}
              >
                {/* Exercise header */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/3 transition-colors"
                  onClick={() => setExpanded(isExp ? null : ex.name)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{
                        background: isDone ? '#c8f55a' : 'rgba(255,255,255,0.06)',
                        color: isDone ? '#0a0a0a' : '#666',
                      }}
                    >
                      {isDone ? '✓' : ei + 1}
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${isDone ? 'text-gray-400 line-through' : 'text-white'}`}>
                        {ex.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {ex.muscle_group} · {ex.reps}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Set dots */}
                    <div className="flex gap-1">
                      {Array.from({ length: exSets }).map((_, si) => (
                        <div
                          key={si}
                          className="w-2 h-2 rounded-full"
                          style={{ background: si < done ? '#c8f55a' : 'rgba(255,255,255,0.12)' }}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 text-xs">{isExp ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Expanded */}
                {isExp && (
                  <div className="border-t border-white/8 px-4 pb-4">
                    {/* Tavsif */}
                    <p className="text-sm text-gray-400 mt-3 mb-4 leading-relaxed">{ex.description}</p>

                    {/* Set/Rep info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                      {ex.sets && (
                        <div className="bg-white/5 rounded-xl p-3 text-center">
                          <div className="text-lg font-bold text-white uppercase" style={{ fontFamily: 'var(--font-clash)' }}>{ex.sets}</div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-wider">{t('workout_sets')}</div>
                        </div>
                      )}
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-white uppercase" style={{ fontFamily: 'var(--font-clash)' }}>
                          {ex.reps || `${ex.duration}m`}
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">{ex.reps ? t('workout_reps') : t('workout_min')}</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-white uppercase" style={{ fontFamily: 'var(--font-clash)' }}>{ex.rest}s</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">{t('workout_rest_time')}</div>
                      </div>
                    </div>

                    {/* Set tugmasi */}
                    {!isDone ? (
                      <button
                        onClick={() => addSet(ex.name, exSets, ex.rest)}
                        className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
                        style={{ background: '#c8f55a', color: '#0a0a0a' }}
                      >
                        Set {done + 1} {t('workout_completed')} ✓
                      </button>
                    ) : (
                      <div className="w-full py-3 rounded-xl text-center text-sm font-medium"
                        style={{ background: 'rgba(200,245,90,0.1)', color: '#c8f55a' }}>
                        ✓ {t('workout_done')}!
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Pro upsell */}
        <div className="mt-6 bg-[#c8f55a]/8 border border-[#c8f55a]/20 rounded-2xl p-5 text-center">
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
