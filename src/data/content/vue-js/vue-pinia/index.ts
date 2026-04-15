import type { Topic } from '../../../types'
import { piniaBasics } from './pinia-basics'
import { piniaAdvanced } from './pinia-advanced'
import { piniaVsVuex } from './pinia-vs-vuex'
import { composableStores } from './composable-stores'
import { serverState } from './server-state'

export const vuePiniaTopics: Topic[] = [
  piniaBasics,
  piniaAdvanced,
  piniaVsVuex,
  composableStores,
  serverState,
]
