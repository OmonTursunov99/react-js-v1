import type { Topic } from '../../../types'

export const rendering: Topic = {
  id: 'rendering',
  title: 'Rendering (SSR, SSG, ISR)',
  importance: 3,
  status: 'to-learn',
  description: 'Next.js rendering strategiyalari — SSR, SSG, ISR, Streaming, RSC',
  content: `Next.js bir nechta rendering strategiyasini qo'llab-quvvatlaydi. Har birining o'z afzalliklari va ishlatish holatlari bor.

═══════════════════════════════════════
  REACT SERVER COMPONENTS (RSC)
═══════════════════════════════════════

RSC — React 18 da joriy qilingan yangi paradigma.
Komponentlar serverda ishlaydi, JavaScript clientga yuborilMAYDI.

Afzalliklari:
- Bundle size kichik (server kod clientga tushmaydi)
- To'g'ridan-to'g'ri DB/API ga murojaat qilish mumkin
- Og'ir kutubxonalar (moment, lodash) serverda qoladi

═══════════════════════════════════════
  STATIC RENDERING (SSG)
═══════════════════════════════════════

Standart holda Next.js sahifalarni BUILD VAQTIDA statik generatsiya qiladi.
Agar sahifada dinamik funksiyalar (cookies(), headers()) ishlatilmasa — avtomatik statik.

  // Bu sahifa build vaqtida statik generatsiya bo'ladi
  export default async function About() {
    return <h1>Biz haqimizda</h1>
  }

generateStaticParams — dinamik routelar uchun statik sahifalar yaratadi:

  export async function generateStaticParams() {
    const posts = await getPosts()
    return posts.map(post => ({ slug: post.slug }))
  }

═══════════════════════════════════════
  SERVER-SIDE RENDERING (SSR)
═══════════════════════════════════════

Har bir so'rovda serverda renderlanadi.
Dynamic funksiyalar ishlatilsa avtomatik SSR bo'ladi:

- cookies() chaqirish
- headers() chaqirish
- searchParams ishlatish
- cache: 'no-store' bilan fetch

═══════════════════════════════════════
  INCREMENTAL STATIC REGENERATION (ISR)
═══════════════════════════════════════

Statik sahifalarni ma'lum vaqt oralig'ida yangilaydi.
Build qayta qilmasdan kontent yangilanadi.

  fetch('https://api.example.com/data', {
    next: { revalidate: 3600 }  // 1 soatda bir yangilanadi
  })

ISR jarayoni:
1. Birinchi so'rov — keshdan eski sahifa ko'rsatiladi
2. Fonda yangi sahifa generatsiya qilinadi
3. Keyingi so'rovlar yangi sahifani oladi

═══════════════════════════════════════
  STREAMING
═══════════════════════════════════════

Streaming — sahifani bo'laklarga bo'lib yuborish.
Tezkor qismlar darhol ko'rinadi, sekin qismlar keyinroq yuboriladi.

loading.tsx yoki Suspense orqali amalga oshiriladi.
Bu foydalanuvchi tajribasini yaxshilaydi — sahifa "muzlab" qolmaydi.

═══════════════════════════════════════
  QAYSI STRATEGIYANI TANLASH KERAK?
═══════════════════════════════════════

Statik (SSG)  — blog, marketing, dokumentatsiya
ISR           — tez-tez yangilanadigan kontent (e-commerce)
SSR           — foydalanuvchiga xos kontent (dashboard)
Streaming     — og'ir sahifalar (sekin API chaqiruvlari bor)`,
  codeExamples: [
    {
      title: 'Server Component bilan data fetching',
      code: `// app/posts/page.tsx — Server Component
interface Post {
  id: number
  title: string
  body: string
}

export default async function PostsPage() {
  // To'g'ridan-to'g'ri server da fetch
  // useEffect kerak EMAS!
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  const posts: Post[] = await res.json()

  return (
    <div>
      <h1>Maqolalar</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </article>
      ))}
    </div>
  )
}`,
      language: 'tsx',
      description: 'Server Component ichida to\'g\'ridan-to\'g\'ri async/await bilan ma\'lumot olish',
    },
    {
      title: 'ISR — vaqt asosida revalidation',
      code: `// app/products/page.tsx
export const revalidate = 3600 // 1 soat

export default async function Products() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 },
  })
  const products = await res.json()

  return (
    <div>
      {products.map((p: any) => (
        <div key={p.id}>{p.name} — {p.price} so'm</div>
      ))}
    </div>
  )
}`,
      language: 'tsx',
      description: 'ISR — sahifa 1 soatda bir serverda qayta generatsiya bo\'ladi',
    },
    {
      title: 'Streaming bilan Suspense',
      code: `// app/dashboard/page.tsx
import { Suspense } from 'react'

// Sekin komponent
async function Analytics() {
  const data = await fetch('https://api.example.com/analytics', {
    cache: 'no-store',
  })
  const analytics = await data.json()
  return <div>Tashriflar: {analytics.visits}</div>
}

// Tezkor komponent
function Welcome() {
  return <h1>Dashboard-ga xush kelibsiz!</h1>
}

export default function DashboardPage() {
  return (
    <div>
      <Welcome />
      <Suspense fallback={<div>Statistika yuklanmoqda...</div>}>
        <Analytics />
      </Suspense>
    </div>
  )
}`,
      language: 'tsx',
      description: 'Streaming — Welcome darhol ko\'rinadi, Analytics keyinroq yuklanadi',
    },
  ],
  interviewQA: [
    {
      question: 'SSR va SSG orasidagi farq nima?',
      answer: "SSG (Static Site Generation) — sahifalar BUILD vaqtida bir marta generatsiya qilinadi va CDN dan xizmat ko'rsatiladi. SSR (Server-Side Rendering) — har bir HTTP so'rovda serverda qaytadan renderlanadi. SSG tezroq (CDN cache), SSR esa doim yangi ma'lumot beradi.",
    },
    {
      question: 'ISR nima va qachon ishlatiladi?',
      answer: "ISR (Incremental Static Regeneration) — statik sahifalarni vaqt oralig'ida qayta generatsiya qiladi. Masalan, revalidate: 60 desa — 60 soniyada bir yangilanadi. E-commerce, yangiliklar sayti kabi tez-tez yangilanadigan lekin SEO muhim bo'lgan saytlar uchun ideal.",
    },
    {
      question: 'React Server Components nima afzallik beradi?',
      answer: "RSC serverda ishlaydi va JavaScript clientga yuborilMAYDI. Bu bundle size ni kamaytiradi, to'g'ridan-to'g'ri DB/API ga murojaat qilish imkonini beradi, og'ir kutubxonalar (markdown parser, syntax highlighter) serverda qoladi. Client faqat interaktiv qismlarni oladi.",
    },
    {
      question: "Next.js da sahifa qachon statik, qachon dinamik bo'ladi?",
      answer: "Agar sahifada cookies(), headers(), searchParams, yoki cache: 'no-store' ishlatilsa — avtomatik dinamik (SSR) bo'ladi. Aks holda Next.js uni build vaqtida statik qiladi. force-dynamic yoki force-static eksport qilib majburlash ham mumkin.",
    },
  ],
  relatedTopics: [
    { techId: 'next-js', sectionId: 'nextjs-core', topicId: 'data-fetching', label: 'Data Fetching' },
    { techId: 'next-js', sectionId: 'nextjs-advanced', topicId: 'server-actions', label: 'Server Actions' },
  ],
}
