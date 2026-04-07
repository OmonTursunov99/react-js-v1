import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProgressState {
  learnedTopics: string[]
  toggleLearned: (sectionId: string, topicId: string) => void
}

export function makeKey(sectionId: string, topicId: string) {
  return `${sectionId}/${topicId}`
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      learnedTopics: [],

      toggleLearned: (sectionId, topicId) => {
        const key = makeKey(sectionId, topicId)
        set(state => {
          const exists = state.learnedTopics.includes(key)
          return {
            learnedTopics: exists
              ? state.learnedTopics.filter(k => k !== key)
              : [...state.learnedTopics, key],
          }
        })
      },
    }),
    { name: 'interview-prep-progress' },
  ),
)
