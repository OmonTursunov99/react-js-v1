import type { Topic } from '../../../types'
import { serverApi } from './server-api'
import { nuxtState } from './nuxt-state'
import { modulesPlugins } from './modules-plugins'
import { nuxtDeployment } from './nuxt-deployment'

export const nuxtAdvancedTopics: Topic[] = [
  serverApi,
  nuxtState,
  modulesPlugins,
  nuxtDeployment,
]
