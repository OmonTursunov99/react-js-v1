import type { Topic } from '../../../types'

export const modulesPlugins: Topic = {
  id: 'modules-plugins',
  title: 'Modules va Plugins',
  importance: 2,
  status: 'to-learn',
  description: 'Nuxt modules, custom plugin yaratish, runtime config, environment variables',
  content: `MODULES VA PLUGINS — NUXT EKOSISTEMASI
═══════════════════════════════════════

Nuxt 3 kengaytirish tizimi ikki darajada ishlaydi:
1. Modules — build vaqtida ishlaydi, Nuxt konfiguratsiyasini o"zgartiradi
2. Plugins — runtime da ishlaydi, Vue app ga qo"shimchalar beradi

MUHIM: Module — Nuxt ni kengaytiradi (routes, hooks, auto-import).
Plugin — Vue app ni kengaytiradi (provide/inject, direktivalar).

═══════════════════════════════════════
1. NUXT MODULES — RASMIY VA COMMUNITY
═══════════════════════════════════════

Mashhur modullar:
- @nuxt/image — rasm optimizatsiya (lazy loading, resize, CDN)
- @nuxtjs/i18n — ko"p tillilik (vue-i18n integratsiya)
- @vueuse/nuxt — VueUse composable lari auto-import
- @nuxt/fonts — shrift optimizatsiya (Google Fonts, local)
- @nuxt/ui — UI komponentlar kutubxonasi
- @pinia/nuxt — Pinia state management
- @nuxt/devtools — developer tools
- @nuxtjs/color-mode — dark/light tema

O"rnatish:
  yarn add @nuxt/image

nuxt.config.ts:
  modules: ["@nuxt/image"]

MUHIM: Modullar tartibga bog"liq — dependency birinchi turishi kerak.
Masalan, @pinia/nuxt boshqa pinia ishlatuvchi modullardan oldin.

═══════════════════════════════════════
2. CUSTOM MODULE YARATISH
═══════════════════════════════════════

defineNuxtModule() bilan loyihaga maxsus module yozish mumkin:
- Hooks orqali build jarayoniga kirishish
- Auto-import qo"shish
- Runtime plugin registratsiya qilish
- Nuxt konfiguratsiyasini o"zgartirish

Module life cycle:
  setup() → Nuxt hooks → build → runtime

Modullar modules/ papkasiga yoki npm paket sifatida yoziladi.

═══════════════════════════════════════
3. PLUGINS — RUNTIME KENGAYTIRISH
═══════════════════════════════════════

defineNuxtPlugin() bilan Vue app ga runtime funksionallik qo"shiladi:
- provide() — barcha komponentlarga inject qilinadigan qiymat
- Global direktivalar ro"yxatdan o"tkazish
- Tashqi kutubxonalarni ulash (analytics, error tracking)
- Route middleware registratsiya

Plugin turlar:
- plugins/my-plugin.ts — har doim ishlaydi (server + client)
- plugins/my-plugin.client.ts — FAQAT client da
- plugins/my-plugin.server.ts — FAQAT server da

═══════════════════════════════════════
4. RUNTIME CONFIG
═══════════════════════════════════════

useRuntimeConfig() — server va client uchun konfiguratsiya:

nuxt.config.ts:
  runtimeConfig: {
    secretKey: "...",        // Faqat server da
    public: {
      apiBase: "/api",       // Server + client
    }
  }

MUHIM: runtimeConfig.public dan tashqari hamma narsa faqat serverda.
Client da runtimeConfig.secretKey undefined bo"ladi.

═══════════════════════════════════════
5. APP CONFIG
═══════════════════════════════════════

useAppConfig() — build vaqtida aniqlanadigan statik konfiguratsiya:
- Runtime da o"zgartirib bo"lmaydi
- app.config.ts faylda yoziladi
- Tema, UI sozlamalari, loyiha konstantalari uchun

runtimeConfig vs appConfig:
- runtimeConfig — .env dan o"qiladi, runtime da o"zgarishi mumkin
- appConfig — build vaqtida aniqlanadi, static

═══════════════════════════════════════
6. ENVIRONMENT VARIABLES
═══════════════════════════════════════

.env fayl orqali environment variables o"rnatiladi:

  NUXT_SECRET_KEY=my-secret        → runtimeConfig.secretKey
  NUXT_PUBLIC_API_BASE=https://..  → runtimeConfig.public.apiBase

Konventsiya: NUXT_ prefiksi runtimeConfig ga avtomatik map bo"ladi.
NUXT_PUBLIC_ — public maydoniga tushadi.

MUHIM: .env ni .gitignore ga qo"shing. Production da
hosting platform ning environment variables ishlatiladi.`,
  codeExamples: [
    {
      title: 'nuxt.config.ts — modullar va runtimeConfig',
      language: 'ts',
      code: `// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    "@nuxt/image",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@nuxt/fonts",
  ],

  // Runtime konfiguratsiya
  runtimeConfig: {
    // Faqat server da mavjud
    databaseUrl: "",        // NUXT_DATABASE_URL
    jwtSecret: "",          // NUXT_JWT_SECRET
    stripeSecretKey: "",    // NUXT_STRIPE_SECRET_KEY

    // Server + client da mavjud
    public: {
      apiBase: "/api",             // NUXT_PUBLIC_API_BASE
      appName: "Ketmonjon",        // NUXT_PUBLIC_APP_NAME
      stripePublicKey: "",         // NUXT_PUBLIC_STRIPE_PUBLIC_KEY
    },
  },

  // @nuxt/image sozlamalari
  image: {
    quality: 80,
    formats: ["webp", "avif"],
  },

  // @nuxtjs/i18n sozlamalari
  i18n: {
    locales: ["uz", "ru", "en"],
    defaultLocale: "uz",
  },
})`,
      description: 'Modullar tartibga bog"liq — dependency lar birinchi. runtimeConfig .env dan avtomatik o"qiladi.',
    },
    {
      title: 'Custom module yaratish — defineNuxtModule',
      language: 'ts',
      code: `// modules/analytics/index.ts
import { defineNuxtModule, addPlugin, createResolver } from "@nuxt/kit"

export default defineNuxtModule({
  meta: {
    name: "analytics",
    configKey: "analytics",
  },

  defaults: {
    trackingId: "",
    debug: false,
  },

  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Runtime plugin qo"shish
    addPlugin({
      src: resolver.resolve("./runtime/plugin"),
      mode: "client", // Faqat client da
    })

    // Public runtimeConfig ga qo"shish
    nuxt.options.runtimeConfig.public.analytics = {
      trackingId: options.trackingId,
      debug: options.debug,
    }

    // Build hook — CSS qo"shish
    nuxt.hook("nitro:config", (config) => {
      // Nitro konfiguratsiyasini o"zgartirish
    })

    console.log("Analytics module yuklandi:", options.trackingId)
  },
})

// modules/analytics/runtime/plugin.ts
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const trackingId = config.public.analytics.trackingId

  // Analytics SDK ni ishga tushirish
  return {
    provide: {
      track: (event: string, data?: Record<string, unknown>) => {
        console.log("Track:", event, data)
        // analytics.track(event, data)
      },
    },
  }
})`,
      description: 'Module build vaqtida ishlaydi, plugin esa runtime da. Module plugin ni registratsiya qiladi.',
    },
    {
      title: 'Plugin — provide/inject pattern',
      language: 'ts',
      code: `// plugins/api.ts — API client plugin
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      // Auth token qo"shish
      const token = useCookie("auth-token")
      if (token.value) {
        options.headers.set("Authorization", \`Bearer \${token.value}\`)
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        navigateTo("/login")
      }
    },
  })

  return {
    provide: {
      api, // barcha komponentlarda useNuxtApp().$api
    },
  }
})

// Komponentda ishlatish:
// const { $api } = useNuxtApp()
// const users = await $api("/users")

// plugins/error-handler.client.ts — faqat client
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error("Vue error:", error)
    // Sentry.captureException(error)
  }
})`,
      description: '.client.ts — faqat client da, .server.ts — faqat serverda ishlaydi',
    },
    {
      title: 'useRuntimeConfig va useAppConfig',
      language: 'ts',
      code: `// .env
NUXT_DATABASE_URL=postgresql://localhost:5432/mydb
NUXT_JWT_SECRET=super-secret-key
NUXT_PUBLIC_API_BASE=https://api.example.com
NUXT_PUBLIC_APP_NAME=Ketmonjon

// app.config.ts — statik konfiguratsiya
export default defineAppConfig({
  ui: {
    primaryColor: "blue",
    borderRadius: "lg",
  },
  meta: {
    title: "Ketmonjon Platform",
    description: "Frontend o'quv platformasi",
  },
})

// Server da — barcha config mavjud
// server/api/auth/login.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  // config.databaseUrl — mavjud (server only)
  // config.jwtSecret — mavjud (server only)
  // config.public.apiBase — mavjud
})

// Client da — faqat public mavjud
// pages/index.vue
const config = useRuntimeConfig()
// config.public.apiBase — mavjud
// config.databaseUrl — undefined! (xavfsiz)

const appConfig = useAppConfig()
// appConfig.ui.primaryColor — "blue"`,
      description: 'runtimeConfig — .env dan runtime da. appConfig — build vaqtida statik. Server da hamma narsa, client da faqat public.',
    },
    {
      title: 'Mashhur modullar — amaliy sozlash',
      language: 'ts',
      code: `// nuxt.config.ts — @nuxtjs/i18n sozlamalari
export default defineNuxtConfig({
  modules: ["@nuxtjs/i18n"],

  i18n: {
    locales: [
      { code: "uz", file: "uz.json", name: "O'zbekcha" },
      { code: "ru", file: "ru.json", name: "Русский" },
    ],
    defaultLocale: "uz",
    lazy: true,
    langDir: "locales/",
    strategy: "prefix_except_default",
    // / → o"zbek, /ru → rus
  },
})

// Komponentda ishlatish
// pages/about.vue
const { t, locale, setLocale } = useI18n()

// template da: {{ t("welcome") }}
// Til o"zgartirish: setLocale("ru")

// @nuxt/image — rasm optimizatsiya
// <NuxtImg
//   src="/photos/hero.jpg"
//   width="800"
//   height="400"
//   format="webp"
//   quality="80"
//   loading="lazy"
//   placeholder
// />`,
      description: 'i18n — ko"p tillilik, @nuxt/image — avtomatik rasm optimizatsiya',
    },
  ],
  interviewQA: [
    {
      question: 'Nuxt module va plugin farqi nima?',
      answer: 'Module — build vaqtida ishlaydi, Nuxt konfiguratsiyasini o"zgartiradi (route, hook, auto-import qo"shish). Plugin — runtime da ishlaydi, Vue app ga funksionallik qo"shadi (provide/inject, global component, directive). Module plugin ni registratsiya qilishi mumkin. Masalan, @pinia/nuxt — module (Pinia ni Nuxt ga ulaydi), lekin ichida plugin yaratadi (SSR hydration uchun).',
    },
    {
      question: 'runtimeConfig va appConfig farqi qanday?',
      answer: 'runtimeConfig — .env dan o"qiladi, runtime da o"zgarishi mumkin, public/private bo"linadi (private faqat serverda). appConfig — app.config.ts da yoziladi, build vaqtida aniqlanadi, o"zgarmaydi, client da to"liq mavjud. runtimeConfig — API keys, DB URL kabi sezgir ma"lumotlar. appConfig — UI tema, loyiha konstantalari kabi statik sozlamalar uchun.',
    },
    {
      question: 'NUXT_PUBLIC_ prefiksi qanday ishlaydi?',
      answer: '.env dagi NUXT_ prefiksli o"zgaruvchilar runtimeConfig ga avtomatik map bo"ladi. NUXT_SECRET_KEY runtimeConfig.secretKey ga tushadi. NUXT_PUBLIC_API_BASE esa runtimeConfig.public.apiBase ga. public bo"lmagan qiymatlar faqat server da mavjud — client bundle ga tushmaydi, xavfsiz.',
    },
    {
      question: 'defineNuxtPlugin da provide nima qiladi?',
      answer: 'provide() orqali har qanday qiymat barcha komponentlarga taqdim etiladi. useNuxtApp().$name bilan olinadi. Masalan, provide: { api: $fetch.create({...}) } — keyin useNuxtApp().$api("/users") ishlatiladi. Bu pattern global API client, analytics tracker, notification service kabilar uchun ishlatiladi. TypeScript bilan birga plugin return tipi auto-complete beradi.',
    },
    {
      question: 'Plugin fayl nomlari konventsiyasi qanday?',
      answer: 'plugins/ papkasidagi fayllar avtomatik yuklanadi. my-plugin.ts — server + client da ishlaydi. my-plugin.client.ts — FAQAT client da (DOM, window kerak bo"lganda). my-plugin.server.ts — FAQAT server da. Tartibni boshqarish uchun raqam prefiksi: 01.auth.ts, 02.api.ts. Yoki nuxt.config.ts da plugins massivida aniq tartib berish mumkin.',
    },
    {
      question: 'Custom Nuxt module yaratishda qanday hooklar mavjud?',
      answer: 'Asosiy hooklar: "modules:before" — modullar yuklashdan oldin, "pages:extend" — route larni o"zgartirish, "components:extend" — komponentlarni qo"shish, "nitro:config" — server konfiguratsiyasi, "build:before/after" — build jarayoni. defineNuxtModule ichida nuxt.hook() bilan istalgan hook ga ulanish mumkin. addPlugin(), addImports(), addComponent() yordamchi funksiyalari ham mavjud.',
    },
  ],
}
