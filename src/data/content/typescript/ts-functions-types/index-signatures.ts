import type { Topic } from '../../../types'

export const indexSignatures: Topic = {
  id: 'index-signatures',
  title: 'Index Signatures',
  importance: 2,
  status: 'to-learn',
  description:
    'Index signatures, Record vs index, symbol index, excess property checking va template literal keys.',
  content: `
# INDEX SIGNATURES
═══════════════════════════════════════

Index signature — ob'ektning barcha kalitlari va qiymatlarining tipini belgilash usuli. Kalit nomi oldindan noma'lum bo'lganda ishlatiladi.

## ASOSIY SINTAKSIS

\`[key: string]: ValueType\` — har qanday string kalit uchun qiymat tipi. Kalit tipi faqat \`string\`, \`number\` yoki \`symbol\` bo'lishi mumkin.

MUHIM: Index signature qo'shilganda, ob'ektning BARCHA propertylari shu tipga mos kelishi shart. Agar ma'lum propertylar boshqa tipda bo'lsa — union tip ishlatish kerak.

## INDEX SIGNATURE + KNOWN PROPERTIES

Ma'lum propertylar va index signatureni birlashtirish mumkin. Lekin ma'lum property tipi index signature tipiga mos kelishi SHART.

## RECORD<K, V> VS INDEX SIGNATURE

- **Index signature** — interfaceda yoziladi, kengaytirilishi mumkin
- **Record<K, V>** — utility type, mapped type asosida
- Record aniqroq kalitlar to'plami uchun qulay
- Index signature ochiq (open-ended) struktura uchun qulay

## SYMBOL INDEX SIGNATURE

\`[key: symbol]: Type\` — symbol kalitlar uchun. String va symbol index signatulari bitta ob'ektda birga bo'lishi mumkin.

## EXCESS PROPERTY CHECKING

TypeScript ob'ekt literallarida ortiqcha propertylarni tekshiradi. Index signature bu tekshiruvni "o'chiradi" — har qanday kalit qo'shish mumkin bo'ladi.

## TEMPLATE LITERAL KEY SIGNATURES

TypeScript 4.4+ da template literal tiplarni index signatureda ishlatish mumkin:
\`[key: \\\`on\${string}\\\`]: Function\` — faqat "on" bilan boshlanadigan kalitlar.

Bu pattern eventlar, CSS custom properties, API endpoint nomlarini tiplashtirish uchun juda qulay.
  `.trim(),
  codeExamples: [
    {
      title: 'Asosiy index signature',
      language: 'ts',
      description: 'string va number index signaturelar.',
      code: `// String index signature
interface StringMap {
  [key: string]: string
}

const colors: StringMap = {
  red: "#ff0000",
  green: "#00ff00",
  blue: "#0000ff",
}

// Har qanday kalit qo'shish mumkin
colors.yellow = "#ffff00"  // OK
colors["purple"] = "#800080"  // OK

// Number index signature
interface NumberMap {
  [index: number]: string
}

const fruits: NumberMap = {
  0: "olma",
  1: "nok",
  2: "uzum",
}

// MUHIM: number index qaytarish tipi
// string index qaytarish tipining SUBTYPE bo'lishi kerak
interface Mixed {
  [key: string]: string | number
  [index: number]: string  // string <= string | number ✅
}`,
    },
    {
      title: 'Index signature + known properties',
      language: 'ts',
      description: 'Ma\'lum propertylar va index signaturani birlashtirish.',
      code: `// Ma'lum propertylar + index signature
interface Config {
  name: string
  version: number
  [key: string]: string | number  // name va version ham mos kelishi kerak
}

const config: Config = {
  name: "my-app",
  version: 1,
  author: "Ali",
  port: 3000,
}

// XATO — boolean index signaturega mos emas
// interface BadConfig {
//   name: string
//   debug: boolean           // Error!
//   [key: string]: string    // boolean !== string
// }

// Yechim — union type kengaytirish
interface FlexConfig {
  name: string
  debug: boolean
  [key: string]: string | boolean
}

// Optional known properties
interface Theme {
  primary?: string
  secondary?: string
  [key: string]: string | undefined
}`,
    },
    {
      title: 'Record vs Index Signature',
      language: 'ts',
      description: 'Ikki yondashuvning farqi va qachon qaysi biri qulay.',
      code: `// Index signature — ochiq, kengaytiriladigan
interface UserData {
  [key: string]: unknown
}

// Record — aniq kalitlar to'plami
type UserRole = "admin" | "editor" | "viewer"
type Permissions = Record<UserRole, boolean>

const perms: Permissions = {
  admin: true,
  editor: true,
  viewer: false,
}
// perms.superadmin = true  // XATO: "superadmin" UserRole da yo'q

// Record — Partial bilan
type OptionalPerms = Partial<Record<UserRole, boolean>>
const partial: OptionalPerms = { admin: true }  // OK

// Index signature — interface extends bilan
interface BaseMap {
  [key: string]: string
}

interface ColorMap extends BaseMap {
  primary: string
  secondary: string
}

// Record bilan bu mumkin emas — Record type alias

// Nested Record
type API = Record<string, Record<string, Function>>
const routes: API = {
  users: {
    getAll: () => {},
    getById: (id: string) => {},
  },
}`,
    },
    {
      title: 'Template literal key signatures',
      language: 'ts',
      description: 'Pattern-based kalitlar — eventlar va CSS custom props.',
      code: `// Template literal index signature (TS 4.4+)
interface EventHandlers {
  [key: \`on\${string}\`]: Function
}

const handlers: EventHandlers = {
  onClick: () => console.log("click"),
  onHover: () => console.log("hover"),
  // name: "test"  // XATO: "name" "on" bilan boshlanmaydi
}

// CSS custom properties
interface CSSVars {
  [key: \`--\${string}\`]: string | number
}

const vars: CSSVars = {
  "--primary-color": "#3b82f6",
  "--font-size": 16,
  // color: "red"  // XATO
}

// Data attributes
interface DataAttributes {
  [key: \`data-\${string}\`]: string
}

// API endpoints
interface Endpoints {
  [key: \`/api/\${string}\`]: {
    method: "GET" | "POST" | "PUT" | "DELETE"
    handler: Function
  }
}

const api: Endpoints = {
  "/api/users": { method: "GET", handler: () => {} },
  "/api/posts": { method: "POST", handler: () => {} },
}`,
    },
    {
      title: 'Symbol index va excess property checking',
      language: 'ts',
      description: 'Symbol kalitlar va ortiqcha property tekshiruvi.',
      code: `// Symbol index signature
const id = Symbol("id")
const name = Symbol("name")

interface SymbolMap {
  [key: symbol]: string
}

const map: SymbolMap = {
  [id]: "user-123",
  [name]: "Ali",
}

// String + symbol birgalikda
interface HybridMap {
  [key: string]: string
  [key: symbol]: number
}

// Excess property checking
interface Point {
  x: number
  y: number
}

// XATO — ortiqcha property
// const p: Point = { x: 1, y: 2, z: 3 }  // Error!

// Index signature qo'shsak — xatolik yo'qoladi
interface FlexPoint {
  x: number
  y: number
  [key: string]: number
}

const fp: FlexPoint = { x: 1, y: 2, z: 3 }  // OK

// Variable orqali — excess check bo'lmaydi
const obj = { x: 1, y: 2, z: 3 }
const p: Point = obj  // OK — excess check faqat literal da`,
    },
  ],
  interviewQA: [
    {
      question: 'Index signature nima va qachon kerak?',
      answer:
        'Index signature — [key: string]: Type — ob\'ektning barcha kalitlari va qiymatlarining tipini belgilash. Kerak bo\'lganda: 1) kalit nomlari oldindan noma\'lum (dictionary, config, cache), 2) dinamik kalitlar (API response, form data), 3) flexible ob\'ekt strukturasi. Kalit tipi faqat string, number, yoki symbol bo\'lishi mumkin.',
    },
    {
      question: 'Record<K, V> va index signature farqi nima?',
      answer:
        'Record — mapped type asosida, aniq kalitlar to\'plami uchun: Record<"a" | "b", number> faqat "a" va "b" kalitlarni qabul qiladi. Index signature — ochiq, har qanday string kalit qo\'shish mumkin. Record extends qila olmaydi (type alias), index signature interface da yoziladi va extends/implements bilan ishlaydi. Aniq kalitlar bo\'lsa — Record, ochiq struktura bo\'lsa — index signature.',
    },
    {
      question: 'Nima uchun known property tipi index signaturega mos kelishi kerak?',
      answer:
        'TypeScript ning structural type system talabi. Agar [key: string]: string bo\'lsa, ob\'ektning HAR QANDAY string kaliti string qaytarishi kerak. name: number yozish mumkin emas chunki obj["name"] string tipida bo\'lishi kutiladi. Yechim: index signature tipini union qilish — [key: string]: string | number.',
    },
    {
      question: 'Template literal index signature nima va qanday ishlatiladi?',
      answer:
        'TS 4.4+ da index signatureda template literal tip ishlatish mumkin: [key: `on${string}`]: Function — faqat "on" bilan boshlanadigan kalitlarni qabul qiladi. Amaliy holatlar: event handler nomlari (onClick, onHover), CSS custom properties (--color), data attributes (data-id), API endpoint nomlari (/api/users). Bu pattern-based type safety beradi.',
    },
    {
      question: 'Excess property checking qanday ishlaydi va index signature qanday ta\'sir qiladi?',
      answer:
        'TypeScript ob\'ekt literalida tipda e\'lon qilinmagan propertylarni rad qiladi — bu excess property checking. Index signature qo\'shilsa, har qanday kalit qo\'shish mumkin bo\'ladi — checking o\'chadi. Aylanma yo\'l: ob\'ektni avval variable ga saqlab, keyin assign qilish — bu holda ham excess check bo\'lmaydi. Bu TypeScript ning structural typing xususiyati.',
    },
  ],
}
