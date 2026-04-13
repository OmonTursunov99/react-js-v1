import type { Topic } from '../../../types'
import { reRenderCauses } from './re-render-causes'
import { memoUsememoUsecallback } from './memo-usememo-usecallback'
import { profilerDevtools } from './profiler-devtools'
import { virtualization } from './virtualization'
import { codeSplitting } from './code-splitting'
import { reactCompiler } from './react-compiler'
import { keyProp } from './key-prop'
import { debounceThrottle } from './debounce-throttle'
import { webVitals } from './web-vitals'
import { bundleOptimization } from './bundle-optimization'

export const performanceTopics: Topic[] = [
  reRenderCauses,
  memoUsememoUsecallback,
  profilerDevtools,
  virtualization,
  codeSplitting,
  reactCompiler,
  keyProp,
  debounceThrottle,
  webVitals,
  bundleOptimization,
]
