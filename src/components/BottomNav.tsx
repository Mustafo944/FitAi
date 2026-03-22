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
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass-strong rounded-t-2xl border-t border-white/8 mx-1 mb-0">
        <div className="flex items-center justify-around py-2 px-1">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-300 ${isActive
                    ? 'text-[#c8f55a]'
                    : 'text-gray-500 hover:text-gray-300 active:scale-95'
                  }`}
              >
                {isActive && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-[#c8f55a] shadow-[0_0_10px_rgba(200,245,90,0.5)]" />
                )}
                <span className={`text-xl transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(200,245,90,0.4)]' : ''}`}>
                  {tab.icon}
                </span>
                <span className={`text-[10px] font-medium transition-colors duration-300 ${isActive ? 'text-[#c8f55a]' : ''}`}>
                  {t(tab.labelKey)}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
