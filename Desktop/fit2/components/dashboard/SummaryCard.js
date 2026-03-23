import Card from '@/components/ui/Card'

export default function SummaryCard({ summary }) {
  if (!summary) return null

  return (
    <Card glass>
      <h3 className="text-lg font-semibold text-white mb-2">Umumiy xulosa</h3>
      <p className="text-gray-300 leading-relaxed">{summary}</p>
    </Card>
  )
}
