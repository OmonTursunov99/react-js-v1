import type { Section } from '../../types'
import { cssFundamentalsTopics } from './css-fundamentals'
import { cssLayoutTopics } from './css-layout'
import { cssAdvancedTopics } from './css-advanced'

export const sections: Section[] = [
  {
    id: 'css-fundamentals',
    number: 1,
    title: 'CSS Asoslari',
    description: 'Selectors, box model, positioning',
    icon: '🎨',
    gradient: 'from-blue-500 to-blue-400',
    topics: cssFundamentalsTopics,
  },
  {
    id: 'css-layout',
    number: 2,
    title: 'Layout',
    description: 'Flexbox, Grid, Responsive',
    icon: '📐',
    gradient: 'from-purple-500 to-blue-400',
    topics: cssLayoutTopics,
  },
  {
    id: 'css-advanced',
    number: 3,
    title: 'Murakkab CSS',
    description: 'Animatsiyalar, variables, modern CSS',
    icon: '✨',
    gradient: 'from-pink-500 to-purple-400',
    topics: cssAdvancedTopics,
  },
]
