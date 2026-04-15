import type { Topic } from '../../../types'

export const composableStores: Topic = {
  id: 'composable-stores',
  title: 'Composable Stores',
  importance: 2,
  status: 'to-learn',
  description: 'Pinia vs composable, singleton pattern, store composition, qachon qaysi birini tanlash',
  content: `Vue 3 da global state boshqarishning ikki yondashuvi bor: Pinia store va composable (ref/reactive bilan). Ikkalasi ham ishlaydi, lekin har birining o'z afzalliklari va kamchiliklari bor. Senior dasturchi ikkala yondashuvni bilishi va to'g'ri tanlashi kerak.

═══════════════════════════════════════
  COMPOSABLE — GLOBAL STATE
═══════════════════════════════════════

Composable — Composition API funksiyasi. Agar ref() modul darajasida (funksiya tashqarisida) e'lon qilinsa, u singleton bo'ladi:

  // composables/useCounter.ts
  const count = ref(0)  // MODUL DARAJASI — singleton

  export function useCounter() {
    const doubleCount = computed(() => count.value * 2)

    function increment() { count.value++ }
    function decrement() { count.value-- }

    return { count, doubleCount, increment, decrement }
  }

Har bir komponent useCounter() chaqirganda BIR XIL count ref-ga murojaat qiladi. Bu global state!

SINGLETON VS FACTORY:
  // Singleton — ref funksiya TASHQARISIDA
  const state = ref(0)
  export function useShared() {
    return { state }
  }

  // Factory — ref funksiya ICHIDA (har chaqiruvda yangi)
  export function useLocal() {
    const state = ref(0)  // har safar yangi instance
    return { state }
  }

═══════════════════════════════════════
  PINIA VS COMPOSABLE — QACHON QAYSI?
═══════════════════════════════════════

PINIA tanlang qachon:
✓ DevTools bilan debug qilish kerak
✓ State persist (localStorage) kerak
✓ $patch, $subscribe, $onAction kerak
✓ SSR qo'llab-quvvatlash kerak
✓ Plugin tizimi kerak (logging, auth)
✓ Katta jamoa — standart pattern kerak
✓ Store-lar orasida murakkab bog'liqlik

COMPOSABLE tanlang qachon:
✓ Oddiy shared state (1-3 ta ref)
✓ Side-effect bilan birga (event listener, timer)
✓ Reusable logika (UI state, form validation)
✓ Lifecycle bilan bog'liq (onMounted, onUnmounted)
✓ Pinia dependency qo'shishni xohlamasangiz
✓ Micro-state — bitta funksionallik uchun

QOIDA: Agar 3+ komponent bitta state ishlatsa va debug kerak — Pinia. Agar 1-2 komponent yoki lifecycle bilan bog'liq — composable.

═══════════════════════════════════════
  COMPOSABLE STORE PATTERNS
═══════════════════════════════════════

1. SINGLETON COMPOSABLE (eng keng tarqalgan):

  // composables/useAuth.ts
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  export function useAuth() {
    const isLoggedIn = computed(() => !!user.value)

    async function login(creds: Credentials) {
      const data = await api.login(creds)
      user.value = data.user
      token.value = data.token
    }

    function logout() {
      user.value = null
      token.value = null
    }

    return { user, token, isLoggedIn, login, logout }
  }

2. PROVIDE/INJECT PATTERN (komponent daraxt bo'ylab):

  // Parent komponent
  const state = reactive({ theme: 'dark', lang: 'uz' })
  provide('settings', state)

  // Child komponent
  const settings = inject('settings')

Bu Pinia-dan farqli — faqat parent-child orasida ishlaydi.

3. EVENT BUS COMPOSABLE:

  const listeners = new Map<string, Set<Function>>()

  export function useEventBus() {
    function emit(event: string, data?: any) { ... }
    function on(event: string, callback: Function) { ... }
    function off(event: string, callback: Function) { ... }
    return { emit, on, off }
  }

═══════════════════════════════════════
  PINIA + COMPOSABLE BIRGA
═══════════════════════════════════════

Eng yaxshi yondashuv — ikkalasini BIRGA ishlatish:

Pinia — global business state:
  useAuthStore() — foydalanuvchi ma'lumotlari
  useCartStore() — savat
  useSettingsStore() — sozlamalar

Composable — UI state va reusable logika:
  useMediaQuery() — ekran o'lchami
  useLocalStorage() — localStorage wrapper
  useDarkMode() — tema
  useClickOutside() — tashqi bosish
  useDebounce() — debounce
  useInfiniteScroll() — cheksiz scroll

PINIA ICHIDA COMPOSABLE:
  const useProductStore = defineStore('products', () => {
    const route = useRoute()          // composable!
    const { locale } = useI18n()      // composable!

    const products = ref([])

    watch(locale, () => {
      fetchProducts()  // til o'zgarganda qayta yuklash
    })

    return { products }
  })

Setup store ichida istalgan composable ishlatish mumkin — bu Pinia-ning katta afzalligi.

═══════════════════════════════════════
  STORE COMPOSITION
═══════════════════════════════════════

Katta store-ni kichik store-larga bo'lish:

  // stores/use-notifications.ts
  export const useNotificationStore = defineStore('notifications', () => {
    const items = ref<Notification[]>([])
    function add(msg: string) { ... }
    function remove(id: string) { ... }
    return { items, add, remove }
  })

  // stores/use-auth.ts
  export const useAuthStore = defineStore('auth', () => {
    const notif = useNotificationStore()

    async function login(creds: Credentials) {
      const user = await api.login(creds)
      notif.add('Muvaffaqiyatli kirdingiz!')
      return user
    }

    return { login }
  })

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React-da state management landshafti kengroq:
- Zustand — Pinia ga eng yaqin (sodda, minimal)
- Redux Toolkit — katta loyihalar uchun (Vuex analog)
- Jotai — atomik state (composable + ref() ga o'xshash)
- React Context — provide/inject analog

Vue composable singleton ≈ React custom hook + module-level variable:

  // React
  let count = 0  // module-level — lekin reaktiv EMAS!
  function useCounter() {
    const [, forceUpdate] = useState({})
    // qo'lda reaktivlik kerak...
  }

Vue-da ref() avtomatik reaktiv — React-da module-level state reaktiv emas.

React Context muammolari (provider hell, unnecessary re-renders) Vue-da provide/inject + reaktivlik bilan hal qilingan.

Pinia $subscribe ≈ Zustand subscribe — ikkalasi ham store tashqarisida state kuzatish imkonini beradi.`,
  codeExamples: [
    {
      title: 'Singleton Composable — global state',
      language: 'ts',
      code: `// composables/useTheme.ts
import { ref, computed, watchEffect } from 'vue'

type Theme = 'light' | 'dark' | 'system'

// ═══ Modul darajasi — singleton ═══
const theme = ref<Theme>(
  (localStorage.getItem('theme') as Theme) || 'system'
)

// System tema kuzatish
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')

export function useTheme() {
  const isDark = computed(() => {
    if (theme.value === 'system') {
      return prefersDark.matches
    }
    return theme.value === 'dark'
  })

  // DOM va localStorage bilan sinxronlash
  watchEffect(() => {
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('theme', theme.value)
  })

  function setTheme(newTheme: Theme) {
    theme.value = newTheme
  }

  function toggleTheme() {
    theme.value = isDark.value ? 'light' : 'dark'
  }

  return {
    theme: readonly(theme),  // tashqaridan o'zgartirish mumkin emas
    isDark,
    setTheme,
    toggleTheme,
  }
}

// Istalgan komponentda:
// const { isDark, toggleTheme } = useTheme()
// Hammasi BIR XIL state-ga ulangan`,
      description: 'Singleton composable — ref modul darajasida, barcha komponentlar bitta state. localStorage + system preference bilan.',
    },
    {
      title: 'Pinia vs Composable — to\'g\'ri tanlash',
      language: 'ts',
      code: `// ══════ 1. Oddiy UI state — COMPOSABLE yetarli ══════
// composables/useModal.ts
export function useModal() {
  const isOpen = ref(false)
  const title = ref('')

  function open(modalTitle: string) {
    title.value = modalTitle
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
    title.value = ''
  }

  return { isOpen, title, open, close }
}

// ══════ 2. Business logic — PINIA kerak ══════
// stores/cart-store.ts
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const promoCode = ref<string | null>(null)

  const subtotal = computed(() =>
    items.value.reduce((sum, i) => sum + i.price * i.qty, 0)
  )

  const discount = computed(() =>
    promoCode.value === 'VUE20' ? subtotal.value * 0.2 : 0
  )

  const total = computed(() => subtotal.value - discount.value)

  // DevTools-da ko'rinadi ✓
  // $subscribe bilan kuzatish mumkin ✓
  // Persist plugin bilan saqlanadi ✓

  async function checkout() {
    const authStore = useAuthStore()
    if (!authStore.isLoggedIn) throw new Error('Login!')
    await api.createOrder(items.value, total.value)
    items.value = []
  }

  return {
    items, promoCode,
    subtotal, discount, total,
    checkout,
  }
})

// ══════ 3. Side-effect logika — COMPOSABLE ══════
// composables/useOnlineStatus.ts
const isOnline = ref(navigator.onLine)

export function useOnlineStatus() {
  // Lifecycle bilan bog'liq — composable ideal
  onMounted(() => {
    window.addEventListener('online', () => isOnline.value = true)
    window.addEventListener('offline', () => isOnline.value = false)
  })

  onUnmounted(() => {
    // Cleanup
    window.removeEventListener('online', handler)
    window.removeEventListener('offline', handler)
  })

  return { isOnline: readonly(isOnline) }
}`,
      description: 'UI state va side-effect uchun composable, business logic uchun Pinia. Ikkalasini to\'g\'ri ajratish muhim.',
    },
    {
      title: 'Pinia ichida composable ishlatish',
      language: 'ts',
      code: `import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLocalStorage } from '@vueuse/core'

// Setup store — composable-larni to'g'ridan-to'g'ri ishlatish
export const useProductStore = defineStore('products', () => {
  const route = useRoute()
  const { t, locale } = useI18n()

  // VueUse composable — localStorage bilan sinxron
  const viewMode = useLocalStorage<'grid' | 'list'>(
    'product-view', 'grid'
  )

  const products = ref<Product[]>([])
  const isLoading = ref(false)

  // Route param o'zgarganda avtomatik yuklash
  const categoryId = computed(() =>
    route.params.categoryId as string
  )

  watch(categoryId, async (newCat) => {
    if (newCat) await fetchByCategory(newCat)
  }, { immediate: true })

  // Til o'zgarganda qayta yuklash
  watch(locale, () => {
    if (products.value.length) {
      fetchByCategory(categoryId.value)
    }
  })

  async function fetchByCategory(catId: string) {
    isLoading.value = true
    try {
      const res = await fetch(
        \`/api/products?cat=\${catId}&lang=\${locale.value}\`
      )
      products.value = await res.json()
    } finally {
      isLoading.value = false
    }
  }

  return {
    products, isLoading, viewMode,
    categoryId,
    fetchByCategory,
  }
})

// MUHIM: Options store-da composable ishlatish mumkin EMAS
// Faqat Setup store-da ishlaydi!`,
      description: 'Setup store ichida useRoute, useI18n, VueUse composable-larni bevosita ishlatish — bu Pinia ning kuchli afzalligi.',
    },
    {
      title: 'Store composition — kichik store-lardan katta tizim',
      language: 'ts',
      code: `// ═══ stores/ui-store.ts ═══
export const useUIStore = defineStore('ui', () => {
  const sidebarOpen = ref(true)
  const modalStack = ref<string[]>([])
  const toasts = ref<Toast[]>([])

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function showToast(message: string, type: 'success' | 'error') {
    const id = crypto.randomUUID()
    toasts.value.push({ id, message, type })
    setTimeout(() => removeToast(id), 5000)
  }

  function removeToast(id: string) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { sidebarOpen, modalStack, toasts, toggleSidebar, showToast, removeToast }
})

// ═══ stores/auth-store.ts ═══
export const useAuthStore = defineStore('auth', () => {
  const ui = useUIStore()  // UI store-ga murojaat
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => !!user.value)

  async function login(creds: LoginPayload) {
    try {
      const data = await api.login(creds)
      user.value = data.user
      ui.showToast('Muvaffaqiyatli kirdingiz!', 'success')
    } catch (e) {
      ui.showToast('Login xatosi', 'error')
      throw e
    }
  }

  async function logout() {
    user.value = null
    ui.showToast('Chiqdingiz', 'success')
  }

  return { user, isLoggedIn, login, logout }
})

// ═══ stores/data-store.ts ═══
export const useDataStore = defineStore('data', () => {
  const auth = useAuthStore()   // Auth tekshiruv
  const ui = useUIStore()       // Toast ko'rsatish

  const items = ref<Item[]>([])

  async function fetchItems() {
    if (!auth.isLoggedIn) {
      ui.showToast('Avval login qiling', 'error')
      return
    }

    try {
      items.value = await api.getItems()
    } catch {
      ui.showToast('Ma\\'lumot yuklanmadi', 'error')
    }
  }

  return { items, fetchItems }
})`,
      description: 'Store composition — har bir store mustaqil, lekin boshqa store-larni import qilib ishlatadi. Flat arxitektura.',
    },
  ],
  interviewQA: [
    {
      question: 'Pinia va composable orasida qanday tanlaysiz?',
      answer: `Mezon: 1) DevTools kerakmi? — Pinia. 2) Persist kerakmi? — Pinia. 3) Bir nechta store orasida bog'liqlik? — Pinia. 4) Side-effect bilan logika (event listener, timer)? — Composable. 5) Oddiy shared state (1-2 ref)? — Composable. 6) Business logic? — Pinia. Amaliyotda: business domain state — Pinia, UI utilities va reusable logika — composable. Ikkalasini birga ishlatish eng yaxshi yondashuv.`,
    },
    {
      question: 'Singleton composable pattern qanday ishlaydi va xavfli tomonlari bormi?',
      answer: `ref() modul darajasida e'lon qilinganda, JavaScript module tizimi uni bir marta yaratadi va keyin import qilgan barcha joyga BIR XIL instance beradi. Bu singleton. Xavflari: 1) SSR da server-dagi state barcha request-lar orasida almashiladi — memory leak va data leak. Pinia SSR-da har request uchun yangi instance yaratadi. 2) Test-larda state bir testdan ikkinchisiga o'tib qolishi mumkin. 3) DevTools-da ko'rinmaydi. Shuning uchun SSR bo'lsa — Pinia, SPA bo'lsa — composable ham ishlaydi.`,
    },
    {
      question: 'Pinia Setup store ichida composable ishlatish qanday ishlaydi?',
      answer: `Setup store — defineStore('id', () => { ... }) formatida. Bu funksiya ichida istalgan Vue composable chaqirish mumkin: useRoute(), useI18n(), VueUse composable-lari. Bu Options store-da mumkin EMAS. Ishlash sababi: Setup store funksiyasi Vue component setup kontekstida chaqiriladi, shuning uchun lifecycle hook-lar va inject ishlaydi. Afzalligi: store-ni route, i18n, localStorage bilan integratsiya qilish juda oson. watch() va watchEffect() ham ishlatish mumkin.`,
    },
    {
      question: 'Store-lar orasida circular dependency bo\'lsa nima qilish kerak?',
      answer: `Circular dependency — A store B store-ni, B store esa A store-ni import qilganda. Yechimlar: 1) useXxxStore() ni TOP-LEVEL da emas, ACTION ICHIDA chaqiring — lazy initialization. 2) Umumiy logikani uchinchi store-ga ajrating. 3) Composable-ga chiqaring — Pinia tashqarisida. 4) Event-based communication — $onAction bilan. Pinia-da circular dependency xatosi faqat store yaratilish paytida sodir bo'ladi, action ichida chaqirish xavfsiz.`,
    },
    {
      question: 'provide/inject va Pinia farqi nima?',
      answer: `provide/inject — faqat komponent daraxt bo'ylab (parent → child) ishlaydi. Pinia — global, istalgan joyda. provide/inject afzalliklari: 1) Scoped — faqat kerakli subtree-da, 2) Dependency injection pattern, 3) Library/plugin yaratishda foydali. Kamchiliklari: 1) DevTools-da ko'rinmaydi, 2) TypeScript bilan murakkabroq (InjectionKey kerak), 3) Faqat setup() ichida ishlaydi. Amaliyotda: kutubxona yozayotganda provide/inject, ilova state uchun Pinia.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-pinia', topicId: 'pinia-basics', label: 'Pinia Asoslari' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'composition-api', label: 'Composition API' },
    { techId: 'vue-js', sectionId: 'vue-pinia', topicId: 'server-state', label: 'Server State' },
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'composable-patterns', label: 'Composable Patterns' },
  ],
}
