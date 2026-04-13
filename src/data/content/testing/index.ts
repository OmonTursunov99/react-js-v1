import type { Section } from '../../types'
import { testingFundamentalsTopics } from './testing-fundamentals'
import { testingFrontendTopics } from './testing-frontend'

export const sections: Section[] = [
  {
    id: 'testing-fundamentals',
    number: 1,
    title: 'Test Asoslari',
    description: 'Unit testing, mocking, async',
    icon: '🧪',
    gradient: 'from-green-500 to-emerald-400',
    topics: testingFundamentalsTopics,
  },
  {
    id: 'testing-frontend',
    number: 2,
    title: 'Frontend Testing',
    description: 'RTL, component testing, E2E',
    icon: '🖥️',
    gradient: 'from-teal-500 to-cyan-400',
    topics: testingFrontendTopics,
  },
]
