import type { Section } from './types'

// Vite glob import — barcha content/<tech>/index.ts fayllarni topadi.
// Har bir texnologiya alohida chunk sifatida lazy-load qilinadi.
const techModules = import.meta.glob<{ sections: Section[] }>(
  './content/*/index.ts',
)

/** Mavjud texnologiya ID lar ro'yxati */
export function getAvailableTechIds(): string[] {
  return Object.keys(techModules).map(path => {
    const match = path.match(/\.\/content\/([^/]+)\/index\.ts$/)
    return match ? match[1] : ''
  }).filter(Boolean)
}

/** Texnologiya kontentini yuklash (lazy, cached) */
export async function loadTechSections(techId: string): Promise<Section[]> {
  const key = `./content/${techId}/index.ts`
  const loader = techModules[key]
  if (!loader) return []
  const module = await loader()
  return module.sections
}
