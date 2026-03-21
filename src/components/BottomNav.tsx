'use client'
// src/components/BottomNav.tsx

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'

const tabs = [
  { href: '/dashboard', icon: '🏠', labelKey: 'nav_home' as const },
  { href: '/dashboard/diet', icon: '🍽️', labelKey: 'nav_diet' as const },
  { href: '/dashboard/workout', icon: '💪', labelKey: 'nav_workout' as const },
  { href: '/dashboard/progress', icon: '📊', labelKey: 'nav_progress' as const },
  { href: '/dashboard/settings', icon: '⚙️', labelKey: 'nav_settings' as const },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { t } = useTranslation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/8 md:hidden">
      <div className="flex items-center justify-around py-2 px-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all ${isActive
                  ? 'text-[#c8f55a]'
                  : 'text-gray-500 hover:text-gray-300'
                }`}
            >
              <span className={`text-xl ${isActive ? 'scale-110' : ''} transition-transform`}>
                {tab.icon}
              </span>
              <span className={`text-[10px] font-medium ${isActive ? 'text-[#c8f55a]' : ''}`}>
                {t(tab.labelKey)}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#c8f55a]" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
