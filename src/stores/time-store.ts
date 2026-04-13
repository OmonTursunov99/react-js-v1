import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { idbStorage } from './idb-storage'

interface TimeState {
  /** key: "techId/sectionId/topicId", value: seconds */
  topicTimes: Record<string, number>
  addTime: (techId: string, sectionId: string, topicId: string, seconds: number) => void
}

export const useTimeStore = create<TimeState>()(
  persist(
    (set) => ({
      topicTimes: {},

      addTime: (techId, sectionId, topicId, seconds) => {
        const key = `${techId}/${sectionId}/${topicId}`
        set(state => ({
          topicTimes: {
            ...state.topicTimes,
            [key]: (state.topicTimes[key] ?? 0) + seconds,
          },
        }))
      },
    }),
    {
      name: 'ketmonjon-time',
      storage: idbStorage,

      // localStorage dan migratsiya
      migrate: (persisted: unknown) => {
        const state = persisted as TimeState | undefined
        if (!state?.topicTimes) return { topicTimes: {} }

        const migrated: Record<string, number> = {}
        for (const [key, value] of Object.entries(state.topicTimes)) {
          const parts = key.split('/')
          if (parts.length === 2) {
            migrated[`react-js/${key}`] = value
          } else {
            migrated[key] = value
          }
        }

        return { topicTimes: migrated }
      },
      version: 1,
    },
  ),
)

export function getTopicTime(topicTimes: Record<string, number>, techId: string, sectionId: string, topicId: string): number {
  return topicTimes[`${techId}/${sectionId}/${topicId}`] ?? 0
}

export function getSectionTime(topicTimes: Record<string, number>, techId: string, sectionId: string): number {
  const prefix = `${techId}/${sectionId}/`
  let total = 0
  for (const [key, seconds] of Object.entries(topicTimes)) {
    if (key.startsWith(prefix)) total += seconds
  }
  return total
}

export function getTechTime(topicTimes: Record<string, number>, techId: string): number {
  const prefix = `${techId}/`
  let total = 0
  for (const [key, seconds] of Object.entries(topicTimes)) {
    if (key.startsWith(prefix)) total += seconds
  }
  return total
}

export function getTotalTime(topicTimes: Record<string, number>): number {
  let total = 0
  for (const seconds of Object.values(topicTimes)) {
    total += seconds
  }
  return total
}

export function formatTime(totalSeconds: number): string {
  if (totalSeconds <= 0) return '00:00:00'

  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const hh = String(hours).padStart(2, '0')
  const mm = String(minutes).padStart(2, '0')
  const ss = String(seconds).padStart(2, '0')

  if (days > 0) return `${days}d ${hh}:${mm}:${ss}`
  return `${hh}:${mm}:${ss}`
}
