import type { Topic } from '../../../types'

export const nuxtMiddleware: Topic = {
  id: 'nuxt-middleware',
  title: 'Middleware',
  importance: 2,
  status: 'to-learn',
  description: 'Route middleware, server middleware, authentication pattern',
  content: `Nuxt 3 da middleware — route yoki server so'rov oldidan ishlaydigan funksiyalar. Autentifikatsiya, ruxsat tekshirish, redirect va boshqa logika uchun.

═══════════════════════════════════════
  ROUTE MIDDLEWARE
═══════════════════════════════════════

Route middleware — sahifa yuklanishidan OLDIN ishlaydi.
Navigatsiya to'xtatish, redirect, ma'lumot tekshirish uchun.

  // middleware/auth.ts
  export default defineNuxtRouteMiddleware((to, from) => {
    const { isLoggedIn } = useAuth()

    if (!isLoggedIn.value) {
      return navigateTo("/login")
    }
  })

Qayerda ishlatish:
  1. Sahifada — definePageMeta({ middleware: "auth" })
  2. Global — middleware/auth.global.ts (barcha sahifalarda)
  3. Inline — definePageMeta ichida funksiya sifatida

MUHIM: Route middleware SERVER VA CLIENT da ishlaydi.
SSR da birinchi request server da, keyin navigatsiya client da.

═══════════════════════════════════════
  MIDDLEWARE TURLARI
═══════════════════════════════════════

1. Named middleware (nomlangan):
   middleware/auth.ts → definePageMeta({ middleware: "auth" })

2. Global middleware (barcha sahifalar):
   middleware/analytics.global.ts → har sahifa ochilganda ishlaydi

3. Inline middleware (sahifa ichida):
   definePageMeta({
     middleware: [
       function (to, from) {
         if (to.path === "/secret") return navigateTo("/")
       }
     ]
   })

Ishga tushish tartibi:
  1. Global middleware-lar (fayl nomi bo'yicha alifbo tartibida)
  2. Sahifa middleware-lari (definePageMeta tartibida)

MUHIM: Middleware faqat navigatsiya vaqtida ishlaydi.
Sahifa qayta yuklanmasa (refresh), middleware qayta ishlamaydi.

═══════════════════════════════════════
  GLOBAL VS NAMED VS INLINE
═══════════════════════════════════════

Global — .global.ts qo'shimchasi:
  middleware/
  ├── 01.auth.global.ts     — 1-chi: autentifikatsiya
  ├── 02.analytics.global.ts — 2-chi: sahifa ko'rish
  └── admin-only.ts          — named (qolda ulash kerak)

Named — sahifada ulash:
  definePageMeta({
    middleware: "admin-only",
  })

  // Bir nechta middleware
  definePageMeta({
    middleware: ["auth", "admin-only", "verified"],
  })

Inline — sahifa ichida:
  definePageMeta({
    middleware: [
      function (to, from) {
        const route = useRoute()
        // ...
      }
    ],
  })

═══════════════════════════════════════
  SERVER MIDDLEWARE
═══════════════════════════════════════

server/middleware/ — HAR BIR server so'rov oldidan ishlaydi.
Bu Vue Router middleware EMAS — Nitro HTTP middleware.

  // server/middleware/log.ts
  export default defineEventHandler((event) => {
    console.log(event.method, event.path)
    // return yo'q — keyingi handler ga o'tadi
  })

  // server/middleware/cors.ts
  export default defineEventHandler((event) => {
    setResponseHeaders(event, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE",
    })
  })

Route middleware vs Server middleware:
  Route  — Vue navigatsiya (sahifa o'tish)
  Server — HTTP so'rov (API, sahifa, asset)

Route middleware — foydalanuvchi tajribasi (auth, role).
Server middleware — HTTP (CORS, logging, rate limit).

═══════════════════════════════════════
  AUTHENTICATION PATTERN
═══════════════════════════════════════

To'liq auth tizimi:

  1. composables/useAuth.ts — auth holati
  2. middleware/auth.ts — himoyalangan sahifalar
  3. middleware/guest.ts — faqat mehmon uchun (login sahifa)
  4. server/api/auth/ — backend API

composables/useAuth.ts:
  useState bilan — SSR friendly (cookie orqali)

middleware/auth.ts:
  isLoggedIn tekshirish, yo'q bo'lsa /login ga redirect

middleware/guest.ts:
  isLoggedIn bo'lsa / ga redirect (login sahifaga kirishni taqiqlash)

MUHIM: Nuxt-da auth holati uchun useState ishlatish kerak.
ref() SSR da server-client sinxronlanmaydi.
useState cookie/payload orqali sinxronlanadi.

═══════════════════════════════════════
  REDIRECT VA ABORT
═══════════════════════════════════════

Redirect:
  return navigateTo("/login")
  return navigateTo("/login", { replace: true })
  return navigateTo("https://google.com", { external: true })

Abort (xatolik):
  return abortNavigation()  — navigatsiya bekor
  return abortNavigation(createError({
    statusCode: 403,
    statusMessage: "Ruxsat yo'q",
  }))

MUHIM: Middleware da DOIM return kerak.
return yo'q bo'lsa — navigatsiya davom etadi.
return navigateTo() — redirect.
return abortNavigation() — to'xtatish.`,
  codeExamples: [
    {
      title: 'Auth middleware — to`liq pattern',
      language: 'ts',
      code: `// composables/useAuth.ts
interface User {
  id: number
  name: string
  email: string
  role: "admin" | "user" | "moderator"
}

export function useAuth() {
  // useState — SSR friendly (server -> client sinxronlanadi)
  const user = useState<User | null>("auth-user", () => null)
  const isLoggedIn = computed(() => user.value !== null)
  const isAdmin = computed(() => user.value?.role === "admin")

  async function login(email: string, password: string) {
    const data = await $fetch<{ user: User; token: string }>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    })
    user.value = data.user
    // Token cookie da saqlanadi (server middleware orqali)
  }

  function logout() {
    user.value = null
    $fetch("/api/auth/logout", { method: "POST" })
    navigateTo("/login")
  }

  return { user, isLoggedIn, isAdmin, login, logout }
}


// middleware/auth.ts — himoyalangan sahifalar
export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn.value) {
    return navigateTo("/login", {
      replace: true,
      // Login dan keyin qaytish uchun
      // query: { redirect: to.fullPath },
    })
  }
})


// middleware/guest.ts — faqat mehmon (login sahifa)
export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn } = useAuth()

  if (isLoggedIn.value) {
    return navigateTo("/")
  }
})`,
      description: 'To`liq auth pattern: useAuth composable + auth middleware + guest middleware.',
    },
    {
      title: 'Role-based middleware — ruxsat tekshirish',
      language: 'ts',
      code: `// middleware/admin-only.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { user, isLoggedIn } = useAuth()

  if (!isLoggedIn.value) {
    return navigateTo("/login")
  }

  if (user.value?.role !== "admin") {
    return abortNavigation(
      createError({
        statusCode: 403,
        statusMessage: "Faqat adminlar uchun",
      })
    )
  }
})


// middleware/role.ts — universal role middleware
export default defineNuxtRouteMiddleware((to, from) => {
  const { user, isLoggedIn } = useAuth()

  if (!isLoggedIn.value) {
    return navigateTo("/login")
  }

  // definePageMeta dan requiredRole olish
  const requiredRole = to.meta.requiredRole as string | undefined

  if (requiredRole && user.value?.role !== requiredRole) {
    return abortNavigation(
      createError({
        statusCode: 403,
        statusMessage: "Sizda " + requiredRole + " roli yo'q",
      })
    )
  }
})


// pages/admin/settings.vue — ishlatish
// <script setup lang="ts">
definePageMeta({
  middleware: ["auth", "role"],
  requiredRole: "admin",  // meta orqali role berish
  layout: "admin",
})
// </script>


// pages/moderator/reports.vue
// <script setup lang="ts">
definePageMeta({
  middleware: ["auth", "role"],
  requiredRole: "moderator",
})
// </script>`,
      description: 'Role-based access: route.meta.requiredRole + middleware tekshirish. abortNavigation bilan 403.',
    },
    {
      title: 'Global middleware va server middleware',
      language: 'ts',
      code: `// middleware/01.init.global.ts — GLOBAL (har sahifada)
// Raqam — ishga tushish tartibi (01 birinchi)
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user } = useAuth()

  // Server-side: cookie dan user olish
  if (import.meta.server && !user.value) {
    try {
      const data = await $fetch("/api/auth/me")
      user.value = data
    } catch {
      // Cookie yo'q yoki eskirgan — davom etish
    }
  }
})


// middleware/02.analytics.global.ts — sahifa ko'rishni track qilish
export default defineNuxtRouteMiddleware((to, from) => {
  // Faqat klient tomonda
  if (import.meta.client) {
    // Analytics event yuborish
    console.log("Page view:", to.path)
    // gtag("event", "page_view", { page_path: to.path })
  }
})


// ═══ SERVER MIDDLEWARE ═══

// server/middleware/log.ts — barcha HTTP so'rovlarni log qilish
export default defineEventHandler((event) => {
  const method = event.method
  const path = getRequestURL(event).pathname
  console.log("[" + new Date().toISOString() + "]", method, path)
  // return kerak emas — keyingi handler ga o'tadi
})


// server/middleware/auth.ts — API autentifikatsiya
export default defineEventHandler(async (event) => {
  // Faqat /api/ so'rovlar uchun
  if (!event.path.startsWith("/api/auth/") && event.path.startsWith("/api/")) {
    const token = getCookie(event, "auth-token")

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "Autentifikatsiya talab qilinadi",
      })
    }

    // Token tekshirish va user-ni event ga biriktirish
    try {
      const user = await verifyToken(token)
      event.context.user = user
    } catch {
      throw createError({ statusCode: 401, statusMessage: "Token eskirgan" })
    }
  }
})`,
      description: 'Global middleware: .global.ts. Server middleware: server/middleware/. HTTP logging, auth token tekshirish.',
    },
    {
      title: 'Inline middleware va shartli redirect',
      language: 'ts',
      code: `// pages/checkout.vue — inline middleware
// <script setup lang="ts">
definePageMeta({
  middleware: [
    // 1. Auth tekshirish (named)
    "auth",

    // 2. Inline — savat tekshirish
    function (to, from) {
      const cart = useCartStore()

      if (cart.items.length === 0) {
        return navigateTo("/cart", {
          replace: true,
        })
      }
    },

    // 3. Inline — step tekshirish
    function (to, from) {
      const checkout = useCheckoutStore()
      const step = to.query.step as string

      // 3-qadam uchun 1-2 qadam tugagan bo'lishi kerak
      if (step === "payment" && !checkout.addressFilled) {
        return navigateTo("/checkout?step=address")
      }
    },
  ],
})
// </script>


// pages/profile/edit.vue — shartli middleware
// <script setup lang="ts">
definePageMeta({
  middleware: [
    "auth",
    function (to, from) {
      const { user } = useAuth()

      // Email tasdiqlangan bo'lishi kerak
      if (!user.value?.emailVerified) {
        return navigateTo("/verify-email")
      }
    },
  ],
})
// </script>


// Middleware dan ma'lumot uzatish
// middleware/load-workspace.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const workspaceId = to.params.workspaceId as string

  try {
    const workspace = await $fetch("/api/workspaces/" + workspaceId)
    // useState orqali sahifaga uzatish
    useState("current-workspace", () => workspace)
  } catch {
    return abortNavigation(
      createError({ statusCode: 404, statusMessage: "Workspace topilmadi" })
    )
  }
})`,
      description: 'Inline middleware sahifa ichida. Named + inline aralash. useState bilan data uzatish.',
    },
  ],
  interviewQA: [
    {
      question: 'Nuxt route middleware va server middleware farqi nima?',
      answer: `Route middleware — Vue navigatsiya (sahifa o'tish) oldidan ishlaydi. Server va client da ishlaydi (SSR). Foydalanuvchi tajribasi uchun: auth, role, redirect. middleware/ papkada. Server middleware — HAR BIR HTTP so'rov oldidan ishlaydi. Faqat server da (Nitro). HTTP operatsiyalar uchun: CORS, logging, rate limiting, API auth. server/middleware/ papkada. Route middleware = "bu sahifani ko'rish mumkinmi?". Server middleware = "bu HTTP so'rovni qanday qayta ishlash kerak?".`,
    },
    {
      question: 'Global, named va inline middleware farqlari nima?',
      answer: `Global (.global.ts) — BARCHA sahifalarda ishlaydi, alohida ulash kerak emas. Raqamli prefix bilan tartib: 01.auth.global.ts, 02.analytics.global.ts. Named — middleware/auth.ts, definePageMeta({ middleware: "auth" }) bilan ulash kerak. Inline — definePageMeta ichida funksiya sifatida, faqat shu sahifa uchun. Tartib: global-lar birinchi (alifbo), keyin named/inline (definePageMeta tartibida).`,
    },
    {
      question: 'Nuxt middleware da autentifikatsiya qanday implement qilinadi?',
      answer: `1) composables/useAuth.ts — useState bilan auth holati (SSR-friendly). 2) middleware/auth.ts — isLoggedIn tekshirish, yo'q bo'lsa /login redirect. 3) middleware/guest.ts — teskari: logged in bo'lsa / ga redirect (login sahifa uchun). 4) server/middleware/auth.ts — API uchun token tekshirish. 5) Global init middleware — sahifa yuklanishda cookie dan user olish. MUHIM: ref() emas, useState() kerak — server-client sinxronlanishi uchun.`,
    },
    {
      question: 'abortNavigation() va navigateTo() farqi nima?',
      answer: `navigateTo("/login") — foydalanuvchini boshqa sahifaga yo'naltiradi. Redirect. abortNavigation() — navigatsiyani TO'XTATADI, foydalanuvchi hozirgi sahifada qoladi. abortNavigation(createError({...})) — xatolik sahifasini ko'rsatadi (403, 404). Qachon nima: login kerak bo'lsa navigateTo, ruxsat yo'q bo'lsa abortNavigation + 403, sahifa topilmasa abortNavigation + 404. return yo'q bo'lsa — navigatsiya davom etadi (ruxsat berildi).`,
    },
    {
      question: 'Nuxt middleware va React protected routes ni taqqoslang.',
      answer: `Nuxt: middleware/ papkada alohida fayl, definePageMeta({ middleware: "auth" }) bilan ulash. Server va client da ishlaydi (SSR). Global middleware bilan barcha sahifalarni himoyalash oson. React: odatda ProtectedRoute wrapper komponent, yoki React Router loader-da tekshirish. Faqat client da ishlaydi (SSR uchun Next.js middleware kerak). Nuxt afzalligi: framework darajasida qo'llab-quvvat, alohida fayllar, global middleware. React: ko'proq qolda implement, lekin yanada flexible.`,
    },
  ],
  relatedTopics: [
    { techId: 'nuxt-js', sectionId: 'nuxt-core', topicId: 'file-routing', label: 'File-based Routing' },
    { techId: 'nuxt-js', sectionId: 'nuxt-core', topicId: 'nuxt-intro', label: 'Nuxt 3 Kirish' },
    { techId: 'react-js', sectionId: 'routing', topicId: 'protected-routes', label: 'Protected Routes' },
    { techId: 'react-js', sectionId: 'routing', topicId: 'loaders-actions', label: 'Loaders & Actions' },
  ],
}
