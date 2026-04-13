import type { Section } from '../../types'
import { nuxtCoreTopics } from './nuxt-core'
import { nuxtAdvancedTopics } from './nuxt-advanced'

export const sections: Section[] = [
  {
    id: 'nuxt-core',
    number: 1,
    title: 'Nuxt Asoslari',
    description: 'File routing, data fetching, rendering',
    icon: '🟢',
    gradient: 'from-emerald-600 to-green-400',
    topics: nuxtCoreTopics,
  },
  {
    id: 'nuxt-advanced',
    number: 2,
    title: 'Nuxt Murakkab',
    description: 'Server API, state, deployment',
    icon: '⚡',
    gradient: 'from-green-600 to-teal-400',
    topics: nuxtAdvancedTopics,
  },
]
