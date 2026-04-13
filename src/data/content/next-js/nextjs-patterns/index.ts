import type { Topic } from '../../../types'
import { caching } from './caching'
import { metadataSeo } from './metadata-seo'
import { nextjsErrorHandling } from './nextjs-error-handling'
import { streamingSuspense } from './streaming-suspense'
import { serverClientPatterns } from './server-client-patterns'

export const nextjsPatternsTopics: Topic[] = [
  caching,
  metadataSeo,
  nextjsErrorHandling,
  streamingSuspense,
  serverClientPatterns,
]
