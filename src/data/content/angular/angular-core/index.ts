import type { Topic } from '../../../types'
import { components } from './components'
import { modules } from './modules'
import { templates } from './templates'
import { dependencyInjection } from './dependency-injection'
import { angularRouting } from './angular-routing'

export const angularCoreTopics: Topic[] = [
  components,
  modules,
  templates,
  dependencyInjection,
  angularRouting,
]
