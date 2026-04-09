import { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router'
import { sections } from '@/data/sections'
import { useSidebarStore } from '@/stores/sidebar-store'
import SidebarSection from './SidebarSection'

export default function Sidebar() {
  const [search, setSearch] = useState('')
  const mobileOpen = useSidebarStore(s => s.mobileOpen)
  const setMobileOpen = useSidebarStore(s => s.setMobileOpen)
  const { pathname } = useLocation()

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname, setMobileOpen])

  const filteredSections = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return null

    return sections
      .map(section => {
        const sectionMatch = section.title.toLowerCase().includes(q)
        const matchedTopics = section.topics.filter(t =>
          t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
        )

        if (sectionMatch || matchedTopics.length > 0) {
          return {
            ...section,
            topics: sectionMatch ? section.topics : matchedTopics,
          }
        }
        return null
      })
      .filter(Boolean) as typeof sections
  }, [search])

  const displaySections = filteredSections ?? sections

  const sidebarContent = (
    <>
      <div className="relative mb-3 px-1">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Qidirish..."
          className="w-full pl-9 pr-8 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {search && filteredSections?.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
          Topilmadi
        </p>
      )}

      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-2">
        Bo'limlar {search && `(${filteredSections?.length ?? 0})`}
      </p>
      {displaySections.map(section => (
        <SidebarSection key={section.id} section={section} forceExpand={!!search} />
      ))}
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-80 h-[calc(100vh-57px)] sticky top-[57px] overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex-col gap-1">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] overflow-y-auto bg-white dark:bg-gray-900 p-4 flex flex-col gap-1 shadow-2xl animate-slide-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-gray-900 dark:text-white">Navigatsiya</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
