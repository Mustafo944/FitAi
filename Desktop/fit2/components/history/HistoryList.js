'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'

export default function HistoryList({ analyses = [] }) {
  if (!analyses.length) {
    return (
      <EmptyState
        icon="📊"
        title="Tahlillar topilmadi"
        description="Hali birorta tahlil qilmagansiz"
      >
        <Link href="/upload">
          <Button>Birinchi tahlilni boshlash</Button>
        </Link>
      </EmptyState>
    )
  }

  return (
    <div className="space-y-3">
      {analyses.map((item) => {
        const result = item.result || {}
        const date = new Date(item.created_at).toLocaleDateString('uz-UZ', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })

        return (
          <Link key={item.id} href={`/dashboard?id=${item.id}`}>
            <Card className="hover:border-violet-500/30 transition-colors cursor-pointer mb-3">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-400">{date}</p>
                  <p className="text-white font-medium mt-1 truncate">
                    BMI: {result.bmi?.value || '—'} •{' '}
                    {result.bmi?.category || '—'}
                  </p>
                </div>
                <div className="text-right ml-4 shrink-0">
                  <p className="text-xs text-gray-500">
                    {item.height_cm} sm / {item.weight_kg} kg
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
