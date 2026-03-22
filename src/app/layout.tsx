// src/app/layout.tsx

import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import ClientThemeSync from '@/components/ClientThemeSync'
import './globals.css'

export const metadata: Metadata = {
  title: "FitAI — Tanangizni o'zgartiring",
  description: 'AI yordamida shaxsiy dieta va mashq rejasini oling',
  keywords: ['fitness', 'AI', 'diet', 'workout', 'body analysis'],
  authors: [{ name: 'FitAI' }],
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
          try {
            var s = localStorage.getItem('fitai-store');
            if (s) {
              var d = JSON.parse(s);
              if (d.state && d.state.theme === 'light') {
                document.documentElement.classList.add('theme-light');
              }
            }
          } catch(e) {}
        ` }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Instrument+Sans:wght@400;500;600&display=swap"
        />
      </head>
      <body className="antialiased">
        <main className="page-enter">
          {children}
        </main>
        <ClientThemeSync />

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(26, 26, 26, 0.95)',
              color: '#f0ede6',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              backdropFilter: 'blur(20px)',
              padding: '12px 20px',
              fontSize: '14px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
            },
            success: {
              iconTheme: {
                primary: '#c8f55a',
                secondary: '#0a0a0a',
              },
            },
            error: {
              iconTheme: {
                primary: '#f87171',
                secondary: '#0a0a0a',
              },
            },
          }}
        />
      </body>
    </html>
  )
}