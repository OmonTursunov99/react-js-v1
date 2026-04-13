import type { Section } from '../../types'
import { nextjsCoreTopics } from './nextjs-core'
import { nextjsAdvancedTopics } from './nextjs-advanced'

export const sections: Section[] = [
  {
    id: 'nextjs-core',
    number: 1,
    title: 'Next.js Asoslari',
    description: 'App Router, rendering, data fetching, routing, middleware',
    icon: '▲',
    gradient: 'from-gray-800 to-gray-600',
    topics: nextjsCoreTopics,
  },
  {
    id: 'nextjs-advanced',
    number: 2,
    title: 'Next.js Murakkab',
    description: 'API routes, server actions, image/font, deployment',
    icon: '⚡',
    gradient: 'from-gray-700 to-gray-500',
    topics: nextjsAdvancedTopics,
  },
]
