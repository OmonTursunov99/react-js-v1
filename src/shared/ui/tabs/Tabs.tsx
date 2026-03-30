import { useState } from 'react'

interface Tab {
    id: string
    label: string
    content: React.ReactNode
}

interface TabsProps {
    tabs: Tab[]
    defaultActiveId?: string
}

export default function Tabs({ tabs, defaultActiveId }: TabsProps) {
    const [activeId, setActiveId] = useState(defaultActiveId ?? tabs[0]?.id ?? '')

    const activeTab = tabs.find(tab => tab.id === activeId)

    return (
        <div className="w-full">
            <div className="flex gap-1 border-b border-gray-200">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveId(tab.id)}
                        className={`px-4 py-2 text-sm rounded-t-lg transition-colors ${
                            activeId === tab.id
                                ? 'bg-white text-blue-600 border-b-2 border-blue-600 font-medium'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="p-4 bg-white rounded-b-lg">
                {activeTab?.content}
            </div>
        </div>
    )
}
