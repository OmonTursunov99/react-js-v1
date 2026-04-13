import type { Topic } from '../../../types'
import { tryCatch } from './try-catch'
import { errorTypes } from './error-types'
import { customErrors } from './custom-errors'
import { asyncErrors } from './async-errors'
import { globalErrorHandling } from './global-error-handling'

export const errorHandlingTopics: Topic[] = [
  tryCatch,
  errorTypes,
  customErrors,
  asyncErrors,
  globalErrorHandling,
]
