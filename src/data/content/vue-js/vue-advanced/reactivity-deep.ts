import type { Topic } from '../../../types'

export const reactivityDeep: Topic = {
  id: 'reactivity-deep',
  title: 'Reaktivlik chuqur',
  importance: 3,
  status: 'to-learn',
  description: 'Reactivity system, shallowRef, toRefs, markRaw, effectScope — ichki mexanizm',
  content: `Vue 3 reaktivlik tizimi JavaScript Proxy API ga asoslangan. Bu mavzuda chuqurroq tushuncha va ilg'or API-lar ko'rib chiqiladi.

═══════════════════════════════════════
  PROXY VA DEPENDENCY TRACKING
═══════════════════════════════════════

reactive() chaqirilganda Vue Proxy yaratadi:

  const state = reactive({ count: 0 })
  // Ichki: new Proxy({ count: 0 }, { get, set })

GET trap (o'qish) — dependency track qiladi:
  - Qaysi effect (render, computed, watch) bu property-ni o'qiyotganini eslab qoladi

SET trap (yozish) — dependency trigger qiladi:
  - Shu property-ni kuzatayotgan barcha effect-larni qayta ishga tushiradi

Bu avtomatik — dasturchi hech narsa qilishi shart emas.
React-da dependency array qo'lda yoziladi, Vue-da AVTOMATIK.

═══════════════════════════════════════
  shallowRef() VA shallowReactive()
═══════════════════════════════════════

Oddiy ref/reactive — CHUQUR reaktiv (nested object ham kuzatiladi):
  const deep = ref({ nested: { value: 1 } })
  deep.value.nested.value = 2  // reaktiv — re-render

shallowRef — faqat .value o'zgarsa reaktiv:
  const shallow = shallowRef({ nested: { value: 1 } })
  shallow.value.nested.value = 2  // reaktiv EMAS — re-render bo'lmaydi!
  shallow.value = { nested: { value: 2 } }  // reaktiv — yangi object

shallowReactive — faqat birinchi daraja reaktiv:
  const state = shallowReactive({ a: 1, nested: { b: 2 } })
  state.a = 10            // reaktiv
  state.nested.b = 20     // reaktiv EMAS

QACHON ISHLATILADI:
- Katta object/massivlar (1000+ element) — performance uchun
- Tashqi kutubxona objectlari (ular o'z reaktivligini boshqaradi)
- Faqat to'liq almashtirish kerak bo'lgan holatlar

═══════════════════════════════════════
  toRef() VA toRefs()
═══════════════════════════════════════

reactive() object-ni destructure qilganda reaktivlik YO'QOLADI:
  const state = reactive({ x: 1, y: 2 })
  let { x, y } = state  // x=1, y=2 — ODDIY raqamlar!

toRefs() — har bir property-ni ref() ga o'raydi:
  const { x, y } = toRefs(state)  // x va y — Ref<number>
  x.value++  // state.x ham o'zgaradi!

toRef() — bitta property uchun:
  const x = toRef(state, 'x')  // Ref<number>

Composable-dan reactive object qaytarganda toRefs ishlatiladi:
  function useMouse() {
    const state = reactive({ x: 0, y: 0 })
    // ...
    return toRefs(state)  // destructure qilsa ham reaktiv
  }

═══════════════════════════════════════
  markRaw() VA toRaw()
═══════════════════════════════════════

markRaw() — objectni HECH QACHON reaktiv qilmaslik:
  const rawObj = markRaw({ big: 'data' })
  const state = reactive({ data: rawObj })
  // state.data reaktiv EMAS — performance uchun

toRaw() — reactive proxy dan original objectni olish:
  const original = { count: 0 }
  const state = reactive(original)
  console.log(toRaw(state) === original) // true

Ishlatish holatlari:
- Tashqi kutubxona instance-lari (Chart.js, D3, Three.js)
- Katta o'zgarmas ma'lumotlar (GeoJSON, katta massivlar)
- Class instance-lar (method-lar proxy bilan ishlamasligi mumkin)

═══════════════════════════════════════
  effectScope()
═══════════════════════════════════════

Bir nechta reaktiv effect-larni guruhlash va birdaniga tozalash:

  const scope = effectScope()

  scope.run(() => {
    const count = ref(0)
    const doubled = computed(() => count.value * 2)
    watch(count, () => console.log('o\\'zgardi'))
    watchEffect(() => console.log(count.value))
  })

  // Birdaniga BARCHASINI tozalash:
  scope.stop()  // computed, watch, watchEffect — hammasi to'xtaydi

Ishlatish: composable-lar, plugin-lar, test tozalash.

═══════════════════════════════════════
  triggerRef() VA customRef()
═══════════════════════════════════════

triggerRef() — shallowRef-ni qo'lda trigger qilish:
  const shallow = shallowRef({ count: 0 })
  shallow.value.count++      // reaktiv emas
  triggerRef(shallow)         // endi re-render bo'ladi!

customRef() — o'z reaktiv ref-ini yaratish (debounce, throttle):
  function useDebouncedRef(value, delay = 300) {
    let timeout
    return customRef((track, trigger) => ({
      get() { track(); return value },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }))
  }`,
  codeExamples: [
    {
      title: 'shallowRef va triggerRef — performance',
      language: 'html',
      code: `<script setup lang="ts">
import { shallowRef, triggerRef, computed } from 'vue'

interface DataRow {
  id: number
  value: number
  label: string
}

// 10,000 qatorli ma'lumot — shallowRef bilan
const bigData = shallowRef<DataRow[]>(
  Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    value: Math.random() * 100,
    label: \`Element \${i}\`,
  }))
)

const total = computed(() =>
  bigData.value.reduce((sum, row) => sum + row.value, 0)
)

// Bitta elementni o'zgartirish
function updateItem(id: number) {
  const item = bigData.value.find(r => r.id === id)
  if (item) {
    item.value = Math.random() * 100
    // shallowRef — ichki o'zgarishni sezmaydi
    // qo'lda trigger qilish kerak:
    triggerRef(bigData)
  }
}

// Hammani yangilash — yangi massiv
function refreshAll() {
  bigData.value = bigData.value.map(row => ({
    ...row,
    value: Math.random() * 100,
  }))
  // Yangi massiv = yangi referens = avtomatik trigger
}
</script>

<template>
  <div>
    <p>Jami: {{ total.toFixed(2) }}</p>
    <p>Elementlar soni: {{ bigData.length }}</p>
    <button @click="refreshAll">Hammani yangilash</button>
    <button @click="updateItem(0)">Birinchini yangilash</button>
  </div>
</template>`,
      description: 'shallowRef — katta massivlar uchun performance optimizatsiya. triggerRef — ichki o\'zgarishlarni qo\'lda bildirish.',
    },
    {
      title: 'toRefs va composable pattern',
      language: 'ts',
      code: `import { reactive, toRefs, onMounted, onUnmounted } from 'vue'

// ========== Composable — qayta ishlatiladigan logika ==========

export function useMouse() {
  const state = reactive({
    x: 0,
    y: 0,
    isInside: false,
  })

  function handleMove(e: MouseEvent) {
    state.x = e.clientX
    state.y = e.clientY
  }

  function handleEnter() { state.isInside = true }
  function handleLeave() { state.isInside = false }

  onMounted(() => {
    window.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseenter', handleEnter)
    document.addEventListener('mouseleave', handleLeave)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMove)
    document.removeEventListener('mouseenter', handleEnter)
    document.removeEventListener('mouseleave', handleLeave)
  })

  // toRefs — destructure qilinganda ham reaktiv qoladi
  return toRefs(state)
}

// ========== Ishlatish ==========
// <script setup>
// const { x, y, isInside } = useMouse()
// // x, y, isInside — hammasi Ref, reaktiv
// </script>
//
// <template>
//   <p>{{ x }}, {{ y }} | Ichidami: {{ isInside }}</p>
// </template>

// ========== toRef — bitta property uchun ==========
import { toRef } from 'vue'

interface Props {
  modelValue: string
  disabled?: boolean
}

// Composable ichida props dan bitta property olish:
// const disabled = toRef(props, 'disabled')
// disabled reactivity saqlanadi`,
      description: 'toRefs — composable-dan reactive object qaytarganda. Destructure qilganda reaktivlik saqlanadi.',
    },
    {
      title: 'customRef — debounced input',
      language: 'html',
      code: `<script setup lang="ts">
import { customRef, ref, watch } from 'vue'

// ========== customRef — debounce logic ref ichida ==========
function useDebouncedRef<T>(initialValue: T, delay = 300) {
  let timeout: ReturnType<typeof setTimeout>

  return customRef<T>((track, trigger) => {
    let value = initialValue

    return {
      get() {
        track()  // dependency tracking — bu ref ni kim o'qiyotganini eslab qolish
        return value
      },
      set(newValue: T) {
        clearTimeout(timeout)  // oldingi timerni bekor qilish
        timeout = setTimeout(() => {
          value = newValue
          trigger()  // re-render — yangi qiymatni bildirish
        }, delay)
      },
    }
  })
}

// ========== Ishlatish ==========
const search = useDebouncedRef('', 500)  // 500ms debounce
const results = ref<string[]>([])
const isSearching = ref(false)

// search o'zgarganida (500ms keyin) API chaqiruv
watch(search, async (query) => {
  if (!query) {
    results.value = []
    return
  }

  isSearching.value = true
  // API simulatsiya
  await new Promise(r => setTimeout(r, 200))
  results.value = [
    \`"\${query}" bo'yicha natija 1\`,
    \`"\${query}" bo'yicha natija 2\`,
    \`"\${query}" bo'yicha natija 3\`,
  ]
  isSearching.value = false
})
</script>

<template>
  <div>
    <input
      :value="search"
      @input="search = ($event.target as HTMLInputElement).value"
      placeholder="Qidirish (500ms debounce)..."
    />
    <p v-if="isSearching">Qidirilmoqda...</p>
    <ul v-else>
      <li v-for="result in results" :key="result">{{ result }}</li>
    </ul>
  </div>
</template>`,
      description: 'customRef — o\'z reaktiv ref yaratish. Debounce logikasi ref ichida — komponent toza qoladi.',
    },
  ],
  interviewQA: [
    {
      question: 'Vue 3 reaktivlik tizimi qanday ishlaydi? Vue 2 dan farqi nima?',
      answer: `Vue 3 — JavaScript Proxy API ishlatadi. Object atrofida Proxy yaratiladi, get trap — dependency track qiladi (qaysi effect bu property-ni o'qiydi), set trap — dependency trigger qiladi (barcha kuzatuvchilarni qayta ishga tushiradi). Vue 2 — Object.defineProperty ishlatgan. Farq: Vue 2 da yangi property qo'shish kuzatilmas edi (Vue.set kerak), array index bo'yicha o'zgartirish ishlamasdi. Vue 3 Proxy bilan bu muammolar BUTUNLAY hal bo'ldi. Proxy — butun objectni kuzatadi.`,
    },
    {
      question: 'shallowRef/shallowReactive qachon ishlatiladi?',
      answer: `Katta, chuqur nested objectlar bilan ishlaganda — deep reactivity keraksiz overhead yaratadi. Har bir nested property uchun Proxy yaratiladi. shallowRef — faqat .value reference o'zgarishini kuzatadi, ichki property-lar reaktiv emas. shallowReactive — faqat birinchi daraja reaktiv. Ishlatish: 1) 1000+ elementli massivlar, 2) tashqi kutubxona instance-lari (Chart.js), 3) GeoJSON kabi katta ma'lumotlar. triggerRef() bilan qo'lda trigger qilish mumkin.`,
    },
    {
      question: 'toRefs() va toRef() nima uchun kerak?',
      answer: `reactive() object destructure qilinganda reaktivlik yo'qoladi — chunki JavaScript destructure yangi o'zgaruvchilar yaratadi, Proxy bilan bog'lanish uziladi. toRefs() — har bir property-ni Ref ga o'raydi, original object bilan sinxronlangan bo'lib qoladi. Asosiy ishlatish — composable-dan reactive object qaytarganda: return toRefs(state). Ota tomondan: const { x, y } = useMouse() — x, y reaktiv. toRef() — bitta property uchun.`,
    },
    {
      question: 'effectScope() nima va qachon kerak?',
      answer: `effectScope() — bir nechta reaktiv effect-larni (computed, watch, watchEffect) guruhlash va birdaniga tozalash. scope.run(() => { ... }) ichidagi barcha effect-lar shu scope ga tegishli. scope.stop() — hammasini birdan tozalaydi. Ishlatish: 1) plugin/kutubxona — foydalanuvchi scope.stop() bilan barcha subscription-larni tozalaydi, 2) composable-larda — testda tozalash, 3) komponent tashqarisida reaktiv logika yaratish. Komponent ichida Vue avtomatik scope yaratadi — onUnmounted da avtomatik tozalanadi.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'composition-api', label: 'Composition API' },
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'composables', label: 'Composables' },
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'performance', label: 'Performance' },
  ],
}
