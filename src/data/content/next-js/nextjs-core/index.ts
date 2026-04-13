import type { Topic } from '../../../types'
import { appRouter } from './app-router'
import { rendering } from './rendering'
import { dataFetching } from './data-fetching'
import { routing } from './routing'
import { middleware } from './middleware'

export const nextjsCoreTopics: Topic[] = [
  appRouter,
  rendering,
  dataFetching,
  routing,
  middleware,
]
