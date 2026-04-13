import type { Topic } from '../../../types'

export const appRouter: Topic = {
  id: 'app-router',
  title: 'App Router',
  importance: 3,
  status: 'to-learn',
  description: 'Next.js App Router — fayl tizimiga asoslangan routing arxitekturasi',
  content: `App Router — Next.js 13+ da joriy qilingan yangi routing tizimi. U src/app/ papkasida fayl konventsiyalariga asoslangan.

═══════════════════════════════════════
  FAYL KONVENTSIYALARI
═══════════════════════════════════════

App Router maxsus fayl nomlari orqali ishlaydi:

  page.tsx      — sahifa komponenti (bu fayl bo'lmasa route mavjud emas)
  layout.tsx    — bir nechta sahifa uchun umumiy qobiq
  loading.tsx   — Suspense fallback (yuklanish holati)
  error.tsx     — ErrorBoundary (xatolik holati)
  not-found.tsx — 404 sahifa
  template.tsx  — layout-ga o'xshash, lekin har navigatsiyada qayta renderlanadi
  default.tsx   — parallel route uchun fallback

═══════════════════════════════════════
  LAYOUT TIZIMI
═══════════════════════════════════════

Layout — sahifalarni o'rab turuvchi komponent.
U navigatsiyada qayta renderlanMAYDI (state saqlanadi).

  app/
  ├── layout.tsx         ← Root layout (html, body)
  ├── page.tsx           ← / sahifa
  └── dashboard/
      ├── layout.tsx     ← Dashboard layout (sidebar)
      └── page.tsx       ← /dashboard sahifa

Root layout MAJBURIY — u html va body teglarini o'z ichiga olishi kerak.
Nested layoutlar bir-birining ichiga joylashadi (matryoshka printsipi).

═══════════════════════════════════════
  SERVER COMPONENTS (STANDART)
═══════════════════════════════════════

App Router-da BARCHA komponentlar standart holda Server Component.
Agar interaktivlik kerak bo'lsa — 'use client' direktivasi qo'shiladi.

  // Server Component (standart)
  export default async function Page() {
    const data = await fetchData()  // to'g'ridan-to'g'ri fetch
    return <div>{data.title}</div>
  }

  // Client Component
  'use client'
  export default function Counter() {
    const [count, setCount] = useState(0)
    return <button onClick={() => setCount(c => c + 1)}>{count}</button>
  }

═══════════════════════════════════════
  LOADING VA ERROR HOLATLARI
═══════════════════════════════════════

loading.tsx avtomatik ravishda Suspense boundary yaratadi.
error.tsx avtomatik ravishda ErrorBoundary yaratadi.

Bu fayllar qo'yilgan papkadagi BARCHA ichki routelarga ta'sir qiladi.
Har bir papkada alohida loading.tsx va error.tsx bo'lishi mumkin.

═══════════════════════════════════════
  METADATA
═══════════════════════════════════════

SEO uchun metadata eksport qilish mumkin:

  export const metadata = {
    title: 'Bosh sahifa',
    description: 'Ketmonjon platformasi',
  }

Yoki dinamik metadata:

  export async function generateMetadata({ params }) {
    const post = await getPost(params.id)
    return { title: post.title }
  }`,
  codeExamples: [
    {
      title: 'Root Layout',
      code: `// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ketmonjon',
  description: "O'quv platformasi",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  )
}`,
      language: 'tsx',
      description: 'Root layout — har bir Next.js ilovada majburiy',
    },
    {
      title: 'Loading va Error fayllar',
      code: `// app/dashboard/loading.tsx
export default function Loading() {
  return <div className="animate-pulse">Yuklanmoqda...</div>
}

// app/dashboard/error.tsx
'use client'
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Xatolik yuz berdi!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Qayta urinish</button>
    </div>
  )
}`,
      language: 'tsx',
      description: 'loading.tsx va error.tsx avtomatik Suspense/ErrorBoundary yaratadi',
    },
    {
      title: 'Papka tuzilmasi misol',
      code: `// Fayl tuzilmasi:
// app/
// ├── layout.tsx          (Root layout)
// ├── page.tsx            (/ sahifa)
// ├── loading.tsx         (Global loading)
// ├── not-found.tsx       (404 sahifa)
// ├── blog/
// │   ├── layout.tsx      (Blog layout)
// │   ├── page.tsx        (/blog sahifa)
// │   └── [slug]/
// │       ├── page.tsx    (/blog/post-1 sahifa)
// │       └── loading.tsx (Post yuklanishi)
// └── dashboard/
//     ├── layout.tsx      (Dashboard layout — sidebar)
//     ├── page.tsx        (/dashboard)
//     └── settings/
//         └── page.tsx    (/dashboard/settings)`,
      language: 'tsx',
      description: 'App Router papka tuzilmasi — har bir papka route segmenti',
    },
  ],
  interviewQA: [
    {
      question: 'App Router va Pages Router orasidagi asosiy farq nima?',
      answer: "App Router React Server Components-ni qo'llab-quvvatlaydi, fayl konventsiyalari boshqacha (page.tsx, layout.tsx), standart holda server component, nested layoutlar mavjud. Pages Router esa getServerSideProps/getStaticProps ishlatadi va barcha komponentlar client component.",
    },
    {
      question: "layout.tsx va template.tsx orasidagi farq nima?",
      answer: "layout.tsx navigatsiyada qayta renderlanmaydi — state saqlanadi, DOM qayta yaratilmaydi. template.tsx esa har navigatsiyada yangi instance yaratadi — state yo'qoladi, useEffect qayta ishlaydi. Template animatsiyalar yoki har sahifada yangi holat kerak bo'lganda ishlatiladi.",
    },
    {
      question: "loading.tsx qanday ishlaydi?",
      answer: "loading.tsx avtomatik ravishda React Suspense boundary yaratadi. Sahifa yuklanayotganda loading.tsx komponenti ko'rsatiladi. Bu streaming SSR bilan ishlaydi — server avval loading holatini yuboradi, keyin tayyor kontentni stream qiladi.",
    },
    {
      question: "Root layout nima uchun majburiy?",
      answer: "Root layout html va body teglarini aniqlaydi. Next.js bu faylsiz ishlamaydi chunki server tomondan to'liq HTML document yuborish kerak. Root layout ilovadagi BARCHA sahifalarni o'rab turadi va faqat bir marta renderlanadi.",
    },
  ],
  relatedTopics: [
    { techId: 'next-js', sectionId: 'nextjs-core', topicId: 'routing', label: 'Dynamic Routes' },
    { techId: 'next-js', sectionId: 'nextjs-core', topicId: 'rendering', label: 'Rendering strategiyalari' },
  ],
}
