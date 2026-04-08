import { useEffect, useRef } from 'react'
import { useTimeStore } from '@/stores/time-store'

/**
 * Topic sahifasida o'qish vaqtini kuzatadi.
 * Har 5 sekundda saqlaydi. Tab yashirilsa to'xtatadi.
 */
export function useTimeTracker(sectionId: string | undefined, topicId: string | undefined) {
  const addTime = useTimeStore(s => s.addTime)
  const elapsed = useRef(0)

  useEffect(() => {
    if (!sectionId || !topicId) return

    elapsed.current = 0

    const interval = setInterval(() => {
      if (!document.hidden) {
        elapsed.current += 1
        if (elapsed.current % 5 === 0) {
          addTime(sectionId, topicId, 5)
          elapsed.current = 0
        }
      }
    }, 1000)

    return () => {
      clearInterval(interval)
      if (elapsed.current > 0) {
        addTime(sectionId, topicId, elapsed.current)
      }
    }
  }, [sectionId, topicId, addTime])
}
