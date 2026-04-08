import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TimeState {
  /** key: "sectionId/topicId", value: seconds */
  topicTimes: Record<string, number>
  addTime: (sectionId: string, topicId: string, seconds: number) => void
}

export const useTimeStore = create<TimeState>()(
  persist(
    (set) => ({
      topicTimes: {},

      addTime: (sectionId, topicId, seconds) => {
        const key = `${sectionId}/${topicId}`
        set(state => ({
          topicTimes: {
            ...state.topicTimes,
            [key]: (state.topicTimes[key] ?? 0) + seconds,
          },
        }))
      },
    }),
    { name: 'study-time' }
  )
)

export function getTopicTime(topicTimes: Record<string, number>, sectionId: string, topicId: string): number {
  return topicTimes[`${sectionId}/${topicId}`] ?? 0
}

export function getSectionTime(topicTimes: Record<string, number>, sectionId: string): number {
  let total = 0
  for (const [key, seconds] of Object.entries(topicTimes)) {
    if (key.startsWith(sectionId + '/')) {
      total += seconds
    }
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

  if (days > 0) {
    return `${days}d ${hh}:${mm}:${ss}`
  }
  return `${hh}:${mm}:${ss}`
}
