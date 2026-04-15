import type { Topic } from '../../../types'

export const routeMeta: Topic = {
  id: 'route-meta',
  title: 'Route Meta Fields',
  importance: 2,
  status: 'to-learn',
  description: 'meta fields, TypeScript augmentation, auth/roles, page titles, breadcrumbs, data fetching',
  content: `Route meta — har bir route-ga qo'shimcha ma'lumot biriktirish mexanizmi. Autentifikatsiya, ruxsatlar, sahifa sarlavhalari, breadcrumb va boshqa meta-ma'lumotlar uchun ishlatiladi.

═══════════════════════════════════════
  META FIELDS ASOSLARI
═══════════════════════════════════════

Har bir route konfiguratsiyasida meta property qo'shish mumkin:

  const routes = [
    {
      path: '/dashboard',
      component: DashboardPage,
      meta: {
        requiresAuth: true,
        roles: ['admin', 'editor'],
        title: 'Dashboard',
        icon: 'chart',
        transition: 'slide',
      }
    }
  ]

meta — ixtiyoriy object, istalgan property qo'shish mumkin. Vue Router uni hech qanday o'zgartirmaydi — siz yozasiz, siz o'qiysiz.

O'qish: route.meta.requiresAuth
Guard-da: to.meta.requiresAuth
Template-da: $route.meta.title

MUHIM: nested route-larda meta MEROS QOLMAYDI. Har bir route o'z meta-siga ega. Lekin route.matched massivi orqali barcha parent-larning meta-sini tekshirish mumkin.

═══════════════════════════════════════
  TYPESCRIPT AUGMENTATION
═══════════════════════════════════════

Default holatda meta any tipiga ega. TypeScript bilan xavfsiz qilish uchun RouteMeta interface-ni kengaytirish kerak:

  // src/router/types.ts yoki env.d.ts
  import 'vue-router'

  declare module 'vue-router' {
    interface RouteMeta {
      requiresAuth?: boolean
      roles?: string[]
      title?: string
      icon?: string
      transition?: 'fade' | 'slide' | 'none'
      breadcrumb?: string | ((route: RouteLocationNormalized) => string)
    }
  }

Endi route.meta.requiresAuth — boolean | undefined (any emas).
Noto'g'ri property ishlatilsa TypeScript xato beradi.

Declaration merging — TypeScript module augmentation texnologiyasi. Bu Vue Router, Pinia, va boshqa kutubxonalar uchun keng ishlatiladi.

═══════════════════════════════════════
  AUTH VA ROLES META
═══════════════════════════════════════

Eng ko'p uchraydigan pattern — auth va role-based access control:

  // Route konfiguratsiya
  { path: '/admin', meta: { requiresAuth: true, roles: ['admin'] } }
  { path: '/profile', meta: { requiresAuth: true } }
  { path: '/login', meta: { guest: true } }  // faqat login qilmagan

  // Guard
  router.beforeEach((to) => {
    const auth = useAuthStore()

    // requiresAuth tekshirish — matched dagi BARCHA route-larni
    if (to.matched.some(r => r.meta.requiresAuth) && !auth.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    // Role tekshirish
    const requiredRoles = to.meta.roles
    if (requiredRoles && !requiredRoles.includes(auth.user?.role)) {
      return { name: 'forbidden' }
    }
  })

to.matched.some() — nested route-larda parent-ning meta-sini ham tekshiradi. Masalan /admin/users da parent /admin ning meta.requiresAuth ni ko'radi.

═══════════════════════════════════════
  PAGE TITLES
═══════════════════════════════════════

afterEach guard bilan sahifa sarlavhasini avtomatik o'zgartirish:

  router.afterEach((to) => {
    const title = to.meta.title
    document.title = title
      ? title + ' | My App'
      : 'My App'
  })

Dinamik title uchun (masalan, user ismi):
  meta: {
    title: (route) => 'User: ' + route.params.id
  }
  // Guard-da:
  const title = typeof to.meta.title === 'function'
    ? to.meta.title(to) : to.meta.title

═══════════════════════════════════════
  BREADCRUMBS
═══════════════════════════════════════

route.matched — barcha mos kelgan route record-lar massivi. Bu breadcrumb yaratish uchun ideal:

  // /admin/products/42 → matched = [AdminLayout, ProductsLayout, ProductEdit]
  const breadcrumbs = computed(() =>
    route.matched
      .filter(r => r.meta.breadcrumb)
      .map(r => ({
        label: typeof r.meta.breadcrumb === 'function'
          ? r.meta.breadcrumb(route)
          : r.meta.breadcrumb,
        path: r.path.replace(/:(\w+)/g, (_, key) =>
          route.params[key] as string
        ),
      }))
  )

═══════════════════════════════════════
  DATA FETCHING PATTERNS
═══════════════════════════════════════

Ikki yondashuv mavjud:

1. Navigatsiyadan OLDIN yuklash (before navigation):
   beforeResolve guard-da ma'lumot yuklanadi. Sahifa faqat data tayyor bo'lganda ko'rsatiladi. UX: loading bar ko'rsatiladi.

2. Navigatsiyadan KEYIN yuklash (after navigation):
   Sahifa darhol ko'rsatiladi, komponent ichida data yuklanadi. UX: skeleton/spinner komponent ichida.

Vue Router 4.4+ da loader/definePage pattern ham qo'llab-quvvatlanadi — React Router v6.4 loader-lariga o'xshash.

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React Router v6: route element-ga metadata to'g'ridan-to'g'ri biriktirib bo'lmaydi. handle property (v6.4+) yoki wrapper komponent ishlatiladi.

Vue: route.meta — BUILT-IN, birinchi kundan mavjud. Istalgan ma'lumot qo'shish mumkin.
React: useMatches() + handle property — o'xshash, lekin yangi va kamroq qulay.

Vue: TypeScript augmentation — RouteMeta interface kengaytirish.
React: loader/action-larda TypeScript type-lar aniqroq, lekin meta tushunchasi yo'q.

Vue: to.matched.some(r => r.meta.requiresAuth) — nested route-larda parent meta-ni tekshirish.
React: useMatches().some(m => m.handle?.requiresAuth) — o'xshash, lekin handle ixtiyoriy.

Data fetching: React Router v6.4+ da loader() funksiyasi route darajasida — ancha rivojlangan. Vue-da bu pattern hali eksperimental.`,
  codeExamples: [
    {
      title: 'TypeScript bilan meta konfiguratsiya',
      language: 'ts',
      code: `// src/router/types.ts — RouteMeta kengaytirish
import 'vue-router'
import type { RouteLocationNormalized } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    // Auth
    requiresAuth?: boolean
    roles?: ('admin' | 'editor' | 'viewer')[]
    guest?: boolean  // faqat login qilmagan uchun

    // UI
    title?: string | ((route: RouteLocationNormalized) => string)
    icon?: string
    breadcrumb?: string | ((route: RouteLocationNormalized) => string)
    transition?: 'fade' | 'slide-left' | 'slide-right' | 'none'

    // Layout
    hideHeader?: boolean
    hideSidebar?: boolean
    fullWidth?: boolean

    // Data
    preload?: (route: RouteLocationNormalized) => Promise<unknown>
  }
}

// Route konfiguratsiya — endi TypeScript meta ni tekshiradi
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      title: 'Admin Panel',
      breadcrumb: 'Admin',
      icon: 'shield',
    },
    children: [
      {
        path: 'users/:id',
        component: () => import('@/pages/admin/UserPage.vue'),
        meta: {
          title: (route) => \`User #\${route.params.id}\`,
          breadcrumb: (route) => \`User \${route.params.id}\`,
          // roles: ['superadmin'] — TypeScript xato bermaydi (to'g'ri tip)
          // roles: ['hacker'] — TypeScript XATO beradi
        },
      },
    ],
  },
]`,
      description: 'RouteMeta augmentation — TypeScript meta field-larni tekshiradi. Noto\'g\'ri role yoki property — compile xato.',
    },
    {
      title: 'Meta-based guard va page title',
      language: 'ts',
      code: `// src/router/guards.ts
import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function setupGuards(router: Router) {
  // ===== Auth Guard =====
  router.beforeEach((to) => {
    const auth = useAuthStore()

    // Nested route-larda parent meta-ni ham tekshirish
    const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
    const isGuestOnly = to.meta.guest

    if (requiresAuth && !auth.isAuthenticated) {
      return {
        name: 'login',
        query: { redirect: to.fullPath },
      }
    }

    // Guest sahifaga auth qilgan user kirsa
    if (isGuestOnly && auth.isAuthenticated) {
      return { name: 'dashboard' }
    }

    // Role tekshirish
    const requiredRoles = to.meta.roles
    if (requiredRoles?.length && auth.user) {
      if (!requiredRoles.includes(auth.user.role as any)) {
        return { name: 'forbidden' }
      }
    }
  })

  // ===== Data Preloading =====
  router.beforeResolve(async (to) => {
    if (to.meta.preload) {
      try {
        await to.meta.preload(to)
      } catch (error) {
        console.error('Preload xato:', error)
        return { name: 'error' }
      }
    }
  })

  // ===== Page Title =====
  router.afterEach((to) => {
    const baseTitle = 'My App'
    const metaTitle = to.meta.title

    if (!metaTitle) {
      document.title = baseTitle
      return
    }

    const title = typeof metaTitle === 'function'
      ? metaTitle(to)
      : metaTitle

    document.title = \`\${title} | \${baseTitle}\`
  })
}

// main.ts da:
// import { setupGuards } from './router/guards'
// setupGuards(router)`,
      description: 'Guard tizimi — auth, role, data preload, page title. setupGuards() bilan markazlashgan.',
    },
    {
      title: 'Breadcrumb komponenti',
      language: 'html',
      code: `<script setup lang="ts">
// AppBreadcrumb.vue
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

interface BreadcrumbItem {
  label: string
  path: string
  isLast: boolean
}

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = []

  // Bosh sahifa har doim birinchi
  items.push({ label: 'Bosh sahifa', path: '/', isLast: false })

  // matched — barcha mos kelgan route record-lar
  const matched = route.matched.filter(r => r.meta.breadcrumb)

  matched.forEach((record, index) => {
    const meta = record.meta.breadcrumb!
    const label = typeof meta === 'function' ? meta(route) : meta

    // Dinamik params ni path ga joylashtirish
    let path = record.path
    for (const [key, value] of Object.entries(route.params)) {
      path = path.replace(\`:\${key}\`, value as string)
      path = path.replace(\`:\${key}(.*)\`, value as string)
    }

    items.push({
      label,
      path,
      isLast: index === matched.length - 1,
    })
  })

  return items
})
</script>

<template>
  <nav aria-label="Breadcrumb" class="text-sm text-gray-500 mb-4">
    <ol class="flex items-center gap-1">
      <li v-for="(crumb, index) in breadcrumbs" :key="crumb.path" class="flex items-center">
        <!-- Separator -->
        <span v-if="index > 0" class="mx-2 text-gray-400">/</span>

        <!-- Oxirgi element — link emas -->
        <span v-if="crumb.isLast" class="text-gray-900 dark:text-white font-medium">
          {{ crumb.label }}
        </span>

        <!-- Oldingilar — link -->
        <RouterLink
          v-else
          :to="crumb.path"
          class="hover:text-blue-600 transition-colors"
        >
          {{ crumb.label }}
        </RouterLink>
      </li>
    </ol>
  </nav>
</template>`,
      description: 'Avtomatik breadcrumb — route.matched va meta.breadcrumb asosida. Dinamik params bilan ishlaydi.',
    },
    {
      title: 'Meta bilan transition va layout boshqarish',
      language: 'html',
      code: `<script setup lang="ts">
// App.vue — meta-driven transitions va layout
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'

const route = useRoute()

// Meta asosida layout sozlamalari
const showHeader = computed(() => !route.meta.hideHeader)
const showSidebar = computed(() => !route.meta.hideSidebar)
const isFullWidth = computed(() => route.meta.fullWidth)

// Transition nomi — meta dan
const transitionName = computed(() => route.meta.transition || 'fade')
</script>

<template>
  <div class="min-h-screen">
    <AppHeader v-if="showHeader" />

    <div class="flex">
      <AppSidebar v-if="showSidebar" />

      <main :class="isFullWidth ? 'w-full' : 'max-w-5xl mx-auto'">
        <RouterView v-slot="{ Component, route: viewRoute }">
          <Transition :name="transitionName" mode="out-in">
            <component :is="Component" :key="viewRoute.path" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<!--
Route konfiguratsiya misollari:

{ path: '/login', meta: { hideHeader: true, hideSidebar: true, guest: true } }
{ path: '/presentation', meta: { fullWidth: true, hideHeader: true, transition: 'fade' } }
{ path: '/dashboard', meta: { transition: 'slide-left' } }
{ path: '/settings', meta: { transition: 'slide-right' } }
-->

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-left-enter-active, .slide-left-leave-active { transition: transform 0.3s; }
.slide-left-enter-from { transform: translateX(30px); opacity: 0; }
.slide-left-leave-to { transform: translateX(-30px); opacity: 0; }

.slide-right-enter-active, .slide-right-leave-active { transition: transform 0.3s; }
.slide-right-enter-from { transform: translateX(-30px); opacity: 0; }
.slide-right-leave-to { transform: translateX(30px); opacity: 0; }
</style>`,
      description: 'Meta-driven UI — route meta orqali header/sidebar ko\'rsatish, transition turi, va layout kengligini boshqarish.',
    },
    {
      title: 'Data fetching patterns',
      language: 'html',
      code: `<script setup lang="ts">
// PostPage.vue — ikki xil data fetching pattern

// ===== 1. NAVIGATSIYADAN KEYIN YUKLASH (component ichida) =====
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const post = ref<any>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Route o'zgarganda ma'lumot yuklash
watch(
  () => route.params.id,
  async (id) => {
    isLoading.value = true
    error.value = null
    try {
      const res = await fetch(\`/api/posts/\${id}\`)
      if (!res.ok) throw new Error('Post topilmadi')
      post.value = await res.json()
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  },
  { immediate: true }
)
</script>

<template>
  <div v-if="isLoading" class="animate-pulse">Yuklanmoqda...</div>
  <div v-else-if="error" class="text-red-500">{{ error }}</div>
  <article v-else>
    <h1>{{ post.title }}</h1>
    <p>{{ post.body }}</p>
  </article>
</template>

<!--
===== 2. NAVIGATSIYADAN OLDIN YUKLASH (guard orqali) =====

Route konfiguratsiya:
{
  path: '/post/:id',
  component: () => import('@/pages/PostPage.vue'),
  meta: {
    preload: async (to) => {
      const res = await fetch(\`/api/posts/\${to.params.id}\`)
      if (!res.ok) throw new Error('404')
      to.meta._data = await res.json()
    }
  }
}

Komponentda:
const route = useRoute()
const post = computed(() => route.meta._data)
// Ma'lumot TAYYOR — loading holat kerak EMAS

Afzalligi: sahifa faqat data tayyor bo'lganda ko'rsatiladi
Kamchiligi: navigatsiya sekin tuyuladi (loading bar ko'rsatish kerak)
-->`,
      description: 'Ikki pattern: component ichida watch bilan yuklash (tez navigatsiya) va guard orqali preload (data tayyor).',
    },
  ],
  interviewQA: [
    {
      question: 'Route meta nima uchun kerak? Qanday holatlarda ishlatiladi?',
      answer: `Route meta — har bir route-ga qo'shimcha ma'lumot biriktirish uchun. Ishlatilish holatlari: 1) Auth — requiresAuth: true, roles: ["admin"] — guard-da tekshirish. 2) UI — title, icon, transition — sahifa sarlavhasi, animatsiya turi. 3) Layout — hideHeader, hideSidebar, fullWidth — layout sozlamalarini route-ga qarab o'zgartirish. 4) Breadcrumb — breadcrumb: "Foydalanuvchilar" — avtomatik breadcrumb yaratish. 5) SEO — description, ogImage — meta taglar uchun. 6) Analytics — category, section — sahifa ko'rishlarni guruhlash. Meta — ixtiyoriy, Vue Router uni o'zgartirmaydi. Siz yozasiz va guard/komponent/afterEach da o'qiysiz.`,
    },
    {
      question: 'Nested route-larda meta qanday ishlaydi? Parent meta child-ga meros qoladimi?',
      answer: `YO'Q — meta meros QOLMAYDI. Har bir route o'z meta-siga ega. Lekin to.matched massivi barcha mos kelgan route record-larni o'z ichiga oladi. Shuning uchun auth tekshirishda to.matched.some(r => r.meta.requiresAuth) ishlatiladi — bu parent-ning meta-sini ham tekshiradi. Masalan: /admin route-da requiresAuth: true bo'lsa, /admin/users child route-da meta bo'sh bo'lsa ham, matched.some() parent-ni topadi va auth tekshiradi. Bu ataylab shunday qilingan — har bir route o'z meta-sini aniq belgilaydi, implicit meros yo'q, debugging osonroq.`,
    },
    {
      question: 'RouteMeta TypeScript augmentation qanday ishlaydi? Nima uchun kerak?',
      answer: `Default holatda route.meta tipi Record<string, unknown> — istalgan property qo'shish mumkin, lekin TypeScript tekshirmaydi. Declaration merging orqali RouteMeta interface-ni kengaytirish mumkin: declare module "vue-router" { interface RouteMeta { requiresAuth?: boolean } }. Keyin route.meta.requiresAuth — boolean | undefined tipi bo'ladi. Noto'g'ri property yoki noto'g'ri tip — compile xato. Bu MUHIM: katta loyihada 50+ route bo'lsa, meta field nomlari va tiplari noto'g'ri yozilishi mumkin — TypeScript buni oldini oladi. env.d.ts yoki alohida router/types.ts faylda yoziladi. Bu pattern Vue Router, Pinia, Axios va boshqa kutubxonalarda keng ishlatiladi.`,
    },
    {
      question: 'Data fetching — navigatsiyadan oldin va keyin yuklashning farqi nima?',
      answer: `Navigatsiyadan OLDIN (guard/beforeResolve): Ma'lumot yuklanguncha eski sahifa ko'rsatiladi. Foydalanuvchi yangi sahifani faqat data tayyor bo'lganda ko'radi. Afzallik: loading/error holat komponent ichida kerak emas. Kamchilik: navigatsiya sekin tuyuladi, loading bar kerak. Navigatsiyadan KEYIN (component ichida): Sahifa darhol ko'rsatiladi, lekin kontent yuklanmoqda. Skeleton/spinner ko'rsatiladi. Afzallik: navigatsiya tez, foydalanuvchi kutmaydi. Kamchilik: har bir komponentda loading/error logika kerak. Amaliyotda ko'p ilovalar "keyin" yondashuvni tanlaydi — UX yaxshiroq (tez javob). Lekin critical data uchun (masalan, 404 tekshirish) "oldin" yondashuv to'g'ri.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-router', topicId: 'navigation-guards', label: 'Navigation Guards' },
    { techId: 'vue-js', sectionId: 'vue-router', topicId: 'nested-routes', label: 'Nested Routes' },
    { techId: 'vue-js', sectionId: 'vue-typescript', topicId: 'type-augmentation', label: 'Type Augmentation' },
    { techId: 'vue-js', sectionId: 'vue-pinia', topicId: 'pinia-basics', label: 'Pinia asoslari' },
  ],
}
