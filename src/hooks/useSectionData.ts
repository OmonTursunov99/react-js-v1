import { sections } from '@/data/sections'

export function useSectionData(sectionId: string | undefined) {
  if (!sectionId) return null
  return sections.find(s => s.id === sectionId) ?? null
}
