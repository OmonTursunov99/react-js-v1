import type { Topic } from '../../../types'

export const programmaticNavigation: Topic = {
  id: 'programmatic-navigation',
  title: 'Programmatik Navigatsiya',
  importance: 2,
  status: 'to-learn',
  description: 'useRouter(), useRoute(), router.push(), replace(), go() — kod orqali navigatsiya',
  content: `Programmatik navigatsiya — <RouterLink> o'rniga JavaScript kodi orqali sahifalar orasida o'tish. Form submit, auth redirect, conditional navigation kabi holatlarda zarur bo'ladi.

═══════════════════════════════════════
  useRouter() VA useRoute()
═══════════════════════════════════════

Composition API da ikkita asosiy composable mavjud:

useRouter() — router instance-ni qaytaradi. Navigatsiya QILISH uchun:
  const router = useRouter()
  router.push('/about')

useRoute() — joriy route object-ni qaytaradi. Ma'lumot O'QISH uchun:
  const route = useRoute()
  console.log(route.params.id)   // URL parametri
  console.log(route.query.page)  // query parametri
  console.log(route.name)        // route nomi
  console.log(route.fullPath)    // to'liq URL

MUHIM FARQ:
- useRouter() — singleton, o'zgarmaydi, reaktiv EMAS
- useRoute() — reaktiv, route o'zgarganda yangilanadi
- useRoute() — faqat setup() yoki <script setup> ichida chaqirish mumkin

Options API da:
  this.$router — useRouter() ga teng
  this.$route — useRoute() ga teng

═══════════════════════════════════════
  router.push()
═══════════════════════════════════════

push() — yangi entry qo'shadi browser history-ga. Foydalanuvchi "Orqaga" tugmasi bilan qaytishi mumkin.

  // String path
  router.push('/about')

  // Object — name bilan (TAVSIYA ETILADI)
  router.push({ name: 'user', params: { id: 42 } })

  // Object — path bilan (params ISHLAMAYDI, faqat query)
  router.push({ path: '/user/42', query: { tab: 'posts' } })

  // Hash bilan
  router.push({ path: '/about', hash: '#team' })

QOIDA: name + params YOKI path + query. path bilan params berish XATO — params e'tiborga olinmaydi.

push() — Promise qaytaradi:
  const failure = await router.push('/about')
  if (failure) {
    // Navigatsiya muvaffaqiyatsiz — guard to'xtatdi yoki duplicate
  }

═══════════════════════════════════════
  router.replace() VA router.go()
═══════════════════════════════════════

replace() — history-ga yangi entry QO'SHMAYDI. Joriy entry-ni almashtiradi.
Foydalanuvchi "Orqaga" tugmasi bilan QAYTOLMAYDI.

  router.replace('/login')
  // YOKI
  router.push({ path: '/login', replace: true })

replace() ishlatiladi:
- Login redirect dan keyin (orqaga login sahifaga qaytmaslik uchun)
- 404 sahifaga yo'naltirganda
- Filter/sort o'zgarganda URL yangilash

go() — history stack bo'ylab harakatlanish:
  router.go(-1)    // orqaga (browser "Back" tugmasi)
  router.go(1)     // oldinga
  router.go(-3)    // 3 ta orqaga

router.back() === router.go(-1)
router.forward() === router.go(1)

═══════════════════════════════════════
  NAVIGATION FAILURES
═══════════════════════════════════════

push() va replace() Promise qaytaradi. Muvaffaqiyatsiz bo'lsa — NavigationFailure object:

  import { isNavigationFailure, NavigationFailureType } from 'vue-router'

  const failure = await router.push('/admin')

  if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
    // Guard to'xtatdi — masalan, auth kerak
  }
  if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
    // Allaqachon shu sahifadasiz
  }

Failure turlari:
- aborted — guard false qaytardi
- cancelled — yangi navigatsiya boshlandi, eski bekor bo'ldi
- duplicated — allaqachon shu route-da

═══════════════════════════════════════
  TYPED ROUTES
═══════════════════════════════════════

Vue Router unplugin-vue-router bilan typed routes qo'llab-quvvatlaydi:

  // O'rniga: router.push({ name: 'user', params: { id: '42' } })
  // Typed: router.push({ name: '/user/[id]', params: { id: '42' } })

Bu TypeScript xatolarini route nomlari va params da aniqlash imkonini beradi. Noto'g'ri route nomi yoki etishmayotgan param — compile vaqtida xato beradi.

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React Router: useNavigate() — navigatsiya uchun. navigate("/about") yoki navigate(-1).
Vue Router: useRouter() — router.push("/about") yoki router.go(-1).

React: useParams() — faqat params. useSearchParams() — query uchun alohida hook.
Vue: useRoute() — params, query, hash, meta — hammasi bitta object-da.

React navigate() — options: { replace: true, state: {...} }
Vue router.push() — { replace: true } yoki alohida router.replace()

React-da typed routes uchun alohida kutubxona kerak (tanstack/router).
Vue-da unplugin-vue-router rasmiy yechim.

React useNavigate() har renderda yangi funksiya qaytaradi. Vue useRouter() — singleton, o'zgarmaydi, referential stability kafolatlangan.`,
  codeExamples: [
    {
      title: 'Asosiy programmatik navigatsiya',
      language: 'html',
      code: `<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Form submit dan keyin navigatsiya
async function handleLogin(credentials: { email: string; password: string }) {
  try {
    await loginApi(credentials)

    // Redirect query-dan qaytarish URL ni olish
    const redirectTo = route.query.redirect as string
    // replace — orqaga login sahifaga qaytmaslik uchun
    router.replace(redirectTo || '/dashboard')
  } catch (error) {
    console.error('Login xato:', error)
  }
}

// Shartli navigatsiya
function goToProfile(userId: number) {
  router.push({
    name: 'user-profile',
    params: { id: userId },
    query: { tab: 'posts' },
  })
}

// Orqaga qaytish
function goBack() {
  // Agar history bo'sh bo'lsa — bosh sahifaga
  if (window.history.length <= 1) {
    router.push('/')
  } else {
    router.back()
  }
}

// URL query ni yangilash (sahifani o'zgartirmasdan)
function updateFilters(filters: Record<string, string>) {
  router.replace({
    query: { ...route.query, ...filters },
  })
}

async function loginApi(creds: any) { /* ... */ }
</script>

<template>
  <form @submit.prevent="handleLogin({ email: '', password: '' })">
    <!-- form fields -->
    <button type="submit">Kirish</button>
  </form>

  <button @click="goBack">Orqaga</button>
  <button @click="updateFilters({ sort: 'date', order: 'desc' })">
    Saralash
  </button>
</template>`,
      description: 'Amaliy misollar: login redirect, shartli navigatsiya, orqaga qaytish, query yangilash.',
    },
    {
      title: 'Navigation failure handling',
      language: 'ts',
      code: `import {
  useRouter,
  isNavigationFailure,
  NavigationFailureType,
} from 'vue-router'

const router = useRouter()

// Xavfsiz navigatsiya wrapper
async function safeNavigate(
  to: Parameters<typeof router.push>[0]
) {
  try {
    const failure = await router.push(to)

    if (failure) {
      if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
        console.warn('Navigatsiya to\\'xtatildi (guard)')
        // Toast notification ko'rsatish
        showToast('Bu sahifaga kirish ruxsati yo\\'q', 'warning')
      }

      if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
        // Allaqachon shu sahifada — xato emas
        console.info('Allaqachon shu sahifadasiz')
      }

      if (isNavigationFailure(failure, NavigationFailureType.cancelled)) {
        console.info('Navigatsiya bekor qilindi (yangi navigatsiya)')
      }

      return false
    }

    return true  // Muvaffaqiyatli
  } catch (error) {
    console.error('Navigatsiya xatosi:', error)
    return false
  }
}

// Ishlatish:
async function handleAction() {
  const success = await safeNavigate({ name: 'admin' })
  if (!success) {
    // Fallback logic
  }
}

function showToast(msg: string, type: string) { /* ... */ }`,
      description: 'NavigationFailure turlari — aborted, duplicated, cancelled. Xavfsiz navigatsiya wrapper funksiya.',
    },
    {
      title: 'useRoute() reaktivlik va computed',
      language: 'html',
      code: `<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// route.params — reaktiv (route o'zgarganda yangilanadi)
const userId = computed(() => route.params.id as string)
const currentTab = computed(() => (route.query.tab as string) || 'overview')
const currentPage = computed(() => Number(route.query.page) || 1)

// Route o'zgarishini kuzatish
watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId !== oldId) {
      // Yangi user ma'lumotini yuklash
      await loadUser(newId as string)
    }
  },
  { immediate: true }  // Birinchi yuklashda ham ishlaydi
)

// Tab o'zgartirish — URL query orqali
function changeTab(tab: string) {
  router.replace({
    query: { ...route.query, tab },
  })
}

// Pagination — URL query orqali
function changePage(page: number) {
  router.push({
    query: { ...route.query, page: page.toString() },
  })
}

async function loadUser(id: string) {
  console.log('Loading user:', id)
}
</script>

<template>
  <div>
    <h1>User #{{ userId }}</h1>

    <!-- Tab navigatsiya — URL bilan sinxron -->
    <nav>
      <button
        v-for="tab in ['overview', 'posts', 'settings']"
        :key="tab"
        :class="{ active: currentTab === tab }"
        @click="changeTab(tab)"
      >
        {{ tab }}
      </button>
    </nav>

    <!-- Pagination -->
    <div>
      <button :disabled="currentPage <= 1" @click="changePage(currentPage - 1)">
        Oldingi
      </button>
      <span>Sahifa {{ currentPage }}</span>
      <button @click="changePage(currentPage + 1)">
        Keyingi
      </button>
    </div>
  </div>
</template>`,
      description: 'useRoute() reaktivligi — computed bilan params/query olish, watch bilan kuzatish, URL-driven tabs va pagination.',
    },
    {
      title: 'Navigatsiya bilan state uzatish',
      language: 'ts',
      code: `import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// ===== State uzatish usullari =====

// 1. Params orqali (URL-da ko'rinadi)
router.push({
  name: 'user',
  params: { id: '42' },
})
// URL: /user/42
// route.params.id === '42'

// 2. Query orqali (URL-da ko'rinadi)
router.push({
  name: 'search',
  query: { q: 'vue router', page: '1', sort: 'date' },
})
// URL: /search?q=vue+router&page=1&sort=date
// route.query.q === 'vue router'

// 3. Hash orqali
router.push({
  path: '/docs',
  hash: '#installation',
})
// URL: /docs#installation
// route.hash === '#installation'

// 4. History state orqali (URL-da ko'rinMAYDI)
router.push({
  name: 'order-confirmation',
  // state — URL-da ko'rinmaydi, lekin history.state da saqlanadi
  state: {
    orderId: 12345,
    fromCart: true,
  },
})
// Qabul qilish:
// const state = history.state as { orderId: number; fromCart: boolean }
// EHTIYOT: state sahifa refresh qilinganda yo'qolishi mumkin

// 5. Pinia store orqali (murakkab ma'lumotlar uchun)
// orderStore.setCurrentOrder(orderData)
// router.push({ name: 'order-confirmation' })
// Komponentda: const order = orderStore.currentOrder`,
      description: 'Sahifalar orasida ma\'lumot uzatishning 5 usuli — params, query, hash, history state, va store.',
    },
  ],
  interviewQA: [
    {
      question: 'router.push() va router.replace() farqi nima? Qachon replace ishlatiladi?',
      answer: `push() browser history-ga yangi entry qo'shadi — foydalanuvchi "Orqaga" tugmasi bilan qaytishi mumkin. replace() joriy entry-ni almashtiradi — history-da iz qoldirmaydi. replace() ishlatiladi: 1) Login dan keyin redirect — orqaga login sahifaga qaytmaslik uchun. 2) 404/403 sahifaga yo'naltirganda. 3) URL query/hash yangilashda (filter, sort, tab o'zgartirish) — har bir o'zgartirish uchun history entry keraksiz. 4) Wizard/step formada orqaga qaytishni oldini olish. 5) OAuth callback sahifasidan redirect qilganda. Umumiy qoida: agar foydalanuvchi "Orqaga" bosganda shu sahifaga qaytishi mantiqiy bo'lmasa — replace() ishlatiladi.`,
    },
    {
      question: 'useRoute() va useRouter() farqi nima? Nima uchun ikkita alohida composable?',
      answer: `useRouter() — router instance-ni qaytaradi. Bu singleton — hech qachon o'zgarmaydi. Navigatsiya QILISH uchun ishlatiladi: push(), replace(), go(), back(). U reaktiv EMAS — komponentni qayta renderlamaydi. useRoute() — joriy route object-ni qaytaradi. Bu REAKTIV — route o'zgarganda (URL, params, query) komponent qayta render bo'ladi. Ma'lumot O'QISH uchun: params, query, hash, name, meta. Nima uchun alohida: separation of concerns — router HARAKATLAR uchun (imperative), route MA'LUMOT uchun (reactive). Bu React-dan farqli — React-da useNavigate() va useParams()/useSearchParams() alohida hook-lar.`,
    },
    {
      question: 'path bilan params bersa nima bo\'ladi? Bu nima uchun xato?',
      answer: `router.push({ path: "/user", params: { id: 42 } }) — params e'tiborga olinMAYDI. Bu Vue Router-ning ataylab qilingan cheklovi. Sabab: path — to'liq URL ni bildiradi, params esa route konfiguratsiyasidagi :param placeholder-larga mos keladi. Agar path berilsa — Vue Router params-ni qayerga qo'yishni bilmaydi. To'g'ri usullar: 1) name + params: { name: "user", params: { id: 42 } } — route nomidan params pozitsiyasini aniqlaydi. 2) path bilan to'liq URL: { path: "/user/42" }. 3) path + query: { path: "/user", query: { id: 42 } } — query parametr sifatida. Bu TypeScript da xato bermaydi — shuning uchun typed routes (unplugin-vue-router) ishlatish tavsiya etiladi.`,
    },
    {
      question: 'Sahifalar orasida murakkab ma\'lumot (object, array) qanday uzatiladi?',
      answer: `Bir necha usul bor: 1) URL params/query — faqat string. Object uchun JSON.stringify mumkin, lekin URL uzunligi cheklangan va xunuk ko'rinadi. Faqat oddiy qiymatlar uchun. 2) History state — router.push({ path: "/page", state: { data: object } }). URL-da ko'rinmaydi, lekin sahifa refresh-da yo'qolishi mumkin va faqat serializable data. 3) Pinia store — eng ishonchli usul. Ma'lumotni store-ga yozib, keyingi sahifada o'qish. Persist plugin bilan refresh-dan himoya. 4) URL + API — ID ni URL-ga qo'yib, keyingi sahifada API dan ma'lumot yuklash. Bu eng to'g'ri arxitektura — URL bookmark qilsa ham ishlaydi. Amaliyotda: oddiy qiymatlar — URL, murakkab — store, universal — URL ID + API fetch.`,
    },
    {
      question: 'Vue Router da typed routes nima va qanday ishlaydi?',
      answer: `Typed routes — unplugin-vue-router kutubxonasi orqali route nomlari va params-larni TypeScript bilan tekshirish. Oddiy Vue Router-da router.push({ name: "noto'g'ri-nom" }) — runtime xato beradi, compile vaqtida yo'q. unplugin-vue-router file-based routing yordamida type-lar avtomatik generatsiya qilinadi. Masalan: src/pages/user/[id].vue → route nomi "/user/[id]", params: { id: string }. Noto'g'ri nom yoki etishmayotgan param — TypeScript xato beradi. Bu React-dagi TanStack Router typed routes-ga o'xshash. O'rnatish: vite.config.ts da plugin qo'shish, keyin typed-router.d.ts avtomatik generatsiya bo'ladi. Katta loyihalarda bug-larni oldini olish uchun juda foydali.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-router', topicId: 'router-basics', label: 'Router asoslari' },
    { techId: 'vue-js', sectionId: 'vue-router', topicId: 'navigation-guards', label: 'Navigation Guards' },
    { techId: 'vue-js', sectionId: 'vue-router', topicId: 'route-meta', label: 'Route Meta' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'composition-api', label: 'Composition API' },
  ],
}
