import { NavLink } from 'react-router'
import { useProgress } from '@/hooks/useProgress'
import type { Topic } from '@/data/types'

interface SidebarTopicProps {
  topic: Topic
  sectionId: string
}

export default function SidebarTopic({ topic, sectionId }: SidebarTopicProps) {
  const { isLearned } = useProgress()
  const learned = isLearned(sectionId, topic.id)

  return (
    <NavLink
      to={`/section/${sectionId}/${topic.id}`}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
          isActive
            ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
        }`
      }
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${learned ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
      <span className="truncate">{topic.title}</span>
    </NavLink>
  )
}
