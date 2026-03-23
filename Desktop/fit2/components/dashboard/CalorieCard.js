import Card from '@/components/ui/Card'

export default function CalorieCard({ calories }) {
  if (!calories) return null

  return (
    <Card glass>
      <h3 className="text-lg font-semibold text-white mb-3">
        Kunlik kaloriya
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-2xl p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">Ushlab turish</p>
          <p className="text-2xl font-bold text-white">
            {calories.maintenance}
          </p>
          <p className="text-xs text-gray-500">kkal/kun</p>
        </div>
        <div className="bg-violet-500/10 rounded-2xl p-4 text-center border border-violet-500/20">
          <p className="text-xs text-violet-400 mb-1">Ozish uchun</p>
          <p className="text-2xl font-bold text-violet-300">
            {calories.fat_loss}
          </p>
          <p className="text-xs text-violet-400/60">kkal/kun</p>
        </div>
      </div>
    </Card>
  )
}
