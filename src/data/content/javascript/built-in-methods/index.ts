import type { Topic } from '../../../types'
import { arrayMethods } from './array-methods'
import { stringMethods } from './string-methods'
import { numberMath } from './number-math'
import { dateIntl } from './date-intl'
import { jsonStructuredClone } from './json-structured-clone'

export const builtInMethodsTopics: Topic[] = [
  arrayMethods,
  stringMethods,
  numberMath,
  dateIntl,
  jsonStructuredClone,
]
