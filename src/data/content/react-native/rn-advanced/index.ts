import type { Topic } from '../../../types'
import { stateAsync } from './state-async'
import { animations } from './animations'
import { nativeModules } from './native-modules'
import { rnPerformance } from './rn-performance'

export const rnAdvancedTopics: Topic[] = [
  stateAsync,
  animations,
  nativeModules,
  rnPerformance,
]
