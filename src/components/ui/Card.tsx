import { Link } from 'react-router'
import type { Section } from '@/data/types'
import { useProgress } from '@/hooks/useProgress'
import ProgressBar from './ProgressBar'

interface CardProps {
  section: Section
  basePath: string
  techId: string
}

export default function Card({ section, basePath, techId }: CardProps) {
  const { getSectionProgress } = useProgress()
  const { learned, percent } = getSectionProgress(techId, section)

  return (
    <Link
      to={`${basePath}/${section.id}`}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 hover:-translate-y-1"
    >
      <div className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${section.gradient}`} />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-3xl">{section.icon}</span>
          <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-gradient-to-r ${section.gradient} text-white`}>
            {section.number}
          </span>
        </div>

        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {section.title}
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
          {section.description}
        </p>

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {learned}/{section.topics.length} mavzu
          </span>
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
            {percent}%
          </span>
        </div>

        <ProgressBar percent={percent} gradient={section.gradient} size="sm" />
      </div>
    </Link>
  )
}
