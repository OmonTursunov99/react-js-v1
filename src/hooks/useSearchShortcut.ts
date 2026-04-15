import { useEffect } from 'react'
import { useSearchStore } from '@/stores/search-store'

export function useSearchShortcut() {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        const { isOpen, open, close } = useSearchStore.getState()
        if (isOpen) close()
        else open()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
}
