import type { Topic } from '../../types'

export const tsPatternsTopics: Topic[] = [
  // ─── 1. Type Guards ───
  {
    id: 'type-guards',
    title: 'Type Guards',
    importance: 3,
    status: 'to-learn',
    description:
      'Custom type guards, assertion functions va type predicates — runtime tipni aniqlash usullari.',
    content: `
# Type Guards

Type guard — runtime da tipni tekshirib, TypeScript ga ma'lumot beradigan funksiya yoki ifoda. Bu type narrowing ning asosiy vositasi.

## Built-in Guards

TypeScript bir necha built-in guardlarni tushunadi:
- **typeof** — primitiv tiplar uchun
- **instanceof** — class instancelar uchun
- **in** — property mavjudligini tekshirish
- **Array.isArray()** — massiv ekanligini tekshirish

## Custom Type Guard (is)

\`is\` kalit so'zi bilan o'z type guard funksiyangizni yaratish mumkin:

\`\`\`ts
function isString(value: unknown): value is string {
  return typeof value === "string"
}
\`\`\`

Funksiya \`true\` qaytarsa — TypeScript \`value\` ni \`string\` deb biladi.

## Assertion Functions (asserts)

\`asserts\` — agar funksiya xato tashlamasa, tipni o'zgartiradi:

\`\`\`ts
function assertIsNumber(val: unknown): asserts val is number {
  if (typeof val !== "number") throw new Error("Not a number")
}
\`\`\`

\`assert\` dan keyin \`val\` avtomatik \`number\` tipida bo'ladi.

## Type Guard vs Assertion

- **Type guard (is)** — boolean qaytaradi, if/else da ishlatiladi. Xato tashlamaydi.
- **Assertion (asserts)** — void qaytaradi, xato tashlaydi. Validatsiya uchun qulay.

## Qachon custom guard yozish kerak?

1. Murakkab ob'ekt tuzilmasini tekshirish (API javob)
2. Discriminated union a'zolarini aniqlash
3. null/undefined filtrlash
4. Third-party kutubxona qiymatlari bilan ishlash

> **Eslatma:** Type guard faqat TypeScript uchun — runtime da oddiy funksiya. Guard ichidagi logika noto'g'ri bo'lsa, TypeScript ham noto'g'ri tip ko'rsatadi. Shuning uchun guard funksiyalarni sinchiklab yozing.
    `.trim(),
    codeExamples: [
      {
        title: 'Custom Type Guard (is)',
        language: 'ts',
        description: 'is kalit so\'zi bilan o\'z guard funksiyalarini yaratish.',
        code: `// Oddiy type guard
function isString(value: unknown): value is string {
  return typeof value === "string"
}

function isNumber(value: unknown): value is number {
  return typeof value === "number"
}

// Ob'ekt type guard
interface User {
  name: string
  email: string
}

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "email" in value &&
    typeof (value as User).name === "string" &&
    typeof (value as User).email === "string"
  )
}

// Ishlatish
function processInput(input: unknown) {
  if (isUser(input)) {
    console.log(input.name)   // TypeScript biladi: User
    console.log(input.email)
  }
}

// Array filtrlash bilan
const mixed: (string | number)[] = [1, "hello", 2, "world"]
const strings = mixed.filter(isString)
// string[] — TypeScript to'g'ri tip aniqlaydi`,
      },
      {
        title: 'Assertion Functions',
        language: 'ts',
        description: 'asserts — xato tashlamasa tip o\'zgaradi, validatsiya uchun qulay.',
        code: `// Assertion function
function assertIsString(val: unknown): asserts val is string {
  if (typeof val !== "string") {
    throw new TypeError(\`Expected string, got \${typeof val}\`)
  }
}

// Ishlatish — if kerak emas
function processName(input: unknown) {
  assertIsString(input)
  // Bu yerda input avtomatik string
  console.log(input.toUpperCase())
}

// Non-null assertion
function assertDefined<T>(
  val: T | null | undefined,
  name: string
): asserts val is T {
  if (val === null || val === undefined) {
    throw new Error(\`\${name} is not defined\`)
  }
}

// Amaliy misol
function getElement(id: string) {
  const el = document.getElementById(id)
  assertDefined(el, \`Element #\${id}\`)
  // el endi HTMLElement (null emas)
  el.classList.add("active")
}

// Shartli assertion
function assert(
  condition: boolean,
  message: string
): asserts condition {
  if (!condition) throw new Error(message)
}

function divide(a: number, b: number) {
  assert(b !== 0, "Bo'luvchi 0 bo'lmasligi kerak")
  return a / b
}`,
      },
      {
        title: 'Discriminated Union uchun guardlar',
        language: 'ts',
        description: 'Union a\'zolarini aniqlash uchun type guard.',
        code: `// Discriminated union
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string }

// Type guard
function isSuccess<T>(result: Result<T>): result is { success: true; data: T } {
  return result.success === true
}

function isError<T>(result: Result<T>): result is { success: false; error: string } {
  return result.success === false
}

// Ishlatish
function handleResult(result: Result<string[]>) {
  if (isSuccess(result)) {
    result.data.forEach(item => console.log(item))
  } else {
    console.error(result.error)
  }
}

// API response guard
interface ApiError {
  code: number
  message: string
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error &&
    typeof (error as ApiError).code === "number"
  )
}

// try/catch da ishlatish
try {
  await fetch("/api/data")
} catch (err) {
  if (isApiError(err)) {
    console.log(err.code, err.message)
  }
}`,
      },
    ],
    interviewQA: [
      {
        question: 'Type guard nima va nima uchun kerak?',
        answer:
          'Type guard — runtime da tipni tekshirib, TypeScript ga ma\'lumot beradigan funksiya. is kalit so\'zi bilan: function isString(x: unknown): x is string. Guard true qaytarsa, TypeScript o\'sha branchda tipni toraytiradi. Kerak bo\'lganda: API javob, unknown qiymatlar, murakkab union tiplar bilan ishlashda.',
      },
      {
        question: 'Type guard (is) va assertion (asserts) ning farqi nima?',
        answer:
          'Type guard (is) — boolean qaytaradi, if/else ichida ishlatiladi. Agar false bo\'lsa, kod boshqa branchda davom etadi. Assertion (asserts) — void qaytaradi, shart bajarilmasa throw qiladi. Assertion dan keyin if kerak emas — tip avtomatik o\'zgaradi. Guard — filtrlash uchun, assertion — validatsiya uchun.',
      },
      {
        question: 'Array.filter da type guard qanday ishlaydi?',
        answer:
          'filter callback ga type guard bersangiz, natija tipi to\'g\'ri bo\'ladi: const strings = mixed.filter((x): x is string => typeof x === "string") — natija string[]. Oddiy filter da TypeScript tip o\'zgartira olmaydi — (string | number)[] bo\'lib qoladi.',
      },
      {
        question: 'unknown tipdan ob\'ekt tipini qanday xavfsiz tekshirish mumkin?',
        answer:
          'Bosqichma-bosqich: 1) typeof value === "object" && value !== null — ob\'ekt ekanligini tekshirish. 2) "property" in value — kerakli propertylar borligini tekshirish. 3) typeof (value as Type).prop — property tipini tekshirish. Bularni type guard funksiyaga o\'rab, qayta ishlatish mumkin.',
      },
      {
        question: 'Type guard yozishda qanday xatolarga yo\'l qo\'yish mumkin?',
        answer:
          'Asosiy xatolar: 1) Guard ichidagi tekshiruv noto\'g\'ri — TypeScript ishonadi, runtime xato bo\'ladi. 2) Chala tekshiruv — ba\'zi propertylarni tekshirmaslik. 3) as Type bilan runtime tekshiruvsiz narrowing. 4) null/undefined ni tekshirmaslik. Guard funksiyani unit testlar bilan qoplash tavsiya etiladi.',
      },
    ],
  },

  // ─── 2. Discriminated Unions ───
  {
    id: 'discriminated-unions',
    title: 'Discriminated Unions',
    importance: 3,
    status: 'to-learn',
    description:
      'Tagged unions, exhaustive checking va state machine patternlari.',
    content: `
# Discriminated Unions

Discriminated union — har bir union a'zosida umumiy literal tip property (tag/discriminant) bo'lgan union. TypeScript ning eng kuchli patternlaridan biri.

## Asosiy tushuncha

\`\`\`ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
\`\`\`

\`kind\` — discriminant (tag) property. Har bir a'zoda **farqli literal qiymat** bo'lishi shart.

## Nima uchun kuchli?

1. **Type narrowing** — tag ni tekshirganda TypeScript qolgan propertylarni aniq biladi
2. **Exhaustive checking** — barcha variantlar ko'rib chiqilganini tekshirish
3. **IDE qo'llab-quvvatlash** — autocomplete har bir case uchun to'g'ri propertylar ko'rsatadi

## Exhaustive Checking

switch da barcha variantlarni ko'rib chiqishni kafolatlash:

\`\`\`ts
function handle(shape: Shape): number {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2
    case "square": return shape.side ** 2
    default:
      const _exhaustive: never = shape
      return _exhaustive
  }
}
\`\`\`

Yangi variant qo'shilsa — default da never ga assign bo'lmaydi va **compile xato** beradi.

## State Machine pattern

Discriminated union ilova holatini modellashtirish uchun ideal:

- Loading / Success / Error holatlari
- Form bosqichlari (step wizard)
- WebSocket connection holatlari

## Qoidalar

1. Tag property **literal tip** bo'lishi kerak (string literal, number literal)
2. Har bir a'zoda tag **bir xil nom** bilan bo'lishi kerak
3. Tag qiymatlari **farqli** bo'lishi kerak

> **Amaliy maslahat:** Ko'p hollarda type narrowing o'rniga discriminated union + switch ishlatish kodni soddalashtiradi va xavfsizroq qiladi.
    `.trim(),
    codeExamples: [
      {
        title: 'Asosiy discriminated union',
        language: 'ts',
        description: 'Tag property bilan union yaratish va switch da ishlatish.',
        code: `// Shape — klassik misol
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
  }
}

// TypeScript har bir case da to'g'ri propertylarni biladi
function describe(shape: Shape): string {
  switch (shape.kind) {
    case "circle":
      return \`Aylana, radiusi \${shape.radius}\`
    case "square":
      return \`Kvadrat, tomoni \${shape.side}\`
    case "rectangle":
      return \`To'g'ri to'rtburchak, \${shape.width}x\${shape.height}\`
  }
}`,
      },
      {
        title: 'Exhaustive checking',
        language: 'ts',
        description: 'never tipi bilan barcha variantlarni tekshirish — yangi case qo\'shilsa compile xato.',
        code: `type Action =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "SET"; payload: number }

// Exhaustive check funksiya
function assertNever(value: never): never {
  throw new Error(\`Kutilmagan qiymat: \${JSON.stringify(value)}\`)
}

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case "INCREMENT":
      return state + 1
    case "DECREMENT":
      return state - 1
    case "SET":
      return action.payload
    default:
      // Agar yangi action qo'shilsa va shu yerda
      // handle qilinmasa — COMPILE XATO
      return assertNever(action)
  }
}

// Yangi action qo'shamiz:
// | { type: "RESET" }
// Endi default da: Argument of type '{ type: "RESET" }'
// is not assignable to parameter of type 'never'
// — COMPILE XATO! RESET ni handle qilish kerak.`,
      },
      {
        title: 'State Machine pattern',
        language: 'ts',
        description: 'Ilova holatini discriminated union bilan modellashtirish.',
        code: `// API so'rov holatlari
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string }

// React componentda ishlatish
function UserProfile({ state }: { state: RequestState<User> }) {
  switch (state.status) {
    case "idle":
      return <p>Ma'lumot so'ralmagan</p>
    case "loading":
      return <p>Yuklanmoqda...</p>
    case "success":
      return <h1>{state.data.name}</h1>
    case "error":
      return <p>Xato: {state.error}</p>
  }
}

// Form wizard
type WizardStep =
  | { step: "info"; name: string; email: string }
  | { step: "address"; city: string; zip: string }
  | { step: "confirm"; agreed: boolean }

// WebSocket holati
type WsState =
  | { status: "disconnected" }
  | { status: "connecting"; attempt: number }
  | { status: "connected"; socket: WebSocket }
  | { status: "error"; error: string; lastAttempt: Date }`,
      },
      {
        title: 'Amaliy pattern — Result type',
        language: 'ts',
        description: 'Rust-style Result tipi — xavfsiz xato boshqarish.',
        code: `// Result type — xato yoki muvaffaqiyat
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E }

// Helper funksiyalar
function Ok<T>(value: T): Result<T, never> {
  return { ok: true, value }
}

function Err<E>(error: E): Result<never, E> {
  return { ok: false, error }
}

// Ishlatish
function parseJSON(text: string): Result<unknown, string> {
  try {
    return Ok(JSON.parse(text))
  } catch {
    return Err("JSON parse xatosi")
  }
}

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return Err("Nolga bo'lib bo'lmaydi")
  return Ok(a / b)
}

// Chaining
const result = divide(10, 2)
if (result.ok) {
  console.log(\`Natija: \${result.value}\`)  // 5
} else {
  console.error(result.error)
}`,
      },
    ],
    interviewQA: [
      {
        question: 'Discriminated union nima va oddiy union dan farqi?',
        answer:
          'Discriminated union — har bir a\'zoda umumiy literal tip property (tag) bo\'lgan union. Oddiy union da TypeScript qaysi a\'zo ekanligini bilmaydi, discriminated union da tag ni tekshirganda aniq biladi. Bu exhaustive checking, IDE autocomplete va type narrowing ni yaxshilaydi.',
      },
      {
        question: 'Exhaustive checking nima va qanday amalga oshiriladi?',
        answer:
          'Exhaustive checking — discriminated union ning barcha variantlari ko\'rib chiqilganini tekshirish. switch default da never tipiga assign qilish orqali: const _: never = value. Yangi variant qo\'shilsa, never ga assign bo\'lmaydi va compile xato beradi. Bu barcha joylarni yangilashni kafolatlaydi.',
      },
      {
        question: 'State machine pattern ni tushuntiring.',
        answer:
          'Discriminated union bilan ilova holatini modellashtirish: type State = {status: "idle"} | {status: "loading"} | {status: "success", data: T} | {status: "error", error: string}. Har bir holatda faqat tegishli ma\'lumotlar mavjud — success da data bor, error da error bor. Bu impossible state larni oldini oladi.',
      },
      {
        question: 'Discriminated union qachon ishlatish kerak?',
        answer:
          'Ishlatish kerak bo\'lgan holatlar: 1) Ob\'ekt turli shakllarda bo\'lishi mumkin (API response, form step). 2) Har bir shaklda farqli ma\'lumotlar bor. 3) Barcha variantlarni exhaustive handle qilish kerak. 4) Runtime da qaysi variant ekanligini aniqlash kerak. Masalan: Redux action, React state, API result.',
      },
    ],
  },

  // ─── 3. Declaration Files ───
  {
    id: 'declaration-files',
    title: 'Declaration Files (.d.ts)',
    importance: 2,
    status: 'to-learn',
    description:
      '.d.ts fayllar, declare kalit so\'zi, module augmentation va global tiplar.',
    content: `
# Declaration Files (.d.ts)

Declaration file — faqat tip ma'lumotlarini o'z ichiga olgan fayl. Runtime kod yo'q, faqat tiplar.

## .d.ts fayllar

\`.d.ts\` fayllar JavaScript kutubxonalari uchun tip ma'lumotlarini beradi. TypeScript ularni avtomatik topadi va ishlatadi.

\`\`\`ts
// types.d.ts
declare function greet(name: string): string
declare const API_URL: string
\`\`\`

## declare kalit so'zi

\`declare\` — "bu qiymat boshqa joyda mavjud" degan ma'noni bildiradi. Runtime kod yaratmaydi.

- **declare function** — global funksiya
- **declare const/let/var** — global o'zgaruvchi
- **declare class** — global class
- **declare module** — modul tipi
- **declare global** — global scope ni kengaytirish

## Module Augmentation

Mavjud modulga yangi tiplar qo'shish:

\`\`\`ts
declare module "express" {
  interface Request {
    userId?: string
  }
}
\`\`\`

Bu Express ning Request interface iga userId qo'shadi (declaration merging).

## Global Types

\`declare global\` bilan global scope ga tip qo'shish:

\`\`\`ts
declare global {
  interface Window {
    __APP_VERSION__: string
  }
}
\`\`\`

## @types paketlar

DefinitelyTyped — jamoa tomonidan yoziladigan tip paketlari. \`npm install @types/lodash\` — lodash uchun tiplar.

## tsconfig — typeRoots va types

- **typeRoots** — .d.ts fayllar qidiriladigan papkalar
- **types** — faqat ko'rsatilgan paketlarning tiplari ishlatiladi

> **Muhim:** .d.ts faylda import/export bo'lmasa — u **global script** sifatida ishlaydi. export qo'shsangiz — modul bo'ladi. Global tip qo'shish uchun \`declare global { }\` ichida yozing.
    `.trim(),
    codeExamples: [
      {
        title: 'Asosiy declaration file',
        language: 'ts',
        description: '.d.ts fayl yaratish — JavaScript kutubxonalari uchun tiplar.',
        code: `// globals.d.ts — global tiplar

// Global o'zgaruvchilar
declare const __APP_VERSION__: string
declare const __DEV__: boolean

// Global funksiya
declare function formatDate(date: Date): string

// Global interface
interface AppConfig {
  apiUrl: string
  debug: boolean
  version: string
}

declare const config: AppConfig

// Ambient module — tipi yo'q modulga tip berish
declare module "*.svg" {
  const content: string
  export default content
}

declare module "*.css" {
  const classes: Record<string, string>
  export default classes
}

// JSON import
declare module "*.json" {
  const value: Record<string, unknown>
  export default value
}`,
      },
      {
        title: 'Module Augmentation',
        language: 'ts',
        description: 'Mavjud kutubxona tiplarini kengaytirish.',
        code: `// express-augment.d.ts
// Express Request ga yangi propertylar qo'shish
import "express"

declare module "express" {
  interface Request {
    userId?: string
    sessionId?: string
    lang?: "uz" | "ru" | "en"
  }
}

// Endi Express handler da:
// app.get("/", (req, res) => {
//   req.userId   // string | undefined — TypeScript biladi
//   req.lang     // "uz" | "ru" | "en" | undefined
// })

// React tiplarini kengaytirish
import "react"

declare module "react" {
  interface CSSProperties {
    // Custom CSS properties
    "--primary-color"?: string
    "--spacing"?: string
  }
}

// Endi JSX da:
// <div style={{ "--primary-color": "#007bff" }} />
// TypeScript xato bermaydi`,
      },
      {
        title: 'Global tiplar va declare global',
        language: 'ts',
        description: 'Window, global scope ga yangi tiplar qo\'shish.',
        code: `// global-types.d.ts
// MUHIM: export bo'lmasa — global script

// Global scope ga tip qo'shish (module file da)
export {}  // Bu faylni modul qiladi

declare global {
  // Window ga yangi propertylar
  interface Window {
    __APP_CONFIG__: {
      apiUrl: string
      env: "development" | "production"
    }
    analytics: {
      track: (event: string, data?: Record<string, unknown>) => void
      identify: (userId: string) => void
    }
  }

  // Global utility tip
  type Nullable<T> = T | null
  type Optional<T> = T | undefined

  // Global interface
  interface ImportMetaEnv {
    VITE_API_URL: string
    VITE_APP_TITLE: string
  }
}

// Ishlatish — boshqa faylda:
// window.__APP_CONFIG__.apiUrl  // OK, tip bor
// const user: Nullable<User>    // OK, global tip`,
      },
    ],
    interviewQA: [
      {
        question: '.d.ts fayl nima va qachon kerak?',
        answer:
          '.d.ts — faqat tip ma\'lumotlari bo\'lgan fayl, runtime kod yo\'q. Kerak bo\'lganda: 1) JavaScript kutubxonalarga tip berish. 2) Global o\'zgaruvchilar (window propertylar). 3) Asset importlar (*.svg, *.css). 4) Module augmentation. TypeScript .d.ts fayllarni avtomatik topadi va tiplar uchun ishlatadi.',
      },
      {
        question: 'declare kalit so\'zi nima qiladi?',
        answer:
          'declare — "bu qiymat boshqa joyda mavjud, men faqat tipini aytayapman". Runtime kod yaratmaydi (ambient declaration). declare function, declare const, declare class, declare module — barchasi faqat tip ma\'lumoti. JavaScript dan migratsiya qilishda yoki global qiymatlar tipini belgilashda ishlatiladi.',
      },
      {
        question: 'Module augmentation qanday ishlaydi?',
        answer:
          'declare module "modul-nomi" { } — mavjud modulga yangi tiplar qo\'shish. Interface declaration merging orqali ishlaydi. Masalan: Express Request ga userId qo\'shish, React CSSProperties ga custom propertylar qo\'shish. Asl modulni o\'zgartirmasdan tiplarini kengaytirish imkonini beradi.',
      },
      {
        question: 'Global va module scope .d.ts faylning farqi nima?',
        answer:
          '.d.ts faylda import/export bo\'lmasa — u global script, ichidagi barcha tiplar global scope da. import/export bo\'lsa — modul, global tiplar faqat declare global { } ichida bo\'ladi. Ko\'p hollarda global tiplar uchun export {} qo\'yib, declare global ichida yozish tavsiya etiladi — bu aniqroq.',
      },
    ],
  },

  // ─── 4. Strict Config ───
  {
    id: 'strict-config',
    title: 'tsconfig strict sozlamalari',
    importance: 2,
    status: 'to-learn',
    description:
      'tsconfig.json da strict rejim, noImplicitAny, strictNullChecks va boshqa muhim sozlamalar.',
    content: `
# tsconfig strict sozlamalari

TypeScript ning tip tekshiruv qat'iyligi tsconfig.json da sozlanadi. **strict: true** — barcha qat'iy tekshiruvlarni yoqadi.

## strict: true

Bu bitta flag quyidagi barcha flaglarni yoqadi:

- **strictNullChecks** — null va undefined ni alohida tip sifatida ko'radi
- **noImplicitAny** — implicit any ga ruxsat bermaydi
- **strictFunctionTypes** — funksiya parametrlari contravariant tekshiriladi
- **strictBindCallApply** — bind, call, apply parametrlarini tekshiradi
- **strictPropertyInitialization** — class propertylar constructor da initialize qilinishi shart
- **alwaysStrict** — "use strict" har bir faylga qo'shiladi
- **useUnknownInCatchVariables** — catch da error tipi unknown (any emas)
- **noImplicitThis** — this tipi aniq bo'lishi kerak

## strictNullChecks

Eng muhim flag. null va undefined ni alohida tip qiladi:

\`\`\`ts
// strictNullChecks: false
let name: string = null  // OK (XAVFLI!)

// strictNullChecks: true
let name: string = null  // XATO!
let name: string | null = null  // OK
\`\`\`

## noImplicitAny

Tip aniqlanmasa, TypeScript implicit any beradi. Bu flag buni taqiqlaydi:

\`\`\`ts
// noImplicitAny: true
function greet(name) { }  // XATO: Parameter 'name' implicitly has 'any' type
function greet(name: string) { }  // OK
\`\`\`

## Qo'shimcha foydali flaglar

- **noUnusedLocals** — ishlatilmagan local o'zgaruvchilarni xato qiladi
- **noUnusedParameters** — ishlatilmagan parametrlarni xato qiladi
- **noImplicitReturns** — barcha branchlarda return bo'lishi shart
- **noFallthroughCasesInSwitch** — switch da break/return bo'lishi shart
- **exactOptionalProperties** — optional property undefined assign qilishni taqiqlaydi

## Tavsiya

Yangi loyihada **doim strict: true** dan boshlang. Mavjud loyihani migratsiya qilishda — flaglarni birma-bir yoqing.

> **Muhim:** strict: true kelajakda yangi strict flaglar qo'shilganda ularni ham avtomatik yoqadi. Bu breaking change bo'lishi mumkin, lekin xavfsizlikni oshiradi.
    `.trim(),
    codeExamples: [
      {
        title: 'tsconfig.json — strict rejim',
        language: 'ts',
        description: 'Tavsiya etiladigan tsconfig.json sozlamalari.',
        code: `// tsconfig.json
{
  "compilerOptions": {
    // ═══ Strict rejim ═══
    "strict": true,          // Barcha strict flaglarni yoqadi

    // ═══ Qo'shimcha tekshiruvlar ═══
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true, // array[i] → T | undefined
    "exactOptionalProperties": true,

    // ═══ Module ═══
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "esModuleInterop": true,

    // ═══ Emit ═══
    "declaration": true,
    "sourceMap": true,
    "outDir": "./dist",

    // ═══ Path alias ═══
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"]
}`,
      },
      {
        title: 'strictNullChecks amaliy ta\'siri',
        language: 'ts',
        description: 'null/undefined ni aniq boshqarish — ko\'p xatolarni oldini oladi.',
        code: `// strictNullChecks: TRUE

// 1. Optional property
interface User {
  name: string
  email?: string  // string | undefined
}

function sendEmail(user: User) {
  // user.email.toLowerCase()  // XATO! email undefined bo'lishi mumkin

  // To'g'ri — tekshirish kerak
  if (user.email) {
    user.email.toLowerCase()  // OK
  }

  // Yoki optional chaining
  user.email?.toLowerCase()

  // Yoki nullish coalescing
  const email = user.email ?? "no-email@default.com"
}

// 2. DOM elementlar
const el = document.getElementById("app")
// el tipi: HTMLElement | null

// el.textContent = "Hello"  // XATO! null bo'lishi mumkin

if (el) {
  el.textContent = "Hello"  // OK
}

// Non-null assertion (ishonchingiz komil bo'lsa)
const el2 = document.getElementById("app")!
el2.textContent = "Hello"  // OK, lekin runtime xato mumkin

// 3. Array.find
const users: User[] = [{ name: "Ali" }]
const found = users.find(u => u.name === "Ali")
// found tipi: User | undefined`,
      },
      {
        title: 'noImplicitAny va noUncheckedIndexedAccess',
        language: 'ts',
        description: 'Implicit any ni taqiqlash va array index xavfsizligi.',
        code: `// ═══ noImplicitAny ═══

// XATO: Parameter 'x' implicitly has an 'any' type
// function double(x) { return x * 2 }

// TO'G'RI:
function double(x: number): number { return x * 2 }

// Callback da ham:
// [1,2,3].map(item => item * 2)   // OK — inference ishlaydi
// [1,2,3].reduce((acc, item) => acc + item)  // BA'ZAN xato

// TO'G'RI:
[1,2,3].reduce((acc: number, item) => acc + item, 0)


// ═══ noUncheckedIndexedAccess ═══

const colors = ["red", "green", "blue"]

// noUncheckedIndexedAccess: false
// colors[0]  → string

// noUncheckedIndexedAccess: true
// colors[0]  → string | undefined

// Shuning uchun tekshirish kerak:
const first = colors[0]
if (first) {
  console.log(first.toUpperCase())
}

// Record bilan ham:
const map: Record<string, number> = { a: 1 }
// map["b"]  → number | undefined (tekshirish kerak)`,
      },
    ],
    interviewQA: [
      {
        question: 'strict: true nimalarni yoqadi?',
        answer:
          'strict: true quyidagi flaglarni yoqadi: strictNullChecks, noImplicitAny, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, alwaysStrict, useUnknownInCatchVariables, noImplicitThis. Har biri alohida o\'chirilishi mumkin. Yangi loyiha doim strict: true dan boshlanishi kerak.',
      },
      {
        question: 'strictNullChecks nima uchun muhim?',
        answer:
          'strictNullChecks yoqilganda null va undefined alohida tiplar bo\'ladi. string tipiga null assign qilib bo\'lmaydi — string | null yozish kerak. Bu "Cannot read property of null/undefined" runtime xatolarni compile vaqtida oldini oladi. Optional chaining (?.) va nullish coalescing (??) bilan birgalikda ishlatiladi.',
      },
      {
        question: 'noUncheckedIndexedAccess nima qiladi?',
        answer:
          'Array va Record index bilan murojaat qilganda natijaga | undefined qo\'shadi. colors[0] → string | undefined. Bu mavjud bo\'lmagan indexga murojaat qilish xatosini oldini oladi. Default o\'chirilgan — ko\'p loyihalar yoqishni tavsiya etadi.',
      },
      {
        question: 'Mavjud JavaScript loyihani TypeScript strict ga qanday o\'tkazish kerak?',
        answer:
          'Bosqichma-bosqich: 1) Avval strict: false bilan TypeScript ga o\'tkazish. 2) noImplicitAny yoqish — eng ko\'p xato beradigan flag. 3) strictNullChecks yoqish — null tekshiruvlarni qo\'shish. 4) Qolgan flaglarni birma-bir yoqish. 5) Oxirida strict: true qo\'yish. Katta loyihalarda // @ts-ignore va any bilan bosqichma-bosqich tuzatish.',
      },
    ],
  },

  // ─── 5. as const va satisfies ───
  {
    id: 'as-const-satisfies',
    title: 'as const va satisfies',
    importance: 2,
    status: 'to-learn',
    description:
      'as const assertion, satisfies operatori va const assertions bilan ishlash.',
    content: `
# as const va satisfies

TypeScript da tipni aniqlashtirish uchun ikkita muhim vosita: **as const** va **satisfies**.

## as const (Const Assertion)

\`as const\` ob'ekt yoki massivni **to'liq readonly** qiladi va barcha qiymatlarni **literal tip** sifatida saqlaydi.

\`\`\`ts
// as const siz
const colors = ["red", "green", "blue"]
// tip: string[]

// as const bilan
const colors = ["red", "green", "blue"] as const
// tip: readonly ["red", "green", "blue"]
\`\`\`

Farq: \`string[]\` emas, **aniq qiymatlar** tuple sifatida.

## Nima uchun kerak?

1. **Enum alternative** — as const ob'ekt enum o'rniga
2. **Literal tiplar** — kengaytirilmaslik (string emas, "red" | "green" | "blue")
3. **Readonly** — o'zgartirib bo'lmaydigan ma'lumotlar
4. **typeof + keyof** bilan tip yaratish

## satisfies operatori (TypeScript 4.9+)

\`satisfies\` — tipni **tekshiradi**, lekin **toraytirmaydi**. Eng yaxshi inference ni saqlaydi:

\`\`\`ts
const config = {
  port: 3000,
  host: "localhost"
} satisfies Record<string, string | number>
// config.port — number (string | number emas!)
\`\`\`

## as const vs satisfies

| Xususiyat | as const | satisfies |
|-----------|----------|-----------|
| Readonly | Ha | Yo'q |
| Literal tiplar | Ha | Yo'q (lekin inference saqlaydi) |
| Tip tekshiruv | Yo'q | Ha |
| Qiymat o'zgartirish | Mumkin emas | Mumkin |

## Birgalikda ishlatish

\`as const satisfies\` — ikkalasining afzalligi: tipni tekshirish + literal + readonly.

\`\`\`ts
const routes = {
  home: "/",
  about: "/about",
} as const satisfies Record<string, string>
\`\`\`

> **Tavsiya:** Konfiguratsiya ob'ektlari uchun \`as const satisfies\` eng yaxshi variant — tip xavfsizligi + to'liq inference.
    `.trim(),
    codeExamples: [
      {
        title: 'as const — literal tiplar va readonly',
        language: 'ts',
        description: 'Qiymatlarni literal tip sifatida saqlash va o\'zgartirmaslik.',
        code: `// as const SIZI
const config = {
  api: "https://api.example.com",
  timeout: 5000,
  retries: 3
}
// tip: { api: string; timeout: number; retries: number }

// as const BILAN
const config = {
  api: "https://api.example.com",
  timeout: 5000,
  retries: 3
} as const
// tip: {
//   readonly api: "https://api.example.com"
//   readonly timeout: 5000
//   readonly retries: 3
// }

// Array as const
const statuses = ["idle", "loading", "success", "error"] as const
// tip: readonly ["idle", "loading", "success", "error"]

// Undan tip yaratish
type Status = typeof statuses[number]
// "idle" | "loading" | "success" | "error"

// Ob'ektdan tip yaratish
const ROLES = { Admin: "admin", Editor: "editor", Viewer: "viewer" } as const
type Role = typeof ROLES[keyof typeof ROLES]
// "admin" | "editor" | "viewer"`,
      },
      {
        title: 'satisfies operatori',
        language: 'ts',
        description: 'Tipni tekshirish, lekin inference ni yo\'qotmaslik.',
        code: `// MUAMMO: type annotation inference ni yo'qotadi
type ColorMap = Record<string, string | number[]>

const colors: ColorMap = {
  red: "#ff0000",
  green: "#00ff00",
  blue: [0, 0, 255]
}

colors.red   // string | number[] — ANIQ EMAS

// YECHIM: satisfies
const colors = {
  red: "#ff0000",
  green: "#00ff00",
  blue: [0, 0, 255]
} satisfies ColorMap

colors.red    // string — ANIQ!
colors.blue   // number[] — ANIQ!
// colors.pink  // XATO — ColorMap da yo'q... aslida bor chunki Record<string,...>

// Aniqroq misol
type Route = { path: string; component: string }
type Routes = Record<"home" | "about" | "contact", Route>

const routes = {
  home: { path: "/", component: "HomePage" },
  about: { path: "/about", component: "AboutPage" },
  contact: { path: "/contact", component: "ContactPage" }
} satisfies Routes

routes.home.path  // string — to'liq inference
// routes.blog    // XATO — Routes da "blog" yo'q`,
      },
      {
        title: 'as const satisfies — eng yaxshi kombinatsiya',
        language: 'ts',
        description: 'Tip tekshiruv + literal tiplar + readonly.',
        code: `// as const satisfies — ikkalasining kuchi
type Config = {
  apiUrl: string
  port: number
  env: "development" | "production"
}

const config = {
  apiUrl: "https://api.example.com",
  port: 3000,
  env: "production"
} as const satisfies Config

// 1. Tip tekshirildi (satisfies) — xato bo'lsa compile xato
// 2. Literal tiplar (as const) — port: 3000, env: "production"
// 3. Readonly — o'zgartirib bo'lmaydi

config.port  // 3000 (number emas!)
config.env   // "production" (string emas!)

// Amaliy misol — route config
const routes = {
  home: "/",
  about: "/about",
  profile: "/profile/:id",
  settings: "/settings",
} as const satisfies Record<string, string>

type RouteName = keyof typeof routes
// "home" | "about" | "profile" | "settings"

type RoutePath = typeof routes[RouteName]
// "/" | "/about" | "/profile/:id" | "/settings"

// Funksiya faqat mavjud route qabul qiladi
function navigate(route: RouteName) {
  const path = routes[route]  // literal tip
  console.log(\`Navigating to \${path}\`)
}`,
      },
    ],
    interviewQA: [
      {
        question: 'as const nima qiladi?',
        answer:
          'as const 3 ta narsa qiladi: 1) Barcha propertylarni readonly qiladi. 2) Qiymatlarni literal tip sifatida saqlaydi (string emas, "hello"). 3) Arrayni readonly tuple qiladi. Bu enum alternative, konfiguratsiya ob\'ektlari va typeof + keyof bilan tip yaratish uchun ishlatiladi.',
      },
      {
        question: 'satisfies operatori nima va type annotation dan farqi?',
        answer:
          'satisfies tipni tekshiradi lekin inference ni saqlab qoladi. Type annotation (: Type) inference ni yo\'qotadi — barcha propertylar union tipga aylanadi. satisfies bilan har bir property o\'z aniq tipini saqlaydi. Masalan: Record<string, string | number> — annotation da har bir qiymat string | number, satisfies da aniq string yoki number.',
      },
      {
        question: 'as const satisfies qachon ishlatish kerak?',
        answer:
          'Konfiguratsiya ob\'ektlari uchun ideal: 1) Tip to\'g\'riligini tekshirish kerak (satisfies). 2) Qiymatlar literal bo\'lishi kerak (as const). 3) O\'zgartirilmasligi kerak (as const readonly). Masalan: route config, theme config, API endpoints. Bu "eng yaxshi inference + tip xavfsizlik" beradi.',
      },
      {
        question: 'as const bilan enum o\'rniga qanday tip yaratish mumkin?',
        answer:
          'const OBJ = { A: "a", B: "b" } as const, keyin type Values = typeof OBJ[keyof typeof OBJ] — "a" | "b" union yaratadi. Array uchun: const ARR = ["a", "b"] as const, type Values = typeof ARR[number] — "a" | "b". Bu enum dan yaxshiroq — runtime ob\'ekt mavjud, tree-shake bo\'ladi, isolatedModules bilan ishlaydi.',
      },
    ],
  },
]
