import type { Topic } from '../../../types'
import { functionOverloads } from './function-overloads'
import { typeAssertions } from './type-assertions'
import { indexSignatures } from './index-signatures'
import { readonlyImmutability } from './readonly-immutability'

export const tsFunctionsTypesTopics: Topic[] = [functionOverloads, typeAssertions, indexSignatures, readonlyImmutability]
