import type { Topic } from '../../../types'
import { proxyReflect } from './proxy-reflect'
import { symbol } from './symbol'
import { iteratorsGenerators } from './iterators-generators'
import { weakmapWeakset } from './weakmap-weakset'
import { mapSet } from './map-set'
import { regex } from './regex'
import { modules } from './modules'
import { memoryManagement } from './memory-management'
import { debounceThrottle } from './debounce-throttle'

export const advancedTopics: Topic[] = [
  modules,
  mapSet,
  weakmapWeakset,
  symbol,
  iteratorsGenerators,
  proxyReflect,
  regex,
  debounceThrottle,
  memoryManagement,
]
