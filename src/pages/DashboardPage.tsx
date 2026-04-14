import { useParams, Link, Navigate } from 'react-router'
import { useProgress } from '@/hooks/useProgress'
import { useTechSections } from '@/hooks/useTechSections'
import { useTimeStore, getTechTime, formatTime } from '@/stores/time-store'
import { findDirection, findCategory, findTechnologyMeta } from '@/data/directions'
import Card from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'

export default function DashboardPage() {
  const { directionId, categoryId, techId } = useParams()
  const direction = findDirection(directionId!)
  const category = findCategory(directionId!, categoryId!)
  const techMeta = findTechnologyMeta(directionId!, categoryId!, techId!)
  const { sections, loading } = useTechSections(techId)
  const { getTechProgress } = useProgress()
  const topicTimes = useTimeStore(s => s.topicTimes)

  if (!direction || !category || !techMeta) return <Navigate to="/" replace />

  if (loading || !sections) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const { learned, total, percent } = getTechProgress(techId!, sections)
  const totalTime = getTechTime(topicTimes, techId!)

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 dark:text-gray-500 mb-4 flex-wrap">
        <Link to="/" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Bosh sahifa</Link>
        <span>/</span>
        <Link to={`/${directionId}`} className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">{direction.title}</Link>
        {category.technologies.length > 1 && (
          <>
            <span>/</span>
            <Link to={`/${directionId}/${categoryId}`} className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">{category.title}</Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-600 dark:text-gray-300">{techMeta.title}</span>
      </div>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {techMeta.icon} {techMeta.title}
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4">
          {techMeta.description} — {sections.length} bo'lim, {total} mavzu
        </p>

        <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Progress</span>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {percent}%
            </span>
          </div>
          <ProgressBar percent={percent} size="md" />
          <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mt-2">
            <span>{learned} / {total} mavzu o'rganildi</span>
            {totalTime > 0 && (
              <span className="inline-flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                </svg>
                Jami: {formatTime(totalTime)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {sections.map(section => (
          <Card key={section.id} section={section} basePath={`/${directionId}/${categoryId}/${techId}`} techId={techId!} />
        ))}
      </div>
    </div>
  )
}
