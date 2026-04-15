import type { Topic } from '../../../types'

export const optionsVsComposition: Topic = {
  id: 'options-vs-composition',
  title: 'Options vs Composition API',
  importance: 3,
  status: 'to-learn',
  description: 'Options API va Composition API taqqoslash — qachon qaysi, logika tashkil etish, migratsiya',
  content: `Vue ikki xil API taklif qiladi: Options API (Vue 2 dan beri) va Composition API (Vue 3 yangi). Ikkalasi HAM ishlaydi, lekin senior dasturchi ikkalasini ham bilishi va TO'G'RI tanlashi kerak.

═══════════════════════════════════════
  OPTIONS API — AN'ANAVIY YONDASHUV
═══════════════════════════════════════

Komponent "variantlar" (options) bilan tashkil etiladi:
- data() — reaktiv ma'lumotlar
- computed — hisoblangan xususiyatlar
- methods — funksiyalar
- watch — kuzatuvchilar
- mounted/created... — lifecycle hook-lar

Afzalliklari:
+ Oddiy — yangi boshlovchilar uchun oson
+ Strukturalangan — har bir option o'z joyida
+ this kontekst — barcha narsaga this orqali murojaat

Kamchiliklari:
- Bitta feature 4-5 joyga tarqaladi (data + methods + computed + watch)
- this tipi TypeScript-da qiyin (inference muammo)
- Logika qayta ishlatish — faqat mixins (muammoli)
- Katta komponentlarda o'qish qiyin — "scroll fatigue"

═══════════════════════════════════════
  COMPOSITION API — YANGI YONDASHUV
═══════════════════════════════════════

<script setup> ichida barcha logika BIRGALIKDA yoziladi:
- ref(), reactive() — reaktiv state
- computed() — hisoblangan qiymat
- watch(), watchEffect() — kuzatish
- onMounted() va h.k. — lifecycle

Afzalliklari:
+ Feature bo'yicha guruhlash — bog'liq kod birga turadi
+ TypeScript — to'liq type inference
+ Composables — logika qayta ishlatish (custom hooks)
+ Tree-shaking — faqat import qilingan API bundle-ga tushadi
+ Kichikroq bundle — compiler <script setup> ni optimizatsiya qiladi

Kamchiliklari:
- Yangi boshlovchilar uchun murakkabroq
- ref/reactive tushunchasi — .value esdan chiqadi
- Strukturasiz — tartib dasturchiga bog'liq

═══════════════════════════════════════
  KOD TASHKIL QILISH TAQQOSLASH
═══════════════════════════════════════

Options API — bitta feature turli joylarda:
  data():    search, results, isLoading      ← Qidiruv feature
  methods:   doSearch, clearSearch            ← data va methods alohida
  computed:  filteredResults                  ← yana alohida
  watch:     search -> debounceSearch         ← yana alohida
  mounted:   initialSearch()                  ← yana alohida

Composition API — feature birgalikda:
  // --- Qidiruv feature ---
  const search = ref('')
  const results = ref([])
  const isLoading = ref(false)
  const filteredResults = computed(...)
  watch(search, debounceSearch)
  onMounted(() => initialSearch())

  // --- Boshqa feature ---
  const pagination = usePagination()

═══════════════════════════════════════
  LOGIKA QAYTA ISHLATISH
═══════════════════════════════════════

Options API — Mixins:
  Muammo: naming collision, noaniq manba, implicit dependency

Composition API — Composables:
  Yechim: aniq import, namespace boshqaruv, TypeScript, tree-shaking
  const { count, increment } = useCounter()
  const { data, error } = useFetch('/api/users')

═══════════════════════════════════════
  QACHON QAYSI API ISHLATISH
═══════════════════════════════════════

Options API tanlang agar:
- Jamoa Vue 2 dan ko'chmoqda
- Oddiy CRUD komponentlar
- Yangi jamoa a'zolari ko'p
- Prototyping / tez boshlash

Composition API tanlang agar:
- TypeScript loyiha
- Murakkab logika / katta komponentlar
- Logika qayta ishlatish kerak
- Performance muhim (tree-shaking)
- Yangi loyiha boshlayapsiz

MASLAHAT: Bir loyihada IKKALASINI aralashtirib ishlatsa bo'ladi, lekin bir xil yondashuvga yopishish yaxshiroq.

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

Vue Options API ≈ React Class Components:
- Strukturalangan lifecycle (componentDidMount, render...)
- this kontekst orqali
- Logika qayta ishlatish: HOC, render props

Vue Composition API ≈ React Hooks:
- Funksional yondashuv
- Custom hooks = composables
- TypeScript yaxshi qo'llab-quvvat

MUHIM FARQ:
- Vue: ikkalasi HAM rasman qo'llab-quvvatlanadi
- React: class-lar "legacy", hooks tavsiya etiladi
- Vue <script setup>: hook qoidalari YO'Q (if/loop ichida chaqirsa bo'ladi)
- React: Rules of Hooks — faqat top level, faqat React funksiyalarda`,
  codeExamples: [
    {
      title: 'Bitta feature — ikki xil API yondashuvi',
      language: 'html',
      code: `<!-- Options API — Todo feature 4 joyga tarqalgan -->
<script>
export default {
  data() {
    return {
      todos: [],              // 1. State — data()
      newTodo: '',
      filter: 'all',
    }
  },
  computed: {                 // 2. Computed — alohida bo'lim
    filteredTodos() {
      if (this.filter === 'done') return this.todos.filter(t => t.done)
      if (this.filter === 'active') return this.todos.filter(t => !t.done)
      return this.todos
    },
    remaining() {
      return this.todos.filter(t => !t.done).length
    },
  },
  methods: {                  // 3. Methods — alohida bo'lim
    addTodo() {
      if (!this.newTodo.trim()) return
      this.todos.push({ id: Date.now(), text: this.newTodo, done: false })
      this.newTodo = ''
    },
    toggleTodo(id) {
      const todo = this.todos.find(t => t.id === id)
      if (todo) todo.done = !todo.done
    },
  },
  mounted() {                 // 4. Lifecycle — alohida bo'lim
    const saved = localStorage.getItem('todos')
    if (saved) this.todos = JSON.parse(saved)
  },
  watch: {                    // 5. Watch — alohida bo'lim
    todos: {
      deep: true,
      handler(val) { localStorage.setItem('todos', JSON.stringify(val)) },
    },
  },
}
</script>

<!-- Composition API — Todo feature BIRGALIKDA -->
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

interface Todo {
  id: number
  text: string
  done: boolean
}

// --- Barcha todo logikasi birga ---
const todos = ref<Todo[]>([])
const newTodo = ref('')
const filter = ref<'all' | 'done' | 'active'>('all')

const filteredTodos = computed(() => {
  if (filter.value === 'done') return todos.value.filter(t => t.done)
  if (filter.value === 'active') return todos.value.filter(t => !t.done)
  return todos.value
})

const remaining = computed(() => todos.value.filter(t => !t.done).length)

function addTodo() {
  if (!newTodo.value.trim()) return
  todos.value.push({ id: Date.now(), text: newTodo.value, done: false })
  newTodo.value = ''
}

function toggleTodo(id: number) {
  const todo = todos.value.find(t => t.id === id)
  if (todo) todo.done = !todo.done
}

onMounted(() => {
  const saved = localStorage.getItem('todos')
  if (saved) todos.value = JSON.parse(saved)
})

watch(todos, (val) => {
  localStorage.setItem('todos', JSON.stringify(val))
}, { deep: true })
</script>`,
      description: 'Options API — feature 5 bo\'limga tarqalgan. Composition API — barcha todo logikasi birgalikda, TypeScript to\'liq qo\'llab-quvvat.',
    },
    {
      title: 'Composable ajratish — logika qayta ishlatish',
      language: 'ts',
      code: `// composables/useTodos.ts — qayta ishlatiladigan logika
import { ref, computed, watch, onMounted } from 'vue'

interface Todo {
  id: number
  text: string
  done: boolean
}

export function useTodos(storageKey = 'todos') {
  const todos = ref<Todo[]>([])

  // Computed
  const remaining = computed(() => todos.value.filter(t => !t.done).length)
  const doneCount = computed(() => todos.value.filter(t => t.done).length)

  // Methods
  function addTodo(text: string) {
    todos.value.push({ id: Date.now(), text, done: false })
  }

  function toggleTodo(id: number) {
    const todo = todos.value.find(t => t.id === id)
    if (todo) todo.done = !todo.done
  }

  function removeTodo(id: number) {
    todos.value = todos.value.filter(t => t.id !== id)
  }

  // Persistence
  onMounted(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) todos.value = JSON.parse(saved)
  })

  watch(todos, (val) => {
    localStorage.setItem(storageKey, JSON.stringify(val))
  }, { deep: true })

  return { todos, remaining, doneCount, addTodo, toggleTodo, removeTodo }
}

// Ishlatish — har qanday komponentda:
// const { todos, remaining, addTodo, toggleTodo } = useTodos()
// const { todos: workTodos, addTodo: addWork } = useTodos('work-todos')`,
      description: 'Composable — logikani alohida funksiyaga chiqarish. Har qanday komponentda qayta ishlatiladi. Parametr orqali moslash mumkin.',
    },
    {
      title: 'Options + Composition API birga ishlatish',
      language: 'html',
      code: `<!-- Ikkalasini birga ishlatish mumkin (migratsiya uchun) -->
<script lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFetch } from '@/composables/useFetch'

export default {
  // Options API qismi
  data() {
    return {
      localFilter: 'all',
    }
  },
  methods: {
    updateFilter(val: string) {
      this.localFilter = val
    },
  },

  // Composition API — setup() ichida
  setup() {
    const count = ref(0)
    const doubled = computed(() => count.value * 2)
    const { data: users, isLoading } = useFetch('/api/users')

    onMounted(() => {
      console.log('Mounted — Composition API hook')
    })

    // setup() dan qaytarilgan narsa template-da ishlatiladi
    return { count, doubled, users, isLoading }
  },

  mounted() {
    // Options API hook HAM ishlaydi
    console.log('Mounted — Options API hook')
    // Ikkala hook HAM chaqiriladi!
  },
}
</script>

<template>
  <div>
    <!-- Options API dan -->
    <p>Filter: {{ localFilter }}</p>

    <!-- Composition API dan -->
    <p>Count: {{ count }} (doubled: {{ doubled }})</p>
    <p v-if="isLoading">Loading...</p>
  </div>
</template>`,
      description: 'Options va Composition API birga ishlatish — migratsiya davomida foydali. setup() natijasi + data() birlashadi.',
    },
  ],
  interviewQA: [
    {
      question: 'Options API va Composition API farqini tushuntiring. Qachon qaysi ishlatiladi?',
      answer: `Options API — data/computed/methods/watch bo'limlari bilan strukturalangan, this kontekst, yangi boshlovchilar uchun oson. Composition API — <script setup>, ref/computed/watch, feature bo'yicha guruhlash, TypeScript yaxshi. Composition tanlang: TypeScript loyiha, murakkab logika, logika qayta ishlatish kerak. Options tanlang: Vue 2 migratsiya, oddiy CRUD, yangi jamoa. Ikkalasini aralashtirish MUMKIN lekin tavsiya etilmaydi (bir loyihada bir yondashuv yaxshiroq).`,
    },
    {
      question: 'Composition API-da kod tashkil qilish best practice-lari nima?',
      answer: `1) Feature bo'yicha guruhlang — bog'liq state, computed, methods birga. 2) Composable-ga ajrating — 30+ qator logika -> useSomething() funksiyasiga. 3) Tartib: props/emits -> reaktiv state -> computed -> methods -> watch -> lifecycle. 4) Naming convention: composable doim "use" bilan boshlanadi. 5) Bir komponent 200+ qatordan oshsa — composable-larga ajrating. 6) Side-effect-larni composable ichida tozalang (onUnmounted).`,
    },
    {
      question: 'Composables va React custom hooks farqi nima?',
      answer: `O'xshashlik: ikkalasi ham logikani funksiyaga ajratish. Ikkalasida ham state, computed, lifecycle bor. Farqlar: 1) Vue composable BITTA MARTA chaqiriladi (setup), React hook HAR RENDERDA chaqiriladi. 2) Vue-da .value orqali murojaat, React-da to'g'ridan-to'g'ri qiymat. 3) Vue composable ichida if/for ichida boshqa composable chaqirsa BO'LADI, React-da Rules of Hooks — faqat top level. 4) Vue composable closure muammosi YO'Q (Proxy ref), React-da stale closure bo'lishi mumkin. 5) Vue composable-da cleanup onUnmounted ichida, React-da return funksiya.`,
    },
    {
      question: 'Options API mixins muammolarini aniq misolda tushuntiring.',
      answer: `Misol: mixin1 = { data: { count: 0 }, methods: { log() } }, mixin2 = { data: { count: 100 }, methods: { log() } }. Muammolar: 1) Naming collision — ikkala mixin-da count bor, oxirgi mixin YUTADI (jimgina). 2) template-da {{ count }} — bu qaysi mixin-dan? Noaniq manba. 3) mixin1 this.userName ishlatadi, lekin bu komponentda bo'lishi KERAK — implicit dependency. 4) Deep merge qoidalari murakkab — data merge qilinadi, hooks arrayga birlashadi, methods oxirgisi yutadi. Composable-da bularning BARCHASI hal bo'lgan — aniq import, tiplar, izolyatsiya.`,
    },
    {
      question: '<script setup> oddiy <script> + setup() dan qanday farq qiladi?',
      answer: `<script setup> — compile-time syntax sugar. Afzalliklari: 1) return yozish SHART EMAS — barcha top-level o'zgaruvchilar template-da mavjud. 2) Props/emits: defineProps(), defineEmits() — compiler macro, import kerak EMAS. 3) Komponent import qilsangiz avtomatik ro'yxatga oladi — components: {} yozish shart emas. 4) KICHIKROQ bundle — compiler optimizatsiya qiladi. 5) Yaxshiroq TypeScript inference. Kamchilik: name option yozish uchun alohida <script> blok kerak (yoki defineOptions). Runtime da farq YO'Q — ikkalasi bir xil compiled output beradi.`,
    },
    {
      question: 'Katta Vue loyihada Options API dan Composition API ga qanday migratsiya qilasiz?',
      answer: `Bosqichma-bosqich strategiya: 1) Yangi komponentlar FAQAT Composition API-da yozish. 2) Eski komponentlar — kattalaridan boshlash. 3) Bitta komponentda ikkalasini aralashtirish mumkin (setup() + options). 4) Mixins -> composable ga aylantirish (eng muhim qadam). 5) this.$refs -> template refs, this.$emit -> defineEmits. 6) Vuex -> Pinia (Composition API bilan yaxshiroq ishlaydi). Eslating: Options API Vue 3-da ham TO'LIQ qo'llab-quvvatlanadi — migratsiya MAJBURIY emas. Bir vaqtning o'zida hammani o'zgartirish KERAK EMAS.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'composition-api', label: 'Composition API' },
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'vue2-vs-vue3', label: 'Vue 2 vs Vue 3' },
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'composables', label: 'Composables' },
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'hooks-rules', label: 'Composition API qoidalari' },
  ],
}
