import { directions } from './directions'
import { getAvailableTechIds, loadTechSections } from './tech-loader'

export interface SearchIndexEntry {
  techId: string
  techTitle: string
  techIcon: string
  sectionId: string
  sectionTitle: string
  topicId: string
  topicTitle: string
  topicDescription: string
  topicContent: string
  path: string
}

interface TechRoute {
  directionId: string
  categoryId: string
}

/** directions massividan techId → {directionId, categoryId} mapping */
function buildTechRouteMap(): Map<string, TechRoute> {
  const map = new Map<string, TechRoute>()
  for (const dir of directions) {
    for (const cat of dir.categories) {
      for (const tech of cat.technologies) {
        map.set(tech.id, { directionId: dir.id, categoryId: cat.id })
      }
    }
  }
  return map
}

const routeMap = buildTechRouteMap()

/** Barcha texnologiyalardan topic indeksini yuklash */
export async function loadSearchIndex(): Promise<SearchIndexEntry[]> {
  const techIds = getAvailableTechIds()

  // Har bir tech uchun metadata (title, icon) topish
  const techMeta = new Map<string, { title: string; icon: string }>()
  for (const dir of directions) {
    for (const cat of dir.categories) {
      for (const tech of cat.technologies) {
        techMeta.set(tech.id, { title: tech.title, icon: tech.icon })
      }
    }
  }

  // Parallel yuklash
  const results = await Promise.all(
    techIds.map(async (techId) => {
      const sections = await loadTechSections(techId)
      const route = routeMap.get(techId)
      const meta = techMeta.get(techId)
      if (!route || !meta) return []

      const entries: SearchIndexEntry[] = []
      for (const section of sections) {
        for (const topic of section.topics) {
          entries.push({
            techId,
            techTitle: meta.title,
            techIcon: meta.icon,
            sectionId: section.id,
            sectionTitle: section.title,
            topicId: topic.id,
            topicTitle: topic.title,
            topicDescription: topic.description,
            topicContent: topic.content,
            path: `/${route.directionId}/${route.categoryId}/${techId}/${section.id}/${topic.id}`,
          })
        }
      }
      return entries
    }),
  )

  return results.flat()
}
