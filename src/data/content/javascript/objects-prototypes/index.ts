import type { Topic } from '../../../types'
import { objectBasics } from './object-basics'
import { destructuringSpread } from './destructuring-spread'
import { propertyDescriptors } from './property-descriptors'
import { prototypeChain } from './prototype-chain'
import { objectCreate } from './object-create'
import { thisKeyword } from './this-keyword'
import { newKeyword } from './new-keyword'

export const objectsPrototypesTopics: Topic[] = [
  objectBasics,
  destructuringSpread,
  thisKeyword,
  prototypeChain,
  newKeyword,
  objectCreate,
  propertyDescriptors,
]
