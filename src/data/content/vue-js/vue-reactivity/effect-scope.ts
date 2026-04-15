import type { Topic } from '../../../types'

export const effectScope: Topic = {
  id: 'effect-scope',
  title: 'effectScope va customRef',
  importance: 2,
  status: 'to-learn',
  description: 'effectScope API — effect boshqaruvi, onScopeDispose, customRef — maxsus reaktiv reference yaratish',
  content: `effectScope va customRef — Vue 3 ning ilg'or API-lari. effectScope reaktiv effect-larni (watch, watchEffect, computed) guruhlash va bir vaqtda tozalash imkonini beradi. customRef esa o'z reaktiv reference-ingizni yaratish — dependency tracking va trigger-ni to'liq nazorat qilish imkonini beradi. Bu API-lar kutubxona mualliflari va murakkab composable-lar uchun juda muhim.

═══════════════════════════════════════
  effectScope() — EFFECT GURUHLASH
═══════════════════════════════════════

effectScope() — yangi scope yaratadi. Bu scope ichida yaratilgan barcha effect-lar (computed, watch, watchEffect) scope-ga bog'lanadi. scope.stop() chaqirilganda — BARCHASI bir vaqtda to'xtaydi.

  const scope = effectScope()

  scope.run(() => {
    const counter = ref(0)
    const doubled = computed(() => counter.value * 2)

    watch(counter, (val) => console.log(val))
    watchEffect(() => console.log(doubled.value))
  })

  // Barcha effect-lar bir vaqtda to'xtaydi:
  scope.stop()

NIMA UCHUN KERAK:
1. Komponent tashqarisida effect-lar boshqarish
2. Kutubxona/plugin ichida effect lifecycle boshqarish
3. Pinia store ichki mexanizmi shu asosda qurilgan
4. Test yozishda — effect-larni izolyatsiya qilish

═══════════════════════════════════════
  onScopeDispose() — SCOPE TOZALANISH HOOK
═══════════════════════════════════════

onScopeDispose() — joriy scope to'xtaganda chaqiriladigan callback. onUnmounted() ga o'xshash, lekin scope uchun (komponent emas).

  const scope = effectScope()

  scope.run(() => {
    const ws = new WebSocket('wss://...')

    onScopeDispose(() => {
      ws.close()  // scope.stop() chaqirilganda ishga tushadi
    })
  })

Komponent ichida onScopeDispose = onUnmounted bilan deyarli bir xil. Lekin komponent tashqarisida — onUnmounted ishlaMAYDI, onScopeDispose ishlaydi.

═══════════════════════════════════════
  getCurrentScope() — JORIY SCOPE
═══════════════════════════════════════

getCurrentScope() — hozir faol bo'lgan scope-ni qaytaradi. Composable-larda scope mavjudligini tekshirish uchun ishlatiladi.

  function useFeature() {
    const scope = getCurrentScope()
    if (scope) {
      // Scope bor — cleanup registratsiya qilish mumkin
      onScopeDispose(() => { /* cleanup */ })
    } else {
      console.warn('useFeature scope tashqarisida chaqirildi!')
    }
  }

═══════════════════════════════════════
  DETACHED SCOPE — MUSTAQIL SCOPE
═══════════════════════════════════════

Sukut bo'yicha ichki scope tashqi scope-ga bog'langan — tashqi to'xtaganda ichki ham to'xtaydi. detached: true — mustaqil scope yaratadi.

  const parentScope = effectScope()

  parentScope.run(() => {
    // Bu scope parentScope to'xtaganda ham TO'XTAMAYDI:
    const childScope = effectScope(true) // detached

    childScope.run(() => {
      watchEffect(() => { /* ... */ })
    })

    // Qo'lda to'xtatish kerak:
    // childScope.stop()
  })

  parentScope.stop() // childScope hali ishlaydi!

EHTIYOT: detached scope — memory leak xavfi. Qo'lda stop() chaqirish SHART.

═══════════════════════════════════════
  customRef() — MAXSUS REAKTIV REFERENCE
═══════════════════════════════════════

customRef() — to'liq nazoratli ref yaratish. track() va trigger() QACHON chaqirilishini SIZ belgilaysiz.

  function customRef<T>(factory: (track, trigger) => {
    get: () => T
    set: (value: T) => void
  }): Ref<T>

Eng mashhur misol — debounced ref:
- Qiymat o'zgarganda — darhol emas, ma'lum vaqtdan keyin trigger
- Typeahead, auto-save kabi pattern-lar uchun

customRef boshqa holatlari:
- Validated ref — yozishdan oldin validatsiya
- Throttled ref — cheklangan chastota bilan trigger
- LocalStorage ref — o'qish/yozish localStorage-dan
- Async ref — asinxron qiymat bilan ishlash

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React da effectScope ANALOGI YO'Q. Eng yaqin tushunchalar:

AbortController — guruhli cancel qilish:
  const controller = new AbortController()
  // ... bir nechta fetch
  controller.abort() // barchasini bekor qilish

React da effect lifecycle — useEffect return:
  useEffect(() => {
    // setup
    return () => { /* cleanup */ }
  }, [deps])
  // Har bir useEffect o'z cleanup-iga ega — guruhlab bo'lmaydi

customRef analogi — React da to'g'ridan-to'g'ri yo'q:
- useSyncExternalStore — tashqi store bilan sinxronlash
- custom hook + useRef + setState — qo'lda boshqarish

Vue effectScope kuchli tomoni — bir nechta effect-ni BITTA chaqiruv bilan boshqarish (start/stop). React da har bir subscription alohida boshqariladi — bu murakkab composable-larda ko'p boilerplate yaratadi.

Pinia (Vue state manager) ichida har bir store effectScope bilan o'ralgan — store unregister bo'lganda barcha computed, watch-lar avtomatik tozalanadi.`,
  codeExamples: [
    {
      title: 'effectScope — asosiy ishlatish',
      language: 'ts',
      code: `import {
  effectScope,
  ref,
  computed,
  watch,
  watchEffect,
  onScopeDispose,
} from 'vue'

// ===== Asosiy pattern =====
function createFeature() {
  const scope = effectScope()

  const state = scope.run(() => {
    const count = ref(0)
    const doubled = computed(() => count.value * 2)

    // Watch — scope-ga bog'langan
    watch(count, (val) => {
      console.log('Count o\\'zgardi:', val)
    })

    // WatchEffect — scope-ga bog'langan
    watchEffect(() => {
      console.log('Doubled:', doubled.value)
    })

    // Cleanup — scope to'xtaganda ishlaydi
    const interval = setInterval(() => count.value++, 1000)
    onScopeDispose(() => {
      clearInterval(interval)
      console.log('Feature tozalandi')
    })

    return { count, doubled }
  })!

  return {
    ...state,
    // Barcha effect-larni bir vaqtda to'xtatish
    destroy: () => scope.stop(),
  }
}

// Ishlatish:
const feature = createFeature()
console.log(feature.doubled.value) // 0

// 5 soniyadan keyin tozalash:
setTimeout(() => {
  feature.destroy() // barcha watch, computed, interval to'xtaydi
}, 5000)

// ===== Pinia-ga o'xshash pattern =====
function createStore<T>(setup: () => T): T & { $dispose: () => void } {
  const scope = effectScope(true) // detached — component lifecycle-dan mustaqil
  const state = scope.run(setup)!

  return {
    ...state,
    $dispose: () => scope.stop(),
  }
}

const counterStore = createStore(() => {
  const count = ref(0)
  const doubled = computed(() => count.value * 2)
  function increment() { count.value++ }
  return { count, doubled, increment }
})

counterStore.increment()
console.log(counterStore.doubled.value) // 2
counterStore.$dispose() // tozalash`,
      description: 'effectScope — bir nechta effect-ni guruhlash va bir vaqtda to\'xtatish. Pinia store pattern.',
    },
    {
      title: 'customRef — debounced ref yaratish',
      language: 'ts',
      code: `import { customRef, type Ref } from 'vue'

// ===== Debounced ref — eng mashhur customRef misoli =====
function useDebouncedRef<T>(initialValue: T, delay = 300): Ref<T> {
  let timeout: ReturnType<typeof setTimeout>
  let currentValue = initialValue

  return customRef<T>((track, trigger) => ({
    get() {
      track() // dependency ro'yxatga olish
      return currentValue
    },
    set(newValue: T) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        currentValue = newValue
        trigger() // faqat delay o'tgandan keyin yangilanish
      }, delay)
    },
  }))
}

// ===== Throttled ref =====
function useThrottledRef<T>(initialValue: T, interval = 300): Ref<T> {
  let currentValue = initialValue
  let lastTrigger = 0

  return customRef<T>((track, trigger) => ({
    get() {
      track()
      return currentValue
    },
    set(newValue: T) {
      currentValue = newValue
      const now = Date.now()
      if (now - lastTrigger >= interval) {
        lastTrigger = now
        trigger() // cheklangan chastota bilan
      }
    },
  }))
}

// ===== Validated ref =====
function useValidatedRef<T>(
  initialValue: T,
  validator: (value: T) => boolean
): Ref<T> {
  let currentValue = initialValue

  return customRef<T>((track, trigger) => ({
    get() {
      track()
      return currentValue
    },
    set(newValue: T) {
      // Faqat valid qiymatni qabul qilish
      if (validator(newValue)) {
        currentValue = newValue
        trigger()
      } else {
        console.warn('Validation failed:', newValue)
      }
    },
  }))
}

// ===== LocalStorage ref =====
function useLocalStorageRef<T>(key: string, defaultValue: T): Ref<T> {
  const stored = localStorage.getItem(key)
  let currentValue: T = stored ? JSON.parse(stored) : defaultValue

  return customRef<T>((track, trigger) => ({
    get() {
      track()
      return currentValue
    },
    set(newValue: T) {
      currentValue = newValue
      localStorage.setItem(key, JSON.stringify(newValue))
      trigger()
    },
  }))
}

// Ishlatish:
const searchQuery = useDebouncedRef('', 500)
const scrollPos = useThrottledRef(0, 100)
const email = useValidatedRef('', (v) => v.includes('@') || v === '')
const theme = useLocalStorageRef<'light' | 'dark'>('theme', 'dark')`,
      description: 'customRef — debounced, throttled, validated, localStorage ref pattern-lari. track/trigger ni to\'liq nazorat.',
    },
    {
      title: 'effectScope composable-larda',
      language: 'html',
      code: `<script setup lang="ts">
import {
  ref,
  effectScope,
  getCurrentScope,
  onScopeDispose,
  watch,
  watchEffect,
  type EffectScope,
} from 'vue'

// ===== Composable — scope-aware =====
function useEventSource(url: string) {
  const data = ref<string>('')
  const error = ref<Error | null>(null)
  const isConnected = ref(false)

  let eventSource: EventSource | null = null

  function connect() {
    eventSource = new EventSource(url)

    eventSource.onmessage = (event) => {
      data.value = event.data
    }

    eventSource.onerror = (e) => {
      error.value = new Error('EventSource xato')
      isConnected.value = false
    }

    eventSource.onopen = () => {
      isConnected.value = true
    }
  }

  function disconnect() {
    eventSource?.close()
    eventSource = null
    isConnected.value = false
  }

  connect()

  // getCurrentScope bilan tekshirish
  if (getCurrentScope()) {
    onScopeDispose(() => {
      disconnect()
      console.log('EventSource tozalandi (scope dispose)')
    })
  }

  return { data, error, isConnected, disconnect, connect }
}

// ===== Dynamic scope — feature toggle =====
const isFeatureEnabled = ref(false)
let featureScope: EffectScope | null = null

function enableFeature() {
  if (featureScope) return // allaqachon yoqilgan

  featureScope = effectScope()
  featureScope.run(() => {
    const featureData = ref(0)

    // Bu watch faqat feature yoqilganda ishlaydi
    watchEffect(() => {
      console.log('Feature data:', featureData.value)
    })

    // Har soniyada yangilash
    const timer = setInterval(() => featureData.value++, 1000)

    onScopeDispose(() => {
      clearInterval(timer)
      console.log('Feature o\\'chirildi')
    })
  })
  isFeatureEnabled.value = true
}

function disableFeature() {
  featureScope?.stop()
  featureScope = null
  isFeatureEnabled.value = false
}

// ===== Test-da scope ishlatish =====
function testComposable() {
  const scope = effectScope()

  const result = scope.run(() => {
    return useEventSource('/api/stream')
  })!

  // Test logikasi...
  console.log(result.isConnected.value)

  // Tozalash — barcha effect va subscription to'xtaydi
  scope.stop()
}
</script>

<template>
  <div>
    <button @click="isFeatureEnabled ? disableFeature() : enableFeature()">
      Feature: {{ isFeatureEnabled ? 'ON' : 'OFF' }}
    </button>
  </div>
</template>`,
      description: 'effectScope composable-larda — scope-aware cleanup, dynamic feature toggle, test isolation.',
    },
    {
      title: 'customRef + effectScope — murakkab pattern',
      language: 'html',
      code: `<script setup lang="ts">
import {
  customRef,
  effectScope,
  onScopeDispose,
  ref,
  watch,
  type Ref,
} from 'vue'

// ===== Async customRef — API dan ma'lumot yuklash =====
function useAsyncRef<T>(
  fetcher: () => Promise<T>,
  defaultValue: T
): { data: Ref<T>; isLoading: Ref<boolean>; refresh: () => void } {
  const isLoading = ref(false)
  let currentValue = defaultValue
  let triggerFn: (() => void) | null = null

  const data = customRef<T>((track, trigger) => {
    triggerFn = trigger
    // Birinchi marta yuklash
    loadData()

    return {
      get() {
        track()
        return currentValue
      },
      set(newValue: T) {
        currentValue = newValue
        trigger()
      },
    }
  })

  async function loadData() {
    isLoading.value = true
    try {
      currentValue = await fetcher()
      triggerFn?.()
    } catch (e) {
      console.error('Yuklash xatosi:', e)
    } finally {
      isLoading.value = false
    }
  }

  return { data, isLoading, refresh: loadData }
}

// ===== History ref — undo/redo =====
function useHistoryRef<T>(initialValue: T, maxHistory = 50) {
  const history: T[] = [initialValue]
  let cursor = 0
  let triggerFn: (() => void) | null = null

  const value = customRef<T>((track, trigger) => {
    triggerFn = trigger
    return {
      get() {
        track()
        return history[cursor]
      },
      set(newValue: T) {
        // Cursor-dan keyingi tarixni tozalash
        history.splice(cursor + 1)
        history.push(newValue)
        // Max history cheklash
        if (history.length > maxHistory) history.shift()
        else cursor++
        trigger()
      },
    }
  })

  function undo() {
    if (cursor > 0) {
      cursor--
      triggerFn?.()
    }
  }

  function redo() {
    if (cursor < history.length - 1) {
      cursor++
      triggerFn?.()
    }
  }

  const canUndo = customRef<boolean>((track) => ({
    get() {
      track()
      return cursor > 0
    },
    set() {},
  }))

  const canRedo = customRef<boolean>((track) => ({
    get() {
      track()
      return cursor < history.length - 1
    },
    set() {},
  }))

  return { value, undo, redo, canUndo, canRedo }
}

// Ishlatish:
const { data: users, isLoading, refresh } = useAsyncRef(
  () => fetch('/api/users').then(r => r.json()),
  []
)

const { value: text, undo, redo, canUndo, canRedo } = useHistoryRef('')
</script>

<template>
  <div>
    <!-- Async ref -->
    <p v-if="isLoading">Yuklanmoqda...</p>
    <ul v-else>
      <li v-for="user in users" :key="user.id">{{ user.name }}</li>
    </ul>
    <button @click="refresh">Yangilash</button>

    <!-- History ref -->
    <input v-model="text" placeholder="Yozing..." />
    <button :disabled="!canUndo" @click="undo">Ortga</button>
    <button :disabled="!canRedo" @click="redo">Oldinga</button>
  </div>
</template>`,
      description: 'Murakkab customRef pattern-lar: async data yuklash, undo/redo history bilan.',
    },
  ],
  interviewQA: [
    {
      question: 'effectScope nima va u qanday muammoni hal qiladi?',
      answer: `effectScope — bir nechta reaktiv effect-ni (computed, watch, watchEffect) GURUHLASH va bir vaqtda BOSHQARISH mexanizmi. Hal qiladigan muammo: komponent tashqarisida (global store, plugin, composable) yaratilgan effect-lar avtomatik tozalanMAYDI — chunki ular komponent lifecycle-ga bog'lanmagan. effectScope bu effect-larni bitta scope-ga yig'adi, scope.stop() — barchasini to'xtatadi. Amaliy ishlatish: 1) Pinia — har bir store effectScope ichida, store unregister bo'lganda barcha effect tozalanadi. 2) Composable kutubxonalari — VueUse har bir composable ichida scope ishlatadi. 3) Dynamic feature — yoqish/o'chirish mumkin bo'lgan feature. 4) Test — composable-ni izolyatsiyada test qilish.`,
    },
    {
      question: 'onScopeDispose va onUnmounted farqi nima?',
      answer: `onUnmounted — FAQAT komponent ichida ishlaydi. Komponent DOM-dan olib tashlanganda chaqiriladi. Komponent tashqarisida (global setup, composable standalone) chaqirilsa — xato beradi. onScopeDispose — HAR QANDAY effectScope ichida ishlaydi. Scope to'xtatilganda chaqiriladi. Komponent ichida ham ishlaydi (komponent o'z scope-ga ega). Komponent tashqarisida ham ishlaydi (effectScope yaratilgan bo'lsa). Composable yozishda onScopeDispose AFZAL — chunki u komponent ichida ham, tashqarisida ham ishlaydi. getCurrentScope() — hozir scope bormi tekshirish mumkin. Agar scope yo'q bo'lsa — cleanup registratsiya qilib bo'lmaydi, warning berish kerak.`,
    },
    {
      question: 'customRef qanday ishlaydi va qanday hollarda ishlatiladi?',
      answer: `customRef — factory funksiya qabul qiladi. Factory-ga track va trigger funksiyalari beriladi. Factory — get() va set() metodlari qaytarishi kerak. track() — get() ichida chaqiriladi, dependency-ni ro'yxatga oladi. trigger() — set() ichida (yoki boshqa joyda) chaqiriladi, yangilanishni yuboradi. SIZ BELGILAYSIZ qachon track va qachon trigger — to'liq nazorat. Ishlatish hollari: 1) Debounced ref — set-da setTimeout, delay o'tgandan keyin trigger. 2) Throttled ref — cheklangan chastota. 3) Validated ref — set-da validatsiya, faqat valid bo'lsa trigger. 4) LocalStorage ref — get/set localStorage bilan sinxron. 5) History ref — undo/redo pattern. 6) Async ref — asinxron yuklash bilan. customRef — kutubxona mualliflari uchun kuchli tool.`,
    },
    {
      question: 'Pinia effectScope-ni qanday ishlatadi?',
      answer: `Pinia har bir store uchun alohida effectScope yaratadi (detached: true — komponent lifecycle-dan mustaqil). defineStore chaqirilganda: 1) effectScope() yaratiladi. 2) Store setup funksiyasi scope.run() ichida ishlaydi. 3) Setup ichidagi computed, watch, watchEffect — scope-ga bog'lanadi. 4) Store $dispose() chaqirilganda — scope.stop() barcha effect-larni tozalaydi. Bu nima uchun muhim: store — global, komponent unmount bo'lganda yo'qolmasligi kerak. Lekin store unregister bo'lganda — barcha reactive effect-lar tozalanishi SHART (memory leak). effectScope bu muammoni elegantlik bilan hal qiladi — bitta stop() BARCHANI tozalaydi. Hot Module Replacement (HMR) da ham — eski store scope tozalanib, yangisi yaratiladi.`,
    },
    {
      question: 'React da effectScope va customRef analoglarini qanday implement qilasiz?',
      answer: `effectScope analogi React da to'g'ridan-to'g'ri YO'Q. Eng yaqini: AbortController (faqat fetch uchun) yoki custom cleanup registry: cleanups array-ga push, dispose-da forEach(fn => fn()). React useEffect har biri o'z cleanup-iga ega — guruhlab bo'lmaydi. customRef analogi: useSyncExternalStore — tashqi store bilan sinxronlash. Debounced uchun: useRef + useState + useEffect + setTimeout kombinatsiyasi kerak — ko'p boilerplate. Validated uchun: custom hook + setState wrapper. Vue customRef ANCHA soddaroq — bitta factory funksiya. Vue yondashuvi ustunligi: effectScope — O'NLAB effect-ni bitta chaqiruv bilan boshqarish. React da har bir subscription alohida — 10 ta useEffect = 10 ta cleanup = ko'proq xato xavfi. customRef — reactivity primitive darajasida nazorat, React da bu darajada nazorat yo'q.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'watchers-deep', label: 'Watchers chuqur' },
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'reactivity-deep', label: 'Reaktivlik mexanizmi' },
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'computed-deep', label: 'Computed chuqur' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'composition-api', label: 'Composition API' },
  ],
}
