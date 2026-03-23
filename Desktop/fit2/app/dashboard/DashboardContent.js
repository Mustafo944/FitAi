'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'
import SummaryCard from '@/components/dashboard/SummaryCard'
import BmiCard from '@/components/dashboard/BmiCard'
import CalorieCard from '@/components/dashboard/CalorieCard'
import WorkoutPlan from '@/components/dashboard/WorkoutPlan'
import DietTips from '@/components/dashboard/DietTips'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'

export default function DashboardContent() {
  const searchParams = useSearchParams()
  const analysisId = searchParams.get('id')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const url = analysisId
          ? `/api/history?id=${analysisId}`
          : '/api/history?latest=true'
        const res = await fetch(url)

        if (!res.ok) {
          if (res.status === 404) {
            setData(null)
            return
          }
          throw new Error("Ma'lumot olishda xatolik")
        }

        setData(await res.json())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [analysisId])

  if (loading) {
    return (
      <PageWrapper className="flex items-center justify-center">
        <Spinner size="lg" />
      </PageWrapper>
    )
  }

  if (error) {
    return (
      <PageWrapper className="flex items-center justify-center">
        <EmptyState icon="⚠️" title="Xatolik" description={error}>
          <Button onClick={() => window.location.reload()}>
            Qayta urinish
          </Button>
        </EmptyState>
      </PageWrapper>
    )
  }

  if (!data) {
    return (
      <PageWrapper className="flex items-center justify-center">
        <EmptyState
          icon="🏋️"
          title="Hali tahlil qilinmagan"
          description="Birinchi tahlilni boshlash uchun rasm yuklang"
        >
          <Link href="/upload">
            <Button>Tahlilni boshlash</Button>
          </Link>
        </EmptyState>
      </PageWrapper>
    )
  }

  const result = data.result || {}

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Natijalaringiz</h1>
        <p className="text-gray-400 mt-1">
          {new Date(data.created_at).toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <div className="space-y-6">
        <SummaryCard summary={result.summary} />

        <div className="grid md:grid-cols-2 gap-6">
          <BmiCard bmi={result.bmi} />
          <CalorieCard calories={result.estimated_calories} />
        </div>

        {(result.strengths?.length > 0 || result.improvement_areas?.length > 0) && (
          <div className="grid md:grid-cols-2 gap-6">
            {result.strengths?.length > 0 && (
              <Card glass>
                <h3 className="text-lg font-semibold text-white mb-3">
                  ✅ Kuchli tomonlar
                </h3>
                <ul className="space-y-2">
                  {result.strengths.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-green-400 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {result.improvement_areas?.length > 0 && (
              <Card glass>
                <h3 className="text-lg font-semibold text-white mb-3">
                  📈 Yaxshilash kerak
                </h3>
                <ul className="space-y-2">
                  {result.improvement_areas.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-yellow-400 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        )}

        <WorkoutPlan workouts={result.workout_plan} />
        <DietTips tips={result.diet_tips} />

        {result.safety_note && (
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <p className="text-sm text-yellow-200/80">
              ⚠️ {result.safety_note}
            </p>
          </Card>
        )}

        <div className="flex gap-3 pt-4">
          <Link href="/upload">
            <Button>Yangi tahlil</Button>
          </Link>
          <Link href="/history">
            <Button variant="secondary">Tarix</Button>
          </Link>
        </div>
      </div>
    </PageWrapper>
  )
}
