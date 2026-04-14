import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router'
import Sidebar from '@/components/sidebar/Sidebar'
import { useFooterNavStore } from '@/stores/footer-nav-store'

export default function TechLayout() {
  const mainRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [scrollPercent, setScrollPercent] = useState(0)

  const { topicId } = useParams()
  const { tabIds, activeTabId, goToTab, prevTopicPath, nextTopicPath } = useFooterNavStore()
  const hasNav = tabIds.length > 0

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  useEffect(() => {
    const el = mainRef.current
    if (!el) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      if (scrollHeight <= clientHeight) {
        setScrollPercent(0)
        return
      }
      setScrollPercent(Math.round((scrollTop / (scrollHeight - clientHeight)) * 100))
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => el.removeEventListener('scroll', handleScroll)
  }, [pathname])

  const atBottom = scrollPercent > 95

  function scrollToTop() {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Tab navigation
  const tabIndex = tabIds.indexOf(activeTabId)
  const canPrevTab = tabIndex > 0
  const canNextTab = tabIndex < tabIds.length - 1

  function goPrevTab() {
    if (canPrevTab && goToTab) goToTab(tabIds[tabIndex - 1])
  }
  function goNextTab() {
    if (canNextTab && goToTab) goToTab(tabIds[tabIndex + 1])
  }

  return (
    <div className="flex flex-1 min-h-0">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0 relative">
        <div ref={mainRef} className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <Outlet />
        </div>

        {/* Footer = scroll progress bar (faqat TopicPage da) */}
        {topicId && (
          <div className="h-10 shrink-0 relative overflow-visible bg-gray-100 dark:bg-gray-800">
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 transition-[width] duration-150 ease-out"
                style={{ width: `${scrollPercent}%` }}
              />
            </div>
            <div className="relative h-full flex items-center px-2 sm:px-4">
              {/* Left: percentage */}
              <span
                className={`text-xs font-mono font-bold transition-colors duration-200 ${
                  scrollPercent > 50 ? 'text-white/80' : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {scrollPercent > 0 && `${scrollPercent}%`}
              </span>

              {/* Center: nav buttons */}
              {(hasNav || atBottom) && (
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-0.5 rounded-lg bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm px-1 py-0.5">
                  {hasNav && (
                    <button
                      onClick={() => prevTopicPath && navigate(prevTopicPath)}
                      disabled={!prevTopicPath}
                      className={`p-1.5 rounded-md transition-colors ${prevTopicPath ? 'text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/10' : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'}`}
                      title="Oldingi mavzu"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 19l-7-7 7-7M11.5 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  {hasNav && (
                    <button
                      onClick={goPrevTab}
                      disabled={!canPrevTab}
                      className={`p-1.5 rounded-md transition-colors ${canPrevTab ? 'text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/10' : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'}`}
                      title="Oldingi tab"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  {atBottom && (
                    <button
                      onClick={scrollToTop}
                      className="p-1.5 rounded-md text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                      title="Yuqoriga"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                  )}
                  {hasNav && (
                    <button
                      onClick={goNextTab}
                      disabled={!canNextTab}
                      className={`p-1.5 rounded-md transition-colors ${canNextTab ? 'text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/10' : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'}`}
                      title="Keyingi tab"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                  {hasNav && (
                    <button
                      onClick={() => nextTopicPath && navigate(nextTopicPath)}
                      disabled={!nextTopicPath}
                      className={`p-1.5 rounded-md transition-colors ${nextTopicPath ? 'text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/10' : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'}`}
                      title="Keyingi mavzu"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 5l7 7-7 7M12.5 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Floating button — bottom-right, hidden when at bottom */}
        {topicId && (
          <button
            onClick={scrollToTop}
            className={`absolute bottom-[66px] right-4 z-10 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25 flex items-center justify-center hover:shadow-xl hover:scale-110 transition-all duration-300 ${
              scrollPercent > 15 && !atBottom
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
