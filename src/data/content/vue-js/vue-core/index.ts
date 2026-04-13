import type { Topic } from '../../../types'
import { compositionApi } from './composition-api'
import { components } from './components'
import { directives } from './directives'
import { lifecycle } from './lifecycle'
import { templateRefs } from './template-refs'

export const vueCoreTopics: Topic[] = [
  compositionApi,
  components,
  directives,
  lifecycle,
  templateRefs,
]
