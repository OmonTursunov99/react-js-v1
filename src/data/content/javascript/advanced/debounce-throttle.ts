import type { Topic } from '../../../types'

export const debounceThrottle: Topic = {
  id: 'debounce-throttle',
  title: 'Debounce va Throttle',
  importance: 3,
  status: 'to-learn',
  description: 'Rate limiting, performance optimization, search input, scroll',
  content: `
Debounce va Throttle — bu funksiya chaqiruvlarini cheklash (rate limiting) texnikalari.
Brauzerda ba'zi hodisalar juda tez-tez trigger bo'ladi va har birida og'ir funksiya
chaqirish performance-ni yomonlashtiradi.

═══════════════════════════════════════
  MUAMMO: HADDAN TASHQARI TEZ CHAQIRUVLAR
═══════════════════════════════════════

Brauzerda quyidagi hodisalar soniyasiga o'nlab-yuzlab marta ishga tushadi:

  scroll      — sahifa aylantirilganda (soniyasiga ~30-100 marta)
  resize      — oyna o'lchami o'zgarganda
  mousemove   — sichqoncha harakatlanganda
  input/keyup — har bir tugma bosilganda

Agar har bir hodisada DOM manipulation, API so'rov yoki og'ir hisoblash
bajarsangiz — sahifa sekinlashadi, UI muzlab qoladi.

  // Yomon: har bir harf uchun API so'rov
  input.addEventListener('input', () => {
    fetch('/api/search?q=' + input.value)  // 300ms da 10 ta so'rov!
  })

Yechim: Debounce yoki Throttle bilan chaqiruvlarni cheklash.

═══════════════════════════════════════
  DEBOUNCE NIMA
═══════════════════════════════════════

Debounce — funksiyani faqat hodisalar TO'XTAGANDAN keyin belgilangan vaqt
o'tgach chaqiradi. Agar yangi hodisa kelsa — timer qayta boshlanadi.

Analogi: LIFT ESHIGI
  Lift eshigi yopilyapti, lekin yangi odam kirsa — timer qayta boshlanadi.
  Faqat hech kim kirmasa va N soniya o'tsa — eshik yopiladi.

  hodisalar:    ─x─x─x─x─────────x─x──────────
  debounce(300ms):              ─────fn()    ──────fn()

Debounce ikki xil bo'ladi:

  Trailing (default) — hodisalar to'xtagandan KEYIN chaqiradi
    Misol: foydalanuvchi yozishni to'xtatgach search qilish

  Leading — BIRINCHI hodisada darhol chaqiradi, keyin kutadi
    Misol: tugma bosilganda darhol javob berish, lekin ikki marta bosilishni oldini olish

Use case-lar:
  • Search input — foydalanuvchi yozishni to'xtatgach API so'rov
  • Form validation — har bir harf emas, yozish tugagach tekshirish
  • Window resize — o'lchami o'zgargandan keyin layout hisoblash
  • Auto-save — foydalanuvchi tahrirlashni to'xtatgach saqlash

═══════════════════════════════════════
  THROTTLE NIMA
═══════════════════════════════════════

Throttle — funksiyani belgilangan vaqt oralig'ida FAQAT 1 MARTA chaqiradi.
Qancha hodisa bo'lishidan qat'i nazar — har N ms da bir marta ishlaydi.

Analogi: SUV KRANI
  Kran to'liq ochiq bo'lsa ham, maxsus cheklagich har 1 soniyada
  faqat 1 tomchi o'tkazadi. Qolganini bloklaydi.

  hodisalar:    ─x─x─x─x─x─x─x─x─x─x─x─x─
  throttle(300ms): ─fn()───fn()───fn()───fn()─

Throttle ham ikki xil:

  Leading (default) — birinchi hodisada DARHOL chaqiradi
    Keyingi N ms ichida kelgan hodisalarni e'tiborsiz qoldiradi

  Trailing — N ms oxirida chaqiradi
    Interval tugagach oxirgi hodisa bilan chaqiradi

Use case-lar:
  • Scroll handler — scroll pozitsiyasini kuzatish (parallax, infinite scroll)
  • Button click — tez-tez bosilishni oldini olish
  • API rate limit — serverga ko'p so'rov yubormaslik
  • mousemove — drag & drop, tooltip pozitsiyasi
  • Telemetry/analytics — hodisalarni guruhlash

═══════════════════════════════════════
  DEBOUNCE vs THROTTLE TAQQOSLASH
═══════════════════════════════════════

  ┌────────────┬──────────────────────┬──────────────────────┐
  │            │ DEBOUNCE             │ THROTTLE             │
  ├────────────┼──────────────────────┼──────────────────────┤
  │ Prinsip    │ To'xtagandan keyin   │ Har N ms da 1 marta  │
  │ Timer      │ Har safar qayta      │ Qayta boshlanMAYDI   │
  │ Kafolat    │ Oxirgi chaqiruv      │ Muntazam chaqiruv    │
  │ Kechikish  │ Ha (kutadi)          │ Kam (darhol boshlaydi)│
  │ Input      │ ✓ Search, form       │ ✗ Natija kechikadi   │
  │ Scroll     │ ✗ Faqat oxirida      │ ✓ Muntazam yangilanish│
  │ Resize     │ ✓ Oxirgi o'lcham     │ ✓ Ham bo'ladi        │
  │ Click      │ ✗ Kechikish seziladi │ ✓ Darhol javob       │
  └────────────┴──────────────────────┴──────────────────────┘

Qoida: Natija kerak bo'lsa — debounce, jarayon kerak bo'lsa — throttle.

═══════════════════════════════════════
  CANCEL FUNKSIYASI
═══════════════════════════════════════

Debounce/throttle funksiyaga cancel() metodi qo'shiladi:

  const debouncedSearch = debounce(search, 300)

  // Komponent unmount bo'lganda yoki foydalanuvchi bekor qilganda:
  debouncedSearch.cancel()

Bu muhim chunki:
  • Komponent unmount bo'lgandan keyin state yangilanmasligi kerak
  • Memory leak oldini olish
  • React useEffect cleanup-da ishlatiladi

═══════════════════════════════════════
  requestAnimationFrame THROTTLE
═══════════════════════════════════════

requestAnimationFrame (rAF) — brauzerning keyingi repaint-dan oldin
funksiyani bir marta chaqiradi (~16ms, 60fps).

Bu scroll/resize uchun throttle muqobili:
  • Brauzer bilan sinxronlashadi (jank yo'q)
  • ~16ms interval (60fps) — silliq animatsiya
  • Foydalanuvchi o'zi interval belgilamaydi — brauzer boshqaradi

  let ticking = false
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollPosition()
        ticking = false
      })
      ticking = true
    }
  })

═══════════════════════════════════════
  LODASH vs O'ZINGIZ YOZISH
═══════════════════════════════════════

Lodash debounce/throttle:
  • Ishonchli, ko'p sinovdan o'tgan
  • maxWait, leading, trailing opsiyalari
  • cancel(), flush() metodlari
  • Tree-shakeable: import debounce from 'lodash/debounce'

O'zingiz yozish:
  • Bundle hajmini kamaytirish (lodash.debounce ~1.5KB)
  • Tushunishni mustahkamlash
  • Oddiy holatlarda yetarli

Intervyuda o'zingiz yozishni bilish muhim — closure, timer,
this context tushunganingizni ko'rsatadi.
  `.trim(),
  codeExamples: [
    {
      title: 'Debounce implementatsiya (trailing + leading + cancel)',
      language: 'js',
      code: `// ═══ DEBOUNCE: TO'LIQ IMPLEMENTATSIYA ═══

function debounce(fn, delay, options = {}) {
  const { leading = false, trailing = true } = options
  let timerId = null
  let lastArgs = null

  function debounced(...args) {
    lastArgs = args

    // Leading: birinchi chaqiruvda darhol bajar
    if (leading && timerId === null) {
      fn.apply(this, args)
    }

    // Har safar timer qayta boshlanadi
    clearTimeout(timerId)

    timerId = setTimeout(() => {
      // Trailing: oxirgi argumentlar bilan chaqir
      if (trailing && lastArgs) {
        fn.apply(this, lastArgs)
      }
      timerId = null
      lastArgs = null
    }, delay)
  }

  // Cancel: kutayotgan chaqiruvni bekor qilish
  debounced.cancel = function () {
    clearTimeout(timerId)
    timerId = null
    lastArgs = null
  }

  // Flush: kutmasdan darhol bajarish
  debounced.flush = function () {
    if (timerId !== null) {
      clearTimeout(timerId)
      if (lastArgs) fn.apply(this, lastArgs)
      timerId = null
      lastArgs = null
    }
  }

  return debounced
}

// ═══ ISHLATISH ═══

// 1. Trailing (default) — yozish to'xtagach ishlaydi
const searchAPI = debounce((query) => {
  console.log('API so\\'rov:', query)
}, 300)

searchAPI('r')       // timer boshlandi
searchAPI('re')      // timer qayta boshlandi
searchAPI('rea')     // timer qayta boshlandi
searchAPI('reac')    // timer qayta boshlandi
searchAPI('react')   // timer qayta boshlandi
// ... 300ms kutish ...
// Natija: faqat 1 marta "API so'rov: react"

// 2. Leading — darhol bajarib, keyin kutadi
const submitForm = debounce((data) => {
  console.log('Submit:', data)
}, 1000, { leading: true, trailing: false })

submitForm({ name: 'Ali' })  // DARHOL: "Submit: {name: Ali}"
submitForm({ name: 'Ali' })  // e'tiborsiz (1000ms o'tmagan)

// 3. Cancel
const autoSave = debounce(saveData, 5000)
autoSave(formData)    // 5s dan keyin saqlaydi
autoSave.cancel()     // Bekor qilindi — saqlanmaydi`,
      description:
        'Debounce - trailing, leading va cancel/flush bilan to\'liq implementatsiya',
    },
    {
      title: 'Throttle implementatsiya (leading + trailing + cancel)',
      language: 'js',
      code: `// ═══ THROTTLE: TO'LIQ IMPLEMENTATSIYA ═══

function throttle(fn, interval, options = {}) {
  const { leading = true, trailing = true } = options
  let timerId = null
  let lastArgs = null
  let lastCallTime = 0

  function throttled(...args) {
    const now = Date.now()
    const elapsed = now - lastCallTime

    // Leading: birinchi chaqiruvda darhol bajar
    if (elapsed >= interval && leading) {
      lastCallTime = now
      fn.apply(this, args)
    } else {
      // Oxirgi argumentlarni saqlab qo'y
      lastArgs = args
    }

    // Trailing: interval oxirida oxirgi chaqiruvni bajar
    if (timerId === null && trailing) {
      timerId = setTimeout(() => {
        if (lastArgs) {
          lastCallTime = Date.now()
          fn.apply(this, lastArgs)
          lastArgs = null
        }
        timerId = null
      }, interval - elapsed)
    }
  }

  // Cancel
  throttled.cancel = function () {
    clearTimeout(timerId)
    timerId = null
    lastArgs = null
    lastCallTime = 0
  }

  return throttled
}

// ═══ ISHLATISH ═══

// 1. Scroll handler — har 200ms da 1 marta
const onScroll = throttle(() => {
  const scrollY = window.scrollY
  const progress = scrollY / (document.body.scrollHeight - window.innerHeight)
  console.log('Scroll progress:', Math.round(progress * 100) + '%')
}, 200)

window.addEventListener('scroll', onScroll)

// 2. Button click — ikki marta bosilishni oldini olish
const onSubmit = throttle((formData) => {
  fetch('/api/submit', {
    method: 'POST',
    body: JSON.stringify(formData),
  })
}, 2000, { trailing: false }) // faqat leading

document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault()
  onSubmit(new FormData(e.target))
})

// 3. Resize — har 500ms da layout qayta hisoblash
const onResize = throttle(() => {
  recalculateLayout()
}, 500)

window.addEventListener('resize', onResize)

// Cleanup
window.removeEventListener('scroll', onScroll)
onScroll.cancel()`,
      description:
        'Throttle - leading, trailing va cancel bilan to\'liq implementatsiya',
    },
    {
      title: 'Real-world: Search input + Scroll handler',
      language: 'js',
      code: `// ═══ REAL-WORLD MISOL 1: SEARCH INPUT + DEBOUNCE ═══

class SearchComponent {
  constructor(inputEl, resultsEl) {
    this.input = inputEl
    this.results = resultsEl
    this.abortController = null

    // 400ms debounce — yozish to'xtagach izlaydi
    this.debouncedSearch = debounce(
      (query) => this.search(query),
      400
    )

    this.input.addEventListener('input', (e) => {
      const query = e.target.value.trim()

      if (query.length < 2) {
        this.results.innerHTML = ''
        this.debouncedSearch.cancel() // Kutayotgan so'rovni bekor qil
        return
      }

      this.results.innerHTML = '<p>Izlanmoqda...</p>'
      this.debouncedSearch(query)
    })
  }

  async search(query) {
    // Oldingi so'rovni bekor qil
    if (this.abortController) this.abortController.abort()
    this.abortController = new AbortController()

    try {
      const res = await fetch(
        \`/api/search?q=\${encodeURIComponent(query)}\`,
        { signal: this.abortController.signal }
      )
      const data = await res.json()
      this.renderResults(data)
    } catch (err) {
      if (err.name !== 'AbortError') {
        this.results.innerHTML = '<p>Xatolik yuz berdi</p>'
      }
    }
  }

  renderResults(data) {
    this.results.innerHTML = data.items
      .map(item => \`<div class="result">\${item.title}</div>\`)
      .join('')
  }

  // Cleanup (SPA da sahifa almashganda)
  destroy() {
    this.debouncedSearch.cancel()
    if (this.abortController) this.abortController.abort()
  }
}


// ═══ REAL-WORLD MISOL 2: INFINITE SCROLL + THROTTLE ═══

class InfiniteScroll {
  constructor(container, loadMore) {
    this.container = container
    this.loadMore = loadMore
    this.isLoading = false
    this.hasMore = true

    // 200ms throttle — scroll pozitsiyasini tekshirish
    this.throttledCheck = throttle(
      () => this.checkPosition(),
      200
    )

    window.addEventListener('scroll', this.throttledCheck)
  }

  checkPosition() {
    if (this.isLoading || !this.hasMore) return

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    const distanceToBottom = scrollHeight - scrollTop - clientHeight

    // Pastdan 300px qolganda yangi ma'lumot yuklash
    if (distanceToBottom < 300) {
      this.load()
    }
  }

  async load() {
    this.isLoading = true
    try {
      const { items, hasMore } = await this.loadMore()
      this.hasMore = hasMore
      this.renderItems(items)
    } finally {
      this.isLoading = false
    }
  }

  renderItems(items) {
    items.forEach(item => {
      const el = document.createElement('div')
      el.textContent = item.title
      this.container.appendChild(el)
    })
  }

  destroy() {
    window.removeEventListener('scroll', this.throttledCheck)
    this.throttledCheck.cancel()
  }
}`,
      description:
        'Search input debounce (AbortController bilan) va Infinite scroll throttle',
    },
    {
      title: 'requestAnimationFrame throttle va React da ishlatish',
      language: 'tsx',
      code: `// ═══ rAF THROTTLE ═══

function rafThrottle(fn) {
  let rafId = null

  function throttled(...args) {
    if (rafId !== null) return // Allaqachon rejalantirilgan

    rafId = requestAnimationFrame(() => {
      fn.apply(this, args)
      rafId = null
    })
  }

  throttled.cancel = function () {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  return throttled
}

// Scroll bilan ishlatish — ~60fps, jank yo'q
const onScroll = rafThrottle(() => {
  const scrollY = window.scrollY
  header.style.transform = \`translateY(\${Math.min(scrollY, 60)}px)\`
})
window.addEventListener('scroll', onScroll)


// ═══ REACT DA DEBOUNCE/THROTTLE ═══

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'

// 1. useDebounce hook — qiymatni debounce qilish
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer) // Cleanup
  }, [value, delay])

  return debouncedValue
}

// Ishlatish:
function SearchPage() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 400)

  // debouncedQuery o'zgarganda API so'rov
  useEffect(() => {
    if (debouncedQuery) {
      fetchResults(debouncedQuery)
    }
  }, [debouncedQuery])

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />
}


// 2. useDebouncedCallback — funksiyani debounce qilish
function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T & { cancel: () => void } {
  const callbackRef = useRef(callback)
  callbackRef.current = callback // Har doim oxirgi callback

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debouncedFn = useMemo(() => {
    const fn = (...args: any[]) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    }
    fn.cancel = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
    return fn as T & { cancel: () => void }
  }, [delay])

  // Unmount da tozalash
  useEffect(() => {
    return () => debouncedFn.cancel()
  }, [debouncedFn])

  return debouncedFn
}

// Ishlatish:
function AutoSaveForm() {
  const save = useDebouncedCallback((data: string) => {
    fetch('/api/save', { method: 'POST', body: data })
  }, 2000)

  return <textarea onChange={(e) => save(e.target.value)} />
}


// 3. useThrottle hook — scroll pozitsiyasi
function useThrottledScroll(callback: () => void, interval: number) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    let rafId: number | null = null
    let lastTime = 0

    const handleScroll = () => {
      const now = Date.now()
      if (now - lastTime >= interval) {
        lastTime = now
        callbackRef.current()
      } else if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          lastTime = Date.now()
          callbackRef.current()
          rafId = null
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [interval])
}

// Ishlatish:
function ProgressBar() {
  const [progress, setProgress] = useState(0)

  useThrottledScroll(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    setProgress(scrollTop / (scrollHeight - clientHeight))
  }, 100)

  return <div style={{ width: \`\${progress * 100}%\` }} className="h-1 bg-blue-500" />
}`,
      description:
        'requestAnimationFrame throttle va React hooks: useDebounce, useDebouncedCallback, useThrottledScroll',
    },
  ],
  interviewQA: [
    {
      question:
        'Debounce va Throttle farqi nima? Misol bilan tushuntiring.',
      answer:
        'Debounce — funksiyani hodisalar TO\'XTAGANDAN keyin belgilangan vaqt o\'tgach chaqiradi. Har yangi hodisada timer qayta boshlanadi. Misol: lift eshigi — odam kirganda timer qaytadan boshlanadi, faqat hech kim kirmagach N soniyada yopiladi. Use case: search input — foydalanuvchi yozishni to\'xtatgach 1 marta API so\'rov.\n\nThrottle — funksiyani belgilangan vaqt oralig\'ida FAQAT 1 MARTA chaqiradi, qancha hodisa bo\'lishidan qat\'i nazar. Misol: suv krani cheklagichi — har 1 soniyada faqat 1 tomchi. Use case: scroll handler — har 200ms da pozitsiyani tekshirish.\n\nFarqi: Debounce "kutadi" (oxirgi natija kerak), Throttle "cheklaydi" (muntazam yangilanish kerak). Agar foydalanuvchi 5 soniya davomida input-ga yozsa: debounce(300ms) faqat oxirida 1 marta chaqiradi, throttle(300ms) har 300ms da — taxminan 16 marta chaqiradi.',
    },
    {
      question:
        'Debounce funksiyasini noldan yozing (closure bilan).',
      answer:
        'Debounce closure orqali ishlaydi — tashqi funksiya ichida timerId va lastArgs saqlanadi:\n\nfunction debounce(fn, delay) {\n  let timerId = null   // closure: timer ID saqlanadi\n\n  return function (...args) {\n    clearTimeout(timerId)   // Oldingi timer bekor\n    timerId = setTimeout(() => {\n      fn.apply(this, args)  // delay dan keyin chaqir\n    }, delay)\n  }\n}\n\nQanday ishlaydi: (1) Har chaqiruvda oldingi setTimeout bekor qilinadi (clearTimeout). (2) Yangi setTimeout o\'rnatiladi. (3) Faqat oxirgi chaqiruvdan delay vaqt o\'tsa — fn bajariladi. (4) closure tufayli timerId funksiyalar orasida saqlanib qoladi. this kontekst uchun apply ishlatiladi — arrow function emas, oddiy function.',
    },
    {
      question:
        'Throttle funksiyasini noldan yozing.',
      answer:
        'Throttle ham closure orqali — lastCallTime saqlanadi:\n\nfunction throttle(fn, interval) {\n  let lastCallTime = 0\n\n  return function (...args) {\n    const now = Date.now()\n    if (now - lastCallTime >= interval) {\n      lastCallTime = now\n      fn.apply(this, args)\n    }\n  }\n}\n\nQanday ishlaydi: (1) Har chaqiruvda hozirgi vaqtni oldingi chaqiruv vaqti bilan solishtiradi. (2) Agar interval o\'tgan bo\'lsa — fn bajariladi va lastCallTime yangilanadi. (3) Agar interval o\'tmagan bo\'lsa — chaqiruv e\'tiborsiz qoldiriladi. (4) Bu "leading" throttle — birinchi chaqiruvda darhol ishlaydi. Trailing qo\'shish uchun setTimeout ham kerak bo\'ladi.',
    },
    {
      question:
        'React da debounce/throttle qanday ishlatiladi? Qanday xatolar bo\'lishi mumkin?',
      answer:
        'React da 3 ta asosiy usul:\n\n1. useDebounce hook — qiymatni debounce qilish:\nconst debouncedQuery = useDebounce(query, 400)\nuseEffect(() => { search(debouncedQuery) }, [debouncedQuery])\n\n2. useDebouncedCallback — funksiyani debounce qilish:\nuseRef bilan callback va timer saqlanadi, useEffect cleanup-da cancel.\n\n3. Kutubxona: lodash.debounce, use-debounce, ahooks.\n\nXATOLAR:\n• Har renderda yangi debounce yaratish — useMemo/useRef KERAK, aks holda har renderda timer yo\'qoladi.\n• Cleanup qilmaslik — useEffect return-da cancel() chaqirmaslik memory leak va "state update on unmounted component" xatosiga olib keladi.\n• Stale closure — callback ichida eski state ko\'rinadi. Yechim: useRef bilan eng oxirgi callback-ni saqlash (callbackRef.current = callback).\n• Controlled input-da debounce — input qiymatini debounce qilish MUMKIN EMAS (UI orqada qoladi). Faqat API so\'rov yoki side effect-ni debounce qiling.',
    },
  ],
  relatedTopics: [
    {
      techId: 'javascript',
      sectionId: 'functions-closures',
      topicId: 'closures',
      label: 'Closures',
    },
    {
      techId: 'javascript',
      sectionId: 'functions-closures',
      topicId: 'higher-order-functions',
      label: 'Higher-Order Functions',
    },
    {
      techId: 'javascript',
      sectionId: 'dom-browser',
      topicId: 'events',
      label: 'Events',
    },
  ],
}
