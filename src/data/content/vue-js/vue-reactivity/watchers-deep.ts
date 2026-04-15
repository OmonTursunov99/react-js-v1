import type { Topic } from '../../../types'

export const watchersDeep: Topic = {
  id: 'watchers-deep',
  title: 'Watchers chuqur',
  importance: 3,
  status: 'to-learn',
  description: 'watch() va watchEffect() chuqur — deep, immediate, once, flush, onCleanup, multiple sources',
  content: `Vue 3 da reaktiv qiymatlarni kuzatish uchun watch() va watchEffect() ishlatiladi. Bu ikki API orasidagi farqlar, ularning barcha opsiyalari va amaliy patternlarni chuqur bilish — senior darajadagi muhim ko'nikma.

═══════════════════════════════════════
  watch() — ANIQ MANBANI KUZATISH
═══════════════════════════════════════

watch() — bitta yoki bir nechta reaktiv manbani kuzatadi. Eski va yangi qiymatni beradi.

Manba turlari:
1. ref — watch(countRef, (newVal, oldVal) => { ... })
2. reactive property — watch(() => state.count, (n, o) => { ... })
3. getter funksiya — watch(() => a.value + b.value, (n, o) => { ... })
4. Array — watch([refA, () => state.b], ([newA, newB], [oldA, oldB]) => { ... })

MUHIM: reactive object-ni to'g'ridan-to'g'ri kuzatganda avtomatik deep bo'ladi:
  watch(state, (newState) => { ... }) // deep: true avtomatik

Lekin getter bilan kuzatganda — deep emas:
  watch(() => state, (n) => { ... }) // nested o'zgarish kuzatilMAYDI
  watch(() => state, (n) => { ... }, { deep: true }) // Endi ishlaydi

═══════════════════════════════════════
  watchEffect() — AVTOMATIK DEPENDENCY
═══════════════════════════════════════

watchEffect() — callback ichidagi BARCHA reaktiv dependency-larni avtomatik kuzatadi. Darhol ishlaydi (lazy emas).

  watchEffect(() => {
    // count.value va name.value o'zgarganda qayta ishlaydi
    document.title = count.value + ' - ' + name.value
  })

Farq:
- watch() — lazy (birinchi renderda ishlamaydi), aniq manba, old/new
- watchEffect() — eager (darhol ishlaydi), avtomatik tracking, faqat new

watchEffect() qachon ishlatiladi:
- Bir nechta dependency-ga bog'liq side-effect
- Dependency-larni qo'lda ko'rsatish noqulay bo'lganda
- old qiymat kerak bo'lmaganda

═══════════════════════════════════════
  OPSIYALAR — deep, immediate, once, flush
═══════════════════════════════════════

deep: true — chuqur kuzatish (nested property o'zgarishlarini ham)
  watch(objectRef, handler, { deep: true })
  // deep: 2 (Vue 3.5+) — faqat 2 daraja chuqurlikgacha

immediate: true — darhol bir marta ishga tushirish (watch ni eager qiladi)
  watch(count, handler, { immediate: true })

once: true (Vue 3.4+) — faqat BIR MARTA ishlaydi, keyin avtomatik to'xtaydi
  watch(source, handler, { once: true })

flush — callback QACHON ishga tushadi:
  'pre' (default) — DOM yangilanishidan OLDIN
  'post' — DOM yangilanishidan KEYIN (DOM ga murojaat kerak bo'lganda)
  'sync' — sinxron, darhol (ehtiyot — performance muammo)

Shorthand:
  watchPostEffect(() => { ... })  // watchEffect + flush: 'post'
  watchSyncEffect(() => { ... })  // watchEffect + flush: 'sync'

═══════════════════════════════════════
  onCleanup — TOZALASH FUNKSIYASI
═══════════════════════════════════════

Har safar watcher qayta ishlanganda — OLDINGI side-effect ni tozalash kerak bo'lishi mumkin (timer, request, subscription).

Vue 3.5+:
  watch(source, (newVal, oldVal, onCleanup) => {
    const controller = new AbortController()
    fetch(url, { signal: controller.signal })
    onCleanup(() => controller.abort())
  })

  watchEffect((onCleanup) => {
    const timer = setInterval(() => { ... }, 1000)
    onCleanup(() => clearInterval(timer))
  })

onCleanup QACHON chaqiriladi:
1. Watcher qayta ishga tushganda (yangi dependency o'zgarishi)
2. Watcher to'xtatilganda (komponent unmount yoki qo'lda stop)

═══════════════════════════════════════
  WATCHER-NI TO'XTATISH
═══════════════════════════════════════

watch() va watchEffect() — unwatch funksiyasi qaytaradi:

  const stop = watch(source, handler)
  const stopEffect = watchEffect(() => { ... })

  // Kerak bo'lganda to'xtatish:
  stop()
  stopEffect()

Setup ichida yaratilgan watcher-lar — komponent unmount bo'lganda AVTOMATIK to'xtaydi. Lekin asinxron yaratilgan watcher-larni qo'lda to'xtatish KERAK.

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React useEffect:
- Dependency array qo'lda yoziladi — xato qilish oson
- Stale closure xavfi — eslint-plugin-react-hooks kerak
- Cleanup — return () => { ... }
- Har render-da qayta yaratiladi

Vue watch/watchEffect:
- Dependency AVTOMATIK kuzatiladi (watchEffect)
- yoki ANIQ ko'rsatiladi (watch) — lekin reactive, ref emas oddiy qiymat
- Stale closure xavfi YO'Q — Proxy har doim joriy qiymat beradi
- Cleanup — onCleanup() callback
- Setup BIR MARTA ishlaydi — watcher bir marta yaratiladi

Vue flush opsiyasi — React da to'g'ridan-to'g'ri analogi yo'q:
- useEffect — DOM yangilanishidan keyin (flush: 'post' ga o'xshash)
- useLayoutEffect — DOM yangilanishidan oldin (flush: 'pre' ga yaqin)
- React da flush: 'sync' analogi yo'q`,
  codeExamples: [
    {
      title: 'watch() — barcha manba turlari',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

const count = ref(0)
const name = ref('Ali')
const state = reactive({
  user: { age: 25, city: 'Toshkent' },
  items: [1, 2, 3],
})

// 1. ref kuzatish
watch(count, (newVal, oldVal) => {
  console.log(\`Count: \${oldVal} -> \${newVal}\`)
})

// 2. reactive property (getter funksiya bilan)
watch(
  () => state.user.age,
  (newAge, oldAge) => {
    console.log(\`Age: \${oldAge} -> \${newAge}\`)
  }
)

// 3. Bir nechta manba
watch(
  [count, name, () => state.user.city],
  ([newCount, newName, newCity], [oldCount, oldName, oldCity]) => {
    console.log('Bittasi o\\'zgardi:', {
      count: \`\${oldCount} -> \${newCount}\`,
      name: \`\${oldName} -> \${newName}\`,
      city: \`\${oldCity} -> \${newCity}\`,
    })
  }
)

// 4. reactive object — avtomatik deep
watch(state, (newState) => {
  // state ichidagi HAR QANDAY nested o'zgarish
  console.log('State o\\'zgardi:', JSON.stringify(newState))
})

// 5. Computed getter
watch(
  () => count.value * 2,
  (doubled) => {
    console.log('Doubled:', doubled)
  }
)
</script>

<template>
  <div>
    <button @click="count++">Count: {{ count }}</button>
    <button @click="state.user.age++">Age: {{ state.user.age }}</button>
    <input v-model="name" placeholder="Ism" />
  </div>
</template>`,
      description: 'watch() ning barcha manba turlari — ref, reactive property, array, reactive object, computed getter.',
    },
    {
      title: 'Barcha opsiyalar — deep, immediate, once, flush',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, watch, watchEffect, watchPostEffect, watchSyncEffect } from 'vue'

const searchQuery = ref('')
const userId = ref<number | null>(null)
const formData = ref({ name: '', email: '', nested: { value: '' } })

// immediate: true — darhol ishlaydi (birinchi render)
watch(searchQuery, (newQuery) => {
  console.log('Qidiruv:', newQuery)
}, { immediate: true }) // '' bilan darhol chaqiriladi

// once: true (Vue 3.4+) — faqat birinchi o'zgarishda
watch(userId, (newId) => {
  if (newId) {
    console.log('User birinchi marta tanlandi:', newId)
    // Analytics yuborish
  }
}, { once: true }) // Birinchi trigger-dan keyin avtomatik to'xtaydi

// deep: true — nested o'zgarishlarni kuzatish
watch(formData, (newForm) => {
  console.log('Form o\\'zgardi:', newForm)
}, { deep: true })

// deep: 2 (Vue 3.5+) — faqat 2 daraja chuqurlikgacha
watch(formData, (newForm) => {
  // formData.value.name o'zgarsa — ishlaydi (1-daraja)
  // formData.value.nested.value — ishlaMAYDI (2+ daraja)
  console.log('Shallow form:', newForm)
}, { deep: 2 })

// flush: 'post' — DOM yangilanganidan KEYIN
watch(searchQuery, (newQuery) => {
  // Bu yerda DOM allaqachon yangilangan
  const el = document.querySelector('.results')
  console.log('DOM element:', el?.textContent)
}, { flush: 'post' })

// watchPostEffect — watchEffect + flush: 'post'
watchPostEffect(() => {
  // searchQuery o'zgarganda — DOM yangilanganidan keyin ishlaydi
  const input = document.querySelector<HTMLInputElement>('.search-input')
  if (input) input.focus()
})

// watchSyncEffect — sinxron (ehtiyot!)
watchSyncEffect(() => {
  // O'zgarish bo'lishi bilan DARHOL — batching yo'q
  console.log('Sync:', searchQuery.value)
})
</script>

<template>
  <div>
    <input v-model="searchQuery" class="search-input" />
    <div class="results">{{ searchQuery }}</div>
  </div>
</template>`,
      description: 'watch() opsiyalari — deep, immediate, once (Vue 3.4+), flush ("pre"|"post"|"sync"), watchPostEffect, watchSyncEffect.',
    },
    {
      title: 'onCleanup va asinxron operatsiyalar',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'

const searchQuery = ref('')
const results = ref<string[]>([])
const isLoading = ref(false)

// ===== watch + onCleanup — API so'rovlarni bekor qilish =====
watch(searchQuery, async (newQuery, _oldQuery, onCleanup) => {
  if (newQuery.length < 2) {
    results.value = []
    return
  }

  const controller = new AbortController()

  // Cleanup: keyingi trigger-da yoki unmount-da chaqiriladi
  onCleanup(() => {
    controller.abort()
    console.log('Oldingi so\\'rov bekor qilindi')
  })

  isLoading.value = true
  try {
    const response = await fetch(
      \`/api/search?q=\${encodeURIComponent(newQuery)}\`,
      { signal: controller.signal }
    )
    const data = await response.json()
    results.value = data.results
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      console.log('So\\'rov bekor qilindi (kutilgan)')
    } else {
      console.error('Xato:', e)
    }
  } finally {
    isLoading.value = false
  }
}, { immediate: false })

// ===== watchEffect + onCleanup — WebSocket =====
const wsUrl = ref('wss://api.example.com/ws')

watchEffect((onCleanup) => {
  const ws = new WebSocket(wsUrl.value)

  ws.onmessage = (event) => {
    console.log('Xabar:', event.data)
  }

  ws.onerror = (error) => {
    console.error('WebSocket xato:', error)
  }

  // URL o'zgarganda yoki unmount-da — eski connection yopiladi
  onCleanup(() => {
    ws.close()
    console.log('WebSocket yopildi')
  })
})

// ===== Timer cleanup =====
const interval = ref(1000)
const tickCount = ref(0)

watchEffect((onCleanup) => {
  const timer = setInterval(() => {
    tickCount.value++
  }, interval.value) // interval o'zgarganda timer qayta yaratiladi

  onCleanup(() => {
    clearInterval(timer)
  })
})
</script>

<template>
  <div>
    <input v-model="searchQuery" placeholder="Qidirish..." />
    <p v-if="isLoading">Yuklanmoqda...</p>
    <ul v-else>
      <li v-for="result in results" :key="result">{{ result }}</li>
    </ul>
    <p>Tick: {{ tickCount }}</p>
  </div>
</template>`,
      description: 'onCleanup — oldingi side-effect ni tozalash. AbortController, WebSocket, setInterval uchun muhim.',
    },
    {
      title: 'Watcher-ni to\'xtatish va asinxron yaratish',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, watch, watchEffect, onMounted } from 'vue'

const data = ref('')
const isTracking = ref(true)
let stopWatcher: (() => void) | null = null

// 1. Oddiy to'xtatish
const stop = watch(data, (newVal) => {
  console.log('Data:', newVal)
})

// Kerak bo'lganda:
function pauseTracking() {
  stop()
  isTracking.value = false
}

// 2. Shartli watcher — toggle
function toggleTracking() {
  if (stopWatcher) {
    stopWatcher()
    stopWatcher = null
    isTracking.value = false
  } else {
    stopWatcher = watch(data, (newVal) => {
      console.log('Tracking:', newVal)
    })
    isTracking.value = true
  }
}

// 3. MUHIM — asinxron watcher xavfi
onMounted(async () => {
  // await dan keyin yaratilgan watcher — avtomatik to'xtaMAYDI!
  const response = await fetch('/api/config')
  const config = await response.json()

  // Bu watcher komponent unmount bo'lganda to'xtaMAYDI
  // chunki u setup() scope-dan tashqarida yaratilgan
  const asyncStop = watch(data, () => {
    console.log('Asinxron watcher')
  })

  // Qo'lda to'xtatish kerak:
  // onUnmounted(() => asyncStop()) yoki
  // onScopeDispose(() => asyncStop())
})

// 4. watchEffect bir marta ishlatib to'xtatish (once analog)
const stopOnce = watchEffect(() => {
  if (data.value === 'tayyor') {
    console.log('Tayyor!')
    // O'zini o'zi to'xtatish:
    stopOnce()
  }
})
</script>

<template>
  <div>
    <input v-model="data" placeholder="Ma'lumot" />
    <button @click="toggleTracking">
      {{ isTracking ? 'To\\'xtatish' : 'Boshlash' }}
    </button>
  </div>
</template>`,
      description: 'Watcher to\'xtatish, toggle qilish, asinxron yaratish xavfi va o\'zini o\'zi to\'xtatish pattern.',
    },
    {
      title: 'Reactive object vs ref — watch farqi',
      language: 'ts',
      code: `import { ref, reactive, watch } from 'vue'

// ===== reactive object — avtomatik DEEP =====
const state = reactive({
  user: { name: 'Ali', settings: { theme: 'dark' } },
  count: 0,
})

// Bu avtomatik deep — nested o'zgarish ham kuzatiladi
watch(state, (newState) => {
  console.log('State o\\'zgardi') // state.user.settings.theme o'zgarsa ham ishlaydi
})
// LEKIN: oldValue === newValue (bir xil Proxy reference)

// ===== ref object — deep kerak =====
const config = ref({ theme: 'dark', lang: 'uz' })

// XATO — nested o'zgarish kuzatilMAYDI:
watch(config, (newConfig) => {
  console.log('Config:', newConfig) // config.value.theme = 'light' — ishlaMAYDI
})

// TO'G'RI — deep qo'shish:
watch(config, (newConfig, oldConfig) => {
  console.log('Config:', newConfig) // Endi ishlaydi
  // MUHIM: deep watch-da oldConfig === newConfig (bir xil reference)
}, { deep: true })

// ===== Getter bilan — yangi qiymat yaratish =====
// oldValue to'g'ri ishlashi uchun:
watch(
  () => ({ ...state.user }), // har safar YANGI object yaratish
  (newUser, oldUser) => {
    // Endi oldUser va newUser BOSHQA reference
    console.log('Old:', oldUser.name, 'New:', newUser.name)
  }
)

// ===== Aniq property kuzatish — eng samarali =====
watch(
  () => state.count,
  (newCount, oldCount) => {
    // Faqat count o'zgarganda, old/new to'g'ri
    console.log(\`Count: \${oldCount} -> \${newCount}\`)
  }
)

// ===== Composed watcher — murakkab shart =====
watch(
  () => state.user.settings.theme,
  (newTheme) => {
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  },
  { immediate: true, flush: 'post' }
)`,
      description: 'reactive object avtomatik deep, ref uchun deep: true kerak. old/new farqi va getter pattern.',
    },
  ],
  interviewQA: [
    {
      question: 'watch() va watchEffect() orasidagi asosiy farqlar qanday va qachon qaysi biri ishlatiladi?',
      answer: `watch() — aniq manbani kuzatadi, lazy (birinchi renderda ishlamaydi), old va new qiymatlarni beradi, manbani getter yoki ref sifatida ko'rsatish kerak. watchEffect() — dependency-larni AVTOMATIK aniqlaydi (callback ichida o'qilgan barcha reaktiv qiymatlar), eager (darhol ishlaydi), faqat yangi qiymat bilan ishlaydi. watch() qachon: old/new solishtirish kerak, conditional logic, debounce, aniq bir qiymat kuzatish. watchEffect() qachon: ko'p dependency-ga bog'liq side-effect, dependency-larni qo'lda yozish noqulay, React useEffect ga o'xshash pattern. Amalda watch() ko'proq ishlatiladi chunki u aniqroq va debug qilish osonroq.`,
    },
    {
      question: 'flush opsiyasi nima va "pre", "post", "sync" qanday farq qiladi?',
      answer: `flush — watcher callback QACHON ishga tushishini belgilaydi. "pre" (default) — DOM yangilanishidan OLDIN. Komponent update lifecycle-da birinchi ishlaydi. Component state o'qish uchun yaxshi. "post" — DOM yangilanishidan KEYIN. Template ref, DOM o'lchamlari, computed styles bilan ishlash kerak bo'lganda. watchPostEffect() shorthand. "sync" — sinxron, trigger bo'lishi bilan DARHOL. Batching yo'q — har bir o'zgarish uchun alohida ishlaydi. Performance xavfi bor — EHTIYOT. watchSyncEffect() shorthand. Misol: template ref-ga murojaat kerak — flush: "post". State ni DOM-ga sinxronlash — flush: "pre" (default). Third-party kutubxonaga darhol xabar berish — flush: "sync" (kamdan-kam).`,
    },
    {
      question: 'onCleanup nima uchun kerak va qanday ishlaydi?',
      answer: `onCleanup — watcher callback ichida oldingi side-effect-ni tozalash funksiyasi. U ikki holatda chaqiriladi: 1) Watcher qayta ishga tushganda (dependency o'zgarganda) — OLDINGI callback-ning cleanup-i chaqiriladi. 2) Watcher to'xtaganda (komponent unmount yoki qo'lda stop()). Amaliy holatlar: AbortController bilan fetch so'rovini bekor qilish (yangi qidiruv boshlanganda eskisini cancel), WebSocket/EventSource yopish, setInterval/setTimeout tozalash, DOM event listener olib tashlash. React-da buni useEffect cleanup (return () => { ... }) bilan qilamiz. Vue-da onCleanup(fn) — 3-chi argument (watch) yoki 1-chi argument (watchEffect). Vue 3.5 dan beri onWatcherCleanup() global import ham mavjud.`,
    },
    {
      question: 'Asinxron yaratilgan watcher nima uchun xavfli?',
      answer: `Vue da setup() yoki <script setup> ichida sinxron yaratilgan watcher-lar komponent instance-ga avtomatik bog'lanadi va unmount-da to'xtaydi. Lekin await-dan keyin yoki setTimeout ichida yaratilgan watcher — joriy komponent scope-ga bog'lanMAYDI. Chunki Vue getCurrentInstance() faqat sinxron setup jarayonida ishlaydi. Natija: komponent unmount bo'lganda watcher to'xtaMAYDI — memory leak. Yechim: 1) Asinxron watcher-ni qo'lda to'xtatish (onUnmounted). 2) effectScope ichida yaratish. 3) Watcher-ni sinxron yaratib, ichida asinxron logika ishlatish. Best practice: watcher-larni DOIM setup() top-level-da sinxron yarating.`,
    },
    {
      question: 'deep watch performance muammolari va ularni qanday hal qilish mumkin?',
      answer: `deep: true — Vue har bir nested property-ni recursive traverse qiladi har trigger-da. Katta object-larda (1000+ property, 5+ daraja) bu sezilarli performance cost. Muammolar: 1) Har bir nested property uchun Proxy get trap ishlaydi. 2) oldValue === newValue (bir xil reference) — taqqoslab bo'lmaydi. 3) Hatto o'zgarmagan property-lar ham traverse qilinadi. Yechimlar: 1) Aniq property kuzatish: watch(() => state.user.name, ...) — faqat kerakli property. 2) deep: N (Vue 3.5+) — chuqurlikni cheklash. 3) shallowRef ishlatish — faqat .value o'zgarishini kuzatish. 4) Getter bilan yangi object qaytarish: watch(() => ({...state.user}), ...) — old/new ham to'g'ri ishlaydi. 5) watchEffect — faqat haqiqatan o'qilgan dependency-larni kuzatadi.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'ref-vs-reactive', label: 'ref() vs reactive()' },
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'computed-deep', label: 'Computed chuqur' },
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'effect-scope', label: 'effectScope API' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'lifecycle', label: 'Lifecycle Hooks' },
  ],
}
