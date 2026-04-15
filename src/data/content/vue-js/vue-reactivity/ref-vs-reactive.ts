import type { Topic } from '../../../types'

export const refVsReactive: Topic = {
  id: 'ref-vs-reactive',
  title: 'ref() vs reactive()',
  importance: 3,
  status: 'to-learn',
  description: 'ref() va reactive() chuqur taqqoslash — qachon qaysi biri, destructuring muammolari, toRefs, toRef, amaliy qoidalar',
  content: `Vue 3 ning reaktivlik tizimida ikki asosiy primitive mavjud: ref() va reactive(). Ikkalasi ham reaktiv holatni boshqaradi, lekin ichki mexanizmlari va ishlatish joylari farq qiladi. Senior darajada bu farqlarni CHUQUR tushunish zarur.

═══════════════════════════════════════
  ref() — UNIVERSAL REAKTIV HAVOLA
═══════════════════════════════════════

ref() — RefImpl class instance yaratadi. Qiymatga .value orqali murojaat qilinadi. Template ichida avtomatik unwrap bo'ladi.

Xususiyatlari:
- HAR QANDAY turdagi qiymat bilan ishlaydi (primitiv, object, array, null)
- Object berilsa — ichida reactive() chaqiriladi (chuqur reaktivlik)
- Reassign mumkin: ref.value = yangiQiymat
- TypeScript bilan mukammal ishlaydi (Ref<T> tipi)
- Composable-lardan qaytarishda xavfsiz
- Template-da .value yozish shart emas

Ichki mexanizm: ref() chaqirilganda RefImpl yaratiladi. .value ning getter-i track() chaqiradi (dependency yig'adi), setter-i trigger() chaqiradi (yangilanish yuboradi). Object berilsa .value ichida Proxy yaratiladi.

═══════════════════════════════════════
  reactive() — PROXY ASOSIDAGI REAKTIVLIK
═══════════════════════════════════════

reactive() — JavaScript Proxy yordamida object atrofida kuzatish qatlami yaratadi. Property-larga to'g'ridan-to'g'ri murojaat qilinadi (.value kerak emas).

Cheklovlar (MUHIM):
- FAQAT object turlariga ishlaydi (Object, Array, Map, Set)
- Primitiv qiymatlarga ISHLAMAYDI
- Reassign MUMKIN EMAS — butun object almashtirsa reaktivlik uziladi
- Destructure qilinganda reaktivlik YO'QOLADI
- Composable-lardan qaytarishda XAVFLI

  const state = reactive({ count: 0 })
  let { count } = state  // XATO — count oddiy number bo'lib qoldi
  state = { count: 1 }   // XATO — eski Proxy bilan bog'lanish uzildi

═══════════════════════════════════════
  DESTRUCTURING MUAMMOSI VA YECHIMLAR
═══════════════════════════════════════

reactive() dan destructure qilish — eng ko'p uchraydigan xato:

  const state = reactive({ x: 1, y: 2, z: 3 })
  const { x, y } = state        // XATO — reaktivlik yo'qoldi
  const copy = { ...state }     // XATO — oddiy object

Yechimlar:
1. toRefs() — barcha property-larni ref() ga o'raydi:
   const { x, y } = toRefs(state)   // x.value, y.value — reaktiv

2. toRef() — bitta property uchun:
   const x = toRef(state, 'x')      // x.value — reaktiv, ikki tomonlama

3. Umuman destructure qilmaslik:
   state.x, state.y — to'g'ridan-to'g'ri ishlatish

toRefs va toRef IKKI TOMONLAMA bog'lanadi — ref o'zgarsa, asl reactive ham o'zgaradi va aksincha.

═══════════════════════════════════════
  QACHON QAYSI BIRINI ISHLATISH
═══════════════════════════════════════

ref() ishlatish KERAK:
- Primitiv qiymatlar (string, number, boolean)
- Nullable qiymatlar (null bo'lishi mumkin)
- Composable-lardan qaytarish
- Qayta tayinlash (reassign) kerak bo'lganda
- Ko'pchilik hollarda — STANDART tanlash

reactive() ishlatish MUMKIN:
- Guruhlanigan ichki state (form ma'lumotlari)
- Hech qachon destructure yoki return qilinmaydigan holat
- Katta object bilan ishlash (ko'p .value yozishdan qochish)

Vue rasmiy hujjatlari va Evan You ham ref() ni STANDART tanlash sifatida tavsiya etadi.

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React-da useState() — qayta render orqali ishlaydi. Har render-da komponent funksiyasi qayta chaqiriladi, useState qiymati closure orqali olinadi. O'zgartirish uchun setter funksiya chaqiriladi.

Vue ref() — Proxy/getter-setter orqali ishlaydi. Setup faqat BIR MARTA chaqiriladi. Qiymat o'zgarganda faqat tegishli DOM yangilanadi.

Asosiy farqlar:
- React: setState(prev => prev + 1) — immutable yangilash
- Vue: count.value++ — to'g'ridan-to'g'ri mutatsiya
- React: stale closure xavfi (useEffect dependency)
- Vue: stale closure MUAMMOSI YO'Q (Proxy har doim joriy qiymatni qaytaradi)
- React: object state uchun spread kerak ({ ...state, key: value })
- Vue: reactive() — to'g'ridan-to'g'ri mutatsiya (state.key = value)
- React: custom hook dan qaytarish — array/tuple ([value, setter])
- Vue: composable dan qaytarish — ref object ({ count, increment })`,
  codeExamples: [
    {
      title: 'ref() va reactive() asosiy farqi',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, reactive } from 'vue'

// ===== ref() — universal =====
const count = ref(0)              // RefImpl<number>
const name = ref('Ali')           // RefImpl<string>
const user = ref<User | null>(null) // nullable — muammosiz

// Object ham ref() bo'lishi mumkin:
const config = ref({
  theme: 'dark',
  lang: 'uz',
})
// config.value.theme = 'light' — ishlaydi

// Reassign mumkin:
config.value = { theme: 'light', lang: 'ru' } // OK

// ===== reactive() — faqat object =====
const state = reactive({
  count: 0,
  items: [] as string[],
})

state.count++          // .value kerak emas
state.items.push('yangi')

// XATO — reassign mumkin emas:
// state = reactive({ count: 1, items: [] })

interface User {
  name: string
  age: number
}
</script>

<template>
  <div>
    <p>ref: {{ count }}</p>
    <p>reactive: {{ state.count }}</p>
    <p>User: {{ user?.name ?? 'Yuklanmagan' }}</p>
  </div>
</template>`,
      description: 'ref() har qanday qiymat bilan, reactive() faqat object bilan ishlaydi. ref() reassign mumkin, reactive() emas.',
    },
    {
      title: 'Destructuring muammosi va toRefs/toRef',
      language: 'html',
      code: `<script setup lang="ts">
import { reactive, toRefs, toRef, watch } from 'vue'

const form = reactive({
  username: '',
  email: '',
  password: '',
  rememberMe: false,
})

// XATO — reaktivlik yo'qoladi:
// const { username, email } = form

// TO'G'RI — toRefs bilan:
const { username, email, password } = toRefs(form)
// username.value = 'ali' — form.username ham o'zgaradi!

// Bitta property uchun toRef:
const rememberMe = toRef(form, 'rememberMe')

// Default qiymat bilan (Vue 3.3+):
const nickname = toRef(form, 'nickname' as any, 'Mehmon')

// Watch ishlaydi:
watch(username, (newVal) => {
  console.log('Username o\\'zgardi:', newVal)
})

function submitForm() {
  console.log({
    username: username.value,
    email: email.value,
    password: password.value,
    rememberMe: rememberMe.value,
  })
}
</script>

<template>
  <form @submit.prevent="submitForm">
    <input v-model="username" placeholder="Username" />
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Parol" />
    <label>
      <input v-model="rememberMe" type="checkbox" /> Eslab qolish
    </label>
    <button type="submit">Yuborish</button>
  </form>
</template>`,
      description: 'toRefs() va toRef() — reactive object dan xavfsiz destructure qilish. Ikki tomonlama bog\'lanish saqlanadi.',
    },
    {
      title: 'Composable-lardan qaytarish — ref() ustunligi',
      language: 'ts',
      code: `import { ref, reactive, toRefs, onMounted, onUnmounted } from 'vue'

// ===== XATO yo'l — reactive qaytarish =====
function useMouseBad() {
  const state = reactive({ x: 0, y: 0 })

  function handler(e: MouseEvent) {
    state.x = e.clientX
    state.y = e.clientY
  }

  onMounted(() => window.addEventListener('mousemove', handler))
  onUnmounted(() => window.removeEventListener('mousemove', handler))

  return state // Foydalanuvchi destructure qilsa — reaktivlik yo'qoladi!
}
// const { x, y } = useMouseBad() // XATO — x, y oddiy number

// ===== TO'G'RI yo'l 1 — ref() qaytarish =====
function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function handler(e: MouseEvent) {
    x.value = e.clientX
    y.value = e.clientY
  }

  onMounted(() => window.addEventListener('mousemove', handler))
  onUnmounted(() => window.removeEventListener('mousemove', handler))

  return { x, y } // Foydalanuvchi destructure qilsa ham — reaktiv!
}
// const { x, y } = useMouse() // OK — x, y Ref<number>

// ===== TO'G'RI yo'l 2 — toRefs() bilan o'rash =====
function useMouseAlt() {
  const state = reactive({ x: 0, y: 0 })

  function handler(e: MouseEvent) {
    state.x = e.clientX
    state.y = e.clientY
  }

  onMounted(() => window.addEventListener('mousemove', handler))
  onUnmounted(() => window.removeEventListener('mousemove', handler))

  return toRefs(state) // reactive -> ref larga aylantirib qaytarish
}`,
      description: 'Composable-lardan ref() qaytarish — eng xavfsiz yo\'l. reactive() qaytarsa destructure muammosi yuzaga keladi.',
    },
    {
      title: 'ref() ichida object — chuqur reaktivlik',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, watch, isRef, isReactive } from 'vue'

interface Product {
  id: number
  name: string
  price: number
  tags: string[]
}

// ref() ga object berish — ichida reactive() chaqiriladi
const product = ref<Product>({
  id: 1,
  name: 'Laptop',
  price: 1500,
  tags: ['elektronika', 'kompyuter'],
})

// Chuqur reaktivlik — nested property o'zgarishi ham kuzatiladi:
function updatePrice(newPrice: number) {
  product.value.price = newPrice // reaktiv — UI yangilanadi
}

function addTag(tag: string) {
  product.value.tags.push(tag) // array mutatsiyasi ham kuzatiladi
}

// Butun object almashtirish ham mumkin:
function resetProduct() {
  product.value = {
    id: 2,
    name: 'Telefon',
    price: 800,
    tags: ['elektronika'],
  }
}

// Tekshirish:
console.log(isRef(product))              // true
console.log(isReactive(product.value))   // true — ichida Proxy

// Deep watch:
watch(product, (newVal) => {
  console.log('Product o\\'zgardi:', newVal)
}, { deep: true })
</script>

<template>
  <div>
    <h3>{{ product.name }} — \${{ product.price }}</h3>
    <span v-for="tag in product.tags" :key="tag" class="tag">
      {{ tag }}
    </span>
    <button @click="updatePrice(1200)">Narx o'zgartirish</button>
    <button @click="addTag('yangi')">Tag qo'shish</button>
    <button @click="resetProduct">Yangilash</button>
  </div>
</template>`,
      description: 'ref() ga object berilganda ichida reactive() yaratiladi — chuqur reaktivlik ishlaydi. Reassign ham mumkin.',
    },
    {
      title: 'TypeScript bilan ref() va reactive()',
      language: 'ts',
      code: `import { ref, reactive, type Ref } from 'vue'

// ===== ref() — tip ko'rsatish =====

// Avtomatik infer:
const count = ref(0)         // Ref<number>
const name = ref('Ali')      // Ref<string>

// Aniq tip ko'rsatish:
const user = ref<User | null>(null)
const items = ref<string[]>([])

// Generic bilan:
function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  const stored = localStorage.getItem(key)
  const value = ref<T>(stored ? JSON.parse(stored) : defaultValue) as Ref<T>

  // Avtomatik saqlash
  watch(value, (newVal) => {
    localStorage.setItem(key, JSON.stringify(newVal))
  }, { deep: true })

  return value
}

// ===== reactive() — tip ko'rsatish =====

interface FormState {
  username: string
  password: string
  errors: Record<string, string>
}

// Interface bilan:
const form: FormState = reactive({
  username: '',
  password: '',
  errors: {},
})

// reactive() — Ref<T> emas, T tipini qaytaradi
// TypeScript da reactive() return tipi — UnwrapNestedRefs<T>

// ===== Amaliy farq =====
// ref<T>() => Ref<T> — .value: T
// reactive<T>() => T — lekin aslida Proxy

interface User {
  name: string
  age: number
}

// watch import
import { watch } from 'vue'`,
      description: 'ref() Ref<T> tipini qaytaradi va generic bilan yaxshi ishlaydi. reactive() original tipni qaytaradi — Proxy ekanligini TypeScript bilmaydi.',
    },
  ],
  interviewQA: [
    {
      question: 'ref() va reactive() ichki mexanizmda qanday farq qiladi?',
      answer: `ref() — RefImpl class instance yaratadi. Uning .value property-sida getter/setter bor. Getter chaqirilganda track() funksiyasi joriy effect-ni (render, watch, computed) dependency sifatida ro'yxatga oladi. Setter chaqirilganda trigger() barcha bog'liq effect-larni qayta ishga tushiradi. Agar .value ga object berilsa — ichida reactive() chaqiriladi. reactive() — JavaScript Proxy yaratadi. Proxy get trap-da track(), set trap-da trigger() chaqiriladi. Nested object-lar ham avtomatik Proxy-ga o'raladi (lazy — faqat murojaat qilinganda). Asosiy farq: ref() har qanday qiymat uchun ishlaydi va .value orqali boxing qiladi, reactive() faqat object uchun va to'g'ridan-to'g'ri Proxy qaytaradi.`,
    },
    {
      question: 'Nima uchun reactive() dan destructure qilganda reaktivlik yo\'qoladi va buni qanday hal qilish mumkin?',
      answer: `reactive() JavaScript Proxy qaytaradi. Destructure qilganda const { x } = state — bu x = state.x degan ma'no beradi, ya'ni Proxy-dan qiymat O'QILADI va oddiy o'zgaruvchiga ko'chiriladi. Bu vaqtda get trap ishlaydi, lekin x endi Proxy bilan bog'lanmagan — oddiy qiymat. Yechim: 1) toRefs(state) — har bir property uchun yangi ref() yaratib, asl reactive bilan ikki tomonlama bog'laydi. 2) toRef(state, 'x') — bitta property uchun. 3) Umuman destructure qilmaslik. Composable-lardan qaytarishda DOIM ref() ishlatish yoki toRefs() bilan o'rash kerak.`,
    },
    {
      question: 'Loyihada ref() yoki reactive() standart tanlash sifatida ishlatishni qanday asoslaysiz?',
      answer: `ref() ni standart tanlash sifatida tavsiya etaman: 1) Universal — primitiv va object bilan ishlaydi. 2) Reassign mumkin — ref.value = null yoki butun object almashtirish. 3) Composable-lardan xavfsiz qaytarish — destructure qilinganda ham reaktivlik saqlanadi. 4) TypeScript bilan yaxshi — Ref<T> tipi aniq. 5) Vue core team (Evan You) ham tavsiya etadi. reactive() faqat maxsus hollarda: katta form state (ko'p .value yozishdan qochish), ichki state (hech qachon return qilinmaydigan). Hatto reactive() ishlatganda ham — tashqariga chiqarishda toRefs() bilan o'rash kerak.`,
    },
    {
      question: 'toRefs() va toRef() qanday ishlaydi va ularsiz nima bo\'ladi?',
      answer: `toRefs(reactiveObj) — object-ning har bir property-si uchun ref() yaratadi. Bu ref-lar asl reactive object bilan IKKI TOMONLAMA bog'langan: ref o'zgarsa reactive ham o'zgaradi, va aksincha. Ichki mexanizm: har bir yaratilgan ref — ObjectRefImpl — asl object va key-ni saqlaydi, .value getter/setter asl object-ga proxy qiladi. toRef(obj, key) — bitta property uchun xuddi shunday. toRef(obj, key, defaultValue) — Vue 3.3+ default qiymat bilan. Ularsiz destructure qilsak — faqat joriy qiymat ko'chiriladi, Proxy bilan bog'lanish uziladi, keyingi o'zgarishlar kuzatilMAYDI.`,
    },
    {
      question: 'React useState bilan Vue ref() o\'rtasida qanday fundamental farq bor?',
      answer: `1) Yangilash modeli: React — immutable (setState yangi qiymat/funksiya), Vue — mutable (ref.value++ to'g'ridan-to'g'ri). 2) Rendering: React — setState chaqirilganda BUTUN komponent funksiyasi qayta ishlaydi, Vue — faqat bog'liq DOM qismi yangilanadi. 3) Closure: React — har render-da yangi closure (stale closure xavfi), Vue — setup() bir marta ishlaydi, Proxy har doim joriy qiymatni beradi. 4) Batching: React 18+ avtomatik batching, Vue ham nextTick orqali batching qiladi. 5) Qaytarish: React — [value, setter] tuple, Vue — ref object ({ value }). 6) Object state: React — spread bilan yangi object yaratish kerak, Vue — to'g'ridan-to'g'ri mutatsiya.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'reactivity-deep', label: 'Reaktivlik mexanizmi' },
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'shallow-raw', label: 'shallowRef va markRaw' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'composition-api', label: 'Composition API' },
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'computed-deep', label: 'Computed chuqur' },
  ],
}
