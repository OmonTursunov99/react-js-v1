import { create } from 'zustand'

interface FooterNavState {
  tabIds: string[]
  activeTabId: string
  goToTab: ((id: string) => void) | null
  prevTopicPath: string | null
  nextTopicPath: string | null
  setNav: (nav: Omit<FooterNavState, 'setNav' | 'clearNav'>) => void
  clearNav: () => void
}

const initial = {
  tabIds: [] as string[],
  activeTabId: '',
  goToTab: null as ((id: string) => void) | null,
  prevTopicPath: null as string | null,
  nextTopicPath: null as string | null,
}

export const useFooterNavStore = create<FooterNavState>((set) => ({
  ...initial,
  setNav: (nav) => set(nav),
  clearNav: () => set(initial),
}))
