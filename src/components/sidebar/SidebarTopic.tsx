import { NavLink, useParams } from 'react-router'
import { useProgress } from '@/hooks/useProgress'
import type { Topic } from '@/data/types'

interface SidebarTopicProps {
  topic: Topic
  sectionId: string
  basePath: string
}

export default function SidebarTopic({ topic, sectionId, basePath }: SidebarTopicProps) {
  const { techId } = useParams()
  const { isLearned } = useProgress()
  const learned = techId ? isLearned(techId, sectionId, topic.id) : false

  return (
    <NavLink
      to={`${basePath}/${sectionId}/${topic.id}`}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
          isActive
            ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
        }`
      }
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${learned ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
      <span>{topic.title}</span>
    </NavLink>
  )
}
