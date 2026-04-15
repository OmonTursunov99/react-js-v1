import type { Topic } from '../../../types'

export const routerBasics: Topic = {
  id: 'router-basics',
  title: 'Router Asoslari',
  importance: 3,
  status: 'to-learn',
  description: 'createRouter, createWebHistory/Hash, RouterView, RouterLink — Vue Router 4 ning asosiy tushunchalari',
  content: `Vue Router 4 — Vue 3 uchun rasmiy routing kutubxonasi. U SPA (Single Page Application) da sahifalar orasida navigatsiya qilish, URL parametrlarini boshqarish va route konfiguratsiyasini tashkil etish imkonini beradi.

═══════════════════════════════════════
  createRouter VA HISTORY MODE
═══════════════════════════════════════

Vue Router instance yaratish uchun createRouter() ishlatiladi. Unga ikkita asosiy parametr beriladi: history rejimi va routes massivi.

  import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

  const router = createRouter({
    history: createWebHistory(),  // /about — toza URL
    routes: [...]
  })

createWebHistory() — HTML5 History API. URL toza ko'rinadi (/about).
Server-da barcha route-larni index.html ga yo'naltirish kerak (fallback).

createWebHashHistory() — URL da # ishlatadi (/#/about).
Server konfiguratsiyasi kerak EMAS, lekin SEO uchun yomon.

createMemoryHistory() — URL o'zgarmaydi, SSR va testlar uchun.

═══════════════════════════════════════
  ROUTE KONFIGURATSIYASI
═══════════════════════════════════════

Har bir route — path, name va component-dan iborat object:

  const routes = [
    { path: '/', name: 'home', component: HomePage },
    { path: '/about', name: 'about', component: AboutPage },
    { path: '/user/:id', name: 'user', component: UserPage },
  ]

path — URL shablon. :id — dinamik segment (param).
name — route nomi (programmatik navigatsiya uchun).
component — ko'rsatiladigan komponent.

Dinamik parametrlar:
  /user/:id         → { id: '123' }
  /user/:id/post/:postId → { id: '123', postId: '456' }

Query parametrlar URL-da ? dan keyin keladi:
  /search?q=vue&page=2 → route.query = { q: 'vue', page: '2' }

═══════════════════════════════════════
  RouterView VA RouterLink
═══════════════════════════════════════

RouterView — joriy route-ga mos komponentni render qiladi.
RouterLink — sahifalar orasida navigatsiya uchun <a> tegi o'rniga ishlatiladi.

  <RouterLink to="/">Bosh sahifa</RouterLink>
  <RouterLink :to="{ name: 'user', params: { id: 1 } }">Profil</RouterLink>

RouterLink avtomatik ravishda aktiv route-ga class qo'shadi:
- router-link-active — route yoki uning child-i aktiv
- router-link-exact-active — faqat aniq shu route aktiv

Custom activeClass:
  <RouterLink to="/about" active-class="text-blue-500">About</RouterLink>

═══════════════════════════════════════
  ROUTE OBJECT TUZILMASI
═══════════════════════════════════════

Har bir route object quyidagi property-larga ega:

  route.path        — joriy URL path (/user/123)
  route.params      — dinamik parametrlar ({ id: '123' })
  route.query       — query string ({ page: '2' })
  route.hash        — URL hash (#section)
  route.name        — route nomi ('user')
  route.fullPath    — to'liq URL (/user/123?page=2#section)
  route.matched     — mos kelgan route record-lar massivi
  route.meta        — route meta ma'lumotlari
  route.redirectedFrom — yo'naltirish manbai (agar bor bo'lsa)

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React Router v6+: route-lar JSX ichida <Route> komponent sifatida yoziladi.
Vue Router: route-lar JavaScript object massivi sifatida konfiguratsiya qilinadi.

React: <Link to="/about"> — oddiy navigatsiya, aktiv class qo'lda.
Vue: <RouterLink to="/about"> — avtomatik aktiv class qo'shadi.

React: <Outlet /> — nested route uchun.
Vue: <RouterView /> — xuddi shunday vazifa.

React: createBrowserRouter() — yangi data API.
Vue: createRouter() — boshidanoq shu pattern.

React Router route-larni komponent daraxtida aniqlaydi, Vue Router esa markazlashgan konfiguratsiya faylida. Vue Router-da route parametrlari avtomatik typing bilan keladi.`,
  codeExamples: [
    {
      title: 'Router yaratish va ulash',
      language: 'ts',
      code: `// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import AboutPage from '@/pages/AboutPage.vue'
import UserPage from '@/pages/UserPage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage,
  },
  {
    path: '/user/:id',
    name: 'user',
    component: UserPage,
    // props: true — params ni props sifatida uzatadi
    props: true,
  },
  {
    // Barcha noma'lum route-lar 404 ga
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Sahifa o'zgarganda tepaga scroll
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash }
    return { top: 0 }
  },
})

export default router`,
      description: 'Router instance yaratish — history mode, route konfiguratsiya, scrollBehavior va catch-all 404 route.',
    },
    {
      title: 'main.ts da router ulash',
      language: 'ts',
      code: `// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)  // Router plugin sifatida ulanadi

// Router tayyor bo'lguncha kutish (ixtiyoriy)
router.isReady().then(() => {
  app.mount('#app')
})`,
      description: 'app.use(router) — plugin sifatida ulash. isReady() — SSR yoki async guard-lar uchun kutish.',
    },
    {
      title: 'RouterLink va RouterView ishlatish',
      language: 'html',
      code: `<script setup lang="ts">
// App.vue — asosiy layout
</script>

<template>
  <header>
    <nav>
      <!-- String path bilan -->
      <RouterLink to="/">Bosh sahifa</RouterLink>

      <!-- Object bilan — name va params -->
      <RouterLink :to="{ name: 'about' }">Haqida</RouterLink>

      <!-- Dinamik params bilan -->
      <RouterLink
        :to="{ name: 'user', params: { id: 42 } }"
        active-class="font-bold text-blue-600"
        exact-active-class="underline"
      >
        Profil
      </RouterLink>

      <!-- Query bilan -->
      <RouterLink
        :to="{ path: '/search', query: { q: 'vue', page: 1 } }"
      >
        Qidiruv
      </RouterLink>
    </nav>
  </header>

  <main>
    <!-- Joriy route komponentini render qiladi -->
    <RouterView />

    <!-- Transition bilan -->
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>`,
      description: 'RouterLink — turli formatlar (string, object, params, query). RouterView — oddiy va Transition bilan.',
    },
    {
      title: 'Route params va props',
      language: 'html',
      code: `<script setup lang="ts">
// UserPage.vue — route parametrlarini olish

// 1-usul: useRoute() composable
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const userId = computed(() => route.params.id as string)
const page = computed(() => Number(route.query.page) || 1)

// 2-usul: props: true bo'lsa — props orqali
// Route: { path: '/user/:id', component: UserPage, props: true }
const props = defineProps<{
  id: string
}>()
// props.id — to'g'ridan-to'g'ri ishlatish mumkin
</script>

<template>
  <div>
    <h1>Foydalanuvchi: {{ userId }}</h1>
    <p>Sahifa: {{ page }}</p>

    <!-- props bilan -->
    <h1>Foydalanuvchi (props): {{ id }}</h1>
  </div>
</template>`,
      description: 'Route params olishning ikki usuli — useRoute() composable va props: true konfiguratsiya.',
    },
    {
      title: 'Redirect va alias',
      language: 'ts',
      code: `import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  // Redirect — eski URL-dan yangi URL-ga
  {
    path: '/home',
    redirect: '/',  // string
  },
  {
    path: '/old-profile/:id',
    redirect: to => ({
      name: 'user',
      params: { id: to.params.id },
    }),  // funksiya — dinamik redirect
  },

  // Alias — bir komponentga bir nechta URL
  {
    path: '/user/:id',
    name: 'user',
    component: () => import('@/pages/UserPage.vue'),
    alias: ['/profile/:id', '/member/:id'],
    // /user/1, /profile/1, /member/1 — hammasi bitta komponent
  },

  // Named redirect
  {
    path: '/settings',
    redirect: { name: 'user-settings' },
  },
]`,
      description: 'redirect — URL o\'zgartiradi. alias — URL o\'zgarmaydi, lekin bir xil komponent ko\'rsatiladi.',
    },
  ],
  interviewQA: [
    {
      question: 'createWebHistory() va createWebHashHistory() farqi nima? Qachon qaysi biri ishlatiladi?',
      answer: `createWebHistory() HTML5 History API-dan foydalanadi — URL toza ko'rinadi (/about). Lekin server-da barcha route-larni index.html ga fallback qilish kerak, aks holda to'g'ridan-to'g'ri URL ochilganda 404 xatolik chiqadi. createWebHashHistory() URL-da # belgisini ishlatadi (/#/about) — server konfiguratsiyasi kerak emas, chunki # dan keyingi qism serverga yuborilmaydi. Lekin SEO uchun yomon, chunki qidiruv tizimlari hash-ni indekslamaydi. Production-da aksariyat hollarda createWebHistory() ishlatiladi. createWebHashHistory() faqat server konfiguratsiya qilib bo'lmaydigan muhitlarda (masalan, GitHub Pages, Electron) ishlatiladi.`,
    },
    {
      question: 'Vue Router da route params va query farqi nima?',
      answer: `Route params — URL path-ning dinamik qismi, route konfiguratsiyasida :param sifatida aniqlanadi. Masalan: /user/:id — /user/123 dagi 123 param hisoblanadi. Params majburiy (agar optional: false bo'lsa) va URL strukturasining bir qismi. Query — URL dagi ? dan keyingi parametrlar, konfiguratsiyada aniqlanmaydi. Masalan: /search?q=vue&page=2. Query ixtiyoriy va har qanday route-ga qo'shish mumkin. Asosiy farq: params — route identifikatsiyasi uchun (qaysi resurs), query — filtr/parametrlar uchun (qanday ko'rsatish). Params o'zgarganda komponent qayta yaratiladi (agar key ishlatilsa), query o'zgarganda — faqat watcher ishlaydi.`,
    },
    {
      question: 'RouterLink dan foydalanmasdan navigatsiya qilish mumkinmi?',
      answer: `Ha, useRouter() composable orqali programmatik navigatsiya mumkin: router.push("/about"), router.push({ name: "user", params: { id: 1 } }), router.replace() (history-ga qo'shmasdan), router.go(-1) (orqaga). Lekin RouterLink-ning afzalligi — avtomatik aktiv class qo'shish (router-link-active, router-link-exact-active), accessibility (<a> tegi sifatida render bo'ladi), prefetching imkoniyati, va deklarativ yondashuv. Shuning uchun navigatsiya tugmalari uchun RouterLink, programmatik logika (form submit, guard redirect) uchun useRouter() tavsiya etiladi.`,
    },
    {
      question: 'scrollBehavior nima va qanday ishlatiladi?',
      answer: `scrollBehavior — createRouter konfiguratsiyasidagi funksiya. U sahifa o'zgarganda scroll pozitsiyasini boshqaradi. Uchta parametr oladi: to (boradigan route), from (kelayotgan route), savedPosition (browser back/forward tugmasi uchun saqlangan pozitsiya). return { top: 0 } — har doim tepaga scroll. return savedPosition — orqaga qaytganda eski pozitsiyani tiklash. return { el: "#section" } — hash-ga scroll. Misol: savedPosition bo'lsa — uni qaytarish, hash bo'lsa — element-ga scroll, boshqa hollarda — tepaga. Bu funksiya faqat createWebHistory() da ishlaydi, hash mode-da emas.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-router', topicId: 'navigation-guards', label: 'Navigation Guards' },
    { techId: 'vue-js', sectionId: 'vue-router', topicId: 'nested-routes', label: 'Nested Routes' },
    { techId: 'vue-js', sectionId: 'vue-router', topicId: 'programmatic-navigation', label: 'Programmatik navigatsiya' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'components', label: 'Komponentlar' },
  ],
}
