import type { Topic } from '../../../types'

export const interviewTips: Topic = {
  id: 'interview-tips-vue',
  title: 'Interview Tips (Vue)',
  importance: 1,
  status: 'to-learn',
  description: 'Senior Vue intervyu maslahatlari — ko\'p so\'raladigan savollar, live coding, arxitektura muhokamasi',
  content: `Senior Vue Frontend Developer intervyusiga tayyorlanish strategiyasi. Qanday savollar beriladi, qanday javob berish kerak, qanday portfolio tayyorlash.

═══════════════════════════════════════
  SAVOL DARAJALARI
═══════════════════════════════════════

JUNIOR savollar (asosiy bilim):
- Vue nima? SPA nima?
- v-if vs v-show farqi
- computed vs methods farqi
- Component lifecycle tartibi
- Props va emit qanday ishlaydi

MIDDLE savollar (chuqur tushunish):
- Composition API vs Options API
- Vuex/Pinia state management
- Vue Router navigation guards
- Scoped CSS qanday ishlaydi
- v-model ichki ishlash mexanizmi

SENIOR savollar (arxitektura + ichki ishlash):
- Vue reaktivlik tizimi (Proxy, track/trigger)
- Virtual DOM va compiler optimizatsiyalari
- Custom renderer yaratish
- Performance optimallashtirish strategiyalari
- Micro-frontend arxitektura
- SSR/SSG qarorlar va trade-off-lar
- Large-scale Vue loyiha arxitekturasi

═══════════════════════════════════════
  REAKTIVLIKNI TUSHUNTIRISH STRATEGIYASI
═══════════════════════════════════════

Intervyuda "Vue reaktivlik qanday ishlaydi?" deb so'rashadi.
YOMON javob: "ref va reactive ishlatamiz"
YAXSHI javob: 3 bosqichda tushuntiring:

1. UMUMIY: "Vue Proxy API orqali ob'ektlarni kuzatadi"
2. MEXANIZM: "GET trap — track() dependency yozadi, SET trap — trigger() xabar beradi"
3. DETALLAR: "targetMap: WeakMap<target, Map<key, Set<effect>>> — dependency graph"

Doim ODDIY → MURAKKAB tartibda. Intervyuer to'xtatmaguncha davom eting.

═══════════════════════════════════════
  LIVE CODING MASLAHATLAR
═══════════════════════════════════════

1. TUZILMA: Avval reja aytib bering, keyin yozing
   "Avval reactive state yarataman, keyin computed, keyin template"

2. COMPOSITION API: <script setup> ishlatng — qisqa va zamonaviy
   Intervyuer bu bilimni yuqori baholaydi

3. TypeScript: Imkon qadar TS ishlatng
   defineProps<{ title: string }>()
   const emit = defineEmits<{ update: [value: string] }>()

4. ERROR HANDLING: try/catch, loading state, error state
   Ko'p nomzodlar faqat "happy path" yozishadi

5. CLEANUP: onUnmounted da tozalash
   addEventListener → removeEventListener
   Bu PROFESSIONAL yondashuvni ko'rsatadi

6. COMPOSABLE: Iloji bo'lsa logikani composable-ga ajratng
   "Keling, bu logikani alohida composable-ga chiqaramiz"

═══════════════════════════════════════
  ARXITEKTURA MUHOKAMASI
═══════════════════════════════════════

Senior intervyuda: "Loyiha arxitekturasini qanday tashkil qilasiz?"

YAXSHI javob:
1. Papka tuzilmasi: feature-based (page → components → composables)
2. State: Pinia — global, composable — local
3. API: composable-lar (useFetch, useUsers)
4. Error boundary: onErrorCaptured wrapper komponent
5. Routing: lazy loading, navigation guards
6. Testing: Vitest + vue-test-utils (unit), Playwright (e2e)

TRADE-OFF aytib bering:
"Pinia vs provide/inject — Pinia DevTools qo'llab-quvvatlaydi lekin ba'zan overhead, provide/inject oddiyroq lekin debug qiyin"

═══════════════════════════════════════
  QIZIL VA YASHIL BAYROQLAR
═══════════════════════════════════════

YASHIL bayroqlar (intervyuer yoqtiradi):
✅ "Bu trade-off bor — X holatda A yaxshiroq, Y holatda B"
✅ "Bu React-da shunday qilinadi, Vue-da buni tushuntiraman..."
✅ "Performance uchun v-memo ishlatish mumkin, lekin ko'p hollarda kerak emas"
✅ Composition API + TypeScript
✅ Testlarni eslash va yozish

QIZIL bayroqlar (intervyuer yoqtirmaydi):
❌ "Vue eng yaxshi framework" (faqat yaxshi tomonlarni aytish)
❌ "Mixins ishlataman" (eski yondashuv)
❌ Options API-ni ham bilmaslik
❌ "Memory leak nima?" deb bilmaslik
❌ Faqat "happy path" — error handling yo'q

═══════════════════════════════════════
  PORTFOLIO LOYIHA G'OYALARI
═══════════════════════════════════════

1. Real-time Dashboard: WebSocket + Pinia + Chart
2. E-commerce: Product list + Cart + Checkout flow
3. Project Management: Drag-and-drop + Kanban + Auth
4. Blog Platform: Nuxt SSR + Markdown + SEO
5. Component Library: Headless UI + Storybook + npm publish

HAR BIR loyihada bo'lsin:
- TypeScript
- Testing (min 80% coverage)
- CI/CD (GitHub Actions)
- Performance monitoring
- Accessibility (a11y)
- Responsive design

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

Intervyuda "React vs Vue" savoli TUSHADI. Ideal javob:

Shaxsiy tajribam bilan boshlay:
"Ikkalasini ham ishlatganman. Vue-da template + scoped CSS = tez prototiplash. React-da ekotizim katta, community keng."

Texnik taqqoslash:
- Reaktivlik: Vue fine-grained (Proxy), React coarse-grained (re-render)
- API: Vue Composition = React Hooks (o'xshash)
- Template vs JSX: Vue template = compile-time optimallashtirish, JSX = moslashuvchanlik
- State: Vue Pinia = standart, React = tanlash ko'p

HECH QACHON bitta framework-ni yomonlamang!
"Har ikkala framework o'z joyida kuchli. Loyiha ehtiyojiga qarab tanlash kerak."`,
  codeExamples: [
    {
      title: 'Live coding — Timer composable (intervyu misol)',
      language: 'html',
      code: `<!-- Intervyu topshirig'i: "Countdown timer komponent yarating" -->
<!-- YAXSHI yondashuw: composable + TypeScript + cleanup -->

<!-- composables/useCountdown.ts -->
<script lang="ts">
// 1. REJA AYTISH: "Avval composable yarataman, keyin komponent"
import { ref, computed, onUnmounted } from 'vue'

export function useCountdown(initialSeconds: number) {
  const remaining = ref(initialSeconds)
  const isRunning = ref(false)
  let intervalId: number | null = null

  // Computed — formatlangan vaqt
  const formatted = computed(() => {
    const mins = Math.floor(remaining.value / 60)
    const secs = remaining.value % 60
    return \`\${String(mins).padStart(2, '0')}:\${String(secs).padStart(2, '0')}\`
  })

  const isFinished = computed(() => remaining.value <= 0)

  function start() {
    if (isRunning.value || isFinished.value) return
    isRunning.value = true
    intervalId = window.setInterval(() => {
      remaining.value--
      if (remaining.value <= 0) {
        stop()
      }
    }, 1000)
  }

  function stop() {
    isRunning.value = false
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function reset() {
    stop()
    remaining.value = initialSeconds
  }

  // ✅ CLEANUP — memory leak oldini olish
  // Intervyuda BU qadamni qo'shing — professional ko'rinadi
  onUnmounted(() => {
    stop()
  })

  return { remaining, formatted, isRunning, isFinished, start, stop, reset }
}
</script>

<!-- Countdown.vue -->
<script setup lang="ts">
import { useCountdown } from '@/composables/useCountdown'

const props = defineProps<{
  seconds: number
}>()

const emit = defineEmits<{
  finish: []
}>()

const { formatted, isRunning, isFinished, start, stop, reset } =
  useCountdown(props.seconds)

// Watch finish — bonus (intervyuda qo'shimcha ball)
import { watch } from 'vue'
watch(isFinished, (done) => {
  if (done) emit('finish')
})
</script>

<template>
  <div class="countdown" :class="{ finished: isFinished }">
    <span class="time">{{ formatted }}</span>
    <div class="controls">
      <button @click="start" :disabled="isRunning || isFinished">Start</button>
      <button @click="stop" :disabled="!isRunning">Stop</button>
      <button @click="reset">Reset</button>
    </div>
  </div>
</template>`,
      description: 'Intervyu live coding misoli. Composable + TypeScript + cleanup + emit. Har bir qadam — intervyuer uchun "yashil bayroq".',
    },
    {
      title: 'Arxitektura savol — API layer design',
      language: 'ts',
      code: `// Intervyu savoli: "Vue loyihada API qatlamini qanday tashkil qilasiz?"

// 1. API client — markazlashtirilgan
// api/client.ts
const apiClient = {
  baseURL: import.meta.env.VITE_API_URL,

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(\`\${this.baseURL}\${endpoint}\`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: \`Bearer \${getToken()}\`,
      },
      ...options,
    })
    if (!response.ok) throw new ApiError(response)
    return response.json()
  },

  get: <T>(url: string) => apiClient.request<T>(url),
  post: <T>(url: string, data: unknown) =>
    apiClient.request<T>(url, { method: 'POST', body: JSON.stringify(data) }),
}

// 2. Domain-specific API
// api/users.ts
interface User { id: number; name: string; email: string }

export const usersApi = {
  getAll: () => apiClient.get<User[]>('/users'),
  getById: (id: number) => apiClient.get<User>(\`/users/\${id}\`),
  create: (data: Omit<User, 'id'>) => apiClient.post<User>('/users', data),
}

// 3. Composable — komponent uchun
// composables/useUsers.ts
import { ref, onMounted } from 'vue'

export function useUsers() {
  const users = ref<User[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchUsers() {
    isLoading.value = true
    error.value = null
    try {
      users.value = await usersApi.getAll()
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      isLoading.value = false
    }
  }

  onMounted(fetchUsers)

  return { users, isLoading, error, refetch: fetchUsers }
}

// TUSHUNTIRISH:
// 3 qatlam: API Client → Domain API → Composable
// Separation of concerns: transport / business logic / UI state
// Test qilish oson: har bir qatlam alohida mock qilish mumkin`,
      description: 'Arxitektura savol javob misoli. 3 qatlam: API Client → Domain API → Composable. Separation of concerns va testability tushuntirish.',
    },
  ],
  interviewQA: [
    {
      question: 'Senior Vue intervyusida qanday savollar beriladi?',
      answer: `3 darajada: 1) Asosiy: Composition vs Options API, v-if vs v-show, computed vs watch, lifecycle hooks. 2) Chuqur: Reaktivlik tizimi (Proxy, track/trigger), Virtual DOM va patch algoritmi, Pinia store design, router guards, scoped CSS ichki ishlashi. 3) Arxitektura: Loyiha tashkil qilish (feature-based papka), state management strategiya, API layer design, performance optimallashtirish, SSR qarorlar, test strategiya, CI/CD. BONUS: Vue vs React texnik taqqoslash, micro-frontend, accessibility.`,
    },
    {
      question: 'Vue reaktivligini intervyuda qanday tushuntirish kerak?',
      answer: `3 bosqichda tushuntiring (ODDIY → MURAKKAB): 1) UMUMIY: "Vue 3 JavaScript Proxy API orqali ob'ektlarni kuzatadi. State o'qilganda — kim o'qiganini yozadi, o'zgarganda — kuzatuvchilarni xabar qiladi." 2) MEXANIZM: "reactive() ob'ektni Proxy bilan o'raydi. GET trap — track() chaqiriladi (dependency yoziladi). SET trap — trigger() chaqiriladi (effect-lar qayta ishlaydi)." 3) DETALLAR: "dependency graph: targetMap = WeakMap<target, Map<key, Set<effect>>>. Scheduler mikrotask-da flush qiladi — dublikatlar olib tashlanadi." Intervyuer to'xtatmaguncha davom eting.`,
    },
    {
      question: 'Live coding intervyuda qanday yondashish kerak?',
      answer: `1) REJA: Avval 1-2 daqiqa reja aytib bering: "Avval composable yarataman, keyin komponent, keyin test." 2) TYPESCRIPT: Imkon qadar TS ishlatng — defineProps<{}>, interface, type. 3) COMPOSITION API: <script setup> ishlatng — zamonaviy, professional. 4) ERROR HANDLING: try/catch, loading/error state — ko'p nomzodlar unutadi. 5) CLEANUP: onUnmounted da tozalash — memory leak oldini olish. 6) COMPOSABLE: Logikani ajratng — "Buni composable-ga chiqaray" deng. 7) EDGE CASE: Null, empty array, error holatlarni eslang. 8) OVOZ BILAN FIKRLANG — nima qilayotganingizni tushuntiring.`,
    },
    {
      question: 'Vue vs React savoliga qanday javob berish kerak?',
      answer: `HECH QACHON bitta framework-ni yomonlamang! Texnik taqqoslash bering: 1) Reaktivlik: Vue fine-grained (Proxy, avtomatik dependency tracking), React coarse-grained (useState, manual dependency array). 2) API: Vue Composition API ≈ React Hooks (o'xshash pattern). 3) Template vs JSX: template = compile-time optimallashtirish, JSX = moslashuvchanlik. 4) Ekotizim: Vue — standart bor (Router, Pinia), React — tanlash ko'p. 5) Performance: Vue — compiler optimallashtirish (patch flags), React — Concurrent Mode. XULOSA: "Loyiha ehtiyojiga qarab tanlash kerak. Ikkalasi ham professional darajada ishlab chiqarish uchun mos."`,
    },
    {
      question: 'Portfolio loyihada nima bo\'lishi kerak?',
      answer: `SHART: 1) TypeScript — strict mode. 2) Composition API + <script setup>. 3) Pinia — state management. 4) Vue Router — lazy loading, guards. 5) Testing — Vitest + vue-test-utils (min 70% coverage). 6) CI/CD — GitHub Actions. BONUS: 7) Nuxt SSR — SEO sahifalar. 8) Performance — Lighthouse 90+. 9) Accessibility — screen reader, keyboard nav. 10) Component library — Storybook. LOYIHA G'OYALARI: Real-time dashboard (WebSocket), E-commerce (Cart + Checkout), Admin panel (CRUD + auth), Blog (Nuxt + Markdown). README-da arxitektura qarorlaringizni TUSHUNTIRING — bu eng muhim.`,
    },
    {
      question: 'Intervyuda qanday savollar BERISH kerak (intervyuerga)?',
      answer: `Yaxshi savollar — siz ham kompaniyani baholayapsiz: 1) "Frontend arxitekturangiz qanday? Monorepo yoki alohida repo?" — texnik chuqurlik ko'rsatadi. 2) "Testing strategiyangiz qanday? Coverage maqsadi bormi?" — sifatga e'tibor. 3) "Vue versiyasi va migratsiya rejasi?" — pragmatik yondashuv. 4) "CI/CD pipeline qanday? Deploy qanchalik tez?" — DevOps bilimi. 5) "Jamoa kodi review qiladimi? Standart va convention-lar bormi?" — professional madaniyat. 6) "Performance monitoring ishlatilyadimi?" — production bilimi. BERMANG: ish vaqti, ta'til — bu HR savollari.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'reactivity-theory', label: 'Reaktivlik nazariyasi' },
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'vue-ecosystem', label: 'Vue ekotizimi' },
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'options-vs-composition', label: 'Options vs Composition' },
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'virtual-dom-vue', label: 'Virtual DOM' },
  ],
}
