export type ImportanceLevel = 1 | 2 | 3

export type TopicStatus = 'known' | 'to-learn'

export interface CodeExample {
  title: string
  code: string
  language: 'tsx' | 'ts' | 'css'
  description?: string
}

export interface InterviewQA {
  question: string
  answer: string
}

export interface RelatedTopic {
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

export interface Section {
  id: string
  number: number
  title: string
  description: string
  icon: string
  gradient: string
  topics: Topic[]
}
