import type { Section } from '../../types'
import { lessBasicsTopics } from './less-basics'

export const sections: Section[] = [
  {
    id: 'less-basics',
    number: 1,
    title: 'Less Asoslari',
    description: '@variables, nesting, mixins, functions va import tizimi',
    icon: '✨',
    gradient: 'from-indigo-500 to-blue-400',
    topics: lessBasicsTopics,
  },
]
