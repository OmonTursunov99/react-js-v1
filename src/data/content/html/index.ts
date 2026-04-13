import type { Section } from '../../types'
import { htmlFundamentalsTopics } from './html-fundamentals'
import { htmlAdvancedTopics } from './html-advanced'

export const sections: Section[] = [
  {
    id: 'html-fundamentals',
    number: 1,
    title: 'HTML Asoslari',
    description: 'Semantik teglar, formalar, jadvallar, media va accessibility',
    icon: '📄',
    gradient: 'from-orange-500 to-red-400',
    topics: htmlFundamentalsTopics,
  },
  {
    id: 'html-advanced',
    number: 2,
    title: 'HTML5 API',
    description: 'Canvas, Web Components va Drag and Drop',
    icon: '🚀',
    gradient: 'from-red-500 to-pink-400',
    topics: htmlAdvancedTopics,
  },
]
