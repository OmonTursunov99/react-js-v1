import type { Topic } from '../../../types'

export const jsonStructuredClone: Topic = {
  id: 'json-structured-clone',
  title: 'JSON va structuredClone',
  importance: 2,
  status: 'to-learn',
  description: 'JSON.stringify/parse, ularning cheklovlari, structuredClone bilan deep copy va taqqoslash',
  content: `JSON (JavaScript Object Notation) — ma'lumotlarni saqlash va uzatish uchun eng keng tarqalgan format. structuredClone — zamonaviy deep copy API. Senior darajada ularning cheklovlari va to'g'ri tanlov muhim.

═══════════════════════════════════════
  JSON.STRINGIFY
═══════════════════════════════════════

JSON.stringify(value, replacer, space) — JavaScript qiymatni
JSON stringga aylantiradi.

  JSON.stringify({ name: "Ali", age: 25 })
  // '{"name":"Ali","age":25}'

Uchta parametr:
  1. value — aylantirilayotgan qiymat
  2. replacer — filter funksiya yoki massiv (ixtiyoriy)
  3. space — chiroyli formatlash uchun indent (ixtiyoriy)

═══════════════════════════════════════
  REPLACER — MAXSUS SERIALIZATION
═══════════════════════════════════════

Replacer funksiya — har bir key:value juftligi uchun chaqiriladi:

  JSON.stringify(obj, (key, value) => {
    if (key === "password") return undefined  // o'tkazib yuboradi
    return value
  })

Replacer massiv — faqat ko'rsatilgan kalitlarni oladi:

  JSON.stringify(obj, ["name", "age"])
  // faqat name va age

═══════════════════════════════════════
  SPACE — CHIROYLI FORMAT
═══════════════════════════════════════

  JSON.stringify(obj, null, 2)   — 2 bo'shliq indent
  JSON.stringify(obj, null, "\\t") — tab indent

Debug va log uchun juda qulay.

═══════════════════════════════════════
  toJSON METODI
═══════════════════════════════════════

Agar objectda toJSON() metodi bo'lsa, JSON.stringify
uni chaqiradi:

  const user = {
    name: "Ali",
    password: "secret123",
    toJSON() {
      return { name: this.name } // password yo'q
    }
  }
  JSON.stringify(user)  // '{"name":"Ali"}'

Date objectida toJSON() bor — ISO string qaytaradi.

═══════════════════════════════════════
  JSON.PARSE
═══════════════════════════════════════

JSON.parse(text, reviver) — JSON stringni JavaScript objectga
aylantiradi.

  JSON.parse('{"name":"Ali","age":25}')
  // { name: "Ali", age: 25 }

Reviver funksiya — har bir key:value uchun chaqiriladi:

  JSON.parse(text, (key, value) => {
    if (key === "date") return new Date(value)
    return value
  })

MUHIM: JSON.parse noto'g'ri JSON da THROW qiladi!
DOIM try/catch ichida ishlatish kerak.

═══════════════════════════════════════
  JSON CHEKLOVLARI
═══════════════════════════════════════

JSON.stringify quyidagilarni QABUL QILMAYDI yoki YO'QOTADI:

  1. undefined      — o'tkazib yuboriladi (objectda)
  2. function       — o'tkazib yuboriladi
  3. Symbol         — o'tkazib yuboriladi
  4. Infinity, NaN  — null ga aylanadi
  5. Date           — ISO stringga aylanadi (parse da QAYTMAYDI)
  6. Map, Set       — bo'sh object {} bo'ladi
  7. RegExp         — bo'sh object {} bo'ladi
  8. BigInt         — TypeError!
  9. Circular ref   — TypeError!

  const obj = {
    fn: () => {},        // YO'QOLADI
    undef: undefined,    // YO'QOLADI
    date: new Date(),    // string bo'ladi
    map: new Map(),      // {} bo'ladi
    nan: NaN,            // null bo'ladi
  }

═══════════════════════════════════════
  STRUCTUREDCLONE — DEEP COPY
═══════════════════════════════════════

structuredClone(value) — to'liq deep copy yaratadi.
JSON.parse(JSON.stringify()) dan YAXSHIROQ:

Qo'llab-quvvatlaydi:
  - Map, Set
  - Date (Date object sifatida saqlanadi)
  - ArrayBuffer, TypedArray
  - RegExp
  - Blob, File
  - ImageData
  - Error objectlari

Qo'llab-quvvatLAMAYDI:
  - function
  - DOM node
  - Symbol
  - Property descriptor (getter/setter)
  - Prototype chain

═══════════════════════════════════════
  STRUCTUREDCLONE VS JSON DEEP COPY
═══════════════════════════════════════

  | Xususiyat        | JSON trick          | structuredClone  |
  |------------------|---------------------|------------------|
  | Date             | string bo'ladi      | Date saqlanadi   |
  | Map, Set         | yo'qoladi           | saqlanadi        |
  | undefined        | yo'qoladi           | saqlanadi        |
  | NaN, Infinity    | null bo'ladi        | saqlanadi        |
  | RegExp           | yo'qoladi           | saqlanadi        |
  | Circular refs    | ERROR               | ishlaydi         |
  | Functions        | yo'qoladi           | ERROR            |
  | Performance      | sekin (2x parse)    | tezroq           |
  | Browser support  | barcha              | zamonaviy        |

MUHIM: Ikkisi ham function va DOM node ni QABUL QILMAYDI.
Function nusxalash kerak bo'lsa — boshqa usul kerak.`,
  codeExamples: [
    {
      title: 'JSON.stringify — replacer va space',
      language: 'js',
      code: `const user = {
  name: "Ali",
  age: 25,
  password: "secret123",
  email: "ali@mail.com",
  role: "admin",
}

// Oddiy stringify
JSON.stringify(user)
// '{"name":"Ali","age":25,"password":"secret123",...}'

// Replacer FUNKSIYA — maxsus filter
const safe = JSON.stringify(user, (key, value) => {
  if (key === "password") return undefined  // o'tkazib yuborish
  if (typeof value === "string") return value.trim()
  return value
})
// '{"name":"Ali","age":25,"email":"ali@mail.com","role":"admin"}'

// Replacer MASSIV — faqat kerakli kalitlar
const partial = JSON.stringify(user, ["name", "email"])
// '{"name":"Ali","email":"ali@mail.com"}'

// Space — chiroyli formatlash
console.log(JSON.stringify(user, ["name", "age"], 2))
// {
//   "name": "Ali",
//   "age": 25
// }

// toJSON — maxsus serialization
class Product {
  constructor(name, price, internalId) {
    this.name = name
    this.price = price
    this._id = internalId  // ichki, ko'rsatmaslik kerak
  }

  toJSON() {
    return {
      name: this.name,
      price: this.price,
      // _id yo'q — maxfiy
    }
  }
}

const item = new Product("Telefon", 5000000, "xyz-123")
JSON.stringify(item)
// '{"name":"Telefon","price":5000000}'`,
      description: 'JSON.stringify-ning 3 parametri: value, replacer (filter), space (format). toJSON metodi bilan maxsus serialization.',
    },
    {
      title: 'JSON.parse — reviver va xavfsiz ishlatish',
      language: 'js',
      code: `// Oddiy parse
const data = JSON.parse('{"name":"Ali","age":25}')
// { name: "Ali", age: 25 }

// Reviver — tiklarni qayta tiklash
const json = '{"name":"Ali","birthDate":"1999-03-20T00:00:00.000Z","score":"95"}'

const parsed = JSON.parse(json, (key, value) => {
  // Date stringlarni Date objectga aylantirish
  if (key === "birthDate") return new Date(value)
  // String sonlarni numberga
  if (key === "score") return Number(value)
  return value
})
parsed.birthDate instanceof Date  // true
typeof parsed.score               // "number"

// XAVFSIZ parse — DOIM try/catch
function safeParse(jsonStr, fallback = null) {
  try {
    return JSON.parse(jsonStr)
  } catch (e) {
    console.error("JSON parse xatosi:", e.message)
    return fallback
  }
}

safeParse('{"valid": true}')       // { valid: true }
safeParse("noto'g'ri json")        // null
safeParse("", [])                  // []

// localStorage bilan ishlatish
function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (e) {
    // QuotaExceededError bo'lishi mumkin
    console.error("Saqlab bo'lmadi:", e.message)
    return false
  }
}`,
      description: 'JSON.parse reviver bilan Date va tiplarni tiklash. DOIM try/catch ichida ishlatish — noto\'g\'ri JSON throw qiladi.',
    },
    {
      title: 'JSON cheklovlari — nima yo\'qoladi',
      language: 'js',
      code: `const original = {
  name: "Ali",
  age: 25,
  active: true,

  // Bu qiymatlar MUAMMO:
  fn: function() { return 1 },   // YO'QOLADI
  arrow: () => 2,                // YO'QOLADI
  undef: undefined,              // YO'QOLADI
  sym: Symbol("id"),             // YO'QOLADI
  date: new Date("2024-01-15"),  // STRING bo'ladi
  regex: /hello/gi,              // {} bo'ladi
  map: new Map([["a", 1]]),      // {} bo'ladi
  set: new Set([1, 2, 3]),       // {} bo'ladi
  nan: NaN,                      // null bo'ladi
  inf: Infinity,                 // null bo'ladi
  negInf: -Infinity,             // null bo'ladi
}

const cloned = JSON.parse(JSON.stringify(original))

console.log(cloned)
// {
//   name: "Ali",
//   age: 25,
//   active: true,
//   date: "2024-01-15T00:00:00.000Z",  ← STRING!
//   regex: {},
//   map: {},
//   set: {},
//   nan: null,
//   inf: null,
//   negInf: null,
//   // fn, arrow, undef, sym — YO'Q!
// }

// BigInt — ERROR!
// JSON.stringify({ big: 123n })  // TypeError: BigInt value can't be serialized

// Circular reference — ERROR!
const obj = { name: "Ali" }
obj.self = obj  // o'ziga reference
// JSON.stringify(obj)  // TypeError: circular structure

// Yechim: replacer bilan circular ref ni olib tashlash
function safeStringify(obj) {
  const seen = new WeakSet()
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return "[Circular]"
      seen.add(value)
    }
    return value
  }, 2)
}`,
      description: 'JSON.stringify da undefined, function, Symbol yo\'qoladi. Date string bo\'ladi, Map/Set bo\'sh object. BigInt va circular ref ERROR beradi.',
    },
    {
      title: 'structuredClone — zamonaviy deep copy',
      language: 'js',
      code: `// Oddiy deep copy
const original = {
  name: "Ali",
  settings: { theme: "dark", lang: "uz" },
  scores: [95, 87, 92],
}

const clone = structuredClone(original)
clone.settings.theme = "light"
clone.scores.push(100)

console.log(original.settings.theme)  // "dark" — o'zgarmadi!
console.log(original.scores.length)   // 3 — o'zgarmadi!

// JSON yo'qotadigan narsalarni SAQLAYDI
const complex = {
  date: new Date("2024-01-15"),
  map: new Map([["key", "value"]]),
  set: new Set([1, 2, 3]),
  regex: /hello/gi,
  undef: undefined,
  nan: NaN,
  inf: Infinity,
  nested: {
    buffer: new ArrayBuffer(8),
  },
}

const deepCopy = structuredClone(complex)

deepCopy.date instanceof Date    // true (JSON da string bo'lardi!)
deepCopy.map instanceof Map      // true (JSON da {} bo'lardi!)
deepCopy.set instanceof Set      // true
deepCopy.regex instanceof RegExp // true
deepCopy.undef === undefined     // true (JSON da yo'qolardi!)
Number.isNaN(deepCopy.nan)       // true (JSON da null bo'lardi!)

// Circular reference — ISHLAYDI!
const obj = { name: "Ali" }
obj.self = obj
const cloned = structuredClone(obj)
cloned.self === cloned  // true (to'g'ri circular ref)
cloned.self === obj     // false (yangi object)

// ISHLMAYDIGAN holatlar
// structuredClone(() => {})     // ERROR: function
// structuredClone(document.body) // ERROR: DOM node
// structuredClone({ [Symbol()]: 1 }) // Symbol o'tkazib yuboriladi`,
      description: 'structuredClone Date, Map, Set, RegExp, undefined, NaN, circular ref — barchasini to\'g\'ri nusxalaydi. JSON trick dan ancha kuchli.',
    },
    {
      title: 'Taqqoslash va to\'g\'ri tanlash',
      language: 'js',
      code: `// 1. Shallow copy — oddiy holatlar uchun
const obj = { a: 1, b: { c: 2 } }
const shallow = { ...obj }
shallow.b.c = 99
console.log(obj.b.c)  // 99! (ichki object SHARE qilingan)

// 2. JSON trick — oddiy deep copy
const jsonClone = JSON.parse(JSON.stringify(obj))
// + Barcha brauzerlarda ishlaydi
// - Date, Map, Set, undefined yo'qoladi
// - Circular ref da xato

// 3. structuredClone — eng yaxshi deep copy
const structClone = structuredClone(obj)
// + Date, Map, Set, circular ref ishlaydi
// + Performance yaxshiroq
// - function, DOM, Symbol ishlamaydi

// QACHON NIMANI ISHLATISH:

// Oddiy object/array — spread operator
const newUser = { ...user, name: "Vali" }
const newArr = [...arr, newItem]

// Nested object/array — structuredClone
const deepCopy = structuredClone(complexState)

// API response/localStorage — JSON
const saved = JSON.stringify(data)
const loaded = JSON.parse(saved)

// Performance test
const bigData = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: "User " + i,
  nested: { score: Math.random() },
}))

console.time("JSON")
const copy1 = JSON.parse(JSON.stringify(bigData))
console.timeEnd("JSON")  // ~15-25ms

console.time("structuredClone")
const copy2 = structuredClone(bigData)
console.timeEnd("structuredClone")  // ~8-15ms (tezroq!)`,
      description: 'Shallow copy (spread) oddiy holatlar uchun, JSON trick universal lekin cheklov bor, structuredClone eng kuchli. Vaziyatga qarab tanlash kerak.',
    },
  ],
  interviewQA: [
    {
      question: 'JSON.stringify qanday cheklovlarga ega?',
      answer: 'JSON.stringify quyidagi qiymatlarni TO\'G\'RI serialization QILMAYDI: 1) undefined, function, Symbol — object ichida bo\'lsa o\'tkazib yuboriladi, massiv ichida null bo\'ladi. 2) Date — ISO stringga aylanadi (parse da Date QAYTMAYDI). 3) Map, Set, RegExp — bo\'sh object {} bo\'ladi. 4) NaN, Infinity — null bo\'ladi. 5) BigInt — TypeError tashlaydi. 6) Circular reference — TypeError. Yechimlar: replacer funksiya yoki toJSON metodi bilan maxsus ishlov berish, yoki structuredClone ishlatish.',
    },
    {
      question: 'structuredClone va JSON.parse(JSON.stringify()) farqi nima?',
      answer: 'structuredClone ANCHA KUCHLI: 1) Date objectini SAQLAYDI (JSON string qiladi), 2) Map, Set, RegExp ni SAQLAYDI (JSON yo\'qotadi), 3) undefined ni SAQLAYDI (JSON o\'tkazib yuboradi), 4) NaN, Infinity ni SAQLAYDI (JSON null qiladi), 5) Circular reference bilan ISHLAYDI (JSON xato beradi), 6) ArrayBuffer, Blob, Error ni qo\'llaydi, 7) TEZROQ ishlaydi (2x parse yo\'q). Ikkisi ham function va DOM node ni qo\'llamaydi. Zamonaviy brauzerlarda (2022+) structuredClone mavjud, eski brauzerlarga kerak bo\'lmasa — DOIM structuredClone ishlatish kerak.',
    },
    {
      question: 'Deep copy va shallow copy farqi nima? React state bilan qaysi biri kerak?',
      answer: 'Shallow copy (spread: {...obj}, [...arr]) faqat BIRINCHI daraja kalitlarni nusxalaydi — ichki objectlar REFERENCE sifatida qoladi. Deep copy (structuredClone, JSON trick) BARCHA darajalarni nusxalaydi — to\'liq mustaqil nusxa. React state bilan: oddiy (1 daraja) state uchun spread yetarli — setState({...user, name: "Ali"}). Lekin NESTED state uchun ehtiyot bo\'lish kerak — setState({...user, address: {...user.address, city: "Toshkent"}}). Juda chuqur nested bo\'lsa — structuredClone bilan to\'liq nusxa olib, keyin o\'zgartirish qulay. Yoki Immer kutubxonasi (RTK ichida bor) ishlatiladi.',
    },
    {
      question: 'JSON.parse xato bersa nima qilish kerak? Xavfsiz parse qanday yoziladi?',
      answer: 'JSON.parse noto\'g\'ri JSON string bilan SyntaxError TASHLAYDI. Shuning uchun DOIM try/catch ichida ishlatish kerak. Xavfsiz pattern: function safeParse(str, fallback = null) { try { return JSON.parse(str) } catch { return fallback } }. localStorage dan o\'qishda bu ayniqsa muhim — foydalanuvchi qo\'lda o\'zgartirgan bo\'lishi mumkin. API response uchun ham — noto\'g\'ri Content-Type yoki server xatosi bo\'lsa JSON bo\'lmagan string kelishi mumkin. fetch().json() ichida ham try/catch kerak.',
    },
    {
      question: 'JSON.stringify-ning replacer va space parametrlari qanday ishlaydi?',
      answer: 'replacer — IKKI turda bo\'ladi: 1) FUNKSIYA (key, value) => newValue — har bir key:value juftligi uchun chaqiriladi. undefined qaytarsa — o\'sha kalit o\'tkazib yuboriladi (parol, maxfiy ma\'lumotlarni yashirish uchun). 2) MASSIV ["name", "age"] — faqat ko\'rsatilgan kalitlar serializatsiya qilinadi. space — formatlash uchun: raqam bersa (2, 4) shu qadar bo\'shliq indent qo\'yadi, string bersa ("\\t") shu string indent sifatida ishlatiladi. Debug va logda chiroyli ko\'rinish uchun JSON.stringify(obj, null, 2) juda qulay.',
    },
    {
      question: 'toJSON metodi qanday ishlaydi va qachon ishlatiladi?',
      answer: 'JSON.stringify object-ni serialization qilayotganda, agar shu objectda toJSON() metodi bo\'lsa — avval uni CHAQIRADI va qaytgan qiymatni serializatsiya qiladi. Amaliy foydalanish: 1) Maxfiy maydonlarni yashirish — { toJSON() { return {name: this.name} } } (password ko\'rinmaydi). 2) Maxsus format — Date.prototype.toJSON ISO string qaytaradi. 3) Class instance-larni boshqarish — keraksiz ichki maydonlarni olib tashlash. 4) Circular reference muammosini hal qilish — toJSON ichida circular qismni o\'tkazib yuborish. Bu Strategy pattern-ga o\'xshash — object o\'zi qanday serializatsiya bo\'lishini boshqaradi.',
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'built-in-methods', topicId: 'array-methods', label: 'Array metodlari' },
    { techId: 'javascript', sectionId: 'built-in-methods', topicId: 'number-math', label: 'Number va Math' },
  ],
}
