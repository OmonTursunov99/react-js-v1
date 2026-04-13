import type { Topic } from '../../../types'

export const vueRouter: Topic = {
  id: 'vue-router',
  title: 'Vue Router',
  importance: 3,
  status: 'to-learn',
  description: 'Routes, guards, lazy loading, nested routes, meta — Vue navigatsiya tizimi',
  content: `Vue Router — Vue.js rasmiy routing kutubxonasi. SPA da sahifalar o'rtasida navigatsiya qilish, URL bilan sinxronlash, va route boshqaruvini ta'minlaydi.

═══════════════════════════════════════
  ASOSIY TUSHUNCHALAR
═══════════════════════════════════════

  import { createRouter, createWebHistory } from 'vue-router'

  const router = createRouter({
    history: createWebHistory(),   // HTML5 History API
    routes: [
      { path: '/', component: () => import('./Home.vue') },
      { path: '/about', component: () => import('./About.vue') },
    ],
  })

History rejimlar:
- createWebHistory() — /about (server sozlash kerak)
- createWebHashHistory() — /#/about (server sozlash kerak emas)
- createMemoryHistory() — SSR uchun

═══════════════════════════════════════
  DINAMIK ROUTE VA PARAMS
═══════════════════════════════════════

  { path: '/user/:id', component: UserPage }     // /user/42
  { path: '/post/:year/:month', component: Post } // /post/2024/06

Komponentda params olish:
  <script setup>
  import { useRoute } from 'vue-router'
  const route = useRoute()
  // route.params.id — '42'
  </script>

Props rejimi (tavsiya etiladi):
  { path: '/user/:id', component: UserPage, props: true }
  // UserPage: defineProps<{ id: string }>()

═══════════════════════════════════════
  NESTED ROUTES
═══════════════════════════════════════

  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      { path: '', component: DashboardHome },      // /dashboard
      { path: 'settings', component: Settings },    // /dashboard/settings
      { path: 'profile', component: Profile },      // /dashboard/profile
    ],
  }

DashboardLayout ichida <RouterView /> bo'lishi kerak — children shu yerga renderlanadi.

═══════════════════════════════════════
  NAVIGATION GUARDS
═══════════════════════════════════════

1. Global guard — BARCHA route uchun:
  router.beforeEach((to, from) => {
    const auth = useAuthStore()
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
  })

2. Route-specific guard:
  {
    path: '/admin',
    component: AdminPage,
    beforeEnter: (to, from) => {
      const auth = useAuthStore()
      if (!auth.isAdmin) return { name: 'home' }
    },
  }

3. Komponent ichida (Composition API):
  import { onBeforeRouteLeave } from 'vue-router'
  onBeforeRouteLeave((to, from) => {
    if (hasUnsavedChanges.value) {
      return confirm('Saqlalmagan o\\'zgarishlar bor. Chiqmoqchimisiz?')
    }
  })

═══════════════════════════════════════
  ROUTE META
═══════════════════════════════════════

Har bir route-ga qo'shimcha ma'lumot berish:

  {
    path: '/admin',
    component: Admin,
    meta: {
      requiresAuth: true,
      role: 'admin',
      title: 'Admin Panel',
    },
  }

TypeScript-da meta tipizatsiyasi:
  declare module 'vue-router' {
    interface RouteMeta {
      requiresAuth?: boolean
      role?: 'admin' | 'user'
      title?: string
    }
  }

═══════════════════════════════════════
  LAZY LOADING — KOD BO'LISH
═══════════════════════════════════════

  // Har bir sahifa alohida chunk sifatida yuklanadi
  {
    path: '/dashboard',
    component: () => import('./pages/Dashboard.vue'),
    // Vite comment — chunk nomini belgilash:
    // component: () => import(/* webpackChunkName: "dashboard" */ './Dashboard.vue'),
  }

  // Route guruhlari (bir chunk):
  const UserModule = () => import('./modules/user/index.vue')

═══════════════════════════════════════
  PROGRAMMATIK NAVIGATSIYA
═══════════════════════════════════════

  import { useRouter } from 'vue-router'
  const router = useRouter()

  router.push('/about')                      // navigatsiya
  router.push({ name: 'user', params: { id: '42' } })
  router.replace('/login')                   // history-ga qo'shmasdan
  router.go(-1)                              // orqaga
  router.go(1)                               // oldinga`,
  codeExamples: [
    {
      title: 'Router konfiguratsiya — to\'liq misol',
      language: 'ts',
      code: `// router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// Route meta tipizatsiya
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    role?: 'admin' | 'user'
    title?: string
    transition?: string
  }
}

const routes: RouteRecordRaw[] = [
  // Public routes
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { title: 'Bosh sahifa' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { title: 'Kirish' },
  },

  // Protected routes — nested
  {
    path: '/dashboard',
    component: () => import('@/layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/pages/DashboardHome.vue'),
        meta: { title: 'Dashboard' },
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/pages/ProfilePage.vue'),
        meta: { title: 'Profil' },
      },
    ],
  },

  // Dynamic route — props: true
  {
    path: '/user/:id',
    name: 'user',
    component: () => import('@/pages/UserPage.vue'),
    props: true,  // :id -> props.id
    meta: { requiresAuth: true },
  },

  // Admin — route-level guard
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/pages/AdminPage.vue'),
    meta: { requiresAuth: true, role: 'admin', title: 'Admin' },
    beforeEnter: (to) => {
      // Route-specific guard
      console.log('Admin route guard:', to.path)
    },
  },

  // 404 — catch-all
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { title: '404' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition    // orqaga bosganda
    if (to.hash) return { el: to.hash }        // anchor
    return { top: 0 }                          // yuqoriga
  },
})

export default router`,
      description: 'To\'liq router konfiguratsiya: lazy loading, nested routes, dynamic params, meta, scroll behavior, 404 catch-all.',
    },
    {
      title: 'Navigation Guards — auth va role tekshirish',
      language: 'ts',
      code: `// router/guards.ts
import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function setupGuards(router: Router) {
  // ===== Global beforeEach =====
  router.beforeEach(async (to, from) => {
    const auth = useAuthStore()

    // 1. Sahifa title yangilash
    document.title = to.meta.title
      ? \`\${to.meta.title} | Mening Ilovam\`
      : 'Mening Ilovam'

    // 2. Auth tekshirish
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
      // Token bor lekin user yuklanmagan — profil olish
      if (auth.token && !auth.user) {
        try {
          await auth.fetchProfile()
        } catch {
          return { name: 'login', query: { redirect: to.fullPath } }
        }
      }

      if (!auth.isAuthenticated) {
        return { name: 'login', query: { redirect: to.fullPath } }
      }
    }

    // 3. Role tekshirish
    if (to.meta.role && auth.user?.role !== to.meta.role) {
      return { name: 'dashboard' }  // ruxsat yo'q
    }

    // 4. Login sahifaga authenticated user kirmasin
    if (to.name === 'login' && auth.isAuthenticated) {
      return { name: 'dashboard' }
    }
  })

  // ===== Global afterEach =====
  router.afterEach((to, from) => {
    // Analytics, loading bar to'xtatish
    console.log(\`Navigatsiya: \${from.path} -> \${to.path}\`)
  })

  // ===== Global onError =====
  router.onError((error, to) => {
    // Lazy loading xatolik — qayta yuklash
    if (error.message.includes('Failed to fetch dynamically imported module')) {
      window.location.href = to.fullPath
    }
  })
}

// main.ts da:
// setupGuards(router)`,
      description: 'Global guards: auth tekshirish, role-based access, sahifa title, lazy loading xatolik. Modular pattern.',
    },
    {
      title: 'useRoute va useRouter — komponentda navigatsiya',
      language: 'html',
      code: `<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'

const route = useRoute()    // hozirgi route ma'lumotlari (reaktiv)
const router = useRouter()  // navigatsiya uchun

// Route params (reaktiv)
const userId = computed(() => route.params.id as string)
const searchQuery = computed(() => route.query.q as string || '')
const currentPage = computed(() => Number(route.query.page) || 1)

// Route o'zgarganda — ma'lumot yuklash
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await loadUser(String(newId))
    }
  },
  { immediate: true }
)

// Programmatik navigatsiya
function goToUser(id: number) {
  router.push({ name: 'user', params: { id: String(id) } })
}

function updateSearch(query: string) {
  // Query params yangilash (sahifa o'zgarmaydi)
  router.push({
    query: { ...route.query, q: query, page: '1' },
  })
}

function goBack() {
  router.go(-1)
}

// Route tark etishdan oldin — saqlalmagan o'zgarishlar
const hasChanges = ref(false)

onBeforeRouteLeave(() => {
  if (hasChanges.value) {
    const answer = window.confirm(
      'Saqlalmagan o\\'zgarishlar bor. Chiqmoqchimisiz?'
    )
    if (!answer) return false  // navigatsiyani bekor qilish
  }
})

async function loadUser(id: string) {
  console.log('User yuklanmoqda:', id)
}
</script>

<template>
  <div>
    <p>User ID: {{ userId }}</p>
    <p>Qidiruv: {{ searchQuery }}</p>
    <p>Sahifa: {{ currentPage }}</p>

    <input
      :value="searchQuery"
      @input="updateSearch(($event.target as HTMLInputElement).value)"
    />

    <button @click="goToUser(42)">User #42</button>
    <button @click="goBack">Orqaga</button>
  </div>
</template>`,
      description: 'useRoute — reaktiv route params/query. useRouter — programmatik navigatsiya. onBeforeRouteLeave — unsaved changes guard.',
    },
  ],
  interviewQA: [
    {
      question: 'Vue Router da navigation guard turlari qanday?',
      answer: `3 darajadagi guard-lar: 1) Global — router.beforeEach(), router.afterEach() — BARCHA route uchun ishlaydi. Auth tekshirish, analytics. 2) Route-level — beforeEnter route konfiguratsiyasida. Ma'lum bir route uchun maxsus tekshiruv. 3) Komponent-level — onBeforeRouteLeave, onBeforeRouteUpdate. Saqlalmagan o'zgarishlar, form validation. Tartib: beforeEach -> beforeEnter -> onBeforeRouteUpdate -> afterEach.`,
    },
    {
      question: 'Vue Router da lazy loading qanday ishlaydi?',
      answer: `component: () => import('./Page.vue') — dinamik import. Vite/Webpack bu kodni alohida chunk-ga ajratadi. Sahifa faqat route-ga o'tilganda yuklanadi — boshlang'ich bundle kichikroq bo'ladi. Route guruhlari — bir nechta route-ni bitta chunk-ga birlashtirish mumkin. router.onError — lazy loading muvaffaqiyatsiz bo'lganda (network xatolik) — qayta yuklash yoki fallback ko'rsatish.`,
    },
    {
      question: 'useRoute va useRouter farqi nima?',
      answer: `useRoute() — HOZIRGI route HAQIDA ma'lumot beradi (reaktiv): params, query, meta, path, name, hash. O'qish uchun. useRouter() — NAVIGATSIYA qilish uchun: push(), replace(), go(), back(). O'zgartirish uchun. useRoute() — har route o'zgarishida yangi object (reactive proxy). useRouter() — app davomida bitta instance. Analog: React-da useParams/useSearchParams = useRoute, useNavigate = useRouter.`,
    },
    {
      question: 'Vue Router va React Router farqi nima?',
      answer: `O'xshashlik: ikkalasi ham SPA routing, lazy loading, guards, nested routes. Farqlar: 1) Vue Router — global guards (beforeEach), React Router-da yo'q (loader/action bor). 2) Vue Router — route meta, React Router-da handle orqali. 3) Vue Router — props: true (params -> props), React Router-da useParams hook. 4) Vue Router — programmatik: router.push(), React: useNavigate(). 5) Nuxt — file-based routing (avtomatik), Next.js ham.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'state-management', label: 'Pinia' },
    { techId: 'nuxt-js', sectionId: 'nuxt-core', topicId: 'file-routing', label: 'Nuxt File Routing' },
    { techId: 'nuxt-js', sectionId: 'nuxt-core', topicId: 'middleware', label: 'Nuxt Middleware' },
  ],
}
