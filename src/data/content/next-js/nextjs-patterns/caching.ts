import type { Topic } from '../../../types'

export const caching: Topic = {
  id: 'caching',
  title: 'Caching',
  importance: 3,
  status: 'to-learn',
  description: 'Next.js 4 qatlamli kesh tizimi — Request Memoization, Data Cache, Full Route Cache, Router Cache',
  content: `Next.js-da kesh 4 qatlamdan iborat. Har bir qatlam alohida vazifa bajaradi va ularni to'g'ri tushunish production ilovalar uchun muhim.

═══════════════════════════════════════
  4 QATLAMLI KESH ARXITEKTURASI
═══════════════════════════════════════

1. REQUEST MEMOIZATION — bir render davomida bir xil fetch takrorlanmaydi
   - Faqat GET so'rovlari
   - Faqat bitta server render ichida ishlaydi
   - React cache() mexanizmi orqali

2. DATA CACHE — fetch natijalari serverda saqlanadi
   - Build vaqtida yoki birinchi so'rovda to'ldiriladi
   - Revalidation bilan boshqariladi
   - next.revalidate va next.tags orqali sozlanadi

3. FULL ROUTE CACHE — to'liq sahifa HTML va RSC Payload serverda saqlanadi
   - Faqat statik routelar uchun (build vaqtida)
   - Dynamic routelar keshlanMAYDI
   - revalidatePath() bilan tozalanadi

4. ROUTER CACHE — brauzerda RSC Payload keshlanadi
   - Client tomonida ishlaydi
   - Orqaga-oldinga navigatsiyani tezlashtiradi
   - Prefetch qilingan routelarni saqlaydi

═══════════════════════════════════════
  FETCH OPTIONS
═══════════════════════════════════════

Next.js standart fetch-ni kengaytiradi:

  fetch(url, {
    cache: 'force-cache',      // Data Cache-da saqlash (standart)
    cache: 'no-store',         // Keshsiz — har doim yangi
    next: {
      revalidate: 3600,        // 1 soatda bir yangilanadi (ISR)
      tags: ['posts'],         // Tag orqali revalidation
    },
  })

MUHIM: cache: 'no-store' va revalidate: 0 natijasi bir xil — har doim fresh data. Lekin semantik farqi bor: no-store keshni butunlay o'chiradi, revalidate: 0 esa keshni yaratadi lekin darhol eskirgan deb belgilaydi.

═══════════════════════════════════════
  ON-DEMAND REVALIDATION
═══════════════════════════════════════

ISR (time-based) o'rniga aniq vaqtda keshni tozalash:

  revalidatePath('/blog')         — aniq path bo'yicha
  revalidatePath('/blog', 'page') — faqat page (layout emas)
  revalidatePath('/blog', 'layout') — layout va barcha child pages
  revalidateTag('posts')          — tag bo'yicha barcha keshlarni tozalash

Bu funksiyalar faqat Server Action yoki Route Handler ichida ishlaydi.

═══════════════════════════════════════
  UNSTABLE_CACHE — FETCH-SDAN TASHQARI
═══════════════════════════════════════

Ma'lumotlar bazasi so'rovlari yoki boshqa fetch-siz operatsiyalar uchun:

  import { unstable_cache } from 'next/cache'

  const getCachedPosts = unstable_cache(
    async () => db.post.findMany(),
    ['posts'],                    // cache key
    { revalidate: 3600, tags: ['posts'] }
  )

MUHIM: unstable_cache nomi "ishonchsiz" degani emas — API hali stabilizatsiya qilinmagan degani. Production-da ishlatsa bo'ladi.

═══════════════════════════════════════
  KESH DEBUGGING VA OPTING OUT
═══════════════════════════════════════

Keshdan chiqish usullari:
1. Route segment config:  export const dynamic = 'force-dynamic'
2. fetch: cache: 'no-store'
3. cookies() yoki headers() ishlatish — avtomatik dynamic
4. searchParams ishlatish — avtomatik dynamic

Debugging:
- next.config.js da logging: { fetches: { fullUrl: true } }
- Build vaqtida terminal chiqishida static/dynamic belgilanadi
- Network tab orqali cache headerlarni tekshirish`,
  codeExamples: [
    {
      title: 'Fetch bilan kesh sozlamalari',
      code: `// app/blog/page.tsx — ISR: har 1 soatda yangilanadi
async function BlogPage() {
  // 1 soatlik kesh
  const posts = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600, tags: ['posts'] },
  }).then(r => r.json())

  // Keshsiz — har doim yangi
  const user = await fetch('https://api.example.com/me', {
    cache: 'no-store',
  }).then(r => r.json())

  return (
    <div>
      <h1>{user.name} blogi</h1>
      {posts.map((post: { id: string; title: string }) => (
        <article key={post.id}>{post.title}</article>
      ))}
    </div>
  )
}

export default BlogPage`,
      language: 'tsx',
      description: 'fetch() orqali turli kesh strategiyalari',
    },
    {
      title: 'On-demand revalidation (Server Action)',
      code: `// app/actions.ts
'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const body = formData.get('body') as string

  await db.post.create({ data: { title, body } })

  // 1-usul: aniq path
  revalidatePath('/blog')

  // 2-usul: tag orqali (ko'p sahifalarni bir vaqtda)
  revalidateTag('posts')
}

export async function deletePost(id: string) {
  await db.post.delete({ where: { id } })

  // Layout va barcha child sahifalarni tozalash
  revalidatePath('/blog', 'layout')
}`,
      language: 'tsx',
      description: 'Server Action ichida keshni tozalash',
    },
    {
      title: 'unstable_cache — DB so\'rovlarini keshlash',
      code: `// lib/data.ts
import { unstable_cache } from 'next/cache'
import { db } from '@/lib/db'

// DB so'rovi keshlanadi
export const getCachedPosts = unstable_cache(
  async (authorId: string) => {
    return db.post.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
    })
  },
  ['posts-by-author'],  // cache key
  {
    revalidate: 1800,    // 30 daqiqa
    tags: ['posts'],     // revalidateTag('posts') bilan tozalanadi
  }
)

// app/blog/page.tsx
export default async function BlogPage() {
  const posts = await getCachedPosts('user-123')
  return <PostList posts={posts} />
}`,
      language: 'tsx',
      description: 'fetch-siz operatsiyalarni keshlash',
    },
    {
      title: 'Request Memoization misoli',
      code: `// lib/api.ts
async function getUser(id: string) {
  // Bu fetch bir render ichida necha marta chaqirilmasin
  // faqat 1 marta network so'rov yuboriladi
  const res = await fetch(\`https://api.example.com/users/\${id}\`)
  return res.json()
}

// app/profile/page.tsx
export default async function ProfilePage() {
  const user = await getUser('123')     // 1-chaqiruv
  return <Profile user={user} />
}

// components/UserAvatar.tsx (Server Component)
export default async function UserAvatar() {
  const user = await getUser('123')     // Takroriy — keshdan olinadi
  return <img src={user.avatar} alt={user.name} />
}

// MUHIM: Request Memoization faqat GET fetch uchun ishlaydi
// POST, PUT, DELETE keshlanMAYDI`,
      language: 'tsx',
      description: 'Bir render ichida bir xil fetch avtomatik deduplikatsiya qilinadi',
    },
    {
      title: 'Route segment config orqali kesh boshqarish',
      code: `// app/dashboard/layout.tsx
// Bu layout va barcha child routelar dynamic bo'ladi
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="dashboard">{children}</div>
}

// app/blog/page.tsx
// Faqat shu sahifa 1 soatda bir yangilanadi
export const revalidate = 3600

export default async function BlogPage() {
  const posts = await fetch('https://api.example.com/posts').then(r =>
    r.json()
  )
  return <PostList posts={posts} />
}

// Segment config variantlari:
// dynamic: 'auto' | 'force-dynamic' | 'error' | 'force-static'
// revalidate: false | 0 | number`,
      language: 'tsx',
      description: 'Route segment darajasida kesh va rendering sozlamalari',
    },
  ],
  interviewQA: [
    {
      question: 'Next.js-da 4 qatlamli kesh tizimini tushuntiring.',
      answer: '1) Request Memoization — bir render ichida bir xil fetch avtomatik deduplikatsiya qilinadi (React cache). 2) Data Cache — fetch natijalari serverda doimiy saqlanadi, revalidate bilan boshqariladi. 3) Full Route Cache — statik routelarning to\'liq HTML va RSC Payload build vaqtida keshlanadi. 4) Router Cache — client tomonida RSC Payload brauzerda saqlanadi, navigatsiyani tezlashtiradi.',
    },
    {
      question: 'revalidatePath va revalidateTag farqi nima?',
      answer: 'revalidatePath aniq bir URL path bo\'yicha keshni tozalaydi. revalidateTag esa tag orqali bir nechta path-dagi keshlarni bir vaqtda tozalaydi. Masalan, revalidateTag("posts") barcha fetch(..., { next: { tags: ["posts"] } }) keshlarini tozalaydi. Tag usuli ko\'proq moslashuvchan — bitta data source bir nechta sahifada ishlatilganda qulay.',
    },
    {
      question: 'cache: "no-store" va revalidate: 0 farqi bormi?',
      answer: 'Natijasi bir xil — ikkalasi ham har so\'rovda yangi data oladi. Lekin semantik farqi bor: cache: "no-store" keshni butunlay o\'chiradi (Data Cache-ga yozmaydi). revalidate: 0 esa Data Cache-ga yozadi lekin darhol eskirgan deb belgilaydi. Amalda ikkalasi ham dynamic rendering-ga olib keladi.',
    },
    {
      question: 'unstable_cache nima va qachon ishlatiladi?',
      answer: 'unstable_cache fetch-siz operatsiyalarni (DB so\'rovlari, hisob-kitoblar) keshlash uchun ishlatiladi. U cache key, revalidate vaqti va tags qabul qiladi. fetch() avtomatik keshlanadi, lekin Prisma, Drizzle kabi ORM so\'rovlari uchun unstable_cache kerak. Nomi "ishonchsiz" degani emas — API hali stabilizatsiya qilinmagan degani.',
    },
    {
      question: 'Qaysi holatlarda route avtomatik dynamic bo\'ladi?',
      answer: 'Route avtomatik dynamic bo\'ladi agar: 1) cookies() yoki headers() ishlatilsa, 2) searchParams qabul qilinsa, 3) fetch-da cache: "no-store" bo\'lsa, 4) POST/PUT/DELETE fetch ishlatilsa. Shuningdek, export const dynamic = "force-dynamic" orqali majburiy dynamic qilish mumkin.',
    },
  ],
  relatedTopics: [
    { techId: 'next-js', sectionId: 'nextjs-core', topicId: 'data-fetching', label: 'Data Fetching' },
    { techId: 'next-js', sectionId: 'nextjs-core', topicId: 'rendering', label: 'Rendering strategiyalari' },
    { techId: 'next-js', sectionId: 'nextjs-patterns', topicId: 'streaming-suspense', label: 'Streaming va Suspense' },
  ],
}
