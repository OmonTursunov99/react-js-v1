import type { Topic } from '../../../types'

export const compositionApi: Topic = {
  id: 'composition-api',
  title: 'Composition API',
  importance: 3,
  status: 'to-learn',
  description: 'ref, reactive, computed, watch, watchEffect — Vue 3 ning asosiy reaktivlik tizimi',
  content: `Composition API — Vue 3 da joriy qilingan yangi yondashuv bo'lib, komponent logikasini funksional tarzda yozish imkonini beradi. Options API dan farqli ravishda, bu yerda logika mantiqiy guruhlar bo'yicha tashkil etiladi.

═══════════════════════════════════════
  ref() VA reactive()
═══════════════════════════════════════

ref() — primitiv qiymatlar (string, number, boolean) uchun reaktiv havola yaratadi.
reactive() — object va array uchun reaktiv proxy yaratadi.

  const count = ref(0)           // RefImpl { value: 0 }
  count.value++                  // template-da avtomatik unwrap

  const state = reactive({       // Proxy { name: 'Ali', age: 25 }
    name: 'Ali',
    age: 25,
  })
  state.name = 'Vali'           // .value kerak EMAS

MUHIM FARQ:
- ref() — .value orqali foydalaniladi (template-da avtomatik)
- reactive() — to'g'ridan-to'g'ri property-larga murojaat
- reactive() — primitiv qiymatga ISHLAMAYDI
- reactive() — destructure qilinganda reaktivlik YO'QOLADI

═══════════════════════════════════════
  computed()
═══════════════════════════════════════

computed() — boshqa reaktiv qiymatlardan HISOBLANGAN qiymat yaratadi.
Dependency-lar o'zgargandagina qayta hisoblanadi (keshlanadi).

  const firstName = ref('Ali')
  const lastName = ref('Valiyev')
  const fullName = computed(() => firstName.value + ' ' + lastName.value)

Writable computed:
  const fullName = computed({
    get: () => firstName.value + ' ' + lastName.value,
    set: (val) => {
      const [first, last] = val.split(' ')
      firstName.value = first
      lastName.value = last
    }
  })

═══════════════════════════════════════
  watch() VA watchEffect()
═══════════════════════════════════════

watch() — ma'lum bir qiymatni kuzatadi, eski va yangi qiymatni beradi:

  watch(count, (newVal, oldVal) => {
    console.log(oldVal, '->', newVal)
  })

  // Bir nechta manbani kuzatish:
  watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
    console.log('Ism o\\'zgardi')
  })

watchEffect() — ichidagi barcha reaktiv dependency-larni AVTOMATIK kuzatadi:

  watchEffect(() => {
    console.log('Count:', count.value)    // count o'zgarganda ishlaydi
    console.log('Name:', state.name)      // state.name o'zgarganda ham ishlaydi
  })

FARQ: watch() — aniq manba, lazy (birinchi render-da ishlamaydi)
      watchEffect() — avtomatik dependency, darhol ishlaydi

═══════════════════════════════════════
  setup() FUNKSIYASI
═══════════════════════════════════════

Composition API ikki usulda ishlatiladi:

1. <script setup> (tavsiya etiladi):
   <script setup lang="ts">
   const count = ref(0)
   </script>

2. setup() funksiyasi:
   export default {
     setup() {
       const count = ref(0)
       return { count }
     }
   }

<script setup> — kamroq boilerplate, avtomatik return, yaxshiroq TypeScript qo'llab-quvvatlash.

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React: useState + useEffect — har renderda qayta chaqiriladi
Vue: ref + watch — faqat setup() bir marta chaqiriladi, keyin reaktivlik tizimi ishlaydi

React-da stale closure muammosi bor (useEffect dependency array)
Vue-da bunday muammo YO'Q — Proxy orqali dependency avtomatik kuzatiladi`,
  codeExamples: [
    {
      title: 'ref va reactive asosiy ishlatish',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// Primitiv uchun ref
const count = ref(0)
const message = ref('Salom')

// Object uchun reactive
const user = reactive({
  name: 'Ali',
  age: 25,
  skills: ['Vue', 'TypeScript'],
})

// Computed — avtomatik keshlanadi
const doubleCount = computed(() => count.value * 2)
const greeting = computed(() => \`\${message.value}, \${user.name}!\`)

function increment() {
  count.value++
}

function addSkill(skill: string) {
  user.skills.push(skill)  // reactive — to'g'ridan-to'g'ri mutatsiya mumkin
}
</script>

<template>
  <div>
    <p>Count: {{ count }} | Double: {{ doubleCount }}</p>
    <button @click="increment">+1</button>

    <p>{{ greeting }}</p>
    <ul>
      <li v-for="skill in user.skills" :key="skill">{{ skill }}</li>
    </ul>
    <button @click="addSkill('Nuxt')">Skill qo'shish</button>
  </div>
</template>`,
      description: 'ref() primitiv qiymatlar uchun, reactive() objectlar uchun. computed() avtomatik dependency tracking bilan keshlanadi.',
    },
    {
      title: 'watch va watchEffect',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'

const searchQuery = ref('')
const results = ref<string[]>([])
const isLoading = ref(false)

// watch — aniq manba, debounce bilan
watch(searchQuery, async (newQuery, oldQuery) => {
  console.log(\`"\${oldQuery}" -> "\${newQuery}"\`)

  if (newQuery.length < 3) {
    results.value = []
    return
  }

  isLoading.value = true
  // API chaqiruv simulatsiyasi
  results.value = await fetchResults(newQuery)
  isLoading.value = false
}, {
  debounce: 300,   // Vue 3.5+ — built-in debounce
  // immediate: true — darhol ham ishlashi uchun
})

// watchEffect — dependency avtomatik aniqlanadi
watchEffect(() => {
  // searchQuery.value va isLoading.value o'zgarganda avtomatik ishlaydi
  document.title = isLoading.value
    ? 'Qidirilmoqda...'
    : \`Natijalar: \${searchQuery.value}\`
})

// watchEffect cleanup
watchEffect((onCleanup) => {
  const controller = new AbortController()

  fetch(\`/api/search?q=\${searchQuery.value}\`, {
    signal: controller.signal,
  })

  onCleanup(() => {
    controller.abort()  // oldingi so'rovni bekor qilish
  })
})

async function fetchResults(query: string): Promise<string[]> {
  return ['Natija 1', 'Natija 2']
}
</script>`,
      description: 'watch() — aniq kuzatish, eski/yangi qiymat olish. watchEffect() — avtomatik dependency, darhol ishlaydi. onCleanup — tozalash funksiyasi.',
    },
    {
      title: 'reactive vs ref — to\'g\'ri tanlash',
      language: 'ts',
      code: `import { ref, reactive, toRefs, toRef } from 'vue'

// ========== ref() tavsiya etiladi ==========

// 1. Primitiv qiymatlar — FAQAT ref
const count = ref(0)
const name = ref('Ali')
const isOpen = ref(false)

// 2. Nullable qiymatlar — ref yaxshiroq
const user = ref<{ name: string } | null>(null)
user.value = { name: 'Ali' }
user.value = null  // muammosiz

// ========== reactive() ehtiyot bo'ling ==========

const state = reactive({ x: 0, y: 0 })

// XATO — reaktivlik yo'qoladi:
let { x, y } = state       // x, y oddiy number bo'lib qoladi
const newState = { ...state } // spread ham reaktivlikni yo'qotadi

// TO'G'RI — toRefs ishlatish:
const { x: refX, y: refY } = toRefs(state)  // ref() ga o'raladi
const singleRef = toRef(state, 'x')          // bitta property

// ========== Amaliy qoida ==========
// DOIM ref() ishlatish tavsiya etiladi
// reactive() faqat ichki state uchun (qaytarmaslik sharti bilan)`,
      description: 'ref() — universal va xavfsiz. reactive() — destructure va reassign muammolari bor. toRefs() — reactive dan ref() larga o\'tish.',
    },
  ],
  interviewQA: [
    {
      question: 'ref() va reactive() farqi nima? Qachon qaysi biri ishlatiladi?',
      answer: `ref() — har qanday turdagi qiymat uchun ishlaydi, .value orqali foydalaniladi, template-da avtomatik unwrap bo'ladi. reactive() — faqat object/array uchun, to'g'ridan-to'g'ri property-larga murojaat qilish mumkin, lekin destructure qilinganda reaktivlik yo'qoladi. Amaliyotda ref() ko'proq tavsiya etiladi chunki u universal, reassign mumkin, va TypeScript bilan yaxshi ishlaydi. reactive() ichki state uchun ishlatiladi.`,
    },
    {
      question: 'Vue 3 reaktivlik tizimi qanday ishlaydi?',
      answer: `Vue 3 JavaScript Proxy API-dan foydalanadi. reactive() chaqirilganda Vue object atrofida Proxy yaratadi. Bu Proxy get/set trap-lar orqali property-ga murojaat va o'zgarishlarni kuzatadi. ref() esa RefImpl class yaratadi — .value property-sida getter/setter orqali tracking ishlaydi. Dependency tracking: getter chaqirilganda — effect (component render, watch, computed) ro'yxatga olinadi. Setter chaqirilganda — barcha tegishli effect-lar qayta ishga tushiriladi. Vue 2 da Object.defineProperty ishlatilgan — yangi property qo'shish kuzatilmas edi, Vue 3 Proxy bilan bu muammo hal bo'ldi.`,
    },
    {
      question: 'computed() va oddiy funksiya farqi nima?',
      answer: `computed() keshlanadi — dependency o'zgarmasa, qayta hisoblanMAYDI, eski natijani qaytaradi. Oddiy funksiya esa har render/chaqiruvda qayta ishlaydi. computed() ichida side-effect (API call, DOM o'zgartirish) qilmaslik kerak — u faqat hisoblash uchun. Agar side-effect kerak bo'lsa — watch() yoki watchEffect() ishlatiladi. computed() writable ham bo'lishi mumkin (get/set bilan).`,
    },
    {
      question: 'watch() va watchEffect() qachon ishlatiladi?',
      answer: `watch() — aniq bir qiymatni kuzatish kerak bo'lganda, eski va yangi qiymatni solishtirish kerak bo'lganda, lazy bo'lishi kerak bo'lganda (birinchi renderda ishlamaslik). watchEffect() — dependency-larni qo'lda ko'rsatishni xohlamasangiz, darhol ishga tushishi kerak bo'lganda, bir nechta reaktiv qiymatga bog'liq bo'lganda. React useEffect ga o'xshash, lekin dependency array kerak EMAS — avtomatik tracking.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'lifecycle', label: 'Lifecycle Hooks' },
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'reactivity-deep', label: 'Reaktivlik chuqur' },
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'composables', label: 'Composables' },
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'vue-vs-react', label: 'Vue vs React' },
  ],
}
