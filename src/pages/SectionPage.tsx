import { useParams, Link } from 'react-router'
import { useSectionData } from '@/hooks/useSectionData'
import { useProgress } from '@/hooks/useProgress'
import ProgressBar from '@/components/ui/ProgressBar'
import StarRating from '@/components/ui/StarRating'
import Badge from '@/components/ui/Badge'

export default function SectionPage() {
  const { sectionId } = useParams()
  const section = useSectionData(sectionId)
  const { getSectionPercent, isLearned, getLearnedCountForSection } = useProgress()

  if (!section) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-gray-400">Bo'lim topilmadi</p>
      </div>
    )
  }

  const percent = getSectionPercent(section.id, section.topics.length)
  const learnedCount = getLearnedCountForSection(section.id)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{section.icon}</span>
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Bo'lim {section.number}
            </p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {section.title}
            </h1>
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{section.description}</p>

        <div className="flex items-center gap-4 mb-2">
          <div className="flex-1">
            <ProgressBar percent={percent} gradient={section.gradient} size="md" />
          </div>
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">
            {percent}%
          </span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {learnedCount} / {section.topics.length} mavzu o'rganildi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {section.topics.map(topic => {
          const learned = isLearned(section.id, topic.id)

          return (
            <Link
              key={topic.id}
              to={`/section/${section.id}/${topic.id}`}
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
                    {learned ? 'O\'rganildi' : 'Hali o\'rganilmagan'}
                  </span>
                </div>
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
