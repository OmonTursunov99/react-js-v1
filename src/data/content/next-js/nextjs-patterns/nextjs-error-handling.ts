import type { Topic } from '../../../types'

export const nextjsErrorHandling: Topic = {
  id: 'nextjs-error-handling',
  title: 'Error Handling',
  importance: 3,
  status: 'to-learn',
  description: 'Next.js xatoliklarni boshqarish — error.tsx, not-found.tsx, global-error.tsx, reset()',
  content: `Next.js App Router xatoliklarni fayl konventsiyalari orqali boshqaradi. Har bir route segment o'z error boundary-ga ega bo'lishi mumkin.

═══════════════════════════════════════
  ERROR.TSX — SEGMENT ERROR BOUNDARY
═══════════════════════════════════════

error.tsx fayli React ErrorBoundary-ni avtomatik yaratadi.

  app/
  ├── error.tsx          ← Root level xatolik
  ├── dashboard/
  │   ├── error.tsx      ← Dashboard xatoligi (faqat shu segment)
  │   └── page.tsx

MUHIM: error.tsx MAJBURIY ravishda Client Component bo'lishi kerak ('use client'). Sababi: ErrorBoundary React class component mexanizmi — faqat client tomonida ishlaydi.

Error boundary o'z SEGMENTI va barcha CHILD segmentlarni o'rab turadi. Lekin PARENT layout-ga ta'sir qilMAYDI — layout renderlanishda davom etadi.

═══════════════════════════════════════
  NOT-FOUND.TSX + NOTFOUND() FUNKSIYA
═══════════════════════════════════════

Ikki xil 404 mexanizm:

1. AVTOMATIK — mavjud bo'lmagan URL:
   Next.js avtomatik app/not-found.tsx ko'rsatadi.

2. DASTURIY — notFound() funksiya:
   import { notFound } from 'next/navigation'

   async function getPost(slug: string) {
     const post = await db.post.findUnique({ where: { slug } })
     if (!post) notFound()  // 404 sahifaga yo'naltiradi
     return post
   }

Har bir segment o'z not-found.tsx fayliga ega bo'lishi mumkin.
notFound() eng yaqin not-found.tsx ni topadi va ko'rsatadi.

═══════════════════════════════════════
  GLOBAL-ERROR.TSX — ROOT LAYOUT XATOLIK
═══════════════════════════════════════

error.tsx root layout xatoligini USHLAY OLMAYDI.
Root layout xatoliklari uchun global-error.tsx ishlatiladi.

  app/
  ├── layout.tsx         ← Agar shu yerda xato bo'lsa...
  ├── global-error.tsx   ← ...shu fayl ko'rsatiladi
  └── error.tsx          ← Bu page xatoliklari uchun

MUHIM: global-error.tsx o'z html va body teglarini aniqlashi kerak, chunki root layout ishlamay qoladi.

═══════════════════════════════════════
  RESET() — XATOLIKDAN QAYTISH
═══════════════════════════════════════

error.tsx ga reset funksiyasi beriladi:

  reset() chaqirilganda:
  1. Error boundary tozalanadi
  2. Segment qayta renderlanadi
  3. Agar xato takrorlansa — yana error.tsx ko'rsatiladi

reset() faqat client tomonidagi xatoliklarda ishlaydi.
Server xatoliklarida sahifani to'liq qayta yuklash kerak: router.refresh()

═══════════════════════════════════════
  SERVER VS CLIENT XATOLIKLAR
═══════════════════════════════════════

SERVER XATOLIKLARI:
- Server Component ichida throw
- DB connection xatolik
- API so'rov muvaffaqiyatsiz
- error.tsx ga digest (hash) beriladi — xavfsizlik uchun to'liq xabar ko'rsatilMAYDI

CLIENT XATOLIKLARI:
- onClick handler ichida throw
- useEffect ichida xato
- To'liq error.message ko'rsatiladi (development mode)
- Production-da ham digest berilishi mumkin

MUHIM: Server xatoliklarida foydalanuvchiga batafsil xabar ko'rsatmang — xavfsizlik muammosi. Faqat umumiy xabar va reset tugmasi yetarli.

═══════════════════════════════════════
  REDIRECT VA ERROR BOUNDARY
═══════════════════════════════════════

redirect() — try/catch ichida ishlatilganda ehtiyot bo'ling:

  redirect() aslida NEXT_REDIRECT xatosini throw qiladi.
  Agar try/catch bilan o'ralsangiz, redirect ishlamaydi.
  Yechim: catch ichida NEXT_REDIRECT ni qayta throw qilish.`,
  codeExamples: [
    {
      title: 'error.tsx — segment error boundary',
      code: `// app/dashboard/error.tsx
'use client'

import { useEffect } from 'react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Xatolikni logging servisga yuborish
    console.error('Dashboard xatolik:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-xl font-bold text-red-600">
        Xatolik yuz berdi!
      </h2>
      <p className="text-gray-600">
        {error.digest
          ? 'Server xatoligi yuz berdi. Qayta urinib ko\\'ring.'
          : error.message}
      </p>
      <button
        onClick={reset}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        Qayta urinish
      </button>
    </div>
  )
}`,
      language: 'tsx',
      description: 'Segment darajasidagi xatolikni ushlash va recovery',
    },
    {
      title: 'not-found.tsx va notFound() funksiya',
      code: `// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 p-16">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl text-gray-600">Sahifa topilmadi</p>
      <Link href="/" className="text-blue-500 underline">
        Bosh sahifaga qaytish
      </Link>
    </div>
  )
}

// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getPost } from '@/lib/api'

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound() // Eng yaqin not-found.tsx ko'rsatiladi
  }

  return <article>{post.content}</article>
}`,
      language: 'tsx',
      description: 'Statik va dasturiy 404 sahifalar',
    },
    {
      title: 'global-error.tsx — root layout xatolik',
      code: `// app/global-error.tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // MUHIM: global-error o'z html/body ni aniqlashi kerak
  // chunki root layout ishlamay qolgan
  return (
    <html lang="uz">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-red-600">
            Tizimda xatolik!
          </h1>
          <p className="mt-4 text-gray-600">
            Ilovada jiddiy xatolik yuz berdi.
          </p>
          <button
            onClick={reset}
            className="mt-6 rounded bg-blue-500 px-6 py-3 text-white"
          >
            Qayta yuklash
          </button>
        </div>
      </body>
    </html>
  )
}`,
      language: 'tsx',
      description: 'Root layout xatoliklarini boshqarish',
    },
    {
      title: 'Nested error boundaries',
      code: `// Papka tuzilmasi:
// app/
// ├── layout.tsx         (global-error.tsx boshqaradi)
// ├── error.tsx          (root page xatoliklari)
// ├── global-error.tsx   (root layout xatoliklari)
// └── dashboard/
//     ├── layout.tsx     (parent error.tsx boshqaradi)
//     ├── error.tsx      (dashboard xatoliklari)
//     ├── page.tsx
//     └── settings/
//         ├── error.tsx  (settings xatoliklari)
//         └── page.tsx

// app/dashboard/settings/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const session = await auth()

  // redirect() — try/catch ichida bo'lsa ehtiyot bo'ling
  if (!session) {
    redirect('/login')
  }

  // Bu xato app/dashboard/settings/error.tsx tomonidan ushlanadi
  const settings = await getSettings(session.userId)
  if (!settings) {
    throw new Error('Settings yuklanmadi')
  }

  return <SettingsForm settings={settings} />
}`,
      language: 'tsx',
      description: 'Har bir segment o\'zining error boundary-ga ega',
    },
    {
      title: 'Server error handling va router.refresh()',
      code: `// app/dashboard/error.tsx
'use client'

import { useRouter } from 'next/navigation'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  const handleRetry = () => {
    if (error.digest) {
      // Server xatolik — to'liq refresh kerak
      router.refresh()
    } else {
      // Client xatolik — reset yetarli
      reset()
    }
  }

  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold text-red-600">Xatolik!</h2>
      <p className="mt-2 text-gray-600">
        {error.digest
          ? 'Server bilan aloqada muammo.'
          : error.message}
      </p>
      <div className="mt-4 flex justify-center gap-4">
        <button onClick={handleRetry} className="rounded bg-blue-500 px-4 py-2 text-white">
          Qayta urinish
        </button>
        <button onClick={() => router.push('/')} className="rounded bg-gray-500 px-4 py-2 text-white">
          Bosh sahifa
        </button>
      </div>
    </div>
  )
}`,
      language: 'tsx',
      description: 'Server va client xatoliklarni farqlab boshqarish',
    },
  ],
  interviewQA: [
    {
      question: 'error.tsx nima uchun "use client" bo\'lishi kerak?',
      answer: 'error.tsx React ErrorBoundary mexanizmiga asoslangan. ErrorBoundary — class component bo\'lib, componentDidCatch va getDerivedStateFromError lifecycle metodlarini ishlatadi. Bu metodlar faqat client tomonida ishlaydi. Shuning uchun error.tsx majburiy ravishda Client Component bo\'lishi kerak.',
    },
    {
      question: 'error.tsx root layout xatoligini ushlay oladimi?',
      answer: 'Yo\'q. error.tsx faqat o\'z segmenti va child segmentlar xatoligini ushlaydi. Root layout-ni error.tsx o\'ray olmaydi, chunki error.tsx layout ICHIDA renderlanadi. Root layout xatoliklari uchun global-error.tsx kerak — u o\'z html/body teglarini aniqlashi kerak, chunki root layout ishlamayotgan bo\'ladi.',
    },
    {
      question: 'reset() va router.refresh() farqi nima?',
      answer: 'reset() — ErrorBoundary-ni tozalaydi va segment-ni qayta render qilishga urinadi. Client xatoliklarda ishlaydi. router.refresh() — butun route-ni serverdan qayta yuklaydi, yangi RSC Payload oladi. Server xatoliklarida reset() yetarli emas, chunki server tomonidagi muammo hal bo\'lmagan. router.refresh() server komponentlarini qayta bajaradi.',
    },
    {
      question: 'notFound() qanday ishlaydi va qachon ishlatiladi?',
      answer: 'notFound() NEXT_NOT_FOUND xatosini throw qiladi. Eng yaqin not-found.tsx fayli ko\'rsatiladi. Dinamik sahifalarda DB dan topilmagan resurslar uchun ishlatiladi. Masalan, blog/[slug] da mavjud bo\'lmagan slug uchun. not-found.tsx Server Component bo\'lishi mumkin (error.tsx dan farqli).',
    },
    {
      question: 'redirect() try/catch ichida muammo yaratadimi?',
      answer: 'Ha. redirect() aslida NEXT_REDIRECT tipidagi xatoni throw qiladi. Agar try/catch bilan o\'ralsangiz, redirect ushlanadi va ishlamaydi. Yechim: catch ichida xato tipini tekshirib, NEXT_REDIRECT bo\'lsa qayta throw qilish. Yoki redirect() ni try/catch tashqarisida ishlatish.',
    },
    {
      question: 'Server xatoliklarida nima uchun to\'liq error.message ko\'rsatilmaydi?',
      answer: 'Xavfsizlik uchun. Server xatoliklari DB connection string, API key, ichki tuzilma haqida ma\'lumot o\'z ichiga olishi mumkin. Production-da Next.js server xatolarini digest (hash) bilan almashtiradi. Development mode-da to\'liq xabar ko\'rsatiladi. Bu xatti-harakat React Server Components spetsifikatsiyasiga mos.',
    },
  ],
  relatedTopics: [
    { techId: 'next-js', sectionId: 'nextjs-core', topicId: 'app-router', label: 'App Router fayl konventsiyalari' },
    { techId: 'next-js', sectionId: 'nextjs-patterns', topicId: 'streaming-suspense', label: 'Streaming va Suspense' },
    { techId: 'next-js', sectionId: 'nextjs-patterns', topicId: 'server-client-patterns', label: 'Server/Client Patterns' },
  ],
}
