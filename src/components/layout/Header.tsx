import { useTheme } from '@/hooks/useTheme'
import { useSearchShortcut } from '@/hooks/useSearchShortcut'
import { useSidebarStore } from '@/stores/sidebar-store'
import { useSearchStore } from '@/stores/search-store'
import { Link, useParams } from 'react-router'
import SearchModal from '@/components/search/SearchModal'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const mobileOpen = useSidebarStore(s => s.mobileOpen)
  const setMobileOpen = useSidebarStore(s => s.setMobileOpen)
  const isSearchOpen = useSearchStore(s => s.isOpen)
  const openSearch = useSearchStore(s => s.open)
  const { techId } = useParams()

  useSearchShortcut()

  return (
    <>
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

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search trigger */}
            <button
              onClick={openSearch}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm text-gray-500 dark:text-gray-400"
              title="Qidirish (⌘K)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline">Qidirish...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-mono bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                ⌘K
              </kbd>
            </button>

            <Link
              to="/stats"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Statistika"
            >
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h2v8H3zm6-4h2v12H9zm6-6h2v18h-2zm6 10h2v8h-2z" />
              </svg>
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>

      {isSearchOpen && <SearchModal />}
    </>
  )
}
