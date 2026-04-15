import type { Topic } from '../../../types'
import { propsEmitsTyping } from './props-emits-typing'
import { genericComponents } from './generic-components'
import { typedComposables } from './typed-composables'
import { typedSlotsInject } from './typed-slots-inject'
import { volarDx } from './volar-dx'

export const vueTypescriptTopics: Topic[] = [
  propsEmitsTyping,
  genericComponents,
  typedComposables,
  typedSlotsInject,
  volarDx,
]
