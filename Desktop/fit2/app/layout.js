import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata = {
  title: 'Fitness AI Yordamchi',
  description:
    "Sun'iy intellekt yordamida tana holatini tahlil qiling va shaxsiy fitness rejangizni oling",
}

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
