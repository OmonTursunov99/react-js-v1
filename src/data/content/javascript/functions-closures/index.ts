import type { Topic } from '../../../types'
import { executionContext } from './execution-context'
import { callStack } from './call-stack'
import { closures } from './closures'
import { iife } from './iife'
import { higherOrderFunctions } from './higher-order-functions'
import { recursion } from './recursion'
import { currying } from './currying'

export const functionsClosuresTopics: Topic[] = [
  executionContext,
  callStack,
  closures,
  iife,
  higherOrderFunctions,
  recursion,
  currying,
]
