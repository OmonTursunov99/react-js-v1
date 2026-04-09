import { create } from 'zustand'

interface SidebarState {
  expandedSections: string[]
  mobileOpen: boolean
  toggleSection: (sectionId: string) => void
  setMobileOpen: (open: boolean) => void
}

export const useSidebarStore = create<SidebarState>()((set) => ({
  expandedSections: [],
  mobileOpen: false,

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

  setMobileOpen: (open) => set({ mobileOpen: open }),
}))
