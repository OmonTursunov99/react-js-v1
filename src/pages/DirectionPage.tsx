import { Link } from 'react-router'
import { directions } from '@/data/directions'

export default function DirectionPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {directions.map(direction => {
          const totalTechs = direction.categories.reduce(
            (sum, cat) => sum + cat.technologies.length, 0
          )
          return (
            <Link
              key={direction.id}
              to={`/${direction.id}`}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${direction.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
              <div className="relative">
                <span className="text-3xl mb-3 block">{direction.icon}</span>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5">
                  {direction.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {direction.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                  <span>{direction.categories.length} kategoriya</span>
                  <span>·</span>
                  <span>{totalTechs} texnologiya</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
