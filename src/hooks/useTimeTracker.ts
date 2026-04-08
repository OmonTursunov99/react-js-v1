import { useEffect, useRef, useState } from 'react'
import { useTimeStore, getTopicTime } from '@/stores/time-store'

/**
 * Topic sahifasida o'qish vaqtini kuzatadi.
 * Saqlangan vaqtdan davom etadi. Har sekundda live yangilanadi.
 * Tab yashirilsa to'xtatadi. Har 5 sekundda localStorage-ga saqlaydi.
 *
 * @returns liveTime — saqlangan + hozirgi session vaqti (sekund)
 */
export function useTimeTracker(sectionId: string | undefined, topicId: string | undefined): number {
  const addTime = useTimeStore(s => s.addTime)
  const topicTimes = useTimeStore(s => s.topicTimes)
  const savedTime = sectionId && topicId ? getTopicTime(topicTimes, sectionId, topicId) : 0

  const elapsed = useRef(0)
  const unsaved = useRef(0)
  const [liveElapsed, setLiveElapsed] = useState(0)

  useEffect(() => {
    if (!sectionId || !topicId) return

    elapsed.current = 0
    unsaved.current = 0
    setLiveElapsed(0)

    const interval = setInterval(() => {
      if (!document.hidden) {
        elapsed.current += 1
        unsaved.current += 1
        setLiveElapsed(elapsed.current)

        if (unsaved.current >= 5) {
          addTime(sectionId, topicId, unsaved.current)
          unsaved.current = 0
        }
      }
    }, 1000)

    return () => {
      clearInterval(interval)
      if (unsaved.current > 0) {
        addTime(sectionId, topicId, unsaved.current)
      }
    }
  }, [sectionId, topicId, addTime])

  return savedTime + liveElapsed
}
