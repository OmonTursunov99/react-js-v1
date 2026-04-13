import type { Topic } from '../../types'

export const useHook: Topic = {
    id: 'use-hook',
    title: 'use() hook',
    importance: 2,
    status: 'to-learn' as const,
    description: `React 19 yangi hook — Promise va Context o'qish, if ichida ishlatish mumkin`,
    content: `use() — React 19 da qo'shilgan yangi hook. U Promise va Context o'qish uchun ishlatiladi.

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

// Promise o'qish
const data = use(fetchPromise)

// Context o'qish (useContext o'rniga)
const theme = use(ThemeContext)

═══════════════════════════════════════
  BOSHQA HOOKLARDAN FARQI
═══════════════════════════════════════

Boshqa hooklar (useState, useEffect):
- if/else ichida ishlatib BO'LMAYDI
- Loop ichida ishlatib BO'LMAYDI
- Faqat komponent YUQORISIDA

use() hook:
- if ichida ishlatish MUMKIN ✅
- Loop ichida ishlatish MUMKIN ✅
- Bu unga maxsus moslashuvchanlik beradi

═══════════════════════════════════════
  PROMISE BILAN — SUSPENSE
═══════════════════════════════════════

use(promise) chaqirilganda:
1. Promise hali tugamagan bo'lsa — komponent SUSPEND bo'ladi
2. Suspense fallback ko'rsatadi (loading)
3. Promise tugaganda — ma'lumot ko'rsatiladi

MUHIM: Promise TASHQARIDA yaratilishi kerak (render ichida emas!)
Aks holda har renderda yangi promise = cheksiz loop.

═══════════════════════════════════════
  CONTEXT BILAN
═══════════════════════════════════════

use(SomeContext) = useContext(SomeContext) bilan bir xil.
Farqi: use() if ichida ishlatish mumkin — shartli context o'qish.`,
    codeExamples: [
        {
            title: `Promise o'qish — Suspense bilan data fetch`,
            language: 'tsx' as const,
            code: `import { use, Suspense } from 'react'

// API funksiyasi — promise TASHQARIDA yaratiladi
function fetchUser(id: number): Promise<{ name: string; email: string }> {
  return fetch(\`https://jsonplaceholder.typicode.com/users/\${id}\`)
    .then(res => res.json())
}

// Promise-ni TASHQARIDA yaratamiz (render ichida EMAS!)
const userPromise = fetchUser(1)

function UserCard() {
  // use() promise tugaguncha suspend qiladi
  // Suspense fallback ko'rsatadi
  const user = use(userPromise)

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  )
}

// Shartli context o'qish — boshqa hooklarda MUMKIN EMAS
function ConditionalRead({ showTheme }: { showTheme: boolean }) {
  if (showTheme) {
    const theme = use(ThemeContext) // if ichida — faqat use() bilan mumkin!
    return <p>Tema: {theme}</p>
  }
  return <p>Tema yashirin</p>
}

function App() {
  return (
    <Suspense fallback={<p>Yuklanmoqda...</p>}>
      <UserCard />
    </Suspense>
  )
}`,
            description: 'use() Promise kutish uchun ishlatiladi — Suspense bilan birga loading holatini boshqaradi. Boshqa hooklardan farqli ravishda if ichida ham ishlatish mumkin.',
        },
    ],
    interviewQA: [
        {
            question: 'use() hook nima va boshqa hooklardan nima farqi?',
            answer: `use() — React 19 dagi yangi hook. U Promise va Context o'qish uchun ishlatiladi. Boshqa hooklardan asosiy farqi: if/else va loop ichida ishlatish MUMKIN. Boshqa hooklar (useState, useEffect) faqat komponent yuqorisida, shartlarsiz chaqirilishi shart. use() bu cheklovdan ozod.`,
        },
        {
            question: 'use() bilan Promise qanday ishlaydi?',
            answer: `use(promise) chaqirilganda, agar promise hali tugamagan bo'lsa — komponent "suspend" bo'ladi va Suspense fallback ko'rsatiladi (masalan, loading spinner). Promise tugaganda — natija qaytariladi va komponent renderlanadi. MUHIM: Promise komponent tashqarisida yaratilishi kerak — render ichida yaratilsa har renderda yangi promise bo'ladi va cheksiz loop hosil bo'ladi.`,
        },
    ],
    relatedTopics: [
        { sectionId: 'react-core', topicId: 'use-context', label: 'useContext (eski usul)' },
        { sectionId: 'theory-questions', topicId: 'react-18-19', label: 'React 19 yangiliklari' },
        { sectionId: 'component-patterns', topicId: 'suspense-lazy', label: 'Suspense bilan ishlaydi' },
    ],
}
