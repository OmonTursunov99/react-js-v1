import type { Topic } from '../types'

export const architectureTopics: Topic[] = [
  {
    id: 'fsd',
    title: 'Feature-Sliced Design (FSD)',
    importance: 3,
    status: 'to-learn',
    description: 'shared → entities → features → widgets → pages → app',
    content: '',
    codeExamples: [],
    interviewQA: [],
    relatedTopics: [
      { sectionId: 'architecture', topicId: 'atomic-design', label: 'Atomic Design (alternativa)' },
      { sectionId: 'architecture', topicId: 'solid-react', label: 'SOLID printsiplari' },
    ],
  },
  {
    id: 'solid-react',
    title: 'SOLID in React',
    importance: 2,
    status: 'to-learn',
    description: 'Single Responsibility, DI in components, Open/Closed',
    content: '',
    codeExamples: [],
    interviewQA: [],
    relatedTopics: [
      { sectionId: 'component-patterns', topicId: 'composition-vs-inheritance', label: 'Composition' },
      { sectionId: 'component-patterns', topicId: 'custom-hooks', label: 'Custom Hooks (SRP)' },
      { sectionId: 'architecture', topicId: 'fsd', label: 'FSD (arxitektura)' },
    ],
  },
  {
    id: 'atomic-design',
    title: 'Atomic Design',
    importance: 2,
    status: 'to-learn',
    description: 'atoms → molecules → organisms → templates → pages',
    content: '',
    codeExamples: [],
    interviewQA: [],
    relatedTopics: [
      { sectionId: 'architecture', topicId: 'fsd', label: 'FSD (alternativa)' },
      { sectionId: 'component-patterns', topicId: 'composition-vs-inheritance', label: 'Composition' },
    ],
  },
  {
    id: 'monorepo',
    title: 'Monorepo',
    importance: 1,
    status: 'to-learn',
    description: 'Turborepo, Nx — katta loyiha tuzilmasi',
    content: '',
    codeExamples: [],
    interviewQA: [],
    relatedTopics: [
      { sectionId: 'architecture', topicId: 'ci-cd', label: 'CI/CD' },
    ],
  },
  {
    id: 'ci-cd',
    title: 'CI/CD',
    importance: 2,
    status: 'to-learn',
    description: 'GitHub Actions, deploy pipeline, lint + test + build',
    content: '',
    codeExamples: [],
    interviewQA: [],
    relatedTopics: [
      { sectionId: 'testing', topicId: 'e2e', label: 'E2E (pipeline)' },
      { sectionId: 'architecture', topicId: 'monorepo', label: 'Monorepo' },
    ],
  },
  {
    id: 'accessibility',
    title: 'Accessibility (a11y)',
    importance: 2,
    status: 'to-learn',
    description: 'ARIA attributes, semantic HTML, keyboard navigation',
    content: '',
    codeExamples: [],
    interviewQA: [],
    relatedTopics: [
      { sectionId: 'testing', topicId: 'rtl', label: 'RTL (getByRole)' },
      { sectionId: 'react-core', topicId: 'use-id', label: 'useId (aria-*)' },
    ],
  },

  // ===== YANGI MAVZULAR =====
  {
    id: 'error-handling',
    title: 'Error Handling Strategies',
    importance: 2,
    status: 'to-learn',
    description: 'try/catch, Error Boundary, global error handler, logging',
    content: '',
    codeExamples: [],
    interviewQA: [],
    relatedTopics: [
      { sectionId: 'component-patterns', topicId: 'error-boundaries', label: 'Error Boundaries' },
      { sectionId: 'state-management', topicId: 'tanstack-query-deep', label: 'TanStack Query error handling' },
    ],
  },
]
