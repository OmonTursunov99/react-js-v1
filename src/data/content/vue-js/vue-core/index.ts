import type { Topic } from '../../../types'
import { compositionApi } from './composition-api'
import { components } from './components'
import { directives } from './directives'
import { lifecycle } from './lifecycle'
import { templateRefs } from './template-refs'
import { vModel } from './v-model'
import { slots } from './slots'
import { provideInject } from './provide-inject'
import { eventHandling } from './event-handling'
import { conditionalRendering } from './conditional-rendering'
import { scriptSetup } from './script-setup'

export const vueCoreTopics: Topic[] = [
  compositionApi,
  components,
  directives,
  lifecycle,
  templateRefs,
  vModel,
  slots,
  provideInject,
  eventHandling,
  conditionalRendering,
  scriptSetup,
]
