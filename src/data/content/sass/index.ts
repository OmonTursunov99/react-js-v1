import type { Section } from '../../types'
import { sassBasicsTopics } from './sass-basics'

export const sections: Section[] = [
  {
    id: 'sass-basics',
    number: 1,
    title: 'Sass Asoslari',
    description: '$variables, nesting, mixins, functions, modules va control flow',
    icon: '💅',
    gradient: 'from-pink-500 to-rose-400',
    topics: sassBasicsTopics,
  },
]
