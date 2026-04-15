import type { Topic } from '../../../types'

export const piniaBasics: Topic = {
  id: 'pinia-basics',
  title: 'Pinia Asoslari',
  importance: 3,
  status: 'to-learn',
  description: 'defineStore(), Options vs Setup stores, state/getters/actions, storeToRefs(), createPinia',
  content: `Pinia — Vue 3 ning rasmiy state management kutubxonasi. Vuex ning o'rniga kelgan va Vue core jamoasi tomonidan qo'llab-quvvatlanadi. Pinia sodda API, mukammal TypeScript qo'llab-quvvatlash va DevTools integratsiyasi bilan ajralib turadi.

═══════════════════════════════════════
  O'RNATISH VA SOZLASH
═══════════════════════════════════════

Pinia-ni o'rnatish va ulash juda sodda:

  npm install pinia

  // main.ts
  import { createApp } from 'vue'
  import { createPinia } from 'pinia'
  import App from './App.vue'

  const app = createApp(App)
  app.use(createPinia())   // Pinia plugin sifatida ulanadi
  app.mount('#app')

createPinia() — global store konteyner yaratadi. Har bir store bu konteynerga avtomatik ro'yxatdan o'tadi.

═══════════════════════════════════════
  defineStore() — STORE YARATISH
═══════════════════════════════════════

defineStore() — store yaratishning yagona usuli. Ikkita argument oladi:
1. Store ID (unikal string) — DevTools da ko'rinadi
2. Store konfiguratsiyasi (Options yoki Setup format)

NAMING CONVENTION:
  const useCounterStore = defineStore('counter', { ... })
  const useUserStore = defineStore('user', { ... })

"use" prefiksi — composable convention. Store ID string bilan export nomi mos kelishi kerak.

═══════════════════════════════════════
  OPTIONS STORE
═══════════════════════════════════════

Options API ga o'xshash format — state, getters, actions alohida bo'limlarda:

  const useCounterStore = defineStore('counter', {
    state: () => ({ count: 0, name: 'Counter' }),
    getters: {
      doubleCount: (state) => state.count * 2,
      doubleCountPlusOne(): number {
        return this.doubleCount + 1  // boshqa getter-ga murojaat
      },
    },
    actions: {
      increment() {
        this.count++  // this orqali state-ga murojaat
      },
      async fetchCount() {
        this.count = await api.getCount()
      },
    },
  })

state — funksiya qaytaradi (har bir komponent uchun yangi nusxa).
getters — computed property analog. Keshlanadi.
actions — metodlar. Sinxron va asinxron bo'lishi mumkin.

═══════════════════════════════════════
  SETUP STORE (TAVSIYA ETILADI)
═══════════════════════════════════════

Composition API uslubida — ref, computed, function ishlatiladi:

  const useCounterStore = defineStore('counter', () => {
    const count = ref(0)
    const name = ref('Counter')

    const doubleCount = computed(() => count.value * 2)

    function increment() {
      count.value++
    }

    return { count, name, doubleCount, increment }
  })

Setup store afzalliklari:
- Composition API bilan bir xil sintaksis
- Composable-larni to'g'ridan-to'g'ri ishlatish mumkin (useRoute, useI18n)
- Yanada moslashuvchan logika
- watch/watchEffect ishlatish mumkin

═══════════════════════════════════════
  storeToRefs() — REAKTIV DESTRUCTURE
═══════════════════════════════════════

Store-ni destructure qilganda storeToRefs() ishlatish SHART:

  const store = useCounterStore()

  // NOTO'G'RI — reaktivlik yo'qoladi:
  const { count, doubleCount } = store

  // TO'G'RI — state va getters uchun:
  const { count, doubleCount } = storeToRefs(store)

  // Actions — storeToRefs KERAK EMAS:
  const { increment } = store

storeToRefs() faqat state va getters-ni ref() ga o'raydi. Actions oddiy funksiya bo'lib qoladi.

═══════════════════════════════════════
  KOMPONENTDA ISHLATISH
═══════════════════════════════════════

Store-ni istalgan komponentda chaqirish mumkin:

  <script setup>
  const store = useCounterStore()
  const { count } = storeToRefs(store)
  const { increment } = store
  </script>

  <template>
    <p>{{ count }}</p>
    <button @click="increment">+1</button>
  </template>

Muhim: useXxxStore() FAQAT setup() yoki <script setup> ichida chaqirilishi kerak. Tashqarida chaqirsangiz, Pinia instance topilmaydi.

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

Zustand:
  const useStore = create((set) => ({
    count: 0,
    increment: () => set((s) => ({ count: s.count + 1 })),
  }))
  const count = useStore(s => s.count)

Redux Toolkit:
  const slice = createSlice({
    name: 'counter',
    initialState: { count: 0 },
    reducers: { increment: (s) => { s.count++ } },
  })

Pinia vs Zustand: API o'xshash — ikkalasi ham sodda. Lekin Pinia DevTools, SSR, plugins tizimi bilan birga keladi.
Pinia vs Redux: Pinia ANCHA sodda — mutations yo'q, boilerplate kam, TypeScript yaxshiroq.

Vue-da store ichida this orqali boshqa property-larga murojaat mumkin.
React-da har bir hook chaqiruvida yangi closure yaratiladi — stale state muammosi bo'lishi mumkin.`,
  codeExamples: [
    {
      title: 'Options Store — to\'liq misol',
      language: 'ts',
      code: `import { defineStore } from 'pinia'

interface Todo {
  id: number
  title: string
  completed: boolean
}

export const useTodoStore = defineStore('todos', {
  state: () => ({
    todos: [] as Todo[],
    filter: 'all' as 'all' | 'active' | 'completed',
    nextId: 1,
  }),

  getters: {
    filteredTodos(state): Todo[] {
      switch (state.filter) {
        case 'active':
          return state.todos.filter(t => !t.completed)
        case 'completed':
          return state.todos.filter(t => t.completed)
        default:
          return state.todos
      }
    },

    completedCount(state): number {
      return state.todos.filter(t => t.completed).length
    },

    // Boshqa getter-ga murojaat
    progress(): string {
      return \`\${this.completedCount}/\${this.todos.length}\`
    },
  },

  actions: {
    addTodo(title: string) {
      this.todos.push({
        id: this.nextId++,
        title,
        completed: false,
      })
    },

    toggleTodo(id: number) {
      const todo = this.todos.find(t => t.id === id)
      if (todo) todo.completed = !todo.completed
    },

    removeTodo(id: number) {
      this.todos = this.todos.filter(t => t.id !== id)
    },

    async fetchTodos() {
      const res = await fetch('/api/todos')
      this.todos = await res.json()
    },
  },
})`,
      description: 'Options store — state funksiya qaytaradi, getters keshlanadi, actions sinxron va asinxron bo\'lishi mumkin.',
    },
    {
      title: 'Setup Store — Composition API uslubi',
      language: 'ts',
      code: `import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

export const useUserStore = defineStore('user', () => {
  // State — ref va reactive
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters — computed
  const isLoggedIn = computed(() => currentUser.value !== null)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')
  const displayName = computed(() =>
    currentUser.value?.name ?? 'Mehmon'
  )

  // Actions — oddiy funksiyalar
  async function login(email: string, password: string) {
    isLoading.value = true
    error.value = null

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) throw new Error('Login xatosi')

      currentUser.value = await res.json()
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    currentUser.value = null
  }

  // MUHIM: return qilish shart!
  return {
    currentUser, isLoading, error,
    isLoggedIn, isAdmin, displayName,
    login, logout,
  }
})`,
      description: 'Setup store — ref() state uchun, computed() getters uchun, funksiyalar actions uchun. Return qilish majburiy.',
    },
    {
      title: 'Komponentda storeToRefs bilan ishlatish',
      language: 'html',
      code: `<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTodoStore } from '@/stores/todo-store'

const todoStore = useTodoStore()

// State va getters — storeToRefs bilan
const { todos, filter, filteredTodos, progress } = storeToRefs(todoStore)

// Actions — to'g'ridan-to'g'ri destructure
const { addTodo, toggleTodo, removeTodo } = todoStore

const newTitle = ref('')

function handleAdd() {
  if (newTitle.value.trim()) {
    addTodo(newTitle.value.trim())
    newTitle.value = ''
  }
}
</script>

<template>
  <div class="todo-app">
    <h1>Vazifalar ({{ progress }})</h1>

    <input v-model="newTitle" @keyup.enter="handleAdd" />
    <button @click="handleAdd">Qo'shish</button>

    <select v-model="filter">
      <option value="all">Hammasi</option>
      <option value="active">Faol</option>
      <option value="completed">Bajarilgan</option>
    </select>

    <ul>
      <li v-for="todo in filteredTodos" :key="todo.id">
        <input
          type="checkbox"
          :checked="todo.completed"
          @change="toggleTodo(todo.id)"
        />
        <span :class="{ done: todo.completed }">
          {{ todo.title }}
        </span>
        <button @click="removeTodo(todo.id)">✕</button>
      </li>
    </ul>
  </div>
</template>`,
      description: 'storeToRefs() — state va getters reaktivligini saqlaydi. Actions to\'g\'ridan-to\'g\'ri destructure qilinadi.',
    },
    {
      title: 'Store-lar orasida murojaat',
      language: 'ts',
      code: `import { defineStore } from 'pinia'
import { useUserStore } from './user-store'

// Store ichida boshqa store-ni ishlatish
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.qty, 0)
  )

  // Boshqa store-ga murojaat — ACTION ICHIDA
  async function checkout() {
    const userStore = useUserStore()

    if (!userStore.isLoggedIn) {
      throw new Error('Avval tizimga kiring')
    }

    await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        userId: userStore.currentUser!.id,
        items: items.value,
        total: total.value,
      }),
    })

    items.value = []  // Savatni tozalash
  }

  return { items, total, checkout }
})`,
      description: 'Bir store boshqa store-ni action ichida chaqirishi mumkin. useXxxStore() ni action tashqarisida emas, ichida chaqiring.',
    },
  ],
  interviewQA: [
    {
      question: 'Options Store va Setup Store farqi nima? Qaysi birini tanlash kerak?',
      answer: `Options Store — state/getters/actions alohida bo'limlarda yoziladi, Options API ga o'xshash. Setup Store — ref, computed, function ishlatadi, Composition API uslubida. Setup Store tavsiya etiladi chunki: 1) Composable-larni to'g'ridan-to'g'ri ishlatish mumkin (useRoute, watch, watchEffect), 2) TypeScript bilan yaxshiroq ishlaydi, 3) Yanada moslashuvchan. Lekin Options Store yangi boshlovchilar uchun tushunarliroq va Vuex-dan ko'chish osonroq.`,
    },
    {
      question: 'storeToRefs() nima uchun kerak? Oddiy destructure ishlatsa bo\'lmaydimi?',
      answer: `Store-ni oddiy destructure qilsangiz ({ count } = store), qiymat reaktivligini yo'qotadi — oddiy primitive bo'lib qoladi. storeToRefs() har bir state property va getter-ni ref() ga o'rab qaytaradi, shu bilan reaktivlik saqlanadi. Actions uchun storeToRefs() kerak EMAS — ular oddiy funksiya. Bu Vue-ning reactive() bilan bir xil muammo: destructure = reaktivlik yo'qolishi. Pinia bu muammoni storeToRefs() utility bilan hal qiladi.`,
    },
    {
      question: 'Pinia-da store-lar orasida qanday ma\'lumot almashiladi?',
      answer: `Bitta store boshqa store-ni to'g'ridan-to'g'ri import qilib ishlatishi mumkin. MUHIM: useXxxStore() ni action yoki getter ICHIDA chaqiring, store yaratilayotgan paytda emas (circular dependency xavfi). Getter ichida: const userStore = useUserStore(); return userStore.name. Action ichida: const authStore = useAuthStore(); if (!authStore.isLoggedIn) return. Setup store-da boshqa store-ni watch bilan kuzatish ham mumkin.`,
    },
    {
      question: 'Pinia state-ni to\'g\'ridan-to\'g\'ri o\'zgartirish mumkinmi (mutation)?',
      answer: `Ha, Pinia-da Vuex-dagi kabi alohida mutations TUSHUNCHASI YO'Q. State-ni to'g'ridan-to'g'ri o'zgartirish mumkin: store.count++, store.name = 'Ali'. Lekin yaxshi amaliyot — murakkab o'zgarishlarni action ichida qilish (logika markazlashtiriladi, DevTools-da kuzatiladi). $patch() metodi bir nechta o'zgarishni atomik bajarish uchun ishlatiladi — bu bitta DevTools event yaratadi.`,
    },
    {
      question: 'defineStore() da string ID nima uchun kerak?',
      answer: `Store ID bir nechta maqsadda ishlatiladi: 1) Vue DevTools-da store-ni aniqlash va debug qilish, 2) Pinia persist plugin-da localStorage kalit sifatida, 3) SSR da server/client store-larni moslashtirish, 4) Hot Module Replacement (HMR) uchun. ID unikal bo'lishi SHART — aks holda store-lar bir-birini qayta yozadi. Convention: fayl nomi bilan mos kelishi kerak (user-store.ts → 'user').`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-pinia', topicId: 'pinia-advanced', label: 'Pinia Advanced' },
    { techId: 'vue-js', sectionId: 'vue-pinia', topicId: 'pinia-vs-vuex', label: 'Pinia vs Vuex' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'composition-api', label: 'Composition API' },
    { techId: 'vue-js', sectionId: 'vue-pinia', topicId: 'composable-stores', label: 'Composable Stores' },
  ],
}
