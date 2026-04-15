import type { Topic } from '../../../types'

export const computedDeep: Topic = {
  id: 'computed-deep',
  title: 'Computed chuqur',
  importance: 2,
  status: 'to-learn',
  description: 'Computed properties — readonly, writable, debugging, performance, best practices va anti-patternlar',
  content: `computed() — Vue reaktivlik tizimining eng muhim qismlaridan biri. U boshqa reaktiv qiymatlardan HISOBLANGAN yangi qiymat yaratadi va natijani KESHLAYDI. Dependency o'zgarmasa — qayta hisoblanMAYDI. Senior darajada computed ning ichki ishlashi, writable computed, debugging va anti-patternlarni bilish zarur.

═══════════════════════════════════════
  COMPUTED ICHKI MEXANIZMI
═══════════════════════════════════════

computed() ichida Vue ComputedRefImpl yaratadi. Bu maxsus ref bo'lib:
1. _dirty flag — qiymat eskirganmi?
2. getter funksiyasi — hisoblash logikasi
3. Dependency tracking — getter ichidagi reaktiv qiymatlar kuzatiladi

Ishlash tartibi:
- Birinchi o'qishda: getter ishlaydi, natija keshlanadi, _dirty = false
- Dependency o'zgarganda: _dirty = true (lekin getter hali ishlaMAYDI!)
- Keyingi O'QISHDA: _dirty = true bo'lsa — getter qayta ishlaydi
- O'qilMASA — getter ISHLAMAYDI (lazy evaluation)

Bu "lazy" xususiyat muhim: computed qiymat o'zgarsa ham, uni hech kim o'qiMAsa — hisoblash SARFLANMAYDI.

═══════════════════════════════════════
  READONLY VA WRITABLE COMPUTED
═══════════════════════════════════════

Oddiy computed — faqat O'QISH mumkin:
  const fullName = computed(() => first.value + ' ' + last.value)
  fullName.value = 'Yangi' // XATO — readonly!

Writable computed — o'qish VA yozish:
  const fullName = computed({
    get: () => first.value + ' ' + last.value,
    set: (val: string) => {
      const [f, l] = val.split(' ')
      first.value = f
      last.value = l
    }
  })
  fullName.value = 'Ali Valiyev' // Ishlaydi — first va last yangilanadi

Writable computed qachon ishlatiladi:
- v-model bilan ikki tomonlama bog'lanish
- Store getter/setter pattern
- Legacy API bilan moslashuv

═══════════════════════════════════════
  COMPUTED VS METHOD
═══════════════════════════════════════

Asosiy farq — KESHLASH:
- computed: dependency o'zgarmasa — eski natijani qaytaradi (keshdan)
- method: HAR CHAQIRUVDA qayta ishlaydi

Qachon computed:
- Qiymat boshqa reaktiv qiymatlardan kelib chiqsa
- Hisoblash og'ir bo'lsa (filter, sort, map)
- Natija bir nechta joyda ishlatilsa

Qachon method:
- Side-effect kerak bo'lsa (API call, DOM manipulatsiya)
- Argument kerak bo'lsa (computed argument qabul qilMAYDI)
- Event handler sifatida

MUHIM: Template ichida method() chaqirsa — har renderda ishlaydi. computed — faqat dependency o'zgarganda.

═══════════════════════════════════════
  DEBUGGING — onTrack / onTrigger
═══════════════════════════════════════

Development mode-da computed ga debug opsiyalari bor:

  const total = computed(() => price.value * quantity.value, {
    onTrack(e) {
      // Dependency qo'shilganda — qaysi property track qilindi?
      console.log('Track:', e.target, e.key)
    },
    onTrigger(e) {
      // Qayta hisoblash boshlanganda — qaysi property o'zgardi?
      console.log('Trigger:', e.target, e.key, e.newValue)
      debugger // DevTools-da to'xtash
    }
  })

Bu debug opsiyalari faqat DEVELOPMENT mode-da ishlaydi — production-da olib tashlanadi.

═══════════════════════════════════════
  ANTI-PATTERNLAR
═══════════════════════════════════════

1. Side-effect qo'yish — XATO:
   computed(() => { fetch('/api/data'); return count.value })
   // Qachon ishlashi NOMA'LUM — computed lazy

2. Boshqa reactive qiymatni o'zgartirish — XATO:
   computed(() => { otherRef.value = count.value * 2; return count.value })
   // Infinite loop xavfi

3. Asinxron computed — ISHLAMAYDI:
   computed(async () => await fetchData())
   // computed sinxron bo'lishi SHART

4. Og'ir computed dependency-siz — KERAKSIZ:
   computed(() => heavyCalculation(staticValue))
   // Dependency yo'q — hech qachon qayta hisoblanmaydi, oddiy const yetarli

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React useMemo:
- Dependency array qo'lda yoziladi: useMemo(() => ..., [a, b])
- Har render-da dependency solishtirish ishlaydi
- React kafolatlamaydi — keshni istalgan vaqt tashlashi mumkin
- Faqat komponent ichida ishlaydi

Vue computed:
- Dependency AVTOMATIK aniqlanadi — qo'lda ko'rsatish shart emas
- Lazy — faqat o'qilganda hisoblanadi
- KAFOLATLANGAN kesh — dependency o'zgarMAsa qayta hisoblanMAYDI
- Komponent tashqarisida ham ishlaydi (composable, store)
- Writable bo'lishi mumkin (useMemo emas)

React Compiler (React 19+) avtomatik memoizatsiya qiladi, lekin bu hali Vue computed kadar aniq va ishonchli emas.`,
  codeExamples: [
    {
      title: 'Computed asosiy ishlatish va keshlash',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, computed } from 'vue'

interface Product {
  id: number
  name: string
  price: number
  category: string
  inStock: boolean
}

const products = ref<Product[]>([
  { id: 1, name: 'Laptop', price: 1500, category: 'electronics', inStock: true },
  { id: 2, name: 'Kitob', price: 25, category: 'books', inStock: true },
  { id: 3, name: 'Telefon', price: 800, category: 'electronics', inStock: false },
  { id: 4, name: 'Qalam', price: 5, category: 'office', inStock: true },
  { id: 5, name: 'Monitor', price: 400, category: 'electronics', inStock: true },
])

const selectedCategory = ref<string>('all')
const sortBy = ref<'price' | 'name'>('name')
const showOnlyInStock = ref(false)

// Computed — og'ir filter/sort KESHLANADI
const filteredProducts = computed(() => {
  console.log('filteredProducts qayta hisoblandi') // Debug

  let result = products.value

  // Category filter
  if (selectedCategory.value !== 'all') {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  // In stock filter
  if (showOnlyInStock.value) {
    result = result.filter(p => p.inStock)
  }

  // Sort
  return [...result].sort((a, b) => {
    if (sortBy.value === 'price') return a.price - b.price
    return a.name.localeCompare(b.name)
  })
})

// Derived computed — filteredProducts ga asoslangan
const totalPrice = computed(() =>
  filteredProducts.value.reduce((sum, p) => sum + p.price, 0)
)

const productCount = computed(() => filteredProducts.value.length)

// Unique categories
const categories = computed(() => {
  const cats = new Set(products.value.map(p => p.category))
  return ['all', ...cats]
})
</script>

<template>
  <div>
    <select v-model="selectedCategory">
      <option v-for="cat in categories" :key="cat" :value="cat">
        {{ cat }}
      </option>
    </select>

    <label>
      <input v-model="showOnlyInStock" type="checkbox" /> Faqat mavjud
    </label>

    <p>{{ productCount }} ta mahsulot, jami: \${{ totalPrice }}</p>

    <ul>
      <li v-for="product in filteredProducts" :key="product.id">
        {{ product.name }} — \${{ product.price }}
        <span v-if="!product.inStock"> (tugagan)</span>
      </li>
    </ul>
  </div>
</template>`,
      description: 'Computed bilan og\'ir filter/sort operatsiyasi keshlanadi. Dependency o\'zgarmasa qayta hisoblanmaydi.',
    },
    {
      title: 'Writable computed — v-model bilan',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, computed } from 'vue'

// ===== 1. Oddiy writable computed =====
const firstName = ref('Ali')
const lastName = ref('Valiyev')

const fullName = computed({
  get: () => \`\${firstName.value} \${lastName.value}\`,
  set: (value: string) => {
    const parts = value.split(' ')
    firstName.value = parts[0] || ''
    lastName.value = parts.slice(1).join(' ') || ''
  },
})

// ===== 2. v-model + store pattern =====
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// v-model uchun writable computed — JUDA KO'P ISHLATILADIGAN PATTERN
const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// ===== 3. Formatlash/parsing =====
const rawPrice = ref(1500)

const formattedPrice = computed({
  get: () => rawPrice.value.toLocaleString('uz-UZ') + ' so\\'m',
  set: (value: string) => {
    const num = parseInt(value.replace(/\\D/g, ''), 10)
    if (!isNaN(num)) rawPrice.value = num
  },
})

// ===== 4. Checked items pattern =====
const allItems = ref(['a', 'b', 'c', 'd'])
const checkedItems = ref<string[]>([])

const isAllChecked = computed({
  get: () => checkedItems.value.length === allItems.value.length,
  set: (checked: boolean) => {
    checkedItems.value = checked ? [...allItems.value] : []
  },
})
</script>

<template>
  <div>
    <!-- fullName v-model bilan -->
    <input v-model="fullName" placeholder="To'liq ism" />
    <p>Ism: {{ firstName }}, Familiya: {{ lastName }}</p>

    <!-- Formatlangan narx -->
    <input v-model="formattedPrice" />
    <p>Haqiqiy qiymat: {{ rawPrice }}</p>

    <!-- Barchasini tanlash -->
    <label>
      <input v-model="isAllChecked" type="checkbox" /> Barchasi
    </label>
    <label v-for="item in allItems" :key="item">
      <input v-model="checkedItems" :value="item" type="checkbox" />
      {{ item }}
    </label>
  </div>
</template>`,
      description: 'Writable computed — v-model, formatlash va "barchasini tanlash" patternlari.',
    },
    {
      title: 'Debugging computed — onTrack/onTrigger',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, computed } from 'vue'

const price = ref(100)
const quantity = ref(3)
const discount = ref(0.1)

// Debug opsiyalari bilan computed
const total = computed(
  () => {
    const subtotal = price.value * quantity.value
    const discountAmount = subtotal * discount.value
    return subtotal - discountAmount
  },
  {
    onTrack(e) {
      // Qaysi dependency track qilindi?
      // e.target — reaktiv object
      // e.key — property nomi
      // e.type — 'get' | 'has' | 'iterate'
      console.log(\`[TRACK] \${String(e.key)} — \${e.type}\`)
      // Natija:
      // [TRACK] value — get  (price)
      // [TRACK] value — get  (quantity)
      // [TRACK] value — get  (discount)
    },
    onTrigger(e) {
      // Qaysi dependency o'zgardi va qayta hisoblash boshlandi?
      // e.target — o'zgargan object
      // e.key — o'zgargan property
      // e.newValue — yangi qiymat
      // e.oldValue — eski qiymat
      console.log(
        \`[TRIGGER] \${String(e.key)}: \${e.oldValue} -> \${e.newValue}\`
      )
      debugger // DevTools da to'xtash — call stack ko'rish mumkin
    },
  }
)

// Vue DevTools ham computed dependency-larni ko'rsatadi
// Components -> State -> computed -> dependency graph

function updatePrice() {
  price.value = 150
  // Console: [TRIGGER] value: 100 -> 150
}

function updateQuantity() {
  quantity.value = 5
  // Console: [TRIGGER] value: 3 -> 5
}
</script>

<template>
  <div>
    <p>Narx: {{ price }} | Soni: {{ quantity }} | Chegirma: {{ discount * 100 }}%</p>
    <p><strong>Jami: {{ total }}</strong></p>
    <button @click="updatePrice">Narx o'zgartirish</button>
    <button @click="updateQuantity">Sonni o'zgartirish</button>
  </div>
</template>`,
      description: 'onTrack — qaysi dependency qo\'shilganini, onTrigger — qaysi dependency o\'zgarganini ko\'rsatadi (faqat dev mode).',
    },
    {
      title: 'Computed anti-patternlar',
      language: 'ts',
      code: `import { ref, computed, watch } from 'vue'

const count = ref(0)
const data = ref<string[]>([])

// ===== ANTI-PATTERN 1: Side-effect =====
// XATO:
const badComputed = computed(() => {
  // fetch('/api/data') // XATO — side-effect!
  // localStorage.setItem('count', String(count.value)) // XATO!
  return count.value * 2
})

// TO'G'RI — watch ishlatish:
watch(count, (newCount) => {
  localStorage.setItem('count', String(newCount))
})

// ===== ANTI-PATTERN 2: Reactive qiymat o'zgartirish =====
const doubled = ref(0)
// XATO:
const badMutate = computed(() => {
  // doubled.value = count.value * 2 // XATO — boshqa ref o'zgartirish!
  return count.value
})

// TO'G'RI:
const goodDoubled = computed(() => count.value * 2)

// ===== ANTI-PATTERN 3: Asinxron computed =====
// XATO — computed sinxron bo'lishi SHART:
// const asyncComputed = computed(async () => {
//   const response = await fetch('/api')
//   return response.json()
// })
// Natija: Promise object — haqiqiy qiymat EMAS!

// TO'G'RI — ref + watch:
const asyncData = ref<any>(null)
const isLoading = ref(false)

watch(count, async (newCount) => {
  isLoading.value = true
  const response = await fetch(\`/api/data/\${newCount}\`)
  asyncData.value = await response.json()
  isLoading.value = false
}, { immediate: true })

// YOKI VueUse kutubxonasi:
// import { computedAsync } from '@vueuse/core'
// const asyncResult = computedAsync(() => fetch(...).then(r => r.json()))

// ===== ANTI-PATTERN 4: Keraksiz computed =====
// XATO — dependency yo'q:
const staticValue = computed(() => 'Salom dunyo')
// TO'G'RI:
const STATIC_VALUE = 'Salom dunyo' // oddiy const

// XATO — faqat pass-through:
const passThrough = computed(() => count.value)
// TO'G'RI — to'g'ridan-to'g'ri count ishlatish

// ===== TO'G'RI PATTERN: Computed zanjiri =====
const items = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
const filter = ref<'all' | 'even' | 'odd'>('all')
const page = ref(1)
const perPage = ref(5)

// Computed zanjiri — har biri keshlanadi
const filtered = computed(() => {
  if (filter.value === 'even') return items.value.filter(n => n % 2 === 0)
  if (filter.value === 'odd') return items.value.filter(n => n % 2 !== 0)
  return items.value
})

const paginated = computed(() => {
  const start = (page.value - 1) * perPage.value
  return filtered.value.slice(start, start + perPage.value)
})

const totalPages = computed(() =>
  Math.ceil(filtered.value.length / perPage.value)
)`,
      description: 'Computed anti-patternlar: side-effect, mutation, async, keraksiz computed. To\'g\'ri alternativlar bilan.',
    },
  ],
  interviewQA: [
    {
      question: 'computed() ichki mexanizmi qanday ishlaydi — keshlash va lazy evaluation?',
      answer: `computed() — ComputedRefImpl yaratadi. Ichida _dirty flag bor. Birinchi o'qishda: getter ishlaydi, natija _value ga saqlanadi, _dirty = false. Dependency o'zgarganda: faqat _dirty = true bo'ladi — getter hali ishlaMAYDI. Keyingi O'QISHDA: _dirty true bo'lsa getter qayta ishlaydi, natija yangilanadi, _dirty = false. Agar hech kim o'qiMASA — getter ISHLAMAYDI. Bu lazy evaluation — keraksiz hisoblash sarflanmaydi. Dependency tracking ham reactive bilan bir xil — getter ichida o'qilgan har bir reaktiv property track() qilinadi. computed o'zi ham ref — boshqa computed yoki watch uchun dependency bo'la oladi.`,
    },
    {
      question: 'computed va useMemo orasidagi farq nima?',
      answer: `1) Dependency: Vue computed — avtomatik tracking, React useMemo — qo'lda dependency array. 2) Keshlash: computed — KAFOLATLANGAN kesh (dependency o'zgarmasdan qayta hisoblanMAYDI), useMemo — React kafolatlamaydi (memory pressure-da keshni tashlashi mumkin). 3) Lazy: computed — faqat o'qilganda hisoblanadi, useMemo — har renderda dependency tekshiriladi. 4) Scope: computed — komponent tashqarisida ham ishlaydi (composable, store), useMemo — faqat komponent ichida. 5) Writable: computed — get/set bilan yozish mumkin, useMemo — faqat o'qish. 6) Debug: computed — onTrack/onTrigger, useMemo — bunday imkoniyat yo'q.`,
    },
    {
      question: 'Writable computed qachon va qanday ishlatiladi?',
      answer: `Writable computed — get va set funksiyalari bilan yaratiladi. Eng ko'p ishlatiladigan holatlar: 1) v-model proxy — props.modelValue ni computed orqali v-model ga ulash (emit bilan). 2) Format/parse — foydalanuvchiga formatlangan qiymat ko'rsatish, yozganda parse qilish (narx: "1,500 so'm" <-> 1500). 3) "Barchasini tanlash" checkbox — get: barcha tanlanganmi tekshirish, set: hammasini tanlash/bekor. 4) Store getter/setter pattern — Pinia store computed property. MUHIM: writable computed ichida setter side-effect minimal bo'lishi kerak — faqat boshqa ref-larni yangilash. Og'ir logika setter-da bo'lmasligi kerak.`,
    },
    {
      question: 'Computed ichida side-effect yozish nima uchun xato va buning o\'rniga nima ishlatiladi?',
      answer: `Computed — HISOBLASH uchun, SIDE-EFFECT uchun emas. Sabablari: 1) Lazy — computed faqat o'qilganda ishlaydi, side-effect QACHON ishlashi noma'lum. 2) Kesh — dependency o'zgarmasa getter ishlaMAYDI, side-effect ham ishlaMAYDI. 3) Multiple trigger — bir nechta dependency o'zgarsa, getter bir necha marta ishlashi MUMKIN. 4) Debug qiyinlashadi — side-effect qayerdan kelayotganini topish qiyin. O'rniga: watch() — aniq dependency kuzatish va side-effect. watchEffect() — avtomatik dependency bilan side-effect. Event handler — foydalanuvchi harakati uchun. Lifecycle hook — component mount/unmount uchun.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'ref-vs-reactive', label: 'ref() vs reactive()' },
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'watchers-deep', label: 'Watchers chuqur' },
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'effect-scope', label: 'effectScope API' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'composition-api', label: 'Composition API' },
  ],
}
