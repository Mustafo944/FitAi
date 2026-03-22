'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const selected = localStorage.getItem('lang_selected')

    if (!selected) {
      router.replace('/language')
    } else {
      router.replace('/landing')
    }
  }, [router])

  return null
}