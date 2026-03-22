'use client'
// src/components/ClientThemeSync.tsx

import { useEffect, useState } from 'react'
import { useUserStore } from '@/store/userStore'
import { usePathname } from 'next/navigation'

export default function ClientThemeSync() {
    const { theme, setTheme } = useUserStore()
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (!mounted) return
        if (theme === 'light') {
            document.documentElement.classList.add('theme-light')
        } else {
            document.documentElement.classList.remove('theme-light')
        }
    }, [theme, mounted])

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark'
        setTheme(next)
        document.documentElement.classList.toggle('theme-light', next === 'light')
    }

    if (!mounted) return null

    const hasDashboard = pathname?.startsWith('/dashboard')

    return (
        <button
            onClick={toggleTheme}
            aria-label="Mavzuni almashtirish"
            className={[
                'fixed right-4 z-[200] w-10 h-10 rounded-full flex items-center justify-center text-base shadow-lg',
                'transition-all duration-200 bg-[#111] border border-white/10',
                'hover:border-[#c8f55a]/40 hover:scale-110 active:scale-95',
                hasDashboard ? 'bottom-20 md:bottom-8' : 'bottom-6',
                'md:right-6',
            ].join(' ')}
        >
            {theme === 'dark' ? '☀️' : '🌙'}
        </button>
    )
}