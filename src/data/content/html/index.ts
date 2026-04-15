import type { Section } from '../../types'
import { htmlFundamentalsTopics } from './html-fundamentals'
import { htmlAdvancedTopics } from './html-advanced'

export const sections: Section[] = [
  {
    id: 'html-fundamentals',
    number: 1,
    title: 'HTML Asoslari',
    description: 'Hujjat tuzilmasi, semantik teglar, formalar, media, accessibility',
    icon: '📄',
    gradient: 'from-orange-500 to-red-400',
    topics: htmlFundamentalsTopics,
  },
  {
    id: 'html-advanced',
    number: 2,
    title: 'HTML5 API',
    description: 'SVG, Canvas, iframe, Dialog, Web Components, Performance',
    icon: '🚀',
    gradient: 'from-red-500 to-pink-400',
    topics: htmlAdvancedTopics,
  },
]
