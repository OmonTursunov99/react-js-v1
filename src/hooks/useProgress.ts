import { useProgressStore, makeKey } from '@/stores/progress-store'
import type { Section } from '@/data/types'

export function useProgress() {
  const learnedTopics = useProgressStore(s => s.learnedTopics)
  const toggleLearned = useProgressStore(s => s.toggleLearned)

  function isLearned(techId: string, sectionId: string, topicId: string) {
    return learnedTopics.includes(makeKey(techId, sectionId, topicId))
  }

  function getSectionProgress(techId: string, section: Section) {
    const learned = section.topics.filter(t =>
      learnedTopics.includes(makeKey(techId, section.id, t.id))
    ).length
    return {
      learned,
      total: section.topics.length,
      percent: section.topics.length > 0
        ? Math.round((learned / section.topics.length) * 100)
        : 0,
    }
  }

  function getTechProgress(techId: string, sections: Section[]) {
    let totalLearned = 0
    let totalTopics = 0
    for (const section of sections) {
      for (const topic of section.topics) {
        totalTopics++
        if (learnedTopics.includes(makeKey(techId, section.id, topic.id))) {
          totalLearned++
        }
      }
    }
    return {
      learned: totalLearned,
      total: totalTopics,
      percent: totalTopics > 0 ? Math.round((totalLearned / totalTopics) * 100) : 0,
    }
  }

  return {
    isLearned,
    toggleLearned,
    getSectionProgress,
    getTechProgress,
    totalLearned: learnedTopics.length,
  }
}
