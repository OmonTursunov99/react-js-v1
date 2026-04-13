import type { Topic } from '../../../types'

export const composables: Topic = {
  id: 'composables',
  title: 'Composables',
  importance: 3,
  status: 'to-learn',
  description: 'Custom composables, qayta ishlatiladigan logika, VueUse patternlar',
  content: `Composable — Vue 3 da Composition API yordamida qayta ishlatiladigan logikani ajratib olish patterni. React-dagi custom hooks ga o'xshash.

═══════════════════════════════════════
  COMPOSABLE NIMA?
═══════════════════════════════════════

Composable — "use" prefiksi bilan boshlanadigan funksiya bo'lib,
ichida Vue Composition API (ref, computed, watch, lifecycle hooks)
ishlatadi va reaktiv state qaytaradi.

  // useMouse.ts
  export function useMouse() {
    const x = ref(0)
    const y = ref(0)

    function update(e: MouseEvent) {
      x.value = e.clientX
      y.value = e.clientY
    }

    onMounted(() => window.addEventListener('mousemove', update))
    onUnmounted(() => window.removeEventListener('mousemove', update))

    return { x, y }
  }

QOIDA: Composable DOIM setup() yoki <script setup> ichida chaqirilishi kerak
(lifecycle hooks ishlashi uchun).

═══════════════════════════════════════
  COMPOSABLE PATTERNLAR
═══════════════════════════════════════

1. State + Logic — eng oddiy pattern:
   function useCounter(initial = 0) {
     const count = ref(initial)
     const increment = () => count.value++
     const decrement = () => count.value--
     const reset = () => count.value = initial
     return { count, increment, decrement, reset }
   }

2. Async Data Fetching — API bilan ishlash:
   function useFetch<T>(url: string) {
     const data = ref<T | null>(null)
     const error = ref<Error | null>(null)
     const isLoading = ref(true)
     // ... fetch logic
     return { data, error, isLoading }
   }

3. Side Effect — tashqi tizim bilan aloqa:
   function useEventListener(target, event, handler) {
     onMounted(() => target.addEventListener(event, handler))
     onUnmounted(() => target.removeEventListener(event, handler))
   }

4. State Sharing — singleton composable:
   const globalState = ref(0)  // modul darajasida
   export function useSharedCounter() {
     return { count: globalState }
   }

═══════════════════════════════════════
  YAXSHI COMPOSABLE YOZISH QOIDALARI
═══════════════════════════════════════

1. DOIM "use" prefiksi: useMouse, useFetch, useAuth
2. Ref qaytarish (reactive emas) — destructure muammosi bo'lmaydi
3. Tozalash — onUnmounted da event listener, timer tozalash
4. Parametr sifatida ref qabul qilish — reaktiv bo'lishi uchun
5. MaybeRef pattern — ref yoki oddiy qiymat qabul qilish:
   function useTitle(title: MaybeRef<string>) {
     watch(() => unref(title), (val) => document.title = val)
   }

═══════════════════════════════════════
  VueUse — Composable kutubxonasi
═══════════════════════════════════════

VueUse — 200+ tayyor composable to'plami.
O'rnatish: npm i @vueuse/core

Mashhur composable-lar:
- useStorage() — localStorage/sessionStorage bilan reaktiv bog'lash
- useDark() — dark mode
- useIntersectionObserver() — lazy loading
- useVirtualList() — virtualizatsiya
- useDebounceFn() / useThrottleFn() — debounce/throttle
- useClipboard() — nusxalash
- useMediaQuery() — responsive breakpoint
- useEventListener() — avtomatik tozalash bilan

═══════════════════════════════════════
  REACT CUSTOM HOOKS BILAN TAQQOSLASH
═══════════════════════════════════════

O'xshashlik:
- Ikkalasi ham "use" prefiksi bilan boshlanadi
- Ikkalasi ham logikani komponentdan ajratadi
- Ikkalasi ham bir nechta komponentda ishlatilishi mumkin

FARQ:
- Vue composable — BITTA MARTA chaqiriladi (setup da)
- React hook — HAR RENDERDA chaqiriladi
- Vue-da stale closure muammosi YO'Q
- Vue-da dependency array kerak EMAS
- Vue composable modul darajasida state ulashishi mumkin`,
  codeExamples: [
    {
      title: 'useFetch — API bilan ishlash composable',
      language: 'ts',
      code: `// composables/useFetch.ts
import { ref, watchEffect, type Ref, unref, type MaybeRef } from 'vue'

interface UseFetchReturn<T> {
  data: Ref<T | null>
  error: Ref<string | null>
  isLoading: Ref<boolean>
  refresh: () => Promise<void>
}

export function useFetch<T>(url: MaybeRef<string>): UseFetchReturn<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<string | null>(null)
  const isLoading = ref(false)

  async function fetchData() {
    const resolvedUrl = unref(url)  // ref yoki string — ikkalasi ham ishlaydi
    if (!resolvedUrl) return

    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(resolvedUrl)
      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`)
      }
      data.value = await response.json()
    } catch (err) {
      error.value = (err as Error).message
      data.value = null
    } finally {
      isLoading.value = false
    }
  }

  // url ref bo'lsa — o'zgarganida avtomatik qayta fetch
  watchEffect(() => {
    fetchData()
  })

  return { data, error, isLoading, refresh: fetchData }
}

// ========== Ishlatish ==========
// <script setup>
// const userId = ref(1)
// const { data: user, isLoading, error } = useFetch<User>(
//   computed(() => \`/api/users/\${userId.value}\`)
// )
// // userId o'zgarganda — avtomatik qayta fetch
// </script>`,
      description: 'useFetch — MaybeRef pattern bilan. URL ref bo\'lsa avtomatik qayta fetch. Generic tip bilan TypeScript qo\'llab-quvvatlash.',
    },
    {
      title: 'useLocalStorage — reaktiv localStorage',
      language: 'ts',
      code: `// composables/useLocalStorage.ts
import { ref, watch, type Ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  // localStorage dan o'qish
  const stored = localStorage.getItem(key)
  const data = ref<T>(
    stored ? JSON.parse(stored) : defaultValue
  ) as Ref<T>

  // O'zgarishlarni localStorage ga yozish
  watch(
    data,
    (newValue) => {
      if (newValue === null || newValue === undefined) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify(newValue))
      }
    },
    { deep: true }  // nested object o'zgarishlarini ham kuzatish
  )

  return data
}

// ========== Ishlatish ==========
// <script setup>
// import { useLocalStorage } from '@/composables/useLocalStorage'
//
// // Oddiy qiymat
// const theme = useLocalStorage<'light' | 'dark'>('theme', 'light')
// theme.value = 'dark'  // avtomatik localStorage ga yoziladi
//
// // Object
// const settings = useLocalStorage('settings', {
//   language: 'uz',
//   fontSize: 16,
//   notifications: true,
// })
// settings.value.fontSize = 18  // deep watch — avtomatik saqlanadi
//
// // Massiv
// const favorites = useLocalStorage<number[]>('favorites', [])
// favorites.value.push(42)  // avtomatik saqlanadi
// </script>`,
      description: 'useLocalStorage — VueUse useStorage analog. ref va localStorage sinxronlashtiriladi. deep: true bilan nested o\'zgarishlar.',
    },
    {
      title: 'useIntersectionObserver — lazy loading',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

// ========== Composable ==========
function useIntersectionObserver(
  callback: (isIntersecting: boolean) => void,
  options: IntersectionObserverInit = { threshold: 0.1 }
) {
  const targetRef = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  function observe() {
    if (!targetRef.value) return

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        callback(entry.isIntersecting)
      })
    }, options)

    observer.observe(targetRef.value)
  }

  function disconnect() {
    observer?.disconnect()
    observer = null
  }

  // targetRef o'zgarganda kuzatishni boshlash
  import('vue').then(({ watch }) => {
    watch(targetRef, (el) => {
      disconnect()
      if (el) observe()
    })
  })

  onUnmounted(disconnect)

  return { targetRef }
}

// ========== Ishlatish — Lazy Image ==========
const isVisible = ref(false)
const imageLoaded = ref(false)

const { targetRef } = useIntersectionObserver(
  (intersecting) => {
    if (intersecting) {
      isVisible.value = true
    }
  },
  { threshold: 0.1, rootMargin: '100px' }
)
</script>

<template>
  <div ref="targetRef" class="min-h-[200px]">
    <img
      v-if="isVisible"
      src="https://picsum.photos/600/400"
      alt="Lazy image"
      @load="imageLoaded = true"
      :class="{ 'opacity-0': !imageLoaded, 'opacity-100 transition-opacity': imageLoaded }"
    />
    <div v-else class="bg-gray-200 animate-pulse h-full rounded" />
  </div>
</template>`,
      description: 'useIntersectionObserver — element ko\'rinish zonasiga kirganda callback. Lazy loading, infinite scroll uchun.',
    },
  ],
  interviewQA: [
    {
      question: 'Composable nima? React custom hook dan farqi nima?',
      answer: `Composable — Vue Composition API asosidagi qayta ishlatiladigan logika funksiyasi. "use" prefiksi bilan boshlanadi, ref/computed/watch/lifecycle hooks ishlatadi. React custom hook bilan o'xshash, LEKIN muhim farqlar: 1) Vue composable setup() da BITTA MARTA chaqiriladi, React hook HAR RENDERDA. 2) Vue-da dependency array kerak emas — avtomatik tracking. 3) Vue-da stale closure muammosi yo'q. 4) Vue composable modul darajasida state ulashishi mumkin (singleton pattern).`,
    },
    {
      question: 'Composable dan ref qaytarish kerakmi yoki reactive?',
      answer: `ref() qaytarish TAVSIYA etiladi. Sabab: reactive() object destructure qilinganda reaktivlik yo'qoladi. ref() bilan: const { x, y } = useMouse() — x, y reaktiv qoladi. Agar reactive qaytarish xohlasangiz — toRefs() bilan o'rash kerak. Lekin eng oddiy va xavfsiz usul — har bir qiymat uchun alohida ref qaytarish. Bu VueUse kutubxonasining standart patterni.`,
    },
    {
      question: 'VueUse nima? Eng foydali composable-lar qaysilar?',
      answer: `VueUse — 200+ tayyor composable to'plami (@vueuse/core). Eng foydali: useStorage — reaktiv localStorage, useDark — dark mode, useIntersectionObserver — lazy loading, useVirtualList — katta ro'yxat virtualizatsiyasi, useFetch — API chaqiruv, useMediaQuery — responsive, useEventListener — avtomatik tozalash, useDebounceFn/useThrottleFn. Tree-shakeable — faqat import qilingan composable bundle-ga tushadi.`,
    },
    {
      question: 'Composable ichida lifecycle hook ishlatsa bo\'ladimi?',
      answer: `Ha, lekin composable DOIM setup() yoki <script setup> ichida chaqirilishi SHART. Chunki lifecycle hooks (onMounted, onUnmounted) faqat aktiv komponent kontekstida ishlaydi. Agar composable setup tashqarisida chaqirilsa — lifecycle hooks ISHLAMAYDI, xatolik beradi. Bu React hooks qoidasi bilan bir xil — faqat komponent yoki boshqa hook ichida chaqirish mumkin.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'composition-api', label: 'Composition API' },
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'reactivity-deep', label: 'Reaktivlik chuqur' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'lifecycle', label: 'Lifecycle Hooks' },
  ],
}
