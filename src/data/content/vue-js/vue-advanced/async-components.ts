import type { Topic } from '../../../types'

export const asyncComponents: Topic = {
  id: 'async-components',
  title: 'Async Components',
  importance: 2,
  status: 'to-learn',
  description: 'defineAsyncComponent(), Suspense integratsiya, lazy loading strategiyalar',
  content: `Async Components — Vue-da komponentlarni kerak bo'lganda yuklash (lazy loading) mexanizmi. Katta ilovalar uchun initial bundle hajmini kamaytiradi va sahifa tezligini oshiradi.

═══════════════════════════════════════
  defineAsyncComponent()
═══════════════════════════════════════

defineAsyncComponent() — asinxron komponent yaratish funksiyasi.
Komponent faqat render bo'lishi kerak bo'lganda yuklanadi.

Oddiy sintaksis (loader funksiya):
  const AsyncModal = defineAsyncComponent(() =>
    import('./components/HeavyModal.vue')
  )

To'liq konfiguratsiya:
  const AsyncChart = defineAsyncComponent({
    loader: () => import('./HeavyChart.vue'),
    loadingComponent: LoadingSpinner,    // yuklanayotganda
    errorComponent: ErrorDisplay,         // xatolikda
    delay: 200,                           // loading ko'rsatish kechikishi (ms)
    timeout: 10000,                       // 10s dan keyin xatolik
    onError(error, retry, fail, attempts) {
      if (attempts <= 3) {
        retry()  // qayta urinish
      } else {
        fail()   // xatolik ko'rsatish
      }
    },
  })

delay: 200 — agar komponent 200ms ichida yuklansa, loading
ko'rsatilmaydi (flicker oldini oladi).

═══════════════════════════════════════
  SUSPENSE INTEGRATSIYA
═══════════════════════════════════════

Vue <Suspense> — async komponentlar uchun deklarativ loading UI:

  <Suspense>
    <template #default>
      <AsyncDashboard />
    </template>
    <template #fallback>
      <LoadingSpinner />
    </template>
  </Suspense>

Suspense async setup() ni ham kutadi:
  async setup() {
    const data = await fetch('/api/data')
    return { data }
  }

Suspense HALI experimental (Vue 3.5) — API o'zgarishi mumkin.

═══════════════════════════════════════
  RETRY LOGIKA
═══════════════════════════════════════

Network xatoliklarda qayta yuklash:

  defineAsyncComponent({
    loader: () => import('./Heavy.vue'),
    onError(error, retry, fail, attempts) {
      if (error.message.includes('fetch') && attempts <= 3) {
        retry()  // network error — qayta urinish
      } else {
        fail()   // boshqa xatolik — fail
      }
    },
  })

═══════════════════════════════════════
  PREFETCH STRATEGIYALAR
═══════════════════════════════════════

1. Hover prefetch — sichqoncha ustiga kelganda:
   @mouseover="prefetchModal"

2. Idle prefetch — brauzer bo'sh paytda:
   requestIdleCallback(() => import('./Heavy.vue'))

3. Intersection Observer — ko'rinish zonasiga yaqinlashganda:
   useIntersectionObserver bilan komponent yuklanishi

4. Route-based — Vue Router lazy loading:
   { component: () => import('./views/About.vue') }

═══════════════════════════════════════
  AMALIY PATTERNLAR
═══════════════════════════════════════

1. Modal — foydalanuvchi ochgandagina yuklanadi
2. Og'ir chart/grafik — ko'rinish zonasiga kirganda
3. Admin panel — faqat admin uchun alohida bundle
4. Tab content — aktiv tab almashganda yuklash

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

Vue defineAsyncComponent vs React.lazy:

Vue:
  defineAsyncComponent(() => import('./Comp.vue'))
  defineAsyncComponent({ loader, loadingComponent, errorComponent, delay, timeout })

React:
  React.lazy(() => import('./Comp'))
  <Suspense fallback={<Spinner />}><Comp /></Suspense>

Farqlar:
- Vue-da loading/error component TO'G'RIDAN-TO'G'RI defineAsyncComponent ichida
- React-da DOIM Suspense kerak (fallback uchun)
- Vue-da retry mexanizm BUILT-IN (onError + retry callback)
- React-da retry uchun qo'shimcha kutubxona kerak
- Vue delay — loading flicker oldini oladi (React da yo'q)
- React Suspense production-ready, Vue Suspense HALI experimental

React Error Boundary — xatolik uchun alohida komponent:
  <ErrorBoundary fallback={<Error />}>
    <Suspense fallback={<Loading />}>
      <LazyComp />
    </Suspense>
  </ErrorBoundary>

Vue-da bu bitta defineAsyncComponent ichida hal bo'ladi.`,
  codeExamples: [
    {
      title: 'defineAsyncComponent — to\'liq konfiguratsiya',
      language: 'html',
      code: `<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorDisplay from '@/components/ErrorDisplay.vue'

// ========== Oddiy async komponent ==========
const AsyncSimple = defineAsyncComponent(() =>
  import('./HeavyComponent.vue')
)

// ========== To'liq konfiguratsiya ==========
const AsyncChart = defineAsyncComponent({
  // Asosiy loader
  loader: () => import('./HeavyChart.vue'),

  // Yuklanayotganda ko'rsatiladigan komponent
  loadingComponent: LoadingSpinner,

  // Xatolikda ko'rsatiladigan komponent
  errorComponent: ErrorDisplay,

  // Loading ko'rsatishdan oldin kutish (ms)
  // 200ms ichida yuklansa — loading ko'rsatilmaydi (flicker yo'q)
  delay: 200,

  // Timeout — 10 sekunddan keyin xatolik
  timeout: 10000,

  // Retry logika
  onError(error, retry, fail, attempts) {
    if (error.message.includes('fetch') && attempts <= 3) {
      console.warn(\`Retry attempt \${attempts}...\`)
      retry()
    } else {
      fail()
    }
  },
})

const showChart = ref(false)
</script>

<template>
  <div>
    <button @click="showChart = !showChart">
      {{ showChart ? 'Yopish' : 'Grafik ko\\'rsatish' }}
    </button>

    <!-- Faqat kerak bo'lganda yuklanadi -->
    <AsyncChart v-if="showChart" :data="[1, 2, 3]" />
  </div>
</template>`,
      description: 'defineAsyncComponent — oddiy va to\'liq konfiguratsiya. Loading, error, delay, timeout, retry.',
    },
    {
      title: 'Suspense bilan async komponentlar',
      language: 'html',
      code: `<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'

// Bir nechta async komponent
const AsyncUserProfile = defineAsyncComponent(() =>
  import('./UserProfile.vue')
)
const AsyncUserPosts = defineAsyncComponent(() =>
  import('./UserPosts.vue')
)
const AsyncUserStats = defineAsyncComponent(() =>
  import('./UserStats.vue')
)
</script>

<template>
  <div class="dashboard">
    <!--
      Suspense — barcha async children yuklangunga qadar
      fallback ko'rsatadi.
      ESLATMA: Suspense hali experimental!
    -->
    <Suspense>
      <template #default>
        <div class="grid grid-cols-3 gap-4">
          <AsyncUserProfile />
          <AsyncUserPosts />
          <AsyncUserStats />
        </div>
      </template>

      <template #fallback>
        <div class="grid grid-cols-3 gap-4">
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </div>
      </template>
    </Suspense>

    <!--
      Suspense eventlari:
      @pending — async boshlandi
      @resolve — barcha async tugadi
      @fallback — fallback ko'rsatildi
    -->
  </div>
</template>`,
      description: 'Suspense — bir nechta async komponentni bitta loading state bilan boshqarish.',
    },
    {
      title: 'Hover prefetch pattern',
      language: 'html',
      code: `<script setup lang="ts">
import { defineAsyncComponent, ref, shallowRef } from 'vue'
import type { Component } from 'vue'

// ========== Prefetch utility ==========
function useAsyncWithPrefetch(loader: () => Promise<{ default: Component }>) {
  let loaded = false
  let cachedComponent: ReturnType<typeof defineAsyncComponent> | null = null

  // Prefetch — komponentni oldindan yuklash
  function prefetch() {
    if (!loaded) {
      loaded = true
      loader()  // faqat import — render qilmaydi
    }
  }

  // Lazy komponent
  function getComponent() {
    if (!cachedComponent) {
      cachedComponent = defineAsyncComponent(loader)
    }
    return cachedComponent
  }

  return { prefetch, getComponent }
}

// ========== Ishlatish ==========
const modal = useAsyncWithPrefetch(() =>
  import('./HeavyModal.vue')
)

const showModal = ref(false)
const ModalComponent = shallowRef<Component | null>(null)

function openModal() {
  ModalComponent.value = modal.getComponent()
  showModal.value = true
}
</script>

<template>
  <div>
    <!--
      Hover qilganda prefetch boshlaydi.
      Click qilganda component ochiladi.
      Agar hover paytida yuklanib bo'lgan bo'lsa — darhol ochiladi!
    -->
    <button
      @mouseenter="modal.prefetch"
      @click="openModal"
    >
      Modal ochish
    </button>

    <component
      v-if="showModal && ModalComponent"
      :is="ModalComponent"
      @close="showModal = false"
    />
  </div>
</template>`,
      description: 'Hover prefetch — sichqoncha ustiga kelganda oldindan yuklash, click-da darhol ko\'rsatish.',
    },
    {
      title: 'Route-based lazy loading (Vue Router)',
      language: 'ts',
      code: `// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      // Oddiy lazy loading — alohida chunk
      component: () => import('@/views/HomePage.vue'),
    },
    {
      path: '/about',
      // Named chunk — debug uchun qulay
      component: () => import(
        /* webpackChunkName: "about" */
        '@/views/AboutPage.vue'
      ),
    },
    {
      path: '/admin',
      // Guruh — bir nechta sahifa bitta chunk-da
      children: [
        {
          path: '',
          component: () => import(
            /* webpackChunkName: "admin" */
            '@/views/admin/Dashboard.vue'
          ),
        },
        {
          path: 'users',
          component: () => import(
            /* webpackChunkName: "admin" */
            '@/views/admin/Users.vue'
          ),
        },
      ],
    },
  ],
})

// ========== Prefetch strategiya ==========
// Navigation guard — keyingi sahifani oldindan yuklash
router.beforeResolve(async (to) => {
  // Matched route component-ni trigger qilish
  // Vue Router avtomatik lazy import ni chaqiradi
})

export default router`,
      description: 'Vue Router bilan route-based code splitting. Named chunks va prefetch strategiya.',
    },
  ],
  interviewQA: [
    {
      question: 'defineAsyncComponent() nima? Qanday ishlaydi?',
      answer: `defineAsyncComponent() — komponentni asinxron yuklash funksiyasi. Loader funksiya qabul qiladi: defineAsyncComponent(() => import('./Comp.vue')). Komponent faqat render kerak bo'lganda yuklanadi — initial bundle-ga tushmaydi. To'liq konfiguratsiya: { loader, loadingComponent, errorComponent, delay, timeout, onError }. delay: 200 — 200ms ichida yuklansa loading ko'rsatilmaydi (flicker yo'q). timeout — belgilangan vaqtdan keyin error. onError(err, retry, fail, attempts) — retry logika.`,
    },
    {
      question: 'Vue Suspense va React Suspense farqi nima?',
      answer: `O'xshashlik: ikkalasi ham async content uchun fallback UI ko'rsatadi. Farqlar: 1) React Suspense PRODUCTION-READY, Vue Suspense hali EXPERIMENTAL. 2) React da React.lazy() + Suspense MAJBURIY, Vue da defineAsyncComponent o'zi loading/error ko'rsata oladi (Suspense shart emas). 3) Vue Suspense eventlari bor: @pending, @resolve, @fallback. 4) React Suspense data fetching bilan ishlaydi (use() hook), Vue Suspense faqat async setup() va async component uchun.`,
    },
    {
      question: 'Async komponent uchun prefetch strategiyalarini aytib bering.',
      answer: `1) Hover prefetch — @mouseenter da import() chaqirish. Foydalanuvchi bosganda komponent tayyor. 2) Idle prefetch — requestIdleCallback(() => import('./Comp.vue')) — brauzer bo'sh paytda. 3) Intersection Observer — viewport ga yaqinlashganda yuklash. 4) Route prefetch — <RouterLink> hover-da keyingi sahifa komponentini yuklash. 5) Conditional — v-if="condition" bilan faqat shart bajarilganda. Eng samarali: hover + idle kombinatsiya.`,
    },
    {
      question: 'Code splitting nima? Vue da qanday amalga oshiriladi?',
      answer: `Code splitting — ilovani bir nechta chunk (bo'lak) ga bo'lish, har biri alohida yuklanadi. Vue da usullar: 1) Route-based — () => import('./views/Page.vue') Vue Router da. 2) Component-based — defineAsyncComponent(). 3) Named chunks — import(/* webpackChunkName: "admin" */ './Admin.vue'). Vite avtomatik dynamic import larni alohida chunk qiladi. Afzallik: initial bundle kichik, sahifa tez ochiladi, foydalanuvchi faqat kerakli kodni yuklaydi.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'render-functions', label: 'Render Functions' },
    { techId: 'vue-js', sectionId: 'vue-router', topicId: 'lazy-loading', label: 'Route Lazy Loading' },
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'suspense-pattern', label: 'Suspense Pattern' },
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'error-handling', label: 'Error Handling' },
  ],
}
