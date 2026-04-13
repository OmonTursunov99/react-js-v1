import type { Topic } from '../../../types'

export const vueVsReact: Topic = {
  id: 'vue-vs-react',
  title: 'Vue vs React',
  importance: 3,
  status: 'to-learn',
  description: 'Vue va React taqqoslash — reactivity, template, ecosystem',
  content: `Vue va React — ikkalasi ham komponent-asosli UI kutubxonalar, lekin arxitektura va falsafasi tubdan farq qiladi.

═══════════════════════════════════════
  REACTIVITY MODELI
═══════════════════════════════════════

Vue — Proxy-based fine-grained reactivity:
  1. ref() yoki reactive() bilan state yaratiladi
  2. Vue Proxy orqali har bir property-ni kuzatadi
  3. Faqat O'ZGARGAN property-ga bog'liq komponent qayta renderlanadi
  4. Dasturchi hech narsa qilishi shart emas — avtomatik

React — immutable state + re-render:
  1. useState/useReducer bilan state yaratiladi
  2. setState chaqirilganda BUTUN komponent qayta renderlanadi
  3. Bola komponentlar ham qayta renderlanadi (agar memo bo'lmasa)
  4. Optimallashtirish uchun memo, useMemo, useCallback kerak

MUHIM: Vue-da "keraksiz re-render" muammosi deyarli yo'q.
React-da bu eng katta performance muammo va memo/compiler kerak.

═══════════════════════════════════════
  TEMPLATE VS JSX
═══════════════════════════════════════

Vue template:
  - HTML-ga yaqin sintaksis (v-if, v-for, v-bind)
  - Compile vaqtida statik analiz va optimallashtirish
  - Compiler statik node-larni ko'taradi (hoisting)
  - IDE support: Volar plugin

React JSX:
  - JavaScript ichida HTML yozish
  - To'liq JavaScript kuchi (map, ternary, && operator)
  - Runtime da createElement() ga aylanadi
  - Compile-time optimallashtirish kam (React Compiler bilan o'zgarmoqda)

Vue template compiler statik va dinamik qismlarni ajratadi —
shuning uchun Vue virtual DOM diffing tezroq ishlaydi.

═══════════════════════════════════════
  TWO-WAY VS ONE-WAY BINDING
═══════════════════════════════════════

Vue — v-model (two-way binding):
  <input v-model="name" />
  - Bu qisqartma: :value="name" @input="name = $event.target.value"
  - Formlar bilan ishlash juda oson
  - Komponentlarda ham ishlaydi: defineModel()

React — one-way data flow:
  <input value={name} onChange={e => setName(e.target.value)} />
  - Har doim value + onChange yozish kerak
  - Ma'lumot faqat yuqoridan pastga oqadi
  - Kontrolli komponent pattern majburiy

═══════════════════════════════════════
  COMPOSITION API VS REACT HOOKS
═══════════════════════════════════════

O'xshashliklar:
  - Ikkalasi ham funksiya ichida logika yozish
  - Ikkalasi ham composable/custom hook orqali qayta ishlatish
  - Ikkalasi ham lifecycle-ga kirish imkonini beradi

Farqlar:
  1. Vue setup() — FAQAT 1 MARTA ishlaydi
     React component — HAR RENDERDA qayta ishlaydi
  2. Vue-da ref.value = yangiQiymat (mutatsiya)
     React-da setState(yangiQiymat) (immutable)
  3. Vue-da cleanup — onUnmounted ichida
     React-da cleanup — useEffect return funksiyasi
  4. Vue-da dependency tracking AVTOMATIK
     React-da dependency array QOLDA yoziladi

═══════════════════════════════════════
  ECOSYSTEM TAQQOSLASH
═══════════════════════════════════════

  Vazifa          | Vue              | React
  ────────────────|──────────────────|──────────────
  State mgmt      | Pinia            | Zustand/Redux
  Routing         | Vue Router       | React Router
  SSR/SSG         | Nuxt             | Next.js
  Meta-framework  | Nuxt 3           | Next.js 14+
  Form            | VeeValidate      | React Hook Form
  Testing         | Vue Test Utils   | RTL
  DevTools        | Vue DevTools     | React DevTools

═══════════════════════════════════════
  PERFORMANCE FARQLARI
═══════════════════════════════════════

Vue afzalliklari:
  - Fine-grained reactivity — faqat kerakli joy yangilanadi
  - Template compiler optimallashtirish
  - Kichikroq bundle size (~33KB vs ~42KB gzipped)

React afzalliklari:
  - React Compiler (avtomatik memoization)
  - Concurrent features (Suspense, useTransition)
  - Server Components (zero JS on client)
  - Kattaroq ekosistem va community`,
  codeExamples: [
    {
      title: 'Reactivity — Vue vs React',
      language: 'ts',
      code: `// ═══ VUE — Proxy-based reactivity ═══
import { ref, computed, watch } from "vue"

const count = ref(0)
const doubled = computed(() => count.value * 2)

// Avtomatik tracking — dependency array kerak emas
watch(count, (newVal, oldVal) => {
  console.log("count o'zgardi:", oldVal, "->", newVal)
})

count.value++ // doubled avtomatik yangilanadi


// ═══ REACT — Immutable state ═══
import { useState, useMemo, useEffect } from "react"

function Counter() {
  const [count, setCount] = useState(0)
  const doubled = useMemo(() => count * 2, [count]) // dependency!

  useEffect(() => {
    console.log("count o'zgardi:", count)
  }, [count]) // dependency array QOLDA

  return <button onClick={() => setCount(c => c + 1)}>{doubled}</button>
}`,
      description: 'Vue-da dependency avtomatik kuzatiladi. React-da dependency array qolda yoziladi.',
    },
    {
      title: 'Component yaratish — Vue SFC vs React',
      language: 'ts',
      code: `// ═══ VUE — Single File Component (SFC) ═══
// UserCard.vue
// <script setup lang="ts">
// import { defineProps, defineEmits } from "vue"
//
// interface Props {
//   name: string
//   age: number
// }
// const props = defineProps<Props>()
// const emit = defineEmits<{ update: [name: string] }>()
// </script>
//
// <template>
//   <div class="card">
//     <h2>{{ name }}</h2>
//     <p>Yosh: {{ age }}</p>
//     <button @click="emit('update', name)">Yangilash</button>
//   </div>
// </template>


// ═══ REACT — Function Component ═══
interface UserCardProps {
  name: string
  age: number
  onUpdate: (name: string) => void
}

function UserCard({ name, age, onUpdate }: UserCardProps) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Yosh: {age}</p>
      <button onClick={() => onUpdate(name)}>Yangilash</button>
    </div>
  )
}`,
      description: 'Vue SFC 3 qismdan iborat: script, template, style. React-da hammasi bitta funksiyada.',
    },
    {
      title: 'Two-way binding — v-model vs controlled input',
      language: 'ts',
      code: `// ═══ VUE — v-model (2 qator) ═══
// <script setup>
// import { ref } from "vue"
// const name = ref("")
// const agreed = ref(false)
// </script>
//
// <template>
//   <input v-model="name" />
//   <input type="checkbox" v-model="agreed" />
//   <p>{{ name }} — {{ agreed }}</p>
// </template>


// ═══ REACT — controlled component (ko'proq kod) ═══
import { useState } from "react"

function Form() {
  const [name, setName] = useState("")
  const [agreed, setAgreed] = useState(false)

  return (
    <>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input
        type="checkbox"
        checked={agreed}
        onChange={e => setAgreed(e.target.checked)}
      />
      <p>{name} — {String(agreed)}</p>
    </>
  )
}`,
      description: 'Vue v-model bitta directive bilan ikki tomonlama bog`lash. React-da value + onChange qolda yoziladi.',
    },
    {
      title: 'State management — Pinia vs Zustand',
      language: 'ts',
      code: `// ═══ PINIA (Vue) ═══
import { defineStore } from "pinia"

export const useCounterStore = defineStore("counter", () => {
  const count = ref(0)
  const doubled = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  return { count, doubled, increment }
})

// Komponentda:
// const store = useCounterStore()
// store.count, store.increment()


// ═══ ZUSTAND (React) ═══
import { create } from "zustand"

interface CounterState {
  count: number
  increment: () => void
}

const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}))

// Komponentda:
// const count = useCounterStore(s => s.count)
// const increment = useCounterStore(s => s.increment)`,
      description: 'Pinia — Vue uchun rasmiy state manager. Zustand — React uchun minimal store. Ikkalasi ham lightweight.',
    },
    {
      title: 'Lifecycle — Vue vs React',
      language: 'ts',
      code: `// ═══ VUE LIFECYCLE ═══
import { onMounted, onUpdated, onUnmounted, ref } from "vue"

// setup() — FAQAT 1 MARTA ishlaydi
const data = ref<string | null>(null)

onMounted(() => {
  // DOM tayyor — fetch, subscription
  console.log("Komponent DOM ga qo'shildi")
  const id = setInterval(() => console.log("tick"), 1000)

  // Cleanup
  onUnmounted(() => {
    clearInterval(id)
    console.log("Komponent olib tashlandi")
  })
})

onUpdated(() => {
  console.log("Komponent yangilandi")
})


// ═══ REACT LIFECYCLE ═══
import { useState, useEffect } from "react"

function MyComponent() {
  const [data, setData] = useState<string | null>(null)

  // HAR RENDERDA ishlaydi (setup emas!)
  useEffect(() => {
    // Mount
    console.log("Komponent DOM ga qo'shildi")
    const id = setInterval(() => console.log("tick"), 1000)

    // Cleanup — unmount VA har re-render da
    return () => {
      clearInterval(id)
      console.log("Cleanup")
    }
  }, []) // [] = faqat mount/unmount

  return <div>{data}</div>
}`,
      description: 'Vue setup 1 marta ishlaydi, lifecycle hooklar aniq. React useEffect har renderda ishlashi mumkin.',
    },
  ],
  interviewQA: [
    {
      question: 'Vue va React-ning reactivity modellari qanday farq qiladi?',
      answer: `Vue Proxy-based fine-grained reactivity ishlatadi — har bir property kuzatiladi va faqat o'sha property-ga bog'liq komponent yangilanadi. React immutable state + top-down re-render ishlatadi — setState chaqirilganda butun komponent daraxti qayta renderlanadi. Vue-da optimallashtirish avtomatik, React-da memo, useMemo, useCallback qolda ishlatiladi. React Compiler bu gapni o'zgartirmoqda, lekin Vue-ning modeli tabiatan samaraliroq.`,
    },
    {
      question: 'Vue template va React JSX farqi nimada? Qaysi biri yaxshiroq?',
      answer: `Vue template — HTML-ga yaqin, compile vaqtida optimallashtirish imkonini beradi. Compiler statik va dinamik qismlarni ajratadi, statik node-larni ko'taradi (hoisting). JSX — to'liq JavaScript kuchi, map/filter/ternary ishlatish mumkin, lekin compile-time optimallashtirish kam. Performance jihatidan Vue template ustun (chunki compiler ko'proq ma'lumotga ega). Flexibility jihatidan JSX ustun (chunki bu oddiy JavaScript). Tanlov — loyiha va jamoa tajribasiga bog'liq.`,
    },
    {
      question: 'Composition API va React Hooks o`xshash ko`rinadi. Asosiy farqlari nima?',
      answer: `Eng katta farq — Vue setup() FAQAT 1 MARTA ishlaydi, React komponent funksiyasi HAR RENDERDA qayta ishlaydi. Buning oqibatlari: 1) Vue-da closure muammosi yo'q — ref har doim eng yangi qiymatni beradi. React-da stale closure xavfi bor. 2) Vue-da dependency tracking avtomatik (Proxy orqali). React-da dependency array qolda yoziladi — xato qilish oson. 3) Vue-da computed() natijani cache qiladi. React useMemo dependency array bilan ishlaydi. 4) Vue watchers aniq, React useEffect ko'p vazifani bajaradi.`,
    },
    {
      question: 'Vue-dan React-ga o`tgan dasturchi nimalarni bilishi kerak?',
      answer: `1) Immutability — Vue-da obj.prop = val mumkin, React-da setState({...obj, prop: val}) kerak. 2) Controlled components — Vue v-model bor, React-da value+onChange qolda. 3) Memoization — Vue avtomatik, React-da memo/useMemo/useCallback kerak. 4) useEffect — Vue-dagi watch + onMounted + onUnmounted birlashgani. Dependency array tushunchasi React-ga xos. 5) JSX — template o'rniga JavaScript ichida HTML. 6) Key prop — v-for :key kabi, lekin React-da batafsilroq ahamiyat kasb etadi.`,
    },
    {
      question: 'Performance jihatidan Vue va React qanday taqqoslanadi?',
      answer: `Vue afzalliklari: fine-grained reactivity (faqat kerakli joy yangilanadi), template compiler hoisting, kichikroq bundle. React afzalliklari: Concurrent Mode (useTransition, Suspense), Server Components (nol JS clientda), React Compiler (avtomatik memoization). Kichik/o'rta loyihalarda Vue tezroq ishlaydi (kamroq optimallashtirish kerak). Katta loyihalarda React Concurrent features ustunlik beradi. Amalda ikkalasi ham yetarlicha tez — bottleneck odatda framework emas, dasturchi kodida.`,
    },
    {
      question: 'Vue va React ekosistemlarini taqqoslang. Qaysi biri yaxshiroq?',
      answer: `Vue ekosistem — rasmiy va yaxlit: Vue Router, Pinia, Nuxt, VitePress — hammasi rasmiy va uyg'un ishlaydi. React ekosistem — katta va xilma-xil: routing uchun React Router/TanStack Router, state uchun Redux/Zustand/Jotai/Recoil, SSR uchun Next.js/Remix. Vue-ning afzalligi — "battery included", tanlov stressi kam. React-ning afzalligi — ko'proq tanlov, kattaroq community, ko'proq ish o'rinlari. Korporativ dunyo React-ga moyil, lekin Vue ham Alibaba, GitLab kabi katta loyihalarda ishlatiladi.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'performance', label: 'Vue Performance' },
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'teleport-suspense', label: 'Teleport, Suspense, KeepAlive' },
    { techId: 'react-js', sectionId: 'react-core', topicId: 'use-state', label: 'React useState' },
  ],
}
