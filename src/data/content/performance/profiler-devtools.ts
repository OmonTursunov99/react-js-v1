import type { Topic } from '../../types'

export const profilerDevtools: Topic = {
    id: 'profiler-devtools',
    title: 'React Profiler / DevTools',
    importance: 3,
    status: 'to-learn',
    description: 'Performance bottleneck topish',
    content: `React DevTools va Profiler — performance muammolarni topish va tushunish uchun asosiy vositalar. "Avval o'lchang, keyin optimizatsiya" prinsipi.

═══════════════════════════════════════
  REACT DEVTOOLS
═══════════════════════════════════════

React DevTools — browser extension (Chrome, Firefox).
2 ta asosiy tab:

1. Components tab:
   - Komponent daraxtini ko'rish
   - Props, state, hooks-ni real-time ko'rish
   - Komponentni tanlash va o'zgartirish
   - "Highlight updates" — re-render ko'rsatish

2. Profiler tab:
   - Rendering performansini o'lchash
   - Har bir render-ning vaqtini ko'rish
   - Nima uchun re-render bo'lganini ko'rsatish

═══════════════════════════════════════
  HIGHLIGHT UPDATES
═══════════════════════════════════════

Components → Settings → "Highlight updates when components render"

Re-render bo'lgan komponentlar atrofida rangdor chegara paydo bo'ladi:
  Yashil — tez re-render (yaxshi)
  Sariq — o'rtacha (diqqat)
  Qizil — sekin re-render (muammo!)

Bu vizual tarzda qaysi komponentlar ortiqcha re-render
bo'layotganini ko'rsatadi.

═══════════════════════════════════════
  PROFILER — PERFORMANCE O'LCHASH
═══════════════════════════════════════

1. Profiler tab-ni oching
2. "Record" tugmasini bosing
3. Ilovani ishlatang (click, type, scroll)
4. "Stop" bosing
5. Natijalarni tahlil qiling

Profiler ko'rsatadi:
  - Flamegraph — komponentlar daraxtida har birining render vaqti
  - Ranked — eng sekin komponentlar yuqorida
  - Har komponent nima uchun re-render bo'lgani (props, state, parent)

═══════════════════════════════════════
  REACT PROFILER KOMPONENTI
═══════════════════════════════════════

Kod ichida performance o'lchash:

  import { Profiler } from 'react'

  function onRender(
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
  ) {
    console.log(id, phase, actualDuration + 'ms')
  }

  <Profiler id="UserList" onRender={onRender}>
    <UserList />
  </Profiler>

actualDuration — haqiqiy render vaqti (memoization bilan)
baseDuration — memo-siz bo'lganda qancha vaqt ketishi

═══════════════════════════════════════
  BROWSER PERFORMANCE TOOLS
═══════════════════════════════════════

Chrome DevTools Performance tab:
  - JavaScript execution time
  - Layout/Paint/Composite vaqti
  - Long tasks (50ms+)
  - Memory usage

Lighthouse:
  - Performance score
  - Core Web Vitals
  - Optimization tavsiyalari

React Profiler — React-specific (komponent darajasi)
Chrome Performance — umumiy (JS, DOM, network)

═══════════════════════════════════════
  WHY DID YOU RENDER
═══════════════════════════════════════

@welldone-software/why-did-you-render — kutubxona.
Keraksiz re-render-larni konsolda ko'rsatadi:

  Component re-rendered — props are equal
  Props that caused re-render: onClick (new reference)

Development-da foyda — qaysi props ortiqcha re-render keltirayotganini ko'rsatadi.`,
    codeExamples: [
      {
        title: 'React Profiler komponenti',
        language: 'tsx',
        code: `import { Profiler, type ProfilerOnRenderCallback } from 'react'

// Render ma'lumotlarini yig'ish
const onRender: ProfilerOnRenderCallback = (
  id,            // Profiler id
  phase,         // 'mount' yoki 'update'
  actualDuration, // haqiqiy render vaqti (ms)
  baseDuration,   // memo-siz bo'lganda qancha vaqt ketishi (ms)
  startTime,      // render boshlangan vaqt
  commitTime,     // DOM-ga yozilgan vaqt
) => {
  // Development-da console
  if (actualDuration > 5) {
    console.warn(
      \`[Profiler] \${id} — \${phase} — \${actualDuration.toFixed(1)}ms (sekin!)\`
    )
  }

  // Production-da analytics yuborish
  // analytics.track('render', { id, phase, duration: actualDuration })
}

// Ishlatish — ixtiyoriy komponentni o'rash
function App() {
  return (
    <div>
      <Profiler id="Header" onRender={onRender}>
        <Header />
      </Profiler>

      <Profiler id="ProductList" onRender={onRender}>
        <ProductList />
      </Profiler>

      <Profiler id="Footer" onRender={onRender}>
        <Footer />
      </Profiler>
    </div>
  )
}`,
        description: 'Profiler — kod ichida render vaqtini o\'lchash. actualDuration vs baseDuration — memoization qanchalik yordam berayotganini ko\'rsatadi. Production-da analytics-ga yuborish mumkin.',
      },
      {
        title: 'Performance debugging — qadam-baqadam',
        language: 'tsx',
        code: `import { memo, useMemo, useCallback, useState } from 'react'

// 1. MUAMMONI ANIQLASH — console.log bilan
function SlowComponent({ items }: { items: Item[] }) {
  console.log('SlowComponent render') // qancha chaqirilayotganini ko'rish
  console.time('SlowComponent')

  const sorted = items.sort((a, b) => a.name.localeCompare(b.name))

  console.timeEnd('SlowComponent') // render vaqti

  return <ul>{sorted.map(i => <li key={i.id}>{i.name}</li>)}</ul>
}

// 2. PROFILER BILAN O'LCHASH
// React DevTools → Profiler → Record → Interact → Stop
// Flamegraph-da SlowComponent qizil bo'lsa — muammo BOR

// 3. SABAB ANIQLASH
// DevTools → Profiler → "Why did this render?"
// Props changed? State changed? Parent re-render?

// 4. OPTIMIZATSIYA QILISH
const OptimizedComponent = memo(function OptimizedComponent({
  items,
  onSelect,
}: {
  items: Item[]
  onSelect: (id: string) => void
}) {
  // Qimmat sort — faqat items o'zgarganda
  const sorted = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  )

  return (
    <ul>
      {sorted.map(i => (
        <li key={i.id} onClick={() => onSelect(i.id)}>
          {i.name}
        </li>
      ))}
    </ul>
  )
})

// 5. PARENT-DA CALLBACK MEMOIZATSIYA
function Parent() {
  const [items] = useState<Item[]>(generateItems(10000))
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = useCallback((id: string) => {
    setSelected(id)
  }, [])

  return (
    <div>
      <p>Tanlangan: {selected}</p>
      <OptimizedComponent items={items} onSelect={handleSelect} />
    </div>
  )
}`,
        description: 'Performance debugging 5 qadam: 1) console.log bilan re-render aniqlash, 2) Profiler bilan o\'lchash, 3) sabab topish, 4) memo/useMemo/useCallback qo\'llash, 5) qayta o\'lchash.',
      },
    ],
    interviewQA: [
      {
        question: 'React DevTools Profiler qanday ishlatiladi?',
        answer: `Profiler tab → Record → ilovani ishlatish → Stop. Flamegraph ko'rsatadi: har komponentning render vaqti (rang bilan — yashil=tez, qizil=sekin). Ranked view — eng sekin komponentlar yuqorida. Har komponentda "Why did this render?" — props, state, yoki parent re-render ekanini ko'rsatadi. actualDuration — haqiqiy vaqt (memo bilan), baseDuration — memo-siz vaqt. Components tab-da "Highlight updates" — real-time re-render-larni vizual ko'rsatadi.`,
      },
      {
        question: 'Performance muammoni qanday topasiz va hal qilasiz?',
        answer: `1) Muammoni sezish — UI sekin, typing lag, scroll tiqilib qolishi. 2) O'lchash — React Profiler bilan qaysi komponent sekin ekanini aniqlash. 3) Sabab topish — "Why did this render?" — props, state, parent? 4) Optimizatsiya — sababga qarab: ortiqcha re-render → React.memo, qimmat hisoblash → useMemo, callback referens → useCallback, katta ro'yxat → virtualization. 5) Qayta o'lchash — optimizatsiya yordam berdimi? Qoida: AVVAL o'lchash, KEYIN optimizatsiya.`,
      },
      {
        question: 'actualDuration va baseDuration farqi nima?',
        answer: `actualDuration — komponent va bolalarining HAQIQIY render vaqti. Memoization hisobga olinadi (memo bilan o'tkazib yuborilgan bolalar hisoblanMAYDI). baseDuration — memoization-SIZ bo'lganda qancha vaqt ketishi. Agar actualDuration << baseDuration — memoization yaxshi ishlayapti. Agar actualDuration ≈ baseDuration — memoization yordam berMAYAPTI (barcha bolalar re-render bo'layapti).`,
      },
      {
        question: 'React Profiler va Chrome Performance tab farqi nima?',
        answer: `React Profiler — React-specific: komponent darajasida render vaqti, re-render sabablari, flamegraph. Faqat React komponentlarni ko'rsatadi. Chrome Performance — umumiy browser: JavaScript execution, layout/paint, memory, network, long tasks. Barcha JS kodni ko'rsatadi. Ikkalasi birga ishlatiladi: React Profiler — qaysi komponent muammo, Chrome Performance — umumiy sahifa performansi (FPS, long tasks).`,
      },
    ],
    relatedTopics: [
      { sectionId: 'performance', topicId: 're-render-causes', label: 'Re-render sabablari' },
      { sectionId: 'performance', topicId: 'web-vitals', label: 'Core Web Vitals' },
    ],
  }
