'use client'

import { Suspense } from 'react'
import DashboardContent from './DashboardContent'
import PageWrapper from '@/components/layout/PageWrapper'
import Spinner from '@/components/ui/Spinner'

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <PageWrapper className="flex items-center justify-center">
          <Spinner size="lg" />
        </PageWrapper>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}
