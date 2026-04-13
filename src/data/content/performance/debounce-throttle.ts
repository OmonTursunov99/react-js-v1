import type { Topic } from '../../types'

export const debounceThrottle: Topic = {
    id: 'debounce-throttle',
    title: 'Debounce / Throttle',
    importance: 2,
    status: 'to-learn',
    description: 'Input va scroll optimizatsiya',
    content: `Debounce va Throttle — tez-tez chaqiriladigan funksiyalarni cheklash texnikalari. Input typing, scroll, resize kabi eventlar soniyada 30-60 marta trigger bo'ladi — har safar API chaqirish yoki qimmat hisoblash qilish MUMKIN EMAS.

═══════════════════════════════════════
  MUAMMO
═══════════════════════════════════════

Qidiruv inputi — har harf yozilganda API chaqirish:
  "R" → fetch('/search?q=R')
  "Re" → fetch('/search?q=Re')
  "Rea" → fetch('/search?q=Rea')
  "Reac" → fetch('/search?q=Reac')
  "React" → fetch('/search?q=React')
  → 5 ta API so'rov — 4 tasi KERAKSIZ!

Scroll event — soniyada 60 marta:
  scroll → handleScroll() × 60/s
  → har birida DOM hisoblash → LAG

═══════════════════════════════════════
  DEBOUNCE
═══════════════════════════════════════

Debounce — foydalanuvchi TO'XTAGANDAN keyin chaqirish.
Har yangi event eski timer-ni BEKOR qiladi.

  "R" → timer 300ms
  "Re" → ESKi timer bekor → YANGI timer 300ms
  "Rea" → ESKi timer bekor → YANGI timer 300ms
  "React" → ESKi timer bekor → YANGI timer 300ms
  ...300ms O'TDI → fetch('/search?q=React')
  → FAQAT 1 TA so'rov!

Qachon ishlatish:
  ✅ Qidiruv input (typing tugagach qidirish)
  ✅ Form validation (typing to'xtagach tekshirish)
  ✅ Window resize (o'zgarish tugagach hisoblash)

═══════════════════════════════════════
  THROTTLE
═══════════════════════════════════════

Throttle — belgilangan intervalda FAQAT 1 MARTA chaqirish.

  scroll event → 60 marta/s
  throttle 100ms → 10 marta/s
  → 6x kam chaqiruv

Qachon ishlatish:
  ✅ Scroll event (pozitsiya hisoblash)
  ✅ Mouse move (kursor kuzatish)
  ✅ Button spam oldini olish

═══════════════════════════════════════
  DEBOUNCE vs THROTTLE
═══════════════════════════════════════

Debounce: to'xtagandan KEYIN chaqirish (oxirgi event)
  Input: R...e...a...c...t...[300ms]...FETCH!

Throttle: interval ICHIDA 1 marta chaqirish
  Scroll: |--call--|--call--|--call--|
          100ms    100ms    100ms

Debounce — natija kerak (qidiruv, validatsiya)
Throttle — jarayon kerak (scroll, drag)

═══════════════════════════════════════
  REACT ALTERNATIVALAR
═══════════════════════════════════════

React 18+ bilan debounce/throttle o'rniga:

useDeferredValue — qiymatni "past prioritet" qilish:
  const deferredQuery = useDeferredValue(query)
  // UI darhol yangilanadi, lekin filterlash keyinroq bo'ladi

useTransition — yangilanishni "past prioritet" belgilash:
  const [isPending, startTransition] = useTransition()
  startTransition(() => setFilteredItems(filter(items)))
  // Input responsive, filterlash background-da

Bu React-ning concurrent feature-lari — debounce-dan YAXSHIROQ:
  ✅ Debounce — 300ms kutish DOIM (hatto tez kompyuterda ham)
  ✅ useDeferredValue — browser bo'sh bo'lsa darhol, band bo'lsa kutadi
  ✅ UX yaxshiroq — input DOIM responsive`,
    codeExamples: [
      {
        title: 'useDebounce custom hook',
        language: 'tsx',
        code: `import { useState, useEffect } from 'react'

// Custom hook — qiymatni debounce qilish
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)  // cleanup — eski timer bekor
  }, [value, delay])

  return debouncedValue
}

// Ishlatish — qidiruv
function SearchPage() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  // debouncedQuery faqat 300ms to'xtagandan keyin o'zgaradi
  const { data: results } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchApi(debouncedQuery),
    enabled: debouncedQuery.length >= 2,  // 2+ harf bo'lganda
  })

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Qidirish..."
      />
      {/* query — darhol yangilanadi (input responsive) */}
      {/* debouncedQuery — 300ms keyin (API chaqiruv) */}
      {results?.map(r => <p key={r.id}>{r.title}</p>)}
    </div>
  )
}`,
        description: 'useDebounce — qiymatni delay ms dan keyin yangilaydi. Har o\'zgarishda eski timer bekor, yangi timer boshlanadi. TanStack Query bilan birga — debouncedQuery queryKey-da.',
      },
      {
        title: 'useDeferredValue — React alternativa',
        language: 'tsx',
        code: `import { useState, useDeferredValue, useMemo } from 'react'

interface Product {
  id: string
  name: string
  category: string
}

function ProductFilter({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('')

  // useDeferredValue — past prioritet versiya
  const deferredQuery = useDeferredValue(query)

  // Qimmat filterlash — deferred qiymat bilan
  const filteredProducts = useMemo(
    () => products.filter(p =>
      p.name.toLowerCase().includes(deferredQuery.toLowerCase())
    ),
    [products, deferredQuery]
  )

  // UI stale bo'lganda ko'rsatish
  const isStale = query !== deferredQuery

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Filter..."
      />

      <div style={{ opacity: isStale ? 0.6 : 1, transition: 'opacity 0.2s' }}>
        <p>{filteredProducts.length} ta topildi</p>
        {filteredProducts.map(p => (
          <div key={p.id}>{p.name}</div>
        ))}
      </div>
    </div>
  )
}

// Debounce vs useDeferredValue:
// Debounce: DOIM 300ms kutadi (sekin kompyuterda ham, tez kompyuterda ham)
// useDeferredValue: browser bo'sh bo'lsa DARHOL, band bo'lsa keyinroq
// → Tez kompyuterda — instant, sekin kompyuterda — graceful degradation`,
        description: 'useDeferredValue — React 18+ debounce alternativasi. Input darhol responsive, qimmat hisoblash past prioritetda. isStale bilan "yangilanmoqda" ko\'rsatish.',
      },
      {
        title: 'Throttle — scroll event',
        language: 'tsx',
        code: `import { useEffect, useRef, useState, useCallback } from 'react'

// useThrottle hook
function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState(value)
  const lastUpdated = useRef(Date.now())

  useEffect(() => {
    const now = Date.now()

    if (now >= lastUpdated.current + interval) {
      lastUpdated.current = now
      setThrottledValue(value)
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now()
        setThrottledValue(value)
      }, interval - (now - lastUpdated.current))

      return () => clearTimeout(timer)
    }
  }, [value, interval])

  return throttledValue
}

// Scroll pozitsiya kuzatish
function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let ticking = false

    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrollY
}

// Ishlatish
function Header() {
  const scrollY = useScrollPosition()
  const isScrolled = scrollY > 50

  return (
    <header className={\`sticky top-0 transition-all \${
      isScrolled ? 'shadow-lg bg-white/90' : 'bg-transparent'
    }\`}>
      <h1>Sayt</h1>
    </header>
  )
}`,
        description: 'Throttle — scroll event optimizatsiya. requestAnimationFrame — browser paint sikliga moslashtirish (eng samarali). passive: true — scroll performance uchun muhim.',
      },
    ],
    interviewQA: [
      {
        question: 'Debounce va throttle farqi nima?',
        answer: `Debounce — foydalanuvchi TO'XTAGANDAN keyin chaqirish. Har yangi event eski timer-ni bekor qiladi. Faqat OXIRGI event ishlanadi. Misol: qidiruv input — 300ms to'xtagach fetch. Throttle — belgilangan intervalda faqat 1 MARTA chaqirish. Interval ichida qancha event bo'lsa ham faqat bittasi ishlanadi. Misol: scroll — 100ms da 1 marta. Debounce = natija kerak (qidiruv, validatsiya). Throttle = jarayon kerak (scroll, drag, resize).`,
      },
      {
        question: 'React-da debounce qanday qilinadi?',
        answer: `3 ta usul: 1) useDebounce custom hook — qiymatni setTimeout bilan kechiktirish, cleanup bilan eski timer-ni bekor qilish. 2) useDeferredValue (React 18+) — qiymatni past prioritet qilish, browser bo'sh bo'lganda yangilash. Debounce-dan yaxshiroq — fixed delay emas, adaptive. 3) Kutubxona (lodash/debounce, use-debounce). Eng tavsiya etilgan: useDeferredValue (React native), yoki useDebounce hook (oddiy va tushunarli).`,
      },
      {
        question: 'useDeferredValue debounce-dan nima uchun yaxshiroq?',
        answer: `Debounce — DOIM fixed vaqt kutadi (masalan 300ms). Tez kompyuterda ham 300ms, sekin kompyuterda ham 300ms. useDeferredValue — React concurrent rendering-dan foydalanadi. Tez kompyuterda — deyarli darhol. Sekin kompyuterda — browser bo'sh bo'lganda. Input DOIM responsive — faqat qimmat hisoblash kechiktiriladi. Adaptive — hardware-ga moslashadi. Cheklov: faqat React state uchun ishlaydi, API call-lar uchun debounce kerak.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'react-core', topicId: 'use-deferred-value', label: 'useDeferredValue (React alternativa)' },
      { sectionId: 'component-patterns', topicId: 'custom-hooks', label: 'useDebounce custom hook' },
    ],
  }
