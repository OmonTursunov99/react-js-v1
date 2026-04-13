import type { Section } from '../../types'
import { rnCoreTopics } from './rn-core'
import { rnAdvancedTopics } from './rn-advanced'

export const sections: Section[] = [
  {
    id: 'rn-core',
    number: 1,
    title: 'React Native Asoslari',
    description: 'Core components, styling, navigation',
    icon: '📱',
    gradient: 'from-blue-500 to-purple-500',
    topics: rnCoreTopics,
  },
  {
    id: 'rn-advanced',
    number: 2,
    title: 'React Native Murakkab',
    description: 'Animations, native modules, performance',
    icon: '🔧',
    gradient: 'from-purple-500 to-pink-500',
    topics: rnAdvancedTopics,
  },
]
