'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signOut, onAuthChange } from '@/services/auth'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const sub = onAuthChange((session) => {
      setUser(session?.user || null)
    })
    return () => sub.unsubscribe()
  }, [])

  // Bosh sahifada navbar ko'rsatmaslik
  if (pathname === '/') return null

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const navLinks = [
    { href: '/dashboard', label: 'Boshqaruv' },
    { href: '/upload', label: 'Tahlil' },
    { href: '/history', label: 'Tarix' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-lg font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent"
        >
          FitAI
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href
                  ? 'text-violet-400 font-medium'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user && (
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Chiqish
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-400 hover:text-white cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-gray-950/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block py-2 text-sm ${
                  pathname === link.href ? 'text-violet-400' : 'text-gray-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={handleSignOut}
                className="block py-2 text-sm text-gray-400 hover:text-white cursor-pointer"
              >
                Chiqish
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
