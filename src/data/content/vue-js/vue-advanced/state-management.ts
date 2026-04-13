import type { Topic } from '../../../types'

export const stateManagement: Topic = {
  id: 'state-management',
  title: 'Pinia — State Management',
  importance: 3,
  status: 'to-learn',
  description: 'Pinia basics, stores, actions, getters, plugins — Vue rasmiy state management',
  content: `Pinia — Vue 3 ning RASMIY state management kutubxonasi. Vuex ning o'rniga kelgan, soddiroq va TypeScript-ga moslashgan.

═══════════════════════════════════════
  NIMA UCHUN PINIA?
═══════════════════════════════════════

Vuex muammolari:
- Mutations + Actions — keraksiz murakkablik
- TypeScript qo'llab-quvvatlash yomon
- Namespace-lar — chalkash

Pinia afzalliklari:
- Faqat State + Getters + Actions (mutations YO'Q)
- To'liq TypeScript qo'llab-quvvatlash
- Composition API va Options API qo'llab-quvvatlash
- DevTools integratsiyasi
- SSR qo'llab-quvvatlash
- Modular — har bir store mustaqil

═══════════════════════════════════════
  STORE YARATISH
═══════════════════════════════════════

Ikki usul bor:

1. Options Store (Vuex-ga o'xshash):
  export const useCounterStore = defineStore('counter', {
    state: () => ({ count: 0, name: 'Ali' }),
    getters: {
      doubleCount: (state) => state.count * 2,
    },
    actions: {
      increment() {
        this.count++  // this orqali state-ga murojaat
      },
    },
  })

2. Setup Store (Composition API, tavsiya etiladi):
  export const useCounterStore = defineStore('counter', () => {
    const count = ref(0)
    const name = ref('Ali')
    const doubleCount = computed(() => count.value * 2)

    function increment() { count.value++ }

    return { count, name, doubleCount, increment }
  })

═══════════════════════════════════════
  STORE ISHLATISH
═══════════════════════════════════════

  <script setup>
  import { useCounterStore } from '@/stores/counter'
  import { storeToRefs } from 'pinia'

  const store = useCounterStore()

  // MUHIM: destructure qilganda storeToRefs ishlatish!
  const { count, name, doubleCount } = storeToRefs(store)
  // count, name — WritableComputedRef (o'zgartirish mumkin)
  // doubleCount — ComputedRef (faqat o'qish)

  // Actions — to'g'ridan-to'g'ri destructure mumkin:
  const { increment } = store
  </script>

storeToRefs() — faqat state va getters uchun. Actions-ni destructure
qilishda storeToRefs KERAK EMAS.

═══════════════════════════════════════
  STATE O'ZGARTIRISH USULLARI
═══════════════════════════════════════

1. To'g'ridan-to'g'ri:
   store.count++

2. $patch — bir nechta o'zgarish:
   store.$patch({ count: 10, name: 'Vali' })
   store.$patch((state) => {
     state.count++
     state.items.push({ id: 1 })
   })

3. Action orqali (tavsiya etiladi):
   store.increment()

4. $reset() — boshlang'ich holatga qaytarish:
   store.$reset()  // faqat Options Store-da ishlaydi

═══════════════════════════════════════
  PINIA PLUGINS
═══════════════════════════════════════

Plugin — barcha store-larga funksionallik qo'shish:

  // localStorage persistence plugin
  function piniaLocalStoragePlugin({ store }) {
    const saved = localStorage.getItem(store.$id)
    if (saved) store.$patch(JSON.parse(saved))

    store.$subscribe((mutation, state) => {
      localStorage.setItem(store.$id, JSON.stringify(state))
    })
  }

  const pinia = createPinia()
  pinia.use(piniaLocalStoragePlugin)

Tayyor plugin-lar:
- pinia-plugin-persistedstate — localStorage/sessionStorage
- pinia-orm — ORM pattern
- pinia-plugin-debounce — action debounce

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

Pinia ≈ Zustand (React)
- Ikkalasi ham sodda, kam boilerplate
- Ikkalasi ham TypeScript-ga mos
- Ikkalasi ham DevTools bor

Pinia vs Redux:
- Pinia — mutations yo'q, sodda
- Redux — action/reducer pattern, ko'proq boilerplate
- Pinia — Vue reaktivlik, Redux — immutable update`,
  codeExamples: [
    {
      title: 'Setup Store — Auth store misoli',
      language: 'ts',
      code: `// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

export const useAuthStore = defineStore('auth', () => {
  // ===== State =====
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ===== Getters (computed) =====
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userName = computed(() => user.value?.name ?? 'Mehmon')

  // ===== Actions =====
  async function login(email: string, password: string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) throw new Error('Login xato')

      const data = await response.json()
      token.value = data.token
      user.value = data.user
      localStorage.setItem('token', data.token)
    } catch (err) {
      error.value = (err as Error).message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  async function fetchProfile() {
    if (!token.value) return

    try {
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: \`Bearer \${token.value}\` },
      })
      if (!response.ok) throw new Error('Token yaroqsiz')
      user.value = await response.json()
    } catch {
      logout()  // token yaroqsiz — chiqish
    }
  }

  return {
    // State
    user, token, isLoading, error,
    // Getters
    isAuthenticated, isAdmin, userName,
    // Actions
    login, logout, fetchProfile,
  }
})`,
      description: 'Setup store — Composition API style. ref = state, computed = getter, function = action. TypeScript bilan to\'liq tipizatsiya.',
    },
    {
      title: 'Store bilan komponent — storeToRefs',
      language: 'html',
      code: `<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'

// ===== Auth Store =====
const authStore = useAuthStore()

// storeToRefs — state va getters uchun (reaktivlik saqlanadi)
const { user, isAuthenticated, isAdmin, error } = storeToRefs(authStore)

// Actions — to'g'ridan-to'g'ri destructure (funksiya, ref emas)
const { login, logout } = authStore

// ===== Cart Store =====
const cartStore = useCartStore()
const { items, totalPrice, itemCount } = storeToRefs(cartStore)

// ===== Form =====
const email = ref('')
const password = ref('')

async function handleLogin() {
  try {
    await login(email.value, password.value)
  } catch {
    // error storeToRefs orqali reaktiv
  }
}

// Store-lar bir-birini ishlatishi mumkin:
// useCartStore ichida useAuthStore().user ishlatilishi mumkin
</script>

<template>
  <div>
    <!-- Auth holati -->
    <div v-if="isAuthenticated">
      <p>Salom, {{ user?.name }}!</p>
      <p v-if="isAdmin" class="text-yellow-600">Admin</p>
      <p>Savat: {{ itemCount }} ta, {{ totalPrice }} so'm</p>
      <button @click="logout">Chiqish</button>
    </div>

    <!-- Login form -->
    <form v-else @submit.prevent="handleLogin">
      <p v-if="error" class="text-red-500">{{ error }}</p>
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Parol" />
      <button type="submit">Kirish</button>
    </form>
  </div>
</template>`,
      description: 'storeToRefs — state/getters destructure. Actions to\'g\'ridan-to\'g\'ri. Store-lar bir-birini ishlatishi mumkin.',
    },
    {
      title: 'Pinia plugin — persistence',
      language: 'ts',
      code: `// plugins/pinia-persist.ts
import type { PiniaPluginContext } from 'pinia'

interface PersistOptions {
  key?: string
  storage?: Storage
  paths?: string[]   // faqat shu path-lar saqlanadi
}

// declare bilan store-ga persist option qo'shish
declare module 'pinia' {
  interface DefineStoreOptionsBase<S, Store> {
    persist?: PersistOptions | boolean
  }
}

export function piniaPersistPlugin(context: PiniaPluginContext) {
  const { store, options } = context

  const persistConfig = options.persist
  if (!persistConfig) return  // persist yo'q — o'tib ketish

  const config: PersistOptions = typeof persistConfig === 'boolean'
    ? {}
    : persistConfig

  const storageKey = config.key ?? \`pinia-\${store.$id}\`
  const storage = config.storage ?? localStorage

  // 1. Saqlangan ma'lumotni yuklash
  try {
    const saved = storage.getItem(storageKey)
    if (saved) {
      const parsed = JSON.parse(saved)
      store.$patch(parsed)
    }
  } catch (err) {
    console.warn(\`[pinia-persist] \${storageKey} yuklashda xatolik\`, err)
  }

  // 2. O'zgarishlarni saqlash
  store.$subscribe((_mutation, state) => {
    try {
      let toSave = state

      // Faqat tanlangan path-lar
      if (config.paths?.length) {
        toSave = config.paths.reduce((acc, path) => {
          acc[path] = state[path]
          return acc
        }, {} as Record<string, unknown>)
      }

      storage.setItem(storageKey, JSON.stringify(toSave))
    } catch (err) {
      console.warn(\`[pinia-persist] \${storageKey} saqlashda xatolik\`, err)
    }
  })
}

// ===== main.ts da =====
// import { createPinia } from 'pinia'
// import { piniaPersistPlugin } from './plugins/pinia-persist'
//
// const pinia = createPinia()
// pinia.use(piniaPersistPlugin)
//
// ===== Store da =====
// export const useSettingsStore = defineStore('settings', {
//   state: () => ({ theme: 'light', lang: 'uz' }),
//   persist: { paths: ['theme'] },  // faqat theme saqlanadi
// })`,
      description: 'Pinia plugin — barcha store-larga funksionallik. $subscribe — state o\'zgarishini kuzatish. Modular va TypeScript-safe.',
    },
  ],
  interviewQA: [
    {
      question: 'Pinia va Vuex farqi nima? Nima uchun Pinia tanlandi?',
      answer: `Pinia — Vue 3 rasmiy state management (Vuex 5 o'rniga). Farqlar: 1) Mutations YO'Q — actions to'g'ridan-to'g'ri state o'zgartiradi. 2) TypeScript — to'liq tip inference, generics. 3) Composition API — setup store pattern. 4) Modular — har bir store mustaqil, import qilinadi. 5) Yengil — ~1KB. 6) DevTools — time travel, state editing. Vuex-da mutations va actions farqi sun'iy edi, TypeScript qo'llab-quvvatlash yomon edi.`,
    },
    {
      question: 'Options Store va Setup Store farqi nima?',
      answer: `Options Store — Vuex-ga o'xshash: state(), getters, actions object. Tushunarli lekin cheklangan. Setup Store — Composition API: ref = state, computed = getter, function = action. Afzalliklari: 1) watchers ishlatish mumkin, 2) composable-larni ishlatish mumkin, 3) TypeScript-da yaxshiroq tip inference, 4) ko'proq moslashuvchan. Kamchiligi: $reset() avtomatik ishlamaydi (qo'lda yozish kerak). Amaliyotda Setup Store tavsiya etiladi.`,
    },
    {
      question: 'storeToRefs() nima uchun kerak?',
      answer: `Store-ni destructure qilganda reaktivlik yo'qoladi — chunki store Proxy, property-lar oddiy qiymat bo'lib qoladi. storeToRefs() — state va getters-ni Ref ga o'raydi, reaktivlik saqlanadi. MUHIM: storeToRefs faqat state va getters uchun, ACTIONS uchun kerak emas — funksiyalar reaktiv bo'lishi shart emas. Bu Pinia-ning toRefs() analogi, lekin actions-ni o'tkazib yuboradi.`,
    },
    {
      question: 'Pinia da store-lar bir-birini ishlatishi mumkinmi?',
      answer: `Ha! Setup store ichida boshqa store-ni import qilib ishlatish mumkin: const authStore = useAuthStore(). LEKIN circular dependency-dan ehtiyot bo'lish kerak (A store B ni, B store A ni ishlatsa). Hal: 1) dependency-ni action ichiga ko'chirish (setup darajasida emas), 2) uchinchi store yaratish. Pinia DevTools barcha store aloqalarini ko'rsatadi.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'composition-api', label: 'Composition API' },
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'composables', label: 'Composables' },
    { techId: 'nuxt-js', sectionId: 'nuxt-advanced', topicId: 'state-management', label: 'Nuxt State Management' },
  ],
}
