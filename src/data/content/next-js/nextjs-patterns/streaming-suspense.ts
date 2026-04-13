import type { Topic } from '../../../types'

export const streamingSuspense: Topic = {
  id: 'streaming-suspense',
  title: 'Streaming va Suspense',
  importance: 3,
  status: 'to-learn',
  description: 'Streaming SSR, loading.tsx, React Suspense, Partial Prerendering (PPR)',
  content: `Next.js App Router streaming SSR ni to'liq qo'llab-quvvatlaydi. Sahifani bo'laklarga bo'lib, tayyor bo'lganidan progressiv ravishda yuborish mumkin.

═══════════════════════════════════════
  LOADING.TSX — INSTANT LOADING UI
═══════════════════════════════════════

loading.tsx — fayl konventsiyasi orqali avtomatik Suspense boundary.

  app/
  ├── loading.tsx          ← Global loading
  └── dashboard/
      ├── loading.tsx      ← Dashboard loading
      └── page.tsx

Next.js ichki mexanizmi:

  <Layout>
    <Suspense fallback={<Loading />}>
      <Page />
    </Suspense>
  </Layout>

loading.tsx joylashgan papkadagi page.tsx va barcha child routelar uchun ishlaydi.
U DARHOL ko'rsatiladi — server page.tsx ni tayyorlayotganda foydalanuvchi loading ko'radi.

MUHIM: loading.tsx layout-ni KUTMAYDI. Layout darhol renderlanadi, faqat page content loading bilan almashtiriladi.

═══════════════════════════════════════
  REACT SUSPENSE — GRANULAR LOADING
═══════════════════════════════════════

loading.tsx butun sahifani o'raydi. Lekin ko'pincha sahifaning faqat bir qismini kutish kerak:

  async function SlowComponent() {
    const data = await fetchSlowData()  // 3 soniya
    return <div>{data}</div>
  }

  export default function Page() {
    return (
      <div>
        <h1>Dashboard</h1>           {/* Darhol ko'rsatiladi */}
        <Suspense fallback={<Skeleton />}>
          <SlowComponent />            {/* 3 soniyadan keyin */}
        </Suspense>
        <Footer />                     {/* Darhol ko'rsatiladi */}
      </div>
    )
  }

Bu granular loading — foydalanuvchi sahifaning tayyor qismlarini darhol ko'radi.

═══════════════════════════════════════
  STREAMING SSR — PROGRESSIVE HTML
═══════════════════════════════════════

An'anaviy SSR:
  1. Server BUTUN sahifani renderlay (kutish)
  2. To'liq HTML yuboriladi
  3. Client hydration

Streaming SSR:
  1. Server tayyor qismlarni DARHOL yuboradi
  2. Sekin qismlar tayyor bo'lganda qo'shimcha HTML yuboriladi
  3. Brauzer progressiv ravishda placeholder-ni haqiqiy kontent bilan almashtiradi

Bu HTTP chunked transfer encoding orqali ishlaydi.
Suspense boundary har bir "chunk" chegarasini belgilaydi.

═══════════════════════════════════════
  PARALLEL DATA FETCHING
═══════════════════════════════════════

Bir nechta sekin komponentni parallel yuklash:

  export default function Dashboard() {
    return (
      <div className="grid grid-cols-2 gap-4">
        <Suspense fallback={<Skeleton />}>
          <Revenue />          {/* DB so'rov 1 */}
        </Suspense>
        <Suspense fallback={<Skeleton />}>
          <RecentOrders />     {/* DB so'rov 2 */}
        </Suspense>
      </div>
    )
  }

Har bir Suspense boundary mustaqil stream qilinadi.
Revenue 1 soniyada tayyor bo'lsa — darhol ko'rsatiladi.
RecentOrders 3 soniyada tayyor bo'lsa — 3 soniyadan keyin ko'rsatiladi.
Ikkisi PARALLEL ishlaydi — waterfall yo'q.

═══════════════════════════════════════
  PARTIAL PRERENDERING (PPR)
═══════════════════════════════════════

PPR — Next.js experimental xususiyati:

  Statik shell + dinamik teshiklar

  1. Build vaqtida statik qismlar (header, sidebar, footer) renderlanadi
  2. Dinamik qismlar (user data, real-time) Suspense boundary ichida
  3. So'rov kelganda statik shell DARHOL yuboriladi
  4. Dinamik qismlar streaming orqali keyinroq yuboriladi

  // next.config.ts
  const config = { experimental: { ppr: 'incremental' } }

  // app/page.tsx
  export const experimental_ppr = true

PPR = Static + Dynamic bitta sahifada, bitta so'rovda.
TTFB (Time to First Byte) statik sahifadek tez.

═══════════════════════════════════════
  USEFORMSTATUS VA USEOPTIMISTIC
═══════════════════════════════════════

Streaming bilan birga form holatini boshqarish:

  useFormStatus — form yuborilayotganini bilish
  useOptimistic — server javobini kutmasdan UI yangilash

Bu hooklar streaming bilan birgalikda ishlaydi — server action bajarilayotganda foydalanuvchi optimistic UI ko'radi.`,
  codeExamples: [
    {
      title: 'loading.tsx va Suspense kombinatsiyasi',
      code: `// app/dashboard/loading.tsx
// Bu butun dashboard sahifa uchun fallback
export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-4 p-8">
      <div className="h-8 w-48 rounded bg-gray-200" />
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded bg-gray-200" />
        ))}
      </div>
    </div>
  )
}

// app/dashboard/page.tsx
// Sahifa ichida granular Suspense
import { Suspense } from 'react'
import { Revenue } from './Revenue'
import { RecentOrders } from './RecentOrders'
import { TopProducts } from './TopProducts'

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <Suspense fallback={<CardSkeleton />}>
          <Revenue />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <RecentOrders />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <TopProducts />
        </Suspense>
      </div>
    </div>
  )
}

function CardSkeleton() {
  return <div className="h-32 animate-pulse rounded bg-gray-200" />
}`,
      language: 'tsx',
      description: 'Sahifa darajasida va komponent darajasida loading holatlar',
    },
    {
      title: 'Streaming SSR — parallel data fetching',
      code: `// components/Revenue.tsx (Server Component)
async function getRevenue() {
  // Sekin API — 2 soniya
  const res = await fetch('https://api.example.com/revenue', {
    next: { revalidate: 3600 },
  })
  return res.json()
}

export async function Revenue() {
  const data = await getRevenue()
  return (
    <div className="rounded border p-4">
      <h3 className="font-bold">Daromad</h3>
      <p className="text-3xl">{data.total} UZS</p>
    </div>
  )
}

// components/RecentOrders.tsx (Server Component)
async function getOrders() {
  // Juda sekin API — 5 soniya
  const res = await fetch('https://api.example.com/orders', {
    cache: 'no-store',
  })
  return res.json()
}

export async function RecentOrders() {
  const orders = await getOrders()
  return (
    <div className="rounded border p-4">
      <h3 className="font-bold">Buyurtmalar</h3>
      <ul>
        {orders.map((o: { id: string; name: string }) => (
          <li key={o.id}>{o.name}</li>
        ))}
      </ul>
    </div>
  )
}

// NATIJA:
// 0s  — Layout + h1 + 3 ta skeleton
// 2s  — Revenue tayyor, skeleton almashtiriladi
// 5s  — RecentOrders tayyor, skeleton almashtiriladi
// Foydalanuvchi 0s dan boshlab sahifani ko'radi!`,
      language: 'tsx',
      description: `Har bir komponent mustaqil stream qilinadi — waterfall yo'q`,
    },
    {
      title: 'Partial Prerendering (PPR)',
      code: `// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental', // route darajasida PPR ni yoqish
  },
}

export default nextConfig

// app/page.tsx
import { Suspense } from 'react'
import { UserGreeting } from '@/components/UserGreeting'
import { ProductGrid } from '@/components/ProductGrid'

// Bu route uchun PPR yoqish
export const experimental_ppr = true

export default function HomePage() {
  return (
    <div>
      {/* STATIK — build vaqtida renderlanadi */}
      <header>
        <h1>Ketmonjon Do'kon</h1>
        <nav>Bosh sahifa | Mahsulotlar | Aloqa</nav>
      </header>

      {/* DINAMIK — streaming orqali */}
      <Suspense fallback={<p>Salom, mehmon...</p>}>
        <UserGreeting />
      </Suspense>

      {/* STATIK — build vaqtida */}
      <h2>Mashhur mahsulotlar</h2>

      {/* DINAMIK — streaming orqali */}
      <Suspense fallback={<GridSkeleton />}>
        <ProductGrid />
      </Suspense>

      {/* STATIK */}
      <footer>Ketmonjon 2026</footer>
    </div>
  )
}

function GridSkeleton() {
  return <div className="grid grid-cols-4 gap-4 animate-pulse" />
}`,
      language: 'tsx',
      description: 'Statik shell + dinamik teshiklar — eng tez TTFB',
    },
    {
      title: 'useFormStatus va useOptimistic bilan streaming',
      code: `// components/AddToCart.tsx
'use client'

import { useOptimistic, useActionState } from 'react'
import { addToCart } from '@/app/actions'

type CartItem = { id: string; name: string; pending?: boolean }

export function AddToCart({ items }: { items: CartItem[] }) {
  const [optimisticItems, addOptimistic] = useOptimistic(
    items,
    (state: CartItem[], newItem: CartItem) => [
      ...state,
      { ...newItem, pending: true },
    ]
  )

  async function handleAdd(formData: FormData) {
    const name = formData.get('name') as string
    addOptimistic({ id: 'temp', name, pending: true })
    await addToCart(formData)
  }

  return (
    <div>
      <form action={handleAdd}>
        <input name="name" placeholder="Mahsulot nomi" />
        <SubmitButton />
      </form>
      <ul>
        {optimisticItems.map((item, i) => (
          <li key={i} style={{ opacity: item.pending ? 0.5 : 1 }}>
            {item.name} {item.pending && '(qo'shilmoqda...)'}
          </li>
        ))}
      </ul>
    </div>
  )
}

// components/SubmitButton.tsx
'use client'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Qo'shilmoqda..." : "Qo'shish"}
    </button>
  )
}`,
      language: 'tsx',
      description: `Optimistic UI — server javobini kutmasdan darhol ko'rsatish`,
    },
  ],
  interviewQA: [
    {
      question: `Streaming SSR an'anaviy SSR dan qanday farq qiladi?`,
      answer: `An'anaviy SSR butun sahifani serverda to'liq render qiladi, keyin to'liq HTML yuboradi. Foydalanuvchi hech narsa ko'rmaydi toki hamma narsa tayyor bo'lguncha. Streaming SSR esa tayyor qismlarni darhol yuboradi — Suspense boundary har bir chunk chegarasini belgilaydi. HTTP chunked transfer encoding ishlatiladi. Natijada TTFB ancha past va foydalanuvchi sahifani progressiv ravishda ko'radi.`,
    },
    {
      question: 'loading.tsx va Suspense farqi nima? Qachon qaysi birini ishlatish kerak?',
      answer: 'loading.tsx — fayl konventsiyasi, butun page.tsx ni Suspense bilan o\'raydi. Sahifa darajasidagi loading holat uchun. Suspense — React primitiv, ixtiyoriy joyda ishlatiladi. Sahifa ichida granular loading kerak bo\'lsa (masalan, sidebar darhol, content keyin) alohida Suspense boundary ishlatiladi. Ikkalasi birgalikda ham ishlaydi — loading.tsx tashqi, Suspense ichki darajada.',
    },
    {
      question: 'Partial Prerendering (PPR) nima va qanday ishlaydi?',
      answer: 'PPR — bitta sahifada statik va dinamik kontentni birlashtiradigan rendering strategiyasi. Build vaqtida statik qismlar (header, footer, layout) prerender qilinadi. Dinamik qismlar Suspense boundary ichida belgilanadi. So\'rov kelganda statik shell darhol yuboriladi (CDN dan), dinamik qismlar streaming orqali keyinroq keladi. TTFB statik sahifadek tez, lekin personalizatsiya ham mumkin.',
    },
    {
      question: 'Suspense boundary-larni qanday joylashtirish kerak — ko\'p kichik yoki bitta katta?',
      answer: 'Ideal — har bir mustaqil data source uchun alohida Suspense. Ko\'p kichik Suspense boundary parallel streaming imkonini beradi — tez komponent kutmasdan ko\'rsatiladi. Bitta katta Suspense hamma narsani eng sekin komponentga bog\'laydi. Lekin juda ko\'p ham yaxshi emas — UX fragmentatsiya bo\'ladi. Balans: 3-5 ta mantiqiy guruh (revenue card, orders list, chart) har biri o\'z Suspense-da.',
    },
    {
      question: 'useOptimistic qanday ishlaydi va nima uchun kerak?',
      answer: 'useOptimistic — server action natijasini kutmasdan UI ni darhol yangilash uchun. state va updater funksiya qabul qiladi. Action boshlanganida optimistic state ko\'rsatiladi (masalan, yangi element pending: true bilan). Server javob berganda haqiqiy state bilan almashtiriladi. Agar xato bo\'lsa — optimistic state avtomatik orqaga qaytadi. Foydalanuvchi uchun ilova tezroq seziladi.',
    },
  ],
  relatedTopics: [
    { techId: 'next-js', sectionId: 'nextjs-core', topicId: 'rendering', label: 'Rendering strategiyalari' },
    { techId: 'next-js', sectionId: 'nextjs-patterns', topicId: 'caching', label: 'Caching' },
    { techId: 'next-js', sectionId: 'nextjs-patterns', topicId: 'server-client-patterns', label: 'Server/Client Patterns' },
  ],
}
