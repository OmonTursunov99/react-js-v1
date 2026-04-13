import type { Topic } from '../../../types'
import { eventLoopTopic } from './event-loop'
import { callbacksTopic } from './callbacks'
import { promisesTopic } from './promises'
import { asyncAwaitTopic } from './async-await'
import { promiseMethodsTopic } from './promise-methods'
import { microtasksMacrotasksTopic } from './microtasks-macrotasks'

export const asyncJavascriptTopics: Topic[] = [
  eventLoopTopic,
  callbacksTopic,
  promisesTopic,
  asyncAwaitTopic,
  promiseMethodsTopic,
  microtasksMacrotasksTopic,
]
