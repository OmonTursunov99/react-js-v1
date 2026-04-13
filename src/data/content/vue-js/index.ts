import type { Section } from '../../types'
import { vueCoreTopics } from './vue-core'
import { vueAdvancedTopics } from './vue-advanced'
import { vuePatternsTopics } from './vue-patterns'

export const sections: Section[] = [
  {
    id: 'vue-core',
    number: 1,
    title: 'Vue Asoslari',
    description: 'Composition API, components, directives',
    icon: '💚',
    gradient: 'from-green-500 to-teal-400',
    topics: vueCoreTopics,
  },
  {
    id: 'vue-advanced',
    number: 2,
    title: 'Vue Murakkab',
    description: 'Reactivity, composables, Pinia, Router',
    icon: '🔧',
    gradient: 'from-teal-500 to-emerald-400',
    topics: vueAdvancedTopics,
  },
  {
    id: 'vue-patterns',
    number: 3,
    title: 'Vue Patternlar',
    description: 'Vue vs React, performance, testing',
    icon: '🧩',
    gradient: 'from-emerald-600 to-green-400',
    topics: vuePatternsTopics,
  },
]
