import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router'
import { directions } from '@/data/directions'
import { loadTechSections } from '@/data/tech-loader'
import { useTimeStore, formatTime } from '@/stores/time-store'
import { useProgressStore, makeKey } from '@/stores/progress-store'
import type { Section } from '@/data/types'

interface TechMeta {
  directionId: string
  categoryId: string
  techId: string
  techTitle: string
  techIcon: string
}

function getAllTechs(): TechMeta[] {
  const techs: TechMeta[] = []
  for (const dir of directions) {
    for (const cat of dir.categories) {
      for (const tech of cat.technologies) {
        techs.push({
          directionId: dir.id,
          categoryId: cat.id,
          techId: tech.id,
          techTitle: tech.title,
          techIcon: tech.icon,
        })
      }
    }
  }
  return techs
}

const allTechs = getAllTechs()

export default function StatsPage() {
  const [techSections, setTechSections] = useState<Map<string, Section[]>>(new Map())
  const [loading, setLoading] = useState(true)
  const [filterTech, setFilterTech] = useState('all')
  const [filterSection, setFilterSection] = useState('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'learned' | 'not-learned'>('all')
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)

  const topicTimes = useTimeStore(s => s.topicTimes)
  const learnedTopics = useProgressStore(s => s.learnedTopics)

  useEffect(() => {
    async function loadAll() {
      const map = new Map<string, Section[]>()
      await Promise.all(
        allTechs.map(async ({ techId }) => {
          const sections = await loadTechSections(techId)
          if (sections.length > 0) map.set(techId, sections)
        })
      )
      setTechSections(map)
      setLoading(false)
    }
    loadAll()
  }, [])

  // Reset section filter when tech changes
  useEffect(() => {
    setFilterSection('all')
  }, [filterTech])

  const rows = useMemo(() => {
    const result: Array<{
      techId: string
      techTitle: string
      techIcon: string
      directionId: string
      categoryId: string
      sectionId: string
      sectionTitle: string
      sectionIcon: string
      topicId: string
      topicTitle: string
      time: number
      learned: boolean
    }> = []

    for (const meta of allTechs) {
      const sections = techSections.get(meta.techId)
      if (!sections) continue
      if (filterTech !== 'all' && meta.techId !== filterTech) continue

      for (const section of sections) {
        if (filterSection !== 'all' && section.id !== filterSection) continue

        for (const topic of section.topics) {
          const key = makeKey(meta.techId, section.id, topic.id)
          const time = topicTimes[key] ?? 0
          const learned = learnedTopics.includes(key)

          if (filterStatus === 'learned' && !learned) continue
          if (filterStatus === 'not-learned' && learned) continue

          const searchLower = search.toLowerCase()
          if (searchLower && !topic.title.toLowerCase().includes(searchLower) && !section.title.toLowerCase().includes(searchLower) && !meta.techTitle.toLowerCase().includes(searchLower)) continue

          if (showAll || time > 0 || learned) {
            result.push({
              techId: meta.techId,
              techTitle: meta.techTitle,
              techIcon: meta.techIcon,
              directionId: meta.directionId,
              categoryId: meta.categoryId,
              sectionId: section.id,
              sectionTitle: section.title,
              sectionIcon: section.icon,
              topicId: topic.id,
              topicTitle: topic.title,
              time,
              learned,
            })
          }
        }
      }
    }

    result.sort((a, b) => b.time - a.time)
    return result
  }, [techSections, filterTech, filterSection, filterStatus, search, topicTimes, learnedTopics, showAll])

  const availableTechs = allTechs.filter(t => techSections.has(t.techId))

  const availableSections: Array<{ id: string; title: string; icon: string }> = []
  if (filterTech !== 'all') {
    const sections = techSections.get(filterTech)
    if (sections) {
      for (const s of sections) {
        availableSections.push({ id: s.id, title: s.title, icon: s.icon })
      }
    }
  }

  const totalTime = rows.reduce((sum, r) => sum + r.time, 0)
  const totalLearned = rows.filter(r => r.learned).length

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 dark:text-gray-500 mb-4 flex-wrap">
        <Link to="/" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Bosh sahifa</Link>
        <span>/</span>
        <span className="text-gray-600 dark:text-gray-300">Statistika</span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Jami vaqt</p>
          <p className="text-lg font-bold font-mono text-gray-900 dark:text-white">{formatTime(totalTime)}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">O'rganilgan</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{totalLearned}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Mavzular</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{rows.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Mavzu, bo'lim yoki texnologiya qidirish..."
          className="w-full pl-10 pr-9 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex items-center">
          <select
            value={filterTech}
            onChange={e => setFilterTech(e.target.value)}
            className="px-3 pr-8 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Barcha texnologiyalar</option>
            {availableTechs.map(t => (
              <option key={t.techId} value={t.techId}>{t.techIcon} {t.techTitle}</option>
            ))}
          </select>
          {filterTech !== 'all' && (
            <button
              onClick={() => setFilterTech('all')}
              className="ml-1 p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Tozalash"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {availableSections.length > 0 && (
          <div className="flex items-center">
            <select
              value={filterSection}
              onChange={e => setFilterSection(e.target.value)}
              className="px-3 pr-8 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Barcha bo'limlar</option>
              {availableSections.map(s => (
                <option key={s.id} value={s.id}>{s.icon} {s.title}</option>
              ))}
            </select>
            {filterSection !== 'all' && (
              <button
                onClick={() => setFilterSection('all')}
                className="ml-1 p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Tozalash"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="flex items-center">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as 'all' | 'learned' | 'not-learned')}
            className="px-3 pr-8 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Barcha holat</option>
            <option value="learned">O'rganilgan</option>
            <option value="not-learned">O'rganilmagan</option>
          </select>
          {filterStatus !== 'all' && (
            <button
              onClick={() => setFilterStatus('all')}
              className="ml-1 p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Tozalash"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer ml-auto">
          <input
            type="checkbox"
            checked={showAll}
            onChange={e => setShowAll(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          Hammasini ko'rsat
        </label>
      </div>

      {/* Table */}
      {rows.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-gray-400 dark:text-gray-500">Ma'lumot yo'q</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Biror mavzuni o'qishni boshlang</p>
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="px-4 py-3 font-medium">Texnologiya</th>
                  <th className="px-4 py-3 font-medium">Bo'lim</th>
                  <th className="px-4 py-3 font-medium">Mavzu</th>
                  <th className="px-4 py-3 font-medium text-right">Vaqt</th>
                  <th className="px-4 py-3 font-medium text-center">Holat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {rows.map(row => (
                  <tr key={`${row.techId}/${row.sectionId}/${row.topicId}`} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-gray-700 dark:text-gray-300">{row.techIcon} {row.techTitle}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-gray-600 dark:text-gray-400">{row.sectionIcon} {row.sectionTitle}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/${row.directionId}/${row.categoryId}/${row.techId}/${row.sectionId}/${row.topicId}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {row.topicTitle}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span className={`font-mono text-xs ${row.time > 0 ? 'text-gray-700 dark:text-gray-300' : 'text-gray-300 dark:text-gray-600'}`}>
                        {formatTime(row.time)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.learned ? (
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" title="O'rganildi" />
                      ) : (
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" title="Hali o'rganilmagan" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
