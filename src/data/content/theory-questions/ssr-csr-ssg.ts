import type { Topic } from '../../types'

export const ssrCsrSsg: Topic = {
    id: 'ssr-csr-ssg',
    title: 'SSR vs CSR vs SSG',
    importance: 3,
    status: 'to-learn',
    description: 'Farqlari, qachon nima ishlatiladi',
    content: `Rendering strategiyalari — HTML QAYERDA va QACHON yaratiladi. Har birining o'z afzalligi va kamchiligi bor.

═══════════════════════════════════════
  CSR — CLIENT-SIDE RENDERING
═══════════════════════════════════════

Brauzer JavaScript-ni yuklab, HTML-ni BRAUZERDA yaratadi.

  1. Server bo'sh HTML yuboradi (<div id="root"></div>)
  2. JS bundle yuklanadi (500KB+)
  3. React ishlaydi → DOM yaratadi
  4. Foydalanuvchi kontentni ko'radi

  ✅ Tez navigatsiya (SPA — sahifa qayta yuklanmaydi)
  ✅ Rich interactivity
  ✅ Server yuki kam
  ✅ Sodda deploy (static hosting)

  ❌ LCP sekin (JS yuklanguncha bo'sh sahifa)
  ❌ SEO muammo (bot bo'sh HTML ko'radi)
  ❌ Katta JS bundle

Qachon: dashboard, admin panel, SaaS ilova (SEO muhim emas).

═══════════════════════════════════════
  SSR — SERVER-SIDE RENDERING
═══════════════════════════════════════

Server HAR SO'ROVDA HTML yaratib yuboradi.

  1. Server React komponentni HTML-ga aylantiradi
  2. Tayyor HTML brauzerga yuboriladi
  3. Foydalanuvchi kontentni DARHOL ko'radi
  4. JS yuklanadi → hydration → interaktiv bo'ladi

  ✅ Tez LCP (HTML darhol ko'rinadi)
  ✅ SEO yaxshi (bot tayyor HTML ko'radi)
  ✅ Social media preview ishlaydi

  ❌ Server yuki katta (har so'rovda render)
  ❌ TTFB sekin (server render vaqti)
  ❌ Hydration vaqtida interaktivlik yo'q
  ❌ Server infra kerak

Qachon: e-commerce, blog, marketing sahifa (SEO muhim).

═══════════════════════════════════════
  SSG — STATIC SITE GENERATION
═══════════════════════════════════════

BUILD VAQTIDA HTML yaratiladi (deploy oldin).

  1. Build vaqtida barcha sahifalar HTML-ga aylantiriladi
  2. Tayyor HTML CDN-ga qo'yiladi
  3. Foydalanuvchi CDN-dan DARHOL oladi

  ✅ Eng tez (CDN-dan static fayl)
  ✅ SEO yaxshi
  ✅ Server yuki YO'Q
  ✅ Arzon (static hosting)

  ❌ Build vaqtida ma'lumot kerak (dynamic emas)
  ❌ Har o'zgarishda qayta build kerak
  ❌ Ko'p sahifa = uzoq build

Qachon: blog, dokumentatsiya, portfolio (kamdan-kam o'zgaradigan kontent).

═══════════════════════════════════════
  ISR — INCREMENTAL STATIC REGENERATION
═══════════════════════════════════════

SSG + SSR aralashmasi (Next.js):
  - Birinchi so'rov — static HTML (SSG kabi)
  - Belgilangan vaqtda background-da qayta build
  - Yangi versiya tayyor bo'lganda almashtiradi

  ✅ Static tezlik
  ✅ Yangi data (revalidate bilan)
  ✅ Server yuki kam

Qachon: e-commerce katalog, news, blog (tez-tez yangilanadigan static kontent).`,
    codeExamples: [
      {
        title: 'CSR vs SSR vs SSG — farq',
        language: 'tsx',
        code: `// ===== CSR (Vite + React) =====
// Server yuboradi:
// <html><body><div id="root"></div><script src="app.js"></script></body></html>
// Brauzer app.js yuklaydi → React DOM yaratadi

// Vite + React = CSR (bu loyiha)
// index.html → main.tsx → App → Router → Pages

// ===== SSR (Next.js) =====
// pages/users.tsx (Pages Router)
export async function getServerSideProps() {
  const res = await fetch('https://api.example.com/users')
  const users = await res.json()
  return { props: { users } }  // HAR SO'ROVDA server-da
}

export default function UsersPage({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  )
}
// Server tayyor HTML yuboradi → brauzer hydrate qiladi

// ===== SSG (Next.js) =====
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()
  return {
    props: { posts },
    revalidate: 60,  // ISR: 60 sekundda qayta build
  }
}

export default function BlogPage({ posts }: { posts: Post[] }) {
  return (
    <div>
      {posts.map(p => <article key={p.id}><h2>{p.title}</h2></article>)}
    </div>
  )
}
// BUILD vaqtida HTML yaratiladi → CDN-dan xizmat qilinadi

// ===== Taqqoslash =====
// CSR:  [] → [JS yuklash] → [Render] → [Ko'rish]     (sekin FCP)
// SSR:  [Server render] → [Ko'rish] → [JS] → [Hydrate] (tez FCP)
// SSG:  [CDN] → [Ko'rish] → [JS] → [Hydrate]           (eng tez)`,
        description: 'CSR: brauzer render (SPA). SSR: server har so\'rovda render (getServerSideProps). SSG: build vaqtida render (getStaticProps). ISR: SSG + revalidate.',
      },
    ],
    interviewQA: [
      {
        question: 'CSR, SSR, SSG farqi nima?',
        answer: `CSR — brauzer JS yuklaydi va render qiladi. Tez navigatsiya, lekin sekin initial load, SEO yomon. SSR — server HAR SO'ROVDA HTML yaratadi. Tez FCP, yaxshi SEO, lekin server yuki katta. SSG — BUILD vaqtida HTML yaratiladi, CDN-dan xizmat. Eng tez, lekin dynamic emas. ISR — SSG + background revalidation. Qoida: SEO kerak + dynamic → SSR. SEO kerak + static → SSG. SEO kerak emas → CSR.`,
      },
      {
        question: 'SPA (CSR) da SEO muammosi nima?',
        answer: `SPA server-dan bo'sh HTML oladi (<div id="root"></div>). Google bot JS ishga tushirsa ham — VAQT KERAK. Boshqa botlar (Facebook, Twitter) JS ishga tushirMAYDI — social media preview ishlaMAYDI. Yechimlar: 1) SSR — server tayyor HTML beradi, 2) SSG — build vaqtida HTML, 3) Prerendering — maxsus bot uchun static HTML, 4) Dynamic rendering — bot uchun SSR, user uchun CSR. Ko'p SPA-lar uchun SSR/SSG shart emas — dashboard, admin panel SEO kerak emas.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'theory-questions', topicId: 'hydration', label: 'Hydration' },
      { sectionId: 'theory-questions', topicId: 'server-components', label: 'Server Components' },
      { sectionId: 'performance', topicId: 'web-vitals', label: 'Core Web Vitals' },
    ],
  }
