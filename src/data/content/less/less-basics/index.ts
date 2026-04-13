import type { Topic } from '../../../types'
import { variablesNesting } from './variables-nesting'
import { mixins } from './mixins'
import { functions } from './functions'
import { imports } from './imports'
import { sassVsLess } from './sass-vs-less'

export const lessBasicsTopics: Topic[] = [
  variablesNesting,
  mixins,
  functions,
  imports,
  sassVsLess,
]
