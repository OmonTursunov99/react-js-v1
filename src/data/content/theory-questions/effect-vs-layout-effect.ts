import type { Topic } from '../../types'

export const effectVsLayoutEffect: Topic = {
    id: 'effect-vs-layout-effect',
    title: 'useEffect vs useLayoutEffect',
    importance: 2,
    status: 'to-learn',
    description: 'Qachon nima, paint oldin/keyin',
    content: `useEffect va useLayoutEffect — ikkalasi ham side effect uchun. Farqi — QACHON ishlaydi.

═══════════════════════════════════════
  TARTIB
═══════════════════════════════════════

  Render → DOM commit → useLayoutEffect → PAINT → useEffect

useLayoutEffect — DOM yangilangandan KEYIN, brauzer PAINT qilishdan OLDIN.
  SINXRON ishlaydi — brauzer KUTADI.

useEffect — brauzer PAINT qilgandan KEYIN.
  ASINXRON ishlaydi — brauzer kutMAYDI.

═══════════════════════════════════════
  QACHON useLayoutEffect
═══════════════════════════════════════

useLayoutEffect kerak:
  ✅ DOM O'LCHASH kerak (element hajmi, pozitsiya)
  ✅ DOM o'zgartirish kerak (scroll pozitsiya)
  ✅ Flickering oldini olish (ko'rish → o'zgarish)
  ✅ Tooltip/popover pozitsiya hisoblash

useEffect yetarli (KO'P HOLLARDA):
  ✅ API so'rov
  ✅ Subscription (WebSocket, event listener)
  ✅ Timer (setTimeout, setInterval)
  ✅ Analytics, logging
  ✅ State yangilash (async natija bilan)

Qoida: AVVAL useEffect sinab ko'ring.
Faqat flickering bo'lsa — useLayoutEffect.`,
    codeExamples: [
      {
        title: 'useLayoutEffect — flickering oldini olish',
        language: 'tsx',
        code: `import { useState, useEffect, useLayoutEffect, useRef } from 'react'

// ❌ useEffect — flickering (qisqa vaqt noto'g'ri pozitsiya ko'rinadi)
function BadTooltip({ text }: { text: string }) {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Paint KEYIN hisoblaydi — avval noto'g'ri joyda ko'rinadi
    const rect = ref.current?.getBoundingClientRect()
    if (rect) {
      setPosition({ top: rect.bottom, left: rect.left })
    }
  }, [])

  return <div ref={ref} style={{ top: position.top, left: position.left }}>{text}</div>
}

// ✅ useLayoutEffect — flickering YO'Q
function GoodTooltip({ text }: { text: string }) {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    // Paint OLDIN hisoblaydi — foydalanuvchi faqat to'g'ri pozitsiyani ko'radi
    const rect = ref.current?.getBoundingClientRect()
    if (rect) {
      setPosition({ top: rect.bottom, left: rect.left })
    }
  }, [])

  return <div ref={ref} style={{ top: position.top, left: position.left }}>{text}</div>
}

// useEffect — ko'p hollarda TO'G'RI
function DataFetcher({ url }: { url: string }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    // API so'rov — paint KEYIN, flickering ahamiyatsiz
    fetch(url).then(r => r.json()).then(setData)
  }, [url])

  return <div>{JSON.stringify(data)}</div>
}`,
        description: 'useLayoutEffect — DOM o\'lchash va pozitsiya hisoblash (flickering oldini olish). useEffect — API, subscription, timer (ko\'p hollarda). Qoida: avval useEffect, flickering bo\'lsa useLayoutEffect.',
      },
    ],
    interviewQA: [
      {
        question: 'useEffect va useLayoutEffect farqi nima?',
        answer: `Tartib: render → DOM commit → useLayoutEffect → PAINT → useEffect. useLayoutEffect — sinxron, paint OLDIN, brauzer KUTADI. DOM o'lchash, pozitsiya hisoblash, flickering oldini olish uchun. useEffect — asinxron, paint KEYIN. API, subscription, timer uchun. 99% hollarda useEffect yetarli. useLayoutEffect — faqat foydalanuvchi "qisqa vaqt noto'g'ri ko'rinish" ko'rsa kerak.`,
      },
      {
        question: 'useLayoutEffect nima uchun ehtiyot bo\'lish kerak?',
        answer: `useLayoutEffect SINXRON — brauzer paint qilishni KUTADI. Agar qimmat hisoblash bo'lsa — UI blokirovka (freeze). Shuning uchun: 1) Faqat DOM o'lchash uchun (tez operatsiya), 2) Og'ir logika qo'yMANG, 3) SSR-da ishlaMAYDI (server-da DOM yo'q) — ogohlantirish beradi. Qoida: avval useEffect ishlatish, flickering muammo bo'lsa useLayoutEffect.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'react-core', topicId: 'use-effect', label: 'useEffect' },
      { sectionId: 'react-core', topicId: 'use-layout-effect', label: 'useLayoutEffect' },
      { sectionId: 'react-core', topicId: 'rendering-cycle', label: 'Rendering Cycle' },
    ],
  }
