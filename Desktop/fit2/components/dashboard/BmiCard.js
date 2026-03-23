import Card from '@/components/ui/Card'
import { getBMICategory } from '@/lib/calculations'

export default function BmiCard({ bmi }) {
  if (!bmi) return null

  const category = getBMICategory(bmi.value)

  return (
    <Card glass>
      <h3 className="text-lg font-semibold text-white mb-3">BMI ko&apos;rsatkichi</h3>
      <div className="flex items-end gap-3">
        <span className="text-4xl font-bold text-white">{bmi.value}</span>
        <span className={`text-sm font-medium pb-1 ${category.color}`}>
          {bmi.category || category.label}
        </span>
      </div>
      {/* BMI vizual ko'rsatkichi */}
      <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 transition-all duration-500"
          style={{ width: `${Math.min((bmi.value / 40) * 100, 100)}%` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>15</span>
        <span>25</span>
        <span>35+</span>
      </div>
    </Card>
  )
}
