import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-6xl mb-4">🔍</p>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Sahifa topilmadi
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Bu sahifa mavjud emas yoki ko'chirilgan
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
      >
        Bosh sahifaga qaytish
      </Link>
    </div>
  )
}
