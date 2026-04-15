import type { Topic } from '../../../types'

export const typedComposables: Topic = {
  id: 'typed-composables',
  title: 'Typed Composables',
  importance: 2,
  status: 'to-learn',
  description: 'Type-safe composablelar yozish — MaybeRef<T>, MaybeRefOrGetter<T>, function overloads, generic composables, toValue()',
  content: `Composablelar — Vue Composition API ning eng kuchli patterni. TypeScript bilan birga ishlatganda, ular to'liq type-safe bo'ladi va IDE autocomplete mukammal ishlaydi.

═══════════════════════════════════════
  COMPOSABLE NIMA VA NIMA UCHUN TIPIZATSIYA
═══════════════════════════════════════

Composable — "use" prefiksi bilan boshlanadigan funksiya bo'lib,
Vue reaktiv API (ref, computed, watch, lifecycle) dan foydalanadi
va reaktiv holatni qaytaradi.

TypeScript bilan tipizatsiya qilish sabablari:
  1) Return type aniq — IDE autocomplete to'g'ri ishlaydi
  2) Parametrlar tekshiriladi — noto'g'ri argument compile da tutiladi
  3) Generic composable — turli tiplar bilan qayta ishlatish
  4) Overloads — turli chaqirish variantlari uchun turli return tip

Yaxshi tipizatsiya qilingan composable — KUTUBXONA SIFATIDA
tarqatish mumkin. VueUse — eng yaxshi misol.

═══════════════════════════════════════
  MaybeRef<T> VA MaybeRefOrGetter<T>
═══════════════════════════════════════

VueUse va Vue core da keng ishlatiladigan utility tiplar:

  type MaybeRef<T> = T | Ref<T>
  // Qiymat YOKI ref qabul qiladi

  type MaybeRefOrGetter<T> = T | Ref<T> | (() => T)
  // Qiymat YOKI ref YOKI getter function qabul qiladi

Nima uchun kerak? Composable ham oddiy qiymat, ham ref, ham
computed qabul qilishi uchun — moslashuvchan API.

  function useFetch(url: MaybeRefOrGetter<string>) {
    // url — string, ref<string>, yoki () => string bo'lishi mumkin
    const resolvedUrl = toValue(url) // har doim string qaytaradi
  }

  // BARCHA VARIANTLAR ISHLAYDI:
  useFetch('/api/users')                      // oddiy string
  useFetch(ref('/api/users'))                  // ref
  useFetch(computed(() => '/api/' + id.value)) // computed (getter)
  useFetch(() => '/api/users/' + id.value)     // getter function

═══════════════════════════════════════
  toValue() — UNIVERSAL RESOLVER
═══════════════════════════════════════

Vue 3.3+ da qo'shilgan toValue() — MaybeRefOrGetter dan
haqiqiy qiymatni olish uchun:

  import { toValue } from 'vue'

  toValue(ref('hello'))        // 'hello' (ref.value)
  toValue('hello')             // 'hello' (o'zi)
  toValue(() => 'hello')       // 'hello' (function chaqiradi)

Vue 3.3 dan OLDIN unref() ishlatilgan — lekin u getter
function ni QO'LLAB-QUVVATLAMAYDI:
  unref(ref('hello'))    // 'hello' — ishlaydi
  unref(() => 'hello')   // () => 'hello' — ISHLAMAYDI!

Shuning uchun toValue() TAVSIYA ETILADI — barcha variantlar ishlaydi.

═══════════════════════════════════════
  RETURN TYPE — OBJECT VS TUPLE
═══════════════════════════════════════

Composable qanday qaytarish kerak?

1) OBJECT — ko'p qiymat qaytarganda (tavsiya):
   function useMouse() {
     const x = ref(0)
     const y = ref(0)
     return { x, y } as const
   }
   const { x, y } = useMouse()

2) TUPLE — ikki qiymat (React hook pattern):
   function useToggle(initial = false) {
     const state = ref(initial)
     const toggle = () => { state.value = !state.value }
     return [state, toggle] as const
     // return tipi: readonly [Ref<boolean>, () => void]
   }
   const [isOpen, toggleOpen] = useToggle()

"as const" — MUHIM! Usiz TypeScript tuple ni array deb hisoblaydi
va aniq tiplar yo'qoladi:
  Usiz: (Ref<boolean> | (() => void))[]
  Bilan: readonly [Ref<boolean>, () => void]

═══════════════════════════════════════
  FUNCTION OVERLOADS
═══════════════════════════════════════

Bitta composable — turli parametrlar bilan turli natija:

  // Overload signatures:
  function useFetch(url: string): { data: Ref<unknown> }
  function useFetch<T>(url: string, parser: (raw: unknown) => T): { data: Ref<T> }

  // Implementation:
  function useFetch<T>(url: string, parser?: (raw: unknown) => T) {
    const data = ref<T | unknown>(null)
    // ...
    return { data }
  }

Ishlatish:
  const { data } = useFetch('/api/users')
  // data: Ref<unknown>

  const { data } = useFetch('/api/users', (raw) => raw as User[])
  // data: Ref<User[]>

═══════════════════════════════════════
  GENERIC COMPOSABLES
═══════════════════════════════════════

Composable o'zi generic bo'lishi mumkin:

  function useLocalStorage<T>(key: string, defaultValue: T) {
    const data = ref<T>(defaultValue) as Ref<T>
    // T — string, number, object — istalgan tip
    return data
  }

  const count = useLocalStorage('count', 0)       // Ref<number>
  const user = useLocalStorage('user', { name: '' }) // Ref<{name: string}>

Generic constraint bilan:
  function useApi<T extends { id: number }>(endpoint: string) {
    const items = ref<T[]>([]) as Ref<T[]>
    const getById = (id: number) => items.value.find(i => i.id === id)
    return { items, getById }
  }

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React custom hooks VA Vue composables — asosan bir xil pattern:

React:
  function useLocalStorage<T>(key: string, initial: T) {
    const [value, setValue] = useState<T>(() => {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initial
    })
    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])
    return [value, setValue] as const
  }

Vue:
  function useLocalStorage<T>(key: string, initial: T) {
    const data = ref<T>(initial) as Ref<T>
    watchEffect(() => {
      localStorage.setItem(key, JSON.stringify(data.value))
    })
    return data
  }

ASOSIY FARQLAR:
  1) React: useState + useEffect — ikki hook birga ishlatiladi
     Vue: ref + watchEffect — reactive system o'zi hal qiladi
  2) React: dependency array ([key, value]) — MANUAL tracking
     Vue: watchEffect — AVTOMATIK dependency tracking
  3) React: Ref<T> konsepti YO'Q — primitiv qiymatlar
     Vue: Ref<T>, MaybeRef<T> — wrapper tiplar kerak
  4) React hooks QOIDALARI bor (top level, no conditions)
     Vue composable — oddiy function, qoidalar YO'Q
  5) React: tuple return ([value, setter]) keng tarqalgan
     Vue: object return ({ data, error, loading }) ko'proq`,
  codeExamples: [
    {
      title: 'useFetch<T> — to\'liq tipizatsiya qilingan composable',
      language: 'ts',
      code: `import { ref, watchEffect, toValue, type Ref, type MaybeRefOrGetter } from 'vue'

// ── Tiplar ──
interface UseFetchOptions<T> {
  immediate?: boolean
  transform?: (raw: unknown) => T
  onError?: (error: Error) => void
}

interface UseFetchReturn<T> {
  data: Ref<T | null>
  error: Ref<Error | null>
  isLoading: Ref<boolean>
  execute: () => Promise<void>
  abort: () => void
}

// ── Composable ──
export function useFetch<T = unknown>(
  url: MaybeRefOrGetter<string>,
  options: UseFetchOptions<T> = {}
): UseFetchReturn<T> {
  const { immediate = true, transform, onError } = options

  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<Error | null>(null)
  const isLoading = ref(false)
  let controller: AbortController | null = null

  async function execute(): Promise<void> {
    // toValue — ref, getter, yoki oddiy qiymatni resolve qiladi
    const resolvedUrl = toValue(url)

    controller?.abort()
    controller = new AbortController()

    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(resolvedUrl, {
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`)
      }

      const raw = await response.json()
      data.value = transform ? transform(raw) : (raw as T)
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return
      const err = e instanceof Error ? e : new Error(String(e))
      error.value = err
      onError?.(err)
    } finally {
      isLoading.value = false
    }
  }

  function abort(): void {
    controller?.abort()
  }

  // URL o'zgarganda avtomatik qayta fetch
  if (immediate) {
    watchEffect(() => {
      // toValue(url) ichida reactive dependency tracking ishlaydi
      execute()
    })
  }

  return { data, error, isLoading, execute, abort }
}

// ═══ ISHLATISH ═══
// const { data, isLoading, error } = useFetch<User[]>(
//   () => \`/api/users?page=\${page.value}\`,
//   {
//     transform: (raw) => (raw as { users: User[] }).users,
//     onError: (err) => console.error(err),
//   }
// )`,
      description: 'To\'liq tipizatsiya qilingan useFetch: MaybeRefOrGetter URL, AbortController, transform function, generic T tipi. VueUse uslubida.',
    },
    {
      title: 'useLocalStorage<T> — generic composable + overloads',
      language: 'ts',
      code: `import { ref, watch, type Ref } from 'vue'

// ── Serializer interface ──
interface Serializer<T> {
  read: (raw: string) => T
  write: (value: T) => string
}

// ── Default serializers ──
const jsonSerializer: Serializer<any> = {
  read: (raw) => JSON.parse(raw),
  write: (value) => JSON.stringify(value),
}

const stringSerializer: Serializer<string> = {
  read: (raw) => raw,
  write: (value) => value,
}

// ── Overloads — turli chaqirish, turli natija ──
export function useLocalStorage(key: string, defaultValue: string): Ref<string>
export function useLocalStorage(key: string, defaultValue: number): Ref<number>
export function useLocalStorage(key: string, defaultValue: boolean): Ref<boolean>
export function useLocalStorage<T>(key: string, defaultValue: T, serializer?: Serializer<T>): Ref<T>

// ── Implementation ──
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  serializer?: Serializer<T>,
): Ref<T> {
  // Serializer tanlash
  const ser = serializer ?? (
    typeof defaultValue === 'string'
      ? stringSerializer as unknown as Serializer<T>
      : jsonSerializer as Serializer<T>
  )

  // localStorage dan o'qish
  function read(): T {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? ser.read(raw) : defaultValue
    } catch {
      return defaultValue
    }
  }

  const data = ref<T>(read()) as Ref<T>

  // O'zgarishlarni localStorage ga yozish
  watch(data, (newValue) => {
    try {
      if (newValue === null || newValue === undefined) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, ser.write(newValue))
      }
    } catch (e) {
      console.warn(\`localStorage write failed for key "\${key}":\`, e)
    }
  }, { deep: true })

  // Boshqa tab dagi o'zgarishlarni eshitish
  window.addEventListener('storage', (event) => {
    if (event.key === key) {
      data.value = event.newValue !== null
        ? ser.read(event.newValue)
        : defaultValue
    }
  })

  return data
}

// ═══ ISHLATISH ═══
// const name = useLocalStorage('name', 'Guest')
// // name: Ref<string> — overload tufayli ANIQ tip
//
// const count = useLocalStorage('count', 0)
// // count: Ref<number>
//
// interface Settings { theme: 'dark' | 'light'; lang: string }
// const settings = useLocalStorage<Settings>('settings', {
//   theme: 'light',
//   lang: 'uz',
// })
// // settings: Ref<Settings>`,
      description: 'Generic composable + function overloads. Primitive tiplar uchun avtomatik tip inference, murakkab tiplar uchun generic parametr. Cross-tab sync.',
    },
    {
      title: 'MaybeRefOrGetter<T> va toValue() — moslashuvchan API',
      language: 'ts',
      code: `import {
  ref,
  computed,
  watchEffect,
  toValue,
  type Ref,
  type MaybeRef,
  type MaybeRefOrGetter,
} from 'vue'

// ═══ MaybeRef<T> — qiymat YOKI ref ═══
type MaybeRef<T> = T | Ref<T>

// ═══ MaybeRefOrGetter<T> — qiymat, ref, YOKI getter ═══
type MaybeRefOrGetter<T> = T | Ref<T> | (() => T)

// ═══ toValue() — universal resolver ═══
// toValue(ref('hello'))      → 'hello'
// toValue('hello')           → 'hello'
// toValue(() => 'hello')     → 'hello'

// ── Misol: useTitle ──
export function useTitle(
  title: MaybeRefOrGetter<string>
): Ref<string> {
  const titleRef = ref(toValue(title))

  watchEffect(() => {
    document.title = toValue(title)
    titleRef.value = toValue(title)
  })

  return titleRef
}

// Barcha variantlar ishlaydi:
// useTitle('Statik sarlavha')
// useTitle(ref('Reaktiv sarlavha'))
// useTitle(computed(() => \`\${page.value} — Sayt\`))
// useTitle(() => route.meta.title as string)

// ── Misol: useDebounce ──
export function useDebounce<T>(
  value: MaybeRefOrGetter<T>,
  delay: MaybeRef<number> = 300
): Readonly<Ref<T>> {
  const debounced = ref<T>(toValue(value)) as Ref<T>
  let timer: ReturnType<typeof setTimeout>

  watchEffect(() => {
    const val = toValue(value)
    const ms = toValue(delay)
    clearTimeout(timer)
    timer = setTimeout(() => {
      debounced.value = val
    }, ms)
  })

  return debounced
}

// Ishlatish:
// const searchQuery = ref('')
// const debouncedQuery = useDebounce(searchQuery, 500)
// const debouncedQuery = useDebounce(() => input.value.trim(), 300)

// ── Misol: useClamp ──
export function useClamp(
  value: MaybeRefOrGetter<number>,
  min: MaybeRefOrGetter<number>,
  max: MaybeRefOrGetter<number>,
): Readonly<Ref<number>> {
  return computed(() => {
    const v = toValue(value)
    const lo = toValue(min)
    const hi = toValue(max)
    return Math.min(Math.max(v, lo), hi)
  })
}

// Barcha argumentlar reaktiv bo'lishi mumkin:
// const clamped = useClamp(
//   () => rawValue.value,
//   computed(() => config.min),
//   ref(100),
// )`,
      description: 'MaybeRef va MaybeRefOrGetter bilan moslashuvchan composable API. toValue() universal resolver. Amaliy misollar: useTitle, useDebounce, useClamp.',
    },
    {
      title: 'Composable return type — as const va type narrowing',
      language: 'ts',
      code: `import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'

// ═══ OBJECT RETURN — Tavsiya etiladigan pattern ═══
interface UseMouseReturn {
  x: Readonly<Ref<number>>
  y: Readonly<Ref<number>>
  isInside: Readonly<Ref<boolean>>
  sourceType: Readonly<Ref<'mouse' | 'touch'>>
}

export function useMouse(target?: MaybeRefOrGetter<HTMLElement | null>): UseMouseReturn {
  const x = ref(0)
  const y = ref(0)
  const sourceType = ref<'mouse' | 'touch'>('mouse')
  const isInside = ref(false)

  function handleMouse(e: MouseEvent) {
    x.value = e.clientX
    y.value = e.clientY
    sourceType.value = 'mouse'
  }

  function handleTouch(e: TouchEvent) {
    if (e.touches.length > 0) {
      x.value = e.touches[0].clientX
      y.value = e.touches[0].clientY
      sourceType.value = 'touch'
    }
  }

  onMounted(() => {
    window.addEventListener('mousemove', handleMouse)
    window.addEventListener('touchmove', handleTouch)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouse)
    window.removeEventListener('touchmove', handleTouch)
  })

  // Readonly<Ref<T>> — tashqi kod o'zgartira olmasin
  return { x, y, isInside, sourceType }
}

// ═══ TUPLE RETURN — React hook pattern ═══
export function useToggle(
  initialValue: boolean = false
): readonly [Ref<boolean>, (value?: boolean) => void] {
  const state = ref(initialValue)

  function toggle(value?: boolean) {
    state.value = value !== undefined ? value : !state.value
  }

  // as const — TUPLE TIP uchun majburiy!
  return [state, toggle] as const
  // Usiz: (Ref<boolean> | ((v?: boolean) => void))[]
  // Bilan: readonly [Ref<boolean>, (v?: boolean) => void]
}

// ═══ CONDITIONAL RETURN — overloads bilan ═══
interface AsyncReturn<T> {
  data: Ref<T | null>
  pending: Ref<boolean>
}

interface AsyncReturnWithError<T> extends AsyncReturn<T> {
  error: Ref<Error | null>
}

export function useAsync<T>(fn: () => Promise<T>): AsyncReturn<T>
export function useAsync<T>(fn: () => Promise<T>, withError: true): AsyncReturnWithError<T>
export function useAsync<T>(fn: () => Promise<T>, withError = false) {
  const data = ref<T | null>(null) as Ref<T | null>
  const pending = ref(true)
  const error = ref<Error | null>(null)

  fn()
    .then(result => { data.value = result })
    .catch(err => { error.value = err })
    .finally(() => { pending.value = false })

  return withError
    ? { data, pending, error }
    : { data, pending }
}

// const { data, pending } = useAsync(() => fetchUsers())
// const { data, pending, error } = useAsync(() => fetchUsers(), true)`,
      description: 'Return type strategiyalari: object (tavsiya), tuple (as const bilan), conditional (overloads). Readonly<Ref<T>> bilan himoya.',
    },
    {
      title: 'React custom hook vs Vue composable — TypeScript bilan',
      language: 'ts',
      code: `// ═══════════════════════════════════════
//  REACT — useDebounce hook
// ═══════════════════════════════════════

import { useState, useEffect, useRef } from 'react'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => clearTimeout(timer)
  }, [value, delay])        // <-- MANUAL dependency array

  return debouncedValue     // oddiy qiymat qaytaradi
}

// Ishlatish:
// const debouncedSearch = useDebounce(searchTerm, 300)
// T avtomatik infer bo'ladi

// ═══════════════════════════════════════
//  VUE — useDebounce composable
// ═══════════════════════════════════════

import { ref, toValue, watchEffect, type MaybeRefOrGetter, type Ref } from 'vue'

function useDebounceVue<T>(
  value: MaybeRefOrGetter<T>,  // <-- ref, getter, yoki oddiy qiymat
  delay: MaybeRef<number> = 300
): Readonly<Ref<T>> {
  const debounced = ref<T>(toValue(value)) as Ref<T>
  let timer: ReturnType<typeof setTimeout>

  watchEffect(() => {          // <-- AVTOMATIK dependency tracking
    const val = toValue(value)
    const ms = toValue(delay)
    clearTimeout(timer)
    timer = setTimeout(() => {
      debounced.value = val
    }, ms)
  })

  return debounced             // Ref<T> qaytaradi
}

// FARQLAR:
// 1. React: FAQAT primitive qabul qiladi, ref konsepti yo'q
//    Vue: MaybeRefOrGetter — ref, getter, yoki oddiy qiymat
//
// 2. React: useEffect + dependency array (MANUAL)
//    Vue: watchEffect (AVTOMATIK tracking)
//
// 3. React: qayta render har safar chaqiriladi
//    Vue: bir marta chaqiriladi, ichidagi ref lar reaktiv
//
// 4. React: T (primitive) qaytaradi
//    Vue: Ref<T> (wrapper) qaytaradi
//
// 5. React: hooks rules (top-level, no conditions)
//    Vue: oddiy function — chaqirish joyi cheklanmagan`,
      description: 'Bir xil useDebounce — React va Vue da. React manual dependency, Vue avtomatik tracking. MaybeRefOrGetter Vue API ni moslashuvchan qiladi.',
    },
  ],
  interviewQA: [
    {
      question: 'MaybeRefOrGetter<T> nima va nima uchun composable parametrlarida ishlatiladi?',
      answer: `MaybeRefOrGetter<T> = T | Ref<T> | (() => T) — composable parametri uchun UNIVERSAL tip. Bu composable ni moslashuvchan qiladi: foydalanuvchi oddiy qiymat, ref, computed, yoki getter function berishi mumkin. Masalan useFetch(url) — url sifatida '/api/users' (string), ref('/api/users') (ref), yoki () => '/api/' + id.value (getter) berish mumkin. Composable ichida toValue(url) orqali haqiqiy qiymat olinadi. Bu VueUse kutubxonasida STANDART pattern — deyarli barcha composable lar MaybeRefOrGetter qabul qiladi.`,
    },
    {
      question: 'toValue() va unref() farqi nima? Qachon qaysi birini ishlatish kerak?',
      answer: `unref() — faqat Ref<T> va T ni hal qiladi: unref(ref('a')) → 'a', unref('a') → 'a'. Lekin getter function ni QO'LLAB-QUVVATLAMAYDI: unref(() => 'a') → () => 'a' (function qaytaradi!). toValue() (Vue 3.3+) — ref, oddiy qiymat, VA getter function ni hal qiladi: toValue(() => 'a') → 'a'. Doimo toValue() ISHLATISH KERAK — u MaybeRefOrGetter<T> ning barcha variantlarini to'g'ri resolve qiladi. unref faqat legacy kod yoki MaybeRef<T> (getter yo'q) bilan ishlashda kerak.`,
    },
    {
      question: 'Composable da "as const" nima uchun kerak?',
      answer: `"as const" — TypeScript da tuple tipini ANIQ belgilash uchun. Usiz return [state, toggle] ning tipi (Ref<boolean> | () => void)[] — array, har bir element UNION. Bu destructure da muammo: const [s, t] = useToggle() — s va t ning tipi Ref<boolean> | () => void. "as const" bilan return [state, toggle] as const — tipi readonly [Ref<boolean>, () => void] — TUPLE. Endi s: Ref<boolean>, t: () => void — ANIQ tiplar. Object return da "as const" shart emas — lekin readonly yaxshiroq.`,
    },
    {
      question: 'Vue composable va React custom hook orasidagi asosiy farqlar nima?',
      answer: `1) CHAQIRISH: React hook — har render da qayta chaqiriladi, Vue composable — BIR MARTA (setup da). 2) DEPENDENCY: React — useEffect dependency array (manual), Vue — watchEffect (avtomatik tracking). 3) RULES: React — hooks rules (top-level only, no conditions), Vue — oddiy function, cheklov yo'q. 4) RETURN: React — primitive/array qaytaradi, Vue — Ref<T> qaytaradi. 5) PARAMETR: React — faqat primitive, Vue — MaybeRefOrGetter (moslashuvchan). 6) LIFECYCLE: React — useEffect cleanup bilan, Vue — onMounted/onUnmounted. Natija: Vue composable — bir marta ishga tushiriladigan reaktiv tizim, React hook — har render da qayta bajariladigan function.`,
    },
    {
      question: 'Generic composable qanday yoziladi va qachon kerak?',
      answer: `Generic composable — TypeScript generic parametrli composable function. Misol: function useLocalStorage<T>(key: string, defaultValue: T): Ref<T>. T — foydalanuvchi bergan qiymatdan AVTOMATIK INFER bo'ladi. Qachon kerak: 1) Composable turli tiplar bilan ishlashi kerak (useLocalStorage — string, object, array), 2) Return tipi input tipiga BOG'LIQ (useFetch<T> — data: Ref<T>), 3) Type-safe collection operatsiyalar (useFilter<T>, useSort<T>). Constraint qo'shish ham mumkin: <T extends Serializable> — faqat serialize qilinadigan tiplar. Overloads bilan birga ishlatilganda — turli chaqirish variantlari uchun turli return tiplar beriladi.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'composables', label: 'Composables' },
    { techId: 'vue-js', sectionId: 'vue-typescript', topicId: 'props-emits-typing', label: 'Props & Emits tipizatsiya' },
    { techId: 'vue-js', sectionId: 'vue-typescript', topicId: 'generic-components', label: 'Generic komponentlar' },
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'ref-reactive', label: 'ref va reactive' },
  ],
}
