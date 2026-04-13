import type { Topic } from '../../../types'
import { domManipulation } from './dom-manipulation'
import { domTree } from './dom-tree'
import { events } from './events'
import { fetchApi } from './fetch-api'
import { observers } from './observers'
import { webStorage } from './web-storage'
import { webWorkers } from './web-workers'

export const domBrowserTopics: Topic[] = [
  domManipulation,
  domTree,
  events,
  fetchApi,
  observers,
  webStorage,
  webWorkers,
]
