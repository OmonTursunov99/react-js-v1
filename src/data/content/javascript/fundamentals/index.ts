import type { Topic } from '../../../types'
import { variables } from './variables'
import { dataTypes } from './data-types'
import { operators } from './operators'
import { controlFlow } from './control-flow'
import { functions } from './functions'
import { scopeHoisting } from './scope-hoisting'
import { strictMode } from './strict-mode'

export const fundamentalsTopics: Topic[] = [
  variables,
  dataTypes,
  operators,
  controlFlow,
  functions,
  scopeHoisting,
  strictMode,
]
