import type { Section } from '../../types'
import { xmlBasicsTopics } from './xml-basics'

export const sections: Section[] = [
  {
    id: 'xml-basics',
    number: 1,
    title: 'XML Asoslari',
    description: 'XML sintaksisi, DTD, Schema, XPath va XSLT',
    icon: '📋',
    gradient: 'from-amber-600 to-orange-400',
    topics: xmlBasicsTopics,
  },
]
