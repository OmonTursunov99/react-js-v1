import type { Topic } from '../../../types'

export const fileRouting: Topic = {
  id: 'file-routing',
  title: 'File-based Routing',
  importance: 3,
  status: 'to-learn',
  description: 'pages/ directory, dynamic routes, nested routes, definePageMeta',
  content: `Nuxt 3 da routing avtomatik — pages/ papkadagi fayl tuzilmasi route-larga aylanadi. Vue Router qolda sozlash SHART EMAS.

═══════════════════════════════════════
  PAGES/ DIRECTORY — AVTOMATIK ROUTELAR
═══════════════════════════════════════

Fayl tuzilmasi to'g'ridan-to'g'ri URL ga mos keladi:

  pages/
  ├── index.vue          → /
  ├── about.vue          → /about
  ├── contact.vue        → /contact
  └── blog/
      ├── index.vue      → /blog
      └── archive.vue    → /blog/archive

Har bir .vue fayl AVTOMATIK route bo'ladi.
Vue Router konfiguratsiyasi KERAK EMAS.

MUHIM: pages/ papka mavjud bo'lmasa, Nuxt file routing-ni
o'chirib qo'yadi — app.vue to'g'ridan-to'g'ri ishlatiladi.

═══════════════════════════════════════
  DYNAMIC ROUTES
═══════════════════════════════════════

Kvadrat qavslar [...] bilan dinamik segment:

  pages/
  ├── users/
  │   ├── index.vue      → /users
  │   └── [id].vue       → /users/:id (users/42, users/ali)
  ├── blog/
  │   └── [slug].vue     → /blog/:slug (blog/my-post)
  └── [...slug].vue      → catch-all (404 sahifa)

[id].vue ichida parametr olish:

  const route = useRoute()
  const id = route.params.id   // "42"

Catch-all route — [...slug].vue:
  /any/path/here → params.slug = ["any", "path", "here"]
  404 sahifa sifatida ishlatiladi

Ko'p parametrli route:
  pages/[category]/[id].vue → /electronics/42
  route.params.category = "electronics"
  route.params.id = "42"

═══════════════════════════════════════
  NESTED ROUTES (ICHKI ROUTELAR)
═══════════════════════════════════════

Parent fayl + bir xil nomdagi papka = nested route:

  pages/
  ├── users.vue          → parent layout (/users)
  └── users/
      ├── index.vue      → /users (child)
      └── [id].vue       → /users/:id (child)

users.vue — parent (layout vazifasini bajaradi):
  <template>
    <div>
      <h1>Foydalanuvchilar</h1>
      <NuxtPage />   <!-- child route shu yerda renderlanadi -->
    </div>
  </template>

MUHIM: Parent faylda <NuxtPage /> bo'lishi SHART.
Aks holda child route-lar ko'rinmaydi.

Bu React Router-dagi Outlet komponentiga o'xshash:
  Vue/Nuxt: <NuxtPage />
  React Router: <Outlet />

═══════════════════════════════════════
  DEFINEPAGEMETA
═══════════════════════════════════════

Har bir sahifaga metadata berish — layout, middleware, title:

  <script setup lang="ts">
  definePageMeta({
    // Layout tanlash
    layout: "admin",       // layouts/admin.vue ishlatiladi
    layout: false,         // layout ishlatilmaydi

    // Middleware
    middleware: "auth",                // bitta
    middleware: ["auth", "verified"],   // bir nechta

    // SEO
    title: "Bosh sahifa",

    // Custom meta
    requiresAuth: true,
    role: "admin",
  })
  </script>

MUHIM: definePageMeta compile-time macro — faqat
statik qiymatlar (string, array, object literal) ishlaydi.
ref(), computed() — ISHLAMAYDI.

═══════════════════════════════════════
  NAVIGATSIYA — USEROUTE, USEROUTER
═══════════════════════════════════════

useRoute() — hozirgi route ma'lumotlari:
  const route = useRoute()
  route.params.id        — dinamik parametr
  route.query.search     — query string (?search=vue)
  route.path             — /users/42
  route.fullPath         — /users/42?tab=posts
  route.name             — route nomi
  route.meta             — definePageMeta dan

useRouter() — navigatsiya qilish:
  const router = useRouter()
  router.push("/about")
  router.replace("/login")
  router.back()
  router.forward()

navigateTo() — Nuxt helper (server-side ham ishlaydi):
  navigateTo("/about")
  navigateTo("/login", { replace: true })
  navigateTo("https://google.com", { external: true })

MUHIM: Server-side da (middleware, plugin) useRouter ISHLAMAYDI.
navigateTo() har joyda ishlaydi — shuning uchun Nuxt-da shu afzal.

═══════════════════════════════════════
  NUXTLINK — NAVIGATSIYA KOMPONENTI
═══════════════════════════════════════

  <NuxtLink to="/about">Haqida</NuxtLink>
  <NuxtLink :to="{ path: '/users', query: { page: 2 } }">
    Foydalanuvchilar
  </NuxtLink>
  <NuxtLink to="https://google.com" external>Google</NuxtLink>

NuxtLink afzalliklari:
  - Avtomatik prefetching (viewport ga kirganda)
  - Active klass avtomatik qo'shiladi
  - Ichki va tashqi link-larni farqlaydi

═══════════════════════════════════════
  REACT ROUTER BILAN TAQQOSLASH
═══════════════════════════════════════

  Nuxt                    | React Router
  ────────────────────────|──────────────────────
  pages/about.vue         | Qolda route yozish
  [id].vue                | :id param
  [...slug].vue           | * (catch-all)
  <NuxtPage />            | <Outlet />
  <NuxtLink>              | <Link> / <NavLink>
  definePageMeta          | loader metadata
  navigateTo()            | useNavigate()
  useRoute()              | useParams() + useLocation()`,
  codeExamples: [
    {
      title: 'Dynamic routes — parametrlar bilan sahifa',
      language: 'ts',
      code: `// pages/users/[id].vue
// <script setup lang="ts">
interface User {
  id: number
  name: string
  email: string
  role: string
}

// URL parametr: /users/42 -> id = "42"
const route = useRoute()
const userId = computed(() => Number(route.params.id))

// Ma'lumot yuklash
const { data: user, error } = await useFetch<User>(
  "/api/users/" + route.params.id
)

// 404 tekshirish
if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Foydalanuvchi topilmadi",
  })
}

// SEO
useHead({
  title: user.value?.name ?? "Foydalanuvchi",
})
// </script>

// <template>
//   <div v-if="user" class="user-profile">
//     <h1>{{ user.name }}</h1>
//     <p>{{ user.email }}</p>
//     <p>Role: {{ user.role }}</p>
//     <NuxtLink to="/users">Orqaga</NuxtLink>
//   </div>
// </template>`,
      description: 'Dynamic route: [id].vue. useRoute().params.id bilan parametr olish, useFetch bilan data yuklash.',
    },
    {
      title: 'Nested routes — parent/child tuzilma',
      language: 'ts',
      code: `// pages/dashboard.vue — PARENT (layout)
// <script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "auth",
})

const tabs = [
  { label: "Umumiy", to: "/dashboard" },
  { label: "Statistika", to: "/dashboard/stats" },
  { label: "Sozlamalar", to: "/dashboard/settings" },
]
// </script>

// <template>
//   <div class="dashboard">
//     <nav class="dashboard-tabs">
//       <NuxtLink v-for="tab in tabs" :key="tab.to"
//         :to="tab.to"
//         class="tab"
//         active-class="tab--active">
//         {{ tab.label }}
//       </NuxtLink>
//     </nav>
//
//     <!-- Child route shu yerda renderlanadi -->
//     <NuxtPage />
//   </div>
// </template>


// pages/dashboard/index.vue — /dashboard (default child)
// <template>
//   <div>
//     <h2>Umumiy ko'rinish</h2>
//     <p>Dashboard bosh sahifasi</p>
//   </div>
// </template>


// pages/dashboard/stats.vue — /dashboard/stats
// <template>
//   <div>
//     <h2>Statistika</h2>
//   </div>
// </template>


// pages/dashboard/settings.vue — /dashboard/settings
// <template>
//   <div>
//     <h2>Sozlamalar</h2>
//   </div>
// </template>`,
      description: 'Nested routes: dashboard.vue (parent) + dashboard/ (children). NuxtPage = React Outlet.',
    },
    {
      title: 'Catch-all va 404 sahifa',
      language: 'ts',
      code: `// pages/[...slug].vue — barcha noma'lum URL-lar uchun
// <script setup lang="ts">
const route = useRoute()

// /unknown/path/here -> slug = ["unknown", "path", "here"]
const slug = route.params.slug as string[]

// 404 error berish (Nuxt error page ko'rsatadi)
throw createError({
  statusCode: 404,
  statusMessage: "Sahifa topilmadi",
  fatal: true, // error page ko'rsatiladi
})
// </script>


// error.vue — global error page (app.vue darajasida)
// <script setup lang="ts">
interface ErrorProps {
  error: {
    statusCode: number
    statusMessage: string
    message: string
  }
}

const props = defineProps<ErrorProps>()

function handleClearError() {
  clearError({ redirect: "/" })
}
// </script>

// <template>
//   <div class="error-page">
//     <h1>{{ error.statusCode }}</h1>
//     <p>{{ error.statusMessage }}</p>
//     <button @click="handleClearError">
//       Bosh sahifaga qaytish
//     </button>
//   </div>
// </template>


// Alohida sahifada error handling:
// showError({ statusCode: 403, statusMessage: "Ruxsat yo'q" })
// clearError() — error holatini tozalash`,
      description: 'Catch-all [...slug].vue 404 uchun. createError + error.vue bilan xatolik sahifasi.',
    },
    {
      title: 'definePageMeta va navigatsiya',
      language: 'ts',
      code: `// pages/admin/users.vue
// <script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth", "admin-only"],
  title: "Foydalanuvchilar",

  // Custom metadata — middleware da foydalanish uchun
  requiredRole: "admin",
})

// Navigatsiya usullari
const router = useRouter()

function goToUser(id: number) {
  // Variant 1: router.push
  router.push("/admin/users/" + id)

  // Variant 2: navigateTo (Nuxt helper — server da ham ishlaydi)
  navigateTo("/admin/users/" + id)

  // Variant 3: query parametrlar bilan
  navigateTo({
    path: "/admin/users",
    query: { page: 2, sort: "name" },
  })

  // Variant 4: tashqi URL
  navigateTo("https://docs.nuxt.com", { external: true })

  // Variant 5: replace (history ga qo'shilmaydi)
  navigateTo("/login", { replace: true })
}

// Route o'zgarishini kuzatish
const route = useRoute()
watch(() => route.query.page, (newPage) => {
  // Query o'zgarganda ma'lumot qayta yuklash
  console.log("Sahifa:", newPage)
})
// </script>

// <template>
//   <div>
//     <NuxtLink to="/admin/users?page=1">1-sahifa</NuxtLink>
//     <NuxtLink :to="{ path: '/admin/users', query: { page: 2 } }">
//       2-sahifa
//     </NuxtLink>
//   </div>
// </template>`,
      description: 'definePageMeta bilan layout, middleware, meta berish. navigateTo() — universal navigatsiya.',
    },
  ],
  interviewQA: [
    {
      question: 'Nuxt file-based routing qanday ishlaydi? Vue Router kerak emasmi?',
      answer: `Nuxt pages/ papkadagi fayl tuzilmasini build vaqtida skanlaydi va avtomatik Vue Router konfiguratsiya yaratadi. Har bir .vue fayl = bitta route. index.vue = /, about.vue = /about, users/[id].vue = /users/:id. Qolda Vue Router sozlash SHART EMAS — Nuxt hammani bajaradi. Lekin kerak bo'lsa, nuxt.config.ts da routeRules va app/router.options.ts orqali kengaytirish mumkin. Bu Next.js App Router bilan bir xil konsepsiya.`,
    },
    {
      question: 'Dynamic route va catch-all route farqi nimada?',
      answer: `Dynamic route [id].vue — bitta URL segmentiga mos keladi: /users/42, /users/ali. params.id = "42". Catch-all [...slug].vue — ixtiyoriy sondagi segmentlarga mos keladi: /a/b/c/d -> params.slug = ["a","b","c","d"]. Catch-all odatda 404 sahifa yoki CMS slug-lar uchun ishlatiladi. Dynamic route BITTA segmentni, catch-all ko'p segmentni ushlaydi. Ikkalasi ham params orqali qiymat beradi.`,
    },
    {
      question: 'Nested routes qanday ishlaydi? NuxtPage nima?',
      answer: `Parent fayl + bir xil nomdagi papka = nested route. Masalan: users.vue (parent) + users/ (children). Parent faylda <NuxtPage /> bo'lishi shart — child route shu joyda renderlanadi. Bu React Router-dagi <Outlet /> komponentiga to'liq analog. Nested routes asosan tab interfeys, dashboard, multi-step form uchun ishlatiladi — parent layout saqlanadi, faqat child qism almashadi.`,
    },
    {
      question: 'definePageMeta va useHead farqi nima?',
      answer: `definePageMeta — compile-time macro. Faqat statik qiymatlar (string, literal). Layout, middleware, custom meta uchun ishlatiladi. Route meta-ga tushadi (route.meta). useHead — runtime composable. Dinamik qiymatlar (ref, computed) ishlaydi. HTML head (title, meta, link, script) uchun ishlatiladi. Masalan: definePageMeta({ layout: "admin", middleware: "auth" }) va useHead({ title: user.value?.name }) — birgalikda ishlatiladi.`,
    },
    {
      question: 'navigateTo() va router.push() farqi nima?',
      answer: `navigateTo() — Nuxt helper, HAR JOYDA ishlaydi: komponent, middleware, plugin, server. router.push() — Vue Router metodi, faqat KLIENT tomonda ishlaydi. Server-side rendering vaqtida, middleware ichida navigateTo() ishlatish SHART — router.push() xato beradi. navigateTo() tashqi URL-larni ham boshqaradi ({ external: true }). Amalda Nuxt loyihada DOIM navigateTo() ishlatish afzal — universal va xavfsiz.`,
    },
    {
      question: 'Nuxt routing va React Router-ni taqqoslang.',
      answer: `Nuxt: file-based (avtomatik), pages/ papka = routelar. React Router: konfiguratsiya asosida (createBrowserRouter). Nuxt-da [id].vue = React Router :id. Nuxt <NuxtPage /> = React <Outlet />. Nuxt <NuxtLink> = React <Link>/<NavLink>. Nuxt definePageMeta = React loader metadata. Nuxt navigateTo() = React useNavigate(). Asosiy farq — Nuxt-da hech narsa qolda yozish kerak emas, React Router-da barcha route-larni qolda ro'yxatga olish kerak. Nuxt afzalligi — konventsiya asosida, React Router afzalligi — to'liq nazorat.`,
    },
  ],
  relatedTopics: [
    { techId: 'nuxt-js', sectionId: 'nuxt-core', topicId: 'nuxt-intro', label: 'Nuxt 3 Kirish' },
    { techId: 'nuxt-js', sectionId: 'nuxt-core', topicId: 'nuxt-middleware', label: 'Middleware' },
    { techId: 'react-js', sectionId: 'routing', topicId: 'react-router-basics', label: 'React Router Basics' },
    { techId: 'react-js', sectionId: 'routing', topicId: 'nested-layouts', label: 'Nested Layouts' },
  ],
}
