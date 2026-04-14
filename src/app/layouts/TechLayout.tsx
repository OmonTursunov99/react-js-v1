import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import Sidebar from '@/components/sidebar/Sidebar'

export default function TechLayout() {
  const mainRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const [scrollPercent, setScrollPercent] = useState(0)

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

  return (
    <div className="flex flex-1 min-h-0">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0 relative">
        <div ref={mainRef} className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <Outlet />
        </div>

        {/* Footer = scroll progress bar */}
        <div className="h-10 shrink-0 relative overflow-visible bg-gray-100 dark:bg-gray-800">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 transition-[width] duration-150 ease-out"
              style={{ width: `${scrollPercent}%` }}
            />
          </div>
          <div className="relative h-full flex items-center px-4">
            <span
              className={`text-xs font-mono font-bold transition-colors duration-200 ${
                scrollPercent > 50
                  ? 'text-white/80'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {scrollPercent > 0 && `${scrollPercent}%`}
            </span>

            {/* Button inside footer — only when at bottom */}
            {atBottom && (
              <button
                onClick={scrollToTop}
                className="absolute left-1/2 -translate-x-1/2 -top-3 flex items-center gap-2 px-8 py-2.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-sm shadow-lg hover:scale-105 transition-all animate-bounce-soft"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
                Yuqoriga
              </button>
            )}
          </div>
        </div>

        {/* Floating button — bottom-right, hidden when at bottom */}
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
      </div>
    </div>
  )
}
