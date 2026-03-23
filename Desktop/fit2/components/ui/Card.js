export default function Card({ children, className = '', glass = false }) {
  const base = 'rounded-3xl p-6 transition-all duration-200'
  const style = glass
    ? 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl'
    : 'bg-gray-900/50 border border-gray-800 shadow-lg'

  return <div className={`${base} ${style} ${className}`}>{children}</div>
}
