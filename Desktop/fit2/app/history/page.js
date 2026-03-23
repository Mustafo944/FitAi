'use client'

import { useEffect, useState } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import HistoryList from '@/components/history/HistoryList'
import Spinner from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('/api/history')
        if (!res.ok) throw new Error("Tarixni olishda xatolik")
        const data = await res.json()
        setAnalyses(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Tahlil tarixi</h1>
        <p className="text-gray-400 mt-1">Barcha o&apos;tgan natijalaringiz</p>
      </div>

      {loading ? (
        <Spinner size="lg" className="py-16" />
      ) : error ? (
        <EmptyState icon="⚠️" title="Xatolik" description={error}>
          <Button onClick={() => window.location.reload()}>
            Qayta urinish
          </Button>
        </EmptyState>
      ) : (
        <HistoryList analyses={analyses} />
      )}
    </PageWrapper>
  )
}
