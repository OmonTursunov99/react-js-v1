import type { Topic } from '../../../types'

export const vueEcosystem: Topic = {
  id: 'vue-ecosystem',
  title: 'Vue Ecosystem',
  importance: 2,
  status: 'to-learn',
  description: 'Vue ekotizimi — VueUse, Pinia, Vue Router, Vitest, Nuxt, DevTools, UI kutubxonalar',
  content: `Vue ekotizimi — rasmiy va jamoaviy kutubxonalar to'plami. Senior dasturchi BARCHA asosiy vositalarni bilishi va TO'G'RI tanlashi kerak.

═══════════════════════════════════════
  RASMIY KUTUBXONALAR (Official)
═══════════════════════════════════════

1. Vue Router — SPA routing
   - createRouter, createWebHistory/Hash
   - Nested routes, lazy loading, navigation guards
   - Route params, query, meta
   - Vue loyihada routing STANDARDI

2. Pinia — State management
   - Vue 3 uchun rasmiy store
   - Vuex-dan soddroq (mutations yo'q)
   - Composition API + Options API qo'llab-quvvat
   - DevTools integratsiya, SSR, TypeScript

3. Vue DevTools — Debugging
   - Browser extension (Chrome, Firefox, Edge)
   - Komponent daraxti, state tekshirish
   - Pinia store monitoring
   - Router inspection
   - Performance profiling
   - Timeline (event, lifecycle tracking)

4. Vite — Build tool
   - Vue jamosi tomonidan yaratilgan
   - HMR (Hot Module Replacement) — millisekund
   - ES modules — development-da bundling YO'Q
   - Rollup asosida production build
   - Plugin ekotizimi

═══════════════════════════════════════
  VueUse — 200+ COMPOSABLE
═══════════════════════════════════════

VueUse — eng mashhur Vue composable kutubxonasi:

Kategoriyalar:
- Browser: useClipboard, useFullscreen, useMediaQuery
- Sensors: useMouse, useScroll, useIntersectionObserver
- State: useStorage, useRefHistory, useToggle
- Network: useFetch, useWebSocket, useEventSource
- Animation: useTransition, useInterval, useTimeout
- Component: useVModel, useVirtualList
- Utilities: useDebounceFn, useThrottleFn

Misol: const { x, y } = useMouse()
       const isDark = useDark()
       const { data } = useFetch('/api')

5000+ GitHub stars, 200+ composable, Vue 3 optimallashtirilgan.
Tree-shakeable — faqat import qilganlaringiz bundle-ga tushadi.

═══════════════════════════════════════
  NUXT — META-FRAMEWORK
═══════════════════════════════════════

Nuxt — Vue asosidagi full-stack framework (Next.js analog):

Imkoniyatlar:
- SSR (Server-Side Rendering) — SEO, performance
- SSG (Static Site Generation) — blog, marketing sahifalar
- File-based routing — pages/ papka = routelar
- Auto-imports — ref, computed avtomatik import
- Server API routes — /server/api/ — backend
- SEO: useHead(), meta taglar boshqarish
- Nitro server engine — edge computing

Nuxt 3 = Vue 3 + Vite + Nitro + auto-import + file-routing

═══════════════════════════════════════
  TESTING — VITEST
═══════════════════════════════════════

Vitest — Vite-native test runner (Jest alternative):
- Vite config QAYTA ISHLATADI — alohida config kerak emas
- Vue SFC test — @vue/test-utils bilan
- Jest-compatible API (describe, it, expect)
- HMR-based watch mode — tez
- Built-in coverage (v8, istanbul)
- Snapshot testing

Vue Testing Library — @testing-library/vue:
- Foydalanuvchi nuqtai nazaridan test
- DOM-based assertions
- render() + screen.getByText()

Cypress / Playwright — E2E testing

═══════════════════════════════════════
  UI KUTUBXONALAR
═══════════════════════════════════════

1. Vuetify — Material Design
   - 80+ komponent, to'liq Material Design
   - SASS theming, responsive grid
   - Katta loyihalar uchun

2. PrimeVue — Enterprise
   - 90+ komponent, 30+ tema
   - DataTable, TreeSelect, Editor
   - Enterprise darajadagi UI

3. Element Plus — Desktop UI
   - Alibaba tomonidan, keng tarqalgan
   - Admin panel uchun ideal
   - Table, Form, Dialog, DatePicker

4. Naive UI — TypeScript-first
   - To'liq TypeScript, tree-shakeable
   - 90+ komponent, tema tizimi
   - Vue 3 Composition API

5. Headless UI (Vue) — unstyled
   - Faqat logika, stil YO'Q
   - Tailwind bilan ideal
   - Menu, Dialog, Combobox

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

Vue ekotizimi:
- RASMIY kutubxonalar: Router, Pinia, DevTools — standart
- VueUse — jamoaviy lekin de facto standart
- Nuxt — yagona meta-framework
- Tanlov KAMROQ lekin ANIQROQ

React ekotizimi:
- Router: React Router, TanStack Router — tanlash kerak
- State: Redux, Zustand, Jotai, Recoil, MobX — JUDA KO'P
- Meta-framework: Next.js, Remix, Gatsby — tanlash kerak
- Utility: ko'p alohida kutubxonalar
- Tanlov KO'PROQ lekin QAROR qiyin

XULOSA: Vue — "batteries included" (standart bor). React — "choose your own adventure" (o'zingiz tanlaysiz). Vue yangi loyihada TEZROQ boshlash, React katta loyihada ko'proq moslashuvchanlik.`,
  codeExamples: [
    {
      title: 'VueUse composable-lar namunasi',
      language: 'html',
      code: `<script setup lang="ts">
import {
  useMouse,
  useDark,
  useToggle,
  useLocalStorage,
  useClipboard,
  useDebounceFn,
  useWindowSize,
  useIntersectionObserver,
} from '@vueuse/core'
import { ref } from 'vue'

// Sichqoncha pozitsiyasi
const { x, y } = useMouse()

// Dark mode — avtomatik localStorage + class toggle
const isDark = useDark()
const toggleDark = useToggle(isDark)

// localStorage bilan sinxronlashtirilgan state
const name = useLocalStorage('user-name', 'Default')

// Clipboard
const source = ref('Nusxalash uchun matn')
const { copy, copied } = useClipboard({ source })

// Debounce
const search = ref('')
const debouncedSearch = useDebounceFn((query: string) => {
  console.log('Qidiruv:', query)
}, 300)

// Oyna o'lchami
const { width, height } = useWindowSize()

// Intersection Observer (lazy load)
const targetRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
useIntersectionObserver(targetRef, ([entry]) => {
  isVisible.value = entry.isIntersecting
})
</script>

<template>
  <div>
    <p>Sichqoncha: {{ x }}, {{ y }}</p>
    <p>Oyna: {{ width }}x{{ height }}</p>
    <button @click="toggleDark()">
      {{ isDark ? 'Light' : 'Dark' }}
    </button>
    <input v-model="name" placeholder="Ismingiz" />
    <button @click="copy()">
      {{ copied ? 'Nusxalandi!' : 'Nusxalash' }}
    </button>
    <input
      v-model="search"
      @input="debouncedSearch(search)"
      placeholder="Qidirish..."
    />
    <div ref="targetRef" :class="{ visible: isVisible }">
      {{ isVisible ? 'Ko\'rinadi' : 'Ko\'rinmaydi' }}
    </div>
  </div>
</template>`,
      description: 'VueUse — 200+ tayyor composable. useMouse, useDark, useLocalStorage, useClipboard, useDebounceFn, useIntersectionObserver.',
    },
    {
      title: 'Vitest — Vue komponent test yozish',
      language: 'ts',
      code: `// Counter.test.ts — Vitest + @vue/test-utils
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Counter from './Counter.vue'

describe('Counter', () => {
  it('boshlang\'ich qiymat 0', () => {
    const wrapper = mount(Counter)
    expect(wrapper.text()).toContain('0')
  })

  it('tugma bosilganda count oshadi', async () => {
    const wrapper = mount(Counter)
    const button = wrapper.find('button')

    await button.trigger('click')
    expect(wrapper.text()).toContain('1')

    await button.trigger('click')
    expect(wrapper.text()).toContain('2')
  })

  it('props qabul qiladi', () => {
    const wrapper = mount(Counter, {
      props: { initialCount: 5 },
    })
    expect(wrapper.text()).toContain('5')
  })

  it('emit qiladi', async () => {
    const wrapper = mount(Counter)
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('update')).toBeTruthy()
    expect(wrapper.emitted('update')![0]).toEqual([1])
  })
})

// Composable test
import { useFetch } from '@/composables/useFetch'
import { flushPromises } from '@vue/test-utils'

describe('useFetch', () => {
  it('ma\'lumot oladi', async () => {
    // Composable-ni komponent tashqarisida test
    const { data, isLoading, error } = useFetch('/api/users')

    expect(isLoading.value).toBe(true)
    await flushPromises()
    expect(isLoading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(data.value).toBeDefined()
  })
})`,
      description: 'Vitest + @vue/test-utils — komponent test: mount, trigger, props, emits. Composable test — komponent tashqarisida.',
    },
    {
      title: 'Nuxt 3 — fayl tuzilmasi va auto-import',
      language: 'ts',
      code: `// Nuxt 3 loyiha tuzilmasi:
// nuxt-app/
// ├── pages/
// │   ├── index.vue          → /
// │   ├── about.vue          → /about
// │   └── users/
// │       ├── index.vue      → /users
// │       └── [id].vue       → /users/:id (dinamik route)
// ├── components/
// │   └── AppHeader.vue      → <AppHeader /> (auto-import)
// ├── composables/
// │   └── useAuth.ts         → useAuth() (auto-import)
// ├── server/
// │   └── api/
// │       └── users.ts       → /api/users (server API)
// └── nuxt.config.ts

// pages/users/[id].vue — Nuxt sahifa
// Auto-import: ref, computed, useRoute, useFetch — import KERAK EMAS!
<script setup lang="ts">
// useRoute — auto-imported (Nuxt)
const route = useRoute()
const userId = route.params.id

// useFetch — Nuxt built-in (SSR-compatible)
const { data: user, pending, error } = await useFetch(
  \`/api/users/\${userId}\`
)

// useHead — SEO meta taglar
useHead({
  title: () => user.value?.name ?? 'Foydalanuvchi',
  meta: [
    { name: 'description', content: () => user.value?.bio ?? '' },
  ],
})
</script>

// server/api/users.ts — Server API route
export default defineEventHandler(async (event) => {
  const users = await db.query('SELECT * FROM users')
  return users
})

// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@vueuse/nuxt'],
  css: ['~/assets/main.css'],
  ssr: true, // yoki false (SPA mode)
})`,
      description: 'Nuxt 3 — file-based routing, auto-imports, server API, useFetch (SSR), useHead (SEO). Next.js analog.',
    },
  ],
  interviewQA: [
    {
      question: 'Vue ekotizimining asosiy kutubxonalarini sanab bering.',
      answer: `Rasmiy: 1) Vue Router — SPA routing (navigation guards, lazy loading). 2) Pinia — state management (Vuex o'rniga, mutations yo'q). 3) Vue DevTools — debugging (komponent daraxti, state, timeline). 4) Vite — build tool (HMR, ES modules). Jamoaviy de facto standartlar: 5) VueUse — 200+ composable (useMouse, useFetch, useStorage...). 6) Nuxt — meta-framework (SSR, SSG, file routing). UI: 7) Vuetify (Material), PrimeVue (Enterprise), Element Plus (Desktop), Naive UI (TypeScript). Testing: 8) Vitest + @vue/test-utils.`,
    },
    {
      question: 'VueUse nima va qanday holatlarda ishlatiladi?',
      answer: `VueUse — Vue composable kutubxonasi, 200+ tayyor utility composable. Kategoriyalar: Browser (useClipboard, useFullscreen), Sensors (useMouse, useScroll), State (useStorage, useToggle), Network (useFetch, useWebSocket), Animation (useTransition). Ishlatish: 1) import { useMouse } from '@vueuse/core'. 2) const { x, y } = useMouse(). Tree-shakeable — faqat import qilganlaringiz bundle-ga tushadi. Afzalligi: o'zingiz yozmasdan tayyor, test qilingan, TypeScript-li composable-lar. Har bir composable alohida npm package sifatida HAM o'rnatish mumkin.`,
    },
    {
      question: 'Nuxt va oddiy Vue SPA farqi nima? Qachon Nuxt kerak?',
      answer: `Vue SPA: client-side rendering, bitta index.html, JavaScript yuklangandan keyin render. Nuxt: SSR/SSG, SEO, file-based routing, auto-imports, server API. Nuxt kerak: 1) SEO muhim (blog, marketing, e-commerce). 2) Birinchi yuklash tezligi muhim (SSR). 3) Full-stack (server API kerak). 4) Katta loyiha — konventsiya-asosidagi struktura. Vue SPA yetarli: 1) Dashboard/admin panel. 2) SEO muhim emas. 3) Faqat frontend. Nuxt = Vue + SSR + File Routing + Auto Import + Server = Next.js analogi.`,
    },
    {
      question: 'Vitest va Jest farqi nima? Nima uchun Vitest tanlash?',
      answer: `Vitest — Vite-native test runner. Jest-dan farqlari: 1) Vite config QAYTA ISHLATADI — TS, alias, plugin-lar alohida sozlash kerak emas. 2) ESM native — Jest CJS, transform kerak. 3) HMR-based watch mode — faqat O'ZGARGAN test-lar qayta ishlaydi (tezroq). 4) Jest-compatible API — describe, it, expect bir xil (migratsiya oson). 5) Vue SFC support — @vue/test-utils bilan bir vaqtda. 6) Vite loyihada NOLDAN sozlash — vitest.config.ts kerak emas (vite.config.ts dan oladi). Kamchilik: Jest ekotizimi kattaroq (ko'proq plugin-lar).`,
    },
    {
      question: 'Vue va React ekotizimlarini taqqoslang.',
      answer: `Vue: rasmiy standartlar bor — Router, Pinia, DevTools, Vite. Har bir kategoriyada 1-2 dominant yechim. Yangi dasturchi TEZROQ boshlaydi — tanlash stress kam. Nuxt yagona meta-framework. React: har kategoriyada KO'P tanlov — Router (React Router, TanStack), State (Redux, Zustand, Jotai, MobX, Recoil), Meta-framework (Next, Remix, Gatsby). KO'PROQ moslashuvchanlik lekin QAROR qilish qiyin. Katta kompaniyalar React tanlovini o'z jamoa ehtiyojiga moslashtiradi. XULOSA: Vue — "batteries included", React — "pick your stack".`,
    },
    {
      question: 'Vue UI kutubxonani qanday tanlaysiz? Mezonlari nima?',
      answer: `Tanlash mezonlari: 1) Loyiha turi — admin panel (Element Plus, PrimeVue), marketing sayt (Headless UI + Tailwind), mobile-first (Vuetify). 2) Design system — Material kerakmi (Vuetify), yoki custom (Headless UI). 3) Bundle size — tree-shakeable mi (Naive UI ✅, Vuetify qisman). 4) TypeScript — Naive UI, PrimeVue yaxshi TS support. 5) Komponent soni va turi — DataTable, TreeSelect kerakmi. 6) Jamoa tajribasi — CSS-in-JS yoki Tailwind bilishadi? 7) Maintenance — GitHub stars, yangilanish chastotasi, community. MASLAHAT: Headless UI + Tailwind = eng moslashuvchan, Vuetify = eng tez boshlash.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-pinia', topicId: 'pinia-basics', label: 'Pinia asoslari' },
    { techId: 'vue-js', sectionId: 'vue-router', topicId: 'router-basics', label: 'Router asoslari' },
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'composables', label: 'Composables' },
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'interview-tips-vue', label: 'Intervyu maslahatlari' },
  ],
}
