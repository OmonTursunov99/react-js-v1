import { useRef, useEffect, useState, useCallback, useSyncExternalStore } from 'react'
import { useTimeStore, getTopicTime } from '@/stores/time-store'

function subscribeFocus(callback: () => void) {
  window.addEventListener('focus', callback)
  window.addEventListener('blur', callback)
  return () => {
    window.removeEventListener('focus', callback)
    window.removeEventListener('blur', callback)
  }
}

const getIsFocused = () => document.hasFocus()

interface TimeTrackerResult {
  liveTime: number
  isPaused: boolean
  togglePause: () => void
}

export function useTimeTracker(
  techId: string | undefined,
  sectionId: string | undefined,
  topicId: string | undefined,
): TimeTrackerResult {
  const addTime = useTimeStore(s => s.addTime)
  const topicTimes = useTimeStore(s => s.topicTimes)
  const savedTime = techId && sectionId && topicId
    ? getTopicTime(topicTimes, techId, sectionId, topicId)
    : 0

  const isFocused = useSyncExternalStore(subscribeFocus, getIsFocused)
  const [manualPause, setManualPause] = useState(false)
  const isPaused = !isFocused || manualPause

  const key = techId && sectionId && topicId ? `${techId}/${sectionId}/${topicId}` : ''
  const [prevKey, setPrevKey] = useState(key)
  const [prevPaused, setPrevPaused] = useState(isPaused)
  const [tick, setTick] = useState(0)

  if (prevKey !== key) {
    setPrevKey(key)
    setTick(0)
    setManualPause(false)
  }

  if (prevPaused !== isPaused) {
    setPrevPaused(isPaused)
    setTick(0)
  }

  const unsaved = useRef(0)

  useEffect(() => {
    if (!techId || !sectionId || !topicId || isPaused) return

    unsaved.current = 0

    const interval = setInterval(() => {
      unsaved.current += 1

      if (unsaved.current >= 5) {
        addTime(techId, sectionId, topicId, unsaved.current)
        unsaved.current = 0
      }

      setTick(unsaved.current)
    }, 1000)

    return () => {
      clearInterval(interval)
      if (unsaved.current > 0) {
        addTime(techId, sectionId, topicId, unsaved.current)
        unsaved.current = 0
      }
    }
  }, [techId, sectionId, topicId, addTime, isPaused])

  const togglePause = useCallback(() => {
    setManualPause(prev => !prev)
  }, [])

  return { liveTime: savedTime + tick, isPaused, togglePause }
}
