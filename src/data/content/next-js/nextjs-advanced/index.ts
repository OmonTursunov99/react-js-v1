import type { Topic } from '../../../types'
import { apiRoutes } from './api-routes'
import { serverActions } from './server-actions'
import { imageFonts } from './image-fonts'
import { deployment } from './deployment'

export const nextjsAdvancedTopics: Topic[] = [
  apiRoutes,
  serverActions,
  imageFonts,
  deployment,
]
