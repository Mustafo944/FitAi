import Card from '@/components/ui/Card'

export default function WorkoutPlan({ workouts }) {
  if (!workouts?.length) return null

  return (
    <Card glass>
      <h3 className="text-lg font-semibold text-white mb-4">
        💪 Mashq rejasi
      </h3>
      <div className="space-y-3">
        {workouts.map((workout, i) => (
          <div
            key={i}
            className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-violet-500/20 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h4 className="font-medium text-white">{workout.title}</h4>
                <p className="text-sm text-gray-400 mt-1">
                  {workout.description}
                </p>
              </div>
              <span className="text-xs text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full whitespace-nowrap">
                {workout.frequency}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
