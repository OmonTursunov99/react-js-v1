import type { Topic } from '../../../types'
import { testingOverview } from './testing-overview'
import { vitestJest } from './vitest-jest'
import { mocking } from './mocking'
import { asyncTesting } from './async-testing'

export const testingFundamentalsTopics: Topic[] = [
  testingOverview,
  vitestJest,
  mocking,
  asyncTesting,
]
