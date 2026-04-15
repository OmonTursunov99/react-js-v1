import type { Topic } from '../../../types'
import { decoratorPattern } from './decorator-pattern'
import { factoryPattern } from './factory-pattern'
import { modulePattern } from './module-pattern'
import { observerPattern } from './observer-pattern'
import { singleton } from './singleton'
import { strategyPattern } from './strategy-pattern'

export const designPatternsTopics: Topic[] = [
  singleton,
  factoryPattern,
  observerPattern,
  strategyPattern,
  modulePattern,
  decoratorPattern,
]
