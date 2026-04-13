import type { Topic } from '../../../types'

export const concurrentMode: Topic = {
    id: 'concurrent-mode',
    title: 'Concurrent Features',
    importance: 3,
    status: 'to-learn',
    description: 'Concurrent rendering, time slicing, prioritet tizimi',
    content: `Concurrent Features — React 18 ning asosiy yangiligi. Rendering jarayonini TO'XTATISH, DAVOM ETTIRISH, va BEKOR QILISH imkonini beradi.

═══════════════════════════════════════
  MUAMMO: SINXRON RENDERING
═══════════════════════════════════════

Eski React — sinxron:
  setState → render → diff → DOM update
  Butun jarayon TO'XTATILMAYDI.

10,000 elementni filterlash:
  Input typing → setState → 10,000 element re-render → 200ms bloklash
  Foydalanuvchi 200ms davomida yoza OLMAYDI!

═══════════════════════════════════════
  CONCURRENT RENDERING
═══════════════════════════════════════

React 18+ — concurrent:
  Rendering TO'XTATILISHI mumkin.
  Muhimroq ish kerak bo'lsa — hozirgi render BEKOR QILINADI.

  Input typing → YUQORI prioritet (darhol)
  Filterlash → PAST prioritet (keyinroq)

Foydalanuvchi typing davomida UI responsive qoladi.

═══════════════════════════════════════
  useTransition
═══════════════════════════════════════

State yangilanishini PAST PRIORITET qilish:

  const [isPending, startTransition] = useTransition()

  function handleChange(e) {
    setQuery(e.target.value)           // YUQORI — input responsive

    startTransition(() => {
      setFilteredItems(filter(items))  // PAST — keyinroq
    })
  }

  isPending — past prioritet yangilanish davom etayapti
  (loading indicator ko'rsatish mumkin)

═══════════════════════════════════════
  useDeferredValue
═══════════════════════════════════════

Qiymatning PAST PRIORITET versiyasini olish:

  const deferredQuery = useDeferredValue(query)
  // query — darhol yangilanadi (input responsive)
  // deferredQuery — keyinroq yangilanadi (qimmat hisoblash uchun)

  const filtered = useMemo(
    () => items.filter(i => i.name.includes(deferredQuery)),
    [items, deferredQuery]
  )

═══════════════════════════════════════
  TIME SLICING
═══════════════════════════════════════

React rendering-ni kichik bo'laklarga bo'ladi:
  [5ms ish] → [brauzerga nazorat] → [5ms ish] → [brauzerga nazorat]

Har 5ms dan keyin brauzer:
  - Input event-larni qayta ishlaydi
  - Animatsiya frame-larni chizadi
  - Layout/paint

Natija: 60fps saqlanadi, UI bloklanMAYDI.

═══════════════════════════════════════
  SUSPENSE + CONCURRENT
═══════════════════════════════════════

Suspense concurrent mode-da kuchliroq:
  - Streaming SSR — HTML bosqichma-bosqich yuboriladi
  - Selective hydration — foydalanuvchi bosgan qism avval
  - Data fetching — use() hook bilan`,
    codeExamples: [
      {
        title: 'Concurrent features — amaliy',
        language: 'tsx',
        code: `import { useState, useTransition, useDeferredValue, useMemo, Suspense } from 'react'

// useTransition — og'ir yangilanishni past prioritet qilish
function SearchPage() {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const [results, setResults] = useState<Product[]>([])

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setQuery(value)  // YUQORI prioritet — input DARHOL yangilanadi

    startTransition(() => {
      // PAST prioritet — 10,000 mahsulot filterlash
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(value.toLowerCase())
      )
      setResults(filtered)
    })
  }

  return (
    <div>
      <input value={query} onChange={handleSearch} placeholder="Qidirish..." />

      {isPending && <p className="text-gray-400">Qidirilmoqda...</p>}

      <ul>
        {results.map(p => <li key={p.id}>{p.name} — {p.price} so'm</li>)}
      </ul>
    </div>
  )
}

// useDeferredValue — qiymatni kechiktirish
function FilteredList({ items, query }: { items: Item[]; query: string }) {
  const deferredQuery = useDeferredValue(query)
  const isStale = query !== deferredQuery

  const filtered = useMemo(
    () => items.filter(i => i.name.includes(deferredQuery)),
    [items, deferredQuery]
  )

  return (
    <div style={{ opacity: isStale ? 0.6 : 1, transition: 'opacity 0.2s' }}>
      <p>{filtered.length} ta topildi</p>
      {filtered.map(i => <div key={i.id}>{i.name}</div>)}
    </div>
  )
}

// useTransition vs useDeferredValue:
// useTransition — setState-ni past prioritet qilish
// useDeferredValue — QIYMATNI past prioritet qilish
// Natija bir xil — UI responsive, og'ir ish keyinroq`,
        description: 'useTransition: startTransition ichidagi setState past prioritet. useDeferredValue: qiymatning kechiktirilgan versiyasi. Ikkalasi ham — input responsive, og\'ir hisoblash keyinroq.',
      },
    ],
    interviewQA: [
      {
        question: 'Concurrent rendering nima?',
        answer: `Concurrent rendering — React 18+ da rendering jarayonini TO'XTATISH va DAVOM ETTIRISH imkonini beradi. Eski React sinxron — butun render bir yo'la. Concurrent — rendering kichik bo'laklarga bo'linadi (time slicing), har bo'lakdan keyin brauzerga nazorat qaytarilishi MUMKIN. Yuqori prioritet (user input) past prioritetni (data filtering) TO'XTATISHI mumkin. Natija: 60fps, responsive UI, foydalanuvchi kutMAYDI. Fiber arxitekturasiga asoslangan.`,
      },
      {
        question: 'useTransition va useDeferredValue farqi nima?',
        answer: `useTransition — setState-ni past prioritet qilish. startTransition(() => setState(value)). isPending — davom etayaptimi. Ishlatish: biz setState-ni boshqaramiz. useDeferredValue — QIYMATNING past prioritet versiyasini olish. const deferred = useDeferredValue(value). Ishlatish: qiymat tashqaridan keladi (props), biz setState-ni boshqarMAYMIZ. Natija bir xil — og'ir yangilanish past prioritet, UI responsive.`,
      },
      {
        question: 'Concurrent mode va Suspense qanday birga ishlaydi?',
        answer: `Suspense concurrent mode-da kuchliroq: 1) Streaming SSR — server HTML-ni bosqichma-bosqich yuboradi, Suspense boundary-lar alohida, 2) Selective hydration — foydalanuvchi bosgan Suspense boundary AVVAL hydrate qilinadi, 3) startTransition + Suspense — past prioritet navigatsiya, eski sahifa ko'rsatiladi yangi tayyor bo'lguncha (loading flash yo'q). Suspense — React-ning "kutish" mexanizmi, concurrent — prioritet boshqaruvi.`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'react-core', topicId: 'use-transition', label: 'useTransition' },
      { techId: 'react-js', sectionId: 'react-core', topicId: 'use-deferred-value', label: 'useDeferredValue' },
      { techId: 'react-js', sectionId: 'theory-questions', topicId: 'fiber-architecture', label: 'Fiber Architecture' },
      { techId: 'react-js', sectionId: 'theory-questions', topicId: 'react-18-19', label: 'React 18/19' },
    ],
  }
