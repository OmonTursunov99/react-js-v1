import type { Topic } from '../../types'
import { vitestJest } from './vitest-jest'
import { rtl } from './rtl'
import { testingPatterns } from './testing-patterns'
import { mocking } from './mocking'
import { e2e } from './e2e'

export const testingTopics: Topic[] = [
  vitestJest,
  rtl,
  testingPatterns,
  mocking,
  e2e,
]
