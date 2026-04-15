import type { Topic } from '../../../types'

export const serverState: Topic = {
  id: 'server-state',
  title: 'Server State Management',
  importance: 2,
  status: 'to-learn',
  description: 'Server vs client state, TanStack Query for Vue, useQuery, useMutation, cache invalidation, stale-while-revalidate',
  content: `Zamonaviy frontend ilovada state ikki turga bo'linadi: CLIENT state (UI holati, formalar, tema) va SERVER state (API dan keladigan ma'lumotlar). Bu ikki turni ALOHIDA boshqarish eng yaxshi amaliyot. Pinia — client state uchun, TanStack Query — server state uchun.

═══════════════════════════════════════
  SERVER STATE VS CLIENT STATE
═══════════════════════════════════════

CLIENT STATE:
- Foydalanuvchi interfeysi holati (sidebar ochiq/yopiq)
- Forma qiymatlari
- Tema (dark/light)
- Til sozlamalari
- Savatdagi mahsulotlar

SERVER STATE:
- API dan keladigan ro'yxatlar (foydalanuvchilar, mahsulotlar)
- Tafsilotlar sahifasi ma'lumotlari
- Qidiruv natijalari
- Foydalanuvchi profili (serverda saqlanadi)

Server state xususiyatlari:
1. Boshqa joyda saqlanadi (server/DB)
2. Async — fetch qilish kerak
3. Eskirishi mumkin (stale) — boshqa foydalanuvchi o'zgartirgan
4. Keshlanishi kerak (har safar fetch qilmaslik uchun)
5. Invalidatsiya kerak (qachon qayta fetch qilish?)

═══════════════════════════════════════
  TANSTACK QUERY FOR VUE
═══════════════════════════════════════

@tanstack/vue-query — server state boshqarish uchun eng kuchli kutubxona. React Query ning Vue versiyasi.

O'rnatish:
  npm install @tanstack/vue-query

  // main.ts
  import { VueQueryPlugin } from '@tanstack/vue-query'
  app.use(VueQueryPlugin, {
    queryClientConfig: {
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,    // 5 daqiqa fresh
          gcTime: 30 * 60 * 1000,       // 30 daqiqa keshda
          retry: 2,                      // 2 marta qayta urinish
          refetchOnWindowFocus: true,    // Fokus qaytganda yangilash
        },
      },
    },
  })

Asosiy tushunchalar:
- Query — ma'lumot o'qish (GET)
- Mutation — ma'lumot yozish (POST/PUT/DELETE)
- Query Key — kesh kaliti (unique identifikator)
- Stale Time — qancha vaqt fresh hisoblanadi
- GC Time — keshdan o'chirilish vaqti
- Invalidation — keshni eskirgan deb belgilash

═══════════════════════════════════════
  useQuery — MA'LUMOT O'QISH
═══════════════════════════════════════

useQuery — deklarativ ma'lumot o'qish:

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['products', categoryId],
    queryFn: () => api.getProducts(categoryId.value),
    staleTime: 10 * 60 * 1000,
  })

queryKey — massiv. Har xil key = har xil kesh yozuvi.
  ['products']                — barcha mahsulotlar
  ['products', 'electronics'] — elektronika kategoriyasi
  ['products', 'electronics', { page: 2 }] — 2-sahifa

queryKey o'zgarganda — avtomatik qayta fetch bo'ladi!
  const categoryId = ref('electronics')
  // categoryId o'zgarganda yangi fetch ishlaydi

Qaytariladigan qiymatlar:
  data — natija (ref)
  isLoading — birinchi marta yuklanmoqda
  isFetching — qayta yuklanmoqda (background)
  isError — xato bo'ldi
  error — xato ma'lumoti
  isSuccess — muvaffaqiyatli
  refetch — qo'lda qayta yuklash

═══════════════════════════════════════
  useMutation — MA'LUMOT YOZISH
═══════════════════════════════════════

useMutation — server ga ma'lumot yuborish va keshni yangilash:

  const { mutate, isPending } = useMutation({
    mutationFn: (newProduct) => api.createProduct(newProduct),
    onSuccess: () => {
      // Keshni invalidatsiya — qayta fetch
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  // Chaqirish:
  mutate({ name: 'Yangi mahsulot', price: 29900 })

═══════════════════════════════════════
  STALE-WHILE-REVALIDATE
═══════════════════════════════════════

TanStack Query ning asosiy strategiyasi:
1. Keshdan ESKi ma'lumotni DARHOL ko'rsatish (stale)
2. Fonda YANGI ma'lumotni fetch qilish (revalidate)
3. Yangi ma'lumot kelganda UI yangilanadi

Bu UX uchun ajoyib — foydalanuvchi kutmaydi, lekin ma'lumot yangilanadi.

staleTime: 0 — har doim stale (default)
staleTime: Infinity — hech qachon stale (static data)
staleTime: 5 * 60 * 1000 — 5 daqiqa fresh

═══════════════════════════════════════
  PINIA + TANSTACK QUERY BIRGA
═══════════════════════════════════════

PINIA boshqaradi:
  - UI state (sidebar, modal, tema)
  - Forma state
  - Foydalanuvchi preferences
  - Navigatsiya state

TANSTACK QUERY boshqaradi:
  - API ma'lumotlari (ro'yxatlar, tafsilotlar)
  - Kesh va invalidatsiya
  - Loading/error state
  - Background refetching
  - Optimistic updates

Ular BIR-BIRINI TO'LDIRADI, raqobat qilmaydi.

═══════════════════════════════════════
  VueUse useFetch ALTERNATIVA
═══════════════════════════════════════

@vueuse/core dan useFetch — soddaroq alternativa:

  const { data, isFetching, error } = useFetch(url)

Afzalliklari: sodda, dependency yo'q
Kamchiliklari: kesh yo'q, invalidatsiya yo'q, retry yo'q

Kichik loyihalar uchun yetarli, katta ilovalar uchun TanStack Query kerak.

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React dunyo — TanStack Query ASLIDA React Query sifatida yaratilgan. Vue versiyasi xuddi shu API.

  // React
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  // Vue — DEYARLI BIR XIL
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

Farq: Vue-da data — Ref<T>, React-da oddiy T.

React-da SWR ham mashhur alternativa (Vercel):
  const { data, error } = useSWR('/api/user', fetcher)

Vue-da VueUse useFetch — SWR-ga o'xshash oddiy variant.

Redux Toolkit Query (RTK Query) — Redux ekotizimida server state. TanStack Query ga o'xshash, lekin Redux bilan integratsiyalashgan.

Pinia + TanStack Query = Zustand + TanStack Query — ikkalasi ham bir xil arxitektura pattern.`,
  codeExamples: [
    {
      title: 'useQuery — mahsulotlar ro\'yxati',
      language: 'html',
      code: `<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'

interface Product {
  id: number
  name: string
  price: number
  category: string
}

const route = useRoute()
const categoryId = computed(() => route.params.categoryId as string)

// ═══ useQuery — deklarativ ma'lumot o'qish ═══
const {
  data: products,    // Ref<Product[] | undefined>
  isLoading,         // Birinchi yuklash
  isFetching,        // Background yangilash
  isError,
  error,
  refetch,           // Qo'lda qayta yuklash
} = useQuery({
  // queryKey o'zgarganda — avtomatik qayta fetch
  queryKey: ['products', categoryId],

  // queryFn — async funksiya
  queryFn: async (): Promise<Product[]> => {
    const res = await fetch(
      \`/api/products?category=\${categoryId.value}\`
    )
    if (!res.ok) throw new Error('Yuklab bo\\'lmadi')
    return res.json()
  },

  // Konfiguratsiya
  staleTime: 5 * 60 * 1000,     // 5 daqiqa fresh
  placeholderData: [],            // Boshlang'ich placeholder
  enabled: computed(() => !!categoryId.value), // Shart bilan
})
</script>

<template>
  <div>
    <!-- Loading holati -->
    <div v-if="isLoading" class="skeleton">Yuklanmoqda...</div>

    <!-- Xato holati -->
    <div v-else-if="isError" class="error">
      {{ error?.message }}
      <button @click="refetch()">Qayta urinish</button>
    </div>

    <!-- Ma'lumotlar -->
    <template v-else>
      <!-- Background yangilash indikatori -->
      <div v-if="isFetching" class="bg-refresh">Yangilanmoqda...</div>

      <div v-for="product in products" :key="product.id">
        <h3>{{ product.name }}</h3>
        <p>{{ product.price.toLocaleString() }} so'm</p>
      </div>
    </template>
  </div>
</template>`,
      description: 'useQuery — deklarativ data fetching. queryKey o\'zgarganda avtomatik refetch. Loading, error, success holatlari.',
    },
    {
      title: 'useMutation + cache invalidation',
      language: 'html',
      code: `<script setup lang="ts">
import { ref } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

interface CreateProductPayload {
  name: string
  price: number
  category: string
}

const queryClient = useQueryClient()

const name = ref('')
const price = ref(0)
const category = ref('')

// ═══ useMutation — server ga yozish ═══
const {
  mutate: createProduct,
  mutateAsync: createProductAsync,
  isPending,      // yuborilmoqda
  isError,
  error,
  isSuccess,
} = useMutation({
  // Mutation funksiyasi
  mutationFn: async (payload: CreateProductPayload) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Yaratib bo\\'lmadi')
    return res.json()
  },

  // Muvaffaqiyatli bo'lganda
  onSuccess: (newProduct) => {
    // 1. Keshni invalidatsiya — qayta fetch
    queryClient.invalidateQueries({
      queryKey: ['products'],
    })

    // 2. Yoki keshga to'g'ridan-to'g'ri qo'shish
    queryClient.setQueryData(
      ['products', newProduct.category],
      (old: Product[] = []) => [...old, newProduct]
    )

    // 3. Formani tozalash
    name.value = ''
    price.value = 0
  },

  // Xato bo'lganda
  onError: (err) => {
    console.error('Mutation xato:', err.message)
  },

  // Har doim (success yoki error)
  onSettled: () => {
    console.log('Mutation tugadi')
  },
})

function handleSubmit() {
  createProduct({
    name: name.value,
    price: price.value,
    category: category.value,
  })
}

// Yoki async/await bilan:
async function handleSubmitAsync() {
  try {
    const product = await createProductAsync({
      name: name.value,
      price: price.value,
      category: category.value,
    })
    console.log('Yaratildi:', product)
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="name" placeholder="Nomi" />
    <input v-model.number="price" type="number" placeholder="Narxi" />

    <button type="submit" :disabled="isPending">
      {{ isPending ? 'Saqlanmoqda...' : 'Saqlash' }}
    </button>

    <p v-if="isError" class="error">{{ error?.message }}</p>
    <p v-if="isSuccess" class="success">Muvaffaqiyatli!</p>
  </form>
</template>`,
      description: 'useMutation — server ga yozish. invalidateQueries — keshni yangilash. setQueryData — keshga to\'g\'ridan-to\'g\'ri yozish.',
    },
    {
      title: 'Optimistic Update pattern',
      language: 'ts',
      code: `import { useMutation, useQueryClient } from '@tanstack/vue-query'

interface Todo {
  id: number
  title: string
  completed: boolean
}

export function useToggleTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (todoId: number) => {
      const res = await fetch(\`/api/todos/\${todoId}/toggle\`, {
        method: 'PATCH',
      })
      return res.json() as Promise<Todo>
    },

    // ═══ Optimistic Update ═══
    // Server javob bermadan OLDIN UI yangilanadi

    onMutate: async (todoId) => {
      // 1. Joriy fetch-larni bekor qilish (race condition oldini olish)
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      // 2. Joriy keshni saqlash (rollback uchun)
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])

      // 3. Keshni OPTIMISTIK yangilash
      queryClient.setQueryData<Todo[]>(['todos'], (old = []) =>
        old.map(todo =>
          todo.id === todoId
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      )

      // 4. Context qaytarish (onError da ishlatiladi)
      return { previousTodos }
    },

    // Xato — ESKi holatga qaytarish
    onError: (_err, _todoId, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    },

    // Har doim — serverdan yangi ma'lumot olish
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}

// Komponentda:
// const { mutate: toggleTodo } = useToggleTodo()
// toggleTodo(todoId)  // UI DARHOL yangilanadi, keyin server tasdiqlaydi`,
      description: 'Optimistic update — UI darhol yangilanadi, server tasdiqlaydi. Xato bo\'lsa rollback. Eng yaxshi UX pattern.',
    },
    {
      title: 'Pinia + TanStack Query — birga ishlatish',
      language: 'ts',
      code: `// ═══ stores/ui-store.ts — CLIENT state (Pinia) ═══
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const selectedProductId = ref<number | null>(null)
  const isCompareMode = ref(false)
  const compareList = ref<number[]>([])
  const viewMode = ref<'grid' | 'list'>('grid')

  function selectProduct(id: number) {
    selectedProductId.value = id
  }

  function toggleCompare(id: number) {
    const idx = compareList.value.indexOf(id)
    if (idx > -1) {
      compareList.value.splice(idx, 1)
    } else if (compareList.value.length < 4) {
      compareList.value.push(id)
    }
  }

  return {
    selectedProductId, isCompareMode,
    compareList, viewMode,
    selectProduct, toggleCompare,
  }
})

// ═══ composables/useProducts.ts — SERVER state (Query) ═══
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

export function useProducts(categoryId: Ref<string>) {
  return useQuery({
    queryKey: ['products', categoryId],
    queryFn: () => api.getProducts(categoryId.value),
    staleTime: 5 * 60 * 1000,
  })
}

export function useProduct(id: Ref<number>) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => api.getProduct(id.value),
    enabled: computed(() => id.value > 0),
  })
}

// ═══ Komponentda — IKKALASI BIRGA ═══
// <script setup>
// const uiStore = useUIStore()              // Client state
// const { data: products } = useProducts(categoryId) // Server state
// const { selectedProductId } = storeToRefs(uiStore)
//
// // Client state — Pinia boshqaradi
// // Server state — TanStack Query boshqaradi
// // Har biri o'z ishini qiladi!`,
      description: 'Client state (Pinia) va server state (TanStack Query) ajratish. Har biri o\'z sohasida eng yaxshi.',
    },
    {
      title: 'VueUse useFetch — sodda alternativa',
      language: 'html',
      code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFetch, whenever } from '@vueuse/core'

const userId = ref(1)

// ═══ useFetch — sodda API chaqiruv ═══
const url = computed(() => \`/api/users/\${userId.value}\`)

const {
  data,          // Ref<string | null> — raw response
  isFetching,    // Ref<boolean>
  error,         // Ref<any>
  execute,       // Qo'lda qayta chaqirish
  abort,         // So'rovni bekor qilish
} = useFetch(url, {
  // Avtomatik refetch URL o'zgarganda
  refetch: true,

  // Interceptor-lar
  beforeFetch({ url, options, cancel }) {
    const token = localStorage.getItem('token')
    if (!token) cancel()

    options.headers = {
      ...options.headers,
      Authorization: \`Bearer \${token}\`,
    }

    return { options }
  },

  afterFetch(ctx) {
    // Response transformatsiya
    ctx.data = JSON.parse(ctx.data)
    return ctx
  },

  onFetchError(ctx) {
    console.error('Fetch xatosi:', ctx.error)
    return ctx
  },
}).json()  // .json() — avtomatik JSON parse

// ═══ useFetch vs TanStack Query ═══
// useFetch:  Kesh YO'Q, retry YO'Q, invalidation YO'Q
// TQ:       Kesh ✓, retry ✓, invalidation ✓, stale-while-revalidate ✓
//
// useFetch — 1-2 API chaqiruv bo'lgan oddiy sahifalar uchun
// TanStack Query — ko'p API bo'lgan murakkab ilovalar uchun
</script>

<template>
  <div>
    <select v-model="userId">
      <option :value="1">Ali</option>
      <option :value="2">Vali</option>
    </select>

    <p v-if="isFetching">Yuklanmoqda...</p>
    <p v-else-if="error">Xato: {{ error }}</p>
    <pre v-else>{{ data }}</pre>

    <button @click="execute()">Qayta yuklash</button>
  </div>
</template>`,
      description: 'VueUse useFetch — sodda fetch wrapper. Kesh va invalidation yo\'q, lekin kichik loyihalar uchun yetarli.',
    },
  ],
  interviewQA: [
    {
      question: 'Server state va client state farqi nima? Nima uchun alohida boshqarish kerak?',
      answer: `Client state — ilova ichida yaratiladi va boshqariladi (UI holati, formalar, tema). Server state — serverda saqlanadi, API orqali olinadi, eskirishi mumkin, keshlanishi kerak. Alohida boshqarish sabablari: 1) Har birining o'z lifecycle bor — client state darhol, server state async. 2) Server state kesh, invalidation, retry, background refetch talab qiladi. 3) Pinia-da server state boshqarsangiz — loading/error/cache logikasini har store-da takrorlaysiz. TanStack Query bularni TAYYOR beradi. 4) Separation of concerns — toza arxitektura.`,
    },
    {
      question: 'TanStack Query da stale-while-revalidate qanday ishlaydi?',
      answer: `3 bosqich: 1) Keshda ma'lumot bor — DARHOL ko'rsatiladi (hatto eskirgan bo'lsa ham). 2) staleTime o'tgan bo'lsa — fonda yangi fetch boshlanadi. 3) Yangi ma'lumot kelganda — UI seamless yangilanadi. staleTime: 0 (default) — har doim background refetch. staleTime: Infinity — hech qachon refetch (statik ma'lumot). Bu pattern UX ni yaxshilaydi — foydalanuvchi loader kutmaydi, lekin ma'lumot yangilanadi. Refetch trigger-lari: window focus, network reconnect, interval, manual invalidation.`,
    },
    {
      question: 'QueryKey nima va u nima uchun muhim?',
      answer: `QueryKey — massiv bo'lib, kesh yozuvini unikal aniqlaydi. ['products'] va ['products', 'electronics'] — ALOHIDA kesh yozuvlari. Key ichidagi reactive qiymat o'zgarganda — avtomatik refetch. Key ierarxik: invalidateQueries({ queryKey: ['products'] }) — 'products' bilan boshlanadigan BARCHA kesh yozuvlarini eskirgan deb belgilaydi. Key tarkibi: [entity, id, filters] — masalan ['products', categoryId, { sort: 'price', page: 2 }]. Bu deterministic kesh tizimi — bir xil key = bir xil ma'lumot.`,
    },
    {
      question: 'Optimistic update nima va qachon ishlatiladi?',
      answer: `Optimistic update — server javob bermadan OLDIN UI ni yangilash. Foydalanuvchi harakatiga darhol reaktsiya. Bosqichlar: 1) onMutate — joriy keshni saqlash (rollback uchun), keshni optimistik yangilash. 2) Server muvaffaqiyatli — invalidateQueries bilan tasdiqlash. 3) Server xato — onError da eski keshga rollback. Qachon ishlatiladi: toggle (like/unlike), delete, oddiy update — server 99% muvaffaqiyatli bo'ladigan operatsiyalar. Qachon ishlatilMAYDI: murakkab validatsiya, payment, boshqa foydalanuvchilarga bog'liq operatsiyalar.`,
    },
    {
      question: 'Pinia va TanStack Query ni qachon BIRGA ishlatish kerak?',
      answer: `DOIMO birga ishlatish tavsiya etiladi katta ilovalarda. Pinia boshqaradi: UI state (sidebar, modal, selected items), user preferences (tema, til), form draft state, client-only logika. TanStack Query boshqaradi: API responses (ro'yxatlar, tafsilotlar), background sync, kesh, retry, loading/error. Ular raqobat qilmaydi — har biri o'z sohasida. Kichik ilovalar uchun: faqat Pinia + oddiy fetch yetarli. O'rta/katta ilovalar uchun: Pinia + TanStack Query ideal kombinatsiya.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-pinia', topicId: 'pinia-basics', label: 'Pinia Asoslari' },
    { techId: 'vue-js', sectionId: 'vue-pinia', topicId: 'composable-stores', label: 'Composable Stores' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'composition-api', label: 'Composition API' },
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'composables', label: 'Composables' },
  ],
}
