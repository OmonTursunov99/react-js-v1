import type { Topic } from '../../types'

export const tsFundamentalsTopics: Topic[] = [
  // ─── 1. Basic Types ───
  {
    id: 'basic-types',
    title: 'Asosiy tiplar',
    importance: 3,
    status: 'to-learn',
    description:
      'TypeScript ning barcha primitiv va maxsus tiplari: string, number, boolean, array, tuple, enum, any, unknown, void, never.',
    content: `
# Asosiy tiplar (Basic Types)

TypeScript JavaScript ustiga **statik tiplar** qo'shadi. Bu xatolarni kod yozish vaqtidayoq aniqlashga yordam beradi.

## Primitiv tiplar

**string** — matn qiymatlari uchun.
**number** — butun va kasr sonlar uchun (int/float farqi yo'q).
**boolean** — \`true\` yoki \`false\`.

\`\`\`ts
let name: string = "Ali"
let age: number = 25
let isActive: boolean = true
\`\`\`

## Array va Tuple

**Array** — bir xil tipdagi elementlar ro'yxati. Ikki xil yozuv bor: \`number[]\` yoki \`Array<number>\`.

**Tuple** — aniq uzunlik va har bir pozitsiyada aniq tip. Masalan, \`[string, number]\` — birinchi element string, ikkinchisi number bo'lishi shart.

## Enum

**enum** — nomlangan konstantalar to'plami. Numeric enum default 0 dan boshlanadi. String enum har bir qiymatga aniq matn beradi.

## any va unknown

**any** — har qanday tip. TypeScript tekshiruvni to'liq o'chiradi — xavfli, faqat migratsiya vaqtida ishlatilsin.

**unknown** — any ga o'xshash, lekin **xavfsiz**. Qiymatni ishlatishdan oldin tipni tekshirish majburiy.

## void va never

**void** — funksiya hech narsa qaytarmasligi. \`undefined\` qaytarish mumkin.

**never** — funksiya hech qachon tugamasligi (throw, cheksiz loop) yoki qiymat mavjud bo'lmasligi.

## Qachon qaysi tipni ishlatish?

- **Ma'lum tip** (string, number) — doim afzal
- **unknown** — tashqi ma'lumot (API javob, foydalanuvchi kiritmasi)
- **any** — faqat migratsiya yoki vaqtincha yechim
- **never** — exhaustive check, impossible state
- **void** — qaytarish qiymati yo'q funksiyalar

> **Eslatma:** TypeScript type inference kuchli — ko'p hollarda tipni yozmasdan ham to'g'ri aniqlanadi. Lekin funksiya parametrlari va murakkab strukturalarda explicit tip yozish tavsiya etiladi.
    `.trim(),
    codeExamples: [
      {
        title: 'Primitiv tiplar',
        language: 'ts',
        description: 'string, number, boolean — eng ko\'p ishlatiladigan tiplar.',
        code: `// Primitiv tiplar
let name: string = "Ali"
let age: number = 25
let isStudent: boolean = true

// Type inference — tip avtomatik aniqlanadi
let city = "Toshkent"   // string
let score = 100          // number

// Funksiya parametrlari — tip yozish majburiy
function greet(name: string): string {
  return \`Salom, \${name}!\`
}`,
      },
      {
        title: 'Array va Tuple',
        language: 'ts',
        description: 'Array bir xil tipli, Tuple — har pozitsiyada alohida tip.',
        code: `// Array — ikki xil yozuv
const numbers: number[] = [1, 2, 3]
const names: Array<string> = ["Ali", "Vali"]

// Tuple — aniq uzunlik va tartib
const person: [string, number] = ["Ali", 25]

// Tuple destructuring
const [personName, personAge] = person

// Optional element
const record: [string, number, boolean?] = ["Ali", 25]

// Rest element
const list: [string, ...number[]] = ["scores", 90, 85, 95]`,
      },
      {
        title: 'any vs unknown',
        language: 'ts',
        description: 'unknown xavfsiz alternativa — tipni tekshirmasdan ishlatib bo\'lmaydi.',
        code: `// any — hech qanday tekshiruv yo'q (XAVFLI)
let risky: any = "hello"
risky.toFixed(2)   // Runtime xato! Lekin TS xato bermaydi

// unknown — xavfsiz variant
let safe: unknown = "hello"
// safe.toUpperCase()  // XATO: unknown da method chaqirib bo'lmaydi

// Avval tipni tekshirish kerak
if (typeof safe === "string") {
  console.log(safe.toUpperCase())  // OK!
}

// Amaliy misol — API javob
async function fetchData(): Promise<unknown> {
  const res = await fetch("/api/data")
  return res.json()
}`,
      },
      {
        title: 'void va never',
        language: 'ts',
        description: 'void — qaytarish yo\'q, never — hech qachon tugamaydi.',
        code: `// void — hech narsa qaytarmaydigan funksiya
function logMessage(msg: string): void {
  console.log(msg)
}

// never — hech qachon tugamaydigan funksiya
function throwError(msg: string): never {
  throw new Error(msg)
}

function infiniteLoop(): never {
  while (true) {
    // ...
  }
}

// never — exhaustive check uchun
type Shape = "circle" | "square"

function getArea(shape: Shape): number {
  switch (shape) {
    case "circle": return Math.PI * 10
    case "square": return 100
    default:
      const _exhaustive: never = shape
      return _exhaustive
  }
}`,
      },
    ],
    interviewQA: [
      {
        question: 'any va unknown ning farqi nima?',
        answer:
          'any — TypeScript tiplar tekshiruvini to\'liq o\'chiradi, har qanday operatsiya ruxsat etiladi. unknown ham har qanday qiymatni qabul qiladi, lekin undan foydalanishdan oldin tipni tekshirish (typeof, instanceof) majburiy. unknown xavfsizroq chunki runtime xatolarni oldini oladi.',
      },
      {
        question: 'never tipi qachon ishlatiladi?',
        answer:
          'never 3 holatda ishlatiladi: 1) Hech qachon tugamaydigan funksiyalar (throw, infinite loop). 2) Exhaustive checking — switch/if da barcha variantlar ko\'rib chiqilganini tekshirish. 3) Conditional types da impossible branch. never hech qanday tipga assign bo\'lmaydi, lekin har qanday tipga assign qilish mumkin.',
      },
      {
        question: 'Tuple va Array ning farqi nima?',
        answer:
          'Array — bir xil tipdagi cheksiz elementlar ro\'yxati (number[]). Tuple — aniq uzunlik va har bir pozitsiyada o\'z tipi bor ([string, number]). Tuple compile vaqtida uzunlik va pozitsiya tiplarini tekshiradi, Array faqat element tipini tekshiradi.',
      },
      {
        question: 'Type inference nima va qachon explicit tip yozish kerak?',
        answer:
          'Type inference — TypeScript ning qiymatdan tipni avtomatik aniqlashi. let x = 5 da x avtomatik number bo\'ladi. Explicit tip yozish kerak: funksiya parametrlarida, qaytarish tiplarida, murakkab ob\'ektlarda, va any ga "tushib qolish" xavfi bo\'lganda.',
      },
    ],
  },

  // ─── 2. Interfaces va Types ───
  {
    id: 'interfaces-types',
    title: 'Interface va Type Alias',
    importance: 3,
    status: 'to-learn',
    description:
      'interface va type alias orasidagi farqlar, extending, declaration merging va qachon qaysi birini ishlatish.',
    content: `
# Interface va Type Alias

TypeScript da ob'ekt shaklini (shape) belgilash uchun ikkita asosiy usul bor: **interface** va **type alias**.

## Interface

Interface ob'ektning tuzilishini belgilaydi. Faqat ob'ekt shakli uchun ishlatiladi.

\`\`\`ts
interface User {
  name: string
  age: number
  email?: string  // optional
}
\`\`\`

**Extending** — boshqa interfacedan meros olish:
\`\`\`ts
interface Admin extends User {
  role: string
}
\`\`\`

**Declaration merging** — bir xil nomdagi interface avtomatik birlashadi. Bu kutubxonalar tiplarini kengaytirish uchun juda qulay.

## Type Alias

Type alias har qanday tipga nom berish uchun ishlatiladi — primitiv, union, tuple, funksiya.

\`\`\`ts
type ID = string | number
type Point = { x: number; y: number }
type Callback = (data: string) => void
\`\`\`

**Intersection** — tiplarni birlashtirish:
\`\`\`ts
type Admin = User & { role: string }
\`\`\`

## Qachon qaysi birini ishlatish?

| Xususiyat | interface | type |
|-----------|-----------|------|
| Ob'ekt shape | Ha | Ha |
| Union type | Yo'q | Ha |
| Declaration merging | Ha | Yo'q |
| extends | Ha | Yo'q (& ishlatiladi) |
| Primitiv alias | Yo'q | Ha |
| Tuple | Yo'q | Ha |
| computed properties | Yo'q | Ha |

**Umumiy qoida:** Ob'ekt uchun — interface, boshqa hamma narsa uchun — type. Kutubxona yozayotganda interface afzal (merging imkoniyati).

> **Eslatma:** Ko'p jamoalar konsistentlik uchun faqat bittasini tanlaydi. React ekosistemada type ko'proq uchraydi.
    `.trim(),
    codeExamples: [
      {
        title: 'Interface — asosiy ishlatish',
        language: 'ts',
        description: 'Interface ob\'ektning shaklini belgilaydi, extending va optional propertylar.',
        code: `// Asosiy interface
interface User {
  id: number
  name: string
  email?: string        // optional property
  readonly createdAt: Date  // o'zgartirib bo'lmaydi
}

// Extending
interface Admin extends User {
  role: "admin" | "superadmin"
  permissions: string[]
}

// Multiple extending
interface SuperAdmin extends Admin {
  canDeleteUsers: boolean
}

// Ishlatish
const admin: Admin = {
  id: 1,
  name: "Ali",
  role: "admin",
  permissions: ["read", "write"],
  createdAt: new Date()
}`,
      },
      {
        title: 'Type Alias — union, tuple, funksiya',
        language: 'ts',
        description: 'Type har qanday tipga nom beradi — interface qila olmaydigan narsalar.',
        code: `// Union types
type Status = "loading" | "success" | "error"
type ID = string | number

// Tuple types
type Coordinate = [number, number]
type NameAge = [string, number]

// Function types
type Handler = (event: MouseEvent) => void
type AsyncFn<T> = () => Promise<T>

// Conditional alias
type Nullable<T> = T | null
type Optional<T> = T | undefined

// Intersection (extends o'rniga)
type User = { name: string; age: number }
type Admin = User & { role: string }

// Template literal types
type EventName = \`on\${"Click" | "Hover" | "Focus"}\`
// "onClick" | "onHover" | "onFocus"`,
      },
      {
        title: 'Declaration Merging',
        language: 'ts',
        description: 'Bir xil nomdagi interface lar avtomatik birlashadi — kutubxonalarni kengaytirish uchun qulay.',
        code: `// Declaration merging — faqat interface da ishlaydi
interface Config {
  apiUrl: string
}

interface Config {
  timeout: number
}

// Natija — ikkala property bor:
const config: Config = {
  apiUrl: "https://api.example.com",
  timeout: 5000
}

// Amaliy misol — Window ob'ektini kengaytirish
declare global {
  interface Window {
    analytics: {
      track: (event: string) => void
    }
  }
}

// type alias da merging ISHLAMAYDI
// type Config = { apiUrl: string }
// type Config = { timeout: number }  // XATO!`,
      },
    ],
    interviewQA: [
      {
        question: 'interface va type alias ning asosiy farqlari nimada?',
        answer:
          'Asosiy farqlar: 1) interface faqat ob\'ekt shape uchun, type har qanday tip uchun (union, tuple, primitiv). 2) interface da declaration merging bor — bir xil nomdagi interface lar birlashadi, type da bu yo\'q. 3) interface extends bilan meros oladi, type & (intersection) bilan birlashtiradi. 4) type computed properties va template literal types qo\'llab-quvvatlaydi.',
      },
      {
        question: 'Declaration merging nima va qachon foydali?',
        answer:
          'Declaration merging — bir xil nomdagi interface lar avtomatik birlashishi. Foydali holatlari: 1) Kutubxona tiplarini kengaytirish (Window, Express.Request). 2) Module augmentation — third-party paketlarga yangi tiplar qo\'shish. 3) Plugin tizimi — har bir plugin o\'z tiplarini qo\'shadi. type alias da bu imkoniyat yo\'q.',
      },
      {
        question: 'React komponentlar uchun interface yoki type ishlatish kerak?',
        answer:
          'React ekosistemada type ko\'proq ishlatiladi, chunki: 1) Props ko\'pincha oddiy ob\'ekt, merging kerak emas. 2) Union tiplar kerak bo\'lsa type qulay. 3) React.FC, React.ComponentProps type bilan yaxshi ishlaydi. Lekin bu shaxsiy afzallik — ikkalasi ham to\'g\'ri ishlaydi. Muhimi — jamoada konsistentlik.',
      },
      {
        question: 'extends va intersection (&) ning farqi nima?',
        answer:
          'extends — interface uchun, yangi interface yaratadi va ota interface barcha propertylarini meros oladi. Xato bo\'lsa (property conflict) compile vaqtida aniq xato beradi. & (intersection) — type uchun, ikki tipni birlashtiradi. Conflict bo\'lsa never tipga aylanishi mumkin, xato aniq bo\'lmasligi mumkin. Performance jihatdan interface extends biroz tezroq.',
      },
    ],
  },

  // ─── 3. Type Narrowing ───
  {
    id: 'type-narrowing',
    title: 'Type Narrowing',
    importance: 3,
    status: 'to-learn',
    description:
      'typeof, instanceof, in operatorlari, discriminated unions va assertion funksiyalar yordamida tipni aniqlashtirish.',
    content: `
# Type Narrowing

Type narrowing — keng tipdan tor tipga o'tish jarayoni. TypeScript control flow analysis orqali tipni avtomatik toraytiradi.

## typeof guard

\`typeof\` operatori primitiv tiplarni tekshiradi: "string", "number", "boolean", "undefined", "object", "function", "symbol", "bigint".

\`\`\`ts
function process(value: string | number) {
  if (typeof value === "string") {
    value.toUpperCase()  // string
  } else {
    value.toFixed(2)     // number
  }
}
\`\`\`

## instanceof guard

\`instanceof\` class instancelarini tekshiradi. Prototype chain bo'yicha ishlaydi.

## in operator

\`"property" in object\` — ob'ektda ma'lum property borligini tekshiradi. Discriminated unions bilan ishlatiladi.

## Discriminated Unions

Har bir union a'zosida umumiy "tag" property bo'ladi. Bu eng kuchli narrowing pattern.

\`\`\`ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
\`\`\`

## Assertion Functions

\`asserts\` kalit so'zi bilan funksiya — agar xato tashlamasa, tip o'zgaradi.

## Truthiness narrowing

\`if (value)\` — null, undefined, 0, "" ni chiqarib tashlaydi. Lekin ehtiyot bo'ling — 0 va "" ham falsy!

## Control Flow Analysis

TypeScript har bir \`if/else\`, \`switch\`, \`return\`, \`throw\` dan keyin tipni avtomatik yangilaydi. Bu "flow-sensitive typing" deyiladi.

> **Muhim:** Type narrowing faqat TypeScript kompilyator uchun — runtime da hech narsa o'zgarmaydi. Bu compile-time xavfsizlik.
    `.trim(),
    codeExamples: [
      {
        title: 'typeof va instanceof',
        language: 'ts',
        description: 'Primitiv tiplar uchun typeof, class uchun instanceof.',
        code: `// typeof narrowing
function formatValue(value: string | number | boolean): string {
  if (typeof value === "string") {
    return value.toUpperCase()
  }
  if (typeof value === "number") {
    return value.toFixed(2)
  }
  return value ? "Ha" : "Yo'q"
}

// instanceof narrowing
class ApiError extends Error {
  statusCode: number
  constructor(message: string, code: number) {
    super(message)
    this.statusCode = code
  }
}

function handleError(error: Error) {
  if (error instanceof ApiError) {
    console.log(error.statusCode)  // ApiError tipi
  } else {
    console.log(error.message)     // Error tipi
  }
}`,
      },
      {
        title: 'Discriminated Unions',
        language: 'ts',
        description: 'Tag property orqali union a\'zolarini farqlash — eng kuchli pattern.',
        code: `// Discriminated union — "kind" tag property
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "rectangle"; width: number; height: number }

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2
    case "square":
      return shape.side ** 2
    case "rectangle":
      return shape.width * shape.height
    default:
      // Exhaustive check — yangi shape qo'shilsa xato beradi
      const _exhaustive: never = shape
      return _exhaustive
  }
}

// API response pattern
type ApiResponse<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string }

function handleResponse(res: ApiResponse<string[]>) {
  if (res.status === "success") {
    res.data.map(item => item)  // data mavjud
  }
}`,
      },
      {
        title: 'in operator va custom type guard',
        language: 'ts',
        description: 'in bilan property tekshirish va is kalit so\'zi bilan custom guard.',
        code: `// in operator
interface Cat { meow(): void }
interface Dog { bark(): void }

function makeSound(animal: Cat | Dog) {
  if ("meow" in animal) {
    animal.meow()  // Cat
  } else {
    animal.bark()  // Dog
  }
}

// Custom type guard — "is" kalit so'zi
function isCat(animal: Cat | Dog): animal is Cat {
  return "meow" in animal
}

// Ishlatish
function handleAnimal(animal: Cat | Dog) {
  if (isCat(animal)) {
    animal.meow()  // TypeScript biladi: Cat
  }
}

// Assertion function
function assertIsString(val: unknown): asserts val is string {
  if (typeof val !== "string") {
    throw new Error(\`\${val} is not a string\`)
  }
}

function process(input: unknown) {
  assertIsString(input)
  input.toUpperCase()  // string — assertion dan keyin
}`,
      },
    ],
    interviewQA: [
      {
        question: 'Type narrowing nima va nima uchun kerak?',
        answer:
          'Type narrowing — keng tipdan (masalan, string | number) tor tipga (faqat string) o\'tish. TypeScript control flow analysis orqali if/switch/return dan keyin tipni avtomatik toraytiradi. Bu type-safe kod yozish imkonini beradi — har bir branchda faqat tegishli tipdagi operatsiyalar ruxsat etiladi.',
      },
      {
        question: 'Discriminated union nima va qanday ishlaydi?',
        answer:
          'Discriminated union — har bir union a\'zosida umumiy literal tip property (tag) bo\'lgan union. Masalan: { kind: "circle" } | { kind: "square" }. TypeScript tag qiymatini tekshirganda qolgan propertylarni aniq biladi. Exhaustive checking bilan birga — yangi variant qo\'shilganda barcha switch/if larni yangilashga majburlaydi.',
      },
      {
        question: 'Custom type guard (is) va assertion function (asserts) ning farqi?',
        answer:
          'Type guard (is) — boolean qaytaradi, if/else da ishlatiladi: function isString(x: unknown): x is string. Assertion function (asserts) — xato tashlamasa tip o\'zgaradi, if kerak emas: function assert(x: unknown): asserts x is string. Type guard xavfsizroq — false qaytarsa kod davom etadi. Assertion function xato tashlaydi — validatsiya uchun qulay.',
      },
      {
        question: 'typeof operatori qanday tiplarni aniqlaydi?',
        answer:
          'typeof 8 ta qiymat qaytaradi: "string", "number", "boolean", "undefined", "object", "function", "symbol", "bigint". Muhim nuance: typeof null === "object" (JavaScript xatosi). typeof array ham "object" qaytaradi — array uchun Array.isArray() ishlatish kerak.',
      },
      {
        question: 'Exhaustive checking nima?',
        answer:
          'Exhaustive checking — discriminated union ning barcha variantlari ko\'rib chiqilganini tekshirish. switch default da never tipiga assign qilish orqali — agar yangi variant qo\'shilsa, TypeScript compile xato beradi. Bu pattern yangi case qo\'shilganda barcha joylarni yangilashni kafolatlaydi.',
      },
    ],
  },

  // ─── 4. Enums ───
  {
    id: 'enums',
    title: 'Enums',
    importance: 2,
    status: 'to-learn',
    description:
      'Numeric enums, string enums, const enums va ularning alternativlari.',
    content: `
# Enums

Enum — nomlangan konstantalar to'plami. TypeScript da enum runtime ob'ektga kompilyatsiya qilinadi.

## Numeric Enum

Default — 0 dan boshlanadi va har bir keyingi a'zo +1.

\`\`\`ts
enum Direction {
  Up,     // 0
  Down,   // 1
  Left,   // 2
  Right   // 3
}
\`\`\`

Boshlang'ich qiymat berish mumkin — keyingilar undan davom etadi.

## String Enum

Har bir a'zoga aniq string qiymat berish kerak. Debug qilishda qulay — runtime da "Up" ko'rinadi, 0 emas.

\`\`\`ts
enum Direction {
  Up = "UP",
  Down = "DOWN"
}
\`\`\`

## Const Enum

\`const enum\` — compile vaqtida inline qilinadi, runtime ob'ekt yaratilmaydi. Bundle hajmini kamaytiradi.

\`\`\`ts
const enum Status { Active, Inactive }
let s = Status.Active  // kompilyatsiyada: let s = 0
\`\`\`

**Lekin:** const enum isolatedModules bilan ishlamaydi (Vite, esbuild). Ko'p loyihalarda ishlatilmaydi.

## Enum muammolari

1. **Reverse mapping** — numeric enum da raqamdan nomga qaytish bor, bu kutilmagan xatti-harakat berishi mumkin.
2. **Bundle size** — har bir enum runtime ob'ekt yaratadi.
3. **isolatedModules** — const enum bilan muammo.
4. **Nominal typing** — enum a'zolari raqam bo'lsa ham, oddiy raqam bilan almashtirish mumkin (type-safe emas).

## Alternativlar

Ko'p jamolar enum o'rniga **union literal types** ishlatishni afzal ko'radi:

\`\`\`ts
type Direction = "up" | "down" | "left" | "right"
\`\`\`

Yoki **as const** bilan ob'ekt:

\`\`\`ts
const Direction = { Up: "UP", Down: "DOWN" } as const
type Direction = typeof Direction[keyof typeof Direction]
\`\`\`

> **Tavsiya:** Oddiy holatlar uchun union literal type ishlatish. Agar runtime da ob'ekt kerak bo'lsa — as const ob'ekt. enum faqat legacy kod yoki C#/Java dan kelgan dasturchilar uchun.
    `.trim(),
    codeExamples: [
      {
        title: 'Numeric va String Enum',
        language: 'ts',
        description: 'Numeric enum 0 dan boshlanadi, string enum har bir qiymatni aniq belgilaydi.',
        code: `// Numeric enum
enum HttpStatus {
  OK = 200,
  NotFound = 404,
  ServerError = 500
}

console.log(HttpStatus.OK)         // 200
console.log(HttpStatus[200])       // "OK" (reverse mapping)

// String enum — reverse mapping YO'Q
enum LogLevel {
  Debug = "DEBUG",
  Info = "INFO",
  Warn = "WARN",
  Error = "ERROR"
}

function log(level: LogLevel, message: string) {
  console.log(\`[\${level}] \${message}\`)
}

log(LogLevel.Error, "Xatolik yuz berdi")
// [ERROR] Xatolik yuz berdi`,
      },
      {
        title: 'Const Enum',
        language: 'ts',
        description: 'Compile vaqtida inline — runtime ob\'ekt yaratilmaydi.',
        code: `// const enum — inline qilinadi
const enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT"
}

// TypeScript buni shunday kompilyatsiya qiladi:
// let dir = "UP"
let dir = Direction.Up

// Oddiy enum — runtime ob'ekt yaratiladi:
enum Color {
  Red = "RED",
  Blue = "BLUE"
}
// Kompilyatsiyada: var Color; (function(Color) { ... })(Color)

// DIQQAT: const enum isolatedModules bilan ishlamaydi
// Vite, esbuild, SWC — barchasi isolatedModules`,
      },
      {
        title: 'Enum alternativlari',
        language: 'ts',
        description: 'Union literal types va as const — zamonaviy yondashuv.',
        code: `// 1. Union literal type — eng oddiy
type Status = "idle" | "loading" | "success" | "error"

function showStatus(status: Status) {
  // TypeScript autocomplete beradi
}

// 2. as const ob'ekt — runtime qiymatlar + tip
const ROLES = {
  Admin: "admin",
  Editor: "editor",
  Viewer: "viewer",
} as const

type Role = typeof ROLES[keyof typeof ROLES]
// "admin" | "editor" | "viewer"

// Runtime da ham ishlatish mumkin
Object.values(ROLES).forEach(role => console.log(role))

// 3. Enum-like pattern — raqamli qiymatlar kerak bo'lsa
const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const

type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS]
// 200 | 404 | 500`,
      },
    ],
    interviewQA: [
      {
        question: 'Nima uchun ko\'p jamolar enum o\'rniga union type ishlatadi?',
        answer:
          'Sabablar: 1) enum runtime ob\'ekt yaratadi — bundle hajmini oshiradi. 2) const enum isolatedModules (Vite, esbuild) bilan ishlamaydi. 3) Numeric enum type-safe emas — oddiy raqam ham qabul qilinadi. 4) Union type ("a" | "b") sodda, tree-shake bo\'ladi, va TypeScript ekosistemada yaxshi qo\'llab-quvvatlanadi.',
      },
      {
        question: 'const enum va oddiy enum ning farqi nima?',
        answer:
          'Oddiy enum runtime da JavaScript ob\'ekt yaratadi (IIFE). const enum compile vaqtida inline qilinadi — runtime ob\'ekt yo\'q, faqat qiymatlar qo\'yiladi. const enum bundle hajmini kamaytiradi, lekin isolatedModules rejimida ishlamaydi va reverse mapping qo\'llab-quvvatlamaydi.',
      },
      {
        question: 'Enum ning reverse mapping nima?',
        answer:
          'Numeric enum da qiymatdan nomga qaytish mumkin: HttpStatus[200] === "OK". Bu TypeScript kompilyatsiya vaqtida ob\'ektga ikkala yo\'nalishni qo\'shadi. String enum da reverse mapping yo\'q. Bu xususiyat ba\'zan foydali, lekin ko\'pincha kutilmagan xatti-harakat beradi.',
      },
    ],
  },
]
