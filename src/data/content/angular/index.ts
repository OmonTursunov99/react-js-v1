import type { Section } from '../../types'
import { angularCoreTopics } from './angular-core'
import { angularAdvancedTopics } from './angular-advanced'

export const sections: Section[] = [
  {
    id: 'angular-core',
    number: 1,
    title: 'Angular Asoslari',
    description: 'Components, modules, DI, routing',
    icon: '🅰️',
    gradient: 'from-red-500 to-rose-400',
    topics: angularCoreTopics,
  },
  {
    id: 'angular-advanced',
    number: 2,
    title: 'Angular Murakkab',
    description: 'Forms, RxJS, Signals, Change Detection',
    icon: '🔥',
    gradient: 'from-rose-500 to-red-400',
    topics: angularAdvancedTopics,
  },
]
