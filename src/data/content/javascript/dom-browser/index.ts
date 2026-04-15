import type { Topic } from '../../../types'
import { domManipulation } from './dom-manipulation'
import { domTree } from './dom-tree'
import { events } from './events'
import { fetchApi } from './fetch-api'
import { observers } from './observers'
import { webStorage } from './web-storage'
import { serviceWorkers } from './service-workers'
import { webWorkers } from './web-workers'
import { websocket } from './websocket'

export const domBrowserTopics: Topic[] = [
  domTree,
  domManipulation,
  events,
  webStorage,
  fetchApi,
  websocket,
  observers,
  webWorkers,
  serviceWorkers,
]
