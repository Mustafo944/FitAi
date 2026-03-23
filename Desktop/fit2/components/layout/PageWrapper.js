export default function PageWrapper({ children, className = '' }) {
  return (
    <main className={`max-w-5xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)] ${className}`}>
      {children}
    </main>
  )
}
