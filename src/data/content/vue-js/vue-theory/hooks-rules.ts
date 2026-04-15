import type { Topic } from '../../../types'

export const hooksRules: Topic = {
  id: 'hooks-rules',
  title: 'Composition API Rules',
  importance: 2,
  status: 'to-learn',
  description: 'Composition API qoidalari — composable chaqirish joyi, async setup, sinxron cheklovlar',
  content: `Vue Composition API-ning o'z qoidalari bor — React "Rules of Hooks" ga o'xshash lekin ANCHA YUMSHOQROQ. Tushunish uchun avval Vue ichki ishlashini bilish kerak.

═══════════════════════════════════════
  ASOSIY QOIDA
═══════════════════════════════════════

Composable-lar (use* funksiyalar) SINXRON RAVISHDA setup() kontekstida chaqirilishi KERAK.

Nima uchun:
- Vue lifecycle hook-larni (onMounted, onUnmounted) HOZIRGI komponent instance-ga bog'laydi
- setup() ishlayotganda Vue "currentInstance" ni biladi
- Async operatsiya ichida currentInstance YO'QOLADI
- Shuning uchun await KEYIN composable chaqirish MUAMMO

═══════════════════════════════════════
  QAYERDA CHAQIRISH MUMKIN
═══════════════════════════════════════

✅ RUXSAT ETILGAN:
1. <script setup> ichida — top level
2. setup() funksiya ichida — top level
3. Boshqa composable ichida (use* dan use* chaqirish)
4. if/for/switch ichida — Vue-da RUXSAT (React-dan farq!)

  <script setup>
  const { data } = useFetch('/api')     // ✅ top level
  if (condition) {
    const { value } = useFeature()       // ✅ Vue-da ISHLAYDI
  }
  for (const item of items) {
    useTracker(item)                     // ✅ Vue-da ISHLAYDI
  }
  </script>

❌ RUXSAT ETILMAGAN:
1. await KEYIN composable chaqirish
2. setTimeout/setInterval ichida
3. Promise callback ichida
4. Event handler ichida (setup tashqarisida)

═══════════════════════════════════════
  ASYNC SETUP MUAMMOSI
═══════════════════════════════════════

  <script setup>
  const { data } = useFetch('/api')   // ✅ await OLDIN — ishlaydi

  const response = await fetch('/api') // await — bu yerda currentInstance YO'QOLISHI MUMKIN

  // ❌ XAVFLI — await keyin
  const { count } = useCounter()       // currentInstance yo'q bo'lishi mumkin
  onMounted(() => { ... })             // bu hook BOGLANMAY qolishi mumkin
  </script>

YECHIM: Barcha composable va lifecycle hook-larni await-dan OLDIN chaqiring:

  <script setup>
  // ✅ Avval BARCHA composable-lar
  const { data } = useFetch('/api')
  const { count } = useCounter()
  onMounted(() => { ... })

  // Keyin await
  const extra = await fetchExtraData()
  </script>

═══════════════════════════════════════
  COMPOSABLE YOZISH QOIDALARI
═══════════════════════════════════════

1. Nom doim "use" bilan boshlang: useFetch, useAuth, useCounter
2. Sinxron setup kontekstida ishlashni kafolatlang
3. Lifecycle hook-larni composable ICHIDA chaqiring (lekin faqat sinxron qismda)
4. Cleanup — onUnmounted ichida tozalang
5. Parametrlar ref qabul qilsin — reaktivlik saqlanadi
6. Return — ref/reactive qaytaring (destrukturizatsiya uchun)

═══════════════════════════════════════
  effectScope() — ILGARI VOSITA
═══════════════════════════════════════

effectScope() — reactive effect-larni guruhlash va bir vaqtda tozalash:

  const scope = effectScope()
  scope.run(() => {
    const count = ref(0)
    watch(count, () => console.log(count.value))
    computed(() => count.value * 2)
    // Barcha effect-lar shu scope-ga tegishli
  })
  scope.stop() // BARCHA effect-lar bir vaqtda tozalanadi

Composable kutubxonalar (VueUse) effectScope ishlatadi — komponent unmount bo'lganda barcha effect-lar tozalanadi.

═══════════════════════════════════════
  getCurrentInstance() — EHTIYOT
═══════════════════════════════════════

getCurrentInstance() — hozirgi komponent instance-ni olish.

  ⚠️ Bu INTERNAL API — production kodda ishlatish TAVSIYA ETILMAYDI
  ⚠️ Faqat kutubxona/plugin mualliflari uchun
  ⚠️ async operatsiya ichida NULL qaytaradi

  Agar kerak bo'lsa — provide/inject yoki composable ishlatish yaxshiroq.

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React Rules of Hooks (QATTIQ):
1. Faqat top level — if/for ICHIDA hook chaqirish MUMKIN EMAS
2. Faqat React function component yoki custom hook ichida
3. Har renderda bir xil tartibda chaqirilishi SHART
4. Sabab: React hook-larni TARTIB bo'yicha aniqlay (linked list)

Vue Composition API qoidalari (YUMSHOQ):
1. if/for ichida composable chaqirish MUMKIN ✅
2. setup() kontekstida — SINXRON qismda
3. Tartib muhim EMAS — Vue instance-ga bog'laydi (tartib emas)
4. Sabab: Vue currentInstance orqali aniqlay

XULOSA: Vue qoidalari ANCHA ERKIN — asosiy cheklov faqat SINXRONLIK (await dan keyin composable chaqirmaslik). React-da esa if/for, early return — HAMMASI TAQIQLANGAN.`,
  codeExamples: [
    {
      title: 'Composable chaqirish joylari — to\'g\'ri va noto\'g\'ri',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFetch } from '@/composables/useFetch'
import { useCounter } from '@/composables/useCounter'
import { useLocalStorage } from '@/composables/useLocalStorage'

const showExtra = true

// ✅ Top level — eng yaxshi joy
const { data: users, isLoading } = useFetch<User[]>('/api/users')
const { count, increment } = useCounter(0)

// ✅ Vue-da if ichida ISHLAYDI (React-da TAQIQLANGAN!)
if (showExtra) {
  const saved = useLocalStorage('key', 'default')
  // Bu ishlaydi chunki Vue hook-larni tartib bo'yicha emas,
  // currentInstance orqali aniqlaydi
}

// ✅ Lifecycle hook — sinxron setup ichida
onMounted(() => {
  console.log('Mounted — ishlaydi')
})

// ❌ NOTO'G'RI — async keyin composable
async function loadData() {
  const res = await fetch('/api/data')
  // ❌ Bu yerda currentInstance yo'q bo'lishi mumkin
  // const { data } = useFetch('/other') // ISHLAMAYDI!
  // onMounted(() => {})                  // ISHLAMAYDI!
}

// ❌ NOTO'G'RI — event handler ichida
function handleClick() {
  // ❌ Setup tashqarisi — currentInstance yo'q
  // const { count } = useCounter() // ISHLAMAYDI!
}
</script>

<template>
  <div>
    <p v-if="isLoading">Loading...</p>
    <p>Count: {{ count }}</p>
    <button @click="increment">+1</button>
    <button @click="handleClick">Click</button>
  </div>
</template>`,
      description: 'Vue-da composable-lar if/for ichida chaqirish MUMKIN (React-dan farq). Lekin await keyin va event handler ichida ISHLAMAYDI.',
    },
    {
      title: 'Async setup — to\'g\'ri pattern',
      language: 'html',
      code: `<!-- ❌ NOTO'G'RI — await keyin composable -->
<!--
<script setup lang="ts">
const response = await fetch('/api/config')
const config = await response.json()

// ❌ Bu yerda composable/lifecycle chaqirish XAVFLI
const { data } = useFetch('/api/users')  // currentInstance yo'qolgan bo'lishi mumkin
onMounted(() => { ... })                  // bog'lanmay qolishi mumkin
</script>
-->

<!-- ✅ TO'G'RI — avval composable, keyin await -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFetch } from '@/composables/useFetch'

// 1. AVVAL barcha composable va lifecycle
const { data: users, isLoading, error } = useFetch<User[]>('/api/users')
const config = ref<Config | null>(null)

onMounted(() => {
  console.log('Mounted — to\'g\'ri bog\'langan')
})

// 2. KEYIN async operatsiyalar
try {
  const response = await fetch('/api/config')
  config.value = await response.json()
} catch (e) {
  console.error('Config yuklash xatosi:', e)
}
// Bu ishlaydi chunki composable-lar OLDIN chaqirilgan
</script>

<!-- ✅ ALTERNATIVE — composable ichida async -->
<!--
// composables/useFetch.ts
export function useFetch<T>(url: string) {
  const data = ref<T | null>(null)
  const isLoading = ref(true)

  // Async logika composable ICHIDA — lekin setup sinxron
  onMounted(async () => {
    try {
      const res = await fetch(url)
      data.value = await res.json()
    } finally {
      isLoading.value = false
    }
  })

  return { data, isLoading }  // sinxron return
}
-->

<template>
  <div>
    <p v-if="isLoading">Loading...</p>
    <pre v-if="config">{{ config }}</pre>
  </div>
</template>`,
      description: 'Async setup qoidasi: AVVAL barcha composable va lifecycle, KEYIN await. Yoki async logikani composable/onMounted ichiga qo\'ying.',
    },
    {
      title: 'effectScope() — effect-larni guruhlash',
      language: 'ts',
      code: `import { ref, computed, watch, effectScope, onScopeDispose } from 'vue'

// effectScope — barcha reactive effect-larni guruhlash
export function useFeatureWithScope() {
  const scope = effectScope()

  const result = scope.run(() => {
    const count = ref(0)
    const doubled = computed(() => count.value * 2)

    watch(count, (val) => {
      console.log('Count changed:', val)
    })

    // onScopeDispose — scope.stop() chaqirilganda ishlaydi
    // onUnmounted analog, lekin scope darajasida
    onScopeDispose(() => {
      console.log('Scope tozalandi — barcha effect-lar to\'xtatildi')
    })

    return { count, doubled }
  })

  function cleanup() {
    scope.stop() // Barcha watch, computed, effect-lar BITTA chaqiruv bilan tozalanadi
    // computed qayta hisoblamaydi
    // watch callback chaqirilmaydi
    // onScopeDispose callback ishlaydi
  }

  return { ...result!, cleanup }
}

// Kutubxona mualliflari uchun:
// VueUse har bir composable effectScope ichida ishlaydi
// Komponent unmount -> scope.stop() -> barcha tozalanadi
// Bu "cleanup forgetting" muammosini hal qiladi

// Misol: dynamik scope
function useDynamicFeature(enabled: Ref<boolean>) {
  let innerScope: EffectScope | null = null

  watch(enabled, (val) => {
    if (val) {
      innerScope = effectScope()
      innerScope.run(() => {
        // Feature effect-lari
        const data = ref(null)
        watch(data, handler)
      })
    } else {
      innerScope?.stop() // Feature o'chganda tozalash
      innerScope = null
    }
  }, { immediate: true })
}`,
      description: 'effectScope() — reactive effect-larni guruhlash va bir vaqtda tozalash. VueUse va kutubxona mualliflari uchun muhim pattern.',
    },
  ],
  interviewQA: [
    {
      question: 'Vue Composition API qoidalari nima? React Rules of Hooks dan farqi?',
      answer: `Vue qoidasi: composable-lar SINXRON RAVISHDA setup() kontekstida chaqirilishi kerak. await keyin, setTimeout ichida, event handler-da chaqirish MUMKIN EMAS (currentInstance yo'qoladi). LEKIN: if/for/switch ichida chaqirish MUMKIN — bu React-dan asosiy farq. React qoidalari: 1) FAQAT top level — if/for/early return TAQIQLANGAN. 2) Har renderda BIR XIL tartibda. 3) Sabab: React linked list — tartib buzilsa hook-lar aralashadi. Vue — currentInstance orqali, tartib muhim EMAS.`,
    },
    {
      question: 'Nima uchun await keyin composable chaqirish ishlamaydi?',
      answer: `Vue setup() ishlaganda currentInstance (hozirgi komponent) o'rnatiladi. Composable ichidagi onMounted, watch va h.k. shu currentInstance-ga bog'lanadi. await — mikrotask-ga o'tadi, shu vaqtda Vue BOSHQA komponent setup qilayotgan bo'lishi mumkin — currentInstance O'ZGARADI yoki null bo'ladi. Natija: onMounted noto'g'ri komponentga bog'lanadi yoki umuman bog'lanmaydi. Yechim: AVVAL barcha composable va lifecycle-ni chaqiring, KEYIN await. Yoki async logikani composable/onMounted ichiga qo'ying.`,
    },
    {
      question: 'Vue-da if ichida composable chaqirsa bo\'ladimi? Nima uchun?',
      answer: `Ha, Vue-da if/for/switch ichida composable chaqirish MUMKIN va TO'G'RI ishlaydi. Sabab: Vue hook-larni TARTIB bo'yicha emas, INSTANCE bo'yicha aniqlaydi. Har bir hook currentInstance-ga bog'lanadi — tartib muhim emas. React-da esa hooks LINKED LIST — birinchi render: [useState1, useState2, useEffect1]. Agar ikkinchi renderda if tufayli useState2 chaqirilmasa — useEffect1 useState2 o'rniga tushadi. Vue-da bunday muammo YO'Q. Bu Vue Composition API-ning React Hooks-dan KATTA afzalligi.`,
    },
    {
      question: 'effectScope() nima va nima uchun kerak?',
      answer: `effectScope() — reactive effect-larni (watch, computed, watchEffect) guruhlash va BIR VAQTDA tozalash mexanizmi. Ishlatish: 1) Kutubxona mualliflari — composable ichidagi barcha effect-larni scope-ga yig'ish, komponent unmount-da scope.stop() — hammasi tozalanadi. 2) Dinamik feature — feature yoqilganda scope.run(), o'chirilganda scope.stop(). 3) onScopeDispose — scope tozalanganda callback (onUnmounted analog). VueUse har bir composable-ni effectScope ichida ishlaydi. Bu "cleanup forgetting" muammosini hal qiladi — bitta scope.stop() BARCHA effect-larni tozalaydi.`,
    },
    {
      question: 'getCurrentInstance() ishlatish to\'g\'rimi? Alternativlari nima?',
      answer: `getCurrentInstance() — hozirgi komponent instance-ni olish. BU INTERNAL API — production kodda ishlatish TAVSIYA ETILMAYDI. Sabablar: 1) Instance ichki tuzilishi versiyalar orasida O'ZGARISHI mumkin. 2) async operatsiya ichida NULL qaytaradi. 3) TypeScript tiplar to'liq emas. 4) Vue jamoa bu API-ni "escape hatch" deb hisoblaydi. Alternativlar: provide/inject (dependency injection), defineExpose (parent-child aloqa), composable-lar (logika ajratish). Faqat kutubxona/plugin mualliflari uchun zarur holatlarda ishlatish mumkin.`,
    },
    {
      question: 'Composable yozish best practice-larini aytib bering.',
      answer: `1) Nom: doim "use" bilan boshlang — useFetch, useAuth. 2) Parametr: ref qabul qilsin — toRef(props, 'name') reaktivlikni saqlaydi. 3) Return: ref/reactive qaytaring — destrukturizatsiya uchun. 4) Cleanup: onUnmounted yoki onScopeDispose ichida tozalang (listener, timer, subscription). 5) Error handling: try/catch va error ref qaytaring. 6) Sinxron: setup kontekstida sinxron ishlashni kafolatlang, async logikani onMounted yoki ichki funksiyaga qo'ying. 7) Test: composable-ni komponent tashqarisida ham test qilish mumkin (effectScope bilan). 8) Side-effect-larni aniq belgilang — foydalanuvchi kutmagan side-effect qo'ymang.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'composition-api', label: 'Composition API' },
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'composables', label: 'Composables' },
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'options-vs-composition', label: 'Options vs Composition' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'lifecycle', label: 'Lifecycle Hooks' },
  ],
}
