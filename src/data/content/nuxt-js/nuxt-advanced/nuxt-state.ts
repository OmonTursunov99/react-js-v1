import type { Topic } from '../../../types'

export const nuxtState: Topic = {
  id: 'nuxt-state',
  title: 'State Management',
  importance: 2,
  status: 'to-learn',
  description: 'useState composable, Pinia integratsiyasi, SSR hydration',
  content: `STATE MANAGEMENT — NUXT DA HOLAT BOSHQARUVI
═══════════════════════════════════════

Nuxt 3 da ikki asosiy state management yondashuvi bor:
1. useState() — built-in SSR-safe reactive state
2. Pinia — to"liq store management (Nuxt bilan chuqur integratsiya)

MUHIM: Oddiy ref() SSR da ishlamaydi — server da yaratilgan
state client ga uzatilmaydi. useState() bu muammoni hal qiladi.

═══════════════════════════════════════
1. USESTATE — SSR-SAFE REACTIVE STATE
═══════════════════════════════════════

useState<T>(key, init?) — Nuxt composable:
- Kalit (key) orqali state identifikatsiya qilinadi
- Server da yaratilgan qiymat client ga serialized holda uzatiladi
- Komponentlar orasida shared state sifatida ishlaydi
- ref() ga o"xshash, lekin SSR-safe

Qachon useState ishlatiladi:
- Oddiy shared state (counter, toggle, user info)
- SSR da server → client state uzatish kerak bo"lganda
- Kichik loyihalarda Pinia o"rniga

═══════════════════════════════════════
2. USESTATE VS REF — NIMA UCHUN USESTATE KERAK
═══════════════════════════════════════

ref() muammosi SSR da:
- Server render paytida ref yaratiladi
- Client hydration paytida YANGI ref yaratiladi
- Server dagi qiymat yo"qoladi — hydration mismatch

useState() yechimi:
- Server da state yaratiladi va payload ga qo"shiladi
- Client da payload dan qiymat olinadi (yangi yaratilmaydi)
- Kalit bo"yicha bir xil state qaytariladi

MUHIM: Faqat composable lar ichida (setup, plugin) ishlating.
Event handler yoki oddiy funksiya ichida ishlamaydi.

═══════════════════════════════════════
3. PINIA WITH NUXT
═══════════════════════════════════════

@pinia/nuxt moduli Nuxt bilan chuqur integratsiya beradi:
- Auto-import: defineStore, storeToRefs import kerak emas
- SSR hydration avtomatik — server state client ga uzatiladi
- DevTools qo"llab-quvvatlaydi
- stores/ papkasidan auto-import

O"rnatish:
  yarn add pinia @pinia/nuxt

nuxt.config.ts:
  modules: ["@pinia/nuxt"]

═══════════════════════════════════════
4. STORE PATTERN — DEFINESTORE
═══════════════════════════════════════

Ikki yozuv tarzi:
1. Options API — Vue 2 ga o"xshash (state, getters, actions)
2. Composition API — setup() funksiya (tavsiya etiladi)

Composition API afzalliklari:
- ref, computed, watch ishlatish mumkin
- TypeScript bilan yaxshiroq ishlaydi
- Kodni guruhlash erkin

═══════════════════════════════════════
5. STORETOREFS — REAKTIVLIKNI SAQLASH
═══════════════════════════════════════

Store ni destructure qilganda reaktivlik yo"qoladi.
storeToRefs() store propertylarni ref ga aylantiradi.

MUHIM: Action larni storeToRefs bilan olMANG —
ular funksiya, ref emas. To"g"ridan-to"g"ri store dan oling.

═══════════════════════════════════════
6. STATE SERIALIZATION (SSR → CLIENT)
═══════════════════════════════════════

SSR da state server dan client ga JSON sifatida uzatiladi.
Bu jarayon serialization deyiladi.

Cheklovlar:
- Function, Map, Set, Date serialized bo"lmaydi
- Faqat JSON-compatible qiymatlar: string, number, boolean, array, object
- Circular reference xato beradi
- Class instance oddiy object ga aylanadi

Yechim: toJSON/fromJSON pattern yoki computed bilan transform qilish.`,
  codeExamples: [
    {
      title: 'useState — asosiy ishlatilishi',
      language: 'ts',
      code: `// composables/useCounter.ts
export function useCounter() {
  // "counter" — kalit, barcha komponentlarda bir xil state
  const count = useState<number>("counter", () => 0)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function reset() {
    count.value = 0
  }

  return { count, increment, decrement, reset }
}

// composables/useUser.ts
interface User {
  id: number
  name: string
  email: string
}

export function useUser() {
  const user = useState<User | null>("user", () => null)
  const isLoggedIn = computed(() => user.value !== null)

  async function fetchUser() {
    user.value = await $fetch("/api/auth/me")
  }

  function logout() {
    user.value = null
    navigateTo("/login")
  }

  return { user, isLoggedIn, fetchUser, logout }
}`,
      description: 'useState kalit orqali identifikatsiya — har qanday komponentda bir xil state qaytaradi',
    },
    {
      title: 'useState vs ref — SSR muammosi',
      language: 'ts',
      code: `// NOTO"G"RI — ref() SSR da ishlamaydi
// composables/useBroken.ts
export function useBroken() {
  // Server da: ref(0) yaratiladi, render qilinadi
  // Client da: YANGI ref(0) yaratiladi — server qiymati yo"qoladi
  const count = ref(0)
  return { count }
}

// TO"G"RI — useState() SSR-safe
// composables/useCorrect.ts
export function useCorrect() {
  // Server da: useState yaratiladi, payload ga qo"shiladi
  // Client da: payload dan qiymat olinadi
  const count = useState<number>("count", () => 0)
  return { count }
}

// MUHIM: Agar state faqat bitta komponent ichida
// va SSR kerak bo"lmasa — ref() ishlatsa bo"ladi.
// Shared state yoki SSR uchun — useState() majburiy.`,
      description: 'ref() SSR hydration da state yo"qotadi, useState() server → client uzatishni ta"minlaydi',
    },
    {
      title: 'Pinia store — Composition API pattern',
      language: 'ts',
      code: `// stores/auth.ts
export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)

  // Getters (computed)
  const isAuthenticated = computed(() => !!token.value)
  const userName = computed(() => user.value?.name ?? "Mehmon")

  // Actions
  async function login(credentials: { email: string; password: string }) {
    loading.value = true
    try {
      const response = await $fetch("/api/auth/login", {
        method: "POST",
        body: credentials,
      })
      token.value = response.token
      user.value = response.user
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await $fetch("/api/auth/logout", { method: "POST" })
    token.value = null
    user.value = null
    navigateTo("/login")
  }

  return { user, token, loading, isAuthenticated, userName, login, logout }
})`,
      description: 'Composition API store — ref, computed, function bilan yoziladi. Nuxt auto-import qiladi.',
    },
    {
      title: 'storeToRefs va komponentda ishlatish',
      language: 'ts',
      code: `// pages/dashboard.vue
<script setup lang="ts">
// Store dan state va getterlar — storeToRefs bilan
const authStore = useAuthStore()
const { user, isAuthenticated, loading } = storeToRefs(authStore)

// Action lar to"g"ridan-to"g"ri store dan
const { logout } = authStore

// NOTO"G"RI — reaktivlik yo"qoladi:
// const { user, isAuthenticated } = authStore
// user o"zgarganda template yangilanMAYDI

// NOTO"G"RI — action ni storeToRefs bilan olish:
// const { logout } = storeToRefs(authStore) // ❌ xato beradi

// Boshqa store bilan birga ishlatish
const cartStore = useCartStore()
const { items, totalPrice } = storeToRefs(cartStore)
const { addItem, removeItem } = cartStore
</script>

<template>
  <div v-if="loading">Yuklanmoqda...</div>
  <div v-else-if="isAuthenticated">
    <h1>Salom, {{ user?.name }}</h1>
    <button @click="logout">Chiqish</button>
  </div>
</template>`,
      description: 'storeToRefs — state/getters uchun, action lar store dan to"g"ridan-to"g"ri',
    },
    {
      title: 'Pinia — Options API store',
      language: 'ts',
      code: `// stores/cart.ts — Options API tarzi
export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as CartItem[],
    discount: 0,
  }),

  getters: {
    totalItems: (state) => state.items.length,

    totalPrice: (state) => {
      const subtotal = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      return subtotal * (1 - state.discount / 100)
    },

    isEmpty: (state) => state.items.length === 0,
  },

  actions: {
    addItem(product: Product) {
      const existing = this.items.find((i) => i.id === product.id)
      if (existing) {
        existing.quantity++
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
    },

    removeItem(id: string) {
      this.items = this.items.filter((i) => i.id !== id)
    },

    applyDiscount(percent: number) {
      this.discount = Math.min(percent, 50) // max 50%
    },
  },
})

interface CartItem extends Product {
  quantity: number
}

interface Product {
  id: string
  name: string
  price: number
}`,
      description: 'Options API — Vue 2 ga o"xshash tuzilma, kichik store lar uchun qulay',
    },
  ],
  interviewQA: [
    {
      question: 'useState va ref farqi nima? Qachon qaysi birini ishlatish kerak?',
      answer: 'ref() oddiy reactive qiymat — faqat client da ishlaydi. SSR da server yaratgan qiymat client hydration da yo"qoladi, chunki client yangi ref yaratadi. useState() SSR-safe — server da yaratilgan qiymatni payload orqali client ga uzatadi. Shared state yoki SSR kerak bo"lganda useState, faqat bitta komponent ichidagi local state uchun ref ishlatiladi.',
    },
    {
      question: 'Nuxt da Pinia qanday SSR bilan ishlaydi?',
      answer: '@pinia/nuxt moduli SSR hydration ni avtomatik boshqaradi. Server da store yaratiladi va state JSON ga serialize qilinadi. Client da bu JSON dan state tiklanadi — yangi so"rov yuborilmaydi. Shuning uchun birinchi render tez va data ikki marta yuklanmaydi. Lekin state faqat JSON-compatible bo"lishi kerak — Function, Map, Set serialize bo"lmaydi.',
    },
    {
      question: 'storeToRefs nima uchun kerak va qanday ishlaydi?',
      answer: 'Pinia store ni destructure qilganda reactive proxy buziladi — state o"zgarganda komponent qayta renderlanmaydi. storeToRefs() store ning state va getter larini alohida ref larga aylantiradi, reaktivlikni saqlaydi. Lekin action larni storeToRefs bilan olish kerak emas — ular oddiy funksiya, to"g"ridan-to"g"ri store dan olinadi.',
    },
    {
      question: 'SSR da state serialization cheklovlari qanday?',
      answer: 'SSR da server state JSON.stringify orqali serialize qilinadi va HTML payload ga qo"shiladi. Cheklovlar: Function serialize bo"lmaydi, Date string ga aylanadi, Map/Set yo"qoladi, circular reference xato beradi, class instance oddiy object ga aylanadi. Yechim — faqat primitive va plain object ishlatish yoki toJSON/fromJSON custom serializer yozish.',
    },
    {
      question: 'Pinia da Options API va Composition API store farqi nima?',
      answer: 'Options API — state(), getters, actions alohida bo"limlarda yoziladi, Vue 2 Options API ga o"xshash. Composition API — setup funksiya ichida ref, computed, function erkin yoziladi. Composition API afzalliklari: TypeScript bilan yaxshiroq ishlaydi, kodni mantiqiy guruhlash oson, composable larni qayta ishlatish qulay. Senior darajada Composition API tavsiya etiladi.',
    },
  ],
}
