import type { Topic } from '../../../types'

export const provideInject: Topic = {
  id: 'provide-inject',
  title: 'Provide / Inject',
  importance: 2,
  status: 'to-learn',
  description: 'provide(), inject(), InjectionKey, Symbol keys, reaktiv injection — dependency injection tizimi',
  content: `Provide/Inject — Vue ning dependency injection (DI) tizimi. Ota komponent ma'lumot provide qiladi, istalgan chuqurlikdagi nasl komponent inject qiladi. Props drilling muammosini hal qiladi.

═══════════════════════════════════════
  ASOSIY ISHLATISH
═══════════════════════════════════════

  // Ota komponent — provide:
  import { provide, ref } from 'vue'
  const theme = ref('dark')
  provide('theme', theme)

  // Nasl komponent (istalgan chuqurlikda) — inject:
  import { inject } from 'vue'
  const theme = inject('theme')         // 'dark'
  const theme = inject('theme', 'light') // default qiymat

provide() — setup() yoki <script setup> ichida chaqiriladi.
inject() — faqat setup() yoki <script setup> ichida chaqiriladi.

═══════════════════════════════════════
  SYMBOL VA InjectionKey<T>
═══════════════════════════════════════

String key — nom to'qnashuvi xavfi bor. Symbol ishlatish xavfsizroq:

  // keys.ts
  import type { InjectionKey, Ref } from 'vue'

  export const ThemeKey: InjectionKey<Ref<string>> = Symbol('theme')
  export const UserKey: InjectionKey<Ref<User | null>> = Symbol('user')

  // Ota:
  import { ThemeKey } from './keys'
  provide(ThemeKey, theme)

  // Nasl:
  import { ThemeKey } from './keys'
  const theme = inject(ThemeKey) // Ref<string> | undefined

InjectionKey<T> — TypeScript uchun tip xavfsizlik beradi.
inject() qaytaruvchi tip avtomatik aniqlanadi.

═══════════════════════════════════════
  REAKTIV MA'LUMOT INJECTION
═══════════════════════════════════════

ref yoki reactive provide qilinsa — nasl komponent o'zgarishlarni kuzatadi:

  // Ota:
  const count = ref(0)
  provide('count', count)        // reaktiv ref berish

  // Nasl:
  const count = inject<Ref<number>>('count')
  // count.value o'zgarganda — nasl ham yangilanadi

MUHIM — readonly bilan himoyalash:
  provide('count', readonly(count))  // nasl o'zgartira OLMAYDI

Agar mutatsiya kerak bo'lsa — funksiya ham provide qilish:
  provide('count', count)
  provide('updateCount', (val: number) => count.value = val)

═══════════════════════════════════════
  DEFAULT QIYMATLAR
═══════════════════════════════════════

inject() ikkinchi argument — default qiymat:
  const theme = inject('theme', 'light')        // string
  const user = inject('user', () => ({ name: '' })) // factory function

Factory function — object/array uchun tavsiya etiladi (har bir komponent uchun yangi instance).

Default yo'q va provide ham yo'q bo'lsa — undefined qaytadi.
Strict rejimda xatolik chiqarish uchun — composable ichida tekshirish kerak.

═══════════════════════════════════════
  APP-LEVEL PROVIDE
═══════════════════════════════════════

Butun ilova bo'ylab provide:

  // main.ts
  const app = createApp(App)
  app.provide('apiUrl', 'https://api.example.com')
  app.provide(ThemeKey, ref('dark'))

App-level provide — BARCHA komponentlar uchun mavjud.
Plugin-lar ham app.provide ishlatadi.

═══════════════════════════════════════
  QACHON NIMA ISHLATISH
═══════════════════════════════════════

Props — 1-2 daraja chuqurlik, aniq ma'lumot oqimi
Provide/Inject — 3+ daraja, global konfiguratsiya (tema, locale, API)
Pinia store — global state, bir nechta komponent, DevTools
Event bus — ishlatmang (Vue 3 da olib tashlangan)

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

Vue provide/inject = React Context API:
  React: createContext() -> Provider -> useContext()
  Vue: provide() -> inject()

Farqlar:
- React Context — bitta Provider, bitta qiymat
- Vue provide — har bir komponent alohida provide qilishi mumkin (eng yaqini ishlatiladi)
- React Context o'zgarganda — BARCHA consumer-lar re-render bo'ladi
- Vue provide ref o'zgarganda — faqat ishlatgan joylar yangilanadi (reactive)
- React da Context hell muammosi bor (ko'p Provider ichma-ich)
- Vue da provide oddiyroq — alohida Provider komponent kerak EMAS`,
  codeExamples: [
    {
      title: 'InjectionKey bilan tip-xavfsiz provide/inject',
      language: 'ts',
      code: `// ===== injection-keys.ts =====
import type { InjectionKey, Ref } from 'vue'

export interface AuthUser {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

export interface AuthContext {
  user: Ref<AuthUser | null>
  isAuthenticated: Ref<boolean>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

// Symbol + InjectionKey — tip xavfsiz
export const AuthKey: InjectionKey<AuthContext> = Symbol('auth')

export interface ToastContext {
  show: (message: string, type?: 'success' | 'error' | 'info') => void
  hide: () => void
}

export const ToastKey: InjectionKey<ToastContext> = Symbol('toast')

// ===== useAuth.ts — composable wrapper =====
// import { inject } from 'vue'
// import { AuthKey } from './injection-keys'
//
// export function useAuth() {
//   const auth = inject(AuthKey)
//   if (!auth) {
//     throw new Error('useAuth: AuthProvider topilmadi!')
//   }
//   return auth
// }`,
      description: 'InjectionKey<T> + Symbol — nom to\'qnashuvidan himoya va TypeScript tip xavfsizlik. Composable wrapper — xatolikni erta ushlash.',
    },
    {
      title: 'Provide/Inject — Auth tizimi',
      language: 'html',
      code: `<!-- AuthProvider.vue -->
<script setup lang="ts">
import { ref, computed, provide, readonly } from 'vue'
import { AuthKey, type AuthUser, type AuthContext } from './injection-keys'

const user = ref<AuthUser | null>(null)
const isAuthenticated = computed(() => user.value !== null)

async function login(email: string, password: string) {
  // API chaqiruv simulatsiyasi
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  user.value = await response.json()
}

function logout() {
  user.value = null
}

// readonly — nasl komponentlar to'g'ridan-to'g'ri o'zgartira olmasin
const authContext: AuthContext = {
  user: readonly(user) as Ref<AuthUser | null>,
  isAuthenticated: readonly(isAuthenticated),
  login,
  logout,
}

provide(AuthKey, authContext)
</script>

<template>
  <slot />
</template>

<!-- App.vue da: -->
<!--
<AuthProvider>
  <RouterView />
</AuthProvider>
-->

<!-- Istalgan nasl komponentda: -->
<!--
<script setup>
import { useAuth } from './useAuth'
const { user, isAuthenticated, logout } = useAuth()
</script>

<template>
  <div v-if="isAuthenticated">
    Salom, {{ user?.name }}!
    <button @click="logout">Chiqish</button>
  </div>
</template>
-->`,
      description: 'AuthProvider — readonly bilan himoyalangan, composable orqali qulay ishlatish. React Context Provider patterniga o\'xshash.',
    },
    {
      title: 'App-level provide va plugin pattern',
      language: 'ts',
      code: `// ===== toast-plugin.ts =====
import type { App, InjectionKey, Ref } from 'vue'
import { ref } from 'vue'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

export interface ToastAPI {
  toasts: Ref<Toast[]>
  show: (message: string, type?: Toast['type']) => void
  hide: (id: number) => void
}

export const ToastKey: InjectionKey<ToastAPI> = Symbol('toast')

let nextId = 0

export const toastPlugin = {
  install(app: App) {
    const toasts = ref<Toast[]>([])

    function show(message: string, type: Toast['type'] = 'info') {
      const id = nextId++
      toasts.value.push({ id, message, type })

      // 3 sekunddan keyin avtomatik yashirish
      setTimeout(() => hide(id), 3000)
    }

    function hide(id: number) {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }

    // App-level provide — BARCHA komponentlar uchun mavjud
    app.provide(ToastKey, { toasts, show, hide })
  },
}

// ===== main.ts =====
// import { createApp } from 'vue'
// import { toastPlugin } from './toast-plugin'
// const app = createApp(App)
// app.use(toastPlugin)

// ===== useToast.ts =====
// export function useToast(): ToastAPI {
//   const toast = inject(ToastKey)
//   if (!toast) throw new Error('Toast plugin o\\'rnatilmagan!')
//   return toast
// }

// ===== Komponentda ishlatish =====
// const { show } = useToast()
// show('Saqlandi!', 'success')`,
      description: 'Plugin pattern — app.provide() bilan global xizmat. install() metodi — app.use() orqali o\'rnatiladi. Barcha komponentlar inject qiladi.',
    },
    {
      title: 'Reaktiv provide — tema tizimi',
      language: 'html',
      code: `<!-- ThemeProvider.vue -->
<script setup lang="ts">
import { provide, ref, readonly, computed, watch } from 'vue'
import type { InjectionKey, Ref } from 'vue'

type Theme = 'light' | 'dark' | 'system'

export interface ThemeContext {
  theme: Ref<Theme>
  resolvedTheme: Ref<'light' | 'dark'>
  setTheme: (t: Theme) => void
  toggleTheme: () => void
}

export const ThemeKey: InjectionKey<ThemeContext> = Symbol('theme')

// localStorage dan o'qish
const theme = ref<Theme>(
  (localStorage.getItem('theme') as Theme) || 'system'
)

// System tema aniqlab olish
const prefersDark = ref(
  window.matchMedia('(prefers-color-scheme: dark)').matches
)

const resolvedTheme = computed<'light' | 'dark'>(() => {
  if (theme.value === 'system') return prefersDark.value ? 'dark' : 'light'
  return theme.value
})

function setTheme(t: Theme) {
  theme.value = t
  localStorage.setItem('theme', t)
}

function toggleTheme() {
  setTheme(resolvedTheme.value === 'light' ? 'dark' : 'light')
}

// DOM-ga class qo'shish
watch(resolvedTheme, (val) => {
  document.documentElement.classList.toggle('dark', val === 'dark')
}, { immediate: true })

provide(ThemeKey, {
  theme: readonly(theme),
  resolvedTheme: readonly(resolvedTheme),
  setTheme,
  toggleTheme,
})
</script>

<template>
  <slot />
</template>`,
      description: 'Reaktiv provide — tema o\'zgarganda barcha inject qilgan komponentlar avtomatik yangilanadi. readonly bilan himoya, localStorage bilan persist.',
    },
  ],
  interviewQA: [
    {
      question: 'Provide/Inject nima va qachon ishlatiladi?',
      answer: `Provide/Inject — Vue ning dependency injection tizimi. Ota komponent provide() orqali ma'lumot beradi, istalgan chuqurlikdagi nasl komponent inject() orqali oladi. Props drilling muammosini hal qiladi (A->B->C->D zanjiri o'rniga, A provide qiladi, D inject qiladi). Ishlatish holatlari: tema, locale, auth state, global konfiguratsiya. Props 1-2 daraja uchun, provide/inject 3+ daraja uchun, Pinia — global state va DevTools kerak bo'lganda.`,
    },
    {
      question: 'InjectionKey nima uchun kerak?',
      answer: `InjectionKey<T> — TypeScript tip xavfsizlik uchun. String key ishlatilsa: inject('theme') qaytaruvchi tip unknown — qo'lda tip berish kerak. InjectionKey + Symbol ishlatilsa: const ThemeKey: InjectionKey<Ref<string>> = Symbol('theme') — inject(ThemeKey) avtomatik Ref<string> | undefined tipini qaytaradi. Bundan tashqari Symbol nom to'qnashuvidan himoya qiladi — ikki kutubxona bir xil string key ishlatishi mumkin.`,
    },
    {
      question: 'Provide/Inject va React Context farqi nima?',
      answer: `O'xshashliklar: ikkalasi ham props drilling muammosini hal qiladi. Farqlar: 1) React Context o'zgarganda BARCHA consumer-lar re-render bo'ladi — Vue da faqat ishlatgan joylar yangilanadi. 2) React da Provider komponent kerak, Vue da faqat provide() chaqirish yetarli. 3) Vue da har bir komponent alohida provide qilishi mumkin — eng yaqin ota-ning qiymati ishlatiladi. 4) React da Context hell muammosi bor (ko'p Provider ichma-ich). Vue da bunday muammo kamroq.`,
    },
    {
      question: 'Provide qilingan ma\'lumotni nasl komponent o\'zgartira oladimi?',
      answer: `Ha, agar ref to'g'ridan-to'g'ri provide qilingan bo'lsa. LEKIN bu yomon amaliyot — ma'lumot oqimi kuzatib bo'lmaydigan bo'lib qoladi. To'g'ri yondashuv: 1) readonly() bilan provide qilish — nasl o'zgartira olmaydi. 2) O'zgartirish uchun funksiya ham provide qilish: provide('updateCount', (val) => count.value = val). Bu React Context dagi pattern bilan bir xil — value + setter funksiya berish. One-way data flow saqlanadi.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'components', label: 'Komponentlar' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'composition-api', label: 'Composition API' },
    { techId: 'vue-js', sectionId: 'vue-pinia', topicId: 'pinia-basics', label: 'Pinia Asoslari' },
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'composables', label: 'Composables' },
  ],
}
