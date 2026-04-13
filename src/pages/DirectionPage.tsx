import { Link } from 'react-router'
import { directions } from '@/data/directions'

export default function DirectionPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          🏔️ Ketmonjon
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
          Frontend va Backend texnologiyalarini o'rganish platformasi.
          Yo'nalishni tanlang va o'rganishni boshlang!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {directions.map(direction => {
          const totalTechs = direction.categories.reduce(
            (sum, cat) => sum + cat.technologies.length, 0
          )
          return (
            <Link
              key={direction.id}
              to={`/${direction.id}`}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${direction.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
              <div className="relative">
                <span className="text-4xl sm:text-5xl mb-4 block">{direction.icon}</span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {direction.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
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
