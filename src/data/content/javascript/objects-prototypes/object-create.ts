import type { Topic } from '../../../types'

export const objectCreate: Topic = {
  id: 'object-create',
  title: 'Object.create & Object metodlari',
  importance: 2,
  status: 'to-learn',
  description: 'Object.create, Object.assign, Object.keys/values/entries va structuredClone',
  content: `JavaScript Object konstruktori ko'plab statik metodlarni taqdim etadi — object yaratish, nusxalash, tekshirish va o'zgartirish uchun. Bu metodlarni bilish — object-lar bilan professional darajada ishlash demak.

═══════════════════════════════════════
  OBJECT.CREATE(PROTO, DESCRIPTORS)
═══════════════════════════════════════

Yangi object yaratadi va uning [[Prototype]]-ini belgilaydi:

  const parent = { greet() { return 'Salom' } }
  const child = Object.create(parent)
  child.greet()  // 'Salom' — prototype-dan

Ikkinchi argument — property descriptors (ixtiyoriy):
  const obj = Object.create(parent, {
    name: { value: 'Ali', writable: true, enumerable: true },
    age:  { value: 25, enumerable: true },
  })

Maxsus holatlar:
  Object.create(null)            // prototype-siz "toza" object
  Object.create(Object.prototype) // {} bilan bir xil

MUHIM: Object.create — prototype-based meros yaratishning
eng to'g'ri va standart usuli. class extends ichida ham
aynan shu mexanizm ishlatiladi.

═══════════════════════════════════════
  OBJECT.ASSIGN — SHALLOW MERGE
═══════════════════════════════════════

Bir yoki bir nechta source object-dan target-ga nusxalaydi:

  Object.assign(target, source1, source2, ...)

1. Source property-larni target-ga YOZADI
2. Keyingi source oldingi source-ni QAYTA YOZADI
3. TARGET-ni o'zgartiradi va qaytaradi
4. SHALLOW — ichki objectlar referens bo'yicha

  const target = { a: 1 }
  Object.assign(target, { b: 2 }, { c: 3 })
  // target = { a: 1, b: 2, c: 3 } — TARGET O'ZGARDI

  // Yangi object yaratish uchun:
  const merged = Object.assign({}, obj1, obj2)

MUHIM: Spread { ...obj1, ...obj2 } deyarli bir xil ishlaydi,
lekin Object.assign setter-larni CHAQIRADI, spread esa yo'q.

═══════════════════════════════════════
  OBJECT.KEYS / VALUES / ENTRIES
═══════════════════════════════════════

Object-ni massivga aylantirish uchun 3 ta metod:

1. Object.keys(obj) — kalitlar massivi:
   Object.keys({ a: 1, b: 2 })  // ['a', 'b']

2. Object.values(obj) — qiymatlar massivi:
   Object.values({ a: 1, b: 2 })  // [1, 2]

3. Object.entries(obj) — [kalit, qiymat] juftliklari:
   Object.entries({ a: 1, b: 2 })  // [['a', 1], ['b', 2]]

Barchasi faqat OWN ENUMERABLE property-larni qaytaradi.
Prototype-dagi va enumerable: false property-lar KO'RINMAYDI.

═══════════════════════════════════════
  OBJECT.FROMENTRIES — TESKARI OPERATSIYA
═══════════════════════════════════════

entries → object ga aylantiradi:

  const entries = [['name', 'Ali'], ['age', 25]]
  Object.fromEntries(entries)  // { name: 'Ali', age: 25 }

Foydali pattern-lar:
  // Map → Object
  const map = new Map([['a', 1], ['b', 2]])
  Object.fromEntries(map)  // { a: 1, b: 2 }

  // Object transform (filter, map)
  const obj = { a: 1, b: 2, c: 3 }
  const filtered = Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v > 1)
  )
  // { b: 2, c: 3 }

═══════════════════════════════════════
  FREEZE / SEAL / ISFROZEN / ISSEALED
═══════════════════════════════════════

Object-ni himoya qilish metodlari:

  Object.freeze(obj)             // to'liq muzlatish
  Object.isFrozen(obj)           // true/false

  Object.seal(obj)               // yangi qo'shish/o'chirish taqiq
  Object.isSealed(obj)           // true/false

  Object.preventExtensions(obj)  // faqat yangi qo'shish taqiq
  Object.isExtensible(obj)       // true/false (teskari!)

MUHIM: isFrozen va isSealed haqiqiy holat emas, shart-lar tekshiriladi:
- Bo'sh frozen object isSealed ham hisoblanadi
- isFrozen object isExtensible emas

═══════════════════════════════════════
  STRUCTUREDCLONE — DEEP COPY
═══════════════════════════════════════

ES2022 da standart bo'lgan deep copy funksiyasi:

  const original = {
    name: 'Ali',
    date: new Date(),
    items: [1, 2, 3],
    nested: { a: { b: 1 } },
  }

  const deep = structuredClone(original)
  deep.nested.a.b = 99
  original.nested.a.b  // 1 — o'zgarmagan!

structuredClone qo'llab-quvvatlaydi:
  ✅ Object, Array, Date, Map, Set, RegExp
  ✅ ArrayBuffer, Blob, File, ImageData
  ✅ Circular reference (tsiklik bog'lanish)
  ❌ Function — DataCloneError
  ❌ DOM node — DataCloneError
  ❌ Symbol — DataCloneError

═══════════════════════════════════════
  BOSHQA FOYDALI METODLAR
═══════════════════════════════════════

  Object.is(a, b)           // === ga o'xshash, lekin:
                             // Object.is(NaN, NaN) = true
                             // Object.is(+0, -0) = false

  Object.getOwnPropertyNames(obj)  // BARCHA own property (non-enumerable ham)
  Object.getOwnPropertySymbols(obj) // Symbol kalitlar

  Object.getPrototypeOf(obj)   // [[Prototype]] olish
  Object.setPrototypeOf(obj, proto)  // [[Prototype]] o'rnatish (SEKIN!)`,
  codeExamples: [
    {
      title: 'Object.create — prototype bilan object yaratish',
      language: 'js',
      code: `// Oddiy prototype meros
const vehicle = {
  type: 'unknown',
  describe() { return \`\${this.type}: \${this.name}\` },
}

const car = Object.create(vehicle)
car.type = 'Avtomobil'
car.name = 'Spark'
console.log(car.describe())  // 'Avtomobil: Spark'

// Ikkinchi argument — property descriptors
const truck = Object.create(vehicle, {
  type: {
    value: 'Yuk mashinasi',
    writable: true,
    enumerable: true,
    configurable: true,
  },
  name: {
    value: 'Kamaz',
    writable: true,
    enumerable: true,
    configurable: true,
  },
  maxWeight: {
    value: 20000,
    writable: false,   // o'zgartirilmasin
    enumerable: true,
  },
})
console.log(truck.describe())   // 'Yuk mashinasi: Kamaz'
console.log(truck.maxWeight)    // 20000

// Object.create(null) — prototype-siz
const dict = Object.create(null)
dict['toString'] = 'test'  // xavfsiz — prototype-dagi toString yo'q
console.log(dict.toString)  // 'test' (string, function emas!)

// Meros zanjiri
const animal = { eats: true }
const rabbit = Object.create(animal, {
  jumps: { value: true, enumerable: true },
})
console.log(rabbit.eats)   // true (prototype-dan)
console.log(rabbit.jumps)  // true (o'z property)`,
      description: 'Object.create — prototype-ni aniq belgilash. Ikkinchi argument bilan property descriptor-lar berish mumkin. Object.create(null) — toza dictionary.',
    },
    {
      title: 'Object.assign — merge va nusxalash',
      language: 'js',
      code: `// Oddiy merge
const defaults = { theme: 'light', lang: 'uz', debug: false }
const userPrefs = { theme: 'dark', debug: true }

const config = Object.assign({}, defaults, userPrefs)
console.log(config)
// { theme: 'dark', lang: 'uz', debug: true }
// userPrefs keyingi — u yutadi

// TARGET o'zgaradi!
const target = { a: 1 }
const result = Object.assign(target, { b: 2 })
console.log(target === result)  // true — AYNI object
console.log(target)             // { a: 1, b: 2 }

// Spread vs Object.assign
const withSetter = {
  _name: 'Ali',
  set name(v) { this._name = v.toUpperCase() },
  get name() { return this._name },
}

// Object.assign — setter-ni CHAQIRADI
const target2 = Object.create(
  Object.getPrototypeOf(withSetter),
  Object.getOwnPropertyDescriptors(withSetter)
)
Object.assign(target2, { name: 'vali' })
console.log(target2._name)  // 'VALI' — setter ishladi

// Spread — setter-ni CHAQIRMAYDI (getter natijasini nusxalaydi)
const copy = { ...withSetter }
console.log(Object.getOwnPropertyDescriptor(copy, 'name'))
// { value: 'Ali', ... } — getter/setter YO'QOLDI

// SHALLOW copy muammosi
const original = { nested: { value: 42 } }
const shallow = Object.assign({}, original)
shallow.nested.value = 99
console.log(original.nested.value)  // 99 — O'ZGARDI!`,
      description: 'Object.assign target-ni o\'zgartiradi va qaytaradi. Spread-dan farqi: setter-larni chaqiradi. Ikkalasi ham SHALLOW copy.',
    },
    {
      title: 'Object.keys/values/entries/fromEntries',
      language: 'js',
      code: `const product = { name: 'Telefon', price: 5000, inStock: true }

// keys — kalitlar
console.log(Object.keys(product))
// ['name', 'price', 'inStock']

// values — qiymatlar
console.log(Object.values(product))
// ['Telefon', 5000, true]

// entries — juftliklar
console.log(Object.entries(product))
// [['name', 'Telefon'], ['price', 5000], ['inStock', true]]

// entries bilan iteratsiya
for (const [key, value] of Object.entries(product)) {
  console.log(\`\${key}: \${value}\`)
}

// fromEntries — teskari
const pairs = [['a', 1], ['b', 2], ['c', 3]]
console.log(Object.fromEntries(pairs))  // { a: 1, b: 2, c: 3 }

// Object transform — filter
const scores = { ali: 90, vali: 45, soli: 80, toli: 30 }
const passed = Object.fromEntries(
  Object.entries(scores).filter(([, score]) => score >= 50)
)
console.log(passed)  // { ali: 90, soli: 80 }

// Object transform — map (qiymatlarni o'zgartirish)
const doubled = Object.fromEntries(
  Object.entries(scores).map(([name, score]) => [name, score * 2])
)
console.log(doubled)  // { ali: 180, vali: 90, soli: 160, toli: 60 }

// Map <-> Object
const map = new Map(Object.entries(product))
console.log(map.get('name'))  // 'Telefon'

const backToObj = Object.fromEntries(map)
console.log(backToObj)  // { name: 'Telefon', price: 5000, inStock: true }

// URLSearchParams -> Object
const params = new URLSearchParams('page=1&limit=20&sort=name')
const paramsObj = Object.fromEntries(params)
console.log(paramsObj)  // { page: '1', limit: '20', sort: 'name' }`,
      description: 'entries + fromEntries = object transform pipeline. Object.fromEntries Map, URLSearchParams va har qanday iterable-dan object yaratadi.',
    },
    {
      title: 'structuredClone — deep copy',
      language: 'js',
      code: `// Deep copy — barcha darajalar nusxalanadi
const original = {
  name: 'Ali',
  date: new Date('2025-01-01'),
  scores: [90, 85, 92],
  address: {
    city: 'Toshkent',
    coords: { lat: 41.3, lng: 69.3 },
  },
  tags: new Set(['frontend', 'react']),
  meta: new Map([['version', 1]]),
}

const deep = structuredClone(original)

// Tekshirish — to'liq mustaqil
deep.scores.push(100)
deep.address.coords.lat = 0
deep.tags.add('vue')
deep.meta.set('version', 2)

console.log(original.scores)          // [90, 85, 92] — o'zgarmagan
console.log(original.address.coords)  // { lat: 41.3, lng: 69.3 }
console.log(original.tags.size)       // 2 — o'zgarmagan
console.log(original.meta.get('version'))  // 1

// Date to'g'ri nusxalanadi
console.log(deep.date instanceof Date)  // true
console.log(deep.date.getTime() === original.date.getTime())  // true
console.log(deep.date === original.date)  // false — alohida instance

// Circular reference ham ishlaydi!
const obj = { name: 'circular' }
obj.self = obj  // o'ziga referens
const clone = structuredClone(obj)
console.log(clone.self === clone)  // true — yangi circular
console.log(clone.self === obj)    // false — alohida

// QOLLAB-QUVVATLANMAYDIGAN turlar
// structuredClone({ fn: () => {} })  // DataCloneError!
// structuredClone({ sym: Symbol() }) // DataCloneError!

// JSON trick bilan solishtirish
const withDate = { date: new Date(), count: 0, empty: '' }
const jsonCopy = JSON.parse(JSON.stringify(withDate))
console.log(jsonCopy.date instanceof Date)  // false — STRING!
console.log(typeof jsonCopy.date)           // 'string'

const cloneCopy = structuredClone(withDate)
console.log(cloneCopy.date instanceof Date)  // true — Date!`,
      description: 'structuredClone — Date, Map, Set, circular reference-ni to\'g\'ri nusxalaydi. JSON trick esa Date-ni string-ga, Map/Set-ni {} ga aylantiradi.',
    },
    {
      title: 'Object.is va boshqa foydali metodlar',
      language: 'js',
      code: `// Object.is — qat'iy taqqoslash (=== dan farqi bor)
console.log(Object.is(1, 1))        // true
console.log(Object.is('a', 'a'))    // true

// === dan FARQI:
console.log(NaN === NaN)             // false
console.log(Object.is(NaN, NaN))     // true — TO'G'RI!

console.log(+0 === -0)               // true
console.log(Object.is(+0, -0))       // false — FARQLAYDI!

// React ham Object.is ishlatadi (state taqqoslash uchun)

// getOwnPropertyNames — non-enumerable ham
const obj = {}
Object.defineProperty(obj, 'hidden', { value: 42, enumerable: false })
obj.visible = 'salom'

console.log(Object.keys(obj))               // ['visible']
console.log(Object.getOwnPropertyNames(obj)) // ['hidden', 'visible']

// Symbol kalitlar
const sym = Symbol('id')
const user = { [sym]: 1, name: 'Ali' }
console.log(Object.keys(user))                  // ['name']
console.log(Object.getOwnPropertySymbols(user))  // [Symbol(id)]

// Reflect.ownKeys — HAMMASI (string + symbol)
console.log(Reflect.ownKeys(user))  // ['name', Symbol(id)]

// Object.is React-da
// React setState-da Object.is bilan taqqoslaydi:
// setState(sameValue) -> Object.is(old, new) = true -> render YO'Q
// setState(newValue)  -> Object.is(old, new) = false -> RENDER`,
      description: 'Object.is — NaN va +0/-0 ni to\'g\'ri taqqoslaydi. React ham state o\'zgarganini aniqlash uchun Object.is ishlatadi.',
    },
  ],
  interviewQA: [
    {
      question: 'Object.create() va {} farqi nima?',
      answer: 'Object literal {} — prototype-i Object.prototype bo\'lgan oddiy object yaratadi. Object.create(proto) — prototype-ni ANIQ belgilash imkonini beradi. Object.create(null) — prototype UMUMAN yo\'q (toza dictionary). Object.create(someObj) — meros zanjirini qo\'lda yaratish uchun. class extends ichida ham Object.create ishlatiladi. {} — qisqa va qulay, Object.create — aniq kontrol beradi.',
    },
    {
      question: 'Object.assign va spread (...) farqi nima?',
      answer: 'Ikkala usul ham shallow copy/merge qiladi. Farqlar: 1) Object.assign TARGET-ni O\'ZGARTIRADI va qaytaradi. Spread har doim YANGI object yaratadi. 2) Object.assign setter-larni CHAQIRADI (agar target-da setter bo\'lsa). Spread setter-ni chaqirmaydi — getter natijasini oddiy value sifatida yozadi. 3) Object.assign Symbol property-larni ham nusxalaydi. Amalda spread ko\'proq ishlatiladi, Object.assign esa setter muhim bo\'lganda.',
    },
    {
      question: 'Object.entries va Object.fromEntries qanday ishlatiladi?',
      answer: 'Object.entries(obj) — object-ni [key, value] juftliklar massiviga aylantiradi. Object.fromEntries(arr) — teskari, massivdan object yaratadi. Birgalikda object transform pipeline hosil qiladi: Object.fromEntries(Object.entries(obj).filter(...).map(...)). Bundan tashqari fromEntries Map-dan, URLSearchParams-dan va har qanday iterable-dan object yaratishi mumkin.',
    },
    {
      question: 'structuredClone nima va JSON.parse(JSON.stringify()) dan farqi?',
      answer: 'structuredClone — ES2022 standart deep copy funksiyasi. JSON trick-dan farqi: 1) Date — Date bo\'lib qoladi (JSON-da string-ga aylanadi). 2) Map, Set, RegExp — to\'g\'ri nusxalanadi (JSON-da yo\'qoladi). 3) Circular reference — ishlaydi (JSON-da Error). 4) undefined — saqlanadi (JSON-da yo\'qoladi). structuredClone-ning cheklovi: Function va Symbol nusxalanmaydi (DataCloneError beradi).',
    },
    {
      question: 'Object.is() va === farqi nima? React bunda nima uchun muhim?',
      answer: 'Object.is() va === deyarli bir xil, lekin 2 ta farq bor: 1) NaN === NaN = false, Object.is(NaN, NaN) = true. 2) +0 === -0 = true, Object.is(+0, -0) = false. React AYNAN Object.is() ishlatadi state o\'zgarganini tekshirish uchun. setState(newValue) chaqirilganda React Object.is(oldState, newValue) bilan taqqoslaydi — agar true bo\'lsa, re-render BO\'LMAYDI. Shuning uchun immutable update muhim.',
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'object-basics', label: 'Object Basics' },
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'destructuring-spread', label: 'Destructuring & Spread' },
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'property-descriptors', label: 'Property Descriptors' },
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'prototype-chain', label: 'Prototype Chain' },
  ],
}
