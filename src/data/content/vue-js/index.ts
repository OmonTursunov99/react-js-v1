import type { Section } from '../../types'
import { vueCoreTopics } from './vue-core'
import { vueReactivityTopics } from './vue-reactivity'
import { vueAdvancedTopics } from './vue-advanced'
import { vueRouterTopics } from './vue-router'
import { vuePiniaTopics } from './vue-pinia'
import { vueTypescriptTopics } from './vue-typescript'
import { vuePatternsTopics } from './vue-patterns'
import { vueTheoryTopics } from './vue-theory'

export const sections: Section[] = [
  {
    id: 'vue-core',
    number: 1,
    title: 'Vue Asoslari',
    description: 'Composition API, components, directives, v-model, slots',
    icon: '💚',
    gradient: 'from-green-500 to-teal-400',
    topics: vueCoreTopics,
  },
  {
    id: 'vue-reactivity',
    number: 2,
    title: 'Vue Reaktivlik',
    description: 'ref, reactive, watch, computed, Proxy tizimi',
    icon: '⚡',
    gradient: 'from-teal-400 to-cyan-400',
    topics: vueReactivityTopics,
  },
  {
    id: 'vue-advanced',
    number: 3,
    title: 'Vue Murakkab',
    description: 'Composables, render functions, plugins, transitions',
    icon: '🔧',
    gradient: 'from-teal-500 to-emerald-400',
    topics: vueAdvancedTopics,
  },
  {
    id: 'vue-router',
    number: 4,
    title: 'Vue Router',
    description: 'Routes, guards, lazy loading, nested routes',
    icon: '🧭',
    gradient: 'from-cyan-500 to-blue-400',
    topics: vueRouterTopics,
  },
  {
    id: 'vue-pinia',
    number: 5,
    title: 'Pinia & State',
    description: 'Store, actions, getters, plugins, server state',
    icon: '🍍',
    gradient: 'from-yellow-500 to-amber-400',
    topics: vuePiniaTopics,
  },
  {
    id: 'vue-typescript',
    number: 6,
    title: 'TypeScript + Vue',
    description: 'Props tipizatsiya, generics, Volar, typed composables',
    icon: '🔷',
    gradient: 'from-blue-600 to-indigo-500',
    topics: vueTypescriptTopics,
  },
  {
    id: 'vue-patterns',
    number: 7,
    title: 'Vue Patternlar',
    description: 'Vue vs React, performance, testing, SSR, a11y',
    icon: '🧩',
    gradient: 'from-emerald-600 to-green-400',
    topics: vuePatternsTopics,
  },
  {
    id: 'vue-theory',
    number: 8,
    title: 'Nazariy Savollar',
    description: "100% so'raladigan intervyu savollari",
    icon: '📝',
    gradient: 'from-violet-500 to-purple-400',
    topics: vueTheoryTopics,
  },
]
