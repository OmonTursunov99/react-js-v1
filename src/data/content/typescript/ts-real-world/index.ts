import type { Topic } from '../../../types'
import { decorators } from './decorators'
import { brandedTypes } from './branded-types'
import { inferDeep } from './infer-deep'
import { moduleAugmentation } from './module-augmentation'

export const tsRealWorldTopics: Topic[] = [decorators, brandedTypes, inferDeep, moduleAugmentation]
