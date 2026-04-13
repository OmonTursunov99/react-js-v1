import type { Topic } from '../../types'

export const rulesOfHooks: Topic = {
    id: 'rules-of-hooks',
    title: 'Hooks qoidalari (Rules of Hooks)',
    importance: 3,
    status: 'to-learn',
    description: 'Nima uchun shart ichida hook ishlatib bo\'lmaydi',
    content: `Rules of Hooks — 2 ta qat'iy qoida. Buzilsa React noto'g'ri ishlaydi yoki xato beradi.

═══════════════════════════════════════
  QOIDA 1: FAQAT TOP LEVEL-DA
═══════════════════════════════════════

Hook-lar FAQAT komponent yoki custom hook-ning ENG YUQORI darajasida chaqirilishi kerak.

  ❌ if ichida:
  if (condition) {
    const [state, setState] = useState(0)  // TAQIQLANGAN!
  }

  ❌ loop ichida:
  for (let i = 0; i < n; i++) {
    useEffect(() => {})  // TAQIQLANGAN!
  }

  ❌ nested function ichida:
  function handleClick() {
    const ref = useRef(null)  // TAQIQLANGAN!
  }

  ✅ TO'G'RI — faqat top level:
  function Component() {
    const [state, setState] = useState(0)     // ✅
    const ref = useRef(null)                  // ✅
    useEffect(() => {}, [])                   // ✅

    if (condition) {
      // hook-siz logika OK
    }
  }

NIMA UCHUN? React hook-larni TARTIB (index) bo'yicha saqlaydi.
Agar if ichida hook bo'lsa — tartib o'zgarishi mumkin:

  // Birinchi render:
  useState(0)    → hook[0]
  useEffect(fn)  → hook[1]
  useState('')   → hook[2]

  // Agar if tushib qolsa:
  // useState(0)    → hook[0]  ✅
  // [useEffect TUSHIB QOLDI]
  // useState('')   → hook[1]  ❌ Bu useEffect bo'lishi kerak edi!

═══════════════════════════════════════
  QOIDA 2: FAQAT REACT FUNKSIYALARDA
═══════════════════════════════════════

Hook-lar faqat:
  ✅ React komponent funksiyasi ichida
  ✅ Custom hook ichida (use* bilan boshlanadigan)

  ❌ Oddiy JavaScript funksiya ichida
  ❌ Class component ichida
  ❌ Event handler ichida (top level emas)

═══════════════════════════════════════
  ICHKI MEXANIZM
═══════════════════════════════════════

React har komponent uchun Fiber node yaratadi.
Fiber ichida hook-lar LINKED LIST sifatida saqlanadi:

  hook[0] → hook[1] → hook[2] → null

Har render-da React hook-larni TARTIB BO'YICHA o'qiydi:
  1-chi hook chaqiruv → hook[0]
  2-chi hook chaqiruv → hook[1]
  3-chi hook chaqiruv → hook[2]

Agar tartib o'zgarsa (if tufayli) — React NOTO'G'RI hook-ni qaytaradi.

═══════════════════════════════════════
  SHARTLI LOGIKA QANDAY QILINADI?
═══════════════════════════════════════

  // ❌ NOTO'G'RI:
  if (shouldFetch) {
    useEffect(() => { fetch(url) }, [url])
  }

  // ✅ TO'G'RI — hook ichida shart:
  useEffect(() => {
    if (shouldFetch) {
      fetch(url)
    }
  }, [url, shouldFetch])

  // ✅ TO'G'RI — enabled pattern:
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    enabled: shouldFetch,  // false bo'lsa so'rov yuborMAYDI
  })

  // ✅ TO'G'RI — early return HOOKDAN KEYIN:
  const [data, setData] = useState(null)
  useEffect(() => { fetch(url) }, [url])

  if (!data) return <Loading />  // hook-lardan KEYIN`,
    codeExamples: [
      {
        title: 'Rules of Hooks — to\'g\'ri va noto\'g\'ri',
        language: 'tsx',
        code: `import { useState, useEffect } from 'react'

// ❌ NOTO'G'RI — shartli hook
function BadComponent({ showExtra }: { showExtra: boolean }) {
  const [name, setName] = useState('')

  // ❌ showExtra false bo'lsa — hook tartib buziladi!
  if (showExtra) {
    const [extra, setExtra] = useState('')  // TAQIQLANGAN
  }

  useEffect(() => { console.log('effect') }, [])

  return <div>{name}</div>
}

// ✅ TO'G'RI — barcha hook-lar top level
function GoodComponent({ showExtra }: { showExtra: boolean }) {
  const [name, setName] = useState('')
  const [extra, setExtra] = useState('')  // DOIM chaqiriladi
  useEffect(() => { console.log('effect') }, [])

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      {showExtra && (
        <input value={extra} onChange={e => setExtra(e.target.value)} />
      )}
    </div>
  )
}

// ✅ TO'G'RI — shartli logika hook ICHIDA
function SearchComponent({ enabled }: { enabled: boolean }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!enabled) return        // ✅ hook ichida shart
    if (!query) return

    const timer = setTimeout(() => {
      fetchResults(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, enabled])

  return <input value={query} onChange={e => setQuery(e.target.value)} />
}

// ✅ TO'G'RI — early return hookdan KEYIN
function UserProfile({ userId }: { userId: string | null }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    fetchUser(userId).then(setUser).finally(() => setLoading(false))
  }, [userId])

  // Early return — barcha hook-lar YUQORIDA
  if (!userId) return <p>User tanlanmagan</p>
  if (loading) return <p>Yuklanmoqda...</p>

  return <h1>{user?.name}</h1>
}`,
        description: 'Hook-lar DOIM top level-da, DOIM bir xil tartibda. Shartli logika: hook ICHIDA if, yoki early return hook-lardan KEYIN. if ichida hook = XATO.',
      },
    ],
    interviewQA: [
      {
        question: 'Rules of Hooks nima?',
        answer: `2 ta qoida: 1) Hook-lar FAQAT top level-da — if, for, nested function ichida EMAS. 2) Hook-lar faqat React komponent yoki custom hook ichida. Sabab: React hook-larni TARTIB (index) bo'yicha linked list-da saqlaydi. Har render-da bir xil tartibda chaqirilishi kerak — aks holda React noto'g'ri hook qaytaradi. eslint-plugin-react-hooks bu qoidalarni tekshiradi.`,
      },
      {
        question: 'Nima uchun hook-ni if ichida ishlatib bo\'lmaydi?',
        answer: `React hook-larni TARTIB bo'yicha saqlaydi (linked list): 1-chi chaqiruv → hook[0], 2-chi → hook[1]. Agar if ichida hook bo'lsa va shart false bo'lsa — hook tushib qoladi, tartib siljiydi. React hook[1]-da useEffect kutadi, lekin aslida useState keladi — NOTO'G'RI natija. Yechim: hook DOIM top level-da, shartli logika hook ICHIDA: useEffect(() => { if (condition) {...} }, [condition]).`,
      },
    ],
    relatedTopics: [
      { sectionId: 'component-patterns', topicId: 'custom-hooks', label: 'Custom Hooks' },
      { sectionId: 'theory-questions', topicId: 'closures-in-hooks', label: 'Closures in Hooks' },
      { sectionId: 'theory-questions', topicId: 'fiber-architecture', label: 'Fiber (linked list)' },
    ],
  }
