import type { Topic } from '../../../types'

export const lazyRoutes: Topic = {
  id: 'lazy-routes',
  title: 'Lazy Loading Routes',
  importance: 2,
  status: 'to-learn',
  description: 'Dinamik import(), chunk splitting, prefetching — route darajasida kod bo\'lish',
  content: `Lazy loading — route komponentlarini faqat kerak bo'lganda yuklash texnologiyasi. Bu dastlabki bundle hajmini kamaytiradi va ilovaning birinchi yuklanish tezligini oshiradi. Vue Router dynamic import() funksiyasi orqali buni oddiy qiladi.

═══════════════════════════════════════
  ASOSIY LAZY LOADING
═══════════════════════════════════════

Oddiy import o'rniga arrow function bilan import() ishlatiladi:

  // OLDIN — hammasi bitta bundle-da
  import HomePage from '@/pages/HomePage.vue'
  { path: '/', component: HomePage }

  // KEYIN — alohida chunk sifatida yuklaydi
  { path: '/', component: () => import('@/pages/HomePage.vue') }

import() — Promise qaytaradi. Vue Router komponent kerak bo'lganda avtomatik resolve qiladi. Bu Vite/Webpack-ga alohida chunk yaratish uchun signal beradi.

Natija: foydalanuvchi faqat /about ga borganda AboutPage.vue yuklanadi. Bosh sahifada bu kod yuklanMAYDI.

═══════════════════════════════════════
  CHUNK NAMING VA GURUHLASH
═══════════════════════════════════════

Webpack magic comment bilan chunk nomini berish mumkin:
  () => import(/* webpackChunkName: "about" */ '@/pages/AboutPage.vue')

Vite-da esa rollupOptions yoki manualChunks ishlatiladi:
  // vite.config.ts
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'admin': ['./src/pages/admin/Dashboard.vue', './src/pages/admin/Users.vue'],
        }
      }
    }
  }

Yoki defineAsyncComponent bilan birga dynamic import:
  const AdminPage = defineAsyncComponent(
    () => import('@/pages/AdminPage.vue')
  )

Bir nechta route-ni bitta chunk-ga guruhlash — agar ular doim birga ishlatilsa, alohida so'rovlar o'rniga bitta so'rov yaxshiroq.

═══════════════════════════════════════
  PREFETCHING VA PRELOADING
═══════════════════════════════════════

Prefetch — browser bo'sh vaqtda oldindan yuklaydi (past prioritet).
Preload — darhol yuklaydi (yuqori prioritet).

Vite avtomatik ravishda lazy chunk-larni prefetch qiladi.
Webpack-da magic comment:
  () => import(/* webpackPrefetch: true */ '@/pages/AboutPage.vue')
  () => import(/* webpackPreload: true */ '@/pages/CriticalPage.vue')

Qo'lda prefetch:
  // RouterLink hover-da keyingi sahifani prefetch qilish
  const prefetchRoute = (path: string) => {
    const route = router.resolve(path)
    route.matched.forEach(record => {
      record.components?.default?.() // lazy import() ni trigger qilish
    })
  }

═══════════════════════════════════════
  LOADING STATES — SUSPENSE
═══════════════════════════════════════

Lazy komponent yuklanayotganda loading holat ko'rsatish:

  <RouterView v-slot="{ Component }">
    <Suspense>
      <template #default>
        <component :is="Component" />
      </template>
      <template #fallback>
        <LoadingSpinner />
      </template>
    </Suspense>
  </RouterView>

Suspense — Vue 3 ning built-in komponenti. Async komponent resolve bo'lguncha fallback slot ko'rsatadi. Bu ayniqsa sekin internet aloqasida muhim — foydalanuvchi loading animatsiyasini ko'radi.

═══════════════════════════════════════
  ROUTE-LEVEL CODE SPLITTING
═══════════════════════════════════════

Optimal strategiya — sahifa darajasida bo'lish:
- Har bir sahifa (page) — alohida chunk
- Umumiy komponentlar (UI, layout) — asosiy bundle-da
- Katta kutubxonalar (chart, editor) — alohida chunk

Chunk analyzer bilan tekshirish:
  npx vite-bundle-visualizer  (Vite)
  npx webpack-bundle-analyzer  (Webpack)

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React: React.lazy(() => import('./Page')) + <Suspense fallback={<Spinner />}>
Vue: component: () => import('./Page.vue') + <Suspense> (ixtiyoriy)

Asosiy farq: Vue Router-da lazy loading ROUTE konfiguratsiyasida yoziladi — maxsus API kerak emas, oddiy arrow function yetarli. React-da React.lazy() wrapper kerak va Suspense MAJBURIY.

React-da error handling uchun ErrorBoundary kerak. Vue-da defineAsyncComponent ichida onError callback yoki errorComponent bor.

Vite ikkala framework uchun avtomatik code splitting qiladi, lekin Vue SFC (Single File Component) tizimi tufayli har bir .vue fayl tabiiy ravishda chunk chegarasi bo'ladi.`,
  codeExamples: [
    {
      title: 'Asosiy lazy loading route konfiguratsiya',
      language: 'ts',
      code: `// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Faqat layout va tez-tez ishlatiladigan sahifalarni static import
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,  // Layout — static (har doim kerak)
    children: [
      {
        path: '',
        name: 'home',
        // Lazy loading — alohida chunk yaratiladi
        component: () => import('@/pages/HomePage.vue'),
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/pages/AboutPage.vue'),
      },
      {
        path: 'contact',
        name: 'contact',
        component: () => import('@/pages/ContactPage.vue'),
      },
    ],
  },
  {
    path: '/admin',
    // Admin layout ham lazy — admin sahifalariga kirmaydigan user yuklamaydi
    component: () => import('@/layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('@/pages/admin/DashboardPage.vue'),
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/pages/admin/UsersPage.vue'),
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import('@/pages/admin/SettingsPage.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router`,
      description: 'Layout-lar static, sahifalar lazy. Admin bo\'limi alohida — foydalanuvchi admin sahifasiga kirmasa, bu kod yuklanmaydi.',
    },
    {
      title: 'Suspense bilan loading holat',
      language: 'html',
      code: `<script setup lang="ts">
// App.vue — RouterView + Suspense + Transition
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorDisplay from '@/components/ErrorDisplay.vue'
import { ref } from 'vue'

const loadError = ref<Error | null>(null)

function onError(error: Error) {
  loadError.value = error
  console.error('Route component yuklanmadi:', error)
}
</script>

<template>
  <div class="app">
    <header>
      <AppNavbar />
    </header>

    <main>
      <!-- Error holat -->
      <ErrorDisplay v-if="loadError" :error="loadError" />

      <!-- RouterView + Suspense + Transition -->
      <RouterView v-else v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <Suspense
            :key="route.path"
            @pending="loadError = null"
            @fallback="() => {}"
            @resolve="() => {}"
          >
            <template #default>
              <component :is="Component" />
            </template>
            <template #fallback>
              <LoadingSpinner message="Sahifa yuklanmoqda..." />
            </template>
          </Suspense>
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>`,
      description: 'Suspense bilan loading spinner, Transition bilan animatsiya, error handling — to\'liq lazy loading UX.',
    },
    {
      title: 'defineAsyncComponent bilan kengaytirilgan loading',
      language: 'ts',
      code: `import { defineAsyncComponent } from 'vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'

// defineAsyncComponent — route-dan tashqarida ham ishlatish mumkin
const HeavyChart = defineAsyncComponent({
  loader: () => import('@/components/HeavyChart.vue'),
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  delay: 200,     // 200ms dan keyin loading ko'rsatish (tez yuklansa ko'rinmaydi)
  timeout: 10000, // 10 soniya — timeout
  onError(error, retry, fail, attempts) {
    if (attempts <= 3) {
      // 3 martagacha qayta urinish
      retry()
    } else {
      fail()
    }
  },
})

// Route-da ishlatish
const routes = [
  {
    path: '/analytics',
    component: () => import('@/pages/AnalyticsPage.vue'),
    // AnalyticsPage ichida <HeavyChart /> ishlatiladi
    // HeavyChart alohida chunk sifatida faqat kerak bo'lganda yuklanadi
  },
]

// Vite — manualChunks bilan guruhlash
// vite.config.ts:
// build: {
//   rollupOptions: {
//     output: {
//       manualChunks: {
//         'charts': [
//           './src/components/HeavyChart.vue',
//           './src/components/PieChart.vue',
//         ],
//       }
//     }
//   }
// }`,
      description: 'defineAsyncComponent — retry, timeout, loading/error komponentlar. manualChunks — chunk guruhlash.',
    },
    {
      title: 'RouterLink hover prefetch',
      language: 'html',
      code: `<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// Route-ni oldindan yuklash
async function prefetchRoute(routeName: string) {
  const resolved = router.resolve({ name: routeName })

  // Barcha matched route komponentlarini yuklash
  for (const record of resolved.matched) {
    const components = record.components
    if (components) {
      for (const comp of Object.values(components)) {
        // Agar lazy (funksiya) bo'lsa — chaqirib yuklash
        if (typeof comp === 'function') {
          try {
            await (comp as Function)()
          } catch {
            // Xato bo'lsa — e'tiborsiz qoldirish
          }
        }
      }
    }
  }
}
</script>

<template>
  <nav>
    <!-- Hover qilganda oldindan yuklash -->
    <RouterLink
      :to="{ name: 'about' }"
      @mouseenter="prefetchRoute('about')"
    >
      Biz haqimizda
    </RouterLink>

    <RouterLink
      :to="{ name: 'admin-dashboard' }"
      @mouseenter="prefetchRoute('admin-dashboard')"
    >
      Admin panel
    </RouterLink>
  </nav>
</template>`,
      description: 'Hover prefetching — foydalanuvchi link ustiga kelganda sahifa oldindan yuklanadi, bosganda tez ochiladi.',
    },
  ],
  interviewQA: [
    {
      question: 'Lazy loading qanday ishlaydi va nima uchun kerak?',
      answer: `Lazy loading — route komponentlarini dastlabki bundle-dan ajratib, faqat kerak bo'lganda alohida HTTP so'rov bilan yuklash. component: () => import("./Page.vue") yozilganda Vite/Webpack bu faylni alohida chunk (.js fayl) sifatida ajratadi. Foydalanuvchi shu route-ga borganda browser bu chunk-ni yuklaydi. Natija: dastlabki bundle kichik bo'ladi → birinchi yuklanish tez → Time to Interactive (TTI) yaxshilanadi. Ayniqsa katta ilovalarda (50+ sahifa) lazy loading MAJBURIY — aks holda foydalanuvchi hech qachon kirmaydigan sahifalar kodini ham yuklaydi.`,
    },
    {
      question: 'Chunk splitting strategiyasi qanday bo\'lishi kerak?',
      answer: `Optimal strategiya: 1) Har bir sahifa (page) — alohida chunk. Bu standart va eng oddiy. 2) Layout-lar — static import (ular ko'p sahifalarda ishlatiladi). 3) Katta kutubxonalar (chart.js, monaco-editor) — alohida vendor chunk. 4) Kamdan-kam ishlatiladigan bo'limlar (admin panel) — guruhlangan chunk. 5) Umumiy UI komponentlar — asosiy bundle-da. Xato: har bir kichik komponentni lazy qilish — juda ko'p HTTP so'rovlar, overhead katta bo'ladi. vite-bundle-visualizer bilan chunk hajmlarini tahlil qilish va katta chunk-larni aniqlash kerak.`,
    },
    {
      question: 'Suspense va defineAsyncComponent farqi nima? Qachon qaysi biri ishlatiladi?',
      answer: `Suspense — Vue 3 built-in komponent, async komponentlar yuklanayotganda fallback (loading) ko'rsatadi. U RouterView bilan ishlatilganda barcha lazy route-lar uchun global loading UX beradi. defineAsyncComponent — komponent darajasida lazy loading. Uning afzalligi: delay (tez yuklansa loading ko'rinmaydi), timeout, retry, va alohida loading/error komponentlar. Route lazy loading uchun — oddiy () => import() + Suspense yetarli. Komponent lazy loading uchun (sahifa ichidagi og'ir komponent, masalan chart) — defineAsyncComponent ko'proq kontrol beradi. Ikkisini birga ishlatish ham mumkin.`,
    },
    {
      question: 'Lazy loading bilan ishlashda qanday muammolar bo\'lishi mumkin?',
      answer: `1) Deploy vaqtida eski chunk-lar o'chib ketadi — foydalanuvchi sahifani ochganda 404 xato. Yechim: versioned chunk nomlari va error handling bilan reload qilish. 2) Juda ko'p kichik chunk-lar — HTTP/2 multiplexing bo'lsa ham overhead bor. manualChunks bilan guruhlash kerak. 3) Network waterfall — nested lazy komponentlar ketma-ket yuklanadi. Critical path-dagi komponentlarni preload qilish kerak. 4) Flash of loading — tez internet-da loading spinner bir lahza ko'rinib yo'qoladi. defineAsyncComponent delay: 200 bilan hal qilinadi. 5) SEO muammosi — SSR ishlatmasangiz lazy sahifalar indekslanmasligi mumkin.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-router', topicId: 'router-basics', label: 'Router asoslari' },
    { techId: 'vue-js', sectionId: 'vue-router', topicId: 'nested-routes', label: 'Nested Routes' },
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'async-components', label: 'Async Components' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'components', label: 'Komponentlar' },
  ],
}
