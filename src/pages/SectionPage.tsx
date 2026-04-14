import { useParams, Link } from 'react-router'
import { useTechSections } from '@/hooks/useTechSections'
import { useProgress } from '@/hooks/useProgress'
import { useTimeStore, getSectionTime, getTopicTime, formatTime } from '@/stores/time-store'
import { findDirection, findCategory, findTechnologyMeta } from '@/data/directions'
import ProgressBar from '@/components/ui/ProgressBar'
import StarRating from '@/components/ui/StarRating'
import Badge from '@/components/ui/Badge'

export default function SectionPage() {
  const { directionId, categoryId, techId, sectionId } = useParams()
  const { sections } = useTechSections(techId)
  const { getSectionProgress, isLearned } = useProgress()
  const topicTimes = useTimeStore(s => s.topicTimes)

  const direction = findDirection(directionId!)
  const category = findCategory(directionId!, categoryId!)
  const techMeta = findTechnologyMeta(directionId!, categoryId!, techId!)
  const section = sections?.find(s => s.id === sectionId)
  const basePath = `/${directionId}/${categoryId}/${techId}`

  if (!section || !direction || !category || !techMeta) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-gray-400">Bo'lim topilmadi</p>
      </div>
    )
  }

  const { learned: learnedCount, percent } = getSectionProgress(techId!, section)
  const sectionTime = getSectionTime(topicTimes, techId!, section.id)

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
        <Link to={basePath} className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">{techMeta.title}</Link>
        <span>/</span>
        <span className="text-gray-600 dark:text-gray-300">{section.title}</span>
      </div>

      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl sm:text-4xl">{section.icon}</span>
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Bo'lim {section.number}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {section.title}
            </h1>
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4">{section.description}</p>

        <div className="flex items-center gap-3 sm:gap-4 mb-2">
          <div className="flex-1">
            <ProgressBar percent={percent} gradient={section.gradient} size="md" />
          </div>
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">
            {percent}%
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
          <span>{learnedCount} / {section.topics.length} mavzu o'rganildi</span>
          {sectionTime > 0 && (
            <span className="inline-flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
              </svg>
              {formatTime(sectionTime)}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {section.topics.map(topic => {
          const learned = isLearned(techId!, section.id, topic.id)
          const topicTime = getTopicTime(topicTimes, techId!, section.id, topic.id)

          return (
            <Link
              key={topic.id}
              to={`${basePath}/${section.id}/${topic.id}`}
              className="group relative overflow-hidden p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <Badge learned={learned} />
                <StarRating level={topic.importance} />
              </div>

              <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1.5">
                {topic.title}
              </h3>

              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                {topic.description}
              </p>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${learned ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {learned ? "O'rganildi" : "Hali o'rganilmagan"}
                  </span>
                </div>
                {topicTime > 0 && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {formatTime(topicTime)}
                  </span>
                )}
                <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
