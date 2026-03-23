import LoginButton from '@/components/auth/LoginButton'

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Orqa fon gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-gray-950 to-indigo-950/40" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />

      <div className="relative text-center max-w-lg">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 mb-8 shadow-lg shadow-violet-500/25">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Fitness AI{' '}
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Yordamchi
          </span>
        </h1>

        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
          Sun&apos;iy intellekt yordamida tana holatini tahlil qiling va shaxsiy
          fitness rejangizni oling
        </p>

        <LoginButton />

        <p className="text-gray-600 text-xs mt-6">
          Davom etish orqali foydalanish shartlarini qabul qilasiz
        </p>
      </div>
    </main>
  )
}
