import type { Topic } from '../../../types'
import { composables } from './composables'
import { renderFunctions } from './render-functions'
import { customDirectives } from './custom-directives'
import { plugins } from './plugins'
import { asyncComponents } from './async-components'
import { transitions } from './transitions'
import { errorHandling } from './error-handling'

export const vueAdvancedTopics: Topic[] = [
  composables,
  renderFunctions,
  customDirectives,
  plugins,
  asyncComponents,
  transitions,
  errorHandling,
]
