import type { Topic } from '../../../types'
import { variablesNesting } from './variables-nesting'
import { mixins } from './mixins'
import { extendsPlaceholder } from './extends-placeholder'
import { functionsOperators } from './functions-operators'
import { modules } from './modules'
import { controlFlow } from './control-flow'

export const sassBasicsTopics: Topic[] = [
  variablesNesting,
  mixins,
  extendsPlaceholder,
  functionsOperators,
  modules,
  controlFlow,
]
