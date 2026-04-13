import { useState, useEffect } from 'react'
import type { Section } from '@/data/types'
import { loadTechSections } from '@/data/tech-loader'

const cache = new Map<string, Section[]>()

export function useTechSections(techId: string | undefined): {
  sections: Section[] | null
  loading: boolean
} {
  const cached = techId ? cache.get(techId) ?? null : null
  const [sections, setSections] = useState<Section[] | null>(cached)
  const [loading, setLoading] = useState(!cached && !!techId)

  // Reset when techId changes (render-time, React docs pattern)
  const [prevTechId, setPrevTechId] = useState(techId)
  if (prevTechId !== techId) {
    setPrevTechId(techId)
    const next = techId ? cache.get(techId) ?? null : null
    setSections(next)
    setLoading(!next && !!techId)
  }

  useEffect(() => {
    if (!techId || cache.has(techId)) return

    let cancelled = false
    loadTechSections(techId).then(result => {
      if (cancelled) return
      cache.set(techId, result)
      setSections(result)
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [techId])

  return { sections, loading }
}
