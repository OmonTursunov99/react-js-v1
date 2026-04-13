import { useParams, Link, Navigate } from 'react-router'
import { findDirection } from '@/data/directions'

export default function CategoryPage() {
  const { directionId } = useParams()
  const direction = findDirection(directionId!)

  if (!direction) return <Navigate to="/" replace />

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 dark:text-gray-500 mb-6 flex-wrap">
        <Link to="/" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Bosh sahifa</Link>
        <span>/</span>
        <span className="text-gray-600 dark:text-gray-300">{direction.icon} {direction.title}</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {direction.icon} {direction.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{direction.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {direction.categories.map(category => {
          // Agar 1 ta texnologiya bo'lsa, to'g'ridan-to'g'ri redirect
          const singleTech = category.technologies.length === 1
          const href = singleTech
            ? `/${directionId}/${category.id}/${category.technologies[0].id}`
            : `/${directionId}/${category.id}`

          return (
            <Link
              key={category.id}
              to={href}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
              <div className="relative">
                <span className="text-3xl mb-3 block">{category.icon}</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {category.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {category.technologies.map(tech => (
                    <span
                      key={tech.id}
                      className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    >
                      {tech.title}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
