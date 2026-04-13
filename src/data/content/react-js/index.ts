import type { Section } from '../../types'
import { reactCoreTopics } from './react-core'
import { componentPatternsTopics } from './component-patterns'
import { stateManagementTopics } from './state-management'
import { routingTopics } from './routing'
import { performanceTopics } from './performance'
import { typescriptReactTopics } from './typescript-react'
import { testingTopics } from './testing'
import { architectureTopics } from './architecture'
import { theoryQuestionsTopics } from './theory-questions'

export const sections: Section[] = [
  {
    id: 'react-core',
    number: 1,
    title: 'React Core',
    description: 'Asosiy bilimlar — hooklar, Virtual DOM, rendering',
    icon: '⚛️',
    gradient: 'from-blue-500 to-cyan-400',
    topics: reactCoreTopics,
  },
  {
    id: 'component-patterns',
    number: 2,
    title: 'Component Patterns',
    description: 'Senior darajadagi komponent patternlar',
    icon: '🧩',
    gradient: 'from-purple-500 to-pink-400',
    topics: componentPatternsTopics,
  },
  {
    id: 'state-management',
    number: 3,
    title: 'State Management',
    description: 'Redux, Zustand, TanStack Query, Context',
    icon: '🗃️',
    gradient: 'from-green-500 to-emerald-400',
    topics: stateManagementTopics,
  },
  {
    id: 'routing',
    number: 4,
    title: 'Routing',
    description: 'React Router — navigatsiya va route patternlar',
    icon: '🧭',
    gradient: 'from-orange-500 to-amber-400',
    topics: routingTopics,
  },
  {
    id: 'performance',
    number: 5,
    title: 'Performance & Optimization',
    description: 'Re-render, memoizatsiya, code splitting',
    icon: '⚡',
    gradient: 'from-yellow-500 to-orange-400',
    topics: performanceTopics,
  },
  {
    id: 'typescript-react',
    number: 6,
    title: 'TypeScript + React',
    description: 'Tipizatsiya, generics, event types',
    icon: '🔷',
    gradient: 'from-blue-600 to-indigo-500',
    topics: typescriptReactTopics,
  },
  {
    id: 'testing',
    number: 7,
    title: 'Testing',
    description: 'Vitest, RTL, testing patterns',
    icon: '🧪',
    gradient: 'from-red-500 to-rose-400',
    topics: testingTopics,
  },
  {
    id: 'architecture',
    number: 8,
    title: 'Architecture & Best Practices',
    description: 'FSD, SOLID, Atomic Design, CI/CD',
    icon: '🏗️',
    gradient: 'from-slate-600 to-gray-500',
    topics: architectureTopics,
  },
  {
    id: 'theory-questions',
    number: 9,
    title: 'Nazariy Savollar',
    description: '100% so\'raladigan intervyu savollari',
    icon: '📝',
    gradient: 'from-violet-500 to-purple-400',
    topics: theoryQuestionsTopics,
  },
]
