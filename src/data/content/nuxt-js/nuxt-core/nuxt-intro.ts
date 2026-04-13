import type { Topic } from '../../../types'

export const nuxtIntro: Topic = {
  id: 'nuxt-intro',
  title: 'Nuxt 3 Kirish',
  importance: 3,
  status: 'to-learn',
  description: 'Nuxt 3 overview, auto-imports, directory structure, DevTools',
  content: `Nuxt 3 — Vue uchun meta-framework. Next.js React uchun nima bo'lsa, Nuxt Vue uchun shunday. SSR, SSG, file-based routing, auto-imports va boshqa ko'p narsalarni "out of the box" beradi.

═══════════════════════════════════════
  NUXT 3 NIMA
═══════════════════════════════════════

Nuxt — Vue ustiga qurilgan framework:
  1. Server-Side Rendering (SSR) — SEO va tez yuklash
  2. Static Site Generation (SSG) — build vaqtida HTML
  3. File-based routing — pages/ papka = avtomatik routelar
  4. Auto-imports — import yozish shart emas
  5. Server API — server/api/ papkada backend yozish
  6. Nitro engine — universal server (Node, Deno, Cloudflare, Vercel)

Nuxt 3 texnologiyalari:
  - Vue 3 + Composition API
  - Vite (build tool)
  - Nitro (server engine)
  - h3 (HTTP framework)
  - unjs ekosistem

MUHIM: Nuxt = Vue + SSR + File Routing + Auto Import + Server API.
Next.js = React + SSR + File Routing + API Routes + Server Components.

═══════════════════════════════════════
  AUTO-IMPORTS
═══════════════════════════════════════

Nuxt 3 da import yozish SHART EMAS. Avtomatik import ishlaydi:

1. Vue API-lari:
   ref, computed, watch, onMounted — import kerak emas!

2. Nuxt composable-lari:
   useFetch, useRoute, useRouter, useState — avtomatik

3. components/ papkadagi komponentlar:
   components/UserCard.vue → <UserCard /> (import siz)

4. composables/ papkadagi funksiyalar:
   composables/useAuth.ts → useAuth() (import siz)

5. utils/ papkadagi helper-lar:
   utils/formatDate.ts → formatDate() (import siz)

Ichki mexanizm:
  - Nuxt build vaqtida .nuxt/imports.d.ts yaratadi
  - TypeScript auto-complete ishlaydi
  - Tree-shaking saqlangan — ishlatilmagan import bundle ga tushmaydi

MUHIM: Auto-import faqat Nuxt kontekstida ishlaydi.
Oddiy .ts faylda (server, test) import qolda yozish kerak.

═══════════════════════════════════════
  DIRECTORY STRUCTURE
═══════════════════════════════════════

  nuxt-app/
  ├── .nuxt/              — generated fayllar (git ignore)
  ├── .output/            — production build
  ├── app.vue             — root komponent
  ├── nuxt.config.ts      — asosiy konfiguratsiya
  ├── pages/              — file-based routing
  │   ├── index.vue       — /
  │   ├── about.vue       — /about
  │   └── users/
  │       ├── index.vue   — /users
  │       └── [id].vue    — /users/:id
  ├── components/         — auto-import komponentlar
  │   ├── AppHeader.vue
  │   └── ui/
  │       └── Button.vue  — <UiButton />
  ├── composables/        — auto-import composable-lar
  │   └── useAuth.ts
  ├── layouts/            — sahifa layout-lari
  │   ├── default.vue
  │   └── admin.vue
  ├── middleware/          — route middleware
  │   └── auth.ts
  ├── plugins/            — Nuxt plugin-lar
  │   └── analytics.ts
  ├── server/             — backend (Nitro)
  │   ├── api/            — API endpoint-lar
  │   │   └── users.ts    — /api/users
  │   ├── middleware/      — server middleware
  │   └── utils/          — server utility-lar
  ├── public/             — statik fayllar
  └── assets/             — build qilinadigan fayllar (CSS, img)

MUHIM: Har bir papka OPTIONAL — faqat kerakligini yarating.
Nuxt papka mavjudligiga qarab funksionallikni yoqadi.

═══════════════════════════════════════
  NUXT.CONFIG.TS
═══════════════════════════════════════

  export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: ["@pinia/nuxt", "@nuxt/ui"],
    css: ["~/assets/main.css"],
    runtimeConfig: {
      secretKey: "...",              // faqat server
      public: { apiBase: "/api" },   // client + server
    },
    routeRules: {
      "/admin/**": { ssr: false },   // SPA mode
      "/blog/**": { ssg: true },     // Static
    },
    app: {
      head: {
        title: "My App",
        meta: [{ name: "description", content: "..." }],
      },
    },
  })

═══════════════════════════════════════
  NUXT DEVTOOLS
═══════════════════════════════════════

Nuxt DevTools — ishlab chiqish uchun ko'p funksiyali panel:

  1. Components — komponent daraxti va props
  2. Pages — barcha route-lar vizual ko'rinishi
  3. Imports — auto-import qilingan barcha modul-lar
  4. Modules — o'rnatilgan Nuxt modullar
  5. Hooks — lifecycle hook-lar ketma-ketligi
  6. Server API — API endpoint-larni test qilish
  7. Storage — cookie, localStorage, sessionStorage
  8. Timeline — performance monitoring

Yoqish:
  nuxt.config.ts da devtools: { enabled: true }
  Brauzerda Shift + Alt + D bosish

═══════════════════════════════════════
  NEXT.JS BILAN TAQQOSLASH
═══════════════════════════════════════

  Xususiyat          | Nuxt 3           | Next.js 14+
  ───────────────────|──────────────────|──────────────
  Framework          | Vue              | React
  Auto-imports       | Ha (hammasi)     | Yo'q
  File routing       | pages/           | app/ (App Router)
  Data fetching      | useFetch         | fetch + cache
  Server API         | server/api/      | app/api/ (Route Handlers)
  Server Components  | Yo'q             | Ha (RSC)
  Rendering          | SSR/SSG/ISR/SPA  | SSR/SSG/ISR
  DevTools           | Nuxt DevTools    | Yo'q (alohida)`,
  codeExamples: [
    {
      title: 'Nuxt 3 loyiha yaratish va asosiy tuzilma',
      language: 'ts',
      code: `// Terminal:
// npx nuxi@latest init my-app
// cd my-app
// npm install
// npm run dev

// nuxt.config.ts — asosiy konfiguratsiya
export default defineNuxtConfig({
  devtools: { enabled: true },

  // Modullar
  modules: [
    "@pinia/nuxt",
    "@nuxt/ui",
    "@nuxt/image",
  ],

  // CSS
  css: ["~/assets/css/main.css"],

  // Runtime konfiguratsiya
  runtimeConfig: {
    // Faqat server tomonda (secret)
    dbUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,

    // Client + server (public)
    public: {
      apiBase: process.env.API_BASE || "/api",
      appTitle: "Ketmonjon",
    },
  },

  // TypeScript
  typescript: {
    strict: true,
    shim: false,
  },

  // Route qoidalar
  routeRules: {
    "/": { prerender: true },
    "/admin/**": { ssr: false },
    "/blog/**": { ssg: true },
    "/api/**": { cors: true },
  },
})`,
      description: 'Nuxt loyiha yaratish, nuxt.config.ts asosiy sozlamalar, runtimeConfig, routeRules.',
    },
    {
      title: 'Auto-imports amalda',
      language: 'ts',
      code: `// pages/index.vue — HECH QANDAY import yo'q!
// <script setup lang="ts">
// ref, computed, watch — Vue API (avtomatik)
const count = ref(0)
const doubled = computed(() => count.value * 2)

// useRoute, useRouter — Nuxt composable (avtomatik)
const route = useRoute()
const router = useRouter()

// useFetch — Nuxt data fetching (avtomatik)
const { data: users } = await useFetch("/api/users")

// useAuth — o'zimiz yozgan composable (avtomatik)
// composables/useAuth.ts dan
const { user, isLoggedIn, logout } = useAuth()

// formatDate — utility (avtomatik)
// utils/formatDate.ts dan
const today = formatDate(new Date())
// </script>

// <template>
//   <div>
//     <h1>Salom, {{ user?.name }}</h1>
//     <p>Bugun: {{ today }}</p>
//     <p>Foydalanuvchilar: {{ users?.length }}</p>
//   </div>
// </template>


// composables/useAuth.ts — avtomatik import bo'ladi
export function useAuth() {
  const user = useState<User | null>("user", () => null)
  const isLoggedIn = computed(() => user.value !== null)

  async function login(email: string, password: string) {
    user.value = await $fetch("/api/auth/login", {
      method: "POST",
      body: { email, password },
    })
  }

  function logout() {
    user.value = null
    navigateTo("/login")
  }

  return { user, isLoggedIn, login, logout }
}`,
      description: 'Auto-import: ref, computed, useFetch, useRoute — hammasi import siz ishlaydi.',
    },
    {
      title: 'App.vue va Layout tuzilmasi',
      language: 'ts',
      code: `// app.vue — root komponent
// <template>
//   <NuxtLayout>
//     <NuxtPage />
//   </NuxtLayout>
// </template>


// layouts/default.vue — standart layout
// <template>
//   <div class="layout">
//     <AppHeader />
//     <main class="container">
//       <slot />   <!-- sahifa kontenti shu yerga -->
//     </main>
//     <AppFooter />
//   </div>
// </template>


// layouts/admin.vue — admin layout
// <template>
//   <div class="admin-layout">
//     <AdminSidebar />
//     <div class="admin-content">
//       <slot />
//     </div>
//   </div>
// </template>


// pages/admin/dashboard.vue — admin layout ishlatish
// <script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "auth",
})
// </script>
//
// <template>
//   <div>
//     <h1>Admin Dashboard</h1>
//   </div>
// </template>


// pages/login.vue — layout siz sahifa
// <script setup lang="ts">
definePageMeta({
  layout: false, // hech qanday layout ishlatilmaydi
})
// </script>`,
      description: 'NuxtLayout + NuxtPage. Layout-lar slot orqali ishlaydi. definePageMeta bilan sahifaga layout berish.',
    },
    {
      title: 'Server API — Nitro bilan backend',
      language: 'ts',
      code: `// server/api/users.ts — GET /api/users
export default defineEventHandler(async (event) => {
  // Query parametrlar
  const query = getQuery(event) // { page: "1", limit: "10" }

  // Database so'rov (misol)
  const users = [
    { id: 1, name: "Ali", email: "ali@mail.com" },
    { id: 2, name: "Vali", email: "vali@mail.com" },
  ]

  return users
})


// server/api/users/[id].ts — GET /api/users/:id
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")

  // Xatolik qaytarish
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID talab qilinadi",
    })
  }

  return { id: Number(id), name: "Ali" }
})


// server/api/users.post.ts — POST /api/users
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validatsiya
  if (!body.name || !body.email) {
    throw createError({
      statusCode: 422,
      statusMessage: "name va email talab qilinadi",
    })
  }

  // Yaratish
  const newUser = { id: Date.now(), ...body }
  return newUser
})


// Klient tomonda chaqirish:
// const { data } = await useFetch("/api/users")
// const user = await $fetch("/api/users/1")
// await $fetch("/api/users", { method: "POST", body: { name: "Ali" } })`,
      description: 'Nitro server API — defineEventHandler, getQuery, readBody. Fayl nomi HTTP metodini belgilaydi.',
    },
  ],
  interviewQA: [
    {
      question: 'Nuxt 3 nima va nima uchun kerak? Vue-ning o`zi yetarli emasmi?',
      answer: `Nuxt 3 Vue uchun meta-framework — SSR, file routing, auto-imports, server API beradi. Vue SPA yaratish uchun yetarli, lekin SEO kerak bo'lsa SSR, tez yuklash kerak bo'lsa SSG, backend kerak bo'lsa server API — bularni qolda sozlash murakkab. Nuxt hammasini "out of the box" beradi. Xuddi Next.js React uchun nima bo'lsa, Nuxt Vue uchun shunday. Nitro engine orqali Node, Deno, Cloudflare, Vercel — har joyga deploy qilish mumkin.`,
    },
    {
      question: 'Nuxt 3 da auto-import qanday ishlaydi? Tree-shaking buzilmaydimi?',
      answer: `Nuxt build vaqtida barcha mavjud import-larni skanerlaydi (Vue API, Nuxt composable, components/, composables/, utils/ papkalar). .nuxt/imports.d.ts fayl yaratib TypeScript-ga bildiradi. Compile vaqtida ishlatilgan import-larni avtomatik qo'shadi. Tree-shaking BUZILMAYDI — chunki Nuxt faqat haqiqatan ishlatilgan funksiyalarni bundle ga kiritadi. Lekin auto-import faqat Nuxt kontekstida ishlaydi — server utility va test fayllarida qolda import kerak.`,
    },
    {
      question: 'Nuxt 3 directory structure-ni tushuntiring. Qaysi papka nima uchun?',
      answer: `pages/ — file-based routing (har bir .vue fayl = route). components/ — avtomatik import bo'ladigan komponentlar. composables/ — qayta ishlatiladigan logika (useAuth, useCart). layouts/ — sahifa tuzilmalari (default, admin). middleware/ — route middleware (auth, guest). plugins/ — Nuxt plugin-lar. server/ — backend (api/, middleware/, utils/). server/api/ — REST API endpoint-lar. public/ — statik fayllar (favicon, robots.txt). assets/ — build qilinadigan resurslar (CSS, rasm). Har bir papka ixtiyoriy — faqat kerakligini yarating.`,
    },
    {
      question: 'Nuxt va Next.js ni taqqoslang. Asosiy farqlari nima?',
      answer: `1) Framework: Nuxt = Vue, Next.js = React. 2) Auto-imports: Nuxt hammasi avtomatik, Next.js da yo'q. 3) Server Components: Next.js RSC bor (komponent server da render, JS clientga yuborilmaydi). Nuxt da hali yo'q. 4) Data fetching: Nuxt useFetch/useAsyncData, Next.js fetch + cache. 5) DevTools: Nuxt DevTools juda kuchli (built-in). 6) Rendering: ikkalasi SSR/SSG/ISR. Next.js App Router yaqindagina chiqdi, Nuxt 3 barqarorroq. 7) Deploy: Nuxt Nitro orqali ko'proq platformalarni qo'llaydi (edge, serverless).`,
    },
    {
      question: 'runtimeConfig va environment variables Nuxt 3 da qanday ishlaydi?',
      answer: `runtimeConfig ikki qismdan iborat: private (faqat server) va public (client + server). nuxt.config.ts da default qiymatlar yoziladi, .env fayl bilan override qilinadi. Konventsiya: NUXT_SECRET_KEY -> runtimeConfig.secretKey, NUXT_PUBLIC_API_BASE -> runtimeConfig.public.apiBase. Server da useRuntimeConfig() bilan hammaga kirish mumkin. Klient da faqat public qismga kirish mumkin. Bu Next.js NEXT_PUBLIC_ konventsiyasiga o'xshash, lekin Nuxt-da avtomatik mapping bor.`,
    },
  ],
  relatedTopics: [
    { techId: 'nuxt-js', sectionId: 'nuxt-core', topicId: 'file-routing', label: 'File-based Routing' },
    { techId: 'nuxt-js', sectionId: 'nuxt-core', topicId: 'data-fetching', label: 'Data Fetching' },
    { techId: 'nuxt-js', sectionId: 'nuxt-core', topicId: 'rendering-modes', label: 'Rendering Modes' },
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'vue-vs-react', label: 'Vue vs React' },
  ],
}
