import { useState } from 'react'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  activeTab?: string
  onTabChange?: (id: string) => void
}

export default function Tabs({ tabs, activeTab: controlledActive, onTabChange }: TabsProps) {
  const [internalActive, setInternalActive] = useState(tabs[0]?.id ?? '')

  const active = controlledActive ?? internalActive
  const handleChange = (id: string) => {
    if (onTabChange) onTabChange(id)
    if (controlledActive === undefined) setInternalActive(id)
  }

  const activeContent = tabs.find(t => t.id === active)?.content

  return (
    <div>
      <div className="flex gap-0.5 sm:gap-1 border-b border-gray-200 dark:border-gray-700 mb-4 sm:mb-6 overflow-x-auto overflow-y-hidden">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleChange(tab.id)}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all border-b-2 -mb-px whitespace-nowrap ${
              active === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{activeContent}</div>
    </div>
  )
}
