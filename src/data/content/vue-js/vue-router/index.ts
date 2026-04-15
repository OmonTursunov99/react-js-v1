import type { Topic } from '../../../types'
import { routerBasics } from './router-basics'
import { navigationGuards } from './navigation-guards'
import { lazyRoutes } from './lazy-routes'
import { nestedRoutes } from './nested-routes'
import { programmaticNavigation } from './programmatic-navigation'
import { routeMeta } from './route-meta'

export const vueRouterTopics: Topic[] = [
  routerBasics,
  navigationGuards,
  lazyRoutes,
  nestedRoutes,
  programmaticNavigation,
  routeMeta,
]
