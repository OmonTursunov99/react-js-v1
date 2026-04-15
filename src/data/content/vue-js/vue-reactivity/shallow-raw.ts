import type { Topic } from '../../../types'

export const shallowRaw: Topic = {
  id: 'shallow-raw',
  title: 'shallowRef va markRaw',
  importance: 2,
  status: 'to-learn',
  description: 'shallowRef, shallowReactive, triggerRef, markRaw, toRaw — chuqur reaktivlikdan qochish va performance',
  content: `Vue 3 da barcha reaktiv API-lar (ref, reactive) sukut bo'yicha CHUQUR (deep) reaktivlik yaratadi — nested object-larning HAR BIR property-si Proxy bilan kuzatiladi. Lekin ba'zi hollarda bu keraksiz yoki hatto zararli. shallowRef, shallowReactive, markRaw, toRaw — bu "sayoz" va "xom" API-lar chuqur reaktivlikdan qochish imkonini beradi.

═══════════════════════════════════════
  shallowRef() — FAQAT .value KUZATILADI
═══════════════════════════════════════

shallowRef() — ref yaratadi, lekin .value ichidagi object REAKTIV EMAS. Faqat butun .value almashtirilganda trigger bo'ladi.

  const state = shallowRef({ count: 0, nested: { deep: 1 } })

  state.value.count = 5           // UI yangilanMAYDI!
  state.value.nested.deep = 100   // UI yangilanMAYDI!

  state.value = { count: 5, nested: { deep: 100 } } // UI YANGILANADI!

Qachon ishlatiladi:
- Katta object-lar (1000+ element array)
- Tashqi kutubxona instance-lari (Chart.js, Three.js)
- Immutable data pattern (har safar yangi object yaratish)
- Performance-critical holatlar

═══════════════════════════════════════
  triggerRef() — QIYMATNI KUZATISHGA MAJBURLASH
═══════════════════════════════════════

shallowRef ichidagi property o'zgartirilganda UI yangilanmaydi. Lekin ba'zan biz bilaman — qiymat o'zgardi, yangilanishi kerak. triggerRef() — shallowRef uchun qo'lda trigger.

  const state = shallowRef({ count: 0 })
  state.value.count = 5  // UI yangilanmaydi
  triggerRef(state)       // Endi UI yangilanadi!

Bu pattern KAMDAN-KAM ishlatiladi — odatda yangi object yaratish yaxshiroq.

═══════════════════════════════════════
  shallowReactive() — FAQAT 1-DARAJA
═══════════════════════════════════════

shallowReactive() — faqat yuqori darajadagi property-lar reaktiv. Nested object-lar oddiy qoladi.

  const state = shallowReactive({
    count: 0,                    // reaktiv
    user: { name: 'Ali' },       // user property reaktiv, lekin user.name EMAS
  })

  state.count++                  // UI yangilanadi
  state.user = { name: 'Vali' } // UI yangilanadi (user property o'zgardi)
  state.user.name = 'Karim'     // UI yangilanMAYDI (nested)

═══════════════════════════════════════
  markRaw() — REAKTIVLIKDAN HIMOYA
═══════════════════════════════════════

markRaw() — object-ga __v_skip = true belgi qo'yadi. Bu object reactive() yoki ref() ga berilsa ham HECH QACHON Proxy-ga o'ralMaydi.

  const chartInstance = markRaw(new Chart(...))
  const state = reactive({ chart: chartInstance })
  // state.chart — oddiy object, Proxy EMAS

Qachon ishlatiladi:
- Third-party class instance (Chart.js, Leaflet, monaco-editor)
- Juda katta static data (10,000+ element)
- Prototype chain muhim bo'lgan object-lar
- Performance — keraksiz Proxy yaratishdan qochish

MUHIM: markRaw — ABADIY. Bir marta mark qilingan object boshqa reactive() ga berilsa ham xom qoladi.

═══════════════════════════════════════
  toRaw() — PROXY-DAN ASL OBJECT
═══════════════════════════════════════

toRaw() — reactive Proxy-dan asl (original) object-ni qaytaradi. Bu Proxy-siz ishlash kerak bo'lganda foydali.

  const original = { count: 0 }
  const state = reactive(original)

  console.log(toRaw(state) === original) // true

Qachon ishlatiladi:
- Third-party kutubxonaga Proxy emas, oddiy object yuborish
- JSON.stringify — Proxy bilan ishlasa ham, toRaw tezroq
- Taqqoslash — ikki reactive object asl nusxasini solishtirish
- Debug — Proxy trap-larsiz qiymatni ko'rish

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React da "shallow" tushunchasi boshqacha:
- React.memo — shallow comparison (props ustki darajada tekshiriladi)
- useMemo — kesh, lekin Vue computed kabi granular emas
- Object.freeze — o'zgartirib bo'lmaydi (Vue markRaw ga o'xshash maqsad)

React da "deep reactivity" muammosi aslida YO'Q — chunki React immutable model ishlatadi. setState har safar YANGI object yaratadi. Vue da esa mutable model — shuning uchun shallow/raw API-lar kerak.

Vue shallowRef — React useState ga ENG YAQIN analog:
- Ikkalasida ham yangi reference yaratish kerak yangilanish uchun
- Nested mutatsiya ikkalasida ham UI yangilaMAYDI
- Farq: Vue da triggerRef() bilan majburlash mumkin, React da yo'q`,
  codeExamples: [
    {
      title: 'shallowRef — katta ro\'yxat bilan ishlash',
      language: 'html',
      code: `<script setup lang="ts">
import { shallowRef, triggerRef, computed } from 'vue'

interface DataRow {
  id: number
  name: string
  value: number
  metadata: Record<string, any>
}

// 10,000 qatorli ma'lumot — shallowRef bilan
const tableData = shallowRef<DataRow[]>([])

// Ma'lumotni yuklash — butun array almashtiriladi
async function loadData() {
  const response = await fetch('/api/large-dataset')
  const data: DataRow[] = await response.json()
  tableData.value = data // Butun array — trigger bo'ladi
}

// Immutable yangilash pattern:
function updateRow(id: number, newValue: number) {
  // YANGI array yaratish — trigger bo'ladi
  tableData.value = tableData.value.map(row =>
    row.id === id ? { ...row, value: newValue } : row
  )
}

// YOKI: mutatsiya + triggerRef (kamroq xotira)
function updateRowMutable(id: number, newValue: number) {
  const row = tableData.value.find(r => r.id === id)
  if (row) {
    row.value = newValue    // Mutatsiya — trigger bo'lmaydi
    triggerRef(tableData)   // Qo'lda trigger
  }
}

// Element qo'shish — yangi array
function addRow(row: DataRow) {
  tableData.value = [...tableData.value, row]
}

// Element o'chirish — yangi array
function removeRow(id: number) {
  tableData.value = tableData.value.filter(r => r.id !== id)
}

// Computed — shallowRef bilan ishlaydi
const total = computed(() =>
  tableData.value.reduce((sum, row) => sum + row.value, 0)
)

const rowCount = computed(() => tableData.value.length)
</script>

<template>
  <div>
    <p>{{ rowCount }} qator, jami: {{ total }}</p>
    <button @click="loadData">Yuklash</button>
    <table>
      <tr v-for="row in tableData" :key="row.id">
        <td>{{ row.name }}</td>
        <td>{{ row.value }}</td>
        <td>
          <button @click="updateRow(row.id, row.value + 1)">+1</button>
        </td>
      </tr>
    </table>
  </div>
</template>`,
      description: 'shallowRef katta ro\'yxatlar uchun — har bir element uchun Proxy yaratilmaydi. Immutable update yoki triggerRef pattern.',
    },
    {
      title: 'markRaw — third-party kutubxona instance-lari',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, reactive, markRaw, onMounted, onUnmounted } from 'vue'

// Third-party kutubxona simulatsiyasi
class ChartLibrary {
  private canvas: HTMLCanvasElement | null = null
  private data: number[] = []

  mount(el: HTMLCanvasElement) {
    this.canvas = el
    this.render()
  }

  setData(data: number[]) {
    this.data = data
    this.render()
  }

  private render() {
    if (!this.canvas) return
    const ctx = this.canvas.getContext('2d')
    // ... chart rendering logic
    console.log('Chart rendered with', this.data.length, 'points')
  }

  destroy() {
    this.canvas = null
    console.log('Chart destroyed')
  }
}

// markRaw — Proxy-ga O'RALMAYDI
// Agar markRaw ishlatilmasa — Vue ChartLibrary prototype chain ni buzadi
const chartInstance = ref<ChartLibrary | null>(null)
const chartData = ref<number[]>([10, 20, 30, 40, 50])

const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (canvasRef.value) {
    // markRaw bilan o'rash — Proxy qilishdan himoya
    const chart = markRaw(new ChartLibrary())
    chart.mount(canvasRef.value)
    chart.setData(chartData.value)
    chartInstance.value = chart
  }
})

onUnmounted(() => {
  chartInstance.value?.destroy()
})

function updateChart() {
  const newData = Array.from({ length: 10 }, () => Math.random() * 100)
  chartData.value = newData
  chartInstance.value?.setData(newData)
}

// ===== reactive ichida markRaw =====
interface AppState {
  // Reaktiv:
  count: number
  items: string[]
  // Reaktiv EMAS (markRaw):
  editor: any
  map: any
}

const appState: AppState = reactive({
  count: 0,
  items: [],
  editor: markRaw({ /* monaco editor instance */ }),
  map: markRaw({ /* leaflet map instance */ }),
})

// appState.count++ — reaktiv, UI yangilanadi
// appState.editor.setValue('...') — reaktiv EMAS, kerak ham emas
</script>

<template>
  <div>
    <canvas ref="canvasRef" width="400" height="200"></canvas>
    <button @click="updateChart">Ma'lumotni yangilash</button>
  </div>
</template>`,
      description: 'markRaw — Chart.js, Leaflet, Monaco Editor kabi third-party instance-larni Proxy-dan himoya qilish.',
    },
    {
      title: 'toRaw — asl object-ni olish',
      language: 'ts',
      code: `import { reactive, toRaw, markRaw, isReactive, isProxy } from 'vue'

// ===== toRaw — Proxy-dan original object =====

const original = { name: 'Ali', age: 25, skills: ['Vue'] }
const state = reactive(original)

console.log(state === original)        // false — state Proxy
console.log(toRaw(state) === original) // true — asl object

// ===== Qachon kerak? =====

// 1. Third-party kutubxonaga yuborish
function sendToAnalytics(data: Record<string, any>) {
  // Ba'zi kutubxonalar Proxy bilan ishlay olmaydi
  // toRaw — oddiy object qaytaradi
  const rawData = toRaw(data)
  // analyticsSDK.track(rawData)
  console.log('Sent:', rawData)
}

// 2. JSON.stringify optimizatsiyasi
const bigState = reactive({
  items: Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    value: Math.random(),
  })),
})

// Proxy orqali — har bir property uchun get trap ishlaydi
const jsonSlow = JSON.stringify(bigState)

// toRaw orqali — trap-larsiz, tezroq
const jsonFast = JSON.stringify(toRaw(bigState))

// 3. Taqqoslash
const stateA = reactive({ x: 1 })
const stateB = reactive({ x: 1 })

console.log(stateA === stateB)             // false — har xil Proxy
console.log(toRaw(stateA) === toRaw(stateB)) // false — har xil object

// 4. structuredClone bilan
const copy = structuredClone(toRaw(state))
// Proxy — structuredClone bilan ishlaMAYDI
// toRaw orqali oddiy object-ga aylantirib clone qilish

// ===== Nested toRaw =====
const nested = reactive({
  inner: { value: 42 }
})

console.log(isReactive(nested.inner))         // true — nested Proxy
console.log(isProxy(toRaw(nested).inner))     // false — toRaw faqat yuqori daraja
// MUHIM: toRaw() faqat 1 daraja — nested Proxy-lar qoladi
// Chuqur raw kerak bo'lsa — recursive yozish kerak

function deepToRaw<T>(obj: T): T {
  const raw = toRaw(obj)
  if (typeof raw !== 'object' || raw === null) return raw
  if (Array.isArray(raw)) {
    return raw.map(deepToRaw) as T
  }
  const result: Record<string, any> = {}
  for (const key of Object.keys(raw)) {
    result[key] = deepToRaw((raw as Record<string, any>)[key])
  }
  return result as T
}`,
      description: 'toRaw — Proxy-dan asl object olish. Third-party SDK, JSON.stringify optimizatsiyasi va structuredClone uchun.',
    },
    {
      title: 'shallowReactive va amaliy pattern-lar',
      language: 'html',
      code: `<script setup lang="ts">
import { shallowReactive, shallowRef, markRaw, watch } from 'vue'

// ===== shallowReactive — faqat 1-daraja reaktiv =====
interface DashboardState {
  isLoading: boolean
  currentTab: string
  // Nested — reaktiv EMAS:
  chartConfig: {
    type: string
    options: Record<string, any>
  }
  rawData: any[]
}

const dashboard = shallowReactive<DashboardState>({
  isLoading: false,       // reaktiv
  currentTab: 'overview', // reaktiv
  chartConfig: {          // reaktiv (property o'zi), lekin ichki EMAS
    type: 'bar',
    options: { animate: true },
  },
  rawData: [],            // reaktiv (property o'zi)
})

// UI yangilanadi:
dashboard.isLoading = true
dashboard.currentTab = 'details'
dashboard.chartConfig = { type: 'line', options: {} } // yangi object — ishlaydi

// UI yangilanMAYDI:
dashboard.chartConfig.type = 'pie'          // nested — kuzatilMaydi
dashboard.chartConfig.options.animate = false // nested — kuzatilMaydi

// ===== Amaliy pattern: Plugin registry =====
interface Plugin {
  name: string
  instance: any // markRaw qilingan instance
  enabled: boolean
}

const plugins = shallowReactive<Map<string, Plugin>>(new Map())

function registerPlugin(name: string, PluginClass: any) {
  plugins.set(name, {
    name,
    instance: markRaw(new PluginClass()), // Instance — reaktiv emas
    enabled: true,
  })
}

function togglePlugin(name: string) {
  const plugin = plugins.get(name)
  if (plugin) {
    // Map.set — shallowReactive trigger beradi
    plugins.set(name, { ...plugin, enabled: !plugin.enabled })
  }
}

// ===== Performance comparison =====
const ITEMS_COUNT = 50_000

// SEKIN — har bir element va uning property-lari Proxy bo'ladi:
// const heavyReactive = reactive(
//   Array.from({ length: ITEMS_COUNT }, (_, i) => ({
//     id: i, value: Math.random(), metadata: { created: Date.now() }
//   }))
// )

// TEZKOR — faqat array o'zi kuzatiladi:
const heavyShallow = shallowRef(
  Array.from({ length: ITEMS_COUNT }, (_, i) => ({
    id: i, value: Math.random(), metadata: { created: Date.now() }
  }))
)
</script>

<template>
  <div>
    <p>Tab: {{ dashboard.currentTab }}</p>
    <p>Loading: {{ dashboard.isLoading }}</p>
    <p>Plugins: {{ plugins.size }}</p>
  </div>
</template>`,
      description: 'shallowReactive, shallowRef va markRaw birgalikda — katta ma\'lumotlar va third-party instance bilan ishlash.',
    },
  ],
  interviewQA: [
    {
      question: 'shallowRef va ref orasidagi farq nima va qachon shallowRef ishlatiladi?',
      answer: `ref() — chuqur reaktivlik: .value ichidagi object ham Proxy-ga o'raladi, nested property o'zgarishi ham kuzatiladi. shallowRef() — sayoz reaktivlik: faqat .value ALMASHTIRILGANDA trigger bo'ladi, ichidagi property o'zgarishi kuzatilMAYDI. shallowRef qachon: 1) Katta array/object — 10,000+ element, har biri uchun Proxy yaratish keraksiz. 2) Immutable pattern — har safar yangi object yaratish (React useState ga o'xshash). 3) Third-party instance — ref ichida markRaw qilinmagan object. 4) Performance-critical — rendering bottleneck bo'lganda. triggerRef() — shallowRef ichidagi mutatsiyadan keyin qo'lda trigger qilish imkonini beradi.`,
    },
    {
      question: 'markRaw() nima uchun kerak va uni ishlatmaslik qanday muammolarga olib keladi?',
      answer: `markRaw() — object-ga __v_skip belgi qo'yadi. Bu object reactive/ref ichiga qo'yilsa ham HECH QACHON Proxy-ga o'ralMAYDI. Kerak hollari: 1) Third-party class instance (Chart.js, Three.js, Monaco) — Proxy ularning prototype chain va internal state-ni buzishi mumkin. 2) Juda katta static data — 50,000+ element, Proxy yaratish xotira va vaqt sarflaydi. 3) Performance — keraksiz dependency tracking. markRaw ISHLATMASLIK muammolari: Chart.js instance reactive() ichiga qo'yilsa — Proxy uning metodlarini intercept qiladi, instanceof tekshiruvi buziladi, internal _meta property-lari track/trigger qiladi — xotira leak va xatolar. MUHIM: markRaw abadiy — qayta reactive qilib bo'lMaydi.`,
    },
    {
      question: 'toRaw() va markRaw() orasidagi farq nima?',
      answer: `toRaw(proxy) — mavjud Proxy-dan asl original object-ni QAYTARADI. Bu vaqtinchalik — faqat shu murojaat uchun. Asl object-ni olib ishlatgandan keyin Proxy hali ham mavjud va reaktiv. markRaw(object) — object-ga DOIMIY belgi qo'yadi — bu object hech qachon reactive/Proxy bo'la olMAYDI. Bu object reactive() yoki ref() ga berilsa ham oddiy qoladi. toRaw ishlatish: JSON.stringify optimizatsiyasi, third-party SDK-ga yuborish, structuredClone, debug. markRaw ishlatish: third-party instance yaratish, katta static data, reactive ichiga qo'yiladigan lekin kuzatilmasligi kerak bo'lgan object. Oddiy qilib: toRaw — "oldindan yaratilgan Proxy-dan chiqish", markRaw — "Proxy-ga kirmaslikni kafolatlash".`,
    },
    {
      question: 'shallowReactive va shallowRef orasidagi farq va qachon qaysi biri ishlatiladi?',
      answer: `shallowReactive() — yuqori darajadagi property-lar reaktiv, nested emas. Property qo'shish/o'chirish/o'zgartirish kuzatiladi, lekin property ichidagi o'zgarish kuzatilMAYDI. shallowRef() — faqat .value ALMASHTIRILGANDA trigger. Ichidagi HECH NARSA kuzatilMAYDI. Farq: shallowReactive-da state.count++ ishlaydi (top-level), shallowRef-da state.value.count++ ishlaMAYDI. shallowReactive qachon: form state bilan, lekin nested object-lar kuzatilmasin. shallowRef qachon: butun object almashtirilsin (immutable pattern). Amalda shallowRef KO'PROQ ishlatiladi — chunki u ref pattern bilan consistent va immutable update Vue community-da ko'proq tavsiya etiladi.`,
    },
    {
      question: 'Katta ma\'lumotlar bilan ishlashda Vue reaktivlik performance qanday optimallashtiriladi?',
      answer: `1) shallowRef + immutable update — katta array/object uchun. Faqat .value almashtirish trigger beradi, har element uchun Proxy yo'q. 2) markRaw — static yoki third-party data uchun. Proxy yaratilmaydi. 3) v-memo (Vue 3.2+) — template ichida array rendering keshlash. 4) Virtual scroll — faqat ko'rinadigan elementlar render qilinadi. 5) computed — filter/sort natijalarini keshlash. 6) shallowReactive — faqat kerakli daraja reaktiv. 7) Web Worker — og'ir hisoblashni alohida thread-da. 8) toRaw + JSON.stringify — Proxy trap-larsiz serialization. Qoida: avval profiling, keyin optimallashtirish. Vue DevTools Performance tab — bottleneck aniqlash uchun.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'ref-vs-reactive', label: 'ref() vs reactive()' },
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'reactivity-deep', label: 'Reaktivlik mexanizmi' },
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'effect-scope', label: 'effectScope API' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'composition-api', label: 'Composition API' },
  ],
}
