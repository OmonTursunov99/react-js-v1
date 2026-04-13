import type { Topic } from '../../../types'

export const routing: Topic = {
  id: 'routing',
  title: 'Routing (Dynamic, Parallel, Intercepting)',
  importance: 3,
  status: 'to-learn',
  description: 'Dinamik routelar, route guruhlar, parallel va intercepting routelar',
  content: `Next.js App Router fayl tizimiga asoslangan routing ishlatadi. Papka tuzilmasi to'g'ridan-to'g'ri URL strukturasini belgilaydi.

═══════════════════════════════════════
  DINAMIK ROUTELAR
═══════════════════════════════════════

Kvadrat qavslar [] bilan dinamik segmentlar yaratiladi:

  app/blog/[slug]/page.tsx     → /blog/nextjs-intro
  app/shop/[...slug]/page.tsx  → /shop/men/shoes/nike (catch-all)
  app/shop/[[...slug]]/page.tsx → /shop yoki /shop/men/shoes (optional catch-all)

Parametrlarni olish:

  export default async function Page({
    params,
  }: {
    params: Promise<{ slug: string }>
  }) {
    const { slug } = await params
    return <div>Slug: {slug}</div>
  }

═══════════════════════════════════════
  ROUTE GURUHLARI
═══════════════════════════════════════

Qavslar () bilan route guruhlar yaratiladi.
Ular URL ga ta'sir QILMAYDI, faqat kodni tashkillash uchun:

  app/
  ├── (marketing)/
  │   ├── layout.tsx     ← marketing sahifalar uchun layout
  │   ├── about/page.tsx → /about
  │   └── blog/page.tsx  → /blog
  └── (dashboard)/
      ├── layout.tsx     ← dashboard uchun alohida layout
      └── panel/page.tsx → /panel

Har bir guruhning o'z layout.tsx bo'lishi mumkin.

═══════════════════════════════════════
  PARALLEL ROUTELAR
═══════════════════════════════════════

@ bilan parallel route slotlari yaratiladi.
Bir sahifada bir nechta mustaqil route bir vaqtda ko'rsatiladi:

  app/
  ├── layout.tsx           ← @analytics va @team ni oladi
  ├── @analytics/page.tsx  ← analytics paneli
  ├── @team/page.tsx       ← jamoa paneli
  └── page.tsx             ← asosiy kontent

  // layout.tsx
  export default function Layout({
    children,
    analytics,
    team,
  }) {
    return (
      <>
        {children}
        {analytics}
        {team}
      </>
    )
  }

═══════════════════════════════════════
  INTERCEPTING ROUTELAR
═══════════════════════════════════════

(.) (..) (...) bilan routelarni "tutib olish" mumkin.
Masalan, feed dagi rasm bosilganda modal ochiladi,
lekin to'g'ridan-to'g'ri URL kirsa — to'liq sahifa ochiladi:

  (.)  — bir xil darajadagi segmentni tutadi
  (..) — bir daraja yuqoridagi segmentni tutadi
  (...)— root dan tutadi

Misol: Instagram-ga o'xshash gallery:
  app/
  ├── feed/page.tsx
  ├── feed/@modal/(.)photo/[id]/page.tsx  ← modalda ochiladi
  └── photo/[id]/page.tsx                 ← to'liq sahifa

═══════════════════════════════════════
  SEARCH PARAMS
═══════════════════════════════════════

URL query parametrlarini olish:

  export default async function Page({
    searchParams,
  }: {
    searchParams: Promise<{ q?: string; page?: string }>
  }) {
    const { q, page } = await searchParams
    // /search?q=next&page=2
  }

MUHIM: searchParams ishlatilsa sahifa avtomatik DINAMIK bo'ladi.`,
  codeExamples: [
    {
      title: 'Dinamik route bilan sahifa',
      code: `// app/products/[category]/[id]/page.tsx
interface Props {
  params: Promise<{
    category: string
    id: string
  }>
}

export default async function ProductPage({ params }: Props) {
  const { category, id } = await params
  const product = await getProduct(category, id)

  return (
    <div>
      <span>Kategoriya: {category}</span>
      <h1>{product.name}</h1>
      <p>Narxi: {product.price} so'm</p>
    </div>
  )
}

// URL: /products/electronics/123
// params: { category: 'electronics', id: '123' }`,
      language: 'tsx',
      description: 'Bir nechta dinamik segmentli route',
    },
    {
      title: 'Parallel Routes — Dashboard',
      code: `// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  notifications,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  notifications: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">{children}</div>
      <div>{analytics}</div>
      <div>{notifications}</div>
    </div>
  )
}

// app/dashboard/@analytics/page.tsx
export default function AnalyticsSlot() {
  return <div>Statistika paneli</div>
}

// app/dashboard/@notifications/page.tsx
export default function NotificationsSlot() {
  return <div>Bildirishnomalar</div>
}`,
      language: 'tsx',
      description: 'Parallel routelar — bir sahifada bir nechta mustaqil panel',
    },
    {
      title: 'Route Groups bilan layout ajratish',
      code: `// Fayl tuzilmasi:
// app/
// ├── (auth)/
// │   ├── layout.tsx      ← headerSIZ layout (login/register uchun)
// │   ├── login/page.tsx   → /login
// │   └── register/page.tsx → /register
// ├── (main)/
// │   ├── layout.tsx      ← header + sidebar layout
// │   ├── page.tsx        → /
// │   └── dashboard/
// │       └── page.tsx    → /dashboard
// └── layout.tsx          ← Root layout

// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-96 p-6 border rounded-lg">
        {children}
      </div>
    </div>
  )
}`,
      language: 'tsx',
      description: 'Route guruhlar — turli sahifalar uchun turli layoutlar',
    },
  ],
  interviewQA: [
    {
      question: 'Parallel routelar nima va qachon ishlatiladi?',
      answer: "Parallel routelar @ prefiksi bilan yaratiladi va bir sahifada bir nechta mustaqil kontentni bir vaqtda ko'rsatish imkonini beradi. Har bir slot mustaqil yuklanadi, xatolik boshqaradi. Dashboard-larda ishlatiladi — masalan, bir vaqtda analytics, notifications va asosiy kontent ko'rsatish.",
    },
    {
      question: 'Intercepting routelar qanday ishlaydi?',
      answer: "Intercepting routelar (.) (..) (...) konventsiyasi bilan boshqa route-ni 'tutib oladi'. Masalan, feed-dan rasmni bosganda modal ochiladi (intercepted), lekin to'g'ridan-to'g'ri URL kiritsa to'liq sahifa ochiladi. Bu Instagram, Twitter kabi ilovalar uchun ishlatiladi — client navigatsiyada modal, server navigatsiyada to'liq sahifa.",
    },
    {
      question: "Route guruhlar nima uchun kerak?",
      answer: "Route guruhlar () qavslar bilan yaratiladi va URL strukturasiga ta'sir qilmaydi. Ular uchun ishlatiladi: 1) Turli layoutlar — (auth) sahifalar headersiz, (main) sahifalar headerli. 2) Kodni tashkillash — katta loyihalarda sahifalarni mantiqiy guruhlash. 3) Har bir guruhning o'z loading.tsx va error.tsx bo'lishi mumkin.",
    },
  ],
  relatedTopics: [
    { techId: 'next-js', sectionId: 'nextjs-core', topicId: 'app-router', label: 'App Router' },
    { techId: 'next-js', sectionId: 'nextjs-core', topicId: 'middleware', label: 'Middleware' },
  ],
}
