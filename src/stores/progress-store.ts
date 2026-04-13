import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { idbStorage } from './idb-storage'

interface ProgressState {
  /** key format: "techId/sectionId/topicId" */
  learnedTopics: string[]
  toggleLearned: (techId: string, sectionId: string, topicId: string) => void
}

export function makeKey(techId: string, sectionId: string, topicId: string) {
  return `${techId}/${sectionId}/${topicId}`
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      learnedTopics: [],

      toggleLearned: (techId, sectionId, topicId) => {
        const key = makeKey(techId, sectionId, topicId)
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
    {
      name: 'ketmonjon-progress',
      storage: idbStorage,

      // localStorage dan migratsiya: eski "sectionId/topicId" → "react-js/sectionId/topicId"
      migrate: (persisted: unknown) => {
        const state = persisted as ProgressState | undefined
        if (!state?.learnedTopics) return { learnedTopics: [] }

        const migrated = state.learnedTopics.map(key => {
          // Eski format: "react-core/use-state" (2 qism)
          // Yangi format: "react-js/react-core/use-state" (3 qism)
          const parts = key.split('/')
          if (parts.length === 2) return `react-js/${key}`
          return key
        })

        return { learnedTopics: migrated }
      },
      version: 1,
    },
  ),
)
