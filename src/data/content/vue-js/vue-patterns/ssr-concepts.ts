import type { Topic } from '../../../types'

export const ssrConcepts: Topic = {
  id: 'ssr-concepts',
  title: 'SSR Concepts',
  importance: 2,
  status: 'to-learn',
  description: 'Server-Side Rendering — CSR vs SSR vs SSG vs ISR, hydration, Nuxt',
  content: `Server-Side Rendering (SSR) — sahifani serverda HTML sifatida render qilish va clientga tayyor HTML yuborish. Bu SEO, performance va foydalanuvchi tajribasini yaxshilaydi.

═══════════════════════════════════════
  CSR VS SSR VS SSG VS ISR
═══════════════════════════════════════

CSR (Client-Side Rendering):
  - Brauzer bo'sh HTML oladi + JavaScript bundle
  - JS yuklanib, render qiladi
  - Birinchi ko'rinish sekin (FCP yuqori)
  - SEO uchun yomon (crawler bo'sh sahifa ko'radi)
  - SPA-lar default holatda CSR

SSR (Server-Side Rendering):
  - Server har bir so'rovda sahifani HTML qilib render qiladi
  - Client tayyor HTML oladi → tez ko'rinish
  - Keyin JS yuklanib "hydration" bo'ladi
  - SEO uchun yaxshi
  - Server yuklamasi oshadi

SSG (Static Site Generation):
  - BUILD vaqtida barcha sahifalar HTML qilib yaratiladi
  - CDN dan statik fayl sifatida beriladi
  - Eng tez variant — server render yo'q
  - Dinamik kontent uchun yaramaydi
  - Blog, docs, marketing saytlar uchun ideal

ISR (Incremental Static Regeneration):
  - SSG + qayta generatsiya
  - Build vaqtida statik yaratiladi
  - So'rov kelganda vaqti o'tgan sahifa background da qayta yaratiladi
  - SSG tezligi + dinamik yangilanish
  - Nuxt da routeRules bilan sozlanadi

═══════════════════════════════════════
  HYDRATION
═══════════════════════════════════════

Hydration — serverda render qilingan statik HTML ga client da interaktivlik qo'shish jarayoni.

Qanday ishlaydi:
  1. Server HTML render qiladi va clientga yuboradi
  2. Brauzer HTML ni ko'rsatadi (tez — JS kutmaydi)
  3. JavaScript yuklanadi
  4. Vue mavjud DOM ni "egallaydi" — event listener qo'shadi
  5. Sahifa interaktiv bo'ladi

Hydration mismatch — server va client HTML FARQ qilganda:
  - Server: <div>2024-01-15</div>
  - Client: <div>2024-01-16</div> (vaqt zonasi farqi)
  Vue ogohlantirish beradi va client versiyasini ishlatadi.

Mismatch sabablari:
  1. Date/time — server va client vaqti farq qiladi
  2. Math.random() — har safar boshqacha
  3. Browser-only API — window, localStorage server da yo'q
  4. v-if bilan browser check — server da false, client da true

Yechimlar:
  - <ClientOnly> komponent (Nuxt)
  - onMounted da browser-only logika
  - useId() bilan barqaror ID generatsiya

═══════════════════════════════════════
  UNIVERSAL KOD QOIDALARI
═══════════════════════════════════════

Universal kod — server VA client da ishlaydigan kod.

MUMKIN EMAS serverda:
  - window, document, navigator — browser API
  - localStorage, sessionStorage — browser storage
  - DOM manipulyatsiya — document.querySelector
  - Browser eventlar — click, scroll

YECHIM:
  - onMounted ichida ishlatish (faqat client da ishlaydi)
  - typeof window !== "undefined" tekshirish
  - import.meta.client / import.meta.server (Nuxt)
  - <ClientOnly> komponent bilan o'rash

Side-effectlar:
  - setInterval/setTimeout — server da memory leak
  - Global state mutatsiya — so'rovlar aralashtiradi
  - Har bir so'rov uchun yangi app instance kerak

═══════════════════════════════════════
  VUE SSR API
═══════════════════════════════════════

Vue o'zi SSR uchun API beradi:

  // Server (Node.js)
  import { createSSRApp } from "vue"
  import { renderToString } from "vue/server-renderer"

  const app = createSSRApp(App)
  const html = await renderToString(app)

  // Client
  import { createSSRApp } from "vue"

  const app = createSSRApp(App)
  app.mount("#app")  // Hydration — mavjud DOM ni egallaydi

createSSRApp vs createApp:
  - createSSRApp — hydration rejimida mount qiladi
  - createApp — butunlay yangi DOM yaratadi

Amalda Vue SSR API to'g'ridan-to'g'ri ishlatilmaydi —
Nuxt framework bularni avtomatik boshqaradi.

═══════════════════════════════════════
  NUXT — NIMA UCHUN KERAK
═══════════════════════════════════════

Nuxt — Vue uchun meta-framework. SSR, SSG, ISR ni osonlashtiradi.

Nuxt nima beradi:
  1. File-based routing — pages/ papka tuzilmasi = route
  2. Auto imports — komponentlar, composable lar avtomatik
  3. SSR/SSG/ISR — routeRules bilan sahifama-sahifa sozlash
  4. Server API — server/ papka da backend endpoint
  5. SEO — useHead(), useSeoMeta() hooklar
  6. Middleware — route himoyasi
  7. Nitro server — universal deployment

Nuxt rendering rejimlar (routeRules):
  ssr: true      — har so'rovda SSR
  ssr: false     — faqat CSR (SPA)
  prerender: true — build da SSG
  isr: 3600      — ISR (1 soat cache)

═══════════════════════════════════════
  SEO VA PERFORMANCE
═══════════════════════════════════════

SSR ning SEO afzalliklari:
  - Crawler tayyor HTML oladi
  - Meta teglar server da render qilinadi
  - Open Graph tasvirlar to'g'ri ishlaydi
  - Indeksatsiya kafolatli

Performance ko'rsatkichlari:
  - FCP (First Contentful Paint) — SSR da tezroq
  - TTI (Time to Interactive) — hydration vaqtiga bog'liq
  - TTFB (Time to First Byte) — SSR da sekinroq (server render vaqti)
  - LCP (Largest Contentful Paint) — SSR da tezroq

Qachon SSR kerak:
  - SEO muhim (blog, e-commerce, marketing)
  - Birinchi yuklanish tezligi muhim
  - Social media preview kerak (OG tags)

Qachon CSR yetarli:
  - Auth ortidagi dashboard
  - Admin panel
  - Ichki korporativ ilovalar

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

  Konsept         | Vue / Nuxt           | React / Next.js
  ────────────────|──────────────────────|──────────────────
  Meta-framework  | Nuxt 3               | Next.js 14+
  SSR API         | createSSRApp         | renderToString (react-dom/server)
  Hydration       | createSSRApp+mount   | hydrateRoot
  SSG             | nuxt generate        | next export / getStaticProps
  ISR             | routeRules isr       | revalidate prop
  File routing    | pages/               | app/ (App Router)
  Server comp.    | Yo'q (hali)          | React Server Components
  Streaming       | renderToWebStream    | renderToPipeableStream

React Server Components — bu React-ning katta afzalligi.
Komponent serverda render bo'lib, JavaScript client ga yuborilMAYDI.
Vue da hozircha buning analogi yo'q — Nuxt Server Components eksperimental.`,
  codeExamples: [
    {
      title: 'Vue SSR API — asosiy tuzilma',
      language: 'ts',
      code: `// ═══ SERVER (entry-server.ts) ═══
import { createSSRApp } from "vue"
import { renderToString } from "vue/server-renderer"
import App from "./App.vue"

export async function render() {
  // Har bir so'rov uchun YANGI app instance
  // (aks holda so'rovlar state ni aralashtiradi)
  const app = createSSRApp(App)

  // Pinia, Router qo'shish
  // const pinia = createPinia()
  // app.use(pinia)

  const html = await renderToString(app)
  return html
}


// ═══ CLIENT (entry-client.ts) ═══
import { createSSRApp } from "vue"
import App from "./App.vue"

const app = createSSRApp(App)

// HYDRATION — mavjud server HTML ni "egallaydi"
// createApp emas, createSSRApp ishlatiladi!
app.mount("#app")


// ═══ NODE.JS SERVER ═══
// import express from "express"
// import { render } from "./entry-server"
//
// const app = express()
// app.get("*", async (req, res) => {
//   const html = await render()
//   res.send(\`
//     <!DOCTYPE html>
//     <html>
//       <body>
//         <div id="app">\${html}</div>
//         <script src="/entry-client.js"></script>
//       </body>
//     </html>
//   \`)
// })`,
      description: 'Vue SSR: server da renderToString, client da createSSRApp + mount (hydration).',
    },
    {
      title: 'Hydration mismatch va yechimlar',
      language: 'html',
      code: `<!-- MUAMMO: Hydration mismatch -->
<script setup lang="ts">
import { ref } from "vue"

// NOTO'G'RI — server va client da farq qiladi
const now = ref(new Date().toLocaleString())
// Server: "1/15/2024, 10:00:00 AM" (UTC)
// Client: "1/15/2024, 3:00:00 PM" (UTC+5)
// Vue WARNING: Hydration mismatch!
</script>

<template>
  <!-- Bu xato beradi -->
  <p>{{ now }}</p>
</template>


<!-- YECHIM 1: onMounted da o'rnatish -->
<script setup lang="ts">
import { ref, onMounted } from "vue"

const now = ref("")  // Bo'sh boshlash

onMounted(() => {
  // Faqat CLIENT da ishlaydi — mismatch yo'q
  now.value = new Date().toLocaleString()
})
</script>

<template>
  <p>{{ now }}</p>
</template>


<!-- YECHIM 2: Nuxt <ClientOnly> -->
<!-- <ClientOnly>
  <BrowserOnlyWidget />
  <template #fallback>
    <p>Yuklanmoqda...</p>
  </template>
</ClientOnly> -->


<!-- YECHIM 3: import.meta.client (Nuxt) -->
<script setup lang="ts">
import { ref, onMounted } from "vue"

const windowWidth = ref(0)

// Nuxt maxsus check
if (import.meta.client) {
  windowWidth.value = window.innerWidth
}
</script>`,
      description: 'Hydration mismatch sabablari va uchta yechim: onMounted, ClientOnly, import.meta.client.',
    },
    {
      title: 'Nuxt 3 — rendering rejimlar',
      language: 'ts',
      code: `// nuxt.config.ts — sahifama-sahifa rendering rejimi
export default defineNuxtConfig({
  // Global SSR yoqish
  ssr: true,

  // Sahifama-sahifa sozlash
  routeRules: {
    // SSG — build vaqtida statik generatsiya
    "/": { prerender: true },
    "/about": { prerender: true },
    "/blog/**": { prerender: true },

    // ISR — 1 soat cache, keyin background da yangilanadi
    "/products/**": { isr: 3600 },

    // CSR — faqat client rendering (SPA)
    "/dashboard/**": { ssr: false },
    "/admin/**": { ssr: false },

    // SSR — har so'rovda server render (default)
    "/search": { ssr: true },

    // Cache headers
    "/api/**": {
      headers: { "cache-control": "max-age=60" },
    },
  },

  // Nuxt nitro — deployment target
  nitro: {
    preset: "node-server", // yoki "vercel", "cloudflare", "netlify"
  },
})


// pages/blog/[slug].vue — SSG sahifa
// <script setup>
// const route = useRoute()
// const { data: post } = await useFetch(
//   \`/api/posts/\${route.params.slug}\`
// )
// // Build vaqtida fetch bo'ladi — statik HTML
// </script>`,
      description: 'Nuxt routeRules: bitta loyihada SSR, SSG, ISR, CSR aralashtirish mumkin.',
    },
    {
      title: 'Universal kod — server va client farqi',
      language: 'ts',
      code: `// ═══ MUAMMO: server da window yo'q ═══

// NOTO'G'RI — server da crash qiladi
// const width = window.innerWidth
// const token = localStorage.getItem("token")


// ═══ YECHIM 1: onMounted (Composition API) ═══
import { ref, onMounted } from "vue"

const width = ref(0)
const token = ref("")

onMounted(() => {
  // Bu faqat CLIENT da ishlaydi
  width.value = window.innerWidth
  token.value = localStorage.getItem("token") ?? ""

  window.addEventListener("resize", () => {
    width.value = window.innerWidth
  })
})


// ═══ YECHIM 2: typeof check ═══
const isClient = typeof window !== "undefined"

function getStoredTheme(): string {
  if (isClient) {
    return localStorage.getItem("theme") ?? "light"
  }
  return "light" // Server default
}


// ═══ YECHIM 3: Composable pattern ═══
// composables/useWindowSize.ts
export function useWindowSize() {
  const width = ref(0)
  const height = ref(0)

  // Server da hech narsa qilmaydi
  if (typeof window === "undefined") {
    return { width, height }
  }

  // Client da event listener
  function update() {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  onMounted(() => {
    update()
    window.addEventListener("resize", update)
  })

  onUnmounted(() => {
    window.removeEventListener("resize", update)
  })

  return { width, height }
}`,
      description: 'Universal kodda browser API faqat onMounted ichida yoki typeof window check bilan ishlatiladi.',
    },
    {
      title: 'SEO — Nuxt useHead va useSeoMeta',
      language: 'ts',
      code: `// pages/blog/[slug].vue — SEO meta teglar
// <script setup lang="ts">
// const route = useRoute()
// const { data: post } = await useFetch(
//   \`/api/posts/\${route.params.slug}\`
// )

// useHead — HTML head boshqarish
// useHead({
//   title: post.value?.title,
//   meta: [
//     { name: "description", content: post.value?.excerpt },
//   ],
//   link: [
//     { rel: "canonical", href: \`https://site.com/blog/\${route.params.slug}\` },
//   ],
// })

// useSeoMeta — qulay SEO shorthand
// useSeoMeta({
//   title: post.value?.title,
//   description: post.value?.excerpt,
//   ogTitle: post.value?.title,
//   ogDescription: post.value?.excerpt,
//   ogImage: post.value?.coverImage,
//   ogType: "article",
//   twitterCard: "summary_large_image",
//   twitterTitle: post.value?.title,
//   twitterDescription: post.value?.excerpt,
//   twitterImage: post.value?.coverImage,
// })
// </script>

// <template>
//   <article v-if="post">
//     <h1>{{ post.title }}</h1>
//     <p>{{ post.body }}</p>
//   </article>
// </template>


// React / Next.js ekvivalenti:
// export async function generateMetadata({ params }) {
//   const post = await getPost(params.slug)
//   return {
//     title: post.title,
//     description: post.excerpt,
//     openGraph: { title: post.title, images: [post.coverImage] },
//   }
// }`,
      description: 'Nuxt useHead va useSeoMeta — SSR da meta teglar server HTML ga tushadi.',
    },
  ],
  interviewQA: [
    {
      question: 'CSR, SSR, SSG va ISR farqini tushuntiring.',
      answer: `CSR — brauzer bo'sh HTML + JS oladi, JS render qiladi. Tez navigatsiya, lekin birinchi ko'rinish sekin va SEO yomon. SSR — server har so'rovda HTML render qiladi, client tayyor sahifa oladi, keyin hydration bo'ladi. SEO yaxshi, birinchi ko'rinish tez, lekin server yuklamasi oshadi. SSG — BUILD vaqtida barcha sahifalar statik HTML qilib yaratiladi. CDN dan beriladi, eng tez, lekin dinamik kontent uchun yaramaydi. ISR — SSG + background regeneratsiya. Statik sahifa cache muddati o'tganda yangilanadi. SSG tezligi + dinamik yangilanish. Nuxt da routeRules bilan sahifama-sahifa rendering rejimi tanlanadi.`,
    },
    {
      question: 'Hydration nima va hydration mismatch qachon sodir bo`ladi?',
      answer: `Hydration — serverda render qilingan statik HTML ga clientda Vue interaktivlik qo'shish jarayoni. Server HTML yuboradi, brauzer ko'rsatadi (tez), keyin JS yuklanadi va Vue mavjud DOM ni "egallaydi" — event listener qo'shadi. Hydration mismatch — server va client HTML farq qilganda sodir bo'ladi. Sabablari: 1) Date/time farqi (vaqt zona), 2) Math.random(), 3) Browser-only API (window, localStorage), 4) v-if bilan brauzer check. Yechimlar: onMounted da browser-only logika, Nuxt <ClientOnly> komponent, import.meta.client tekshiruvi.`,
    },
    {
      question: 'Nuxt nima uchun kerak, Vue SSR API yetarli emasmi?',
      answer: `Vue SSR API (createSSRApp, renderToString) past darajali API — to'g'ridan-to'g'ri ishlatish murakkab: server sozlash, code splitting, data fetching, routing integratsiya — hammasini qo'lda qilish kerak. Nuxt bularni avtomatik boshqaradi va qo'shimcha beradi: file-based routing (pages/), auto imports, routeRules (SSR/SSG/ISR/CSR sahifama-sahifa), server API (server/ papka), SEO hooklar (useHead, useSeoMeta), middleware, Nitro universal server. Bu xuddi React uchun Next.js kerakligidek — meta-framework murakkablikni yashiradi.`,
    },
    {
      question: 'Universal kodda qanday qoidalarga rioya qilish kerak?',
      answer: `Universal kod server VA client da ishlaydi, shuning uchun: 1) Browser API (window, document, localStorage) to'g'ridan-to'g'ri ISHLATMANG — onMounted ichida yoki typeof window check bilan. 2) Side-effectlar (setInterval, setTimeout) — server da memory leak, onMounted ichida qiling. 3) Global state mutatsiya QILMANG — so'rovlar bir-biriga aralashadi, har so'rov uchun yangi app instance kerak. 4) Nuxt da import.meta.client / import.meta.server va <ClientOnly> ishlatish mumkin. 5) Composable larda server-safe pattern qo'llang.`,
    },
    {
      question: 'Vue SSR va React SSR (Next.js) ni taqqoslang.',
      answer: `Nuxt va Next.js o'xshash vazifalani hal qiladi, lekin farqlar bor. Rendering: ikkalasi ham SSR, SSG, ISR qo'llaydi. React Server Components — bu Next.js ning katta afzalligi, komponent serverda render bo'lib JS client ga yuborilMAYDI. Vue da buning yetuk analogi yo'q. Streaming: React renderToPipeableStream, Vue renderToWebStream — ikkalasi ham qo'llaydi. File routing: Nuxt pages/, Next.js app/. Data fetching: Nuxt useFetch/useAsyncData, Next.js fetch (server components). Hydration: Vue createSSRApp + mount, React hydrateRoot. Nuxt Server Components eksperimental bosqichda, Next.js App Router to'liq production-ready.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'performance', label: 'Vue Performance' },
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'vue-vs-react', label: 'Vue vs React' },
    { techId: 'vue-js', sectionId: 'vue-router', topicId: 'navigation-guards', label: 'Navigation Guards' },
  ],
}
