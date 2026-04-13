import type { Topic } from '../../../types'

export const serverClientPatterns: Topic = {
  id: 'server-client-patterns',
  title: 'Server/Client Patterns',
  importance: 3,
  status: 'to-learn',
  description: '"use client" va "use server" chegaralari, composition patterns, serialization',
  content: `App Router-da komponentlar standart holda Server Component. Client Component-ga o'tish — ongli qaror. Bu ikki dunyo orasidagi chegarani tushunish senior developer uchun muhim.

═══════════════════════════════════════
  "USE CLIENT" BOUNDARY
═══════════════════════════════════════

"use client" — fayl boshiga qo'yiladigan direktiva.
Bu fayl va uning BARCHA importlari client bundle-ga kiradi.

  Qachon "use client" kerak:
  - useState, useEffect, useRef ishlatilganda
  - onClick, onChange, onSubmit handlerlari
  - Browser API (window, document, localStorage)
  - Third-party kutubxonalar (slider, chart, editor)

  Qachon kerak EMAS:
  - Faqat data ko'rsatish (props -> JSX)
  - async data fetching
  - DB/API so'rovlari
  - Maxfiy kalitlar (API keys) ishlatish

MUHIM: "use client" butun faylni belgilaydi — bir fayl ichida server va client aralashtirib bo'lmaydi. Shu sababli kichik interactive qismlarni alohida fayllarga ajratish kerak.

═══════════════════════════════════════
  "USE SERVER" — SERVER ACTIONS
═══════════════════════════════════════

"use server" — funksiya yoki fayl darajasida server-side kodni belgilaydi.

  Fayl darajasida:
  // app/actions.ts
  'use server'
  export async function createPost(formData: FormData) { ... }

  Funksiya darajasida (Server Component ichida):
  export default function Page() {
    async function handleSubmit(formData: FormData) {
      'use server'
      await db.post.create(...)
    }
    return <form action={handleSubmit}>...</form>
  }

Server Action — RPC (Remote Procedure Call) mexanizmi.
Client form/button dan to'g'ridan-to'g'ri server funksiyani chaqirish.
Network so'rov avtomatik — developer fetch yozmaydi.

═══════════════════════════════════════
  COMPOSITION PATTERN
═══════════════════════════════════════

Server Component Client Component-ni IMPORT qila oladi.
Client Component Server Component-ni IMPORT qila OLMAYDI.

  Lekin Client Component Server Component-ni CHILDREN sifatida qabul qila oladi:

  // ServerWrapper.tsx (Server Component)
  import { ClientTabs } from './ClientTabs'
  import { ServerContent } from './ServerContent'

  export function ServerWrapper() {
    return (
      <ClientTabs>
        <ServerContent />    {/* children sifatida */}
      </ClientTabs>
    )
  }

Bu "donut pattern" deb ataladi — client component "teshik" yaratadi, server component shu teshikdan o'tadi.

═══════════════════════════════════════
  SERIALIZATION CHEGARASI
═══════════════════════════════════════

Server Component dan Client Component ga props faqat SERIALIZABLE bo'lishi kerak:

  Ruxsat berilgan:
  - string, number, boolean, null, undefined
  - Date, Map, Set (React 19+)
  - Plain objects, arrays
  - Server Action funksiyalar ("use server")

  Ruxsat berilMAGAN:
  - Class instancelari
  - Oddiy funksiyalar (callback lar)
  - Symbol
  - DOM nodelar

MUHIM: onClick handler-ni server component dan client component-ga props sifatida uzatib bo'lmaydi. Interaktiv logika client component ICHIDA bo'lishi kerak.

═══════════════════════════════════════
  CLIENT BUNDLE-NI KICHRAYTIRISH
═══════════════════════════════════════

"use client" qo'yilgan har bir fayl va uning importlari bundle-ga kiradi.

Strategiyalar:
1. "use client" ni CHETROQQA surish — iloji boricha faqat leaf komponentlarda
2. Katta kutubxonalarni dynamic import: next/dynamic
3. Server Component da data tayyorlash, Client Component ga faqat tayyor data berish
4. Barrel files (index.ts) dan ehtiyot bo'ling — bitta import butun papkani tortishi mumkin

═══════════════════════════════════════
  CONTEXT PROVIDERS IN APP ROUTER
═══════════════════════════════════════

React Context — client-only xususiyat.
App Router-da provider-larni root layout-ga qo'yish kerak:

  // providers.tsx — 'use client'
  // layout.tsx — server component, providers-ni import qiladi

Provider o'zi client, lekin children (Outlet) server bo'lishi mumkin.
Bu donut pattern-ning amaliy misoli.

MUHIM: Har bir context provider alohida "use client" fayl bo'lishi kerak. Providers.tsx da hammasini birlashtirish — to'g'ri yondashuv.`,
  codeExamples: [
    {
      title: 'Composition pattern — donut',
      code: `// components/ClientTabs.tsx
'use client'

import { useState, type ReactNode } from 'react'

type Tab = { id: string; label: string; content: ReactNode }

export function ClientTabs({ tabs }: { tabs: Tab[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id)

  return (
    <div>
      <div className="flex gap-2 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'border-b-2 font-bold' : ''}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {tabs.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  )
}

// app/dashboard/page.tsx (Server Component)
import { ClientTabs } from '@/components/ClientTabs'
import { Revenue } from '@/components/Revenue'       // Server
import { Analytics } from '@/components/Analytics'   // Server

export default function DashboardPage() {
  // Server komponentlar children sifatida client-ga uzatiladi
  return (
    <ClientTabs
      tabs={[
        { id: 'revenue', label: 'Daromad', content: <Revenue /> },
        { id: 'analytics', label: 'Analitika', content: <Analytics /> },
      ]}
    />
  )
}`,
      language: 'tsx',
      description: 'Client Component server content-ni children sifatida qabul qiladi',
    },
    {
      title: 'Server Actions — form bilan ishlash',
      code: `// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const body = formData.get('body') as string

  // Validatsiya
  if (!title || title.length < 3) {
    return { error: 'Sarlavha kamida 3 belgi bo\\'lishi kerak' }
  }

  // DB yozish
  const post = await db.post.create({
    data: { title, body },
  })

  // Keshni tozalash
  revalidatePath('/blog')

  // Yangi sahifaga yo'naltirish
  redirect(\`/blog/\${post.slug}\`)
}

// components/PostForm.tsx
'use client'

import { useActionState } from 'react'
import { createPost } from '@/app/actions'

export function PostForm() {
  const [state, action, isPending] = useActionState(createPost, null)

  return (
    <form action={action} className="space-y-4">
      <input
        name="title"
        placeholder="Sarlavha"
        className="w-full rounded border p-2"
      />
      <textarea
        name="body"
        placeholder="Matn"
        className="w-full rounded border p-2"
      />
      {state?.error && (
        <p className="text-red-500">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        {isPending ? 'Saqlanmoqda...' : 'Saqlash'}
      </button>
    </form>
  )
}`,
      language: 'tsx',
      description: 'Server Action + useActionState — to\'liq form pattern',
    },
    {
      title: 'Context Providers in App Router',
      code: `// providers/ThemeProvider.tsx
'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'
type ThemeCtx = { theme: Theme; toggle: () => void }

const ThemeContext = createContext<ThemeCtx | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

// providers/index.tsx
'use client'

import { ThemeProvider } from './ThemeProvider'
import { QueryProvider } from './QueryProvider'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </ThemeProvider>
  )
}

// app/layout.tsx (Server Component!)
import { Providers } from '@/providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}`,
      language: 'tsx',
      description: 'Provider-lar client, layout server — donut pattern amalda',
    },
    {
      title: 'Serialization chegarasi va yechimlar',
      code: `// XATO: Funksiyani server -> client props sifatida uzatish
// Server Component
export default function Page() {
  const handleClick = () => console.log('click') // XATO!
  // return <ClientButton onClick={handleClick} />
  // Error: Functions cannot be passed directly to Client Components
  return null
}

// TO'G'RI: Interaktiv logika client ichida
// components/LikeButton.tsx
'use client'

import { likePost } from '@/app/actions' // Server Action — bo'ladi!

export function LikeButton({ postId }: { postId: string }) {
  // Server Action props sifatida emas, import sifatida
  const handleClick = async () => {
    await likePost(postId)
  }

  return (
    <button onClick={handleClick} className="rounded bg-red-500 px-3 py-1">
      Like
    </button>
  )
}

// TO'G'RI: Server da data tayyorlash, client ga faqat data
// app/products/page.tsx (Server Component)
import { ProductFilter } from '@/components/ProductFilter'
import { db } from '@/lib/db'

export default async function ProductsPage() {
  // Server da DB so'rov — client bundle-ga kirmaydi
  const categories = await db.category.findMany({
    select: { id: true, name: true },
  })

  // Faqat serializable data uzatiladi
  return <ProductFilter categories={categories} />
}`,
      language: 'tsx',
      description: 'Server va Client chegarasida nima uzatish mumkin va mumkin emas',
    },
    {
      title: 'Client bundle optimizatsiya',
      code: `// YOMON: Katta komponentni to'liq import
// Bu butun Chart kutubxonasini client bundle ga qo'shadi
// import { HeavyChart } from '@/components/HeavyChart'

// YAXSHI: Dynamic import bilan lazy loading
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <div className="h-64 animate-pulse bg-gray-200" />,
  ssr: false, // Faqat client-da renderlanadi
})

export default async function AnalyticsPage() {
  // Data serverda tayyorlanadi — bundle-ga kirmaydi
  const chartData = await getChartData()

  return (
    <div>
      <h1>Analitika</h1>
      {/* HeavyChart faqat kerak bo'lganda yuklanadi */}
      <HeavyChart data={chartData} />
    </div>
  )
}

// MUHIM: "use client" ni iloji boricha pastga surish
//
// YOMON tuzilma:
// Page.tsx ('use client') — butun sahifa client
//   ├── Header (client)
//   ├── Content (client)     <- aslida server bo'lishi mumkin edi
//   └── Footer (client)
//
// YAXSHI tuzilma:
// Page.tsx (server)
//   ├── Header (server)
//   ├── InteractiveFilter ('use client')  <- faqat kerakli qism
//   ├── Content (server)
//   └── Footer (server)`,
      language: 'tsx',
      description: '"use client" chegarasini to\'g\'ri joylashtirish strategiyasi',
    },
  ],
  interviewQA: [
    {
      question: '"use client" qo\'yilganda nima sodir bo\'ladi?',
      answer: '"use client" — shu fayl va uning barcha importlari client JavaScript bundle-ga kirishini bildiradi. Bu serialization chegarasi — server dan client ga o\'tish nuqtasi. Fayl ichidagi barcha komponentlar client-da renderlanadi va hydration bo\'ladi. Shu sababli "use client" ni iloji boricha pastga — faqat interaktiv leaf komponentlarga qo\'yish kerak.',
    },
    {
      question: 'Client Component ichida Server Component ishlatish mumkinmi?',
      answer: 'To\'g\'ridan-to\'g\'ri import qilib — yo\'q. Lekin children yoki boshqa ReactNode prop orqali — ha. Bu "donut pattern" deb ataladi. Server Component client component-ni children sifatida "teshik" orqali o\'tkazadi. Masalan: ServerPage ichida <ClientTabs><ServerContent /></ClientTabs>. ClientTabs interaktiv, ServerContent server-da renderlanadi.',
    },
    {
      question: 'Server Action nima va oddiy API route dan farqi?',
      answer: 'Server Action — "use server" bilan belgilangan async funksiya. Client component dan to\'g\'ridan-to\'g\'ri chaqiriladi — developer fetch/axios yozmaydi. Next.js avtomatik RPC endpoint yaratadi. API route dan farqi: 1) tip-xavfsiz — TypeScript tipi end-to-end ishlaydi, 2) form action bilan native ishlaydi, 3) revalidatePath/redirect built-in, 4) progressive enhancement — JS o\'chiq bo\'lsa ham form ishlaydi.',
    },
    {
      question: 'Serialization chegarasida qanday cheklovlar bor?',
      answer: 'Server dan Client ga props faqat JSON-serializable bo\'lishi kerak: string, number, boolean, null, Date, Map, Set, plain objects, arrays. Uzatib bo\'lMAYDI: oddiy funksiyalar (callback), class instance, Symbol, DOM node. Istisno: "use server" bilan belgilangan Server Action funksiyalarini uzatish mumkin — Next.js ularni avtomatik RPC reference-ga aylantiradi.',
    },
    {
      question: 'App Router da Context Provider qanday sozlanadi?',
      answer: 'React Context — client-only. Provider komponent "use client" fayl ichida bo\'lishi kerak. Root layout (server component) provider-ni import qilib, children ni o\'raydi. Bu donut pattern — Provider client, children (sahifalar) server bo\'lib qoladi. Bir nechta provider bo\'lsa, Providers.tsx da compose qilish — to\'g\'ri pattern. Har bir provider alohida "use client" fayl.',
    },
    {
      question: 'Client bundle hajmini qanday kamaytirish mumkin?',
      answer: 'Strategiyalar: 1) "use client" ni leaf komponentlarga surish — faqat interaktiv qismlar client bo\'lsin. 2) next/dynamic bilan lazy import — katta kutubxonalar (chart, editor) kerak bo\'lganda yuklansin. 3) Server Component da data tayyorlash — DB, API logikasi bundle-ga kirmaydi. 4) Barrel file (index.ts) dan ehtiyot — bitta import butun papkani tortishi mumkin. 5) Bundle analyzer (next/bundle-analyzer) bilan monitoring.',
    },
  ],
  relatedTopics: [
    { techId: 'next-js', sectionId: 'nextjs-core', topicId: 'rendering', label: 'Rendering strategiyalari' },
    { techId: 'next-js', sectionId: 'nextjs-core', topicId: 'app-router', label: 'App Router' },
    { techId: 'next-js', sectionId: 'nextjs-patterns', topicId: 'streaming-suspense', label: 'Streaming va Suspense' },
  ],
}
