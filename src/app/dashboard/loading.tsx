export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24 md:pb-8 animate-fade-in">
      {/* Header skeleton */}
      <div className="border-b border-white/8 px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="skeleton h-7 w-20" />
        <div className="flex items-center gap-3">
          <div className="skeleton h-6 w-24 rounded-full" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 md:py-8">
        {/* Title skeleton */}
        <div className="mb-8">
          <div className="skeleton h-7 w-48 mb-2" />
          <div className="skeleton h-4 w-64 mb-6" />

          {/* Metric cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#111] border border-white/8 rounded-2xl p-5">
                <div className="skeleton h-10 w-20 mx-auto mb-2" />
                <div className="skeleton h-3 w-16 mx-auto" />
              </div>
            ))}
          </div>

          {/* Score bar */}
          <div className="bg-[#111] border border-white/8 rounded-2xl p-5 mb-4">
            <div className="flex justify-between mb-3">
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-6 w-16" />
            </div>
            <div className="skeleton h-3 w-full rounded-full" />
          </div>
        </div>

        {/* Plan cards */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#111] border border-white/8 rounded-2xl p-5">
              <div className="flex justify-between mb-3">
                <div className="skeleton h-5 w-32" />
                <div className="skeleton h-4 w-20" />
              </div>
              <div className="skeleton h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
