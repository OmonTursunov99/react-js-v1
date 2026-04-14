import type { Topic } from '../../../types'

export const readonlyImmutability: Topic = {
  id: 'readonly-immutability',
  title: 'Readonly va Immutability',
  importance: 2,
  status: 'to-learn',
  description:
    'readonly modifier, Readonly<T>, ReadonlyArray, as const, deep readonly va immutable patternlar.',
  content: `
# READONLY VA IMMUTABILITY
═══════════════════════════════════════

TypeScript da immutability — qiymatlarni o'zgartirib bo'lmaslikni KOMPILYATSIYA vaqtida kafolatlash. Runtime da JavaScript ob'ektlari hali ham mutable — lekin TypeScript xatolarni oldindan aniqlaydi.

## READONLY MODIFIER

\`readonly\` — property yoki parametrni faqat o'qish uchun belgilash. Assign qilishga urinish kompilyatsiya xatosi beradi.

MUHIM: readonly faqat BIR daraja chuqurlikda ishlaydi. Nested ob'ektlar hali ham mutable — bu "shallow readonly".

## READONLY<T> UTILITY TYPE

\`Readonly<T>\` — barcha propertylarni readonly qiladi. Lekin bu ham shallow — nested ob'ektlar mutable qoladi.

## READONLYARRAY<T>

\`ReadonlyArray<T>\` yoki \`readonly T[]\` — massivni o'zgartirib bo'lmaydigan qiladi. push, pop, splice kabi mutating methodlar yo'qoladi.

## AS CONST — DEEP READONLY

\`as const\` — eng kuchli immutability vositasi:
1. Barcha qiymatlar literal tipga aylanadi
2. Barcha darajadagi propertylar readonly bo'ladi
3. Massivlar readonly tuple bo'ladi

## DEEP READONLY RECURSIVE TYPE

\`as const\` faqat literal qiymatlar uchun ishlaydi. Dinamik qiymatlar uchun recursive DeepReadonly tipi kerak.

## OBJECT.FREEZE VA TYPESCRIPT

\`Object.freeze()\` — runtime da ham, TypeScript da ham shallow freeze. TypeScript \`Readonly<T>\` qaytaradi. Deep freeze uchun recursive funksiya kerak.

## IMMUTABLE PATTERNS

1. Redux state — doim yangi ob'ekt qaytarish
2. Function parameters — readonly qilish
3. Config ob'ektlar — as const
4. React props — o'zgartirib bo'lmaydi
5. Builder pattern — har qadamda yangi instance
  `.trim(),
  codeExamples: [
    {
      title: 'readonly modifier',
      language: 'ts',
      description: 'Property va parameter uchun readonly.',
      code: `// Property readonly
interface User {
  readonly id: string
  readonly createdAt: Date
  name: string  // mutable
  email: string // mutable
}

const user: User = {
  id: "u-123",
  createdAt: new Date(),
  name: "Ali",
  email: "ali@test.com",
}

user.name = "Vali"       // OK — mutable
// user.id = "u-456"     // XATO: readonly

// Class da readonly
class Config {
  readonly host: string
  readonly port: number

  constructor(host: string, port: number) {
    this.host = host  // Constructor da assign mumkin
    this.port = port
  }
}

const cfg = new Config("localhost", 3000)
// cfg.port = 8080  // XATO: readonly

// Function parameter
function processItems(readonly items: readonly string[]) {
  // items.push("new")  // XATO
  // items[0] = "changed"  // XATO
  return items.map(i => i.toUpperCase())  // OK — yangi array
}`,
    },
    {
      title: 'Readonly<T> va ReadonlyArray',
      language: 'ts',
      description: 'Utility typelar bilan immutability.',
      code: `// Readonly<T> — barcha propertylar readonly
interface Settings {
  theme: string
  language: string
  notifications: boolean
}

function applySettings(settings: Readonly<Settings>) {
  // settings.theme = "dark"  // XATO: readonly
  console.log(settings.theme)
}

// ReadonlyArray<T> yoki readonly T[]
const numbers: ReadonlyArray<number> = [1, 2, 3]
// numbers.push(4)     // XATO: push mavjud emas
// numbers[0] = 10     // XATO: index assign taqiqlangan

// Ikki xil yozuv — bir xil natija
const a: ReadonlyArray<string> = ["a", "b"]
const b: readonly string[] = ["a", "b"]

// ReadonlyMap va ReadonlySet
const map: ReadonlyMap<string, number> = new Map([
  ["a", 1],
  ["b", 2],
])
// map.set("c", 3)  // XATO: set mavjud emas
map.get("a")        // OK — o'qish mumkin

const set: ReadonlySet<string> = new Set(["a", "b"])
// set.add("c")     // XATO
set.has("a")        // OK

// MUHIM: Readonly shallow — nested mutable
interface State {
  user: { name: string }
}
const state: Readonly<State> = { user: { name: "Ali" } }
state.user.name = "Vali"  // OK! Nested property mutable`,
    },
    {
      title: 'as const — deep literal readonly',
      language: 'ts',
      description: 'as const bilan chuqur immutability va literal tiplar.',
      code: `// as const — barcha daraja readonly + literal type
const ROUTES = {
  home: "/",
  about: "/about",
  users: {
    list: "/users",
    detail: "/users/:id",
    settings: "/users/:id/settings",
  },
} as const

// Tip: {
//   readonly home: "/"
//   readonly about: "/about"
//   readonly users: {
//     readonly list: "/users"
//     readonly detail: "/users/:id"
//     readonly settings: "/users/:id/settings"
//   }
// }

// ROUTES.home = "/new"               // XATO
// ROUTES.users.list = "/all-users"   // XATO — deep readonly!

// Literal tiplarni ajratib olish
type Route = typeof ROUTES.users[keyof typeof ROUTES.users]
// "/users" | "/users/:id" | "/users/:id/settings"

// Tuple sifatida
const RGB = [255, 128, 0] as const
// Tip: readonly [255, 128, 0]

// Enum o'rniga
const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const

type StatusCode = typeof HTTP_STATUS[keyof typeof HTTP_STATUS]
// 200 | 404 | 500`,
    },
    {
      title: 'DeepReadonly recursive type',
      language: 'ts',
      description: 'Nested ob\'ektlar uchun recursive readonly.',
      code: `// DeepReadonly — recursive tip
type DeepReadonly<T> =
  T extends Function
    ? T
    : T extends Map<infer K, infer V>
      ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
      : T extends Set<infer U>
        ? ReadonlySet<DeepReadonly<U>>
        : T extends Array<infer U>
          ? ReadonlyArray<DeepReadonly<U>>
          : T extends object
            ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
            : T

// Ishlatish
interface AppState {
  user: {
    name: string
    settings: {
      theme: string
      notifications: boolean
    }
  }
  items: string[]
}

type ImmutableState = DeepReadonly<AppState>

const state: ImmutableState = {
  user: {
    name: "Ali",
    settings: { theme: "dark", notifications: true },
  },
  items: ["a", "b"],
}

// state.user.name = "Vali"                    // XATO
// state.user.settings.theme = "light"         // XATO
// state.items.push("c")                       // XATO
// Hamma daraja himoyalangan!`,
    },
    {
      title: 'Object.freeze va immutable patterns',
      language: 'ts',
      description: 'Runtime freeze va amaliy immutability patternlari.',
      code: `// Object.freeze — runtime + TypeScript
const config = Object.freeze({
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
})
// TypeScript tipi: Readonly<{ apiUrl: string; ... }>
// config.timeout = 10000  // XATO (TS) + silent fail (runtime)

// Deep freeze funksiya
function deepFreeze<T extends object>(obj: T): DeepReadonly<T> {
  Object.freeze(obj)
  for (const key of Object.keys(obj)) {
    const value = (obj as Record<string, unknown>)[key]
    if (typeof value === "object" && value !== null) {
      deepFreeze(value as object)
    }
  }
  return obj as DeepReadonly<T>
}

// Redux reducer pattern
interface State {
  count: number
  items: string[]
}

function reducer(
  state: Readonly<State>,
  action: { type: string; payload?: unknown }
): State {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 }
    case "ADD_ITEM":
      return {
        ...state,
        items: [...state.items, action.payload as string],
      }
    default:
      return { ...state }
  }
}`,
    },
  ],
  interviewQA: [
    {
      question: 'readonly va Readonly<T> farqi nima?',
      answer:
        'readonly — property modifier, alohida propertylarga qo\'yiladi: readonly id: string. Readonly<T> — utility type, barcha propertylarni birdaniga readonly qiladi: Readonly<User>. Ikkalasi ham shallow — faqat birinchi daraja. Nested ob\'ektlar mutable qoladi. Deep readonly uchun recursive tip yoki as const kerak.',
    },
    {
      question: 'as const va Object.freeze farqi nima?',
      answer:
        'as const — faqat TypeScript, kompilyatsiya vaqtida. Deep readonly + literal tiplar beradi. Runtime da hech narsa o\'zgarmaydi. Object.freeze — runtime da ham ishlaydi, lekin shallow. TypeScript da Readonly<T> qaytaradi. as const — tip xavfsizligi, Object.freeze — runtime himoya. Ideal holat: ikkalasini birga ishlatish.',
    },
    {
      question: 'Nima uchun Readonly shallow va bu muammo qanday hal qilinadi?',
      answer:
        'Readonly<T> mapped type: { readonly [K in keyof T]: T[K] } — faqat birinchi darajadagi kalitlarni readonly qiladi. T[K] o\'zi o\'zgarmaydi, shuning uchun nested ob\'ektlar mutable qoladi. Yechimlar: 1) DeepReadonly recursive tip — barcha darajalarni readonly qiladi, 2) as const — literal qiymatlar uchun, 3) Immer kutubxonasi — runtime + tip himoya.',
    },
    {
      question: 'ReadonlyArray<T> va T[] farqi nima?',
      answer:
        'ReadonlyArray<T> yoki readonly T[] — massivda mutating methodlar (push, pop, splice, sort) yo\'q bo\'ladi. Index bilan assign ham taqiqlanadi: arr[0] = "x" xato. Faqat o\'qish methodlari ishlaydi: map, filter, reduce, forEach. Funksiya parametrlarida readonly array ishlatish — side effect ni oldini oladi.',
    },
    {
      question: 'Redux state ni TypeScript da qanday immutable qilish mumkin?',
      answer:
        'Bir necha yondashuv: 1) Readonly<State> — reducer parametrida, shallow himoya. 2) DeepReadonly<State> — to\'liq himoya. 3) as const — initial state uchun. 4) Immer produce — runtime immutability + TypeScript tipi. 5) Redux Toolkit — ichida Immer ishlatadi, state "mutable" ko\'rinadi lekin aslida immutable. Eng yaxshi — RTK + strict TypeScript.',
    },
  ],
}
