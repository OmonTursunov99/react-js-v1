import type { Topic } from '../../../types'

export const moduleAugmentation: Topic = {
  id: 'module-augmentation',
  title: 'Module Augmentation',
  importance: 2,
  status: 'to-learn',
  description:
    'Declaration merging, module augmentation, global augmentation, Window/ProcessEnv kengaytirish va .d.ts fayllar.',
  content: `
# MODULE AUGMENTATION
═══════════════════════════════════════

Module augmentation — mavjud modul yoki global tiplarni **kengaytirish** mexanizmi. Kutubxona tiplarini o'zgartirmasdan, o'z loyihangiz uchun qo'shimcha tiplar qo'shish imkonini beradi.

## DECLARATION MERGING

TypeScript da bir xil nomdagi bir nechta deklaratsiya **birlashtiriladi**:
1. **Interface + Interface** — propertylar birlashadi
2. **Namespace + Namespace** — eksportlar birlashadi
3. **Class + Interface** — interface class tipini kengaytiradi
4. **Enum + Namespace** — statik metodlar qo'shish

MUHIM: Type alias (\`type\`) merging qilmaydi. Faqat interface va namespace merge bo'ladi.

## MODULE AUGMENTATION

\`declare module "kutubxona"\` — tashqi modul tiplarini kengaytirish:

Bu faqat mavjud modulga QOSHADI — qaytadan yozmaydi. Yangi property, method, yoki tip qo'shish mumkin.

## GLOBAL AUGMENTATION

\`declare global\` — global scope ga tip qo'shish. Window, globalThis, NodeJS.ProcessEnv kabi global ob'ektlarni kengaytirish.

MUHIM: \`declare global\` faqat modul fayl ichida ishlaydi — faylda kamida bitta \`import\` yoki \`export\` bo'lishi kerak.

## WINDOW VA PROCESSENV KENGAYTIRISH

Eng ko'p ishlatiladigan global augmentation:
1. \`Window\` — brauzer global ob'ekti
2. \`NodeJS.ProcessEnv\` — environment variablelar
3. \`JSX.IntrinsicElements\` — custom HTML elementlar

## THIRD-PARTY KUTUBXONA TIPLARI

Kutubxona tipi noto'g'ri yoki chala bo'lganda — module augmentation bilan to'ldirish:
1. Plugin sistemalar (Express middleware, Fastify plugins)
2. Yangi versiya chiqib, @types hali yangilanmagan
3. Custom funksionallik qo'shilgan

## .D.TS FAYLLAR

Declaration fayllar (\`.d.ts\`) — faqat tip ma'lumoti, runtime kodi yo'q:
1. \`*.d.ts\` — loyiha uchun custom tiplar
2. \`@types/*\` — DefinitelyTyped kutubxonalar
3. Ambient deklaratsiyalar — \`declare\` kalit so'zi bilan
  `.trim(),
  codeExamples: [
    {
      title: 'Declaration merging',
      language: 'ts',
      description: 'Interface va namespace merging.',
      code: `// Interface merging — bir xil nomdagi interfacelar birlashadi
interface User {
  id: string
  name: string
}

interface User {
  email: string
  age: number
}

// Natija — birlashgan interface
const user: User = {
  id: "1",
  name: "Ali",
  email: "ali@test.com",
  age: 25,
}
// Barcha 4 ta property majburiy

// Namespace merging
namespace Validation {
  export function isEmail(s: string): boolean {
    return s.includes("@")
  }
}

namespace Validation {
  export function isPhone(s: string): boolean {
    return /^\\d{9}$/.test(s)
  }
}

// Ikkalasi ham mavjud
Validation.isEmail("ali@test.com")  // OK
Validation.isPhone("901234567")      // OK

// Class + Interface merge
class Animal {
  name: string
  constructor(name: string) { this.name = name }
}

interface Animal {
  speak(): void
}

// Endi Animal tipi speak() ni ham talab qiladi
// Lekin class da implement qilish kerak`,
    },
    {
      title: 'Module augmentation',
      language: 'ts',
      description: 'Tashqi modul tiplarini kengaytirish.',
      code: `// Express da request ga user qo'shish
// fayl: src/types/express.d.ts
import "express"

declare module "express" {
  interface Request {
    user?: {
      id: string
      name: string
      role: "admin" | "user"
    }
    requestId: string
  }
}

// Endi TypeScript biladi
// import { Request } from "express"
// req.user?.name     — OK
// req.requestId      — OK

// React Router da loader data tipini kengaytirish
declare module "react-router" {
  interface Register {
    params: {
      userId: string
      postId: string
    }
  }
}

// Axios response ga custom field
import "axios"

declare module "axios" {
  interface AxiosResponse<T = any> {
    meta?: {
      page: number
      total: number
    }
  }
}

// Zustand store augmentation
declare module "zustand" {
  interface StoreMutators<S, A> {
    "custom-logger": Write<Cast<S, object>, { log: () => void }>
  }
}`,
    },
    {
      title: 'Global augmentation',
      language: 'ts',
      description: 'Window, ProcessEnv va global tiplarni kengaytirish.',
      code: `// Window ga custom property qo'shish
// fayl: src/types/global.d.ts
export {}  // modul fayl qilish uchun kerak

declare global {
  interface Window {
    __APP_VERSION__: string
    __API_URL__: string
    analytics: {
      track(event: string, data?: Record<string, unknown>): void
      identify(userId: string): void
    }
  }
}

// Endi ishlaydi
// window.__APP_VERSION__    — string
// window.analytics.track("click", { page: "/home" })

// NodeJS.ProcessEnv kengaytirish
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test"
      DATABASE_URL: string
      API_KEY: string
      PORT?: string
    }
  }
}

// Endi process.env tipli
// process.env.DATABASE_URL   — string (undefined emas)
// process.env.NODE_ENV       — "development" | "production" | "test"

// Array ga custom method
declare global {
  interface Array<T> {
    last(): T | undefined
    isEmpty(): boolean
  }
}

// Implementatsiya (runtime)
Array.prototype.last = function () {
  return this[this.length - 1]
}
Array.prototype.isEmpty = function () {
  return this.length === 0
}`,
    },
    {
      title: '.d.ts fayllar bilan ishlash',
      language: 'ts',
      description: 'Declaration fayllar — ambient tiplar va modul deklaratsiyalari.',
      code: `// Ambient deklaratsiya — tashqi kutubxona uchun tip
// fayl: src/types/legacy-lib.d.ts

// Modul deklaratsiyasi — import qilish mumkin
declare module "legacy-analytics" {
  export function init(apiKey: string): void
  export function track(event: string, data?: object): void
  export function setUser(id: string): void
}

// Endi import ishlaydi
// import { init, track } from "legacy-analytics"

// CSS/SCSS modullar uchun
declare module "*.module.css" {
  const classes: Record<string, string>
  export default classes
}

declare module "*.module.scss" {
  const classes: Record<string, string>
  export default classes
}

// Rasm fayllar uchun
declare module "*.svg" {
  const content: string
  export default content
}

declare module "*.png" {
  const content: string
  export default content
}

// JSON import
declare module "*.json" {
  const value: Record<string, unknown>
  export default value
}

// Vite env.d.ts pattern
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}`,
    },
    {
      title: 'Third-party kutubxona tiplarini kengaytirish',
      language: 'ts',
      description: 'Plugin va middleware tiplarini to\'g\'rilash.',
      code: `// Fastify plugin — request dekoratsiyasi
import "fastify"

declare module "fastify" {
  interface FastifyRequest {
    authenticatedUser: {
      id: string
      permissions: string[]
    }
  }

  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest
    ) => Promise<void>
  }
}

// Styled-components theme kengaytirish
import "styled-components"

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string
      secondary: string
      background: string
      text: string
    }
    spacing: {
      sm: string
      md: string
      lg: string
    }
  }
}

// i18next — til kalitlarini tiplashtirish
import "i18next"

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common"
    resources: {
      common: {
        greeting: string
        farewell: string
      }
      auth: {
        login: string
        logout: string
      }
    }
  }
}

// Endi t("greeting") — OK
// t("nonexistent") — XATO`,
    },
  ],
  interviewQA: [
    {
      question: 'Declaration merging nima va qanday tiplar merge bo\'ladi?',
      answer:
        'Declaration merging — bir xil nomdagi bir nechta deklaratsiyani birlashtirib, bitta natija berish. Merge bo\'ladigan juftliklar: interface + interface (propertylar birlashadi), namespace + namespace (eksportlar), class + interface, enum + namespace. Type alias (type) merge bo\'lmaydi — xato beradi. Interface merging eng ko\'p ishlatiladi — kutubxona tiplarini kengaytirish uchun.',
    },
    {
      question: 'declare module va declare global farqi nima?',
      answer:
        'declare module "name" — aniq modul tiplarini kengaytirish. Masalan, declare module "express" — Express tiplarini to\'ldirish. declare global — global scope (Window, NodeJS, Array) ni kengaytirish. Ikkalasi ham .d.ts yoki oddiy .ts faylda yozilishi mumkin. MUHIM: declare global faqat modul faylda ishlaydi — kamida bitta import/export kerak.',
    },
    {
      question: 'Express da request tipini qanday kengaytirish mumkin?',
      answer:
        'Module augmentation bilan: declare module "express" { interface Request { user?: UserType } }. Bu .d.ts faylga yoki alohida .ts faylga yoziladi, tsconfig.json include qismida bo\'lishi kerak. Endi req.user TypeScript tomonidan taniladi. Middleware da req.user = authenticatedUser assign qilish mumkin.',
    },
    {
      question: '.d.ts fayl nima va qachon kerak?',
      answer:
        '.d.ts — faqat tip ma\'lumoti, runtime kodi yo\'q. Kerak bo\'lganda: 1) JavaScript kutubxona uchun tip yozish, 2) global tiplar (Window, ProcessEnv) kengaytirish, 3) CSS/image modullar uchun tip, 4) ambient deklaratsiyalar. tsconfig include da bo\'lishi kerak. .d.ts dan import qilish mumkin emas — faqat tip informatsiyasi beradi.',
    },
    {
      question: 'Vite loyihada environment variablelarni qanday tiplashtirish mumkin?',
      answer:
        'env.d.ts faylda: interface ImportMetaEnv { readonly VITE_API_URL: string } va interface ImportMeta { readonly env: ImportMetaEnv }. /// <reference types="vite/client" /> qo\'shish kerak. Endi import.meta.env.VITE_API_URL string tipida bo\'ladi. VITE_ prefiksi bo\'lmagan variablelar client bundle ga tushmaydi.',
    },
    {
      question: 'Type alias (type) nima uchun merge bo\'lmaydi?',
      answer:
        'TypeScript dizayn qaroriga ko\'ra — type alias unique bo\'lishi kerak. Ikki xil type bir xil nomda e\'lon qilish kompilyatsiya xatosi. Bu aniqlik uchun: interface ochiq (open) — kengaytirilishi kutiladi. Type alias yopiq (closed) — aniq bir tuzilma. Agar merge kerak bo\'lsa — interface ishlatish kerak.',
    },
  ],
}
