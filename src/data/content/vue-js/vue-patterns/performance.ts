import type { Topic } from '../../../types'

export const performance: Topic = {
  id: 'performance',
  title: 'Vue Performance',
  importance: 2,
  status: 'to-learn',
  description: 'Vue optimallashtirish — v-once, v-memo, shallowRef, async components',
  content: `Vue 3 bir qancha performance optimallashtirish vositalari beradi — directive-lar, shallow reactivity, async components va bundle optimallashtirish.

═══════════════════════════════════════
  V-ONCE — BIR MARTA RENDER
═══════════════════════════════════════

v-once directive — element va uning bolalarini FAQAT 1 MARTA render qiladi.
Keyingi re-render larda butunlay o'tkazib yuboriladi.

  <h1 v-once>{{ title }}</h1>
  <div v-once>
    <ComplexTree :data="staticData" />
  </div>

Qachon ishlatish:
  - Hech qachon o'zgarmaydigan statik kontent
  - Katta statik jadvallar
  - Litsenziya matni, sarlavhalar

MUHIM: v-once qo'yilgan element ichidagi BARCHA narsa
statik bo'lib qoladi — ichki reactive ma'lumotlar ham yangilanmaydi.

═══════════════════════════════════════
  V-MEMO — SHARTLI MEMOIZATION
═══════════════════════════════════════

v-memo — dependency array o'zgargandagina qayta render qiladi.
React.memo() ning template versiyasi.

  <div v-memo="[valueA, valueB]">
    {{ expensiveComputation(valueA, valueB) }}
  </div>

v-for bilan — katta ro'yxatda faqat o'zgargan element yangilanadi:

  <div v-for="item in list" :key="item.id"
    v-memo="[item.id === selected]">
    <p>{{ item.name }}</p>
    <span :class="{ active: item.id === selected }">
      {{ item.id === selected ? "Tanlangan" : "" }}
    </span>
  </div>

MUHIM: v-memo="" (bo'sh array) = v-once bilan bir xil.
Faqat katta ro'yxat yoki qimmat render uchun ishlating.

═══════════════════════════════════════
  SHALLOWREF / SHALLOWREACTIVE
═══════════════════════════════════════

Oddiy ref() va reactive() — deep reactivity (ichki barcha property kuzatiladi).
Katta obyektlar uchun bu qimmat. shallowRef faqat .value o'zgarishini kuzatadi.

  import { shallowRef, triggerRef } from "vue"

  const bigData = shallowRef({ nested: { deep: { value: 1 } } })

  // Bu ISHLAMAYDI — deep property o'zgargani kuzatilmaydi:
  bigData.value.nested.deep.value = 2

  // Bu ISHLAYDI — butun .value almashtirildi:
  bigData.value = { ...bigData.value, nested: { deep: { value: 2 } } }

  // Yoki majburan trigger:
  bigData.value.nested.deep.value = 2
  triggerRef(bigData)

shallowReactive — faqat birinchi daraja kuzatiladi:

  const state = shallowReactive({
    count: 0,           // reactive
    nested: { x: 1 },   // nested.x — reactive EMAS
  })

Qachon ishlatish:
  - Katta JSON obyektlar (API javoblari)
  - Tashqi kutubxona instance-lari
  - Canvas/WebGL ma'lumotlari
  - 1000+ elementli arraylar

═══════════════════════════════════════
  ASYNC COMPONENTS — DEFINEASYNCCOMPONENT
═══════════════════════════════════════

Katta komponentlarni lazy load qilish — boshlang'ich bundle hajmini kamaytiradi.

  import { defineAsyncComponent } from "vue"

  const HeavyChart = defineAsyncComponent(
    () => import("./HeavyChart.vue")
  )

Sozlamalar bilan:

  const HeavyChart = defineAsyncComponent({
    loader: () => import("./HeavyChart.vue"),
    loadingComponent: LoadingSpinner,
    errorComponent: ErrorDisplay,
    delay: 200,        // loading ko'rsatishdan oldin kutish (ms)
    timeout: 5000,     // 5s dan keyin error
  })

MUHIM: Route-based code splitting Nuxt/Vue Router bilan avtomatik.
Component-level splitting — katta modal, chart, editor uchun.

═══════════════════════════════════════
  VIRTUAL SCROLLING
═══════════════════════════════════════

Minglab elementli ro'yxatda faqat ko'rinadigan qismini render qilish.

Kutubxonalar:
  - vue-virtual-scroller
  - @tanstack/vue-virtual

Prinsipi:
  1. Container — belgilangan balandlik, overflow: auto
  2. Faqat viewport ichidagi elementlar renderlanadi
  3. Scroll bo'lganda elementlar almashtiriladi
  4. 10 000+ elementda 10x tezroq

═══════════════════════════════════════
  BUNDLE OPTIMALLASHTIRISH
═══════════════════════════════════════

1. Tree-shaking:
   - Vue 3 tree-shakeable — ishlatilmagan API-lar bundle ga tushmaydi
   - Named import: import { ref, computed } from "vue"
   - Global API (app.use) tree-shake qilinmaydi

2. Code splitting:
   - Route-based: defineAsyncComponent + Vue Router
   - Component-based: defineAsyncComponent
   - Vite avtomatik vendor chunk

3. Lazy hydration (Nuxt):
   - LazyComponent — faqat viewport da ko'ringanda yuklanadi
   - nuxt/image — optimallashtirilgan rasmlar

4. Analyze:
   - vite-plugin-visualizer — bundle tarkibini ko'rish
   - rollup-plugin-analyzer

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

  Vue                      | React ekvivalenti
  ─────────────────────────|──────────────────────
  v-once                   | useMemo + static JSX
  v-memo                   | React.memo()
  shallowRef               | useRef (track emas)
  defineAsyncComponent     | React.lazy()
  Compiler optimallashtirish | React Compiler
  Avtomatik fine-grained   | Qolda memo/useMemo`,
  codeExamples: [
    {
      title: 'v-once va v-memo — template optimallashtirish',
      language: 'ts',
      code: `// Template directives — compile-time optimization
// <script setup lang="ts">
// import { ref } from "vue"
//
// const title = ref("Sarlavha") // hech o'zgarmaydi
// const selected = ref<number | null>(null)
//
// interface Item { id: number; name: string; details: string }
// const items = ref<Item[]>([
//   { id: 1, name: "React", details: "UI library" },
//   { id: 2, name: "Vue", details: "Progressive framework" },
//   { id: 3, name: "Angular", details: "Full framework" },
// ])
// </script>

// <template>
//   <!-- v-once: 1 marta render, keyin skip -->
//   <header v-once>
//     <h1>{{ title }}</h1>
//     <p>Bu matn hech qachon qayta renderlanmaydi</p>
//   </header>
//
//   <!-- v-memo: faqat selected o'zgarganda qayta render -->
//   <div v-for="item in items" :key="item.id"
//     v-memo="[item.id === selected]"
//     :class="{ selected: item.id === selected }"
//     @click="selected = item.id">
//     <h3>{{ item.name }}</h3>
//     <p>{{ item.details }}</p>
//   </div>
// </template>`,
      description: 'v-once statik kontentni 1 marta render qiladi. v-memo dependency array orqali shartli memoization.',
    },
    {
      title: 'shallowRef — katta ma`lumot bilan ishlash',
      language: 'ts',
      code: `import { shallowRef, triggerRef, computed } from "vue"

interface DataPoint {
  x: number
  y: number
  label: string
  metadata: Record<string, unknown>
}

// Katta array — 10K+ elementlar
// shallowRef ichki elementlarni KUZATMAYDI
const chartData = shallowRef<DataPoint[]>([])

// Computed hali ham ishlaydi — .value o'zgarganda
const total = computed(() => chartData.value.length)

async function loadData() {
  const response = await fetch("/api/data")
  const data: DataPoint[] = await response.json()

  // TO'G'RI — butun array almashtiriladi
  chartData.value = data
}

function updatePoint(index: number, newY: number) {
  // VARIANT 1: Yangi array yaratish (xavfsiz)
  const updated = [...chartData.value]
  updated[index] = { ...updated[index], y: newY }
  chartData.value = updated

  // VARIANT 2: Mutatsiya + triggerRef (tezroq, lekin ehtiyot)
  // chartData.value[index].y = newY
  // triggerRef(chartData) // majburan yangilash
}

// shallowReactive — faqat 1-daraja reactive
// import { shallowReactive } from "vue"
// const config = shallowReactive({
//   theme: "dark",          // reactive (1-daraja)
//   colors: { bg: "#000" }, // colors.bg reactive EMAS
// })`,
      description: 'shallowRef katta obyektlar uchun — faqat .value almashganda reactivity ishlaydi.',
    },
    {
      title: 'defineAsyncComponent — lazy loading',
      language: 'ts',
      code: `import { defineAsyncComponent, ref } from "vue"

// Oddiy lazy load
const LazyChart = defineAsyncComponent(
  () => import("./components/HeavyChart.vue")
)

// To'liq sozlamalar bilan
const LazyEditor = defineAsyncComponent({
  loader: () => import("./components/CodeEditor.vue"),
  // loadingComponent: LoadingSpinner,
  // errorComponent: ErrorFallback,
  delay: 200,
  timeout: 10000,
  onError(error, retry, fail, attempts) {
    // 3 marta qayta urinish
    if (attempts <= 3) {
      retry()
    } else {
      fail()
    }
  },
})

// Shartli yuklash
const showEditor = ref(false)

// Template:
// <button @click="showEditor = true">Editor ochish</button>
//
// <!-- Faqat showEditor = true bo'lganda yuklanadi -->
// <LazyEditor v-if="showEditor" />
//
// <!-- Suspense bilan -->
// <Suspense>
//   <LazyChart :data="chartData" />
//   <template #fallback>
//     <div class="skeleton-chart" />
//   </template>
// </Suspense>`,
      description: 'defineAsyncComponent katta komponentlarni lazy load qiladi — bundle hajmini kamaytiradi.',
    },
    {
      title: 'Virtual scrolling — katta ro`yxat',
      language: 'ts',
      code: `// VirtualList.vue — @tanstack/vue-virtual bilan
import { ref } from "vue"
// import { useVirtualizer } from "@tanstack/vue-virtual"

interface Row {
  id: number
  name: string
  email: string
}

// 50,000 qator
const allRows = ref<Row[]>(
  Array.from({ length: 50000 }, (_, i) => ({
    id: i,
    name: "Foydalanuvchi " + i,
    email: "user" + i + "@mail.com",
  }))
)

// const parentRef = ref<HTMLElement | null>(null)
//
// const virtualizer = useVirtualizer({
//   count: allRows.value.length,
//   getScrollElement: () => parentRef.value,
//   estimateSize: () => 50, // har bir qator ~50px
//   overscan: 5,            // viewport tashqarisida 5 ta qo'shimcha
// })

// Template:
// <div ref="parentRef" style="height: 600px; overflow: auto">
//   <div :style="{ height: virtualizer.getTotalSize() + 'px',
//                   position: 'relative' }">
//     <div v-for="row in virtualizer.getVirtualItems()"
//       :key="row.key"
//       :style="{
//         position: 'absolute',
//         top: row.start + 'px',
//         height: row.size + 'px',
//         width: '100%'
//       }">
//       {{ allRows[row.index].name }}
//     </div>
//   </div>
// </div>

// Natija: 50K qator, faqat ~20 ta DOM element!`,
      description: 'Virtual scrolling — minglab elementda faqat ko`rinadigan qism renderlanadi. 10-100x tezroq.',
    },
  ],
  interviewQA: [
    {
      question: 'Vue 3 da performance optimallashtirish usullarini sanab bering.',
      answer: `1) v-once — statik kontentni 1 marta render. 2) v-memo — dependency array bilan shartli memoization. 3) shallowRef/shallowReactive — katta obyektlarda deep reactivity o'rniga shallow. 4) defineAsyncComponent — komponentlarni lazy load. 5) Virtual scrolling — katta ro'yxatlarda faqat ko'rinadigan qismni render. 6) computed() — natijani cache qilish. 7) Tree-shaking — named import orqali keraksiz API-larni bundle dan chiqarish. 8) KeepAlive — tez-tez almashuvchi komponentlarni cache. Vue-ning template compileri avtomatik statik hoisting ham qiladi.`,
    },
    {
      question: 'shallowRef va ref farqi nima? Qachon shallowRef ishlatiladi?',
      answer: `ref() deep reactivity beradi — ichki barcha nested property kuzatiladi. Katta obyektda bu qimmat. shallowRef() faqat .value o'zgarishini kuzatadi — ichki property o'zgarsa reaktsiya bermaydi. Ishlatish holatlari: katta JSON (API javoblari), tashqi kutubxona instance-lari (Chart.js), katta arraylar (10K+), Canvas/WebGL data. Ichki property o'zgartirilsa triggerRef() bilan majburan yangilash mumkin, yoki butun .value ni yangi obyekt bilan almashtirish kerak.`,
    },
    {
      question: 'v-memo va computed farqi nima?',
      answer: `computed() — yangi QIYMAT hosil qiladi va cache qiladi (dependency o'zgarganda qayta hisoblaydi). v-memo — TEMPLATE rendering-ni optimallashtiradi (dependency o'zgarmasa DOM yangilanmaydi). computed logik natija uchun, v-memo render performance uchun. v-memo asosan v-for ichida katta ro'yxat bilan ishlatiladi — faqat o'zgargan elementlar qayta renderlanadi. computed har joyda kerak, v-memo faqat performance bottleneck bo'lganda.`,
    },
    {
      question: 'Vue da code splitting qanday amalga oshiriladi?',
      answer: `1) Route-based — Vue Router + defineAsyncComponent yoki Nuxt pages/ (avtomatik). Har bir route alohida chunk sifatida yuklanadi. 2) Component-based — defineAsyncComponent(() => import("./Heavy.vue")). Katta modal, chart, editor uchun. 3) Vite avtomatik vendor splitting — node_modules alohida chunk. 4) manualChunks — vite.config da qolda chunk ajratish. Natija: boshlang'ich yuklash tezlashadi, foydalanuvchi faqat kerakli kodni yuklaydi.`,
    },
    {
      question: 'Virtual scrolling nima va qanday ishlaydi?',
      answer: `Virtual scrolling — minglab elementli ro'yxatda faqat viewport ichidagi elementlarni DOM da render qilish texnikasi. Masalan 50K qatorda faqat 20-30 ta DOM element mavjud. Ishlash prinsipi: container-ga belgilangan balandlik beriladi, scroll pozitsiyasiga qarab qaysi elementlar ko'rinishini hisoblaydi, faqat ularni render qiladi, overscan (viewport tashqarisi) orqali scroll silliq ko'rinadi. Vue-da @tanstack/vue-virtual yoki vue-virtual-scroller kutubxonalari ishlatiladi. 10K+ elementda 10-100x performance yaxshilanadi.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'vue-vs-react', label: 'Vue vs React' },
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'teleport-suspense', label: 'Teleport, Suspense, KeepAlive' },
    { techId: 'react-js', sectionId: 'performance', topicId: 'virtualization', label: 'React Virtualization' },
    { techId: 'react-js', sectionId: 'performance', topicId: 'code-splitting', label: 'React Code Splitting' },
  ],
}
