import type { Topic } from '../../../types'
import { composables } from './composables'
import { reactivityDeep } from './reactivity-deep'
import { stateManagement } from './state-management'
import { vueRouter } from './vue-router'

export const vueAdvancedTopics: Topic[] = [
  composables,
  reactivityDeep,
  stateManagement,
  vueRouter,
]
