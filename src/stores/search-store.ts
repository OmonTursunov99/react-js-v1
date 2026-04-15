import { create } from 'zustand'
import type { SearchIndexEntry } from '@/data/search-helpers'

interface SearchState {
  isOpen: boolean
  query: string
  index: SearchIndexEntry[] | null
  loading: boolean
  selectedIndex: number
  deepSearch: boolean
  open: () => void
  close: () => void
  setQuery: (q: string) => void
  setIndex: (entries: SearchIndexEntry[]) => void
  setLoading: (loading: boolean) => void
  setSelectedIndex: (i: number) => void
  toggleDeepSearch: () => void
  reset: () => void
}

export const useSearchStore = create<SearchState>()((set) => ({
  isOpen: false,
  query: '',
  index: null,
  loading: false,
  selectedIndex: 0,
  deepSearch: false,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false, query: '', selectedIndex: 0 }),
  setQuery: (query) => set({ query, selectedIndex: 0 }),
  setIndex: (index) => set({ index }),
  setLoading: (loading) => set({ loading }),
  setSelectedIndex: (selectedIndex) => set({ selectedIndex }),
  toggleDeepSearch: () => set(s => ({ deepSearch: !s.deepSearch, selectedIndex: 0 })),
  reset: () => set({ isOpen: false, query: '', selectedIndex: 0 }),
}))
