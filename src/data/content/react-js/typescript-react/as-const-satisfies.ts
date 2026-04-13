import type { Topic } from '../../../types'

export const asConstSatisfies: Topic = {
    id: 'as-const-satisfies',
    title: 'as const, satisfies',
    importance: 2,
    status: 'to-learn',
    description: 'TypeScript 5 features',
    content: `as const va satisfies — TypeScript-ning kuchli tip daraqalash (narrowing) vositalari. React konfiguratsiyalar va route-larda juda foydali.

═══════════════════════════════════════
  as const — LITERAL TIPGA AYLANTIRISH
═══════════════════════════════════════

Oddiy:
  const colors = ['red', 'green', 'blue']
  // tip: string[] — har qanday string bo'lishi mumkin

as const bilan:
  const colors = ['red', 'green', 'blue'] as const
  // tip: readonly ['red', 'green', 'blue'] — FAQAT shu 3 ta

Farq:
  const config = { api: '/api', timeout: 3000 }
  // tip: { api: string; timeout: number }

  const config = { api: '/api', timeout: 3000 } as const
  // tip: { readonly api: '/api'; readonly timeout: 3000 }
  // Qiymatlar ANIQ va O'ZGARMAS

as const beradi:
  ✅ Literal types (string → 'exact-string')
  ✅ readonly (o'zgartirish mumkin emas)
  ✅ Tuple (array → exact tuple)

═══════════════════════════════════════
  as const ISHLATISH HOLATLARI
═══════════════════════════════════════

1. Route konfiguratsiya:
   const ROUTES = {
     home: '/',
     about: '/about',
     user: '/users/:id',
   } as const
   // ROUTES.home tipi '/' (string emas)

2. Action types:
   const ACTIONS = {
     add: 'TODO_ADD',
     remove: 'TODO_REMOVE',
   } as const

3. Variant array:
   const sizes = ['sm', 'md', 'lg'] as const
   type Size = typeof sizes[number]  // 'sm' | 'md' | 'lg'

═══════════════════════════════════════
  satisfies — TIPNI TEKSHIRISH + ANIQLASH
═══════════════════════════════════════

satisfies operator — qiymat berilgan TIPGA mos kelishini tekshiradi,
LEKIN aniqroq tipni SAQLAB QOLADI.

Muammo:
  type Colors = Record<string, [number, number, number]>

  // Variant 1: type annotation
  const colors: Colors = { red: [255, 0, 0], green: [0, 255, 0] }
  colors.red  // [number, number, number] — 'red' kaliti yo'qoldi

  // Variant 2: as const
  const colors = { red: [255, 0, 0], green: [0, 255, 0] } as const
  // Tip to'g'ri, lekin Colors ga mos kelishini TEKSHIRMAYDI

  // ✅ satisfies — IKKALASI: tekshirish + aniq tip
  const colors = {
    red: [255, 0, 0],
    green: [0, 255, 0],
  } satisfies Colors
  colors.red  // [number, number, number] — LEKIN 'red' kaliti saqlanadi!

═══════════════════════════════════════
  satisfies + as const
═══════════════════════════════════════

Eng kuchli kombinatsiya — IKKALASINI BIRGA:

  const config = {
    api: '/api',
    timeout: 3000,
    retries: 3,
  } as const satisfies Record<string, string | number>

  // 1. as const — qiymatlar literal: '/api', 3000, 3
  // 2. satisfies — Record<string, string | number> ga MOS kelishini tekshiradi
  // 3. Aniq tip saqlanadi: config.api = '/api' (string emas)`,
    codeExamples: [
      {
        title: 'as const — route va config',
        language: 'tsx',
        code: `// 1. Route paths
const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  user: '/users/:id',
  settings: '/settings',
} as const

type RoutePath = typeof ROUTES[keyof typeof ROUTES]
// '/' | '/dashboard' | '/users/:id' | '/settings'

function navigate(path: RoutePath) { /* ... */ }
navigate(ROUTES.dashboard)  // ✅ '/dashboard'
navigate('/random')          // ❌ bu path yo'q!

// 2. Union type array-dan
const STATUSES = ['idle', 'loading', 'success', 'error'] as const
type Status = typeof STATUSES[number]  // 'idle' | 'loading' | 'success' | 'error'

// Select komponentda ishlatish
function StatusSelect({ value, onChange }: { value: Status; onChange: (s: Status) => void }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value as Status)}>
      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  )
}

// 3. Event map
const EVENT_NAMES = {
  userCreated: 'USER_CREATED',
  userDeleted: 'USER_DELETED',
  orderPlaced: 'ORDER_PLACED',
} as const

type EventName = typeof EVENT_NAMES[keyof typeof EVENT_NAMES]
// 'USER_CREATED' | 'USER_DELETED' | 'ORDER_PLACED'`,
        description: 'as const — route paths, status-lar, event nomlari. typeof + keyof bilan union type yaratish. string emas, ANIQ qiymatlar — xato qilish mumkin emas.',
      },
      {
        title: 'satisfies — tip tekshirish + aniq tip',
        language: 'tsx',
        code: `// Theme config — satisfies bilan
interface ThemeConfig {
  colors: Record<string, string>
  spacing: Record<string, number>
  fonts: Record<string, string>
}

const theme = {
  colors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    danger: '#EF4444',
  },
  spacing: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
  },
  fonts: {
    body: 'Inter, sans-serif',
    heading: 'Poppins, sans-serif',
  },
} satisfies ThemeConfig

// ✅ ThemeConfig ga mos kelishini TEKSHIRDI
// ✅ Aniq kalitlar saqlanadi:
theme.colors.primary    // ✅ autocomplete ishlaydi
theme.colors.unknown    // ❌ xato — 'unknown' yo'q

// as const satisfies — eng kuchli
const routes = {
  home: '/',
  about: '/about',
  contact: '/contact',
} as const satisfies Record<string, string>

// 1. Record<string, string> ga mos — ✅ tekshirildi
// 2. Qiymatlar literal: routes.home = '/' (string emas)
// 3. Kalitlar aniq: routes.home ✅, routes.unknown ❌

// Form validation rules
interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
}

const validationRules = {
  email: { required: true, pattern: /^[^@]+@[^@]+$/ },
  password: { required: true, minLength: 8, maxLength: 100 },
  name: { required: true, minLength: 2 },
} satisfies Record<string, ValidationRule>

// validationRules.email.pattern — ✅ mavjud (aniq tip)
// validationRules.email.minLength — ❌ yo'q (aniq tip!)`,
        description: 'satisfies — tipga mos kelishini tekshiradi, lekin ANIQ tipni saqlaydi. Type annotation (: Type) bilan farq: annotation aniq tipni yo\'qotadi, satisfies saqlaydi.',
      },
    ],
    interviewQA: [
      {
        question: 'as const nima qiladi?',
        answer: `as const — qiymatlarni LITERAL tipga aylantiradi va readonly qiladi. string → "exact-string", number → exact-number, array → readonly tuple. Misol: const x = "hello" as const — tip "hello" (string emas). Array: ["a", "b"] as const → readonly ["a", "b"]. Object: {api: "/api"} as const → {readonly api: "/api"}. Foydali: route paths, action types, config qiymatlar — ANIQ qiymatlar bilan ishlash, noto'g'ri string-ni oldini olish.`,
      },
      {
        question: 'satisfies va type annotation (:) farqi nima?',
        answer: `Type annotation (: Type) — qiymatga tip BERADI, aniq qiymat yo'qoladi. const x: Record<string, string> = {a: "1"} — x.a tipi string, x.b ham string (xato berMAYDI). satisfies — tipga MOS KELISHINI TEKSHIRADI, lekin aniq tipni SAQLAYDI. const x = {a: "1"} satisfies Record<string, string> — x.a tipi "1" (literal), x.b xato beradi (yo'q). satisfies = tip tekshirish + aniq tip saqlash.`,
      },
      {
        question: 'typeof ROUTES[keyof typeof ROUTES] nima qiladi?',
        answer: `Bosqichma-bosqich: 1) typeof ROUTES — object tipini oladi: {home: "/", about: "/about"}. 2) keyof typeof ROUTES — kalitlar union: "home" | "about". 3) typeof ROUTES[keyof typeof ROUTES] — qiymatlar union: "/" | "/about". as const bilan ishlaydi — as const bo'lmasa barcha qiymatlar string bo'lib qoladi. Natija: route path-larning ANIQ union tipini yaratish — navigate funksiyasiga faqat mavjud path berish mumkin.`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'typescript-react', topicId: 'utility-types', label: 'Utility Types' },
    ],
  }
