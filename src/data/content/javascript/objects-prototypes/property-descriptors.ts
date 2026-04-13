import type { Topic } from '../../../types'

export const propertyDescriptors: Topic = {
  id: 'property-descriptors',
  title: 'Property Descriptors',
  importance: 2,
  status: 'to-learn',
  description: 'Object.defineProperty, getter/setter va Object.freeze/seal',
  content: `Har bir object property-si ortida "descriptor" (ta'rif) yashiringan. Bu descriptor property-ning xususiyatlarini boshqaradi — yozish mumkinmi, sanash mumkinmi, o'chirish mumkinmi. Buni tushunish — JavaScript object tizimini chuqur bilish demak.

═══════════════════════════════════════
  PROPERTY DESCRIPTOR TURLARI
═══════════════════════════════════════

Har bir property ikki turdagi descriptor-ga ega bo'lishi mumkin:

1. DATA DESCRIPTOR — qiymat saqlaydigan oddiy property:
   - value — property qiymati
   - writable — qiymatni o'zgartirish mumkinmi (true/false)
   - enumerable — for...in, Object.keys da ko'rinadimi
   - configurable — descriptor-ni o'zgartirish/o'chirish mumkinmi

2. ACCESSOR DESCRIPTOR — getter/setter bilan ishlaydigan:
   - get — qiymatni O'QISH funksiyasi
   - set — qiymatni YOZISH funksiyasi
   - enumerable — sanash mumkinmi
   - configurable — o'zgartirish mumkinmi

MUHIM: value/writable va get/set BIRGA BO'LISHI MUMKIN EMAS!
Yoki data descriptor, yoki accessor descriptor — ikkalasi emas.

═══════════════════════════════════════
  OBJECT.DEFINEPROPERTY
═══════════════════════════════════════

Bitta property-ni aniq descriptor bilan yaratish/o'zgartirish:

  Object.defineProperty(obj, 'key', {
    value: 42,
    writable: false,       // o'zgartirish MUMKIN EMAS
    enumerable: true,      // for...in da ko'rinadi
    configurable: false,   // o'chirib/qayta sozlab BO'LMAYDI
  })

MUHIM: defineProperty bilan qo'shilgan property-larda
default qiymatlar BARCHASI false:
  writable: false
  enumerable: false
  configurable: false

Oddiy obj.key = value bilan qo'shilganda esa barchasi true.

═══════════════════════════════════════
  OBJECT.GETOWNPROPERTYDESCRIPTOR
═══════════════════════════════════════

Property descriptor-ni o'qish:

  const desc = Object.getOwnPropertyDescriptor(obj, 'key')
  // { value: 42, writable: false, enumerable: true, configurable: false }

Barcha property descriptor-larni olish:
  Object.getOwnPropertyDescriptors(obj)

═══════════════════════════════════════
  GETTER VA SETTER
═══════════════════════════════════════

Accessor property — o'qish/yozishda funksiya chaqiriladi:

  const user = {
    firstName: 'Ali',
    lastName: 'Valiyev',
    get fullName() {
      return this.firstName + ' ' + this.lastName
    },
    set fullName(value) {
      const [first, last] = value.split(' ')
      this.firstName = first
      this.lastName = last
    },
  }

  user.fullName           // 'Ali Valiyev' — getter
  user.fullName = 'Vali Karimov'  // setter
  user.firstName          // 'Vali'

Getter/setter qachon foydali:
1. Computed (hisoblangan) qiymatlar
2. Validatsiya — set da qiymatni tekshirish
3. Lazy loading — get da kerakli paytda hisoblash
4. Private property pattern — ichki qiymatni himoyalash

═══════════════════════════════════════
  OBJECT.FREEZE
═══════════════════════════════════════

Object-ni TO'LIQ muzlatish — hech narsa o'zgarmaydi:

  const config = Object.freeze({ theme: 'dark', lang: 'uz' })
  config.theme = 'light'    // XATOLIK (strict mode), yoki jimgina e'tiborsiz
  config.newProp = 'value'  // XATOLIK
  delete config.theme       // XATOLIK

  Object.isFrozen(config)   // true

MUHIM: freeze SHALLOW — ichki objectlarni muzlatMAYDI!
  const obj = Object.freeze({ nested: { a: 1 } })
  obj.nested.a = 99  // ISHLAYDI! nested muzlatilmagan

═══════════════════════════════════════
  OBJECT.SEAL
═══════════════════════════════════════

Mavjud property-larni O'ZGARTIRISH mumkin, lekin:
- Yangi property QO'SHIB BO'LMAYDI
- Mavjud property-ni O'CHIRIB BO'LMAYDI

  const user = Object.seal({ name: 'Ali', age: 25 })
  user.name = 'Vali'      // OK — qiymat o'zgartirish mumkin
  user.email = 'a@b.com'  // XATOLIK — yangi property
  delete user.name         // XATOLIK — o'chirish

  Object.isSealed(user)    // true

═══════════════════════════════════════
  OBJECT.PREVENTEXTENSIONS
═══════════════════════════════════════

Eng yengil himoya — faqat yangi property qo'shishni taqiqlaydi:

  const obj = Object.preventExtensions({ a: 1 })
  obj.a = 2       // OK
  obj.b = 3       // XATOLIK — yangi property
  delete obj.a    // OK — o'chirish mumkin

  Object.isExtensible(obj)  // false

═══════════════════════════════════════
  SOLISHTIRISH JADVALI
═══════════════════════════════════════

                    | Yangi qo'shish | O'chirish | Qiymat o'zg. |
  preventExtensions |      ❌        |    ✅     |     ✅       |
  seal              |      ❌        |    ❌     |     ✅       |
  freeze            |      ❌        |    ❌     |     ❌       |

Barchasi SHALLOW — ichki objectlarga ta'sir QILMAYDI.`,
  codeExamples: [
    {
      title: 'Object.defineProperty — writable, enumerable, configurable',
      language: 'js',
      code: `const user = {}

// Oddiy property qo'shish
user.name = 'Ali'
console.log(Object.getOwnPropertyDescriptor(user, 'name'))
// { value: 'Ali', writable: true, enumerable: true, configurable: true }

// defineProperty bilan — default-lar false!
Object.defineProperty(user, 'id', {
  value: 1,
  writable: false,       // o'zgartirish mumkin emas
  enumerable: false,     // for...in da ko'rinmaydi
  configurable: false,   // qayta sozlab bo'lmaydi
})

user.id = 999            // strict mode-da TypeError
console.log(user.id)     // 1 — o'zgarmagan

console.log(Object.keys(user))  // ['name'] — id ko'rinmaydi!
console.log(user.id)             // 1 — lekin murojaat qilsa ko'rinadi

// Bir nechta property birdan
Object.defineProperties(user, {
  age: { value: 25, writable: true, enumerable: true },
  role: { value: 'admin', enumerable: true },
})

console.log(user)  // { name: 'Ali', age: 25, role: 'admin' }
// id ko'rinmaydi — enumerable: false

// configurable: false — qayta sozlab bo'lmaydi
// Object.defineProperty(user, 'id', { writable: true }) // TypeError!`,
      description: 'defineProperty default-lari false. Oddiy obj.key = value esa default true beradi. Bu farqni bilish muhim.',
    },
    {
      title: 'Getter va Setter — accessor property',
      language: 'js',
      code: `// Object literal-da getter/setter
const user = {
  _balance: 1000,  // konvensiya: _ = "private"

  get balance() {
    console.log('Balance o\\'qildi')
    return this._balance
  },

  set balance(value) {
    if (value < 0) {
      throw new Error('Balans manfiy bo\\'lishi mumkin emas!')
    }
    console.log(\`Balans: \${this._balance} -> \${value}\`)
    this._balance = value
  },
}

console.log(user.balance)    // "Balance o'qildi", 1000
user.balance = 500           // "Balans: 1000 -> 500"
// user.balance = -100       // Error!

// defineProperty bilan getter/setter
const circle = { _radius: 5 }

Object.defineProperty(circle, 'area', {
  get() {
    return Math.PI * this._radius ** 2
  },
  enumerable: true,
  configurable: true,
})

Object.defineProperty(circle, 'radius', {
  get() { return this._radius },
  set(value) {
    if (typeof value !== 'number' || value <= 0) {
      throw new TypeError('Radius musbat son bo\\'lishi kerak')
    }
    this._radius = value
  },
  enumerable: true,
  configurable: true,
})

console.log(circle.area)     // 78.54...
circle.radius = 10
console.log(circle.area)     // 314.16...

// Descriptor-ni ko'rish
console.log(Object.getOwnPropertyDescriptor(circle, 'area'))
// { get: [Function], set: undefined, enumerable: true, configurable: true }`,
      description: 'Getter — property o\'qilganda funksiya chaqiriladi. Setter — yozilganda validatsiya qilish imkonini beradi. Bu "computed property" va "encapsulation" uchun ishlatiladi.',
    },
    {
      title: 'Object.freeze va Object.seal',
      language: 'js',
      code: `// === Object.freeze ===
const config = Object.freeze({
  API_URL: 'https://api.example.com',
  TIMEOUT: 5000,
  nested: { retries: 3 },
})

// Hech narsa o'zgarmaydi
config.API_URL = 'http://other.com'  // jimgina e'tiborsiz (strict: TypeError)
config.NEW_KEY = 'value'              // yangi property qo'shilmaydi
delete config.TIMEOUT                 // o'chirilmaydi

console.log(config.API_URL)  // 'https://api.example.com'
console.log(Object.isFrozen(config))  // true

// LEKIN: freeze SHALLOW!
config.nested.retries = 10  // ISHLAYDI!
console.log(config.nested.retries)  // 10

// Deep freeze — recursive
function deepFreeze(obj) {
  Object.freeze(obj)
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Object.isFrozen(obj[key])) {
      deepFreeze(obj[key])
    }
  })
  return obj
}

const deepConfig = deepFreeze({ a: { b: { c: 1 } } })
deepConfig.a.b.c = 99
console.log(deepConfig.a.b.c)  // 1 — o'zgarmagan

// === Object.seal ===
const user = Object.seal({ name: 'Ali', age: 25 })
user.name = 'Vali'       // ✅ OK
user.email = 'a@b.com'   // ❌ yangi property qo'shilmaydi
delete user.name          // ❌ o'chirilmaydi
console.log(Object.isSealed(user))  // true

// === Object.preventExtensions ===
const obj = Object.preventExtensions({ x: 1 })
obj.x = 2       // ✅ OK
delete obj.x     // ✅ OK
obj.y = 3        // ❌ yangi property`,
      description: 'freeze > seal > preventExtensions — himoya darajasi. Barchasi SHALLOW, ichki objectlarga ta\'sir qilmaydi.',
    },
    {
      title: 'Property descriptor-larni tekshirish',
      language: 'js',
      code: `const person = { name: 'Ali' }

// Bitta property descriptor
const desc = Object.getOwnPropertyDescriptor(person, 'name')
console.log(desc)
// {
//   value: 'Ali',
//   writable: true,
//   enumerable: true,
//   configurable: true
// }

// Barcha descriptor-lar
Object.defineProperty(person, 'id', {
  value: 1,
  enumerable: false,
})

const allDescs = Object.getOwnPropertyDescriptors(person)
console.log(allDescs)
// {
//   name: { value: 'Ali', writable: true, enumerable: true, configurable: true },
//   id: { value: 1, writable: false, enumerable: false, configurable: false }
// }

// Foydalanish: to'liq nusxa olish (getter/setter bilan)
const original = {
  _value: 42,
  get value() { return this._value },
  set value(v) { this._value = v },
}

// Spread getter-ni CHAQIRADI (natija: oddiy property)
const badCopy = { ...original }
console.log(Object.getOwnPropertyDescriptor(badCopy, 'value'))
// { value: 42, writable: true, ... } — getter YO'QOLGAN!

// To'g'ri nusxa — descriptor-lar bilan
const goodCopy = Object.defineProperties(
  {},
  Object.getOwnPropertyDescriptors(original)
)
console.log(Object.getOwnPropertyDescriptor(goodCopy, 'value'))
// { get: [Function], set: [Function], ... } — getter SAQLANGAN!`,
      description: 'Spread operator getter/setter-ni yo\'qotadi. Agar accessor property-larni saqlash kerak bo\'lsa, getOwnPropertyDescriptors + defineProperties ishlatish kerak.',
    },
  ],
  interviewQA: [
    {
      question: 'Object.defineProperty bilan oddiy assignment (obj.key = value) farqi nima?',
      answer: 'Oddiy assignment (obj.key = value) property-ni writable: true, enumerable: true, configurable: true bilan yaratadi. Object.defineProperty esa default-lari BARCHASI false. Bu degani defineProperty bilan qo\'shilgan property o\'zgartirib bo\'lmaydi, for...in da ko\'rinmaydi, o\'chirib bo\'lmaydi — agar aniq true qilinmasa. defineProperty aniq kontrol beradi, oddiy assignment esa "ochiq" property yaratadi.',
    },
    {
      question: 'Getter va setter nima uchun kerak?',
      answer: 'Getter — property o\'qilganda avtomatik funksiya chaqiradi (computed/derived qiymatlar uchun). Setter — yozilganda validatsiya yoki side-effect qilish imkonini beradi. Foydalanish: 1) Validatsiya — set da qiymatni tekshirish. 2) Computed property — get da boshqa maydonlardan hisoblash (fullName = first + last). 3) Lazy evaluation — get da kerak bo\'lgandagina hisoblash. 4) Encapsulation — ichki _private maydonni himoya qilish.',
    },
    {
      question: 'Object.freeze va Object.seal farqi nima?',
      answer: 'Object.freeze — to\'liq muzlatish: yangi property qo\'shib bo\'lmaydi, mavjudni o\'chirib bo\'lmaydi, qiymatni o\'zgartirib bo\'lmaydi. Object.seal — qisman: yangi qo\'shib va o\'chirib bo\'lmaydi, LEKIN mavjud property qiymatini o\'zgartirish MUMKIN. Object.preventExtensions — eng yengil: faqat yangi qo\'shish taqiqlangan. Barchasi SHALLOW — ichki objectlarga ta\'sir qilmaydi.',
    },
    {
      question: 'Nima uchun Object.freeze shallow? Deep freeze qanday qilinadi?',
      answer: 'Object.freeze faqat birinchi daraja property-larni muzlatadi. Ichki objectlar hali ham o\'zgartirilishi mumkin — chunki freeze property VALUE-ni muzlatadi, nested object-ning referens-ni emas, uning ichini. Deep freeze uchun recursive funksiya yozish kerak: Object.keys bilan barcha property-larni aylanib, har bir nested object-ni ham freeze qilish. Yoki immutable.js/immer kabi kutubxonalar ishlatish mumkin.',
    },
    {
      question: 'Spread operatori getter/setter-ni nima uchun yo\'qotadi?',
      answer: 'Spread ({...obj}) property-ni O\'QIYDI — ya\'ni getter-ni CHAQIRADI va natija QIYMATNI yangi object-ga yozadi. Shuning uchun yangi object-da getter yo\'q, faqat oddiy value bor. Getter/setter-ni saqlash uchun Object.getOwnPropertyDescriptors(original) + Object.defineProperties({}, descriptors) ishlatish kerak — bu descriptor-larni TO\'G\'RIDAN-TO\'G\'RI nusxalaydi.',
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'object-basics', label: 'Object Basics' },
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'object-create', label: 'Object.create & Object metodlari' },
    { techId: 'javascript', sectionId: 'objects-prototypes', topicId: 'prototype-chain', label: 'Prototype Chain' },
  ],
}
