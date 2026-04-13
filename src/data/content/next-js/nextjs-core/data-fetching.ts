import type { Topic } from '../../../types'

export const dataFetching: Topic = {
  id: 'data-fetching',
  title: 'Data Fetching',
  importance: 3,
  status: 'to-learn',
  description: 'Server Components da fetch, cache, revalidation, generateStaticParams',
  content: `Next.js App Router da data fetching asosan Server Components ichida amalga oshiriladi. Bu React ning async/await qo'llab-quvvatlashiga asoslangan.

═══════════════════════════════════════
  SERVER COMPONENT DA FETCH
═══════════════════════════════════════

Server Component ichida to'g'ridan-to'g'ri async/await ishlatiladi.
useEffect yoki useState kerak EMAS.

  export default async function Page() {
    const data = await fetch('https://api.example.com/data')
    const json = await data.json()
    return <div>{json.title}</div>
  }

═══════════════════════════════════════
  FETCH CACHE SOZLAMALARI
═══════════════════════════════════════

Next.js fetch-ni kengaytirgan — cache va revalidation qo'shilgan:

  // Doimiy cache (standart SSG xulqi)
  fetch(url)  // yoki { cache: 'force-cache' }

  // Har so'rovda yangi (SSR xulqi)
  fetch(url, { cache: 'no-store' })

  // Vaqt asosida revalidation (ISR)
  fetch(url, { next: { revalidate: 60 } })

  // Tag asosida revalidation
  fetch(url, { next: { tags: ['posts'] } })

═══════════════════════════════════════
  REVALIDATION MEXANIZMLARI
═══════════════════════════════════════

1. Vaqt asosida (Time-based):
   next: { revalidate: 60 } — 60 soniyada bir yangilanadi

2. Talabga ko'ra (On-demand):
   revalidateTag('posts')  — 'posts' tegiga bog'liq barcha cache tozalanadi
   revalidatePath('/blog')  — ma'lum yo'lning cache tozalanadi

On-demand revalidation Server Actions yoki Route Handlers dan chaqiriladi.

═══════════════════════════════════════
  GENERATE STATIC PARAMS
═══════════════════════════════════════

Dinamik routelar uchun build vaqtida statik sahifalar yaratish:

  // app/blog/[slug]/page.tsx
  export async function generateStaticParams() {
    const posts = await getPosts()
    return posts.map(post => ({ slug: post.slug }))
  }

Bu funksiya build vaqtida chaqiriladi va qaytarilgan
parametrlar uchun statik sahifalar generatsiya qilinadi.

═══════════════════════════════════════
  PARALLEL VA SEQUENTIAL FETCHING
═══════════════════════════════════════

Parallel — bir vaqtda bir nechta so'rov (tezroq):
  const [users, posts] = await Promise.all([
    getUsers(),
    getPosts(),
  ])

Sequential — ketma-ket so'rovlar (bog'liq ma'lumotlar):
  const user = await getUser(id)
  const posts = await getUserPosts(user.id)

═══════════════════════════════════════
  FETCH FUNKSIYALARNI CACHE QILISH
═══════════════════════════════════════

React cache() bilan bir xil so'rovni deduplicate qilish:

  import { cache } from 'react'
  export const getUser = cache(async (id: string) => {
    const res = await fetch(\`/api/users/\${id}\`)
    return res.json()
  })

Bir render siklida getUser('1') ko'p marta chaqirilsa ham
faqat BIR marta fetch bo'ladi.`,
  codeExamples: [
    {
      title: 'Turli fetch strategiyalar',
      code: `// 1. Statik (build vaqtida) — standart
async function StaticData() {
  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()
  return <PostList posts={posts} />
}

// 2. Dinamik (har so'rovda)
async function DynamicData() {
  const res = await fetch('https://api.example.com/user', {
    cache: 'no-store',
  })
  const user = await res.json()
  return <Profile user={user} />
}

// 3. ISR (vaqt oralig'ida)
async function RevalidatedData() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 300 }, // 5 daqiqada bir
  })
  const products = await res.json()
  return <ProductGrid products={products} />
}`,
      language: 'tsx',
      description: 'Uchta asosiy fetch strategiyasi — static, dynamic, ISR',
    },
    {
      title: 'generateStaticParams bilan dinamik route',
      code: `// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'

interface Post {
  slug: string
  title: string
  content: string
}

// Build vaqtida barcha blog postlar uchun sahifa yaratish
export async function generateStaticParams() {
  const res = await fetch('https://api.example.com/posts')
  const posts: Post[] = await res.json()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Har bir post sahifasi
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const res = await fetch(\`https://api.example.com/posts/\${slug}\`)

  if (!res.ok) notFound()

  const post: Post = await res.json()

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}`,
      language: 'tsx',
      description: 'generateStaticParams — dinamik routelar uchun statik generatsiya',
    },
    {
      title: 'On-demand Revalidation',
      code: `// app/actions.ts
'use server'

import { revalidateTag, revalidatePath } from 'next/cache'

export async function publishPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  // Ma'lumotlar bazasiga saqlash
  await db.post.create({ data: { title, content } })

  // Cache tozalash — tag bo'yicha
  revalidateTag('posts')

  // Yoki yo'l bo'yicha
  revalidatePath('/blog')
}

// fetch da tag ishlatish:
// fetch(url, { next: { tags: ['posts'] } })`,
      language: 'ts',
      description: 'revalidateTag va revalidatePath bilan keshni boshqarish',
    },
  ],
  interviewQA: [
    {
      question: "Next.js da data fetching React-dan qanday farq qiladi?",
      answer: "React da data fetching odatda useEffect + useState orqali client tomondan bo'ladi. Next.js da Server Components ichida to'g'ridan-to'g'ri async/await ishlatiladi — useEffect kerak emas. Fetch avtomatik cache va revalidation bilan kengaytirilgan. Ma'lumot serverda olinadi va tayyor HTML clientga yuboriladi.",
    },
    {
      question: 'revalidateTag va revalidatePath orasidagi farq nima?',
      answer: "revalidateTag('posts') — 'posts' tegi bilan belgilangan BARCHA fetch so'rovlarining cache ini tozalaydi, qaysi sahifada bo'lishidan qat'iy nazar. revalidatePath('/blog') — faqat /blog yo'lidagi sahifa cache ini tozalaydi. Tag asosida revalidation aniqroq nazorat beradi.",
    },
    {
      question: "generateStaticParams nima qiladi?",
      answer: "generateStaticParams dinamik routelar ([slug], [id]) uchun build vaqtida statik sahifalar yaratish uchun ishlatiladi. U parametrlar ro'yxatini qaytaradi va har bir parametr uchun statik HTML generatsiya qilinadi. Bu getStaticPaths ning App Router versiyasi.",
    },
    {
      question: "Parallel va sequential data fetching qachon ishlatiladi?",
      answer: "Parallel (Promise.all) — so'rovlar bir-biriga bog'liq bo'lmaganda ishlatiladi, bu tezroq. Sequential — ikkinchi so'rov birinchining natijasiga bog'liq bo'lganda (masalan, avval user, keyin uning postlari). Next.js da Server Components waterfall-ga olib kelishi mumkin, shuning uchun imkon qadar parallel ishlatish tavsiya etiladi.",
    },
  ],
  relatedTopics: [
    { techId: 'next-js', sectionId: 'nextjs-core', topicId: 'rendering', label: 'Rendering strategiyalari' },
    { techId: 'next-js', sectionId: 'nextjs-advanced', topicId: 'server-actions', label: 'Server Actions' },
  ],
}
