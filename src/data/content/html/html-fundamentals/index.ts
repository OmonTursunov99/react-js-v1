import type { Topic } from '../../../types'
import { documentStructure } from './document-structure'
import { textLists } from './text-lists'
import { semanticHtml } from './semantic-html'
import { linksNavigation } from './links-navigation'
import { forms } from './forms'
import { tables } from './tables'
import { media } from './media'
import { dataAttributes } from './data-attributes'
import { metaSeo } from './meta-seo'
import { accessibility } from './accessibility'

export const htmlFundamentalsTopics: Topic[] = [
  documentStructure,
  textLists,
  semanticHtml,
  linksNavigation,
  forms,
  tables,
  media,
  dataAttributes,
  metaSeo,
  accessibility,
]
