import { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useSearchStore } from '@/stores/search-store'
import { loadSearchIndex, type SearchIndexEntry } from '@/data/search-helpers'

export default function SearchModal() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const query = useSearchStore(s => s.query)
  const index = useSearchStore(s => s.index)
  const loading = useSearchStore(s => s.loading)
  const selectedIndex = useSearchStore(s => s.selectedIndex)
  const deepSearch = useSearchStore(s => s.deepSearch)
  const { setQuery, setIndex, setLoading, setSelectedIndex, toggleDeepSearch, reset } = useSearchStore.getState()

  // Birinchi ochilishda indeksni yuklash
  useEffect(() => {
    if (index !== null || loading) return
    setLoading(true)
    loadSearchIndex().then(entries => {
      setIndex(entries)
      setLoading(false)
    })
  }, [index, loading])

  // Autofocus
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Qidirish natijalari
  const results = useMemo(() => {
    if (!index || !query.trim()) return []
    const q = query.trim().toLowerCase()

    const scored: { entry: SearchIndexEntry; score: number }[] = []
    for (const entry of index) {
      const titleLower = entry.topicTitle.toLowerCase()
      const descLower = entry.topicDescription.toLowerCase()
      const titleMatch = titleLower.includes(q)
      const descMatch = descLower.includes(q)
      const contentMatch = deepSearch && entry.topicContent.toLowerCase().includes(q)
      if (!titleMatch && !descMatch && !contentMatch) continue

      let score = 0
      if (titleMatch) {
        score += 10
        if (titleLower.startsWith(q)) score += 5
      }
      if (descMatch) score += 3
      if (contentMatch) score += 1

      scored.push({ entry, score })
    }

    scored.sort((a, b) => b.score - a.score)
    return scored.slice(0, 20).map(s => s.entry)
  }, [index, query, deepSearch])

  // Tanlangan natijani ko'rinadigan qilish
  useEffect(() => {
    if (!listRef.current) return
    const active = listRef.current.querySelector('[data-active="true"]')
    active?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  function selectResult(entry: SearchIndexEntry) {
    navigate(entry.path)
    reset()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(Math.min(selectedIndex + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(Math.max(selectedIndex - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault()
      selectResult(results[selectedIndex])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      reset()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
      onClick={reset}
      onKeyDown={handleKeyDown}
    >
      <div
        className="mx-auto mt-[15vh] w-[calc(100%-2rem)] max-w-2xl rounded-xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Mavzu qidirish..."
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none text-base"
          />
          {/* Deep search toggle */}
          <button
            type="button"
            onClick={toggleDeepSearch}
            className={`shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
              deepSearch
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
            title="Kontent ichidan qidirish"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Kontent
          </button>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
            ESC
          </kbd>
        </div>

        {/* Natijalar */}
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto" role="listbox">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="ml-3 text-sm text-gray-500">Yuklanmoqda...</span>
            </div>
          )}

          {!loading && query.trim() && results.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-500">
              Natija topilmadi
            </div>
          )}

          {!loading && !query.trim() && (
            <div className="py-8 text-center text-sm text-gray-400">
              Mavzu nomini yozing...
            </div>
          )}

          {results.map((entry, i) => (
            <button
              key={entry.path}
              data-active={i === selectedIndex}
              onClick={() => selectResult(entry)}
              role="option"
              aria-selected={i === selectedIndex}
              className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                i === selectedIndex
                  ? 'bg-blue-50 dark:bg-blue-900/30'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <span className="text-lg shrink-0 mt-0.5">{entry.techIcon}</span>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">
                  {entry.techTitle} › {entry.sectionTitle}
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {entry.topicTitle}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                  {entry.topicDescription}
                </div>
              </div>
              {i === selectedIndex && (
                <kbd className="hidden sm:inline-flex shrink-0 self-center items-center px-1.5 py-0.5 text-xs font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                  ↵
                </kbd>
              )}
            </button>
          ))}
        </div>

        {/* Footer hints */}
        {results.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 font-mono">↑↓</kbd>
              navigatsiya
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 font-mono">↵</kbd>
              ochish
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
