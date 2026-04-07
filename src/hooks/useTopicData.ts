import { sections } from '@/data/sections'

export function useTopicData(sectionId: string | undefined, topicId: string | undefined) {
  if (!sectionId || !topicId) return { section: null, topic: null }
  const section = sections.find(s => s.id === sectionId) ?? null
  const topic = section?.topics.find(t => t.id === topicId) ?? null
  return { section, topic }
}
