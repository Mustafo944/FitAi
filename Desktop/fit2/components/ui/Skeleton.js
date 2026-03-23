export default function Skeleton({ className = '', lines = 1 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-white/10 rounded-xl ${className}`}
          style={{ height: '1rem', width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  )
}
