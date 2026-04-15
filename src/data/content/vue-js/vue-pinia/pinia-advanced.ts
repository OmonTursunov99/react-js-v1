import type { Topic } from '../../../types'

export const piniaAdvanced: Topic = {
  id: 'pinia-advanced',
  title: 'Pinia Advanced',
  importance: 2,
  status: 'to-learn',
  description: '$patch, $subscribe, $onAction, $reset, plugins, DevTools, HMR, shared state',
  content: `Pinia asosiy API-dan tashqari kuchli ilg'or imkoniyatlarni taqdim etadi: atomik yangilanishlar ($patch), o'zgarishlarni kuzatish ($subscribe), action interceptor-lar ($onAction), va plugin tizimi. Bu imkoniyatlar murakkab ilovalar uchun zarur.

═══════════════════════════════════════
  $patch — ATOMIK YANGILANISHLAR
═══════════════════════════════════════

$patch() bir nechta state o'zgarishini BITTA operatsiya sifatida amalga oshiradi. Bu DevTools-da bitta event ko'rsatadi va reaktivlik tizimini optimallashtiradi.

Ikki formati bor:

1. OBJECT formati — oddiy hollarda:
  store.$patch({
    count: store.count + 1,
    name: 'Yangi nom',
  })

2. FUNKSIYA formati — murakkab logika uchun:
  store.$patch((state) => {
    state.items.push({ id: 1, title: 'Yangi' })
    state.count++
    state.hasChanges = true
  })

Funksiya formati afzalroq chunki:
- Array-larni to'g'ridan-to'g'ri mutatsiya qilish mumkin
- Shartli logika ishlatish mumkin
- Bitta tranzaksiya sifatida bajariladi

═══════════════════════════════════════
  $subscribe — STATE O'ZGARISHLARINI KUZATISH
═══════════════════════════════════════

$subscribe() — store state o'zgarganda chaqiriladigan callback:

  store.$subscribe((mutation, state) => {
    console.log('Turi:', mutation.type)
    // 'direct' | 'patch object' | 'patch function'
    console.log('Store ID:', mutation.storeId)
    console.log('Yangi state:', state)
  })

mutation.type qiymatlari:
- 'direct' — store.count++ kabi to'g'ridan-to'g'ri o'zgartirish
- 'patch object' — $patch({ ... }) chaqiruvi
- 'patch function' — $patch((state) => { ... }) chaqiruvi

MUHIM: Komponent unmount bo'lganda $subscribe avtomatik olib tashlanadi. Agar komponent tashqarisida ishlatilsangiz:

  store.$subscribe(callback, { detached: true })

Bu holda qo'lda olib tashlash kerak:
  const unsubscribe = store.$subscribe(callback, { detached: true })
  // keyin:
  unsubscribe()

═══════════════════════════════════════
  $onAction — ACTION INTERCEPTOR
═══════════════════════════════════════

$onAction() — har bir action chaqirilganda ishlaydi. Logging, error tracking, analytics uchun ideal:

  store.$onAction(({ name, store, args, after, onError }) => {
    const startTime = Date.now()
    console.log(\`Action boshlandi: \${name}\`)

    after((result) => {
      console.log(\`\${name} tugadi: \${Date.now() - startTime}ms\`)
    })

    onError((error) => {
      console.error(\`\${name} xato: \${error.message}\`)
    })
  })

Parametrlar:
- name — action nomi (string)
- store — store instance
- args — action-ga berilgan argumentlar
- after() — action muvaffaqiyatli tugagandan keyin
- onError() — action xato berganda

═══════════════════════════════════════
  $reset — STATE QAYTA TIKLASH
═══════════════════════════════════════

$reset() — state-ni boshlang'ich holatga qaytaradi.

DIQQAT: Faqat OPTIONS store-da ishlaydi!

  // Options store — $reset() ishlaydi
  const useStore = defineStore('demo', {
    state: () => ({ count: 0, name: '' }),
    actions: { ... }
  })
  store.$reset()  // count: 0, name: ''

Setup store uchun qo'lda yozish kerak:

  const useStore = defineStore('demo', () => {
    const count = ref(0)
    const name = ref('')

    function $reset() {
      count.value = 0
      name.value = ''
    }

    return { count, name, $reset }
  })

═══════════════════════════════════════
  PINIA PLUGINS
═══════════════════════════════════════

Plugin — barcha store-larga funksionallik qo'shish mexanizmi. Har bir store yaratilganda plugin chaqiriladi.

  function myPlugin(context) {
    const { store, app, pinia, options } = context
    // store-ga yangi property qo'shish:
    store.customProperty = ref('hello')
    // yoki $subscribe bilan kuzatish
  }

  pinia.use(myPlugin)

Mashhur plugin-lar:
- pinia-plugin-persistedstate — localStorage/sessionStorage ga saqlash
- pinia-plugin-debounce — action debouncing
- pinia-orm — ORM tizimi

═══════════════════════════════════════
  HOT MODULE REPLACEMENT (HMR)
═══════════════════════════════════════

Vite HMR bilan Pinia store-larni qayta yuklash:

  if (import.meta.hot) {
    import.meta.hot.accept(
      acceptHMRUpdate(useCounterStore, import.meta.hot)
    )
  }

Bu development paytida store kodni o'zgartirsangiz, mavjud state saqlanib qoladi.

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

Redux middleware — action-larni intercept qilish uchun:
  const logger = (store) => (next) => (action) => {
    console.log('dispatching', action)
    return next(action)
  }

Pinia $onAction — xuddi shu maqsad, lekin ANCHA sodda API bilan.

Zustand middleware:
  const useStore = create(
    devtools(persist(immer((set) => ({ ... }))))
  )

Pinia plugins vs Zustand middleware: Pinia-da plugin barcha store-larga avtomatik qo'llanadi, Zustand-da har bir store-ga alohida o'rash kerak.

Redux Toolkit listener middleware — $subscribe ga o'xshash, lekin konfiguratsiyasi murakkabroq.

Pinia $reset() — Zustand-da analogini qo'lda yozish kerak. Redux-da initialState ga qaytarish mumkin.`,
  codeExamples: [
    {
      title: '$patch — atomik yangilanishlar',
      language: 'ts',
      code: `import { useCartStore } from '@/stores/cart-store'

const cart = useCartStore()

// Object formati — oddiy o'zgarishlar
cart.$patch({
  discount: 10,
  promoCode: 'SALE2024',
})

// Funksiya formati — murakkab logika
cart.$patch((state) => {
  // Array operatsiyalar
  const existingItem = state.items.find(i => i.id === productId)

  if (existingItem) {
    existingItem.qty += 1
  } else {
    state.items.push({
      id: productId,
      title: 'Yangi mahsulot',
      price: 29900,
      qty: 1,
    })
  }

  // Hisoblar yangilash
  state.totalItems = state.items.reduce((sum, i) => sum + i.qty, 0)
  state.totalPrice = state.items.reduce(
    (sum, i) => sum + i.price * i.qty, 0
  )
})

// Bir nechta o'zgarish — DevTools-da BITTA event`,
      description: '$patch() funksiya formati murakkab state yangilanishlari uchun. Bitta atomik operatsiya — bitta DevTools event.',
    },
    {
      title: '$subscribe va $onAction — monitoring',
      language: 'ts',
      code: `import { watch } from 'vue'
import { useUserStore } from '@/stores/user-store'

const userStore = useUserStore()

// ═══ $subscribe — state o'zgarishlarini kuzatish ═══
const unsubscribe = userStore.$subscribe(
  (mutation, state) => {
    // localStorage ga saqlash (persist plugin o'rniga)
    localStorage.setItem(
      'user-store',
      JSON.stringify(state)
    )

    // Analytics
    if (mutation.type === 'direct') {
      analytics.track('store_direct_mutation', {
        store: mutation.storeId,
      })
    }
  },
  {
    detached: true,  // Komponent unmount bo'lganda ham ishlaydi
    deep: true,      // Chuqur o'zgarishlarni ham kuzatish
    flush: 'post',   // DOM yangilangandan keyin
  }
)

// ═══ $onAction — action interceptor ═══
userStore.$onAction(({
  name,     // action nomi
  args,     // argumentlar
  after,    // muvaffaqiyatli tugagandan keyin
  onError,  // xato bo'lganda
}) => {
  const start = performance.now()

  console.log(\`[Store] \${name}(\${JSON.stringify(args)})\`)

  after((result) => {
    const duration = performance.now() - start
    console.log(\`[Store] \${name} ✓ \${duration.toFixed(1)}ms\`)

    // Slow action ogohlantirish
    if (duration > 1000) {
      console.warn(\`[Store] \${name} sekin: \${duration}ms\`)
    }
  })

  onError((error) => {
    console.error(\`[Store] \${name} ✗ \${error.message}\`)
    // Sentry yoki boshqa error tracking
    Sentry.captureException(error, {
      tags: { store: 'user', action: name },
    })
  })
})`,
      description: '$subscribe — state har o\'zgarganda ishlaydi. $onAction — action chaqirilganda before/after/error callback-lar.',
    },
    {
      title: 'Pinia Persist Plugin',
      language: 'ts',
      code: `// stores/plugins/persist.ts
import type { PiniaPluginContext } from 'pinia'

// Oddiy persist plugin (custom)
export function piniaPersistedState(context: PiniaPluginContext) {
  const { store } = context

  // Saqlangan state-ni yuklash
  const savedState = localStorage.getItem(\`pinia-\${store.$id}\`)
  if (savedState) {
    store.$patch(JSON.parse(savedState))
  }

  // State o'zgarganda saqlash
  store.$subscribe((_mutation, state) => {
    localStorage.setItem(
      \`pinia-\${store.$id}\`,
      JSON.stringify(state)
    )
  })
}

// main.ts da ulash:
// pinia.use(piniaPersistedState)

// ═══════════════════════════════════════
// Rasmiy plugin: pinia-plugin-persistedstate
// ═══════════════════════════════════════
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    theme: 'dark' as 'light' | 'dark',
    language: 'uz',
    fontSize: 16,
  }),

  // persist konfiguratsiyasi
  persist: {
    key: 'app-settings',       // localStorage kalit nomi
    storage: localStorage,     // yoki sessionStorage
    pick: ['theme', 'language'], // faqat tanlangan property-lar
    // omit: ['fontSize'],      // yoki tashlab ketish
  },

  actions: {
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark'
    },
  },
})`,
      description: 'Persist plugin — state-ni localStorage ga avtomatik saqlash. Custom plugin yoki pinia-plugin-persistedstate ishlatish mumkin.',
    },
    {
      title: 'Setup store uchun $reset va HMR',
      language: 'ts',
      code: `import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, computed } from 'vue'

export const useFormStore = defineStore('form', () => {
  // Boshlang'ich qiymatlar
  const initialState = {
    name: '',
    email: '',
    message: '',
  }

  const name = ref(initialState.name)
  const email = ref(initialState.email)
  const message = ref(initialState.message)
  const isSubmitting = ref(false)

  const isValid = computed(() =>
    name.value.length > 0 &&
    email.value.includes('@') &&
    message.value.length >= 10
  )

  // Setup store uchun qo'lda $reset
  function $reset() {
    name.value = initialState.name
    email.value = initialState.email
    message.value = initialState.message
    isSubmitting.value = false
  }

  async function submit() {
    if (!isValid.value) return
    isSubmitting.value = true
    try {
      await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          message: message.value,
        }),
      })
      $reset()  // Muvaffaqiyatli — formani tozalash
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    name, email, message,
    isSubmitting, isValid,
    $reset, submit,
  }
})

// ═══ HMR — development uchun ═══
if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useFormStore, import.meta.hot)
  )
}`,
      description: 'Setup store-da $reset() qo\'lda yoziladi. acceptHMRUpdate — Vite HMR bilan state saqlanib qoladi.',
    },
  ],
  interviewQA: [
    {
      question: '$patch() ning ikki formati orasidagi farq nima?',
      answer: `Object formati ($patch({ count: 1 })) — oddiy property o'zgarishlar uchun, lekin array push/splice kabi operatsiyalar qiyin. Funksiya formati ($patch((state) => { ... })) — murakkab logika uchun ideal: shartli o'zgarishlar, array mutatsiyalar, hisoblangan qiymatlar. Ikkala format ham bitta DevTools event yaratadi va bitta reaktivlik yangilanishini trigger qiladi. Funksiya formati xavfsizroq — rollback imkoniyati bor (xato bo'lsa o'zgarishlar bekor qilinadi).`,
    },
    {
      question: '$subscribe va watch farqi nima?',
      answer: `$subscribe — Pinia-ning o'z mexanizmi, mutation TURI haqida ma'lumot beradi (direct/patch object/patch function), store ID ko'rsatadi, va barcha state o'zgarishlarni kuzatadi. watch() — Vue-ning reaktivlik tizimi, faqat kuzatilgan qiymatlar uchun ishlaydi. $subscribe detached: true bilan komponent tashqarisida ishlashi mumkin. Amaliyotda: global monitoring uchun $subscribe, aniq property kuzatish uchun watch.`,
    },
    {
      question: 'Pinia plugin qanday ishlaydi? Qanday holatda kerak?',
      answer: `Plugin — funksiya bo'lib, har yangi store yaratilganda chaqiriladi. PiniaPluginContext orqali store, pinia instance, app, va store options-ga kirish mumkin. Ishlatish holatlari: 1) Persist — state-ni localStorage ga saqlash, 2) Logger — barcha action-larni logging, 3) Error tracking — xatolarni global ushlash, 4) Auth — har bir store-ga auth tekshiruv qo'shish. Plugin store-ga yangi property-lar qo'shishi, $subscribe/$onAction ulashi, va hatto store-ni kengaytirishi mumkin.`,
    },
    {
      question: 'Setup store-da $reset() nima uchun avtomatik ishlamaydi?',
      answer: `Options store-da Pinia state() funksiyasini qayta chaqirib boshlang'ich qiymatlarni olishi mumkin. Setup store-da esa ref() qiymatlari closure ichida — Pinia boshlang'ich qiymatlarni bilmaydi. Yechim: 1) initialState object yaratib, $reset() ichida qo'lda tiklash, 2) Yoki Options store ishlatish. Vue jamoasi buni bilgan holda qoldirgan — Setup store moslashuvchanligi uchun bu trade-off.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-pinia', topicId: 'pinia-basics', label: 'Pinia Asoslari' },
    { techId: 'vue-js', sectionId: 'vue-pinia', topicId: 'composable-stores', label: 'Composable Stores' },
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'reactivity-deep', label: 'Reaktivlik chuqur' },
    { techId: 'vue-js', sectionId: 'vue-typescript', topicId: 'ts-pinia', label: 'TypeScript + Pinia' },
  ],
}
