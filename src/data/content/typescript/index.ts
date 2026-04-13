import type { Section } from '../../types'
import { tsFundamentalsTopics } from './ts-fundamentals'
import { tsAdvancedTopics } from './ts-advanced'
import { tsPatternsTopics } from './ts-patterns'

export const sections: Section[] = [
  {
    id: 'ts-fundamentals',
    number: 1,
    title: 'Asoslar',
    description:
      'TypeScript ning asosiy tiplari, interface va type alias, type narrowing va enumlar.',
    icon: '🔷',
    gradient: 'from-blue-600 to-indigo-500',
    topics: tsFundamentalsTopics,
  },
  {
    id: 'ts-advanced',
    number: 2,
    title: 'Murakkab tiplar',
    description:
      'Generics, utility types, conditional types, mapped types va template literal types.',
    icon: '🧬',
    gradient: 'from-indigo-500 to-purple-500',
    topics: tsAdvancedTopics,
  },
  {
    id: 'ts-patterns',
    number: 3,
    title: 'Amaliy patternlar',
    description:
      'Type guards, discriminated unions, declaration files, strict config va as const/satisfies.',
    icon: '🛡️',
    gradient: 'from-emerald-500 to-teal-500',
    topics: tsPatternsTopics,
  },
]
