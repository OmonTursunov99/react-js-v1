import { sections } from '@/data/sections'
import { useProgress } from '@/hooks/useProgress'
import Card from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'

export default function DashboardPage() {
  const { overallPercent, totalLearned, totalTopics } = useProgress()

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Senior React Frontend Interview
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Suxbatga tayyorgarlik — 9 bo'lim, {totalTopics} mavzu
        </p>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Umumiy progress</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {overallPercent}%
            </span>
          </div>
          <ProgressBar percent={overallPercent} size="md" />
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            {totalLearned} / {totalTopics} mavzu o'rganildi
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(section => (
          <Card key={section.id} section={section} />
        ))}
      </div>
    </div>
  )
}
