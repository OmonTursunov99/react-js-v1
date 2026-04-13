// ══════════════════════════════════════
//  Ketmonjon — Frontend O'quv Platformasi
//  Ierarxiya: Direction → Category → Technology → Section → Topic
//  Locale: 'uz' (keyinchalik 'ru' qo'shiladi)
// ══════════════════════════════════════

export type Locale = 'uz' | 'ru'

export type ImportanceLevel = 1 | 2 | 3

export type TopicStatus = 'known' | 'to-learn'

// ── Topic (eng kichik birlik) ──

export interface CodeExample {
  title: string
  code: string
  language: 'tsx' | 'ts' | 'jsx' | 'js' | 'css' | 'scss' | 'less' | 'html' | 'xml' | 'json' | 'bash'
  description?: string
}

export interface InterviewQA {
  question: string
  answer: string
}

export interface RelatedTopic {
  techId: string
  sectionId: string
  topicId: string
  label: string
}

export interface Topic {
  id: string
  title: string
  importance: ImportanceLevel
  status: TopicStatus
  description: string
  content: string
  codeExamples: CodeExample[]
  interviewQA: InterviewQA[]
  relatedTopics?: RelatedTopic[]
}

// ── Section (bo'lim) ──

export interface Section {
  id: string
  number: number
  title: string
  description: string
  icon: string
  gradient: string
  topics: Topic[]
}

// ── Technology metadata (navigatsiya uchun, kontentsiz) ──

export interface TechnologyMeta {
  id: string
  title: string
  description: string
  icon: string
  gradient: string
  locale: Locale
}

// ── Category ──

export interface Category {
  id: string
  title: string
  description: string
  icon: string
  gradient: string
  technologies: TechnologyMeta[]
}

// ── Direction ──

export interface Direction {
  id: string
  title: string
  description: string
  icon: string
  gradient: string
  categories: Category[]
}
