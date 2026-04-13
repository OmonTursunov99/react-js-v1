import type { Topic } from '../../../types'

export const dataFetching: Topic = {
  id: 'data-fetching',
  title: 'Data Fetching',
  importance: 3,
  status: 'to-learn',
  description: 'useFetch, useAsyncData, $fetch — SSR-friendly data yuklash',
  content: `Nuxt 3 da ma'lumot yuklash uchun 3 ta asosiy vosita bor: useFetch, useAsyncData, $fetch. Hammasi SSR-friendly — server va client da ishlaydi.

═══════════════════════════════════════
  USEFETCH — ASOSIY DATA FETCHING
═══════════════════════════════════════

useFetch — Nuxt-ning asosiy data fetching composable-i.
SSR da server tomonda ishlaydi, klientga tayyor ma'lumot yuboriladi.

  const { data, error, pending, refresh, status } = await useFetch("/api/users")

Qaytaruvchi qiymatlar:
  data     — Ref<T | null> — yuklangan ma'lumot
  error    — Ref<Error | null> — xatolik
  pending  — Ref<boolean> — yuklanmoqdami
  refresh  — () => Promise — qayta yuklash
  status   — "idle" | "pending" | "success" | "error"

Opsiyalar:
  useFetch("/api/users", {
    method: "POST",
    body: { name: "Ali" },
    headers: { Authorization: "Bearer ..." },
    query: { page: 1 },
    pick: ["id", "name"],       // faqat kerakli fieldlar
    transform: (data) => data.map(...),
    watch: [page],              // page o'zgarganda qayta yuklash
    lazy: true,                 // klient tomonda yuklash
    server: false,              // faqat klient tomonda
    default: () => [],          // boshlang'ich qiymat
  })

MUHIM: useFetch SSR da server tomonda ishlaydi.
Ma'lumot HTML ga inline qilinadi va klientda qayta so'rov yuborilMAYDI.
Bu "hydration" deyiladi — server va klient sinxronlashadi.

═══════════════════════════════════════
  USEASYNCDATA — BOSHQA DATA SOURCELARI
═══════════════════════════════════════

useAsyncData — useFetch-ga o'xshash, lekin ixtiyoriy async funksiya.
Fetch emas, boshqa data source (SDK, database, GraphQL) uchun.

  const { data, error } = await useAsyncData(
    "users",                    // unique key (cache uchun)
    () => myDatabaseQuery()     // ixtiyoriy async funksiya
  )

useFetch va useAsyncData farqi:
  useFetch(url)       = useAsyncData(url, () => $fetch(url))
  useFetch — URL based
  useAsyncData — ixtiyoriy async funksiya

Qachon useAsyncData:
  - Supabase/Firebase SDK
  - GraphQL client
  - localStorage/IndexedDB
  - Murakkab data transformatsiya

═══════════════════════════════════════
  $FETCH — NUXT API CLIENT
═══════════════════════════════════════

$fetch — Nuxt-ning HTTP client-i (ofetch kutubxonasi asosida).
Server va client da ishlaydi. SSR da server request-ni lokal qiladi.

  // Oddiy GET
  const users = await $fetch("/api/users")

  // POST
  const newUser = await $fetch("/api/users", {
    method: "POST",
    body: { name: "Ali", email: "ali@mail.com" },
  })

  // Query parametrlar
  const results = await $fetch("/api/search", {
    query: { q: "vue", page: 1 },
  })

$fetch vs useFetch:
  $fetch       — oddiy promise, SSR dedup YO'Q, event handler ichida
  useFetch     — reactive, SSR dedup BOR, setup/template uchun

MUHIM: Setup ichida $fetch ISHLATMANG — bu server+client da
2 MARTA ishlaydi (double fetch). Setup da DOIM useFetch ishlating.
$fetch — faqat event handler, utility funksiya, server API ichida.

═══════════════════════════════════════
  CACHING VA REFRESHING
═══════════════════════════════════════

Nuxt ma'lumotni key bo'yicha cache qiladi:

  useFetch("/api/users")           — key avtomatik: "/api/users"
  useAsyncData("my-key", fn)       — key qolda: "my-key"

Qayta yuklash:
  const { refresh } = useFetch("/api/users")
  refresh()                         — so'rovni qayta yuborish

  // Yoki global
  refreshNuxtData()                 — BARCHA ma'lumotlarni qayta yuklash
  refreshNuxtData("users")          — faqat "users" key-ni

Watch — reaktiv qayta yuklash:
  const page = ref(1)
  useFetch("/api/users", {
    query: { page },               — page o'zgarganda avtomatik
    watch: [page],                  — yoki watch bilan
  })

═══════════════════════════════════════
  ERROR HANDLING
═══════════════════════════════════════

  const { data, error } = await useFetch("/api/users")

  if (error.value) {
    console.error(error.value.statusCode)
    console.error(error.value.statusMessage)
    console.error(error.value.data)
  }

Server API da error:
  throw createError({
    statusCode: 404,
    statusMessage: "Topilmadi",
  })

Global error handling:
  // plugins/error-handler.ts
  export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook("vue:error", (error) => {
      console.error("Global error:", error)
    })
  })

═══════════════════════════════════════
  SERVER-SIDE VS CLIENT-SIDE FETCHING
═══════════════════════════════════════

Server-side (default):
  - SEO uchun yaxshi — HTML da ma'lumot bor
  - TTFB biroz sekin (server kutadi)
  - Klientda qayta fetch YO'Q

Client-side (lazy: true yoki server: false):
  - Sahifa tezroq yuklaydi (skeleton ko'rsatadi)
  - SEO uchun yomon (bot ma'lumot ko'rmaydi)
  - Klientda fetch so'rov yuboriladi

  // Lazy — avval sahifa, keyin data
  const { data, pending } = useLazyFetch("/api/users")

  // Server: false — faqat klient tomonda
  const { data } = useFetch("/api/analytics", { server: false })`,
  codeExamples: [
    {
      title: 'useFetch — asosiy CRUD operatsiyalar',
      language: 'ts',
      code: `// pages/users/index.vue
// <script setup lang="ts">
interface User {
  id: number
  name: string
  email: string
}

// GET — foydalanuvchilar ro'yxati
const page = ref(1)
const { data: users, pending, error, refresh } = await useFetch<User[]>(
  "/api/users",
  {
    query: { page, limit: 10 },
    watch: [page], // page o'zgarganda qayta fetch
    default: () => [] as User[],
  }
)

// POST — yangi foydalanuvchi
async function createUser(name: string, email: string) {
  const newUser = await $fetch<User>("/api/users", {
    method: "POST",
    body: { name, email },
  })

  // Ro'yxatni yangilash
  refresh()
}

// DELETE — foydalanuvchini o'chirish
async function deleteUser(id: number) {
  await $fetch("/api/users/" + id, { method: "DELETE" })
  refresh()
}
// </script>

// <template>
//   <div>
//     <div v-if="pending">Yuklanmoqda...</div>
//     <div v-else-if="error">Xatolik: {{ error.message }}</div>
//     <ul v-else>
//       <li v-for="user in users" :key="user.id">
//         {{ user.name }}
//         <button @click="deleteUser(user.id)">O'chirish</button>
//       </li>
//     </ul>
//     <button @click="page++">Keyingi sahifa</button>
//   </div>
// </template>`,
      description: 'useFetch bilan CRUD. $fetch event handler ichida, useFetch setup ichida. watch bilan reaktiv.',
    },
    {
      title: 'useAsyncData — boshqa data source bilan',
      language: 'ts',
      code: `// pages/dashboard.vue
// <script setup lang="ts">
interface DashboardData {
  totalUsers: number
  revenue: number
  recentOrders: Order[]
}

// useAsyncData — ixtiyoriy async funksiya
const { data: dashboard } = await useAsyncData<DashboardData>(
  "dashboard",  // unique cache key
  async () => {
    // Parallel so'rovlar
    const [users, revenue, orders] = await Promise.all([
      $fetch<number>("/api/stats/users"),
      $fetch<number>("/api/stats/revenue"),
      $fetch<Order[]>("/api/orders/recent"),
    ])

    return {
      totalUsers: users,
      revenue,
      recentOrders: orders,
    }
  },
  {
    // 5 daqiqada 1 marta yangilash
    getCachedData(key, nuxtApp) {
      const cached = nuxtApp.payload.data[key]
      if (!cached) return undefined

      const expiry = 5 * 60 * 1000 // 5 min
      const fetchedAt = nuxtApp.payload._fetchedAt?.[key]
      if (fetchedAt && Date.now() - fetchedAt > expiry) {
        return undefined // cache eskirgan
      }
      return cached
    },
  }
)

// Supabase SDK bilan
// const supabase = useSupabaseClient()
// const { data: posts } = await useAsyncData("posts", async () => {
//   const { data } = await supabase.from("posts").select("*").limit(10)
//   return data
// })`,
      description: 'useAsyncData ixtiyoriy async funksiya bilan. Parallel fetch, cache strategiya, SDK integration.',
    },
    {
      title: '$fetch va useFetch farqi — amaliy misol',
      language: 'ts',
      code: `// ═══ NOTO'G'RI — setup ichida $fetch ═══
// Bu server + client da 2 MARTA ishlaydi!
// <script setup>
// const users = await $fetch("/api/users")  // NOTO'G'RI!
// </script>


// ═══ TO'G'RI — setup ichida useFetch ═══
// <script setup>
// SSR: server da 1 marta, klientda 0 marta (dedup)
const { data: users } = await useFetch("/api/users")
// </script>


// ═══ TO'G'RI — event handler ichida $fetch ═══
async function handleSubmit(formData: FormData) {
  // Event handler ichida $fetch TO'G'RI
  // Chunki bu faqat klient tomonda, foydalanuvchi action da ishlaydi
  try {
    const result = await $fetch("/api/submit", {
      method: "POST",
      body: Object.fromEntries(formData),
    })
    console.log("Muvaffaqiyat:", result)
  } catch (err) {
    console.error("Xatolik:", err)
  }
}


// ═══ Server API ichida $fetch ═══
// server/api/dashboard.ts
export default defineEventHandler(async () => {
  // Server API ichida $fetch to'g'ri
  const users = await $fetch("/api/users")
  const orders = await $fetch("/api/orders")

  return {
    userCount: users.length,
    orderCount: orders.length,
  }
})


// ═══ XULOSA ═══
// setup/template     → useFetch (SSR dedup)
// event handler      → $fetch (klient tomonda)
// server API         → $fetch (server tomonda)
// composable         → useFetch yoki useAsyncData`,
      description: 'Setup da useFetch, event handler da $fetch. Noto`g`ri ishlatish 2x fetch muammosi yaratadi.',
    },
    {
      title: 'Lazy fetching va loading holatlari',
      language: 'ts',
      code: `// pages/analytics.vue — klient tomonda yuklash
// <script setup lang="ts">
interface Analytics {
  pageViews: number
  uniqueVisitors: number
  bounceRate: number
}

// useLazyFetch — sahifa DARHOL renderlanadi, data keyin keladi
const {
  data: analytics,
  pending,
  error,
  refresh,
} = useLazyFetch<Analytics>("/api/analytics", {
  // Faqat klient tomonda (SEO kerak emas)
  server: false,

  // Boshlang'ich qiymat (pending vaqtida)
  default: () => ({
    pageViews: 0,
    uniqueVisitors: 0,
    bounceRate: 0,
  }),

  // Transform — kerakli formatga aylantirish
  transform: (raw) => ({
    ...raw,
    bounceRate: Math.round(raw.bounceRate * 100) / 100,
  }),

  // Pick — faqat kerakli field-lar (payload kamaytirish)
  pick: ["pageViews", "uniqueVisitors", "bounceRate"],
})
// </script>

// <template>
//   <div class="analytics">
//     <!-- Skeleton loading -->
//     <div v-if="pending" class="grid grid-cols-3 gap-4">
//       <div v-for="i in 3" :key="i" class="skeleton h-24" />
//     </div>
//
//     <!-- Error holati -->
//     <div v-else-if="error" class="error">
//       <p>{{ error.message }}</p>
//       <button @click="refresh()">Qayta urinish</button>
//     </div>
//
//     <!-- Ma'lumot tayyor -->
//     <div v-else class="grid grid-cols-3 gap-4">
//       <StatCard title="Ko'rishlar" :value="analytics.pageViews" />
//       <StatCard title="Tashrifchilar" :value="analytics.uniqueVisitors" />
//       <StatCard title="Bounce" :value="analytics.bounceRate + '%'" />
//     </div>
//   </div>
// </template>`,
      description: 'useLazyFetch klient tomonda yuklaydi. pending, error, default bilan loading UX.',
    },
  ],
  interviewQA: [
    {
      question: 'useFetch va $fetch farqi nima? Qachon qaysini ishlatish kerak?',
      answer: `useFetch — composable, SSR dedup bor (server da 1 marta, klientda 0 marta), reactive (data, pending, error ref qaytaradi), setup ichida ishlatiladi. $fetch — oddiy promise, SSR dedup YO'Q (server+client da 2 marta ishlaydi), event handler va server API ichida ishlatiladi. Qoida: setup/template da useFetch, onClick/onSubmit da $fetch, server/api/ da $fetch. Setup ichida $fetch ishlatish ENG KATTA XATO — double fetch bo'ladi.`,
    },
    {
      question: 'useFetch va useAsyncData farqi nima?',
      answer: `useFetch(url, options) = useAsyncData(url, () => $fetch(url, options)). Ya'ni useFetch — useAsyncData + $fetch qisqartmasi. useAsyncData ixtiyoriy async funksiya qabul qiladi — fetch bo'lmasligi ham mumkin (Supabase SDK, GraphQL, localStorage). useFetch URL-based so'rovlar uchun, useAsyncData boshqa har qanday async data source uchun. Ikkalasi ham bir xil SSR dedup, caching, reactive return beradi.`,
    },
    {
      question: 'Nuxt da SSR data fetching qanday ishlaydi? Double fetch muammosi nima?',
      answer: `SSR da useFetch server tomonda ishlaydi, natija HTML payload-ga inline qilinadi. Klient hydration vaqtida payload-dan ma'lumot oladi — QAYTA FETCH QILMAYDI. Bu "deduplication" deyiladi. Double fetch muammosi — setup ichida $fetch ishlatganda server da ham, klient da ham fetch bo'ladi (2 marta). useFetch buni avtomatik hal qiladi — unique key orqali server natijasini klientga uzatadi.`,
    },
    {
      question: 'useFetch da caching qanday ishlaydi? Qanday qayta yuklash mumkin?',
      answer: `Nuxt har bir useFetch/useAsyncData natijasini unique key bilan cache qiladi (URL yoki qolda berilgan key). Qayta yuklash: 1) refresh() — shu composable-ni qayta fetch. 2) refreshNuxtData("key") — key bo'yicha qayta fetch. 3) refreshNuxtData() — BARCHA data qayta. 4) watch option — reactive qiymat o'zgarganda avtomatik. 5) getCachedData — custom cache strategiya (expiry time). clearNuxtData("key") — cache tozalash.`,
    },
    {
      question: 'Lazy fetching nima va qachon ishlatiladi?',
      answer: `Lazy fetching — sahifa DARHOL renderlanadi, data klient tomonda yuklanadi. useLazyFetch() yoki useFetch({ lazy: true }) bilan. Oddiy useFetch SSR da server javobni KUTADI — TTFB sekin lekin SEO yaxshi. Lazy fetch — sahifa tez ko'rinadi, skeleton/loading ko'rsatadi, keyin data keladi. Qachon ishlatish: SEO kerak bo'lmagan sahifalar (dashboard, analytics), katta data yuklanishi (report), foydalanuvchi action-dan keyin (search results). server: false — butunlay SSR-siz.`,
    },
    {
      question: 'Nuxt data fetching va React TanStack Query ni taqqoslang.',
      answer: `O'xshashliklar: ikkalasi ham reactive data, loading/error state, caching, refetching beradi. Farqlar: 1) Nuxt useFetch SSR-native — server da ishlaydi, payload uzatadi. TanStack Query SSR uchun qo'shimcha sozlash kerak (hydration, prefetch). 2) Nuxt-da $fetch server va client da bir xil API. TanStack Query faqat client. 3) TanStack Query ko'proq feature: infinite queries, optimistic updates, mutation. Nuxt buning uchun alohida yechim kerak. 4) TanStack Query framework-agnostic (React, Vue, Solid). Nuxt faqat Nuxt.`,
    },
  ],
  relatedTopics: [
    { techId: 'nuxt-js', sectionId: 'nuxt-core', topicId: 'nuxt-intro', label: 'Nuxt 3 Kirish' },
    { techId: 'nuxt-js', sectionId: 'nuxt-core', topicId: 'rendering-modes', label: 'Rendering Modes' },
    { techId: 'react-js', sectionId: 'state-management', topicId: 'tanstack-query', label: 'TanStack Query' },
  ],
}
