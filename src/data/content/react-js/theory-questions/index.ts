import type { Topic } from '../../../types'
import { virtualDomTheory } from './virtual-dom-theory'
import { reactLifecycle } from './react-lifecycle'
import { rulesOfHooks } from './rules-of-hooks'
import { controlledUncontrolledTheory } from './controlled-uncontrolled-theory'
import { keyImportance } from './key-importance'
import { effectVsLayoutEffect } from './effect-vs-layout-effect'
import { propsDrilling } from './props-drilling'
import { ssrCsrSsg } from './ssr-csr-ssg'
import { react1819 } from './react-18-19'
import { restVsGraphql } from './rest-vs-graphql'
import { closuresInHooks } from './closures-in-hooks'
import { fiberArchitecture } from './fiber-architecture'
import { hydration } from './hydration'
import { serverComponents } from './server-components'
import { concurrentMode } from './concurrent-mode'

export const theoryQuestionsTopics: Topic[] = [
  virtualDomTheory,
  reactLifecycle,
  rulesOfHooks,
  controlledUncontrolledTheory,
  keyImportance,
  effectVsLayoutEffect,
  propsDrilling,
  ssrCsrSsg,
  react1819,
  restVsGraphql,
  closuresInHooks,
  fiberArchitecture,
  hydration,
  serverComponents,
  concurrentMode,
]
