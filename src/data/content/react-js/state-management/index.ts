import type { Topic } from '../../../types'
import { reduxToolkit } from './redux-toolkit'
import { zustand } from './zustand'
import { tanstackQuery } from './tanstack-query'
import { contextApi } from './context-api'
import { reduxMiddleware } from './redux-middleware'
import { rtkQuery } from './rtk-query'
import { tanstackQueryDeep } from './tanstack-query-deep'
import { whenToUseWhat } from './when-to-use-what'

export const stateManagementTopics: Topic[] = [
  reduxToolkit,
  zustand,
  tanstackQuery,
  contextApi,
  reduxMiddleware,
  rtkQuery,
  tanstackQueryDeep,
  whenToUseWhat,
]
