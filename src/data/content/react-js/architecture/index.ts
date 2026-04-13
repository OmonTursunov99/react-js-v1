import type { Topic } from '../../../types'
import { fsd } from './fsd'
import { solidReact } from './solid-react'
import { atomicDesign } from './atomic-design'
import { monorepo } from './monorepo'
import { ciCd } from './ci-cd'
import { accessibility } from './accessibility'
import { errorHandling } from './error-handling'

export const architectureTopics: Topic[] = [
  fsd,
  solidReact,
  atomicDesign,
  monorepo,
  ciCd,
  accessibility,
  errorHandling,
]
