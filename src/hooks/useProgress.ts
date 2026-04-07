import { useProgressStore, makeKey } from '@/stores/progress-store'
import { sections } from '@/data/sections'

export function useProgress() {
  const learnedTopics = useProgressStore(s => s.learnedTopics)
  const toggleLearned = useProgressStore(s => s.toggleLearned)

  const totalTopics = sections.reduce((sum, s) => sum + s.topics.length, 0)
  const totalLearned = learnedTopics.length
  const overallPercent = totalTopics > 0 ? Math.round((totalLearned / totalTopics) * 100) : 0

  function isLearned(sectionId: string, topicId: string) {
    return learnedTopics.includes(makeKey(sectionId, topicId))
  }

  function getLearnedCountForSection(sectionId: string) {
    return learnedTopics.filter(k => k.startsWith(`${sectionId}/`)).length
  }

  function getSectionPercent(sectionId: string, topicCount: number) {
    if (topicCount === 0) return 0
    return Math.round((getLearnedCountForSection(sectionId) / topicCount) * 100)
  }

  return {
    totalTopics,
    totalLearned,
    overallPercent,
    toggleLearned,
    isLearned,
    getSectionPercent,
    getLearnedCountForSection,
  }
}
