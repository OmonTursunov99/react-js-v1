import type { Topic } from '../../../types'
import { bigO } from './big-o'
import { arrayStringPatterns } from './array-string-patterns'
import { linkedList } from './linked-list'
import { stackQueue } from './stack-queue'
import { hashTable } from './hash-table'
import { treeBst } from './tree-bst'
import { sortingAlgorithms } from './sorting-algorithms'
import { searchingAlgorithms } from './searching-algorithms'
import { graphBasics } from './graph-basics'
import { dynamicProgramming } from './dynamic-programming'

export const dsaTopics: Topic[] = [
  bigO,
  arrayStringPatterns,
  hashTable,
  linkedList,
  stackQueue,
  sortingAlgorithms,
  searchingAlgorithms,
  treeBst,
  graphBasics,
  dynamicProgramming,
]
