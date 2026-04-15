import type { Topic } from '../../../types'

export const vue2VsVue3: Topic = {
  id: 'vue2-vs-vue3',
  title: 'Vue 2 vs Vue 3',
  importance: 3,
  status: 'to-learn',
  description: 'Vue 2 dan Vue 3 ga o\'tish — asosiy farqlar, yangi API-lar, migratsiya strategiyasi',
  content: `Vue 3 — to'liq qayta yozilgan framework. Vue 2 dan farqlar nafaqat API, balki arxitektura va ichki ishlash mexanizmida.

═══════════════════════════════════════
  ASOSIY ARXITEKTURA FARQLARI
═══════════════════════════════════════

Vue 2:
- Object.defineProperty — reaktivlik
- Options API — yagona yondashuv
- new Vue() — global instance
- Monolitik build — barcha API global
- Mixins — logika qayta ishlatish

Vue 3:
- Proxy API — reaktivlik (to'liq lazy, Map/Set qo'llab-quvvatlash)
- Composition API + Options API — tanlash mumkin
- createApp() — izolyatsiyalangan instance
- Tree-shakeable — faqat ishlatilgan API import
- Composables — logika qayta ishlatish

═══════════════════════════════════════
  COMPOSITION API (YANGI)
═══════════════════════════════════════

Vue 2 — Options API faqat:
  export default { data, computed, methods, watch, mounted... }
  Muammo: bitta feature kodi 4-5 joyga tarqaladi

Vue 3 — Composition API:
  <script setup> ichida barcha logika birga
  ref(), reactive(), computed(), watch(), onMounted()...
  AFZALLIK: feature bo'yicha guruhlanadi, TypeScript yaxshi qo'llab-quvvat

═══════════════════════════════════════
  REAKTIVLIK TIZIMI
═══════════════════════════════════════

Vue 2 — Object.defineProperty:
- Yangi xususiyat kuzatilMAS → Vue.set(obj, key, val) kerak
- Array index o'zgarishi kuzatilMAS → Vue.set(arr, i, val)
- Ob'ekt xususiyatini o'chirish → Vue.delete() kerak
- Barcha xususiyatlar darhol o'raladi (katta ob'ektda SEKIN)

Vue 3 — Proxy:
- Yangi xususiyat AVTOMATIK kuzatiladi
- Array o'zgarishlari AVTOMATIK
- delete operatori ishlaydi
- Lazy tracking — faqat o'qilgan xususiyatlar track qilinadi
- Map, Set, WeakMap, WeakSet qo'llab-quvvatlash

═══════════════════════════════════════
  FRAGMENTS, TELEPORT, SUSPENSE
═══════════════════════════════════════

Vue 2: template-da bitta root element SHART
  <template><div>...hamma narsa shu ichida...</div></template>

Vue 3 — Fragments: bir nechta root element
  <template><h1>Title</h1><p>Text</p></template>

Teleport — DOM-ning boshqa joyiga render:
  <Teleport to="body"><Modal /></Teleport>

Suspense — async komponentni kutish (experimental):
  <Suspense><AsyncComponent /><template #fallback>Loading...</template></Suspense>

═══════════════════════════════════════
  v-model O'ZGARISHLARI
═══════════════════════════════════════

Vue 2:
- v-model = :value + @input (bitta)
- .sync modifikator = :prop.sync (ikkinchi two-way)

Vue 3:
- v-model = :modelValue + @update:modelValue
- Bir nechta v-model: v-model:title="t" v-model:body="b"
- .sync O'CHIRILDI — v-model bilan almashtirildi

═══════════════════════════════════════
  GLOBAL API O'ZGARISHLARI
═══════════════════════════════════════

Vue 2 — Global mutation:
  Vue.component('MyComp', {...})    // GLOBAL
  Vue.directive('focus', {...})     // GLOBAL
  Vue.mixin({...})                  // GLOBAL — nojo'ya ta'sir

Vue 3 — Instance-based:
  const app = createApp(App)
  app.component('MyComp', {...})    // FAQAT shu app
  app.directive('focus', {...})     // izolyatsiyalangan
  app.use(router)                   // plugin ham instance-ga

Afzallik: bir nechta app bir sahifada, test izolyatsiyasi

═══════════════════════════════════════
  PERFORMANCE YAXSHILANISHLARI
═══════════════════════════════════════

- Bundle o'lchami: ~41% kichikroq (tree-shaking tufayli)
- Initial render: ~55% tezroq
- Update: ~133% tezroq
- Xotira: ~54% kam ishlatadi
- Template compiler optimizatsiyalari (static hoisting, patch flags)
- Proxy lazy tracking — katta ob'ektlarda sezilarli farq

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

Vue 2 → Vue 3 migratsiya React-da class → hooks o'tishga o'xshaydi:
- Vue 2 Options API ≈ React class components
- Vue 3 Composition API ≈ React Hooks
- Vue 2 mixins ≈ React HOC/render props
- Vue 3 composables ≈ React custom hooks

FARQ: Vue 3 Options API-ni HAM qo'llab-quvvatlaydi, React class-lardan to'liq voz kechmadi lekin hooks tavsiya etiladi.`,
  codeExamples: [
    {
      title: 'Options API (Vue 2) vs Composition API (Vue 3)',
      language: 'html',
      code: `<!-- Vue 2 — Options API -->
<script>
export default {
  data() {
    return {
      count: 0,
      name: 'Vue 2',
    }
  },
  computed: {
    doubled() {
      return this.count * 2
    },
  },
  methods: {
    increment() {
      this.count++
    },
  },
  watch: {
    count(newVal) {
      console.log('Count:', newVal)
    },
  },
  mounted() {
    console.log('Component mounted')
  },
}
</script>

<!-- Vue 3 — Composition API (script setup) -->
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

const count = ref(0)
const name = ref('Vue 3')

const doubled = computed(() => count.value * 2)

function increment() {
  count.value++
}

watch(count, (newVal) => {
  console.log('Count:', newVal)
})

onMounted(() => {
  console.log('Component mounted')
})
</script>`,
      description: 'Options API — this kontekst, data/computed/methods/watch bo\'limlari. Composition API — import qilish, ref/computed/watch, this YO\'Q.',
    },
    {
      title: 'Reaktivlik farqi — Vue 2 muammolari',
      language: 'html',
      code: `<!-- Vue 2 — reaktivlik cheklovlari -->
<script>
export default {
  data() {
    return {
      user: { name: 'Ali', age: 25 },
      items: ['a', 'b', 'c'],
    }
  },
  methods: {
    addProperty() {
      // ISHLAMAYDI — yangi xususiyat kuzatilmaydi!
      this.user.email = 'ali@mail.com'

      // TO'G'RI — Vue.set() ishlatish kerak
      this.$set(this.user, 'email', 'ali@mail.com')
    },
    updateArray() {
      // ISHLAMAYDI — index orqali o'zgartirish
      this.items[0] = 'x'

      // TO'G'RI — Vue.set() yoki splice()
      this.$set(this.items, 0, 'x')
      // yoki
      this.items.splice(0, 1, 'x')
    },
  },
}
</script>

<!-- Vue 3 — hammasi ishlaydi! -->
<script setup lang="ts">
import { reactive } from 'vue'

const user = reactive({ name: 'Ali', age: 25 })
const items = reactive(['a', 'b', 'c'])

function addProperty() {
  user.email = 'ali@mail.com'    // ISHLAYDI — Proxy tufayli
}

function updateArray() {
  items[0] = 'x'                 // ISHLAYDI — Proxy tufayli
}
</script>`,
      description: 'Vue 2 Object.defineProperty cheklovlari vs Vue 3 Proxy — yangi xususiyat va array index muammolari yo\'q.',
    },
    {
      title: 'v-model o\'zgarishlari va createApp',
      language: 'html',
      code: `<!-- Vue 2 — v-model va .sync -->
<!-- CustomInput.vue (Vue 2) -->
<script>
export default {
  props: ['value', 'title'],
  methods: {
    onInput(e) {
      this.$emit('input', e.target.value)   // v-model uchun
      this.$emit('update:title', newTitle)   // .sync uchun
    },
  },
}
</script>
<!-- Ishlatish: <CustomInput v-model="text" :title.sync="heading" /> -->

<!-- Vue 3 — bir nechta v-model -->
<!-- CustomInput.vue (Vue 3) -->
<script setup lang="ts">
defineProps<{
  modelValue: string
  title: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:title': [value: string]
}>()
</script>

<template>
  <input
    :value="modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
  <input
    :value="title"
    @input="emit('update:title', ($event.target as HTMLInputElement).value)"
  />
</template>
<!-- Ishlatish: <CustomInput v-model="text" v-model:title="heading" /> -->

<!-- createApp — izolyatsiyalangan instance -->
<script>
// Vue 2
// Vue.component('MyComp', {...})  // Global — hammaga ta'sir
// new Vue({ render: h => h(App) }).$mount('#app')

// Vue 3
import { createApp } from 'vue'
import App from './App.vue'

const app1 = createApp(App)
app1.component('MyComp', MyComp)  // Faqat app1 uchun
app1.mount('#app1')

const app2 = createApp(App)       // Boshqa izolyatsiyalangan app
app2.mount('#app2')
</script>`,
      description: 'Vue 3 — .sync o\'rniga bir nechta v-model, createApp() bilan izolyatsiyalangan app instance-lar.',
    },
  ],
  interviewQA: [
    {
      question: 'Vue 2 dan Vue 3 ga o\'tishda eng muhim farqlarni ayting.',
      answer: `1) Reaktivlik: defineProperty -> Proxy (yangi xususiyat/array index muammosi yo'q). 2) Composition API — logikani feature bo'yicha guruhlovchi yangi yondashuv. 3) createApp() — global mutation o'rniga izolyatsiyalangan instance. 4) Fragments — bir nechta root element. 5) Teleport — DOM boshqa joyiga render. 6) v-model o'zgarishi — modelValue + bir nechta v-model. 7) Tree-shaking — bundle 41% kichik. 8) TypeScript — to'liq qayta yozilgan, native TS qo'llab-quvvatlash.`,
    },
    {
      question: 'Vue 2 reaktivlik muammolarini aytib bering. Vue 3 qanday hal qildi?',
      answer: `Vue 2 Object.defineProperty cheklovlari: 1) obj.newKey = val — kuzatilmas, Vue.set() kerak. 2) arr[0] = x — kuzatilmas, Vue.set() yoki splice() kerak. 3) delete obj.key — kuzatilmas, Vue.delete() kerak. 4) Ob'ekt yaratilganda BARCHA xususiyatlar rekursiv o'raladi — katta ob'ektda sekin. Vue 3 Proxy bilan: hammasi AVTOMATIK — yangi xususiyat, array index, delete. Lazy tracking — faqat o'qilgan xususiyatlar track qilinadi. Map/Set/WeakMap qo'llab-quvvatlash. Kamchilik — IE11 qo'llab-quvvatlanmaydi.`,
    },
    {
      question: 'Mixins nima uchun muammo va composables qanday hal qiladi?',
      answer: `Mixins muammolari: 1) Naming collision — ikkita mixin bir xil data/method nom ishlatsa, oxirgi yutadi. 2) Noaniq manba — this.count qayerdan keldi? Komponentdanmi? Qaysi mixindanmi? 3) Implicit dependency — mixin komponent data-siga bog'liq bo'lishi mumkin. Composables (Vue 3): 1) Aniq import — const { count } = useCounter(). 2) Namespace collision YO'Q — o'zgaruvchi nomini o'zgartirish mumkin. 3) TypeScript to'liq qo'llab-quvvatlaydi. 4) Tree-shakeable. Bu React custom hooks bilan bir xil yondashuv.`,
    },
    {
      question: 'Vue 3 Fragments nima va nima uchun kerak?',
      answer: `Vue 2 da template ichida BITTA root element SHART edi — <template><div>...hamma narsa shu ichida...</div></template>. Bu keraksiz div qo'shishga majbur qilardi, CSS layout buzilishi mumkin edi. Vue 3 Fragments — bir nechta root element: <template><h1>Title</h1><p>Text</p><footer>End</footer></template>. Bu React Fragments (<>...</>) bilan bir xil. Ichki ishlash: compiler bir nechta root VNode yaratadi, Fragment VNode bilan o'raydi.`,
    },
    {
      question: 'createApp() va new Vue() farqi nima? Nima uchun o\'zgartirildi?',
      answer: `Vue 2: new Vue() global instance, Vue.component/directive/mixin GLOBAL — barcha app-larga ta'sir qiladi. Test yozish qiyin — global state muammo. Bir sahifada bir nechta Vue app bo'lsa, global o'zgarishlar hammaga ta'sir qiladi. Vue 3: createApp(App) — har bir app IZOLYATSIYALANGAN. app.component() faqat shu app uchun. Plugin-lar (router, pinia) ham instance-ga ulanadi. Test yozish oson — har bir test o'z app yaratadi. Microfrontend-lar uchun bir sahifada bir nechta izolyatsiyalangan Vue app ishlashi mumkin.`,
    },
    {
      question: 'Vue 3 performance yaxshilanishlarini texnik jihatdan tushuntiring.',
      answer: `1) Tree-shaking: Vue 2 da barcha API global (Vue.nextTick), Vue 3 da named import (import { nextTick }). Ishlatilmagan API bundle-ga tushmaydi — ~41% kichik. 2) Proxy lazy tracking: defineProperty hamma xususiyatni darhol o'raydi, Proxy faqat O'QILGANLARNI track qiladi. 3) Template compiler optimizatsiyalari: static hoisting — o'zgarmas VNode bir marta yaratiladi, har renderda qayta yaratilmaydi. Patch flags — qaysi attribute dinamik ekanligini belgilaydi, diff tezlashadi. Block tree — dinamik node-larni flat array qiladi. 4) Xotira: VNode tuzilmasi optimallashtirilgan — ~54% kam xotira.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'reactivity-theory', label: 'Reaktivlik nazariyasi' },
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'options-vs-composition', label: 'Options vs Composition' },
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'compiler-optimizations', label: 'Compiler optimizatsiyalari' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'composition-api', label: 'Composition API' },
  ],
}
