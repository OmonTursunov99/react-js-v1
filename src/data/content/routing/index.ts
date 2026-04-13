import type { Topic } from '../../types'
import { reactRouterBasics } from './react-router-basics'
import { protectedRoutes } from './protected-routes'
import { lazyRoutes } from './lazy-routes'
import { loadersActions } from './loaders-actions'
import { navigationHooks } from './navigation-hooks'
import { nestedLayouts } from './nested-layouts'

export const routingTopics: Topic[] = [
  reactRouterBasics,
  protectedRoutes,
  lazyRoutes,
  loadersActions,
  navigationHooks,
  nestedLayouts,
]
