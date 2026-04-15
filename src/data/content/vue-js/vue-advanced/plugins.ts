import type { Topic } from '../../../types'

export const plugins: Topic = {
  id: 'plugins',
  title: 'Plugins',
  importance: 2,
  status: 'to-learn',
  description: 'Vue plugin tizimi, app.use(), global xususiyatlar, plugin yaratish',
  content: `Plugin — Vue ilovasiga global funksionallik qo'shish mexanizmi. app.use() orqali o'rnatiladi. Pinia, Vue Router, i18n — barchasi plugin sifatida ishlaydi.

═══════════════════════════════════════
  PLUGIN NIMA?
═══════════════════════════════════════

Plugin — install() metodi bor object yoki oddiy funksiya.
app.use(plugin, options) chaqirilganda Vue install() ni chaqiradi.

  // Plugin object sifatida
  const myPlugin = {
    install(app, options) {
      // Bu yerda global narsalar qo'shiladi
    }
  }

  // Plugin funksiya sifatida
  function myPlugin(app, options) {
    // ...
  }

  // O'rnatish
  app.use(myPlugin, { someOption: true })

app.use() bir xil plugin ni IKKI MARTA o'rnatmaydi — himoya bor.

═══════════════════════════════════════
  PLUGIN IMKONIYATLARI
═══════════════════════════════════════

install(app, options) ichida plugin nima qila oladi:

1. Global komponentlar ro'yxatdan o'tkazish:
   app.component('MyButton', MyButton)

2. Global direktivalar qo'shish:
   app.directive('focus', vFocus)

3. Global xususiyatlar (globalProperties):
   app.config.globalProperties.$translate = (key) => ...

4. Provide/Inject orqali ma'lumot ulashish:
   app.provide('i18n', i18nInstance)

5. Global mixin qo'shish (TAVSIYA ETILMAYDI):
   app.mixin({ created() { ... } })

6. app.config.errorHandler sozlash:
   app.config.errorHandler = (err) => logToService(err)

═══════════════════════════════════════
  globalProperties
═══════════════════════════════════════

Barcha komponentlarda mavjud bo'lgan xususiyatlar:

  app.config.globalProperties.$http = axios
  app.config.globalProperties.$translate = translate

Options API-da this.$http, this.$translate orqali
<template>-da $translate('key') sifatida foydalanish mumkin.

Composition API (<script setup>) da globalProperties ga
bevosita kirish mumkin emas — provide/inject afzal.
Ammo getCurrentInstance() orqali mumkin (TAVSIYA ETILMAYDI).

═══════════════════════════════════════
  TypeScript BILAN PLUGIN
═══════════════════════════════════════

globalProperties uchun tip deklaratsiya:

  // types/global.d.ts
  declare module 'vue' {
    interface ComponentCustomProperties {
      $translate: (key: string) => string
      $http: typeof axios
    }
  }

Provide/inject uchun InjectionKey ishlatish:
  const i18nKey: InjectionKey<I18nInstance> = Symbol('i18n')
  app.provide(i18nKey, instance)
  // Komponentda: const i18n = inject(i18nKey)!

═══════════════════════════════════════
  PROVIDE/INJECT VS globalProperties
═══════════════════════════════════════

Zamonaviy Vue (Composition API) da provide/inject afzal:
- TypeScript bilan yaxshi ishlaydi (InjectionKey)
- <script setup> da inject() orqali oson foydalanish
- Tree-shakeable — ishlatilmagan inject bundle-ga tushmaydi
- Testda oson mock qilish mumkin

globalProperties faqat Options API yoki template uchun qulayroq.

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React-da plugin tizimi YO'Q. Muqobillar:
- Context API — Vue provide/inject ga o'xshash
- HOC (Higher-Order Component) — global logika o'rash
- Custom hooks — qayta ishlatiladigan logika
- Provider pattern — <ThemeProvider>, <AuthProvider>

Vue plugin afzalliklari:
- Bitta joyda hamma narsani sozlash (app.use)
- Kutubxonalar uchun standart o'rnatish usuli
- Global komponent/direktiva qo'shish oson

React yondashuv afzalliklari:
- Aniqroq dependency — kim nimani ishlatayotgani ko'rinadi
- Provider tree — turli darajada turli konfiguratsiya
- Tree-shaking yaxshiroq`,
  codeExamples: [
    {
      title: 'Toast notification plugin',
      language: 'ts',
      code: `// plugins/toast.ts
import { ref, type App, type InjectionKey } from 'vue'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

interface ToastOptions {
  duration?: number
  position?: 'top-right' | 'bottom-right'
}

interface ToastAPI {
  toasts: ReturnType<typeof ref<Toast[]>>
  success: (msg: string) => void
  error: (msg: string) => void
  info: (msg: string) => void
  warning: (msg: string) => void
  remove: (id: number) => void
}

export const toastKey: InjectionKey<ToastAPI> = Symbol('toast')

let nextId = 0

export const ToastPlugin = {
  install(app: App, options: ToastOptions = {}) {
    const { duration = 3000 } = options
    const toasts = ref<Toast[]>([])

    function addToast(message: string, type: Toast['type']) {
      const id = nextId++
      toasts.value.push({ id, message, type })
      setTimeout(() => remove(id), duration)
    }

    function remove(id: number) {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }

    const api: ToastAPI = {
      toasts,
      success: (msg) => addToast(msg, 'success'),
      error: (msg) => addToast(msg, 'error'),
      info: (msg) => addToast(msg, 'info'),
      warning: (msg) => addToast(msg, 'warning'),
      remove,
    }

    // Provide orqali — Composition API uchun
    app.provide(toastKey, api)

    // globalProperties — Options API / template uchun
    app.config.globalProperties.$toast = api
  },
}

// ========== O'rnatish (main.ts) ==========
// app.use(ToastPlugin, { duration: 5000 })

// ========== Ishlatish (komponentda) ==========
// const toast = inject(toastKey)!
// toast.success('Saqlandi!')
// toast.error('Xatolik yuz berdi')`,
      description: 'Toast plugin — provide/inject va globalProperties bilan. InjectionKey orqali TypeScript tipizatsiya.',
    },
    {
      title: 'i18n plugin — oddiy tarjima tizimi',
      language: 'ts',
      code: `// plugins/i18n.ts
import type { App, InjectionKey } from 'vue'

type Messages = Record<string, Record<string, string>>

interface I18nInstance {
  t: (key: string) => string
  locale: string
  setLocale: (lang: string) => void
}

export const i18nKey: InjectionKey<I18nInstance> = Symbol('i18n')

interface I18nOptions {
  locale: string
  messages: Messages
}

export const I18nPlugin = {
  install(app: App, options: I18nOptions) {
    let currentLocale = options.locale
    const messages = options.messages

    function t(key: string): string {
      return messages[currentLocale]?.[key] || key
    }

    function setLocale(lang: string) {
      if (messages[lang]) {
        currentLocale = lang
      }
    }

    const i18n: I18nInstance = {
      get locale() { return currentLocale },
      t,
      setLocale,
    }

    // Provide — Composition API
    app.provide(i18nKey, i18n)

    // Global property — template da {{ $t('key') }}
    app.config.globalProperties.$t = t

    // Global directive — v-t="'key'"
    app.directive('t', {
      mounted(el, binding) {
        el.textContent = t(binding.value)
      },
      updated(el, binding) {
        el.textContent = t(binding.value)
      },
    })
  },
}

// ========== O'rnatish ==========
// app.use(I18nPlugin, {
//   locale: 'uz',
//   messages: {
//     uz: { hello: 'Salom', bye: "Xayr" },
//     en: { hello: 'Hello', bye: 'Goodbye' },
//   },
// })
//
// Template: {{ $t('hello') }}  yoki  <span v-t="'hello'" />
// Setup:   const { t } = inject(i18nKey)!`,
      description: 'i18n plugin — provide, globalProperties va custom directive kombinatsiyasi.',
    },
    {
      title: 'Analytics plugin — global event tracking',
      language: 'ts',
      code: `// plugins/analytics.ts
import type { App, InjectionKey } from 'vue'

interface AnalyticsEvent {
  name: string
  properties?: Record<string, unknown>
  timestamp: number
}

interface AnalyticsAPI {
  track: (name: string, properties?: Record<string, unknown>) => void
  pageView: (path: string) => void
  identify: (userId: string) => void
}

export const analyticsKey: InjectionKey<AnalyticsAPI> = Symbol('analytics')

interface AnalyticsOptions {
  apiKey: string
  debug?: boolean
}

export const AnalyticsPlugin = {
  install(app: App, options: AnalyticsOptions) {
    const { apiKey, debug = false } = options
    const queue: AnalyticsEvent[] = []

    function track(name: string, properties?: Record<string, unknown>) {
      const event: AnalyticsEvent = {
        name,
        properties,
        timestamp: Date.now(),
      }

      queue.push(event)

      if (debug) {
        console.log('[Analytics]', name, properties)
      }

      // Real loyihada: API ga yuborish
      // sendToServer(apiKey, event)
    }

    function pageView(path: string) {
      track('page_view', { path })
    }

    function identify(userId: string) {
      track('identify', { userId })
    }

    const api: AnalyticsAPI = { track, pageView, identify }

    app.provide(analyticsKey, api)

    // Global error tracking
    app.config.errorHandler = (err, instance, info) => {
      track('error', {
        message: (err as Error).message,
        info,
        component: instance?.$options.name,
      })
      console.error(err)
    }

    // v-track direktiva — click tracking
    app.directive('track', {
      mounted(el: HTMLElement, binding) {
        el.addEventListener('click', () => {
          track(binding.value || binding.arg || 'click', {
            element: el.tagName,
          })
        })
      },
    })
  },
}

// ========== Ishlatish ==========
// <button v-track="'signup_click'">Ro'yxatdan o'tish</button>
// setup: const analytics = inject(analyticsKey)!
//        analytics.track('form_submit', { formId: 'login' })`,
      description: 'Analytics plugin — event tracking, error handling, v-track direktiva kombinatsiyasi.',
    },
    {
      title: 'TypeScript tip deklaratsiyasi',
      language: 'ts',
      code: `// types/global.d.ts
// globalProperties uchun TypeScript tip deklaratsiya

import type { AnalyticsAPI } from '@/plugins/analytics'
import type { ToastAPI } from '@/plugins/toast'

declare module 'vue' {
  interface ComponentCustomProperties {
    // Tarjima funksiya
    $t: (key: string) => string

    // Toast API
    $toast: ToastAPI

    // Analytics API
    $analytics: AnalyticsAPI

    // Axios
    $http: typeof import('axios').default
  }
}

// ========== InjectionKey pattern ==========
// Provide/inject uchun tip xavfsiz kalit

import type { InjectionKey, Ref } from 'vue'

// Har bir plugin uchun alohida kalit
export const themeKey: InjectionKey<{
  isDark: Ref<boolean>
  toggle: () => void
}> = Symbol('theme')

export const authKey: InjectionKey<{
  user: Ref<User | null>
  login: (creds: Credentials) => Promise<void>
  logout: () => void
}> = Symbol('auth')

// Komponentda:
// const theme = inject(themeKey)!
// theme.isDark.value  // Ref<boolean> — tip avtomatik aniqlanadi
// theme.toggle()      // () => void`,
      description: 'ComponentCustomProperties bilan globalProperties tipizatsiya. InjectionKey pattern.',
    },
  ],
  interviewQA: [
    {
      question: 'Vue plugin nima? Qanday yaratiladi?',
      answer: `Plugin — Vue ilovasiga global funksionallik qo'shish mexanizmi. install(app, options) metodi bor object yoki funksiya. app.use(plugin, options) orqali o'rnatiladi. install ichida: app.component() — global komponent, app.directive() — global direktiva, app.provide() — provide/inject, app.config.globalProperties — global xususiyat, app.config.errorHandler — xatolik handler. Vue Router, Pinia, vue-i18n — barchasi plugin.`,
    },
    {
      question: 'globalProperties va provide/inject farqi nima? Qaysi biri afzal?',
      answer: `globalProperties — barcha komponentlarda this.$prop va template-da $prop orqali mavjud. Composition API (<script setup>) da bevosita ishlatib bo'lmaydi. provide/inject — app.provide() bilan berish, inject() bilan olish. Afzalliklari: TypeScript InjectionKey bilan tip xavfsiz, <script setup> da oson, tree-shakeable, testda mock qilish oson. XULOSA: zamonaviy Vue da provide/inject afzal, globalProperties faqat Options API yoki template shortcut uchun.`,
    },
    {
      question: 'app.use() bir xil plugin ni ikki marta chaqirsa nima bo\'ladi?',
      answer: `Vue himoya qiladi — bir xil plugin IKKI MARTA o'rnatilmaydi. Ikkinchi app.use() chaqiruvi e'tiborga olinmaydi. Bu xavfsizlik mexanizmi — plugin state ikki marta initialize bo'lmaydi. Ammo turli options bilan bir xil plugin o'rnatish kerak bo'lsa, plugin ni factory function sifatida yozish kerak: createPlugin(options) => { install() { ... } }.`,
    },
    {
      question: 'React-da Vue plugin tizimiga muqobil nima?',
      answer: `React-da rasmiy plugin tizimi yo'q. Muqobillar: 1) Context API + Provider pattern — <ThemeProvider>, <AuthProvider>. 2) Custom hooks — useTheme(), useAuth(). 3) HOC — withAuth(Component). 4) Global state — Redux, Zustand store. Vue plugin afzalligi — bitta joyda hamma narsa (app.use), kutubxona uchun standart API. React afzalligi — aniq dependency tree, har bir komponent nimani ishlatayotgani ko'rinadi (explicit import).`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'custom-directives', label: 'Custom Directives' },
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'composables', label: 'Composables' },
    { techId: 'vue-js', sectionId: 'vue-typescript', topicId: 'generic-components', label: 'TypeScript Generics' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'provide-inject', label: 'Provide / Inject' },
  ],
}
