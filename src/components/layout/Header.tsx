import { useTheme } from '@/hooks/useTheme'
import { useProgress } from '@/hooks/useProgress'
import { useSidebarStore } from '@/stores/sidebar-store'
import { Link, useParams } from 'react-router'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { totalLearned } = useProgress()
  const mobileOpen = useSidebarStore(s => s.mobileOpen)
  const setMobileOpen = useSidebarStore(s => s.setMobileOpen)
  const { techId } = useParams()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hamburger — mobile only, faqat tech tanlanganda */}
          {techId && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
              aria-label="Menu"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <span className="text-xl sm:text-2xl">🏔️</span>
            <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ketmonjon
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {totalLearned > 0 && (
            <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {totalLearned} o'rganildi
            </span>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  )
}
