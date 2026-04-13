import type { Topic } from '../../types'

export const useSyncExternalStore: Topic = {
    id: 'use-sync-external-store',
    title: 'useSyncExternalStore',
    importance: 2,
    status: 'to-learn' as const,
    description: 'Tashqi store-larga ulanish hooki — Redux, Zustand va browser API uchun',
    content: `useSyncExternalStore — React 18+ da qo'shilgan hook bo'lib, React TASHQARIDAGI (external) ma'lumot manbalariga ulanish uchun ishlatiladi.

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

const snapshot = useSyncExternalStore(
  subscribe,    // store o'zgarganda chaqiriladigan callback-ni ro'yxatga olish
  getSnapshot,  // hozirgi qiymatni qaytarish (client)
  getServerSnapshot? // SSR uchun (ixtiyoriy)
)

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

React o'z state-ini (useState, useReducer) boshqaradi.
Lekin ba'zi ma'lumotlar React TASHQARISIDA:
- Redux store
- Zustand store
- Browser API: navigator.onLine, matchMedia, localStorage
- WebSocket, EventSource

Bu hook ularni React bilan xavfsiz sinxronlaydi.

MUHIM: Redux (useSelector) va Zustand (useStore) ICHIDA shu hook ishlatadi!
Siz bevosita kamdan-kam ishlatasiz — lekin qanday ishlashini bilish muhim.

═══════════════════════════════════════
  BROWSER API BILAN ISHLATISH
═══════════════════════════════════════

navigator.onLine, window.matchMedia, document.visibilityState —
bularning barchasi React tashqarisidagi ma'lumot manbalari.
useSyncExternalStore ular bilan xavfsiz ishlash imkonini beradi.`,
    codeExamples: [
        {
            title: 'Online/Offline status hook',
            language: 'tsx' as const,
            code: `import { useSyncExternalStore } from 'react'

// Tashqi store: navigator.onLine
function subscribe(callback: () => void) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

function getSnapshot() {
  return navigator.onLine
}

// SSR uchun (serverda navigator yo'q)
function getServerSnapshot() {
  return true // Server-da har doim "online" deb faraz qilamiz
}

// Custom hook
function useOnlineStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

// Ishlatish
function StatusBar() {
  const isOnline = useOnlineStatus()

  return (
    <div style={{
      padding: '10px',
      background: isOnline ? '#4caf50' : '#f44336',
      color: 'white',
    }}>
      {isOnline ? '🟢 Internetga ulangan' : '🔴 Internet yo'q'}
    </div>
  )
}`,
            description: `navigator.onLine — React tashqarisidagi ma'lumot. useSyncExternalStore orqali online/offline holatini kuzatish va React bilan sinxronlash.`,
        },
    ],
    interviewQA: [
        {
            question: 'useSyncExternalStore nima uchun kerak?',
            answer: `React tashqarisidagi (external) ma'lumot manbalariga ulanish uchun kerak. React o'z state-ini useState/useReducer bilan boshqaradi, lekin ba'zi ma'lumotlar React tashqarisida: Redux/Zustand store, browser API (navigator.onLine, matchMedia), WebSocket. Bu hook ularni React bilan xavfsiz sinxronlaydi va concurrent rendering bilan to'g'ri ishlashini ta'minlaydi.`,
        },
        {
            question: `Redux va Zustand bu hook bilan qanday bog'liq?`,
            answer: `Redux (useSelector) va Zustand (useStore) ICHIDA useSyncExternalStore ishlatadi. Ular tashqi store bo'lgani uchun React-ga o'zgarishlarni xabar qilish uchun shu hook kerak. Siz bevosita kamdan-kam ishlatasiz — ko'pincha kutubxonalar ichida ishlaydi. Lekin browser API (navigator.onLine, matchMedia, localStorage) bilan ishlashda to'g'ridan-to'g'ri ishlatish mumkin.`,
        },
    ],
    relatedTopics: [
        { sectionId: 'state-management', topicId: 'zustand', label: 'Zustand (ichki ishlatadi)' },
        { sectionId: 'state-management', topicId: 'redux-toolkit', label: 'Redux (ichki ishlatadi)' },
    ],
}
