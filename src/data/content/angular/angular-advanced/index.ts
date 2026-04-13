import type { Topic } from '../../../types'
import { forms } from './forms'
import { rxjs } from './rxjs'
import { signals } from './signals'
import { httpClient } from './http-client'
import { changeDetection } from './change-detection'

export const angularAdvancedTopics: Topic[] = [
  forms,
  rxjs,
  signals,
  httpClient,
  changeDetection,
]
