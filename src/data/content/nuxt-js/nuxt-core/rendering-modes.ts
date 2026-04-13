import type { Topic } from '../../../types'

export const renderingModes: Topic = {
  id: 'rendering-modes',
  title: 'Rendering Modes',
  importance: 3,
  status: 'to-learn',
  description: 'SSR, SSG, ISR, SPA, hybrid rendering — har bir mode va qachon ishlatish',
  content: `Nuxt 3 bir nechta rendering mode-larni qo'llaydi — SSR, SSG, ISR, SPA. Eng muhimi — HYBRID rendering: har bir sahifaga alohida mode berish mumkin.

═══════════════════════════════════════
  SSR — SERVER-SIDE RENDERING
═══════════════════════════════════════

Har bir so'rov (request) da server HTML yaratadi va yuboradi.

Jarayon:
  1. Foydalanuvchi URL ga so'rov yuboradi
  2. Server Vue komponentlarni render qiladi
  3. Tayyor HTML klientga yuboriladi
  4. Brauzer HTML ni ko'rsatadi (tez!)
  5. JavaScript yuklanadi va "hydration" bo'ladi
  6. Sahifa interactive bo'ladi

Afzalliklar:
  - SEO — botlar tayyor HTML ko'radi
  - FCP (First Contentful Paint) — tez
  - Social media preview — meta taglar HTML da

Kamchiliklar:
  - TTFB (Time to First Byte) — server render kutadi
  - Server yuklamasi — har request da render
  - Murakkablik — server va client kodni ajratish

Nuxt-da SSR default mode:
  nuxt.config.ts da ssr: true (default)

═══════════════════════════════════════
  SSG — STATIC SITE GENERATION
═══════════════════════════════════════

Build vaqtida BARCHA sahifalar uchun HTML yaratiladi.
Server kerak emas — faqat CDN dan statik fayllar.

  npx nuxi generate

Jarayon:
  1. Build vaqtida Nuxt har bir route-ni render qiladi
  2. Har bir sahifa uchun .html fayl yaratiladi
  3. CDN ga deploy (Netlify, Vercel, Cloudflare Pages)
  4. So'rov kelganda — tayyor HTML qaytariladi (tez!)

Afzalliklar:
  - Eng tez — HTML tayyor, server render kerak emas
  - Arzon — server kerak emas, faqat CDN
  - Xavfsiz — server hujum yo'q (statik)
  - SEO — to'liq HTML

Kamchiliklar:
  - Dinamik ma'lumot eskiradi (build vaqtigacha)
  - Ko'p sahifali saytda build sekin
  - Personalizatsiya qiyin (hammaga bir xil HTML)

═══════════════════════════════════════
  ISR — INCREMENTAL STATIC REGENERATION
═══════════════════════════════════════

SSG + SSR aralashmasi. Sahifa statik, lekin vaqti-vaqti bilan yangilanadi.

  routeRules: {
    "/blog/**": {
      isr: 3600,  // 1 soatda 1 marta yangilash
    }
  }

Jarayon:
  1. Birinchi so'rov — server render qiladi va cache ga saqlaydi
  2. Keyingi so'rovlar — cache dan tayyor HTML
  3. TTL (time-to-live) o'tgandan keyin — background da yangilash
  4. Keyingi foydalanuvchi yangi versiyani ko'radi

Afzalliklar:
  - SSG tezligi + yangi ma'lumot
  - Server yuklamasi kam (cache)
  - Build butun saytni qayta qilish shart emas

MUHIM: ISR Next.js da mashhur bo'lgan. Nuxt 3 ham qo'llaydi
(Nitro server bilan). Vercel, Netlify, Cloudflare da ishlaydi.

═══════════════════════════════════════
  SPA — SINGLE PAGE APPLICATION
═══════════════════════════════════════

SSR yo'q — butun app klient tomonda render.
Oddiy Vue app kabi ishlaydi.

  nuxt.config.ts:
  export default defineNuxtConfig({
    ssr: false,
  })

Yoki faqat ayrim sahifalar uchun:
  routeRules: {
    "/admin/**": { ssr: false },
  }

Afzalliklar:
  - Oddiy — server rendering muammolari yo'q
  - Tez development — server/client farqlamaslik
  - Backend API bilan ishlash oson

Kamchiliklar:
  - SEO yomon — bot bo'sh HTML ko'radi
  - Sekin FCP — JavaScript yuklanguncha bo'sh sahifa
  - Bundle katta bo'lishi mumkin

Qachon SPA:
  - Admin panel (SEO kerak emas)
  - Ichki tool (public emas)
  - PWA (offline)

═══════════════════════════════════════
  HYBRID RENDERING — ROUTE RULES
═══════════════════════════════════════

Nuxt 3 ning ENG KUCHLI xususiyati — har bir sahifaga ALOHIDA mode.
routeRules bilan konfiguratsiya:

  export default defineNuxtConfig({
    routeRules: {
      // SSG — build vaqtida generate
      "/": { prerender: true },
      "/about": { prerender: true },

      // ISR — cache + background yangilash
      "/blog/**": { isr: 3600 },
      "/products/**": { isr: 600 },

      // SPA — faqat klient
      "/admin/**": { ssr: false },
      "/dashboard/**": { ssr: false },

      // SSR — har request da server render (default)
      "/search/**": { /* default SSR */ },

      // Headers va cache
      "/api/**": { cors: true },
      "/_nuxt/**": { headers: { "cache-control": "max-age=31536000" } },
    },
  })

MUHIM: Hybrid rendering — Nuxt-ning Next.js dan ustunligi.
Next.js da ham bor (App Router), lekin Nuxt-da aniqroq API.

═══════════════════════════════════════
  EDGE RENDERING
═══════════════════════════════════════

SSR foydalanuvchiga YAQIN serverda ishlaydi (CDN edge).

  - Cloudflare Workers
  - Vercel Edge Functions
  - Netlify Edge Functions

Afzalliklar:
  - Latency juda past (foydalanuvchiga yaqin)
  - Cold start tez (lightweight runtime)
  - Global — butun dunyo bo'ylab

Cheklovlar:
  - Node.js API to'liq emas (fs, child_process yo'q)
  - Database ulanish cheklangan
  - Bundle hajmi limiti

Nuxt Nitro preset bilan:
  NITRO_PRESET=cloudflare-pages npx nuxi build

═══════════════════════════════════════
  QAYSI MODE-NI QACHON ISHLATISH
═══════════════════════════════════════

  SSR  — dinamik, SEO kerak (e-commerce, blog, SaaS)
  SSG  — statik, kam o'zgaradi (landing, docs, portfolio)
  ISR  — o'rtacha dinamik (blog, catalog — soatlik yangilash)
  SPA  — SEO kerak emas (admin, dashboard, internal tool)
  Edge — global auditoriya, tez javob vaqti kerak`,
  codeExamples: [
    {
      title: 'Hybrid rendering — routeRules konfiguratsiya',
      language: 'ts',
      code: `// nuxt.config.ts — har sahifaga alohida rendering mode
export default defineNuxtConfig({
  routeRules: {
    // ═══ SSG — build vaqtida HTML generate ═══
    "/": { prerender: true },
    "/about": { prerender: true },
    "/pricing": { prerender: true },

    // ═══ ISR — cache + background regeneration ═══
    "/blog/**": {
      isr: 3600,      // 1 soat cache
    },
    "/products/**": {
      isr: 600,        // 10 minut cache
    },
    "/categories/**": {
      swr: 86400,      // Stale-while-revalidate, 1 kun
    },

    // ═══ SPA — client-only rendering ═══
    "/admin/**": {
      ssr: false,      // SSR o'chirilgan
    },
    "/dashboard/**": {
      ssr: false,
    },

    // ═══ SSR — default (har request da server render) ═══
    "/search": { /* SSR default */ },
    "/profile": { /* SSR default */ },

    // ═══ API va static asset cache ═══
    "/api/**": {
      cors: true,
      headers: { "access-control-allow-methods": "GET,POST,PUT,DELETE" },
    },
    "/_nuxt/**": {
      headers: { "cache-control": "public, max-age=31536000, immutable" },
    },
  },
})`,
      description: 'routeRules bilan har sahifaga alohida mode: prerender, isr, ssr:false. Nuxt ning eng kuchli xususiyati.',
    },
    {
      title: 'SSR sahifa — server-side data fetching',
      language: 'ts',
      code: `// pages/products/[id].vue — SSR mode (default)
// <script setup lang="ts">
interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
}

const route = useRoute()

// SSR: server tomonda fetch bo'ladi
// Klient tayyor HTML oladi (SEO uchun yaxshi)
const { data: product, error } = await useFetch<Product>(
  "/api/products/" + route.params.id
)

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Mahsulot topilmadi",
  })
}

// SEO — meta taglar (SSR da HTML ga tushadi)
useHead({
  title: product.value?.name,
  meta: [
    { name: "description", content: product.value?.description },
    { property: "og:title", content: product.value?.name },
    { property: "og:image", content: product.value?.image },
  ],
})

// SSR jarayoni:
// 1. Server: fetch("/api/products/42") -> HTML render
// 2. Klient: tayyor HTML ko'radi (tez!)
// 3. Hydration: JavaScript yuklangach interactive
// 4. Qayta fetch YO'Q — payload dan oladi
// </script>

// <template>
//   <div v-if="product" class="product">
//     <img :src="product.image" :alt="product.name" />
//     <h1>{{ product.name }}</h1>
//     <p class="price">{{ product.price }} so'm</p>
//     <p>{{ product.description }}</p>
//   </div>
// </template>`,
      description: 'SSR: server render + SEO meta taglar. useFetch server da ishlaydi, klient qayta fetch qilmaydi.',
    },
    {
      title: 'SSG — statik sahifa generate',
      language: 'ts',
      code: `// nuxt.config.ts
export default defineNuxtConfig({
  // Butun sayt SSG
  // npx nuxi generate -> .output/public/ da statik fayllar

  routeRules: {
    // Yoki faqat ayrim sahifalar SSG
    "/blog/**": { prerender: true },
  },

  // Dinamik route-larni ham generate qilish
  nitro: {
    prerender: {
      routes: ["/blog/post-1", "/blog/post-2"],
      // Yoki crawl qilish
      crawlLinks: true,
    },
  },
})


// pages/blog/[slug].vue — SSG sahifa
// <script setup lang="ts">
interface Post {
  slug: string
  title: string
  content: string
  date: string
}

const route = useRoute()

// Build vaqtida FAQAT 1 MARTA ishlaydi
// Natija .html faylga yoziladi
const { data: post } = await useFetch<Post>(
  "/api/blog/" + route.params.slug
)

useHead({
  title: post.value?.title,
})
// </script>

// <template>
//   <article v-if="post">
//     <h1>{{ post.title }}</h1>
//     <time>{{ post.date }}</time>
//     <div v-html="post.content" />
//   </article>
// </template>


// Terminal:
// npx nuxi generate
// Natija: .output/public/blog/post-1/index.html
//         .output/public/blog/post-2/index.html
// Deploy: Netlify, Vercel, GitHub Pages — server kerak emas!`,
      description: 'SSG: build vaqtida HTML. npx nuxi generate. CDN ga deploy — server kerak emas.',
    },
    {
      title: 'SPA mode va client-only rendering',
      language: 'ts',
      code: `// pages/admin/dashboard.vue — SPA mode
// <script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "auth",
})

// server: false — faqat klient tomonda fetch
const { data: stats, pending } = useLazyFetch("/api/admin/stats", {
  server: false, // SSR da fetch qilinmaydi
})
// </script>

// <template>
//   <div>
//     <h1>Admin Dashboard</h1>
//     <div v-if="pending">Yuklanmoqda...</div>
//     <div v-else>
//       <p>Foydalanuvchilar: {{ stats?.users }}</p>
//       <p>Buyurtmalar: {{ stats?.orders }}</p>
//     </div>
//   </div>
// </template>


// <ClientOnly> — faqat klientda render
// <template>
//   <div>
//     <ClientOnly>
//       <BrowserOnlyChart :data="chartData" />
//       <template #fallback>
//         <div class="skeleton-chart" />
//       </template>
//     </ClientOnly>
//   </div>
// </template>


// Butun sahifani SPA qilish:
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    "/admin/**": { ssr: false },
  },
})

// Yoki BUTUN loyiha SPA:
// export default defineNuxtConfig({
//   ssr: false,
// })

// Foydalanish holati:
// - Admin panel (SEO kerak emas)
// - Dashboard (ichki foydalanish)
// - Browser API kerak (canvas, WebGL, localStorage)`,
      description: 'SPA mode: ssr:false. ClientOnly komponenti. Admin, dashboard uchun ideal.',
    },
  ],
  interviewQA: [
    {
      question: 'SSR, SSG, ISR, SPA farqlarini tushuntiring.',
      answer: `SSR — har request da server HTML render qiladi. SEO yaxshi, lekin server kerak va TTFB sekin. SSG — build vaqtida barcha HTML yaratiladi. Eng tez, server kerak emas, lekin ma'lumot build vaqtigacha eski. ISR — SSG + background yangilash. Statik tezlik + yangi data. TTL (masalan 1 soat) o'tgach serverda qayta render. SPA — hammasi klientda. JavaScript yuklanguncha bo'sh sahifa, SEO yomon, lekin server kerak emas va development oson. Har biri o'z o'rnida.`,
    },
    {
      question: 'Hybrid rendering nima va nima uchun muhim?',
      answer: `Hybrid rendering — bitta loyihada har sahifaga alohida rendering mode berish. Nuxt routeRules bilan: bosh sahifa SSG (tez), blog ISR (yangilanib turadi), search SSR (dinamik), admin SPA (SEO kerak emas). Bu juda muhim chunki real loyihada barcha sahifalar bir xil emas — ba'zilari statik, ba'zilari dinamik, ba'zilari faqat auth bilan. routeRules bilan bitta config da barcha mode-larni aralashtirib ishlatish mumkin.`,
    },
    {
      question: 'SSR da hydration nima? Hydration mismatch nima?',
      answer: `Hydration — server tomondan kelgan statik HTML-ga JavaScript interaktivlik qo'shish jarayoni. Server HTML render qiladi, klient uni oladi va ko'rsatadi (tez). Keyin JavaScript yuklanadi va Vue komponent daraxtini yaratadi. Vue server HTML bilan o'z virtual DOM-ini taqqoslaydi va event listener-larni ulaydi. Hydration mismatch — server va klient HTML bir xil bo'lmasa. Masalan: Date.now(), Math.random(), window.innerWidth — server va klientda farq qiladi. ClientOnly yoki onMounted ichida ishlatish kerak.`,
    },
    {
      question: 'ISR qanday ishlaydi? SSG dan farqi nima?',
      answer: `SSG — build vaqtida 1 marta HTML yaratiladi, to'liq static. ISR — birinchi so'rovda server render + cache. Keyingi so'rovlar cache dan (tez). TTL o'tgandan keyin background da qayta render. Foydalanuvchi eski versiyani ko'radi, keyingisi yangi versiyani. Bu "stale-while-revalidate" pattern. Nuxt-da routeRules: { isr: 3600 } — 1 soat cache. ISR afzalligi — deploy siz kontent yangilanadi. SSG da har o'zgarish uchun qayta build kerak.`,
    },
    {
      question: 'Edge rendering nima va oddiy SSR dan farqi?',
      answer: `Oddiy SSR — bitta server (bir regionda). Edge rendering — foydalanuvchiga yaqin CDN node da server render. Cloudflare Workers, Vercel Edge, Deno Deploy. Afzallik: latency juda past (global), cold start tez (lightweight runtime). Cheklov: Node.js API to'liq emas (fs, child_process yo'q), database ulanish murakkab (connection pooling kerak), bundle limiti bor. Nuxt Nitro orqali har xil preset-larga deploy: cloudflare-pages, vercel-edge, netlify-edge.`,
    },
    {
      question: 'Nuxt rendering modes va Next.js-ni taqqoslang.',
      answer: `SSR: ikkalasida default. SSG: Nuxt prerender + nuxi generate, Next.js generateStaticParams. ISR: ikkalasida bor — Nuxt routeRules { isr: N }, Next.js revalidate. SPA: Nuxt ssr:false, Next.js "use client" + dynamic(ssr:false). Hybrid: ikkalasida route-level konfiguratsiya. Farq: Next.js Server Components bor (komponent server da render, JS klientga yuborilmaydi) — Nuxt-da hali yo'q. Nuxt-da routeRules aniqroq API. Next.js App Router + RSC yangi paradigma, Nuxt klassik SSR/SSG da yetuk.`,
    },
  ],
  relatedTopics: [
    { techId: 'nuxt-js', sectionId: 'nuxt-core', topicId: 'data-fetching', label: 'Data Fetching' },
    { techId: 'nuxt-js', sectionId: 'nuxt-core', topicId: 'nuxt-intro', label: 'Nuxt 3 Kirish' },
    { techId: 'react-js', sectionId: 'theory-questions', topicId: 'ssr-csr-ssg', label: 'SSR vs CSR vs SSG' },
    { techId: 'react-js', sectionId: 'theory-questions', topicId: 'hydration', label: 'Hydration' },
  ],
}
