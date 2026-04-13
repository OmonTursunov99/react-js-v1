import type { Topic } from '../../../types'
import { coreComponents } from './core-components'
import { navigation } from './navigation'
import { platformSpecific } from './platform-specific'
import { rnIntro } from './rn-intro'
import { styling } from './styling'

export const rnCoreTopics: Topic[] = [
  coreComponents,
  navigation,
  platformSpecific,
  rnIntro,
  styling,
]
