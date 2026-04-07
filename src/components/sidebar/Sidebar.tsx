import { sections } from '@/data/sections'
import SidebarSection from './SidebarSection'

export default function Sidebar() {
  return (
    <aside className="w-72 h-[calc(100vh-57px)] sticky top-[57px] overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex flex-col gap-1">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-2">
        Bo'limlar
      </p>
      {sections.map(section => (
        <SidebarSection key={section.id} section={section} />
      ))}
    </aside>
  )
}
