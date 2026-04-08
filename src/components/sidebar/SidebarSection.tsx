import { NavLink } from 'react-router'
import { useSidebarStore } from '@/stores/sidebar-store'
import { useProgress } from '@/hooks/useProgress'
import type { Section } from '@/data/types'
import SidebarTopic from './SidebarTopic'

interface SidebarSectionProps {
  section: Section
  forceExpand?: boolean
}

export default function SidebarSection({ section, forceExpand = false }: SidebarSectionProps) {
  const expandedSections = useSidebarStore(s => s.expandedSections)
  const toggleSection = useSidebarStore(s => s.toggleSection)
  const { getSectionPercent } = useProgress()

  const expanded = forceExpand || expandedSections.includes(section.id)
  const percent = getSectionPercent(section.id, section.topics.length)

  return (
    <div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => toggleSection(section.id)}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <svg
            className={`w-3.5 h-3.5 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <NavLink
          to={`/section/${section.id}`}
          className={({ isActive }) =>
            `flex-1 flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-all ${
              isActive
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`
          }
        >
          <span>{section.icon}</span>
          <span className="truncate flex-1">{section.number}. {section.title}</span>
          {percent > 0 && (
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">{percent}%</span>
          )}
        </NavLink>
      </div>

      {expanded && (
        <div className="ml-6 mt-1 flex flex-col gap-0.5 border-l-2 border-gray-200 dark:border-gray-700 pl-2">
          {section.topics.map(topic => (
            <SidebarTopic key={topic.id} topic={topic} sectionId={section.id} />
          ))}
        </div>
      )}
    </div>
  )
}
