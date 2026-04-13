import type { Topic } from '../../types'
import { compositionVsInheritance } from './composition-vs-inheritance'
import { compoundComponents } from './compound-components'
import { renderProps } from './render-props'
import { hoc } from './hoc'
import { customHooks } from './custom-hooks'
import { controlledVsUncontrolled } from './controlled-vs-uncontrolled'
import { errorBoundaries } from './error-boundaries'
import { suspenseLazy } from './suspense-lazy'
import { portal } from './portal'
import { childrenApi } from './children-api'
import { providerPattern } from './provider-pattern'
import { polymorphicComponents } from './polymorphic-components'

export const componentPatternsTopics: Topic[] = [
  compositionVsInheritance,
  compoundComponents,
  renderProps,
  hoc,
  customHooks,
  controlledVsUncontrolled,
  errorBoundaries,
  suspenseLazy,
  portal,
  childrenApi,
  providerPattern,
  polymorphicComponents,
]
