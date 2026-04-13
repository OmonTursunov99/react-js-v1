import type { Topic } from '../../../types'

export const metadataSeo: Topic = {
  id: 'metadata-seo',
  title: 'Metadata va SEO',
  importance: 3,
  status: 'to-learn',
  description: 'Next.js metadata API — generateMetadata, sitemap, robots, OG images, JSON-LD',
  content: `Next.js App Router-da SEO uchun kuchli metadata tizimi mavjud. Statik va dinamik metadata, fayl konventsiyalari va structured data — barchasi built-in.

═══════════════════════════════════════
  STATIC METADATA EXPORT
═══════════════════════════════════════

Eng oddiy usul — metadata konstantasini eksport qilish:

  import type { Metadata } from 'next'

  export const metadata: Metadata = {
    title: 'Blog sahifasi',
    description: "Eng so'nggi maqolalar",
    keywords: ['next.js', 'react', 'blog'],
    authors: [{ name: 'Ketmonjon' }],
    openGraph: {
      title: 'Blog',
      description: "Maqolalar ro'yxati",
      images: ['/og-blog.png'],
    },
  }

MUHIM: Statik metadata faqat Server Component (layout.tsx, page.tsx) da ishlaydi. Client Component-da eksport qilib bo'lmaydi.

═══════════════════════════════════════
  GENERATE METADATA — DINAMIK
═══════════════════════════════════════

Dinamik sahifalar uchun async funksiya ishlatiladi:

  export async function generateMetadata({
    params,
  }: {
    params: Promise<{ slug: string }>
  }): Promise<Metadata> {
    const { slug } = await params
    const post = await getPost(slug)
    return {
      title: post.title,
      description: post.excerpt,
      openGraph: { images: [post.coverImage] },
    }
  }

generateMetadata ichidagi fetch avtomatik memoizatsiya qilinadi — page.tsx dagi bir xil fetch takrorlanmaydi.

═══════════════════════════════════════
  TITLE TEMPLATE
═══════════════════════════════════════

Root layout-da title template aniqlash:

  // app/layout.tsx
  export const metadata: Metadata = {
    title: {
      template: '%s | Ketmonjon',   // %s — child title
      default: 'Ketmonjon',          // child title bo'lmasa
    },
  }

  // app/blog/page.tsx
  export const metadata = { title: 'Blog' }
  // Natija: "Blog | Ketmonjon"

═══════════════════════════════════════
  FAYL KONVENTSIYALARI
═══════════════════════════════════════

Next.js maxsus fayllarni avtomatik SEO uchun ishlatadi:

  app/
  ├── sitemap.ts          — XML sitemap generatsiyasi
  ├── robots.ts           — robots.txt generatsiyasi
  ├── manifest.ts         — PWA manifest
  ├── favicon.ico         — Favicon (fayl qo'yish yetarli)
  ├── icon.tsx            — Dinamik favicon
  ├── apple-icon.tsx      — Apple touch icon
  └── opengraph-image.tsx — Dinamik OG rasm

Bu fayllar .ts/.tsx bo'lsa — funksiya eksport qilinadi.
Oddiy .ico/.png bo'lsa — to'g'ridan-to'g'ri fayl sifatida xizmat qiladi.

═══════════════════════════════════════
  OG IMAGE GENERATSIYA
═══════════════════════════════════════

next/og yordamida dinamik OG rasmlar yaratish:

  ImageResponse JSX-dan PNG/SVG rasm generatsiya qiladi.
  Rasmlar build vaqtida yoki on-demand yaratiladi va keshlanadi.
  Google Fonts va boshqa shriftlarni yuklab ishlatish mumkin.

═══════════════════════════════════════
  JSON-LD STRUCTURED DATA
═══════════════════════════════════════

Google Rich Results uchun JSON-LD:

  <script type="application/ld+json"> tegini sahifa ichiga qo'shish.
  Next.js-da bu oddiy Server Component ichida amalga oshiriladi.
  Schema.org standarti bo'yicha: Article, Product, FAQ, BreadcrumbList.

MUHIM: JSON-LD Next.js-da maxsus API yo'q — oddiy script tegi ishlatiladi. Lekin tipizatsiya uchun schema-dts kutubxonasi foydali.`,
  codeExamples: [
    {
      title: 'generateMetadata — dinamik metadata',
      code: `// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import { getPost } from '@/lib/api'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug) // Request Memoization — takrorlanmaydi

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.createdAt,
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug) // Memoized — yuqoridagi bilan bitta
  return <article>{post.content}</article>
}`,
      language: 'tsx',
      description: 'Dinamik sahifa uchun async metadata generatsiyasi',
    },
    {
      title: 'sitemap.ts va robots.ts',
      code: `// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()

  const postUrls = posts.map((post) => ({
    url: \`https://ketmonjon.uz/blog/\${post.slug}\`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'https://ketmonjon.uz',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...postUrls,
  ]
}

// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: 'https://ketmonjon.uz/sitemap.xml',
  }
}`,
      language: 'tsx',
      description: 'SEO uchun sitemap va robots fayl konventsiyalari',
    },
    {
      title: 'OG Image generatsiya',
      code: `// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { getPost } from '@/lib/api'

export const runtime = 'edge'
export const alt = 'Blog post cover'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: 48,
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 'bold' }}>{post.title}</div>
        <div style={{ fontSize: 32, opacity: 0.8, marginTop: 16 }}>
          Ketmonjon Blog
        </div>
      </div>
    ),
    { ...size }
  )
}`,
      language: 'tsx',
      description: 'next/og bilan dinamik OG rasm yaratish',
    },
    {
      title: 'JSON-LD Structured Data',
      code: `// app/blog/[slug]/page.tsx
import { getPost } from '@/lib/api'

type JsonLd = {
  '@context': string
  '@type': string
  headline: string
  description: string
  datePublished: string
  author: { '@type': string; name: string }
  image: string
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  const jsonLd: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.createdAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    image: post.coverImage,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <h1>{post.title}</h1>
        <div>{post.content}</div>
      </article>
    </>
  )
}`,
      language: 'tsx',
      description: 'Google Rich Results uchun JSON-LD structured data',
    },
  ],
  interviewQA: [
    {
      question: 'generateMetadata va statik metadata export farqi nima?',
      answer: 'Statik metadata — oddiy const metadata eksport qilish, compile vaqtida ma\'lum bo\'lgan ma\'lumotlar uchun. generateMetadata — async funksiya, runtime da data fetch qilib metadata qaytaradi. Dinamik sahifalar ([slug]) uchun generateMetadata kerak. Muhim: generateMetadata ichidagi fetch Request Memoization orqali page.tsx dagi bir xil fetch bilan deduplikatsiya qilinadi.',
    },
    {
      question: 'Title template qanday ishlaydi?',
      answer: 'Root layout-da title: { template: "%s | Sayt nomi", default: "Sayt nomi" } aniqlansa, child sahifalar faqat title: "Sahifa" deb yozadi va natija "Sahifa | Sayt nomi" bo\'ladi. %s child title bilan almashtiriladi. Agar child metadata-da title bo\'lmasa, default ishlatiladi.',
    },
    {
      question: 'sitemap.ts qanday ishlaydi va nima uchun kerak?',
      answer: 'sitemap.ts app/ papkasida joylashadi va MetadataRoute.Sitemap tipidagi massiv qaytaradi. Next.js uni avtomatik /sitemap.xml URL-ga aylantiradi. Async bo\'lishi mumkin — DB dan URL larni olish imkoniyati. Google va boshqa qidiruv tizimlari uchun sayt tuzilmasini ko\'rsatadi. Katta saytlarda generateSitemaps() bilan bir nechta sitemap yaratish mumkin.',
    },
    {
      question: 'OG image generatsiya qanday amalga oshiriladi?',
      answer: 'opengraph-image.tsx fayl konventsiyasi orqali. next/og dan ImageResponse import qilinadi. JSX qabul qiladi va PNG rasm generatsiya qiladi. Edge runtime-da ishlaydi. Size va contentType eksport qilinadi. Har bir route segment o\'zining opengraph-image.tsx fayliga ega bo\'lishi mumkin. Rasmlar keshlanadi va on-demand generatsiya qilinadi.',
    },
    {
      question: 'JSON-LD ni Next.js da qanday qo\'shish kerak?',
      answer: 'Next.js-da JSON-LD uchun maxsus API yo\'q. Oddiy script tegi dangerouslySetInnerHTML bilan Server Component ichiga qo\'yiladi. Schema.org standarti ishlatiladi. Tipizatsiya uchun schema-dts kutubxonasi yoki o\'z tiplarini yaratish mumkin. Article, Product, FAQ, BreadcrumbList — eng ko\'p ishlatiladigan schema turlari.',
    },
  ],
  relatedTopics: [
    { techId: 'next-js', sectionId: 'nextjs-core', topicId: 'app-router', label: 'App Router' },
    { techId: 'next-js', sectionId: 'nextjs-patterns', topicId: 'caching', label: 'Caching' },
  ],
}
