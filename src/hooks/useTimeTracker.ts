import { useRef, useEffect, useState, useCallback, useSyncExternalStore } from 'react'
import { useTimeStore, getTopicTime } from '@/stores/time-store'

/**
 * Window focus holatini kuzatish (useSyncExternalStore).
 * document.hidden o'rniga document.hasFocus() — 2-monitorga
 * o'tganda ham focus yo'qolishini aniqlaydi.
 */
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
  sectionId: string | undefined,
  topicId: string | undefined,
): TimeTrackerResult {
  const addTime = useTimeStore(s => s.addTime)
  const topicTimes = useTimeStore(s => s.topicTimes)
  const savedTime = sectionId && topicId ? getTopicTime(topicTimes, sectionId, topicId) : 0

  const isFocused = useSyncExternalStore(subscribeFocus, getIsFocused)
  const [manualPause, setManualPause] = useState(false)
  const isPaused = !isFocused || manualPause

  const key = sectionId && topicId ? `${sectionId}/${topicId}` : ''
  const [prevKey, setPrevKey] = useState(key)
  const [prevPaused, setPrevPaused] = useState(isPaused)
  const [tick, setTick] = useState(0)

  // Topic o'zgarganda reset (React docs: set state during render)
  if (prevKey !== key) {
    setPrevKey(key)
    setTick(0)
    setManualPause(false)
  }

  // Pause holati o'zgarganda tick reset
  // (flush effect cleanup da bo'ladi, savedTime yangilanadi)
  if (prevPaused !== isPaused) {
    setPrevPaused(isPaused)
    setTick(0)
  }

  const unsaved = useRef(0)

  useEffect(() => {
    if (!sectionId || !topicId || isPaused) return

    unsaved.current = 0

    const interval = setInterval(() => {
      unsaved.current += 1

      if (unsaved.current >= 5) {
        addTime(sectionId, topicId, unsaved.current)
        unsaved.current = 0
      }

      setTick(unsaved.current)
    }, 1000)

    return () => {
      clearInterval(interval)
      if (unsaved.current > 0) {
        addTime(sectionId, topicId, unsaved.current)
        unsaved.current = 0
      }
    }
  }, [sectionId, topicId, addTime, isPaused])

  const togglePause = useCallback(() => {
    setManualPause(prev => !prev)
  }, [])

  return { liveTime: savedTime + tick, isPaused, togglePause }
}
