'use client'
// src/app/dashboard/progress/page.tsx

import { useMemo, useState, useEffect } from 'react'
import { useUserStore } from '@/store/userStore'
import { useTranslation, type TranslationKey } from '@/lib/i18n'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { useRouter } from 'next/navigation'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

interface CustomTooltipProps {
  active?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[]
  label?: string
  t: (key: TranslationKey) => string
}

function CustomTooltipInner({ active, payload, label, t }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  const estimatedValue = payload.find((p) => p.name === 'taxmin')?.value
  const actualValue = payload.find((p) => p.name === 'haqiqiy')?.value

  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm">
      <p className="text-gray-400 text-xs mb-1">{label}</p>

      {payload.map((p) =>
        p.value !== null ? (
          <p key={p.name} style={{ color: p.color }} className="font-medium">
            {p.name === 'taxmin' ? t('progress_estimated') : t('progress_actual')}: {p.value} kg
          </p>
        ) : null
      )}

      {typeof estimatedValue === 'number' && typeof actualValue === 'number' && (
        <p className="text-xs text-gray-500 mt-1">
          {t('progress_diff')}: {(actualValue - estimatedValue).toFixed(1)} kg
        </p>
      )}
    </div>
  )
}

export default function ProgressPage() {
  const router = useRouter()
  const { analysis, progress, addProgress, onboardingData } = useUserStore()
  const { t } = useTranslation()
  const [actualWeight, setActualWeight] = useState('')

  useEffect(() => {
    // Progress setup if needed
  }, [router])

  const startWeight =
    progress[0]?.estimated_weight || Number(onboardingData.weight) || 75

  const lossPerMonth = analysis?.weight_loss_estimate || 4
  const lossPerWeek = lossPerMonth / 4.3

  const chartData = useMemo(() => {
    return Array.from({ length: 13 }, (_, i) => {
      const weekLabel = i === 0 ? t('progress_start') : `${i}-${t('progress_week_short')}`
      const estimated = parseFloat((startWeight - lossPerWeek * i).toFixed(1))
      const actual = progress.find((p) => p.week === i + 1)?.actual_weight ?? null

      return {
        week: weekLabel,
        taxmin: estimated,
        haqiqiy: i === 0 ? startWeight : actual,
      }
    })
  }, [startWeight, lossPerWeek, progress, t])

  const latestProgress = progress[progress.length - 1]
  const latestWeek = latestProgress?.week || 1

  const estimatedNow = parseFloat(
    (startWeight - lossPerWeek * latestWeek).toFixed(1)
  )

  const actualNow =
    typeof latestProgress?.actual_weight === 'number'
      ? latestProgress.actual_weight
      : startWeight

  const diff = parseFloat((actualNow - estimatedNow).toFixed(1))

  const progressStatus =
    diff <= -1
      ? 'ahead'
      : diff >= 1
        ? 'behind'
        : 'on_track'

  const totalWeeks = 12
  const remainingWeeks = Math.max(totalWeeks - latestWeek, 0)

  const coachText =
    progressStatus === 'ahead'
      ? t('progress_ahead')
      : progressStatus === 'behind'
        ? t('progress_behind')
        : t('progress_ontrack')

  const targetWeight = parseFloat((startWeight - lossPerMonth * 3).toFixed(1))

  const handleAddActualWeight = () => {
    const value = Number(actualWeight)

    if (!value || value < 30 || value > 300) return

    const nextWeek = progress.length + 1
    const estimatedForWeek = parseFloat(
      (startWeight - lossPerWeek * nextWeek).toFixed(1)
    )

    addProgress({
      week: nextWeek,
      estimated_weight: estimatedForWeek,
      actual_weight: value,
    })

    setActualWeight('')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24 md:pb-8">
      <div className="border-b border-white/8 px-4 py-4 flex items-center gap-3">
        <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-lg">
          ←
        </Link>
        <div>
          <h1 className="font-bold text-lg" style={{ fontFamily: 'var(--font-clash)' }}>
            {t('nav_progress')}
          </h1>
          <p className="text-xs text-gray-500">{t('dash_progress')}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 animate-fade-in-up">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-[#111] border border-white/8 rounded-2xl p-4 text-center">
            <div
              className="text-2xl font-bold text-white mb-1"
              style={{ fontFamily: 'var(--font-clash)' }}
            >
              {startWeight}
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">
              {t('onboarding_weight')} kg
            </div>
          </div>

          <div className="bg-[#111] border border-[#c8f55a]/20 rounded-2xl p-4 text-center">
            <div
              className="text-2xl font-bold text-[#c8f55a] mb-1"
              style={{ fontFamily: 'var(--font-clash)' }}
            >
              ~{lossPerMonth}
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">
              {t('progress_month_estimate')}
            </div>
          </div>

          <div className="bg-[#111] border border-white/8 rounded-2xl p-4 text-center">
            <div
              className="text-2xl font-bold text-[#ff6b35] mb-1"
              style={{ fontFamily: 'var(--font-clash)' }}
            >
              {targetWeight}
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">
              {t('progress_3month_goal')}
            </div>
          </div>

          <div className="bg-[#111] border border-white/8 rounded-2xl p-4 text-center">
            <div
              className={`text-2xl font-bold mb-1 ${progressStatus === 'ahead'
                ? 'text-[#22c55e]'
                : progressStatus === 'behind'
                  ? 'text-[#ef4444]'
                  : 'text-yellow-400'
                }`}
              style={{ fontFamily: 'var(--font-clash)' }}
            >
              {progressStatus === 'ahead' && '🔥'}
              {progressStatus === 'behind' && '⚠️'}
              {progressStatus === 'on_track' && '✅'}
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">
              {t('progress_status')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="bg-[#111] border border-white/8 rounded-2xl p-4 text-center">
            <div
              className={`text-2xl font-bold mb-1 ${diff <= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'
                }`}
              style={{ fontFamily: 'var(--font-clash)' }}
            >
              {diff > 0 ? '+' : ''}
              {diff} kg
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              {t('progress_real_vs_plan')}
            </div>
          </div>

          <div className="bg-[#111] border border-white/8 rounded-2xl p-4 text-center">
            <div
              className="text-2xl font-bold text-white mb-1"
              style={{ fontFamily: 'var(--font-clash)' }}
            >
              {remainingWeeks}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              {t('progress_weeks_left')}
            </div>
          </div>
        </div>

        <div className="bg-[#111] border border-white/8 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ fontFamily: 'var(--font-clash)' }}>
              {t('progress_12week_forecast')}
            </h2>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-gray-500">
                <span className="w-3 h-0.5 bg-[#c8f55a] inline-block rounded" />
                {t('progress_estimated')}
              </span>
              <span className="flex items-center gap-1.5 text-gray-500">
                <span className="w-3 h-0.5 bg-[#60a5fa] inline-block rounded" />
                {t('progress_actual')}
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="week"
                tick={{ fill: '#444', fontSize: 10 }}
                interval={2}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: '#444', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltipInner t={t} />} />
              <ReferenceLine
                y={targetWeight}
                stroke="#ff6b35"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <Line
                type="monotone"
                dataKey="taxmin"
                stroke="#c8f55a"
                strokeWidth={2}
                dot={{ fill: '#c8f55a', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#c8f55a' }}
              />
              <Line
                type="monotone"
                dataKey="haqiqiy"
                stroke="#60a5fa"
                strokeWidth={2}
                dot={{ fill: '#60a5fa', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#60a5fa' }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>

          <p className="text-xs text-gray-600 text-center mt-2">
            {t('progress_target_line')} ({targetWeight} kg)
          </p>
        </div>

        <div className="bg-[#c8f55a]/8 border border-[#c8f55a]/20 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white">
              {t('dash_ai_coach')}
            </h2>

            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${progressStatus === 'ahead'
                ? 'bg-green-500/15 text-green-400'
                : progressStatus === 'behind'
                  ? 'bg-red-500/15 text-red-400'
                  : 'bg-yellow-500/15 text-yellow-400'
                }`}
            >
              {progressStatus === 'ahead' && t('progress_ahead_short')}
              {progressStatus === 'behind' && t('progress_behind_short')}
              {progressStatus === 'on_track' && t('progress_ontrack_short')}
            </span>
          </div>

          <p className="text-sm text-gray-200 mb-4">
            {coachText}
          </p>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-black/20 border border-white/5 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500">{t('progress_diff')}</div>
              <div className={`font-semibold ${diff <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {diff > 0 ? '+' : ''}
                {diff} kg
              </div>
            </div>

            <div className="bg-black/20 border border-white/5 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500">{t('progress_current_week')}</div>
              <div className="text-white font-semibold">{latestWeek}</div>
            </div>

            <div className="bg-black/20 border border-white/5 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-500">{t('progress_left')}</div>
              <div className="text-white font-semibold">{remainingWeeks}</div>
            </div>
          </div>
        </div>

        <div className="bg-[#111] border border-white/8 rounded-2xl p-5 mb-6">
          <h2 className="font-semibold mb-3" style={{ fontFamily: 'var(--font-clash)' }}>
            {t('progress_add_weight')}
          </h2>

          <div className="flex gap-3">
            <input
              type="number"
              placeholder={t('progress_input_placeholder')}
              value={actualWeight}
              onChange={(e) => setActualWeight(e.target.value)}
              className="flex-1 bg-[#0a0a0a] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#c8f55a]"
            />
            <button
              onClick={handleAddActualWeight}
              className="bg-[#c8f55a] text-black font-semibold px-5 rounded-xl hover:opacity-90"
            >
              {t('progress_add_btn')}
            </button>
          </div>
        </div>

        <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-white/8">
            <h2 className="font-semibold" style={{ fontFamily: 'var(--font-clash)' }}>
              {t('progress_weekly_title')}
            </h2>
          </div>

          <div className="divide-y divide-white/5">
            {progress.length > 0 ? (
              progress.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-gray-400">
                    {item.week}-{t('progress_week_short')}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#c8f55a]">
                      {t('progress_estimated')}: {item.estimated_weight} kg
                    </span>
                    {typeof item.actual_weight === 'number' && (
                      <span className="text-sm font-medium text-[#60a5fa]">
                        {t('progress_actual')}: {item.actual_weight} kg
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-4 text-sm text-gray-500">
                {t('progress_empty')}
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#c8f55a]/8 border border-[#c8f55a]/20 rounded-2xl p-5 text-center accent-border-glow">
          <div className="text-lg mb-1">📸</div>
          <h3 className="font-bold mb-1" style={{ fontFamily: 'var(--font-clash)' }}>
            {t('progress_real_tracking_title')}
          </h3>
          <p className="text-gray-400 text-xs mb-3">
            {t('progress_real_tracking_desc')}
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