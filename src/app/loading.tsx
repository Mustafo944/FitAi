export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
      <div className="relative">
        <div className="text-5xl animate-float mb-6">🏋️</div>
        <div className="absolute -inset-4 bg-[#c8f55a]/10 rounded-full blur-2xl animate-pulse" />
      </div>
      <div className="text-[#c8f55a] font-medium text-sm tracking-[0.2em] uppercase animate-pulse">
        FitAI
      </div>
      <div className="mt-6 flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-[#c8f55a]/40 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-[#c8f55a]/40 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-[#c8f55a]/40 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}
