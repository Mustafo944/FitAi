import Card from '@/components/ui/Card'

export default function DietTips({ tips }) {
  if (!tips?.length) return null

  return (
    <Card glass>
      <h3 className="text-lg font-semibold text-white mb-4">
        🥗 Dieta maslahatlari
      </h3>
      <ul className="space-y-2">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="text-violet-400 mt-0.5 shrink-0">•</span>
            <span className="text-gray-300 text-sm">{tip}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
