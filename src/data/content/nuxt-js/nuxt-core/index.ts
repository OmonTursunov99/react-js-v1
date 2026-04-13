import type { Topic } from '../../../types'
import { nuxtIntro } from './nuxt-intro'
import { fileRouting } from './file-routing'
import { dataFetching } from './data-fetching'
import { renderingModes } from './rendering-modes'
import { nuxtMiddleware } from './nuxt-middleware'

export const nuxtCoreTopics: Topic[] = [
  nuxtIntro,
  fileRouting,
  dataFetching,
  renderingModes,
  nuxtMiddleware,
]
