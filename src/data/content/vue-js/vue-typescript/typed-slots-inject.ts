import type { Topic } from '../../../types'

export const typedSlotsInject: Topic = {
  id: 'typed-slots-inject',
  title: 'Typed Slots & Inject',
  importance: 2,
  status: 'to-learn',
  description: 'defineSlots<T>(), InjectionKey<T>, Symbol injection, typed template refs, InstanceType, ComponentExposed — chuqur tipizatsiya',
  content: `Vue 3 da slotlar, provide/inject, template ref lar ham to'liq tipizatsiya qilinadi. Bu DX ni sezilarli yaxshilaydi va xatolarni compile vaqtida tutadi.

═══════════════════════════════════════
  defineSlots<T>() — TIPLI SLOTLAR
═══════════════════════════════════════

Vue 3.3+ da defineSlots makrosi qo'shildi. Bu slotlarning
nomini va props tipini belgilaydi:

  defineSlots<{
    default(props: { item: User; index: number }): any
    header(props: { title: string }): any
    footer(): any   // props yo'q
  }>()

MUHIM NUANSLAR:
  - defineSlots FAQAT TIP UCHUN — runtime effekti YO'Q
  - Return tipi doimo any — Vue template return tipini tekshirmaydi
  - defineSlots qaytargan object — slots proxy (ishlatilmaydi odatda)
  - Agar defineSlots ishlatilmasa — slotlar TIPIZATSIYA QILINMAYDI

defineSlots + generic birgalikda kuchli:
  <script setup lang="ts" generic="T">
  defineProps<{ items: T[] }>()
  defineSlots<{
    default(props: { item: T; index: number }): any
  }>()
  </script>
  // Endi ota komponentda slot props T tipida bo'ladi

Vue 3.3 dan OLDIN slot tiplar faqat runtime da aniqlangan —
IDE ko'rsatmagan, TypeScript tekshirmagan.

═══════════════════════════════════════
  InjectionKey<T> — TYPE-SAFE PROVIDE/INJECT
═══════════════════════════════════════

Oddiy provide/inject da TIP YO'QOLADI:
  provide('theme', ref('dark'))
  const theme = inject('theme')  // unknown!

InjectionKey bilan TIP SAQLANADI:
  import { type InjectionKey, type Ref } from 'vue'

  const themeKey: InjectionKey<Ref<'light' | 'dark'>> = Symbol('theme')
  provide(themeKey, ref('dark'))
  const theme = inject(themeKey)  // Ref<'light' | 'dark'> | undefined

InjectionKey — bu TypeScript utility type bo'lib, Symbol ni
generic tip bilan bog'laydi. Aslida runtime da ODDIY Symbol,
lekin TypeScript uchun tip ma'lumoti beradi.

DEFAULT QIYMAT bilan inject:
  const theme = inject(themeKey, ref('light'))
  // Endi undefined bo'lmaydi — Ref<'light' | 'dark'>

MUHIM: Default qiymat bersangiz, return tipi undefined EMAS —
TypeScript buni to'g'ri infer qiladi.

═══════════════════════════════════════
  SYMBOL INJECTION KEYS — BEST PRACTICE
═══════════════════════════════════════

Katta loyihalarda injection keys ni alohida faylga chiqarish:

  // injection-keys.ts
  export const userKey: InjectionKey<Ref<User | null>> = Symbol('user')
  export const configKey: InjectionKey<AppConfig> = Symbol('config')
  export const loggerKey: InjectionKey<Logger> = Symbol('logger')

Nima uchun Symbol?
  1) UNIKAL — tasodifiy nom to'qnashuvi bo'lmaydi
  2) DevTools da tushunarli nom: Symbol('theme')
  3) Type-safe — InjectionKey<T> bilan tip bog'langan
  4) Centralized — barcha key lar bir joyda

String key hali ham ishlaydi lekin TAVSIYA ETILMAYDI:
  provide('theme', value)   // string — tip yo'qoladi
  provide(themeKey, value)  // Symbol — tip saqlanadi

═══════════════════════════════════════
  TYPED TEMPLATE REFS
═══════════════════════════════════════

Template ref — DOM element yoki komponent instansiyasiga murojaat.
TypeScript bilan tipizatsiya qilish:

DOM element ref:
  const inputRef = ref<HTMLInputElement | null>(null)
  // Template da: <input ref="inputRef" />
  // inputRef.value?.focus()  — HTMLInputElement metodlari

Komponent ref + InstanceType:
  import MyModal from './MyModal.vue'

  const modalRef = ref<InstanceType<typeof MyModal> | null>(null)
  // modalRef.value?.open()  — MyModal expose qilgan metodlar

Vue 3.5+ da useTemplateRef():
  const inputRef = useTemplateRef<HTMLInputElement>('input')
  // Template da: <input ref="input" />
  // Avvalgi: const input = ref<HTMLInputElement>(null)
  // useTemplateRef ANIQROQ — ref nomi string sifatida beriladi

═══════════════════════════════════════
  defineExpose VA ComponentExposed
═══════════════════════════════════════

<script setup> da barcha o'zgaruvchilar YOPIQ — tashqaridan
ko'rinmaydi. defineExpose() bilan ochish kerak:

  // MyModal.vue
  <script setup lang="ts">
  const isOpen = ref(false)
  function open() { isOpen.value = true }
  function close() { isOpen.value = false }

  defineExpose({ open, close })
  // Faqat open va close tashqaridan ko'rinadi
  </script>

Ota komponentda:
  const modalRef = ref<InstanceType<typeof MyModal> | null>(null)
  modalRef.value?.open()   // OK — exposed
  modalRef.value?.isOpen   // TYPE ERROR — exposed emas

Vue 3.x da ComponentExposed utility type ham mavjud (vue-component-type-helpers):
  import type { ComponentExposed } from 'vue-component-type-helpers'
  type ModalExposed = ComponentExposed<typeof MyModal>
  // { open: () => void; close: () => void }

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

SLOTS vs CHILDREN/RENDER PROPS:
  React da typed slots konsepti YO'Q — children: ReactNode yoki
  render prop: (item: T) => ReactNode ishlatiladi.
  Vue defineSlots<T>() — har bir slot nomi va props tipi belgilanadi.
  React yondashuvi SODDAROQ, Vue yondashuvi ANIQROQ.

PROVIDE/INJECT vs CONTEXT:
  React: createContext<T>() — tipli context yaratish.
    const ThemeCtx = createContext<Theme>('light')
    <ThemeCtx.Provider value={theme}>
    const theme = useContext(ThemeCtx)  // Theme — tip aniq

  Vue: InjectionKey<T> + provide/inject — Symbol bilan.
    const themeKey: InjectionKey<Ref<Theme>> = Symbol()
    provide(themeKey, theme)
    inject(themeKey)  // Ref<Theme> | undefined

  Farq: React Context DOIMO default qiymat talab qiladi (yoki | undefined).
  Vue inject — default qiymat ixtiyoriy, lekin usiz undefined bo'lishi mumkin.

TEMPLATE REFS vs useRef:
  React: const ref = useRef<HTMLInputElement>(null)
  Vue: const ref = ref<HTMLInputElement | null>(null)
  Deyarli bir xil. Lekin Vue da useTemplateRef (3.5+) — aniqroq.

EXPOSE vs forwardRef:
  React: forwardRef + useImperativeHandle — murakkab.
  Vue: defineExpose() — sodda va tushunarli.
  Vue InstanceType<typeof Component> — React da bunday YO'Q
  (React komponent — function, instance yo'q).`,
  codeExamples: [
    {
      title: 'defineSlots<T>() — tipli slotlar',
      language: 'html',
      code: `<!-- Tabs.vue — Typed slots bilan -->
<script setup lang="ts">
interface TabItem {
  key: string
  label: string
  icon?: string
  disabled?: boolean
}

interface Props {
  tabs: TabItem[]
  activeKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  activeKey: '',
})

const emit = defineEmits<{
  change: [key: string]
}>()

// ── Typed slots ──
defineSlots<{
  // Tab sarlavha qismi
  tab(props: { tab: TabItem; isActive: boolean }): any
  // Tab kontent qismi — har bir tab uchun
  panel(props: { tab: TabItem }): any
  // Bo'sh holat
  empty(): any
}>()

const activeTab = computed(() =>
  props.tabs.find(t => t.key === props.activeKey) ?? props.tabs[0]
)
</script>

<template>
  <div class="tabs">
    <!-- Tab headerlari -->
    <div class="tab-headers" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="{ active: tab.key === activeTab?.key }"
        :disabled="tab.disabled"
        @click="emit('change', tab.key)"
        role="tab"
      >
        <!-- Slot: tab header — ota o'z dizaynini berishi mumkin -->
        <slot name="tab" :tab="tab" :is-active="tab.key === activeTab?.key">
          <span v-if="tab.icon">{{ tab.icon }}</span>
          {{ tab.label }}
        </slot>
      </button>
    </div>

    <!-- Aktiv tab kontent -->
    <div v-if="activeTab" class="tab-panel" role="tabpanel">
      <slot name="panel" :tab="activeTab">
        <slot name="empty">
          <p>Kontent yo'q</p>
        </slot>
      </slot>
    </div>
  </div>
</template>

<!-- Ishlatish (ota komponent da): -->
<!--
<Tabs :tabs="tabs" :active-key="currentTab" @change="currentTab = $event">
  <template #tab="{ tab, isActive }">
    IDE autocomplete: tab: TabItem, isActive: boolean
    <span :class="{ bold: isActive }">{{ tab.icon }} {{ tab.label }}</span>
  </template>
  <template #panel="{ tab }">
    IDE autocomplete: tab: TabItem
    <component :is="panelComponents[tab.key]" />
  </template>
</Tabs>
-->`,
      description: 'defineSlots<T>() — har bir slot nomi va props tipi aniq. Ota komponentda IDE autocomplete to\'g\'ri ishlaydi.',
    },
    {
      title: 'InjectionKey<T> — type-safe provide/inject',
      language: 'ts',
      code: `// ═══ injection-keys.ts — Centralized keys ═══
import type { InjectionKey, Ref } from 'vue'

// ── Tiplar ──
export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

export interface AuthContext {
  user: Ref<User | null>
  isAuthenticated: Ref<boolean>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export interface ThemeContext {
  theme: Ref<'light' | 'dark'>
  toggleTheme: () => void
  primaryColor: Ref<string>
}

export interface I18nContext {
  locale: Ref<string>
  t: (key: string, params?: Record<string, string>) => string
  setLocale: (locale: string) => Promise<void>
  availableLocales: string[]
}

// ── InjectionKey lar — Symbol + TypeScript tip ──
export const authKey: InjectionKey<AuthContext> = Symbol('auth')
export const themeKey: InjectionKey<ThemeContext> = Symbol('theme')
export const i18nKey: InjectionKey<I18nContext> = Symbol('i18n')

// ═══ auth-provider.ts — Composable wrapper ═══
import { provide, inject } from 'vue'

export function provideAuth(context: AuthContext): void {
  provide(authKey, context)
}

export function useAuth(): AuthContext {
  const auth = inject(authKey)
  if (!auth) {
    throw new Error(
      'useAuth() is called without provider. ' +
      'Wrap your app with provideAuth().'
    )
  }
  return auth
  // Return tipi: AuthContext (ANIQ, undefined emas)
}

// ═══ App.vue da ishlatish ═══
// <script setup>
// import { provideAuth } from './auth-provider'
// provideAuth({
//   user: ref(null),
//   isAuthenticated: computed(() => !!user.value),
//   login: async (email, pass) => { ... },
//   logout: async () => { ... },
// })
// </script>

// ═══ Istalgan komponent da ═══
// <script setup>
// import { useAuth } from './auth-provider'
// const { user, isAuthenticated, logout } = useAuth()
// // BARCHA TIPLAR ANIQ — autocomplete ishlaydi
// </script>`,
      description: 'InjectionKey pattern — Symbol + TypeScript tip. Centralized keys fayli, composable wrapper (provideX + useX), throw bilan undefined himoyasi.',
    },
    {
      title: 'Typed Template Refs va useTemplateRef (Vue 3.5+)',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, useTemplateRef, onMounted, type ComponentPublicInstance } from 'vue'
import MyForm from './MyForm.vue'
import MyModal from './MyModal.vue'

// ═══ DOM Element Refs ═══

// Variant 1: Classic ref (Vue 3.0+)
const inputRef = ref<HTMLInputElement | null>(null)

// Variant 2: useTemplateRef (Vue 3.5+) — TAVSIYA
const canvasRef = useTemplateRef<HTMLCanvasElement>('canvas')
const videoRef = useTemplateRef<HTMLVideoElement>('video')

// ═══ Component Refs ═══

// InstanceType — komponent instansiya tipini olish
const formRef = ref<InstanceType<typeof MyForm> | null>(null)
const modalRef = ref<InstanceType<typeof MyModal> | null>(null)

// ═══ Ishlatish ═══
onMounted(() => {
  // DOM refs — element metodlari to'liq autocomplete
  inputRef.value?.focus()
  inputRef.value?.select()

  canvasRef.value?.getContext('2d')  // HTMLCanvasElement metodlari
  videoRef.value?.play()             // HTMLVideoElement metodlari

  // Component refs — defineExpose() orqali ochilgan metodlar
  formRef.value?.validate()    // MyForm expose qilgan
  formRef.value?.reset()       // MyForm expose qilgan
  modalRef.value?.open()       // MyModal expose qilgan
})

function submitForm() {
  // Null check bilan
  if (formRef.value) {
    const isValid = formRef.value.validate()
    if (isValid) {
      formRef.value.submit()
    }
  }
}

function openModal() {
  modalRef.value?.open()
}
</script>

<template>
  <!-- DOM refs -->
  <input ref="inputRef" type="text" />

  <!-- useTemplateRef — string nomi bilan bog'lanadi -->
  <canvas ref="canvas" width="400" height="300" />
  <video ref="video" src="/intro.mp4" />

  <!-- Component refs -->
  <MyForm ref="formRef" @submit="handleSubmit" />
  <MyModal ref="modalRef" title="Tasdiqlash">
    <p>Ishonchingiz komilmi?</p>
  </MyModal>

  <button @click="submitForm">Yuborish</button>
  <button @click="openModal">Modal ochish</button>
</template>`,
      description: 'DOM refs (HTMLInputElement, HTMLCanvasElement) va Component refs (InstanceType<typeof Component>). useTemplateRef — Vue 3.5+ yangi API.',
    },
    {
      title: 'defineExpose — komponent public API',
      language: 'html',
      code: `<!-- Stepper.vue — Step-by-step forma komponent -->
<script setup lang="ts">
import { ref, computed } from 'vue'

// ── Tiplar ──
interface StepConfig {
  key: string
  title: string
  validator?: () => boolean | Promise<boolean>
}

interface Props {
  steps: StepConfig[]
  initialStep?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialStep: 0,
})

const emit = defineEmits<{
  change: [stepIndex: number, stepKey: string]
  complete: []
}>()

// ── Internal state ──
const currentIndex = ref(props.initialStep)

const currentStep = computed(() => props.steps[currentIndex.value])
const isFirst = computed(() => currentIndex.value === 0)
const isLast = computed(() => currentIndex.value === props.steps.length - 1)
const progress = computed(() =>
  ((currentIndex.value + 1) / props.steps.length) * 100
)

// ── Methods ──
async function next(): Promise<boolean> {
  const step = currentStep.value
  if (step.validator) {
    const isValid = await step.validator()
    if (!isValid) return false
  }
  if (!isLast.value) {
    currentIndex.value++
    emit('change', currentIndex.value, currentStep.value.key)
  } else {
    emit('complete')
  }
  return true
}

function prev(): void {
  if (!isFirst.value) {
    currentIndex.value--
    emit('change', currentIndex.value, currentStep.value.key)
  }
}

function goTo(index: number): void {
  if (index >= 0 && index < props.steps.length) {
    currentIndex.value = index
    emit('change', index, props.steps[index].key)
  }
}

function reset(): void {
  currentIndex.value = props.initialStep
}

// ═══ defineExpose — PUBLIC API ═══
// Faqat bu metodlar tashqaridan ko'rinadi
defineExpose({
  next,             // () => Promise<boolean>
  prev,             // () => void
  goTo,             // (index: number) => void
  reset,            // () => void
  currentIndex,     // Ref<number> (readonly ishlatish tavsiya)
  currentStep,      // ComputedRef<StepConfig>
  progress,         // ComputedRef<number>
})
</script>

<template>
  <div class="stepper">
    <div class="stepper-progress" :style="{ width: progress + '%' }" />
    <div class="stepper-content">
      <slot :step="currentStep" :index="currentIndex" />
    </div>
    <div class="stepper-actions">
      <button v-if="!isFirst" @click="prev">Orqaga</button>
      <button @click="next">{{ isLast ? 'Tugatish' : 'Keyingi' }}</button>
    </div>
  </div>
</template>

<!-- Ota komponentda ishlatish: -->
<!--
<script setup lang="ts">
import Stepper from './Stepper.vue'

const stepperRef = ref<InstanceType<typeof Stepper> | null>(null)

// Tashqaridan boshqarish:
function skipToLast() {
  stepperRef.value?.goTo(steps.length - 1)
}

// TypeScript: stepperRef.value?.next() — Promise<boolean>
// TypeScript: stepperRef.value?.progress — number
// TypeScript: stepperRef.value?.currentIndex — number
</script>

<Stepper ref="stepperRef" :steps="steps" @complete="onDone">
  <template #default="{ step, index }">
    <StepContent :step="step" :index="index" />
  </template>
</Stepper>
-->`,
      description: 'defineExpose bilan aniq public API. InstanceType<typeof Component> — tashqaridan tipli murojaat. next, prev, goTo, reset — exposed metodlar.',
    },
    {
      title: 'React Context vs Vue Provide/Inject — TypeScript bilan',
      language: 'ts',
      code: `// ═══════════════════════════════════════
//  REACT — createContext<T>
// ═══════════════════════════════════════

import { createContext, useContext, useState, type ReactNode } from 'react'

interface AuthContextType {
  user: User | null
  login: (email: string, pass: string) => Promise<void>
  logout: () => void
}

// Context yaratish — default qiymat MAJBURIY (yoki null + assertion)
const AuthContext = createContext<AuthContextType | null>(null)

// Provider komponent
function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, pass: string) => { /* ... */ }
  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook — throw bilan null guard
function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be within AuthProvider')
  return context
}

// ═══════════════════════════════════════
//  VUE — InjectionKey<T> + provide/inject
// ═══════════════════════════════════════

import { provide, inject, ref, type InjectionKey, type Ref } from 'vue'

interface AuthContextVue {
  user: Ref<User | null>
  login: (email: string, pass: string) => Promise<void>
  logout: () => void
}

// InjectionKey — Symbol + tip
const authKey: InjectionKey<AuthContextVue> = Symbol('auth')

// Provider — oddiy composable
function provideAuth() {
  const user = ref<User | null>(null)
  const login = async (email: string, pass: string) => { /* ... */ }
  const logout = () => { user.value = null }
  provide(authKey, { user, login, logout })
}

// Consumer — composable
function useAuthVue(): AuthContextVue {
  const auth = inject(authKey)
  if (!auth) throw new Error('useAuth: AuthProvider topilmadi')
  return auth  // AuthContextVue — ANIQ tip
}

// FARQLAR:
// React: JSX Provider komponent (<AuthContext.Provider>)
// Vue: provide() function — JSX wrapper kerak emas
//
// React: createContext(defaultValue) — default MAJBURIY
// Vue: InjectionKey + inject() — default IXTIYORIY
//
// React: user — oddiy state (re-render triggerlaydi)
// Vue: user — Ref (reaktiv, re-render avtomatik)
//
// React: Context.Consumer (legacy) + useContext (modern)
// Vue: inject() — doimo bir xil API`,
      description: 'React createContext vs Vue InjectionKey — tipizatsiya yondashuvlari. React JSX wrapper, Vue function-based. Ikkalasida null guard pattern.',
    },
  ],
  interviewQA: [
    {
      question: 'defineSlots<T>() nima va u nima muammoni hal qiladi?',
      answer: `defineSlots<T>() — Vue 3.3+ da qo'shilgan compiler makrosi bo'lib, slot nomlarini va ularning props tiplarini belgilaydi. Usiz slotlar TIPIZATSIYA QILINMAYDI — ota komponentda scoped slot props uchun autocomplete ishlamaydi, noto'g'ri props nomi berish xato bermaydi. defineSlots bilan: defineSlots<{ default(props: { item: User }): any }>() — endi ota komponentda #default="{ item }" da item ANIQ User tipida bo'ladi. Bu FAQAT tip uchun — runtime effekti yo'q. Generic komponentlar bilan birga ishlatilganda ayniqsa kuchli: T tipidagi ma'lumot slot orqali type-safe uzatiladi.`,
    },
    {
      question: 'InjectionKey<T> va oddiy string key farqi nima? Nima uchun Symbol ishlatiladi?',
      answer: `String key: provide('theme', value) — TypeScript tip aniqlay OLMAYDI, inject('theme') — unknown qaytaradi. InjectionKey<T>: const key: InjectionKey<Ref<Theme>> = Symbol('theme') — inject(key) aniq Ref<Theme> | undefined qaytaradi. Symbol ishlatish sabablari: 1) UNIKAL — ikki kutubxona bir xil string key ishlatsa to'qnashadi, Symbol bilan mumkin emas, 2) TIP BOG'LANADI — InjectionKey generic orqali, 3) DevTools da ko'rinadi — Symbol('theme') nomi bor. Best practice: injection-keys.ts faylida barcha keylarni centralized saqlash, har bir key uchun composable wrapper (provideX + useX) yozish.`,
    },
    {
      question: 'InstanceType<typeof Component> nima va qachon ishlatiladi?',
      answer: `InstanceType<typeof MyComponent> — TypeScript utility type bo'lib, Vue komponent instansiyasining tipini olish uchun ishlatiladi. template ref orqali komponentga murojaat qilganda kerak: const modalRef = ref<InstanceType<typeof MyModal> | null>(null). Bu modalRef.value da defineExpose() orqali ochilgan metodlar va computed lar uchun autocomplete beradi. React da bu konsept YO'Q — React komponent function, instance emas. Vue da esa har bir komponent instansiya yaratadi va defineExpose orqali public API ochishi mumkin. useTemplateRef (Vue 3.5+) ham InstanceType bilan birga ishlaydi.`,
    },
    {
      question: 'defineExpose() nima uchun kerak va usiz nima bo\'ladi?',
      answer: `<script setup> da barcha o'zgaruvchilar va funksiyalar DEFAULT YOPIQ — template ref orqali tashqaridan ko'rinmaydi. Bu YAXSHI — encapsulation. defineExpose({ open, close }) — faqat belgilangan narsalar tashqaridan ko'rinadi. Usiz: ota komponent ref orqali hech narsaga murojaat qila OLMAYDI (modalRef.value?.open() — undefined). Options API da esa HAMMASI ochiq edi — bu xavfli. defineExpose TypeScript bilan birga — InstanceType komponent public API ni ANIQ ko'rsatadi. Vue-component-type-helpers kutubxonasi ComponentExposed utility type beradi — u faqat expose qilingan tiplarni oladi.`,
    },
    {
      question: 'Vue provide/inject va React Context — TypeScript bilan ishlatishda qanday farqlar bor?',
      answer: `React: createContext<T>(defaultValue) — generic orqali tip beriladi, default qiymat MAJBURIY (yoki null + type assertion). Provider — JSX komponent: <Ctx.Provider value={...}>. Consumer — useContext(Ctx) hook. Tip avtomatik T. Vue: InjectionKey<T> = Symbol() — generic orqali tip Symbol ga bog'lanadi. provide(key, value) — oddiy function chaqiruv, JSX wrapper kerak emas. inject(key) — T | undefined qaytaradi (default bersangiz — T). Asosiy farq: React da context value reactive emas (re-render kerak), Vue da Ref<T> reactive. Ikkalasida best practice: throw Error bilan null/undefined guard qilgan wrapper composable/hook yozish.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'components', label: 'Komponentlar' },
    { techId: 'vue-js', sectionId: 'vue-typescript', topicId: 'generic-components', label: 'Generic komponentlar' },
    { techId: 'vue-js', sectionId: 'vue-typescript', topicId: 'typed-composables', label: 'Tipli composablelar' },
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'composables', label: 'Composables' },
  ],
}
