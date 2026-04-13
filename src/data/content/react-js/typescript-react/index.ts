import type { Topic } from '../../../types'
import { propsTyping } from './props-typing'
import { genericComponents } from './generic-components'
import { eventTypes } from './event-types'
import { childrenTypes } from './children-types'
import { discriminatedUnions } from './discriminated-unions'
import { utilityTypes } from './utility-types'
import { asConstSatisfies } from './as-const-satisfies'
import { hooksTyping } from './hooks-typing'

export const typescriptReactTopics: Topic[] = [
  propsTyping,
  genericComponents,
  eventTypes,
  childrenTypes,
  discriminatedUnions,
  utilityTypes,
  asConstSatisfies,
  hooksTyping,
]
