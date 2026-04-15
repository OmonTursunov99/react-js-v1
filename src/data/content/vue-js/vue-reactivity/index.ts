import type { Topic } from '../../../types'
import { refVsReactive } from './ref-vs-reactive'
import { reactivityDeep } from './reactivity-deep'
import { watchersDeep } from './watchers-deep'
import { computedDeep } from './computed-deep'
import { shallowRaw } from './shallow-raw'
import { effectScope } from './effect-scope'

export const vueReactivityTopics: Topic[] = [
  refVsReactive,
  reactivityDeep,
  watchersDeep,
  computedDeep,
  shallowRaw,
  effectScope,
]
