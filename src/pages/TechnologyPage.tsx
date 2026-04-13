import { useParams, Link, Navigate } from 'react-router'
import { findDirection, findCategory } from '@/data/directions'
import { getAvailableTechIds } from '@/data/tech-loader'

export default function TechnologyPage() {
  const { directionId, categoryId } = useParams()
  const direction = findDirection(directionId!)
  const category = findCategory(directionId!, categoryId!)
  const availableTechs = getAvailableTechIds()

  if (!direction || !category) return <Navigate to="/" replace />

  // Agar 1 ta texnologiya bo'lsa, to'g'ridan-to'g'ri redirect
  if (category.technologies.length === 1) {
    return <Navigate to={`/${directionId}/${categoryId}/${category.technologies[0].id}`} replace />
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 dark:text-gray-500 mb-6 flex-wrap">
        <Link to="/" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Bosh sahifa</Link>
        <span>/</span>
        <Link to={`/${directionId}`} className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          {direction.icon} {direction.title}
        </Link>
        <span>/</span>
        <span className="text-gray-600 dark:text-gray-300">{category.icon} {category.title}</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {category.icon} {category.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{category.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {category.technologies.map(tech => {
          const hasContent = availableTechs.includes(tech.id)
          return (
            <Link
              key={tech.id}
              to={`/${directionId}/${categoryId}/${tech.id}`}
              className={`group relative overflow-hidden rounded-2xl border p-5 sm:p-6 transition-all duration-300 ${
                hasContent
                  ? 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg hover:-translate-y-0.5'
                  : 'border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 opacity-60'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${tech.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
              <div className="relative">
                <span className="text-3xl mb-3 block">{tech.icon}</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5">
                  {tech.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {tech.description}
                </p>
                {!hasContent && (
                  <span className="text-xs text-amber-500 dark:text-amber-400 font-medium">
                    Tez kunda...
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
