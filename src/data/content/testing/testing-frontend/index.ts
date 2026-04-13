import type { Topic } from '../../../types'
import { rtl } from './rtl'
import { componentTesting } from './component-testing'
import { e2eTesting } from './e2e-testing'
import { ciTesting } from './ci-testing'

export const testingFrontendTopics: Topic[] = [
  rtl,
  componentTesting,
  e2eTesting,
  ciTesting,
]
