import { create } from 'zustand'

interface SidebarState {
  expandedSections: string[]
  toggleSection: (sectionId: string) => void
}

export const useSidebarStore = create<SidebarState>()((set) => ({
  expandedSections: [],

  toggleSection: (sectionId) => {
    set(state => {
      const exists = state.expandedSections.includes(sectionId)
      return {
        expandedSections: exists
          ? state.expandedSections.filter(id => id !== sectionId)
          : [...state.expandedSections, sectionId],
      }
    })
  },
}))
