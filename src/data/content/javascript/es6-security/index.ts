import type { Topic } from '../../../types'
import { es2020Features } from './es2020-features'
import { es2021_2022 } from './es2021-2022'
import { es2023_2024 } from './es2023-2024'
import { xssProtection } from './xss-protection'
import { corsSecurity } from './cors-security'

export const es6SecurityTopics: Topic[] = [
  es2020Features,
  es2021_2022,
  es2023_2024,
  xssProtection,
  corsSecurity,
]
