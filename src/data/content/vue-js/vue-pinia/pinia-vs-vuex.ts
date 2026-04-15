import type { Topic } from '../../../types'

export const piniaVsVuex: Topic = {
  id: 'pinia-vs-vuex',
  title: 'Pinia vs Vuex',
  importance: 2,
  status: 'to-learn',
  description: 'Pinia va Vuex taqqoslash, mutations yo\'qligi, TypeScript, migration guide, nima uchun Pinia g\'olib',
  content: `Pinia dastlab Vuex 5 ning eksperimental prototopi sifatida yaratilgan edi. Vaqt o'tib u mustaqil kutubxonaga aylandi va Vue 3 ning rasmiy state management yechimi deb e'lon qilindi. Vuex hali ham ishlaydi, lekin yangi loyihalar uchun Pinia tavsiya etiladi.

═══════════════════════════════════════
  ASOSIY FARQLAR
═══════════════════════════════════════

1. MUTATIONS YO'Q
Vuex-da state-ni O'ZGARTIRISH uchun mutation MAJBURIY edi:

  // Vuex — 3 ta qadam
  // 1. mutation yozish
  mutations: {
    SET_COUNT(state, payload) { state.count = payload }
  }
  // 2. action yozish
  actions: {
    updateCount({ commit }, value) { commit('SET_COUNT', value) }
  }
  // 3. komponentda chaqirish
  store.dispatch('updateCount', 5)

  // Pinia — 1 ta qadam
  store.count = 5  // yoki action ichida this.count = 5

2. MODULLAR VA NAMESPACE YO'Q
Vuex modules + namespaced tizimi murakkab edi:

  // Vuex
  store.dispatch('user/auth/login', credentials)
  store.getters['cart/items/totalPrice']

  // Pinia — har bir store mustaqil
  const userStore = useUserStore()
  const cartStore = useCartStore()
  userStore.login(credentials)
  cartStore.totalPrice

3. TYPESCRIPT QO'LLAB-QUVVATLASH
Vuex TypeScript bilan yomon ishlardi — string kalit bilan dispatch/commit, typing qiyin.
Pinia-da barcha narsa avtomatik tipizatsiya qilingan — IDE autocomplete, type-safe.

4. COMPOSITION API
Vuex faqat Options API uslubida ishlaydi.
Pinia Setup Store — to'liq Composition API qo'llab-quvvatlash.

═══════════════════════════════════════
  API TAQQOSLASH
═══════════════════════════════════════

                    VUEX 4              PINIA
  ─────────────────────────────────────────────────
  State            state: {}           state: () => ({})
  Getters          getters: {}         getters: {} / computed()
  Mutations        mutations: {}       ❌ YO'Q
  Actions          actions: {}         actions: {} / functions
  Modullar         modules: {}         ❌ Har bir store alohida
  Namespace        namespaced: true    ❌ Kerak emas
  TypeScript       zaif                mukammal
  Composition API  mapState helper     storeToRefs()
  DevTools         ✓                   ✓ (yaxshiroq)
  SSR              murakkab            sodda
  Hajm             ~5KB                ~1.5KB

═══════════════════════════════════════
  VUEX DAN PINIA GA KO'CHISH
═══════════════════════════════════════

Bosqichma-bosqich migration strategiyasi:

1-QADAM: Pinia o'rnatish (Vuex bilan birga ishlaydi)
  app.use(createPinia())
  // app.use(store) — Vuex hali ham ishlaydi

2-QADAM: Store-larni birma-bir ko'chirish
  Vuex module → Pinia store

  // Vuex module: store/modules/user.js
  export default {
    namespaced: true,
    state: () => ({ name: '', isLoggedIn: false }),
    mutations: {
      SET_NAME(state, name) { state.name = name },
      SET_LOGGED_IN(state, val) { state.isLoggedIn = val },
    },
    actions: {
      async login({ commit }, credentials) {
        const user = await api.login(credentials)
        commit('SET_NAME', user.name)
        commit('SET_LOGGED_IN', true)
      },
    },
    getters: {
      displayName: (state) => state.name || 'Mehmon',
    },
  }

  // Pinia store: stores/user-store.ts
  export const useUserStore = defineStore('user', () => {
    const name = ref('')
    const isLoggedIn = ref(false)
    const displayName = computed(() => name.value || 'Mehmon')

    async function login(credentials) {
      const user = await api.login(credentials)
      name.value = user.name
      isLoggedIn.value = true
    }

    return { name, isLoggedIn, displayName, login }
  })

3-QADAM: Komponentlarni yangilash
  // Vuex
  computed: {
    ...mapState('user', ['name']),
    ...mapGetters('user', ['displayName']),
  },
  methods: {
    ...mapActions('user', ['login']),
  }

  // Pinia
  const userStore = useUserStore()
  const { name, displayName } = storeToRefs(userStore)
  const { login } = userStore

4-QADAM: Vuex-ni olib tashlash

═══════════════════════════════════════
  NIMA UCHUN PINIA G'OLIB
═══════════════════════════════════════

1. Soddalik — mutations olib tashlash eng katta yutuq
2. TypeScript — to'liq avtomatik tipizatsiya
3. Hajm — 3x kichikroq bundle
4. DevTools — yaxshilangan debugging
5. Composition API — zamonaviy Vue bilan mos
6. SSR — server rendering osonroq
7. Plugin tizimi — kengaytirish sodda
8. Eduardo San Martin Morote (Vue Router muallifi) yaratgan — Vue core jamoasi

Evan You (Vue yaratuvchisi) rasman Pinia-ni Vuex 5 sifatida e'lon qildi.

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

Vuex → Pinia migratsiya = Redux → Zustand/Jotai migratsiyaga o'xshash.

Redux muammolari (Vuex bilan bir xil):
- Ko'p boilerplate (action types, action creators, reducers)
- String-based dispatch
- TypeScript qiyin

Redux Toolkit bu muammolarni QISMAN hal qildi (createSlice).
Lekin Zustand BUTUNLAY hal qildi — xuddi Pinia kabi sodda.

Zustand vs Pinia:
- Ikkalasi ham minimal API
- Ikkalasi ham TypeScript-first
- Pinia — Vue ekotizimiga integratsiyalashgan (DevTools, SSR, plugins)
- Zustand — framework-agnostic, React tashqarisida ham ishlaydi

Jotai/Recoil — atomik state, Vue-da bunga ekvivalent composable + ref() pattern.`,
  codeExamples: [
    {
      title: 'Vuex module → Pinia store migratsiya',
      language: 'ts',
      code: `// ══════ OLDIN: Vuex Module ══════
// store/modules/products.js
export default {
  namespaced: true,
  state: () => ({
    items: [],
    isLoading: false,
    error: null,
    selectedCategory: 'all',
  }),
  mutations: {
    SET_ITEMS(state, items) { state.items = items },
    SET_LOADING(state, val) { state.isLoading = val },
    SET_ERROR(state, error) { state.error = error },
    SET_CATEGORY(state, cat) { state.selectedCategory = cat },
  },
  actions: {
    async fetchProducts({ commit, state }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const res = await fetch(
          \`/api/products?cat=\${state.selectedCategory}\`
        )
        commit('SET_ITEMS', await res.json())
      } catch (e) {
        commit('SET_ERROR', e.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },
  },
  getters: {
    filteredItems: (state) =>
      state.selectedCategory === 'all'
        ? state.items
        : state.items.filter(i => i.category === state.selectedCategory),
    totalCount: (state) => state.items.length,
  },
}

// ══════ KEYIN: Pinia Store ══════
// stores/product-store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProductStore = defineStore('products', () => {
  const items = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedCategory = ref('all')

  const filteredItems = computed(() =>
    selectedCategory.value === 'all'
      ? items.value
      : items.value.filter(i => i.category === selectedCategory.value)
  )
  const totalCount = computed(() => items.value.length)

  async function fetchProducts() {
    isLoading.value = true
    error.value = null
    try {
      const res = await fetch(
        \`/api/products?cat=\${selectedCategory.value}\`
      )
      items.value = await res.json()
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      isLoading.value = false
    }
  }

  return {
    items, isLoading, error, selectedCategory,
    filteredItems, totalCount,
    fetchProducts,
  }
})`,
      description: 'Vuex module dan Pinia store ga ko\'chirish — mutations yo\'q, commit yo\'q, ancha sodda va TypeScript-friendly.',
    },
    {
      title: 'Komponent migratsiyasi — mapState/mapActions → Pinia',
      language: 'html',
      code: `<!-- ══════ OLDIN: Vuex bilan ══════ -->
<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('products', ['items', 'isLoading', 'error']),
    ...mapGetters('products', ['filteredItems', 'totalCount']),
  },
  methods: {
    ...mapActions('products', ['fetchProducts']),
  },
  created() {
    this.fetchProducts()
  },
}
</script>

<!-- ══════ KEYIN: Pinia bilan ══════ -->
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useProductStore } from '@/stores/product-store'

const productStore = useProductStore()

// State + Getters — reaktiv
const {
  items, isLoading, error,
  filteredItems, totalCount,
} = storeToRefs(productStore)

// Actions — oddiy destructure
const { fetchProducts } = productStore

// Lifecycle
onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div>
    <p v-if="isLoading">Yuklanmoqda...</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <template v-else>
      <p>Jami: {{ totalCount }}</p>
      <div v-for="item in filteredItems" :key="item.id">
        {{ item.name }} — {{ item.price }} so'm
      </div>
    </template>
  </div>
</template>`,
      description: 'mapState/mapGetters/mapActions → storeToRefs() + to\'g\'ridan-to\'g\'ri destructure. Composition API bilan ancha tozaroq.',
    },
    {
      title: 'Vuex modules → Pinia mustaqil store-lar',
      language: 'ts',
      code: `// ══════ OLDIN: Vuex nested modules ══════
// store/index.js
export default createStore({
  modules: {
    auth: {
      namespaced: true,
      modules: {
        user: userModule,     // auth/user/...
        permissions: permModule, // auth/permissions/...
      },
    },
    shop: {
      namespaced: true,
      modules: {
        cart: cartModule,      // shop/cart/...
        products: prodModule,  // shop/products/...
        orders: orderModule,   // shop/orders/...
      },
    },
  },
})

// Komponentda:
this.$store.dispatch('shop/cart/addItem', item)
this.$store.getters['auth/user/displayName']
this.$store.state.shop.orders.list

// ══════ KEYIN: Pinia flat store-lar ══════
// stores/auth-store.ts
export const useAuthStore = defineStore('auth', () => { ... })

// stores/user-store.ts
export const useUserStore = defineStore('user', () => { ... })

// stores/cart-store.ts
export const useCartStore = defineStore('cart', () => {
  const authStore = useAuthStore()  // Boshqa store-ga murojaat

  async function addItem(item: Product) {
    if (!authStore.isLoggedIn) throw new Error('Login qiling')
    items.value.push(item)
  }

  return { ... }
})

// stores/product-store.ts
export const useProductStore = defineStore('products', () => { ... })

// stores/order-store.ts
export const useOrderStore = defineStore('orders', () => { ... })

// Komponentda:
const cart = useCartStore()
cart.addItem(item)  // Sodda va type-safe!`,
      description: 'Vuex nested modules o\'rniga Pinia flat store-lar. Namespace string-lar yo\'q — to\'g\'ridan-to\'g\'ri import va ishlatish.',
    },
    {
      title: 'TypeScript: Vuex vs Pinia',
      language: 'ts',
      code: `// ══════ Vuex + TypeScript — MURAKKAB ══════
// Vuex-da to'liq typing uchun ko'p boilerplate kerak:
import { ActionTree, GetterTree, MutationTree } from 'vuex'

interface UserState {
  name: string
  token: string | null
}

const state: UserState = { name: '', token: null }

// Mutation types — string constant-lar
const SET_NAME = 'SET_NAME'
const SET_TOKEN = 'SET_TOKEN'

const mutations: MutationTree<UserState> = {
  [SET_NAME](state, name: string) { state.name = name },
  [SET_TOKEN](state, token: string | null) { state.token = token },
}

const actions: ActionTree<UserState, RootState> = {
  async login({ commit }, credentials: LoginPayload) {
    const data = await api.login(credentials)
    commit(SET_NAME, data.name)   // string — typo bo'lishi mumkin!
    commit(SET_TOKEN, data.token)
  },
}

// Komponentda — typing YO'Q:
this.$store.dispatch('user/login', creds)  // any qaytaradi

// ══════ Pinia + TypeScript — SODDA ══════
// Barcha type-lar AVTOMATIK:
export const useUserStore = defineStore('user', () => {
  const name = ref('')
  const token = ref<string | null>(null)

  async function login(credentials: LoginPayload) {
    const data = await api.login(credentials)
    name.value = data.name     // type-safe ✓
    token.value = data.token   // type-safe ✓
  }

  return { name, token, login }
})

// Komponentda — to'liq autocomplete:
const store = useUserStore()
store.login(creds)  // LoginPayload tipi kerak ✓
store.name          // string tipi ✓
store.token         // string | null tipi ✓`,
      description: 'Vuex-da TypeScript juda murakkab — ko\'p boilerplate, string-based commit. Pinia-da barcha tiplar avtomatik.',
    },
  ],
  interviewQA: [
    {
      question: 'Pinia-da nima uchun mutations yo\'q? Bu yaxshimi?',
      answer: `Vuex-da mutations DevTools-da state o'zgarishlarini kuzatish uchun zarur edi — faqat mutation orqali o'zgarish bo'lganda DevTools uni qayd qilardi. Pinia-da Vue 3 ning Proxy-based reaktivlik tizimi tufayli barcha state o'zgarishlar avtomatik kuzatiladi — mutations-ga ehtiyoj yo'q. Bu yaxshi chunki: 1) Boilerplate 2x kamayadi, 2) Asinxron logika oddiy (actions ichida mutation commit qilish shart emas), 3) TypeScript yaxshiroq ishlaydi. Kamchilik: katta jamoalarda state o'zgarishlarni markazlashtirish uchun intizom kerak — actions ishlatish tavsiya etiladi.`,
    },
    {
      question: 'Vuex dan Pinia ga qanday bosqichma-bosqich ko\'chish mumkin?',
      answer: `1) Pinia o'rnatish — Vuex bilan birga ishlaydi (ikkalasi ham plugin). 2) Eng sodda store-dan boshlash — mutations ni olib tashlash, state/getters/actions ni Pinia formatiga o'tkazish. 3) Komponentlarda mapState/mapGetters/mapActions ni storeToRefs() + destructure bilan almashtirish. 4) Nested modules ni flat store-larga aylantirish — har bir module alohida defineStore. 5) Store-lar orasidagi bog'liqlikni useXxxStore() orqali hal qilish. 6) Vuex-ni olib tashlash. Muhim: ikkalasi parallel ishlashi mumkin, shuning uchun birma-bir ko'chirish xavfsiz.`,
    },
    {
      question: 'Pinia da modules va namespaces nima uchun yo\'q?',
      answer: `Vuex-da barcha store bitta global store ichida edi — modules va namespaces bu global store-ni bo'laklarga bo'lish uchun kerak edi. Pinia-da har bir store MUSTAQIL — import qilib ishlatiladi, global store yo'q. Bu flat arxitektura afzalliklari: 1) Naming collision yo'q, 2) String-based path kerak emas (shop/cart/addItem), 3) Tree-shaking mumkin — ishlatilmagan store build-ga tushmaydi, 4) Code splitting osonroq, 5) Circular dependency kamroq. Store-lar orasida bog'liqlik kerak bo'lsa — useXxxStore() bilan to'g'ridan-to'g'ri import.`,
    },
    {
      question: 'Vuex 4 hali ham ishlatish mumkinmi? Qachon Pinia kerak emas?',
      answer: `Vuex 4 hali ham ishlaydi va qo'llab-quvvatlanadi (xavfsizlik yangilanishlari). Mavjud katta loyihalarni ko'chirishga shoshilish shart emas — agar ishlayotgan bo'lsa. Lekin YANGI loyihalar uchun Pinia tavsiya etiladi. Pinia kerak bo'lmaydigan holatlar: 1) Juda oddiy state — composable + ref() yetarli, 2) Server state — TanStack Query yaxshiroq, 3) Form state — VeeValidate yoki FormKit o'zi boshqaradi. Pinia faqat client-side global state uchun — bu yerda u eng yaxshi yechim.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-pinia', topicId: 'pinia-basics', label: 'Pinia Asoslari' },
    { techId: 'vue-js', sectionId: 'vue-pinia', topicId: 'pinia-advanced', label: 'Pinia Advanced' },
    { techId: 'vue-js', sectionId: 'vue-pinia', topicId: 'composable-stores', label: 'Composable Stores' },
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'vue-ecosystem', label: 'Vue Ekotizimi' },
  ],
}
