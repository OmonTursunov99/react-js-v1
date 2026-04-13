import type { Topic } from '../../../types'
import { xmlSyntax } from './xml-syntax'
import { dtdSchema } from './dtd-schema'
import { xpath } from './xpath'
import { xslt } from './xslt'
import { xmlVsJson } from './xml-vs-json'

export const xmlBasicsTopics: Topic[] = [
  xmlSyntax,
  dtdSchema,
  xpath,
  xslt,
  xmlVsJson,
]
