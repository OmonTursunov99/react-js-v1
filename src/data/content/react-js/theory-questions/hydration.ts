import type { Topic } from '../../../types'

export const hydration: Topic = {
    id: 'hydration',
    title: 'Hydration',
    importance: 2,
    status: 'to-learn',
    description: 'SSR hydration jarayoni, selective hydration, hydration mismatch',
    content: `Hydration — server-da yaratilgan HTML-ni brauzerda INTERAKTIV qilish jarayoni. SSR-ning ikkinchi qadami.

═══════════════════════════════════════
  HYDRATION JARAYONI
═══════════════════════════════════════

  1. Server: React komponentni HTML string-ga aylantiradi
  2. Server: HTML brauzerga yuboriladi
  3. Brauzer: HTML-ni DARHOL ko'rsatadi (paint)
  4. Brauzer: JS bundle yuklanadi
  5. React: hydrateRoot() — mavjud HTML-ni "jonlantiradi"
     - Event listener-lar ulash
     - State boshqaruvi ulash
     - Interactive qilish

  Server HTML = ko'rinish (foto kabi)
  Hydration = interaktivlik (click, type ishlaydi)

═══════════════════════════════════════
  HYDRATION MISMATCH
═══════════════════════════════════════

Server HTML va client render FARQ qilsa — OGOHLANTIRISH:

  // ❌ Server va client farqli natija
  function Clock() {
    return <p>{new Date().toLocaleTimeString()}</p>
    // Server: 12:00:00 (server vaqti)
    // Client: 12:00:05 (client vaqti)
    // MISMATCH!
  }

  // ✅ Yechim — client-only rendering
  function Clock() {
    const [time, setTime] = useState<string>()

    useEffect(() => {
      setTime(new Date().toLocaleTimeString())
    }, [])

    if (!time) return null  // SSR da bo'sh
    return <p>{time}</p>
  }

═══════════════════════════════════════
  SELECTIVE HYDRATION (React 18)
═══════════════════════════════════════

React 18 da Suspense bilan:
  - Sahifa qismlari ALOHIDA hydrate bo'ladi
  - Foydalanuvchi bosgan qism AVVAL hydrate qilinadi
  - Qolgan qismlar background-da

  <Suspense fallback={<Loading />}>
    <HeavyComponent />  {/* alohida hydrate */}
  </Suspense>`,
    codeExamples: [
      {
        title: 'Hydration — asosiy',
        language: 'tsx',
        code: `// Server-da (Next.js yoki custom SSR):
import { renderToString } from 'react-dom/server'
// const html = renderToString(<App />)
// → "<div class='app'><h1>Salom</h1><button>Click</button></div>"
// Bu HTML brauzerga yuboriladi

// Client-da:
import { hydrateRoot } from 'react-dom/client'
// hydrateRoot(document.getElementById('root')!, <App />)
// Mavjud HTML-ga event listener-lar ulash
// DOM QAYTA YARATILMAYDI — faqat "jonlantiriladi"

// ❌ Hydration mismatch misollari
function BadComponent() {
  // Server va client FARQLI natija beradi
  return <p>{Math.random()}</p>           // ❌ har safar farqli
  return <p>{Date.now()}</p>              // ❌ vaqt farqi
  return <p>{window.innerWidth}</p>       // ❌ server-da window yo'q
  return <p>{typeof window}</p>           // ❌ server: undefined, client: object
}

// ✅ Client-only rendering pattern
function SafeComponent() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)  // faqat client-da
  }, [])

  if (!mounted) return null  // SSR da render qilMAYDI

  return <p>Window: {window.innerWidth}px</p>
}

// ✅ suppressHydrationWarning (bilgan holda)
function TimeDisplay() {
  return (
    <time suppressHydrationWarning>
      {new Date().toLocaleTimeString()}
    </time>
  )
}`,
        description: 'Hydration: server HTML + client JS = interaktiv ilova. Mismatch: server va client farqli render. Yechim: useEffect da client-only logika, yoki suppressHydrationWarning.',
      },
    ],
    interviewQA: [
      {
        question: 'Hydration nima?',
        answer: `Hydration — server-da yaratilgan statik HTML-ni brauzerda interaktiv qilish. SSR jarayoni: 1) Server React-ni HTML-ga aylantiradi, 2) HTML brauzerga yuboriladi (foydalanuvchi darhol ko'radi), 3) JS yuklanadi, 4) hydrateRoot() — mavjud HTML-ga event listener-lar va state ulaydi. DOM qayta yaratilMAYDI — faqat jonlantiriladi. Natija: tez FCP (HTML darhol) + interaktivlik (JS keyin).`,
      },
      {
        question: 'Hydration mismatch nima va qanday oldini olinadi?',
        answer: `Mismatch — server HTML va client render natijasi FARQ qilsa. Sabablar: Date.now(), Math.random(), window ob'ekti (server-da yo'q), browser-specific API. React ogohlantirish beradi, DOM qayta yaratishi mumkin (performance yomonlashadi). Oldini olish: 1) useEffect da client-only logika, 2) mounted state pattern, 3) suppressHydrationWarning (bilgan holda), 4) Server va client bir xil data ishlatishi.`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'theory-questions', topicId: 'ssr-csr-ssg', label: 'SSR vs CSR vs SSG' },
      { techId: 'react-js', sectionId: 'theory-questions', topicId: 'server-components', label: 'Server Components' },
      { techId: 'react-js', sectionId: 'react-core', topicId: 'use-id', label: 'useId (SSR-safe)' },
    ],
  }
